FROM python:3.11-slim-bookworm

# The installer requires curl (and certificates) to download the release archive
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates

# Download the latest installer
ADD https://astral.sh/uv/install.sh /uv-installer.sh

# Run the installer then remove it
RUN sh /uv-installer.sh && rm /uv-installer.sh

# Ensure the installed binary is on the `PATH`
ENV PATH="/root/.local/bin/:$PATH"
ENV UV_CACHE_DIR=/opt/uv-cache/

COPY . /tts-script
#COPY ./.python-version ./.python-version
#COPY ./pyproject.toml ./pyproject.toml
#COPY ./uv.lock ./uv.lock
WORKDIR /tts-script
RUN uv pip install -r pyproject.toml --system
