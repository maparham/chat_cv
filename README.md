Requirements
- python 3.11+
- npm
- Ollam: http://localhost:11434 

```bash
git clone git@github.com:maparham/chat_cv.git
```

```bash
cd chat_cv/backend
python3.13 -m venv .venv
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
