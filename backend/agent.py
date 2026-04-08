import paho.mqtt.client as mqtt
import time
import random
import json
import sys
import os
from anthropic import Anthropic

AGENT_ID = sys.argv[1] if len(sys.argv) > 1 else "agent-1"
BROKER = "localhost"
PORT = 1883

SPECIALIZATIONS = {
    "agent-1": "writing",
    "agent-2": "analysis",
    "agent-3": "coding",
    "agent-4": "research",
    "agent-5": "creative"
}

SPEC = SPECIALIZATIONS.get(AGENT_ID, "general")
client_mqtt = mqtt.Client(client_id=AGENT_ID)
anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
is_alive = True

def on_connect(client, userdata, flags, rc):
    print(f"[{AGENT_ID}] Connected to broker")
    client.subscribe("swarm/tasks")
    client.subscribe("swarm/winner")
    client.subscribe(f"swarm/kill/{AGENT_ID}")
    client.publish("swarm/agents/join", json.dumps({
        "agent_id": AGENT_ID,
        "specialization": SPEC,
        "status": "online"
    }))

def on_message(client, userdata, msg):
    global is_alive
    topic = msg.topic
    payload = json.loads(msg.payload.decode())

    if topic == "swarm/tasks" and is_alive:
        task_id = payload["task_id"]
        task = payload["task"]
        bid_latency = random.randint(50, 150)
        time.sleep(bid_latency / 1000)
        bid = {
            "agent_id": AGENT_ID,
            "task_id": task_id,
            "bid_ms": bid_latency,
            "specialization": SPEC
        }
        print(f"[{AGENT_ID}] Bidding {bid_latency}ms for task: {task[:30]}...")
        client_mqtt.publish("swarm/bids", json.dumps(bid))

    elif topic == "swarm/winner":
        if payload["agent_id"] == AGENT_ID and is_alive:
            task = payload["task"]
            task_id = payload["task_id"]
            print(f"[{AGENT_ID}] WON! Executing task...")
            result = f"Task completed by {AGENT_ID} ({SPEC} specialist): Here is my response to: {task[:50]}"
            client_mqtt.publish("swarm/results", json.dumps({
                "agent_id": AGENT_ID,
                "task_id": task_id,
                "result": result
            }))

    elif topic == f"swarm/kill/{AGENT_ID}":
        is_alive = False
        print(f"[{AGENT_ID}] KILLED — going offline")
        client_mqtt.publish("swarm/agents/leave", json.dumps({
            "agent_id": AGENT_ID,
            "status": "offline"
        }))

client_mqtt.on_connect = on_connect
client_mqtt.on_message = on_message
client_mqtt.connect(BROKER, PORT, 60)
client_mqtt.loop_forever()