import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.netlify.portubakery',
  appName: 'Portugal Bakery',
  webDir: 'dist',
  // Only use `server` for live reload during development.
  // For production, comment this out so the app uses the local `dist` build.
  // server: {
  //   url: 'https://portubakery.netlify.app',
  //   cleartext: true
  // }
};

export default config;
