FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright \
    STORAGE_ROOT=/app/storage

COPY scraper_service/requirements.txt /tmp/requirements.txt
RUN pip install --no-cache-dir -r /tmp/requirements.txt && playwright install --with-deps chromium

COPY . /app

EXPOSE 8001

CMD ["uvicorn", "scraper_service.app.main:app", "--host", "0.0.0.0", "--port", "8001"]
