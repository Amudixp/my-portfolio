import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode, RefObject } from 'react';
import { createPortal } from 'react-dom';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { experiences, organizations } from '../../data/experience';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import type { ExperienceData, OrganizationData, TooltipPlacement } from '../../types';

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
const DESIGN_W = 1200;
const CLUSTER_X = 0.5;
const CLUSTER_Y = 0.47;
const MIN_LOGO_SCALE = 0.82;
const CARD_WIDTH = 300;
const GAP = 24;
const SIDE_MARGIN = 24;
const TOP_MARGIN = 24;
const BOTTOM_MARGIN = 48;
const GRACE_MS = 170;
const TRANSITION_MS = 300;
// Minimum horizontal gap between the cluster edge and the nearest card column.
// Config-driven so the tooltip always has room without covering a card.
// 250px column half-extent minus the widest logo reach (~93px) yields the
// target ~140-160px of free space between logo edge and card edge at >=1280px.
const CLUSTER_CARD_CLEARANCE = 250;
const CARD_COLUMN_HALF = CARD_WIDTH / 2 + CLUSTER_CARD_CLEARANCE;

// Card columns are derived from the cluster center + design half-width so there
// is always CLUSTER_CARD_CLEARANCE of free space between logo edge and card edge.
const leftColX = (): number => ((DESIGN_W * CLUSTER_X - CARD_COLUMN_HALF) / DESIGN_W) * 100;
const rightColX = (): number => ((DESIGN_W * CLUSTER_X + CARD_COLUMN_HALF) / DESIGN_W) * 100;

