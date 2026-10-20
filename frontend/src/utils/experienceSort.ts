import type { ExperienceData, ExperienceDatePoint } from '../types';

const MONTHS: Record<string, number> = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

const PRESENT_PATTERN = /present|now|sekarang|current/i;

/** Parses one side of a date range like "Sept 2025" or "Present". */
const parsePoint = (raw: string): ExperienceDatePoint | 'present' | null => {
  const text = raw.trim();
  if (!text) return null;
  if (PRESENT_PATTERN.test(text)) return 'present';

  const match = text.match(/([A-Za-z]+)\.?\s+(\d{4})/);
  if (!match) return null;

  const month = MONTHS[match[1].toLowerCase()];
  const year = Number(match[2]);
  if (!month || !Number.isFinite(year)) return null;

  return { year, month };
};

/** Compares two points; larger (more recent) sorts first. */
const comparePoints = (a: ExperienceDatePoint, b: ExperienceDatePoint) =>
  a.year !== b.year ? b.year - a.year : b.month - a.month;

interface Resolved {
  ongoing: boolean;
  start: ExperienceDatePoint | null;
  end: ExperienceDatePoint | null;
  failed: boolean;
}

const resolve = (exp: ExperienceData): Resolved => {
  if (exp.startDate && (exp.endDate === null || exp.endDate)) {
    return {
      ongoing: exp.endDate === null,
      start: exp.startDate,
      end: exp.endDate ?? null,
      failed: false,
    };
  }

  const [rawStart, rawEnd] = exp.year.split(/[–-]/).map((part) => part.trim());
  const start = parsePoint(rawStart ?? '');
  const end = parsePoint(rawEnd ?? '');

  // A single "Present" on either side means the role is ongoing.
  const ongoing = start === 'present' || end === 'present';
  const startPoint = start === 'present' ? null : start;
  const endPoint = end === 'present' ? null : end;

  const failed = !ongoing && (!startPoint || !endPoint);
  if (failed && import.meta.env.DEV) {
    console.warn(`[Experience] Could not parse date range: "${exp.year}" (id ${exp.id})`);
  }

  return {
    ongoing,
    start: startPoint,
    end: endPoint,
    failed,
  };
};

/**
 * Returns a sorted copy of the experiences (most recent first):
 *  1. ongoing ("Present") roles first, most recently started on top,
 *  2. then by end date descending,
 *  3. then by start date descending,
 *  4. stable fallback to the original order.
 * Unparseable entries sink to the end (stable among themselves).
 */
export const sortExperiencesByDate = (items: ExperienceData[]): ExperienceData[] => {
  return items
    .map((exp) => ({ exp, ...resolve(exp) }))
    .sort((a, b) => {
      if (a.failed !== b.failed) return a.failed ? 1 : -1;

      if (a.ongoing !== b.ongoing) return a.ongoing ? -1 : 1;

      if (a.ongoing && b.ongoing) {
        if (a.start && b.start) return comparePoints(a.start, b.start);
        return 0;
      }

      if (a.end && b.end) {
        const byEnd = comparePoints(a.end, b.end);
        if (byEnd !== 0) return byEnd;
      } else if (a.end || b.end) {
        return a.end ? -1 : 1;
      }

      if (a.start && b.start) return comparePoints(a.start, b.start);
      return 0;
    })
    .map((entry) => entry.exp);
};
