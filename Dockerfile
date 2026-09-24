FROM node:20-slim

WORKDIR /workspace

ENV PATH=/workspace/node_modules/.bin:$PATH

COPY package.json ./
RUN npm install

ENTRYPOINT []
CMD ["vitest", "run"]