const CARD_LAYOUT: CardLayout[] = [
  { x: rightColX(), y: 76 },
  { x: leftColX(), y: 24 },
  { x: rightColX(), y: 24 },
  { x: leftColX(), y: 50 },
  { x: leftColX(), y: 76 },
  { x: rightColX(), y: 50 },
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

// Edge point of a rotated square (side `size`) toward a target point.
const rotatedEdgePoint = (
  cx: number,
  cy: number,
  size: number,
  rotDeg: number,
  tx: number,
  ty: number
) => {
  const rad = (rotDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = tx - cx;
  const dy = ty - cy;
  // Transform the direction into the square's local (unrotated) frame.
  const ldx = dx * cos + dy * sin;
  const ldy = -dx * sin + dy * cos;
  const hw = size / 2;
  const sx = ldx !== 0 ? hw / Math.abs(ldx) : Number.POSITIVE_INFINITY;
  const sy = ldy !== 0 ? hw / Math.abs(ldy) : Number.POSITIVE_INFINITY;
  const s = Math.min(sx, sy);
  const lx = ldx * s;
  const ly = ldy * s;
  return { x: cx + lx * cos - ly * sin, y: cy + lx * sin + ly * cos };
};

const TOOLTIP_OFFSET = 12;
const TOOLTIP_MARGIN = 8;
const MIN_TOOLTIP_WIDTH = 140;
const AVG_CHAR_WIDTH = 6.6;
const MAX_TOOLTIP_WIDTH = 240;
const TOOLTIP_PADDING = 24;
const PENALTY_OVERLAP = 1000;
const PENALTY_VIEWPORT = 400;
const CENTER_BONUS = 30;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const PLACEMENT_ORDER: TooltipPlacement[] = ['right', 'left', 'bottom', 'top'];

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface TooltipBox {
  top: number;
  left: number;
  right: number;
  bottom: number;
  placement: TooltipPlacement;
}

const estimateTooltipSize = (label: string) => {
  const chars = Math.max(1, label.length);
  const width = clamp(MIN_TOOLTIP_WIDTH, chars * AVG_CHAR_WIDTH + TOOLTIP_PADDING, MAX_TOOLTIP_WIDTH);
  const lines = Math.max(1, Math.ceil((chars * AVG_CHAR_WIDTH) / width));
  return { w: Math.round(width), h: Math.round(18 * lines + 20) };
};

// Anchor a tooltip box of `tipW` x `tipH` to the trigger rect on `placement`.
const computeTooltipBox = (
  rect: Rect,
  tipW: number,
  tipH: number,
  placement: TooltipPlacement
): TooltipBox => {
  let left = 0;
  let top = 0;
  if (placement === 'top') {
    left = rect.left + (rect.right - rect.left) / 2 - tipW / 2;
    top = rect.top - tipH - TOOLTIP_OFFSET;
  } else if (placement === 'bottom') {
    left = rect.left + (rect.right - rect.left) / 2 - tipW / 2;
    top = rect.bottom + TOOLTIP_OFFSET;
  } else if (placement === 'left') {
    left = rect.left - tipW - TOOLTIP_OFFSET;
    top = rect.top + (rect.bottom - rect.top) / 2 - tipH / 2;
  } else {
    left = rect.right + TOOLTIP_OFFSET;
    top = rect.top + (rect.bottom - rect.top) / 2 - tipH / 2;
  }
  return { left, top, right: left + tipW, bottom: top + tipH, placement };
};

const rectsOverlap = (a: Rect, b: Rect) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

const overlapArea = (a: Rect, b: Rect) => {
  const w = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const h = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return w > 0 && h > 0 ? w * h : 0;
};

const segmentIntersectsRect = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rect: Rect
): boolean => {
  if (x1 >= rect.left && x1 <= rect.right && y1 >= rect.top && y1 <= rect.bottom) return true;
  if (x2 >= rect.left && x2 <= rect.right && y2 >= rect.top && y2 <= rect.bottom) return true;
  const edges: Array<[number, number, number, number]> = [
    [rect.left, rect.top, rect.right, rect.top],
    [rect.right, rect.top, rect.right, rect.bottom],
    [rect.right, rect.bottom, rect.left, rect.bottom],
    [rect.left, rect.bottom, rect.left, rect.top],
  ];
  return edges.some(([ax, ay, bx, by]) => segmentsIntersect(x1, y1, x2, y2, ax, ay, bx, by));
};

const segmentsIntersect = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
): boolean => {
  const d = (x2 - x1) * (y4 - y3) - (y2 - y1) * (x4 - x3);
  if (d === 0) return false;
  const t = ((x3 - x1) * (y4 - y3) - (y3 - y1) * (x4 - x3)) / d;
  const u = ((x3 - x1) * (y2 - y1) - (y3 - y1) * (x2 - x1)) / d;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
};

interface PlacementScoringContext {
  cards: Rect[];
  logos: Rect[];
  lines: LeaderLine[];
  activeOrgId: string | null;
  viewportW: number;
  viewportH: number;
  dx: number;
  dy: number;
}

// Direction pointing away from the cluster center. Used only as a tie-breaker.
const computeAutoPlacement = (dx: number, dy: number): TooltipPlacement => {
  if (Math.abs(dy) >= Math.abs(dx)) return dy < 0 ? 'top' : 'bottom';
  return dx < 0 ? 'left' : 'right';
};

// Score a candidate side: prefer empty space (no card/logo overlap), avoid
// cutting other organisations' leader lines, stay inside the viewport. The
// "away from cluster" direction only acts as a small tie-breaker bonus.
const scorePlacement = (
  placement: TooltipPlacement,
  box: TooltipBox,
  ctx: PlacementScoringContext
): number => {
  let score = 0;

  for (const card of ctx.cards) {
    if (rectsOverlap(box, card)) score -= PENALTY_OVERLAP + overlapArea(box, card);
  }
  for (const logo of ctx.logos) {
    if (rectsOverlap(box, logo)) score -= PENALTY_OVERLAP + overlapArea(box, logo);
  }
  for (const line of ctx.lines) {
    if (!segmentIntersectsRect(line.x1, line.y1, line.x2, line.y2, box)) continue;
    score -= line.orgId === ctx.activeOrgId ? 30 : 120;
  }

  if (box.left < TOOLTIP_MARGIN || box.right > ctx.viewportW - TOOLTIP_MARGIN) score -= PENALTY_VIEWPORT;
  if (box.top < TOOLTIP_MARGIN || box.bottom > ctx.viewportH - TOOLTIP_MARGIN) score -= PENALTY_VIEWPORT;

  const desired = computeAutoPlacement(ctx.dx, ctx.dy);
  if (placement === desired) score += CENTER_BONUS;

  return score;
};

