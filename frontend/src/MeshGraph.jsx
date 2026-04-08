const POSITIONS = {
  "agent-1": { x: 200, y: 80 },
  "agent-2": { x: 340, y: 160 },
  "agent-3": { x: 290, y: 300 },
  "agent-4": { x: 110, y: 300 },
  "agent-5": { x: 60, y: 160 },
}

const COLORS = { online: "#00d4ff", winning: "#00ff88", offline: "#ff4444" }
const SPECS = { "agent-1": "writing", "agent-2": "analysis", "agent-3": "coding", "agent-4": "research", "agent-5": "creative" }
const PAIRS = [["agent-1","agent-2"],["agent-2","agent-3"],["agent-3","agent-4"],["agent-4","agent-5"],["agent-5","agent-1"],["agent-1","agent-3"],["agent-2","agent-4"]]

export default function MeshGraph({ agentStates }) {
  return (
    <div className="mesh-container">
      <h3>Live Mesh Network</h3>
      <svg width="400" height="380">
        {PAIRS.map(([a, b]) => {
          const pa = POSITIONS[a], pb = POSITIONS[b]
          const bothAlive = agentStates[a] !== "offline" && agentStates[b] !== "offline"
          return <line key={`${a}-${b}`} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
            stroke={bothAlive ? "#00d4ff33" : "#ffffff11"} strokeWidth="1.5" />
        })}
        {Object.entries(POSITIONS).map(([id, pos]) => {
          const state = agentStates[id]
          const color = COLORS[state]
          return (
            <g key={id}>
              <circle cx={pos.x} cy={pos.y} r="28" fill="#0a0a1f" stroke={color} strokeWidth="2" />
              {state === "winning" && (
                <circle cx={pos.x} cy={pos.y} r="34" fill="none" stroke={color} strokeWidth="1" opacity="0.5">
                  <animate attributeName="r" values="28;42;28" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0;0.8" dur="1s" repeatCount="indefinite" />
                </circle>
              )}
              <text x={pos.x} y={pos.y - 4} textAnchor="middle" fill={color} fontSize="9" fontWeight="bold">
                {id.toUpperCase()}
              </text>
              <text x={pos.x} y={pos.y + 8} textAnchor="middle" fill="#ffffff66" fontSize="8">
                {SPECS[id]}
              </text>
              {state === "offline" && (
                <text x={pos.x} y={pos.y + 20} textAnchor="middle" fill="#ff4444" fontSize="7">DEAD</text>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}