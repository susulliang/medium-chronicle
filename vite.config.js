import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

// Custom plugin: serve journals/ directory under /journals/ in dev
function journalsStaticPlugin() {
  return {
    name: 'journals-static',
    configureServer(server) {
      server.middlewares.use('/journals', (req, res, next) => {
        const decodedUrl = decodeURIComponent(req.url);
        const filePath = path.join(process.cwd(), 'journals', decodedUrl);

        try {
          const stat = fs.statSync(filePath);
          if (stat.isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const mimeMap = {
              '.json': 'application/json',
              '.md':   'text/markdown; charset=utf-8',
              '.jpg':  'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.png':  'image/png',
              '.webp': 'image/webp',
              '.svg':  'image/svg+xml',
              '.gif':  'image/gif',
            };
            res.setHeader('Content-Type', mimeMap[ext] || 'application/octet-stream');
            res.setHeader('Cache-Control', 'no-cache');
            fs.createReadStream(filePath).pipe(res);
          } else {
            next();
          }
        } catch {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [journalsStaticPlugin()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    open: true,
  },
});