const choosePlacement = (
  trigger: Rect,
  tipW: number,
  tipH: number,
  ctx: PlacementScoringContext
): TooltipPlacement => {
  let best = PLACEMENT_ORDER[0];
  let bestScore = Number.NEGATIVE_INFINITY;
  for (const placement of PLACEMENT_ORDER) {
    const box = computeTooltipBox(trigger, tipW, tipH, placement);
    const score = scorePlacement(placement, box, ctx);
    if (score > bestScore) {
      bestScore = score;
      best = placement;
    }
  }
  return best;
};

interface OrgTooltipProps {
  label: string;
  triggerRefs: RefObject<Record<string, HTMLDivElement | null>>;
  orgId: string;
  center: { cx: number; cy: number };
  containerRef: RefObject<HTMLDivElement | null>;
  cardRefs: RefObject<Record<number, HTMLDivElement | null>>;
  logoTriggerRefs: RefObject<Record<string, HTMLDivElement | null>>;
  lineList: LeaderLine[];
  activeOrgId: string | null;
  override?: TooltipPlacement;
  version: number;
}

const OrgTooltip = ({
  label,
  triggerRefs,
  orgId,
  center,
  containerRef,
  cardRefs,
  logoTriggerRefs,
  lineList,
  activeOrgId,
  override,
  version,
}: OrgTooltipProps) => {
  const tipRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<TooltipBox | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const trigger = triggerRefs.current?.[orgId];
      const tip = tipRef.current;
      if (!trigger || !tip) return;

      const rect = trigger.getBoundingClientRect();
      const baseRect: Rect = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
      tip.style.maxWidth = `${MAX_TOOLTIP_WIDTH}px`;
      const t = tip.getBoundingClientRect();
      const tipW = t.width || estimateTooltipSize(label).w;
      const tipH = t.height || estimateTooltipSize(label).h;

      const container = containerRef.current;
      const base = container?.getBoundingClientRect() ?? { left: 0, top: 0 };
      const cards: Rect[] = [];
      Object.values(cardRefs.current).forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        cards.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
      });
      const logos: Rect[] = [];
      Object.values(logoTriggerRefs.current).forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        logos.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
      });
      const lines: LeaderLine[] = lineList.map((line) => ({
        ...line,
        x1: base.left + line.x1,
        y1: base.top + line.y1,
        x2: base.left + line.x2,
        y2: base.top + line.y2,
      }));

      const placement = override
        ? override
        : choosePlacement(baseRect, tipW, tipH, {
            cards,
            logos,
            lines,
            activeOrgId,
            viewportW: window.innerWidth,
            viewportH: window.innerHeight,
            dx: center.cx - rect.left - rect.width / 2,
            dy: center.cy - (rect.top + rect.height / 2),
          });

      setBox(computeTooltipBox(baseRect, tipW, tipH, placement));
    };

    measure();
    let raf = 0;
    const onResize = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
  }, [
    triggerRefs,
    orgId,
    label,
    center,
    containerRef,
    cardRefs,
    logoTriggerRefs,
    lineList,
    activeOrgId,
    override,
    version,
  ]);

  return createPortal(
    <div
      ref={tipRef}
      className="org-tooltip"
      role="tooltip"
      style={{
        top: box ? `${box.top}px` : '0px',
        left: box ? `${box.left}px` : '0px',
        opacity: box ? 1 : 0,
      }}
    >
      {label}
    </div>,
    document.body
  );
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
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
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
        duration: prefersReduced ? 0 : 0.5,
        delay: prefersReduced || settled ? 0 : 0.15 + index * 0.06,
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
                width={200}
                height={200}
                loading="lazy"
                decoding="async"
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
  const logoTriggerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const mobileLogoTriggerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const openIdRef = useRef<number | null>(null);
  const graceRef = useRef<number | null>(null);

  const entered = useInView(sectionRef, { once: true, margin: '-120px' });
  const openExp = experiences.find((exp) => exp.id === openId) ?? null;
  const effectiveOrg = activeOrgId ?? openExp?.organizationId ?? null;

  // Cluster geometry: center follows the real container width; offsets/size
  // scale down proportionally on narrower desktops.
  const logoScale = Math.max(MIN_LOGO_SCALE, Math.min(1, containerWidth / DESIGN_W));
  const clusterCenter = useMemo(() => {
    let sx = 0;
    let sy = 0;
    organizations.forEach((org) => {
      sx += org.x;
      sy += org.y;
    });
    const count = organizations.length || 1;
    return {
      cx: containerWidth * CLUSTER_X + (sx / count) * logoScale,
      cy: DESIGN_H * CLUSTER_Y + (sy / count) * logoScale,
    };
  }, [containerWidth, logoScale]);
  const logoGeom = useMemo(() => {
    const map = new Map<string, { cx: number; cy: number; size: number; rotate: number }>();
    organizations.forEach((org) => {
      map.set(org.id, {
        cx: containerWidth * CLUSTER_X + org.x * logoScale,
        cy: DESIGN_H * CLUSTER_Y + org.y * logoScale,
        size: org.size * logoScale,
        rotate: org.rotate,
      });
    });
    return map;
  }, [containerWidth, logoScale]);

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
      logoSize: number;
      logoRotate: number;
      angle: number;
    }

    const raws: Raw[] = [];

    experiences.forEach((exp) => {
      const card = cardRefs.current[exp.id];
      const geom = logoGeom.get(exp.organizationId);
      if (!card || !geom) return;

      const c = card.getBoundingClientRect();

      const cx = c.left - base.left + c.width / 2;
      const cy = c.top - base.top + c.height / 2;
      const logoCx = geom.cx;
      const logoCy = geom.cy;

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
        logoSize: geom.size,
        logoRotate: geom.rotate,
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
        // Anchor on the rotated logo edge along the final (spread) direction.
        const dirX = raw.logoCx + Math.cos(raw.angle) * 1000;
        const dirY = raw.logoCy + Math.sin(raw.angle) * 1000;
        const end = rotatedEdgePoint(
          raw.logoCx,
          raw.logoCy,
          raw.logoSize,
          raw.logoRotate,
          dirX,
          dirY
        );
        const start = rectEdgePoint(raw.cx, raw.cy, raw.w, raw.h, end.x, end.y);
        return { expId: raw.expId, orgId: raw.orgId, x1: start.x, y1: start.y, x2: end.x, y2: end.y };
      })
      .filter(
        (line) =>
          Number.isFinite(line.x1) &&
          Number.isFinite(line.y1) &&
          Number.isFinite(line.x2) &&
          Number.isFinite(line.y2)
      );

    setLines(next);
  }, [logoGeom]);

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

    const cw = containerWidth;

    const obstacles: Box[] = [];
    organizations.forEach((org) => {
      const geom = logoGeom.get(org.id);
      if (geom) {
        obstacles.push({
          cx: geom.cx,
          cy: geom.cy,
          w: geom.size,
          h: geom.size,
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
  }, [isDesktop, openId, cardSizes, containerWidth, logoGeom]);

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

  const isDimmed = (orgId: string) => effectiveOrg !== null && effectiveOrg !== orgId;
  const logoTransition = prefersReduced ? 'none' : 'opacity 250ms ease';

  const overrideFor = (org: OrganizationData): TooltipPlacement | undefined => org.tooltipPlacement;

  // Mobile: no room-based scoring (small screens, no cluster); keep a simple,
  // deterministic side that never points straight into the wrapper center.
  const mobilePlacements = useMemo(() => {
    const map = new Map<string, TooltipPlacement>();
    const xs = organizations.map((org) => org.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    organizations.forEach((org, index) => {
      if (org.tooltipPlacement) {
        map.set(org.id, org.tooltipPlacement);
        return;
      }
      if (maxX - minX < 1) {
        map.set(org.id, index === 0 ? 'top' : 'bottom');
        return;
      }
      const rel = (org.x - minX) / (maxX - minX);
      map.set(org.id, rel < 0.5 ? 'bottom' : 'top');
    });
    return map;
  }, []);

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
              const g = logoGeom.get(org.id);
              if (!g) return null;
              const related = effectiveOrg === org.id;
              const dim = effectiveOrg !== null && effectiveOrg !== org.id;
              return (
                <div key={org.id} style={{ display: 'contents' }}>
                  <div
                    ref={(el) => {
                      logoTriggerRefs.current[org.id] = el;
                    }}
                    data-org={org.id}
                    className="org-logo-trigger"
                    aria-label={org.name}
                    tabIndex={0}
                    onMouseEnter={() => activateOrg(org.id)}
                    onMouseLeave={deactivateOrg}
                    onFocus={() => activateOrg(org.id)}
                    onBlur={deactivateOrg}
                    style={{
                      position: 'absolute',
                      left: `${g.cx}px`,
                      top: `${g.cy}px`,
                      transform: 'translate(-50%, -50%)',
                      width: `${g.size}px`,
                      height: `${g.size}px`,
                      zIndex: LAYERS.logo,
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
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
                        transform: `rotate(${g.rotate}deg)`,
                        opacity: !entered ? 0 : dim ? 0.5 : 1,
                        transition: logoTransition,
                      }}
                    >
                      <img
                        src={org.logo}
                        alt=""
                        width={200}
                        height={200}
                        loading="lazy"
                        decoding="async"
                        onLoad={bumpMeasure}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          transform: related && !prefersReduced ? 'scale(1.1)' : 'scale(1)',
                          transition: prefersReduced ? 'none' : 'transform 250ms ease',
                        }}
                      />
                    </div>
                  </div>
                  {related && activeOrgId === org.id && (
                    <OrgTooltip
                      label={org.name}
                      triggerRefs={logoTriggerRefs}
                      orgId={org.id}
                      center={clusterCenter}
                      containerRef={containerRef}
                      cardRefs={cardRefs}
                      logoTriggerRefs={logoTriggerRefs}
                      lineList={lines}
                      activeOrgId={activeOrgId}
                      override={overrideFor(org)}
                      version={measureVersion}
                    />
                  )}
                </div>
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
                <div key={org.id} style={{ display: 'contents' }}>
                  <div
                    ref={(el) => {
                      mobileLogoTriggerRefs.current[org.id] = el;
                    }}
                    data-org={org.id}
                    className="org-logo-trigger"
                    aria-label={org.name}
                    tabIndex={0}
                    onFocus={() => activateOrg(org.id)}
                    onBlur={deactivateOrg}
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
                      width={200}
                      height={200}
                      loading="lazy"
                      decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                  {activeOrgId === org.id && (
                    <OrgTooltip
                      label={org.name}
                      triggerRefs={mobileLogoTriggerRefs}
                      orgId={org.id}
                      center={{ cx: 0, cy: 0 }}
                      containerRef={containerRef}
                      cardRefs={cardRefs}
                      logoTriggerRefs={mobileLogoTriggerRefs}
                      lineList={[]}
                      activeOrgId={activeOrgId}
                      override={mobilePlacements.get(org.id) ?? 'bottom'}
                      version={measureVersion}
                    />
                  )}
                </div>
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
