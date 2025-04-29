```bash
git clone git@github.com:maparham/chat_cv.git
```

```bash
cd chat_cv/backend
python -m venv .venv
source .vend/bin/activate
pip install -r requirements.txt
uvicorn app:app
```

```bash
cd ../frontend
npm install
npm start dev
```
