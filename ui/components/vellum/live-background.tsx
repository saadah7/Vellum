"use client"

// Hand-placed nodes in loose clusters across a 1600×900 canvas.
// Positions are deterministic so SSR and client agree.
const NETWORK_NODES: Array<[number, number]> = [
  // top-left cluster
  [120, 180], [240, 320], [ 80, 440], [320, 480],
  // top-mid cluster
  [460, 140], [580, 280], [420, 380], [640, 460],
  // top-right cluster
  [880, 180], [980, 320], [820, 440], [1120, 260],
  // mid-right cluster
  [1280, 180], [1440, 340], [1240, 460], [1500, 580],
  // bottom band
  [ 300, 660], [540, 720], [760, 640], [980, 740], [1200, 660], [660, 560],
]

// Curated edges — within-cluster density + cross-cluster signal paths.
const NETWORK_EDGES: Array<[number, number]> = [
  [0,1],[0,2],[1,2],[1,3],[2,3],[3,6],
  [4,5],[4,6],[5,6],[6,7],[5,8],
  [7,9],[8,9],[8,10],[9,10],[9,11],[10,11],
  [11,12],[12,13],[13,14],[12,14],[14,15],
  [16,17],[17,18],[18,19],[19,20],[18,21],
  [3,16],[15,20],[21,7],
]

function VellumNetwork() {
  return (
    <svg
      className="vellum-network"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
    >
      <defs>
        <radialGradient id="vn-node" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#cfd6ff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#cfd6ff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g className="vellum-network-edges">
        {NETWORK_EDGES.map(([a, b], i) => (
          <line
            key={i}
            x1={NETWORK_NODES[a][0]} y1={NETWORK_NODES[a][1]}
            x2={NETWORK_NODES[b][0]} y2={NETWORK_NODES[b][1]}
            style={{ animationDelay: `${(i * 0.43).toFixed(2)}s` }}
          />
        ))}
      </g>

      <g className="vellum-network-nodes">
        {NETWORK_NODES.map(([x, y], i) => (
          <g key={i} style={{ animationDelay: `${(i * 0.37).toFixed(2)}s` }}>
            <circle cx={x} cy={y} r={14} className="vellum-network-halo" />
            <circle cx={x} cy={y} r={2.4} className="vellum-network-core" />
          </g>
        ))}
      </g>
    </svg>
  )
}

/**
 * Ambient background: lit mesh + neural-network constellation + drifting orbs + dot grid.
 * Fixed behind everything, pointer-events:none, GPU-accelerated via transform.
 */
export function LiveBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Lit base mesh — replaces flat black with a layered, breathing gradient */}
      <div className="vellum-base-mesh absolute inset-0" />

      {/* Neural-network constellation, sits between mesh and orbs */}
      <VellumNetwork />

      {/* Drifting orbs */}
      <div className="vellum-orb vellum-orb-1" />
      <div className="vellum-orb vellum-orb-2" />
      <div className="vellum-orb vellum-orb-3" />

      {/* Slow-drifting dot grid overlay */}
      <div className="vellum-grid" />

      {/* Edge vignette — gentle so the mesh stays visible at the corners */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.28) 100%)",
        }}
      />
    </div>
  )
}
