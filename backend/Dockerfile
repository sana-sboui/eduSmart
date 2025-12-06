FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# system deps (postgres client, build tools)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential libpq-dev gettext curl \
 && rm -rf /var/lib/apt/lists/*

COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# copy project
COPY . /app

# create a non-root user if desired
RUN useradd -m appuser
RUN chown -R appuser:appuser /app
USER appuser

# collectstatic (if needed)
# RUN python manage.py collectstatic --no-input

EXPOSE 8000
# start Daphne (channels)
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "backendEduSmart.asgi:application"]