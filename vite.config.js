import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default ({ mode }) => {
  return defineConfig({
    plugins: [react(), VitePWA()],
    define: {
      'process.env.NODE_ENV': `"${mode}"`,
    },
  });
};
