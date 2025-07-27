FROM python:3.13

WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Create and activate virtual environment
RUN python -m venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# Install dependencies in the virtual environment
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the default Flask port
EXPOSE 5000

# Run alembic migrations before starting the app
CMD alembic upgrade head && python app.py