import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function devCsp(): Plugin {
  return {
    name: 'dev-csp',
    apply: 'serve',
    transformIndexHtml(html) {
      return html.replace(
        "script-src 'self'",
        "script-src 'self' 'unsafe-inline'",
      );
    },
  };
}

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), devCsp()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
});
