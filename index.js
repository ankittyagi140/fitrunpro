/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Add error handling
if (__DEV__) {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (args[0]?.includes?.('RCTBridge required dispatch_sync')) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

AppRegistry.registerComponent(appName, () => App);
