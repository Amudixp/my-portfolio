import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { Tooltip } from '@heroui/react';
import { experiences, organizations } from '../../data/experience';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import type { ExperienceData, OrganizationData } from '../../types';

interface CardLayout {
  x: number;
  y: number;
}

interface LeaderLine {
  expId: number;
  orgId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface Box {
  cx: number;
  cy: number;
  w: number;
  h: number;
}

interface LayoutCard extends Box {
  id: number;
  orgId: string;
  baseCx: number;
  baseCy: number;
  movable: boolean;
}

const LAYERS = {
  line: 2,
  logo: 3,
  label: 4,
  card: 5,
  openCard: 20,
} as const;

const DESIGN_H = 900;
const CARD_WIDTH = 300;
const GAP = 24;
const SIDE_MARGIN = 24;
const TOP_MARGIN = 24;
const BOTTOM_MARGIN = 48;
const GRACE_MS = 170;
const TRANSITION_MS = 300;

const CARD_LAYOUT: CardLayout[] = [
  { x: 20, y: 78 },
  { x: 20, y: 26 },
  { x: 80, y: 26 },
  { x: 20, y: 52 },
  { x: 80, y: 52 },
  { x: 80, y: 78 },
];

const MIN_DOT_ANGLE = (22 * Math.PI) / 180;
const BOTTOM_FROM = (60 * Math.PI) / 180;
const BOTTOM_TO = (120 * Math.PI) / 180;

const rectEdgePoint = (
  cx: number,
  cy: number,
  w: number,
  h: number,
  tx: number,
  ty: number
) => {
  const dx = tx - cx;
  const dy = ty - cy;
  const hw = w / 2;
  const hh = h / 2;
  const sx = dx !== 0 ? hw / Math.abs(dx) : Number.POSITIVE_INFINITY;
  const sy = dy !== 0 ? hh / Math.abs(dy) : Number.POSITIVE_INFINITY;
  const s = Math.min(sx, sy);
  return { x: cx + dx * s, y: cy + dy * s };
};

const cardStyle = (
  isOpen: boolean,
  active: boolean,
  dimmed: boolean,
  prefersReduced: boolean
): CSSProperties => ({
  width: '100%',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  background: active ? 'var(--surface-glass-dark)' : 'var(--surface-glass)',
  backdropFilter: 'blur(14px)',
  WebkitBackdropFilter: 'blur(14px)',
  border: isOpen
    ? '1px solid rgba(226, 250, 106, 0.55)'
    : active
      ? '1px solid rgba(226, 250, 106, 0.30)'
      : '1px solid rgba(255, 255, 255, 0.22)',
  borderRadius: '22px',
  padding: '22px 24px',
  color: 'var(--text-on-dark)',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  boxShadow: active
    ? '0 18px 40px rgba(10, 16, 4, 0.35)'
    : '0 14px 32px rgba(10, 16, 4, 0.22)',
  transition: prefersReduced
    ? 'none'
    : 'background-color 250ms ease, border-color 250ms ease, box-shadow 250ms ease, opacity 250ms ease',
  opacity: dimmed ? 0.55 : 1,
});

const DatePill = ({ children }: { children: ReactNode }) => (
  <span
    style={{
      display: 'inline-block',
      padding: '5px 12px',
      borderRadius: '999px',
      background: 'rgba(226, 250, 106, 0.14)',
      border: '1px solid rgba(226, 250, 106, 0.35)',
      color: '#E2FA6A',
      fontSize: '12px',
      fontWeight: 500,
      letterSpacing: '0.2px',
    }}
  >
    {children}
  </span>
);

interface CardProps {
  exp: ExperienceData;
  org?: OrganizationData;
  index: number;
  isOpen: boolean;
  active: boolean;
  dimmed: boolean;
  entered: boolean;
  settled: boolean;
  prefersReduced: boolean;
  showLogo: boolean;
  onToggle: () => void;
  onActivate: () => void;
  onDeactivate: () => void;
}

const ExperienceCard = ({
  exp,
  org,
  index,
  isOpen,
  active,
  dimmed,
  entered,
  settled,
  prefersReduced,
  showLogo,
  onToggle,
  onActivate,
  onDeactivate,
}: CardProps) => {
  return (
    <motion.button
      type="button"
      className="experience-card"
      onClick={onToggle}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={onDeactivate}
      aria-expanded={isOpen}
      aria-controls={`experience-details-${exp.id}`}
      initial={prefersReduced ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: !entered ? 0 : dimmed ? 0.55 : 1, y: !entered ? 18 : 0 }}
      transition={{
        duration: prefersReduced ? 0 : 0.6,
        delay: prefersReduced || settled ? 0 : 0.5 + index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={cardStyle(isOpen, active, dimmed, prefersReduced)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <div>
          {showLogo && org && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'var(--bg-page-light)',
                padding: '7px',
                marginBottom: '12px',
              }}
            >
              <img
                src={org.logo}
                alt={org.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          )}
          <h3
            style={{
              margin: 0,
              fontSize: '21px',
              fontWeight: 500,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.02em',
              lineHeight: 1.22,
              color: '#FFFFFF',
            }}
          >
            {exp.title}
          </h3>
          <p
            style={{
              margin: '8px 0 0 0',
              fontSize: '14px',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.74)',
              lineHeight: 1.4,
            }}
          >
            {exp.organization}
          </p>
          <span style={{ display: 'inline-block', marginTop: '12px' }}>
            <DatePill>{exp.year}</DatePill>
          </span>
        </div>

        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isOpen ? 'var(--accent-lime)' : 'rgba(255, 255, 255, 0.14)',
            color: isOpen ? '#1C2A07' : '#E2FA6A',
            transition: prefersReduced ? 'none' : 'background-color 250ms ease, color 250ms ease',
          }}
        >
          {isOpen ? <X size={16} strokeWidth={2.5} /> : <Plus size={16} strokeWidth={2.5} />}
        </span>
      </div>

      <motion.div
        id={`experience-details-${exp.id}`}
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
          marginTop: isOpen ? 4 : 0,
        }}
        transition={{ duration: prefersReduced ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.7, color: 'rgba(255, 255, 255, 0.82)' }}>
          {exp.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
          {exp.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: '5px 12px',
                borderRadius: '999px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 400,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.button>
  );
};

