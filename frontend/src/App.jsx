import { useState, useEffect, useRef } from "react"
import MeshGraph from "./MeshGraph"
import AuctionFeed from "./AuctionFeed"
import "./App.css"

const AGENTS = ["agent-1", "agent-2", "agent-3", "agent-4", "agent-5"]

export default function App() {
  const [task, setTask] = useState("")
  const [events, setEvents] = useState([])
  const [agentStates, setAgentStates] = useState({
    "agent-1": "online", "agent-2": "online", "agent-3": "online",
    "agent-4": "online", "agent-5": "online"
  })
  const [stats, setStats] = useState({ completed: 0, selfHeals: 0 })
  const wsRef = useRef(null)

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws")
    wsRef.current = ws
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data)
      const { topic, data } = msg
      const time = new Date().toLocaleTimeString()

      if (topic === "swarm/bids") {
        setEvents(prev => [{time, type: "bid", text: `${data.agent_id} bid ${data.bid_ms}ms`}, ...prev].slice(0, 50))
      } else if (topic === "swarm/winner") {
        setAgentStates(prev => ({ ...prev, [data.agent_id]: "winning" }))
        setEvents(prev => [{time, type: "win", text: `🏆 ${data.agent_id} WON with ${data.bid_ms}ms`}, ...prev].slice(0, 50))
        setTimeout(() => setAgentStates(prev => ({ ...prev, [data.agent_id]: "online" })), 2000)
      } else if (topic === "swarm/results") {
        setEvents(prev => [{time, type: "result", text: `✅ Result: ${data.result.slice(0, 80)}...`}, ...prev].slice(0, 50))
        setStats(prev => ({ ...prev, completed: prev.completed + 1 }))
      } else if (topic === "swarm/agents/leave") {
        setAgentStates(prev => ({ ...prev, [data.agent_id]: "offline" }))
        setStats(prev => ({ ...prev, selfHeals: prev.selfHeals + 1 }))
        setEvents(prev => [{time, type: "kill", text: `💀 ${data.agent_id} went offline — swarm re-routing`}, ...prev].slice(0, 50))
      }
    }
    return () => ws.close()
  }, [])

  const injectTask = async () => {
    if (!task.trim()) return
    await fetch("http://localhost:8000/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task })
    })
    setEvents(prev => [{time: new Date().toLocaleTimeString(), type: "task", text: `📋 Task injected: ${task}`}, ...prev].slice(0, 50))
    setTask("")
  }

  const killAgent = async (agentId) => {
    await fetch(`http://localhost:8000/kill/${agentId}`, { method: "POST" })
  }

  return (
    <div className="app">
      <header>
        <h1>⚡ SwarmDesk</h1>
        <p>Leaderless AI Agent Coordination · Powered by Tashi Vertex</p>
        <div className="stats">
          <span>✅ Tasks Completed: {stats.completed}</span>
          <span>🔁 Self-Heals: {stats.selfHeals}</span>
          <span>🟢 Agents Online: {Object.values(agentStates).filter(s => s !== "offline").length}/5</span>
        </div>
      </header>

      <div className="main">
        <div className="left">
          <MeshGraph agentStates={agentStates} />
          <div className="kill-panel">
            <p>⚠️ Kill an Agent (self-healing demo)</p>
            {AGENTS.map(id => (
              <button key={id} onClick={() => killAgent(id)}
                disabled={agentStates[id] === "offline"}
                className={agentStates[id] === "offline" ? "dead" : "kill-btn"}>
                Kill {id}
              </button>
            ))}
          </div>
        </div>

        <div className="right">
          <div className="task-input">
            <textarea value={task} onChange={e => setTask(e.target.value)}
              placeholder="Type a task... e.g. Write a tweet about AI robots"
              rows={3} />
            <button onClick={injectTask}>⚡ Inject Task</button>
          </div>
          <AuctionFeed events={events} />
        </div>
      </div>
    </div>
  )
}