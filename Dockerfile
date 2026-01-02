FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Ab path change hoga kyunki file bahar hai
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pura backend folder copy karein
COPY backend/ .

# Hugging Face default port use karein
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "7860"]