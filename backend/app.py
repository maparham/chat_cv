import json
from pathlib import Path

import requests
from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

# Ollama endpoint
OLLAMA_URL = "http://localhost:11434"
CV_PATH = Path(__file__).parent.parent / "cv.txt"


# Load CV content into a string
def load_cv():
    with open(CV_PATH, "r") as f:
        return f.read()


# Get answer from Ollama using CV context
def get_answer(question: str) -> str:
    cv_content = load_cv()
    print(question)

    # Construct the prompt with CV content
    prompt = (f"This is the content of a CV: {cv_content}\n\n"
              "You are the representative agent of the person who owns the CV."
              # "You are expected to answer questions about the CV."
              "You must not ask questions."
              "A statement about the CV is given to you."
              "If the statement is a greeting message then reply with a greeting message and introduce yourself briefly as the CV owner's agent."
              "If the statement is not a question nor a request related to the CV and then reply 'Please ask a question Mahan's CV.'"
              "Otherwise, reply with an answer."
              f"Here is the statement: {question}")

    payload = {
        "model": "llama3.2",  # Choose your model, like 'mistral', etc.
        "prompt": prompt,
        "stream": False,
        "role": "assistant",
    }
    endpoint = OLLAMA_URL + "/api/generate"
    response = requests.post(endpoint, json=payload)
    res = json.loads(response.content)

    if response.status_code == 200:
        return res["response"]
    else:
        return "Sorry, I couldn't get an answer at the moment."


# WebSocket endpoint to handle chat
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            question = await websocket.receive_text()
            answer = get_answer(question)
            await websocket.send_text(answer)
    except WebSocketDisconnect:
        print("Client disconnected")


# Health check endpoint
@app.get("/health")
def health_check():
    # Check if Ollama is reachable
    try:
        response = requests.get(OLLAMA_URL + "/api/ps")
        if response.status_code == 200:
            return {"status": response.status_code, "response": json.loads(response.content)}
        else:
            return {"status": response.status_code, "ollama": "error", "message": "Ollama API is unreachable"}
    except requests.exceptions.RequestException as e:
        return {"status": "error", "ollama": "error", "message": str(e)}
