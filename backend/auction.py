import paho.mqtt.client as mqtt
import json
import time
import threading

BROKER = "localhost"
PORT = 1883

pending_tasks = {}
client_mqtt = mqtt.Client(client_id="auctioneer")

def resolve_auction(task_id):
    if task_id not in pending_tasks:
        return
    data = pending_tasks[task_id]
    bids = data["bids"]
    if not bids:
        print(f"[AUCTIONEER] No bids for {task_id} — re-broadcasting")
        client_mqtt.publish("swarm/tasks", json.dumps({
            "task_id": task_id,
            "task": data["task"]
        }))
        return
    winner = min(bids, key=lambda x: x["bid_ms"])
    print(f"[AUCTIONEER] Winner: {winner['agent_id']} with {winner['bid_ms']}ms")
    client_mqtt.publish("swarm/winner", json.dumps({
        "agent_id": winner["agent_id"],
        "task_id": task_id,
        "task": data["task"],
        "bid_ms": winner["bid_ms"]
    }))
    del pending_tasks[task_id]

def on_message(client, userdata, msg):
    topic = msg.topic
    payload = json.loads(msg.payload.decode())

    if topic == "swarm/tasks":
        task_id = payload["task_id"]
        pending_tasks[task_id] = {
            "task": payload["task"],
            "bids": [],
            "task_id": task_id
        }
        timer = threading.Timer(0.6, resolve_auction, args=[task_id])
        pending_tasks[task_id]["timer"] = timer
        timer.start()

    elif topic == "swarm/bids":
        task_id = payload["task_id"]
        if task_id in pending_tasks:
            pending_tasks[task_id]["bids"].append(payload)

client_mqtt.on_message = on_message
client_mqtt.connect(BROKER, PORT, 60)
client_mqtt.subscribe("swarm/tasks")
client_mqtt.subscribe("swarm/bids")
print("[AUCTIONEER] Running...")
client_mqtt.loop_forever()