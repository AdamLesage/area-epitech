import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'area-mobile',
  webDir: 'dist',
  server: {
    url: 'http://35.180.240.182:8081/',
    cleartext: true
  }
};

export default config;
