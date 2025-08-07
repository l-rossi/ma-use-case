FROM python:3.13-alpine

WORKDIR /app

COPY requirements.txt .

RUN python -m venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

SHELL ["/bin/sh", "-c"]
CMD alembic upgrade head && gunicorn --bind 0.0.0.0:5000 --workers 4 app:app
