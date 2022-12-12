FROM python:3.9-slim-buster

WORKDIR /app/

RUN apt-get update && apt-get install -y --no-install-recommends \
      libprotobuf-dev \
      # libgtk2.0-dev \
      # pkg-config \
      protobuf-compiler\
      cmake \
      build-essential \
      && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt

COPY ./app/start.sh /start.sh
RUN chmod +x /start.sh

COPY ./gunicorn_conf.py /gunicorn_conf.py

COPY ./app/start-reload.sh /start-reload.sh

RUN chmod +x /start-reload.sh

COPY ./app /app
WORKDIR /app/

ENV PYTHONPATH=/app

EXPOSE 8000

RUN pip install --upgrade pip && pip install -r requirements.txt

CMD ["/start.sh"]

