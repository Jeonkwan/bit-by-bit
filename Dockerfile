FROM node:20-slim

WORKDIR /workspace

ENV PATH=/workspace/node_modules/.bin:$PATH

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g makecode

COPY package.json ./
RUN npm install

ENTRYPOINT []
CMD ["vitest", "run"]

