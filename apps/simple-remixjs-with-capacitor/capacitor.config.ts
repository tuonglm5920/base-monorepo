import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'simple-remixjs-with-capacitor',
  server: {
    url: 'http://localhost:3000',
    cleartext: true,
  },
};

export default config;
