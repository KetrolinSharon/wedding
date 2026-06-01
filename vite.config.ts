import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

// Custom plugin to copy root-level or variable-named couple photo / audio files to dist
const copyAssetsPlugin = () => {
  return {
    name: 'copy-assets-plugin',
    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const rootDir = path.resolve(process.cwd(), '.');
      const publicDir = path.resolve(process.cwd(), 'public');

      // Ensure dist folder exists
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }

      const possibleImageNames = [
        'couple_photo.jpg',
        'couple_photo.JPG',
        'couple_photo.jpeg',
        'couple_photo.png',
        'couplephoto.jpeg',
        'couplephoto.jpg',
        'couplephoto.JPG',
        'couple photo.jpg',
        'couple photo.JPG',
        'couple photo.jpeg',
        'couple photo.png',
        'coupleimg',
        'photo'
      ];

      const possibleMusicNames = [
        'wed.mp3',
        'web.mp3',
        'wed.MP3',
        'web.MP3',
        'wed.wav',
        'web.wav'
      ];

      // Copy any image from root or public folder directly to dist/couple_photo.jpg
      let imageCopied = false;
      // 1. Try public path first
      if (fs.existsSync(publicDir)) {
        for (const name of possibleImageNames) {
          const publicPath = path.join(publicDir, name);
          if (fs.existsSync(publicPath)) {
            try {
              fs.copyFileSync(publicPath, path.join(distDir, 'couple_photo.jpg'));
              console.log(`[Plugin] Copied ${name} from public to dist/couple_photo.jpg`);
              imageCopied = true;
              break;
            } catch (e) {
              console.warn(`Failed to copy ${name}:`, e);
            }
          }
        }
      }
      // 2. Try root path if not found in public
      if (!imageCopied) {
        for (const name of possibleImageNames) {
          const rootPath = path.join(rootDir, name);
          if (fs.existsSync(rootPath) && fs.statSync(rootPath).isFile()) {
            try {
              fs.copyFileSync(rootPath, path.join(distDir, 'couple_photo.jpg'));
              console.log(`[Plugin] Copied ${name} from root to dist/couple_photo.jpg`);
              imageCopied = true;
              break;
            } catch (e) {
              console.warn(`Failed to copy ${name} from root:`, e);
            }
          }
        }
      }

      // Copy any music file directly to dist/wed.mp3
      let musicCopied = false;
      // 1. Try public path first
      if (fs.existsSync(publicDir)) {
        for (const name of possibleMusicNames) {
          const publicPath = path.join(publicDir, name);
          if (fs.existsSync(publicPath)) {
            try {
              fs.copyFileSync(publicPath, path.join(distDir, 'wed.mp3'));
              console.log(`[Plugin] Copied ${name} from public to dist/wed.mp3`);
              musicCopied = true;
              break;
            } catch (e) {
              console.warn(`Failed to copy music ${name}:`, e);
            }
          }
        }
      }
      // 2. Try root path if not found
      if (!musicCopied) {
        for (const name of possibleMusicNames) {
          const rootPath = path.join(rootDir, name);
          if (fs.existsSync(rootPath) && fs.statSync(rootPath).isFile()) {
            try {
              fs.copyFileSync(rootPath, path.join(distDir, 'wed.mp3'));
              console.log(`[Plugin] Copied ${name} from root to dist/wed.mp3`);
              musicCopied = true;
              break;
            } catch (e) {
              console.warn(`Failed to copy music ${name} from root:`, e);
            }
          }
        }
      }
      
      // Let's also check for folder issues or literal backslash filenames
      const rootFiles = fs.readdirSync(rootDir);
      for (const f of rootFiles) {
        if (f.includes('\\') || f.includes('/')) {
          try {
            const normalized = f.replace(/\\/g, '/');
            const fileName = path.basename(normalized);
            if (fileName.toLowerCase().includes('wed') || fileName.toLowerCase().includes('web')) {
              fs.copyFileSync(path.join(rootDir, f), path.join(distDir, 'wed.mp3'));
              console.log(`[Plugin] Copied backslashed file ${f} to dist/wed.mp3`);
            }
            if (fileName.toLowerCase().includes('couple') || fileName.toLowerCase().includes('photo')) {
              fs.copyFileSync(path.join(rootDir, f), path.join(distDir, 'couple_photo.jpg'));
              console.log(`[Plugin] Copied backslashed file ${f} to dist/couple_photo.jpg`);
            }
          } catch (e) {
            console.warn(`Failed to process backslashed path ${f}:`, e);
          }
        }
      }
    }
  };
};

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), copyAssetsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
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
