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
