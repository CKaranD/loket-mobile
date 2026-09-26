import settingsReducer from '../settingsSlice';
import { buildWebSocketUrl } from '../settingsUtils';

jest.mock('@sentry/react-native', () => ({
  captureException: jest.fn(),
}));

jest.mock('react-native-permissions', () => jest.requireActual('react-native-permissions/mock'));

jest.mock('@react-native-firebase/messaging', () => jest.fn());

jest.mock('react-native-device-info', () => ({
  getSystemName: jest.fn(),
  getManufacturer: jest.fn(),
  getModel: jest.fn(),
}));

describe('settingsSlice initial state', () => {
  it('points the default websocket at the default installation', () => {
    const { baseUrl, installationUrl, webSocketUrl } = settingsReducer(undefined, {
      type: 'INIT',
    });

    expect(installationUrl).toBe(`https://${baseUrl}/`);
    expect(webSocketUrl).toBe(buildWebSocketUrl(baseUrl));
  });
});
