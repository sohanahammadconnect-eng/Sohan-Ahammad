import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { execSync, exec } from 'child_process';
import { defineConfig, Plugin } from 'vite';

const savedPortfolioPath = path.resolve(__dirname, 'public/saved_portfolio.json');
const tsDataPath = path.resolve(__dirname, 'src/portfolioData.ts');

let zipRebuildTimer: NodeJS.Timeout | null = null;
let isBuildingZip = false;

function writePortfolioTsSync(data: any) {
  const personalInfo = data.personalInfo || {};
  const featuredVideo = data.featuredVideo || {};
  const portfolioVideos = data.portfolioVideos || [];
  const graphicItems = data.graphicItems || [];

  const tsContent = `import { VideoItem, GraphicItem } from './types';

export const PERSONAL_INFO = ${JSON.stringify(personalInfo, null, 2)};

export const FEATURED_VIDEO: VideoItem = ${JSON.stringify(featuredVideo, null, 2)};

export const PORTFOLIO_VIDEOS: VideoItem[] = ${JSON.stringify(portfolioVideos, null, 2)};

export const GRAPHIC_ITEMS: GraphicItem[] = ${JSON.stringify(graphicItems, null, 2)};
`;
  fs.writeFileSync(tsDataPath, tsContent, 'utf-8');
}

function scheduleZipRebuild() {
  if (zipRebuildTimer) {
    clearTimeout(zipRebuildTimer);
  }
  zipRebuildTimer = setTimeout(() => {
    if (isBuildingZip) return;
    isBuildingZip = true;
    exec('python3 scripts/update_portfolio_and_zip.py', { cwd: __dirname }, (err) => {
      if (err) {
        console.error('Background ZIP rebuild error:', err);
      }
      isBuildingZip = false;
    });
  }, 500);
}

function portfolioApiPlugin(): Plugin {
  return {
    name: 'portfolio-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/upload-video' && req.method === 'POST') {
          const originalName = decodeURIComponent((req.headers['x-filename'] as string) || 'video.mp4');
          const ext = path.extname(originalName) || '.mp4';
          const safeName = `video_${Date.now()}_${Math.random().toString(36).slice(2, 7)}${ext}`;
          const uploadsDir = path.resolve(__dirname, 'public/uploads');
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          const filePath = path.join(uploadsDir, safeName);
          const writeStream = fs.createWriteStream(filePath);

          req.pipe(writeStream);

          writeStream.on('finish', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                success: true,
                url: `/uploads/${safeName}`,
                filename: safeName,
              })
            );
          });

          writeStream.on('error', (err) => {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: String(err) }));
          });
          return;
        }

        if (req.url === '/api/save-portfolio' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString();
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              fs.writeFileSync(savedPortfolioPath, JSON.stringify(data, null, 2), 'utf-8');
              writePortfolioTsSync(data);

              // Synchronously update public/profile.jpg so Telegram & WhatsApp crawlers get the latest photo
              if (data.profilePic && typeof data.profilePic === 'string' && data.profilePic.includes('base64,')) {
                try {
                  const b64 = data.profilePic.split('base64,')[1];
                  const buffer = Buffer.from(b64, 'base64');
                  fs.writeFileSync(path.resolve(__dirname, 'public/profile.jpg'), buffer);
                  fs.writeFileSync(path.resolve(__dirname, 'profile.jpg'), buffer);
                  const distDir = path.resolve(__dirname, 'dist');
                  if (fs.existsSync(distDir)) {
                    fs.writeFileSync(path.resolve(distDir, 'profile.jpg'), buffer);
                  }
                } catch (imgErr) {
                  console.error('Failed to sync profile.jpg from base64:', imgErr);
                }
              }

              // Schedule non-blocking ZIP rebuild so rapid video link edits never block or drop
              scheduleZipRebuild();

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, message: 'Data saved and synced immediately' }));
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: String(err) }));
            }
          });
          return;
        }

        if (req.url === '/api/rebuild-zip') {
          try {
            execSync('python3 scripts/update_portfolio_and_zip.py', { cwd: __dirname });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: 'ZIP rebuilt successfully' }));
          } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: String(err) }));
          }
          return;
        }

        if (req.url?.startsWith('/api/download-zip')) {
          try {
            execSync('python3 scripts/update_portfolio_and_zip.py', { cwd: __dirname });
          } catch (e) {
            console.error('Failed to rebuild zip before download:', e);
          }
          const zipPath = path.resolve(__dirname, 'public/sohan-portfolio-latest.zip');
          if (fs.existsSync(zipPath)) {
            const stat = fs.statSync(zipPath);
            res.writeHead(200, {
              'Content-Type': 'application/zip',
              'Content-Disposition': 'attachment; filename="sohan-portfolio-latest.zip"',
              'Content-Length': stat.size,
              'Cache-Control': 'no-store, no-cache, must-revalidate',
            });
            const readStream = fs.createReadStream(zipPath);
            readStream.pipe(res);
            return;
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Zip not found' }));
            return;
          }
        }

        if (req.url === '/api/get-portfolio' && req.method === 'GET') {
          if (fs.existsSync(savedPortfolioPath)) {
            const data = fs.readFileSync(savedPortfolioPath, 'utf-8');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
            return;
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ notFound: true }));
            return;
          }
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), portfolioApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
