import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      {
        name: 'better-auth-server',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url?.split('?')[0] === '/api/auth/config') {
              try {
                const { ensureAuthDatabase, googleOAuthConfigured } = await import('./src/server/auth.ts');
                await ensureAuthDatabase();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Cache-Control', 'no-store');
                res.end(JSON.stringify({ googleEnabled: googleOAuthConfigured }));
              } catch (err) {
                next(err);
              }
              return;
            }

            if (req.url && (req.url === '/api/auth' || req.url.startsWith('/api/auth/') || req.url.startsWith('/api/auth?'))) {
              try {
                const { toNodeHandler } = await import('better-auth/node');
                const { auth, ensureAuthDatabase } = await import('./src/server/auth.ts');
                await ensureAuthDatabase();
                return toNodeHandler(auth)(req, res);
              } catch (err) {
                console.error('Better Auth error in middleware:', err);
                next(err);
                return;
              }
            }
            next();
          });
        }
      }
    ],
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
