/**
 * Single source of truth for "status" visual language across the app.
 *
 * Previously films, jobs, and awards each invented their own ad-hoc
 * color mapping (raw bg-green-500/bg-blue-500/etc, different shades and
 * opacities in different files) so the same idea — "this is active /
 * pending / done / inactive" — looked different on every page. Every
 * status badge in the app should map into one of these five kinds.
 */
export type StatusKind = 'success' | 'info' | 'pending' | 'neutral' | 'danger'

interface StatusStyle {
  /** Solid pill background, used for large/high-emphasis badges. */
  solid: string
  /** Small dot indicator color. */
  dot: string
  /** Soft/tinted badge background + text, used for compact inline badges. */
  soft: string
  /** Text-only color, for use without a badge background. */
  text: string
}

export const statusStyles: Record<StatusKind, StatusStyle> = {
  success: {
    solid: 'bg-emerald-600',
    dot: 'bg-emerald-400',
    soft: 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400',
    text: 'text-emerald-700 dark:text-emerald-400',
  },
  info: {
    solid: 'bg-brand-secondary',
    dot: 'bg-brand-accent',
    soft: 'bg-brand-secondary/10 text-brand-secondary dark:text-brand-accent',
    text: 'text-brand-secondary dark:text-brand-accent',
  },
  pending: {
    solid: 'bg-brand-gold',
    dot: 'bg-brand-gold',
    soft: 'bg-brand-gold/15 text-amber-700 dark:text-brand-gold',
    text: 'text-amber-700 dark:text-brand-gold',
  },
  neutral: {
    solid: 'bg-brand-muted',
    dot: 'bg-brand-muted',
    soft: 'bg-brand-muted/10 text-brand-muted',
    text: 'text-brand-muted',
  },
  danger: {
    solid: 'bg-rose-700',
    dot: 'bg-rose-400',
    soft: 'bg-rose-700/10 text-rose-700 dark:text-rose-400',
    text: 'text-rose-700 dark:text-rose-400',
  },
}

/** Film production-status -> status kind. */
export const filmStatusKind: Record<string, StatusKind> = {
  released: 'success',
  post_production: 'info',
  pre_production: 'pending',
  development: 'neutral',
  announced: 'neutral',
  cancelled: 'danger',
}

export const filmStatusLabel: Record<string, string> = {
  released: 'Released',
  post_production: 'Post-Production',
  pre_production: 'Pre-Production',
  development: 'Development',
  announced: 'Announced',
  cancelled: 'Cancelled',
}

/** Job/career posting status -> status kind. */
export const jobStatusKind: Record<string, StatusKind> = {
  open: 'success',
  closed: 'neutral',
}

/** Award result -> status kind ("won" gets the brand gold treatment). */
export const awardResultKind: Record<string, StatusKind> = {
  won: 'pending',
  nominated: 'info',
}
