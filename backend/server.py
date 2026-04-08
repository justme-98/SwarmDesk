import asyncio
import json
import uuid
import paho.mqtt.client as mqtt
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import threading

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

BROKER = "localhost"
PORT = 1883

connected_websockets = []
mqtt_client = mqtt.Client(client_id="server-bridge")

def on_message(client, userdata, msg):
    topic = msg.topic
    payload = json.loads(msg.payload.decode())
    message = {"topic": topic, "data": payload}
    for ws in connected_websockets[:]:
        try:
            asyncio.run(ws.send_json(message))
        except:
            pass

def start_mqtt():
    mqtt_client.on_message = on_message
    mqtt_client.connect(BROKER, PORT, 60)
    mqtt_client.subscribe("swarm/#")
    mqtt_client.loop_forever()

threading.Thread(target=start_mqtt, daemon=True).start()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connected_websockets.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except:
        if websocket in connected_websockets:
            connected_websockets.remove(websocket)

@app.post("/task")
async def inject_task(body: dict):
    task_id = str(uuid.uuid4())[:8]
    mqtt_client.publish("swarm/tasks", json.dumps({
        "task_id": task_id,
        "task": body["task"]
    }))
    return {"task_id": task_id}

@app.post("/kill/{agent_id}")
async def kill_agent(agent_id: str):
    mqtt_client.publish(f"swarm/kill/{agent_id}", json.dumps({"agent_id": agent_id}))
    return {"killed": agent_id}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)