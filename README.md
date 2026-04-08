# ⚡ SwarmDesk
### Leaderless AI Agent Coordination · Vertex Swarm Challenge 2026 · Track 3: The Agent Economy

##  What is SwarmDesk?

SwarmDesk is a leaderless AI agent coordination platform. Five specialized AI agents
autonomously discover each other, bid on tasks, and execute them in real time —
with zero central orchestrator, zero cloud dependency, and zero single point of failure.

No master. No middleman. Just swarm intelligence.

---

## 🎥 How It Works
User injects task
↓
Task broadcasts to ALL agents via FoxMQ mesh
↓
Every agent places a bid (based on latency)
↓
Auctioneer peer picks the fastest bid (leaderless consensus)
↓
Winning agent executes task via Claude AI
↓
Result broadcasts back to entire mesh
↓
Kill any agent → swarm detects → re-auctions automatically

---

## 🏗️ Architecture
┌─────────────────────────────────────────────────────┐
│                    BROWSER                          │
│         React Dashboard (localhost:5173)            │
│   MeshGraph | AuctionFeed | TaskInput | KillPanel   │
└──────────────────────┬──────────────────────────────┘
│ WebSocket
┌──────────────────────▼──────────────────────────────┐
│              FastAPI Server (port 8000)             │
│         WebSocket Bridge + REST API                 │
└──────────────────────┬──────────────────────────────┘
│ MQTT
┌──────────────────────▼──────────────────────────────┐
│           FoxMQ / Mosquitto MQTT Broker             │
│              Decentralized Mesh Layer               │
└──┬──────────┬──────────┬──────────┬─────────────────┘
│          │          │          │
┌──▼──┐  ┌───▼─┐  ┌──▼──┐  ┌──▼──┐  ┌──────┐
│ A1  │  │ A2  │  │ A3  │  │ A4  │  │  A5  │
│write│  │analy│  │code │  │resea│  │creat │
└─────┘  └─────┘  └─────┘  └─────┘  └──────┘
All agents are equal peers. No master node.

---

## 🤝 How It Uses Tashi

SwarmDesk uses **FoxMQ** — Tashi's Byzantine fault-tolerant decentralized MQTT
broker — as its coordination backbone.

| Tashi Concept | SwarmDesk Implementation |
|---|---|
| Peer-to-peer mesh | All agents communicate directly via FoxMQ topics |
| Leaderless consensus | Auctioneer is a peer node, not a central server |
| Byzantine fault tolerance | Swarm self-heals when agents drop unexpectedly |
| No single point of failure | Kill any agent — coordination continues |
| Edge-native | Runs fully offline, zero cloud dependency |

### MQTT Topics Used

| Topic | Purpose |
|---|---|
| `swarm/tasks` | New task broadcast to all agents |
| `swarm/bids` | Agents publish their bids |
| `swarm/winner` | Winning agent announced |
| `swarm/results` | Execution result broadcast |
| `swarm/agents/join` | Agent announces presence |
| `swarm/agents/leave` | Agent announces departure |
| `swarm/kill/{id}` | Kill signal for specific agent |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.12+
- Node.js 20+
- Mosquitto MQTT Broker
- Anthropic API Key

### Installation

**1. Clone the repo**
```bash
git clone https://github.com/justme-98/swarmdesk.git
cd swarmdesk
```

**2. Install Python dependencies**
```bash
pip install paho-mqtt fastapi uvicorn websockets anthropic python-dotenv
```

**3. Install frontend dependencies**
```bash
cd frontend
npm install
cd ..
```

**4. Set your API key**
```bash
# Create backend/.env
ANTHROPIC_API_KEY=your_key_here
```

---

### Running the App

**Step 1 · Start Mosquitto broker**
```bash
cd "C:\Program Files\mosquitto"
mosquitto -v
```

**Step 2 · Start the auctioneer**
```bash
cd backend
python auction.py
```

**Step 3 · Start the server**
```bash
cd backend
python server.py
```

**Step 4 · Start the agents (5 separate terminals)**
```bash
python agent.py agent-1
python agent.py agent-2
python agent.py agent-3
python agent.py agent-4
python agent.py agent-5
```

**Step 5 · Start the frontend**
```bash
cd frontend
npm run dev
```

**Step 6 · Open the app**

Visit 👉 http://localhost:5173

---

## 🎮 Using SwarmDesk

### Inject a Task
Type any task in the input box and click **⚡ Inject Task**

Example tasks:
- `Write a tweet about AI robots`
- `Analyze the pros and cons of remote work`
- `Explain blockchain in simple terms`
- `Write a poem about the ocean`

### Watch the Swarm Coordinate
- See all 5 agents bid in the **Live Auction Feed**
- Watch the winning agent **glow green** on the mesh graph
- See the AI-generated result appear in the feed

### Demo Self-Healing
1. Click **Kill agent-2**
2. Watch the node turn red and go offline
3. Inject a new task
4. Watch the remaining 4 agents take over automatically
5. **Self-Heals counter** increments in the stats bar

---

## 📁 Project Structure
swarmdesk/
├── backend/
│   ├── agent.py          # AI agent — bids, wins, executes
│   ├── auction.py        # Leaderless auctioneer peer node
│   ├── server.py         # FastAPI WebSocket bridge
│   └── .env              # API keys
├── frontend/
│   └── src/
│       ├── App.jsx        # Main dashboard
│       ├── MeshGraph.jsx  # Live SVG mesh visualization
│       ├── AuctionFeed.jsx# Scrolling bid/result log
│       └── App.css        # Dark terminal theme
└── README.md

---

## 🧩 Agent Specializations

| Agent | Specialization | Role |
|---|---|---|
| agent-1 | Writing | Tweets, posts, copy |
| agent-2 | Analysis | Data, comparisons |
| agent-3 | Coding | Code, technical tasks |
| agent-4 | Research | Facts, summaries |
| agent-5 | Creative | Stories, poems, ideas |

---

## 🌍 Real World Applications

- **Warehouse Robotics** — AMR fleets self-assign pick tasks without a WMS
- **Disaster Response** — Drone swarms coordinate search coverage offline
- **Industrial IoT** — Factory sensors coordinate without cloud SCADA
- **Decentralized AI Pipelines** — Specialized agents self-organize data processing

---

## 🏆 Why This Wins

- ✅ Zero central orchestrator — truly leaderless
- ✅ Self-healing — Byzantine fault tolerant
- ✅ Edge-native — works fully offline
- ✅ Vendor neutral — any MQTT agent can join
- ✅ Real coordination depth — not just a demo

---

## 👤 Built By

Built for the **Vertex Swarm Challenge 2026** by Nyiam Jennifer 

- 🌐 Track: Agent Economy (Track 3)
- 🛠️ Stack: Python + React + FoxMQ + Claude AI
- ⚡ Protocol: Tashi Vertex / FoxMQ

---

*The future of autonomy is peer-to-peer. Build it here.*
