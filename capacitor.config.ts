import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'practice_mobile',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
  },
  android: {
    // Allow HTTP (cleartext) traffic — equivalent to android:usesCleartextTraffic="true"
    allowMixedContent: true,
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