const separate = (a: LayoutCard, b: LayoutCard, gap: number) => {
  const overlapX = (a.w + b.w) / 2 + gap - Math.abs(a.cx - b.cx);
  const overlapY = (a.h + b.h) / 2 + gap - Math.abs(a.cy - b.cy);
  if (overlapX <= 0 || overlapY <= 0) return false;

  if (overlapX <= overlapY) {
    const dir = b.cx >= a.cx ? 1 : -1;
    if (a.movable && b.movable) {
      a.cx -= (dir * overlapX) / 2;
      b.cx += (dir * overlapX) / 2;
    } else if (b.movable) {
      b.cx += dir * overlapX;
    } else if (a.movable) {
      a.cx -= dir * overlapX;
    }
  } else {
    const dir = b.cy >= a.cy ? 1 : -1;
    if (a.movable && b.movable) {
      a.cy -= (dir * overlapY) / 2;
      b.cy += (dir * overlapY) / 2;
    } else if (b.movable) {
      b.cy += dir * overlapY;
    } else if (a.movable) {
      a.cy -= dir * overlapY;
    }
  }
  return true;
};

const pushFromObstacle = (c: LayoutCard, o: Box, gap: number) => {
  if (!c.movable) return false;
  const overlapX = (c.w + o.w) / 2 + gap - Math.abs(c.cx - o.cx);
  const overlapY = (c.h + o.h) / 2 + gap - Math.abs(c.cy - o.cy);
  if (overlapX <= 0 || overlapY <= 0) return false;

  if (overlapX <= overlapY) {
    const dir = c.cx >= o.cx ? 1 : -1;
    c.cx += dir * overlapX;
  } else {
    const dir = c.cy >= o.cy ? 1 : -1;
    c.cy += dir * overlapY;
  }
  return true;
};

