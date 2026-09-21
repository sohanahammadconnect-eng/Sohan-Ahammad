import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';

const savedPortfolioPath = path.resolve(__dirname, 'public/saved_portfolio.json');

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
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, message: 'Data saved successfully' }));
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: String(err) }));
            }
          });
          return;
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
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
