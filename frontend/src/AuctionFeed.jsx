const COLORS = { 
  bid: "#00d4ff", 
  win: "#00ff88", 
  result: "#ffffff", 
  kill: "#ff4444", 
  task: "#ffaa00" 
}

export default function AuctionFeed({ events }) {
  return (
    <div className="feed">
      <h3>Live Auction Feed</h3>
      <div className="feed-list">
        {events.length === 0 && <p className="empty">Waiting for tasks...</p>}
        {events.map((e, i) => (
          <div key={i} className="feed-item" style={{ borderLeftColor: COLORS[e.type] }}>
            <span className="feed-time">{e.time}</span>
            <span className="feed-text">{e.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}