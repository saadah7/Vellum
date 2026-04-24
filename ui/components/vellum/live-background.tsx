"use client"

/**
 * Ambient background: three blurred gradient orbs + a slowly drifting dot grid.
 * Fixed behind everything, pointer-events:none, GPU-accelerated via transform.
 *
 * Perf notes:
 * - each orb is one fixed-position div with filter: blur()
 * - animations run on transform + opacity only (no repaints)
 * - prefers-reduced-motion disables the drift (orbs stay put)
 */
export function LiveBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Deep base so the orbs blend even on browsers that hiccup with backdrop */}
      <div className="absolute inset-0 bg-background" />

      {/* Drifting orbs */}
      <div className="vellum-orb vellum-orb-1" />
      <div className="vellum-orb vellum-orb-2" />
      <div className="vellum-orb vellum-orb-3" />

      {/* Slow-drifting dot grid overlay */}
      <div className="vellum-grid" />

      {/* Vignette so edges feel softer */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.35) 100%)",
        }}
      />
    </div>
  )
}
