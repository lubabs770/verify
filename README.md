>claude pepsi

run claude dangerously allow permission sandbox

```
services:
  claude:
    container_name: claude
    build:
      context: .
      dockerfile_inline: |
        FROM node:20-bookworm-slim
        RUN apt-get update && apt-get install -y --no-install-recommends \
            git ca-certificates curl && rm -rf /var/lib/apt/lists/*
        RUN npm install -g @anthropic-ai/claude-code
        WORKDIR /workspace
        RUN useradd -m -s /bin/bash claude && chown -R claude:claude /workspace
        USER claude
        ENTRYPOINT ["/bin/bash", "-c", "git config --global user.name \"$${GIT_USER_NAME}\" && git config --global user.email \"$${GIT_USER_EMAIL}\" && exec claude --dangerously-skip-permissions"]
    stdin_open: true
    tty: true
    working_dir: /workspace
    environment:
      ANTHROPIC_API_KEY: "sk-ant-xxxxxxxxxxxxxxxx"
      # ANTHROPIC_BASE_URL: "https://your-gateway.example.com"
      GIT_USER_NAME: "Your Name"
      GIT_USER_EMAIL: "you@example.com"
    volumes:
      - ./workspace:/workspace
      - claude-config:/home/claude/.claude

volumes:
  claude-config:
```





<br>

>verify





a docker container for streamlining the verification of JSON of youtube channel URL's by means of human in the loop

takes a JSON of [unverified] youtube channels pops the channel open in pupeteer (headlessly) screenshots  and saves as ``` $artist ```.jpeg for visual ID/verification

<br>

I was having architecture issues on mac with pupeteer's official docker image so it was done like this....

```
FROM node:18

# Install Puppeteer with Chromium
WORKDIR /app

# Set Puppeteer to skip downloading Chromium (we'll use system Chrome)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Install Chromium for ARM/x86
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-sandbox \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install puppeteer
RUN npm install puppeteer

# Copy script files
COPY youtube-screenshot.js .
COPY youtube_artist_channels.json artists.json

# Create screenshots directory
RUN mkdir -p /app/screenshots

CMD ["node", "youtube-screenshot.js"]

```


<br>
<br>



pass the "-v" flag to bind its volume to your local machine, otherwise you'll lose everything on exit, something like this
```

docker build -t screenshot .
docker run -v ~/Downloads/screenshots:/app/screenshots screenshot
````

bring your own json (its expecting some nulls and at least a artist field and channel field), like this... 
```
{
artist: "some artist",
channel_id: "UCxxxxxxxxxxxxxxxxxxxx",
channel_title: "some text",
subscribers: "@other",
status: "found" },
{
artist: "46 Street",
channel_id: null,
channel_title: null,
subscribers: null,
status: "not_found" },

```
<br>
<br>

the docker file is expecting a specific name of the .js script, make sure its right

