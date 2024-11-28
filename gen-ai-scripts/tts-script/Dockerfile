FROM python:3.11-slim-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates

ADD https://astral.sh/uv/install.sh /uv-installer.sh

RUN sh /uv-installer.sh && rm /uv-installer.sh

ENV PATH="/root/.local/bin/:$PATH"
ENV UV_CACHE_DIR=/opt/uv-cache/

COPY . /tts-script

WORKDIR /tts-script
RUN uv pip install -r pyproject.toml --system

ENTRYPOINT ["/tts-script/run-worker.sh"]
