## Requirements
- python 3.11+
- npm
- [Ollama](https://ollama.com/) accessible via http://localhost:11434 

## Setup

```bash
git clone git@github.com:maparham/chat_cv.git
```

Assuming you have python3.13:
```bash
cd chat_cv/backend
python3.13 -m venv .venv
```

```bash
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app
```

In a second terminal:
```bash
cd chat_cv/frontend
npm install
npm run dev
```

Open
http://localhost:5173
