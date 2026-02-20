const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function captureChannelScreenshots() {
  // Read the artists JSON file
  const artistsData = JSON.parse(await fs.readFile('./artists.json', 'utf8'));
  
  // Filter out artists without channel_id or with status "not_found"
  const validArtists = artistsData.filter(artist => 
    artist.channel_id && 
    artist.status !== 'not_found'
  );
  
  console.log(`Total artists: ${artistsData.length}`);
  console.log(`Valid artists with channels: ${validArtists.length}`);
  console.log(`Skipping: ${artistsData.length - validArtists.length}\n`);
  
  // Create screenshots directory if it doesn't exist
  const screenshotsDir = './screenshots';
  await fs.mkdir(screenshotsDir, { recursive: true });

  // Launch browser
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  let successCount = 0;
  let errorCount = 0;

  // Process each artist
  for (let i = 0; i < validArtists.length; i++) {
    const artist = validArtists[i];
    try {
      const artistName = artist.artist;
      const channelId = artist.channel_id;
      
      // Construct the YouTube channel URL
      const channelUrl = `https://www.youtube.com/channel/${channelId}`;
      
      console.log(`[${i + 1}/${validArtists.length}] Processing: ${artistName}`);
      console.log(`  Channel: ${artist.channel_title || 'N/A'}`);
      console.log(`  URL: ${channelUrl}`);
      
      // Navigate to the channel
      await page.goto(channelUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // Wait a bit for dynamic content to load
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a safe filename
      const safeFilename = artistName
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();
      
      const screenshotPath = path.join(screenshotsDir, `${safeFilename}.jpg`);
      
      // Take screenshot
      await page.screenshot({ 
        path: screenshotPath,
        type: 'jpeg',
        quality: 75,
        fullPage: false
      });
      
      successCount++;
      console.log(`  ✓ Saved: ${safeFilename}.jpg\n`);
      
    } catch (error) {
      errorCount++;
      console.error(`  ✗ Error: ${error.message}\n`);
    }
  }

  await browser.close();
  console.log('═'.repeat(50));
  console.log(`✓ Screenshots completed!`);
  console.log(`  Success: ${successCount}`);
  console.log(`  Errors: ${errorCount}`);
  console.log(`  Total: ${validArtists.length}`);
}

// Run the script
captureChannelScreenshots().catch(console.error);