export const Experience = () => {
  const isSmallScreen = useMediaQuery('(max-width: 767px)');
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const prefersReduced = useReducedMotion() ?? false;

  const orgById = useMemo(() => new Map(organizations.map((org) => [org.id, org])), []);

  const [openId, setOpenId] = useState<number | null>(null);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [offsets, setOffsets] = useState<Record<number, { x: number; y: number }>>({});
  const [lines, setLines] = useState<LeaderLine[]>([]);
  const [cardSizes, setCardSizes] = useState<Record<number, { w: number; h: number }>>({});
  const [layoutHeight, setLayoutHeight] = useState(DESIGN_H);
  const [containerWidth, setContainerWidth] = useState(1200);
  const [settled, setSettled] = useState(prefersReduced);
  const [measureVersion, setMeasureVersion] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const logoRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const openIdRef = useRef<number | null>(null);
  const graceRef = useRef<number | null>(null);

  const entered = useInView(sectionRef, { once: true, margin: '-120px' });
  const openExp = experiences.find((exp) => exp.id === openId) ?? null;
  const effectiveOrg = activeOrgId ?? openExp?.organizationId ?? null;

  useEffect(() => {
    openIdRef.current = openId;
  }, [openId]);

  useEffect(() => {
    if (!entered || settled) return;
    const timer = window.setTimeout(() => setSettled(true), prefersReduced ? 0 : 1400);
    return () => window.clearTimeout(timer);
  }, [entered, prefersReduced, settled]);

  const clearGrace = useCallback(() => {
    if (graceRef.current !== null) {
      window.clearTimeout(graceRef.current);
      graceRef.current = null;
    }
  }, []);

  const bumpMeasure = useCallback(() => setMeasureVersion((v) => v + 1), []);

  useEffect(() => {
    if (!isDesktop) return;
    let cancelled = false;
    const fonts = document.fonts;
    if (fonts && typeof fonts.ready?.then === 'function') {
      fonts.ready
        .then(() => {
          if (!cancelled) bumpMeasure();
        })
        .catch(() => {});
    }
    return () => {
      cancelled = true;
    };
  }, [isDesktop, bumpMeasure]);

  useEffect(() => () => clearGrace(), [clearGrace]);

  const activateOrg = useCallback(
    (orgId: string) => {
      clearGrace();
      setActiveOrgId(orgId);
    },
    [clearGrace]
  );

  const deactivateOrg = useCallback(() => {
    clearGrace();
    graceRef.current = window.setTimeout(() => {
      graceRef.current = null;
      setActiveOrgId(null);
    }, GRACE_MS);
  }, [clearGrace]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenId(null);
    };
    const onDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const inOrg = target?.closest?.('[data-org]');
      if (!inOrg) {
        clearGrace();
        setActiveOrgId(null);
      }
      if (openIdRef.current !== null && !target?.closest?.('[data-open-card]')) {
        setOpenId(null);
      }
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [clearGrace]);

  const handleToggle = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  const measureLines = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const base = container.getBoundingClientRect();

    interface Raw {
      expId: number;
      orgId: string;
      cx: number;
      cy: number;
      w: number;
      h: number;
      logoCx: number;
      logoCy: number;
      logoR: number;
      angle: number;
    }

    const raws: Raw[] = [];

    experiences.forEach((exp) => {
      const card = cardRefs.current[exp.id];
      const logo = logoRefs.current[exp.organizationId];
      if (!card || !logo) return;

      const c = card.getBoundingClientRect();
      const l = logo.getBoundingClientRect();

      const cx = c.left - base.left + c.width / 2;
      const cy = c.top - base.top + c.height / 2;
      const logoCx = l.left - base.left + l.width / 2;
      const logoCy = l.top - base.top + l.height / 2;

      let angle = Math.atan2(cy - logoCy, cx - logoCx);
      if (angle > BOTTOM_FROM && angle < BOTTOM_TO) {
        angle = angle - BOTTOM_FROM < BOTTOM_TO - angle ? BOTTOM_FROM : BOTTOM_TO;
      }

      raws.push({
        expId: exp.id,
        orgId: exp.organizationId,
        cx,
        cy,
        w: c.width,
        h: c.height,
        logoCx,
        logoCy,
        logoR: l.width / 2,
        angle,
      });
    });

    const byOrg = new Map<string, Raw[]>();
    raws.forEach((raw) => {
      const group = byOrg.get(raw.orgId);
      if (group) group.push(raw);
      else byOrg.set(raw.orgId, [raw]);
    });

    byOrg.forEach((group) => {
      group.sort((a, b) => a.angle - b.angle);
      for (let i = 1; i < group.length; i += 1) {
        if (group[i].angle - group[i - 1].angle < MIN_DOT_ANGLE) {
          group[i].angle = group[i - 1].angle + MIN_DOT_ANGLE;
        }
      }
      for (let i = group.length - 2; i >= 0; i -= 1) {
        if (group[i + 1].angle - group[i].angle < MIN_DOT_ANGLE) {
          group[i].angle = group[i + 1].angle - MIN_DOT_ANGLE;
        }
      }
    });

    const next: LeaderLine[] = raws
      .map((raw) => {
        const x2 = raw.logoCx + Math.cos(raw.angle) * (raw.logoR + 4);
        const y2 = raw.logoCy + Math.sin(raw.angle) * (raw.logoR + 4);
        const start = rectEdgePoint(raw.cx, raw.cy, raw.w, raw.h, x2, y2);
        return { expId: raw.expId, orgId: raw.orgId, x1: start.x, y1: start.y, x2, y2 };
      })
      .filter(
        (line) =>
          Number.isFinite(line.x1) &&
          Number.isFinite(line.y1) &&
          Number.isFinite(line.x2) &&
          Number.isFinite(line.y2)
      );

    setLines(next);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const container = containerRef.current;
    if (!container) return;

    const measureSizes = () => {
      const next: Record<number, { w: number; h: number }> = {};
      experiences.forEach((exp) => {
        const el = cardRefs.current[exp.id];
        if (el) next[exp.id] = { w: el.offsetWidth, h: el.offsetHeight };
      });
      setCardSizes((prev) => {
        const prevKeys = Object.keys(prev);
        const nextKeys = Object.keys(next);
        if (prevKeys.length !== nextKeys.length) return next;
        for (const key of nextKeys) {
          const a = prev[Number(key)];
          const b = next[Number(key)];
          if (!a || Math.abs(a.w - b.w) > 0.5 || Math.abs(a.h - b.h) > 0.5) return next;
        }
        return prev;
      });
    };

    measureSizes();
    const width = container.clientWidth;
    setContainerWidth((prev) => (Math.abs(prev - width) > 0.5 ? width : prev));

    const observer = new ResizeObserver(() => {
      measureSizes();
      const w = container.clientWidth;
      setContainerWidth((prev) => (Math.abs(prev - w) > 0.5 ? w : prev));
    });
    observer.observe(container);
    experiences.forEach((exp) => {
      const el = cardRefs.current[exp.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isDesktop]);

  useEffect(() => {
    if (!isDesktop) return;

    const container = containerRef.current;
    if (!container) return;

    const base = container.getBoundingClientRect();
    const cw = containerWidth;

    const obstacles: Box[] = [];
    organizations.forEach((org) => {
      const logo = logoRefs.current[org.id];
      if (logo) {
        const r = logo.getBoundingClientRect();
        obstacles.push({
          cx: r.left - base.left + r.width / 2,
          cy: r.top - base.top + r.height / 2,
          w: r.width,
          h: r.height,
        });
      }
    });

    const cards: LayoutCard[] = experiences.map((exp, i) => {
      const cfg = CARD_LAYOUT[i];
      const size = cardSizes[exp.id] ?? { w: CARD_WIDTH, h: 156 };
      const baseCx = (cfg.x / 100) * cw;
      const baseCy = (cfg.y / 100) * DESIGN_H;
      return {
        id: exp.id,
        orgId: exp.organizationId,
        baseCx,
        baseCy,
        cx: baseCx,
        cy: baseCy,
        w: size.w,
        h: size.h,
        movable: exp.id !== openId,
      };
    });

    for (let iter = 0; iter < 10; iter += 1) {
      let moved = false;
      for (let i = 0; i < cards.length; i += 1) {
        for (let j = i + 1; j < cards.length; j += 1) {
          if (separate(cards[i], cards[j], GAP)) moved = true;
        }
      }
      for (const card of cards) {
        for (const obstacle of obstacles) {
          if (pushFromObstacle(card, obstacle, GAP)) moved = true;
        }
      }
      if (!moved) break;
    }

    let neededHeight = DESIGN_H;
    for (const card of cards) {
      const bottom = card.cy + card.h / 2 + BOTTOM_MARGIN;
      if (bottom > neededHeight) neededHeight = bottom;
    }

    cards.forEach((card) => {
      const minCx = card.w / 2 + SIDE_MARGIN;
      const maxCx = Math.max(minCx, cw - card.w / 2 - SIDE_MARGIN);
      card.cx = Math.min(Math.max(card.cx, minCx), maxCx);
      const minCy = card.h / 2 + TOP_MARGIN;
      const maxCy = Math.max(minCy, neededHeight - card.h / 2 - BOTTOM_MARGIN);
      card.cy = Math.min(Math.max(card.cy, minCy), maxCy);
    });

    const next: Record<number, { x: number; y: number }> = {};
    cards.forEach((card) => {
      next[card.id] = { x: card.cx - card.baseCx, y: card.cy - card.baseCy };
    });
    const handle = requestAnimationFrame(() => {
      setOffsets(next);
      setLayoutHeight((prev) => (Math.abs(prev - neededHeight) > 0.5 ? neededHeight : prev));
    });

    return () => cancelAnimationFrame(handle);
  }, [isDesktop, openId, cardSizes, containerWidth]);

  useEffect(() => {
    if (!isDesktop) return;

    let raf = 0;
    let start = 0;
    const duration = prefersReduced ? 0 : 460;
    const tick = (time: number) => {
      if (!start) start = time;
      measureLines();
      if (time - start < duration) raf = requestAnimationFrame(tick);
      else raf = 0;
    };
    raf = requestAnimationFrame(tick);

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isDesktop, openId, cardSizes, containerWidth, offsets, entered, measureLines, prefersReduced, measureVersion]);

  useEffect(() => {
    if (!isDesktop) return;
    const timer = window.setTimeout(() => {
      const rects: { name: string; r: DOMRect }[] = [];
      experiences.forEach((exp) => {
        const el = cardRefs.current[exp.id];
        if (el) rects.push({ name: `card:${exp.id}`, r: el.getBoundingClientRect() });
      });
      for (let i = 0; i < rects.length; i += 1) {
        for (let j = i + 1; j < rects.length; j += 1) {
          const a = rects[i];
          const b = rects[j];
          const overlaps =
            a.r.left < b.r.right &&
            b.r.left < a.r.right &&
            a.r.top < b.r.bottom &&
            b.r.top < a.r.bottom;
          if (overlaps) console.warn(`[Experience] layout overlap: ${a.name} ∩ ${b.name}`);
        }
      }
    }, TRANSITION_MS + 120);
    return () => window.clearTimeout(timer);
  }, [isDesktop, openId]);

  const isDimmed = (orgId: string) => effectiveOrg !== null && effectiveOrg !== orgId;
  const logoTransition = prefersReduced ? 'none' : 'opacity 250ms ease';

  return (
    <section
      id="experience"
      ref={sectionRef}
      style={{
        padding: isSmallScreen ? '50px 16px 70px 16px' : '90px 40px 110px 40px',
        backgroundColor: 'var(--bg-page)',
        position: 'relative',
        transition: 'background-color 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReduced ? 0 : 0.6 }}
          style={{ marginBottom: isDesktop ? '20px' : '40px', textAlign: 'center' }}
        >
          <h2
            style={{
              fontSize: isSmallScreen ? 'clamp(28px, 6vw, 32px)' : '48px',
              fontWeight: 500,
              color: 'var(--text-primary)',
              margin: '0 0 16px 0',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.02em',
            }}
          >
            Experience.
          </h2>
          <p
            style={{
              fontSize: isSmallScreen ? '14px' : '16px',
              color: 'var(--text-secondary)',
              margin: 0,
              fontFamily: 'var(--font-body)',
            }}
          >
            Leadership roles, technical projects, and academic excellence.
          </p>
        </motion.div>

        {isDesktop ? (
          <div
            ref={containerRef}
            style={{
              position: 'relative',
              width: '100%',
              height: `${layoutHeight}px`,
              minHeight: `${DESIGN_H}px`,
              transition: prefersReduced ? 'none' : `height ${TRANSITION_MS}ms ease`,
            }}
          >
            {entered && (
              <svg
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  overflow: 'visible',
                  pointerEvents: 'none',
                  zIndex: LAYERS.line,
                }}
              >
                {lines.map((line) => {
                  const related = effectiveOrg === line.orgId;
                  const dim = effectiveOrg !== null && effectiveOrg !== line.orgId;
                  return (
                    <g key={line.expId}>
                      <motion.path
                        d={`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`}
                        fill="none"
                        stroke={related ? 'var(--accent-green)' : 'rgba(59, 82, 23, 0.55)'}
                        strokeWidth={related ? 2 : 1}
                        strokeLinecap="round"
                        animate={{ opacity: dim ? 0.25 : 1 }}
                        transition={{ duration: prefersReduced ? 0 : 0.2 }}
                      />
                      <circle
                        cx={line.x2}
                        cy={line.y2}
                        r={related ? 4 : 3}
                        fill={related ? 'var(--accent-green)' : 'rgba(59, 82, 23, 0.7)'}
                      />
                      <path
                        d={`M ${line.x1} ${line.y1} L ${line.x2} ${line.y2}`}
                        fill="none"
                        stroke="transparent"
                        strokeWidth={20}
                        strokeLinecap="round"
                        data-org={line.orgId}
                        pointerEvents="stroke"
                        style={{ cursor: 'default' }}
                        onPointerEnter={() => activateOrg(line.orgId)}
                        onPointerLeave={deactivateOrg}
                      />
                    </g>
                  );
                })}
              </svg>
            )}

            {organizations.map((org) => {
              const related = effectiveOrg === org.id;
              const dim = effectiveOrg !== null && effectiveOrg !== org.id;
              return (
                <Tooltip key={org.id} delay={0}>
                  <Tooltip.Trigger
                    data-org={org.id}
                    aria-label={org.name}
                    ref={(el) => {
                      logoRefs.current[org.id] = el;
                    }}
                    onMouseEnter={() => activateOrg(org.id)}
                    onMouseLeave={deactivateOrg}
                    onFocus={() => activateOrg(org.id)}
                    onBlur={deactivateOrg}
                    style={{
                      position: 'absolute',
                      left: `${org.x}%`,
                      top: `${(org.y / 100) * DESIGN_H}px`,
                      transform: 'translate(-50%, -50%)',
                      width: `${org.size}px`,
                      height: `${org.size}px`,
                      borderRadius: '20px',
                      background: 'var(--bg-page-light)',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: related
                        ? '0 16px 34px rgba(10, 16, 4, 0.26)'
                        : '0 12px 28px rgba(10, 16, 4, 0.18)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px',
                      zIndex: LAYERS.logo,
                      opacity: !entered ? 0 : dim ? 0.5 : 1,
                      transition: logoTransition,
                    }}
                  >
                    <img
                      src={org.logo}
                      alt=""
                      onLoad={bumpMeasure}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        transform: related && !prefersReduced ? 'scale(1.1)' : 'scale(1)',
                        transition: prefersReduced ? 'none' : 'transform 250ms ease',
                      }}
                    />
                  </Tooltip.Trigger>
                  <Tooltip.Content placement="top" offset={10}>
                    {org.name}
                  </Tooltip.Content>
                </Tooltip>
              );
            })}

            {experiences.map((exp, i) => {
              const cfg = CARD_LAYOUT[i];
              const isOpen = openId === exp.id;
              const off = offsets[exp.id] ?? { x: 0, y: 0 };
              return (
                <div
                  key={exp.id}
                  data-org={exp.organizationId}
                  data-open-card={isOpen ? 'true' : undefined}
                  style={{
                    position: 'absolute',
                    left: `${cfg.x}%`,
                    top: `${(cfg.y / 100) * DESIGN_H}px`,
                    transform: 'translate(-50%, -50%)',
                    width: `${CARD_WIDTH}px`,
                    zIndex: isOpen ? LAYERS.openCard : LAYERS.card,
                  }}
                >
                  <motion.div
                    ref={(el) => {
                      cardRefs.current[exp.id] = el;
                    }}
                    animate={{ x: off.x, y: off.y }}
                    transition={
                      prefersReduced
                        ? { duration: 0 }
                        : { duration: TRANSITION_MS / 1000, ease: [0.22, 1, 0.36, 1] }
                    }
                  >
                    <ExperienceCard
                      exp={exp}
                      org={orgById.get(exp.organizationId)}
                      index={i}
                      isOpen={isOpen}
                      active={effectiveOrg === exp.organizationId}
                      dimmed={isDimmed(exp.organizationId)}
                      entered={entered}
                      settled={settled}
                      prefersReduced={prefersReduced}
                      showLogo={false}
                      onToggle={() => handleToggle(exp.id)}
                      onActivate={() => activateOrg(exp.organizationId)}
                      onDeactivate={deactivateOrg}
                    />
                  </motion.div>
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '28px',
                marginBottom: '36px',
              }}
            >
              {organizations.map((org) => (
                <Tooltip key={org.id} delay={0}>
                  <Tooltip.Trigger
                    aria-label={org.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      background: 'var(--bg-page-light)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '9px',
                    }}
                  >
                    <img
                      src={org.logo}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </Tooltip.Trigger>
                  <Tooltip.Content placement="top" offset={8}>
                    {org.name}
                  </Tooltip.Content>
                </Tooltip>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {experiences.map((exp, i) => (
                <ExperienceCard
                  key={exp.id}
                  exp={exp}
                  org={orgById.get(exp.organizationId)}
                  index={i}
                  isOpen={openId === exp.id}
                  active={effectiveOrg === exp.organizationId}
                  dimmed={false}
                  entered={entered}
                  settled={settled}
                  prefersReduced={prefersReduced}
                  showLogo
                  onToggle={() => handleToggle(exp.id)}
                  onActivate={() => activateOrg(exp.organizationId)}
                  onDeactivate={deactivateOrg}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
