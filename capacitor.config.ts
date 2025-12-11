import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.netlify.portubakery',
  appName: 'Portugal Bakery',
  webDir: 'dist',
  server: {
    url: 'https://portubakery.netlify.app', // live website
    cleartext: true // allows HTTP if needed (not required for HTTPS)
  }
};

export default config;
