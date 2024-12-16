import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'area-mobile',
  webDir: 'dist',
  server: {
    url: 'http://13.39.148.166:8081/',
    cleartext: true
  }
};

export default config;
