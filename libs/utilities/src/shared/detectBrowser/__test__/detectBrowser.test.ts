import { Browser, OS, UNKNOWN_BROWSER_VERSION, getBrowserName, getBrowserVersion, getOS } from '../src/detectBrowser';

describe('detectBrowser', () => {
  describe('getBrowserName', () => {
    let userAgentSpy: jest.SpyInstance;
    let vendorSpy: jest.SpyInstance;

    beforeEach(() => {
      // Assuming isBrowser is always true for testing environment
      // jest.spyOn(another-module, 'isBrowser').mockReturnValue(true); // Uncomment if isBrowser is from a different module
      userAgentSpy = jest.spyOn(window.navigator, 'userAgent', 'get');
      vendorSpy = jest.spyOn(window.navigator, 'vendor', 'get');
    });

    afterEach(() => {
      userAgentSpy.mockRestore();
      vendorSpy.mockRestore();
    });

    const mockNavigator = (userAgent: string, vendor: string): void => {
      userAgentSpy.mockReturnValue(userAgent);
      vendorSpy.mockReturnValue(vendor);
    };

    // Test cases for each browser
    it('should identify Chrome', () => {
      mockNavigator('Mozilla/5.0 Chrome/...', 'Google Inc.');
      expect(getBrowserName()).toBe(Browser.Chrome);
    });

    it('should identify Firefox', () => {
      mockNavigator('Mozilla/5.0 Firefox/...', '');
      expect(getBrowserName()).toBe(Browser.Firefox);
    });

    it('should identify Safari', () => {
      mockNavigator('Mozilla/5.0 (Macintosh; Intel Mac OS X) AppleWebKit/...', 'Apple Computer, Inc.');
      expect(getBrowserName()).toBe(Browser.Safari);
    });

    it('should identify Edge', () => {
      mockNavigator('Mozilla/5.0 Edg/...', '');
      expect(getBrowserName()).toBe(Browser.Edge);
    });

    it('should identify Edge Legacy', () => {
      mockNavigator('Mozilla/5.0 Edge/...', '');
      expect(getBrowserName()).toBe(Browser.EdgeLegacy);
    });

    it('should identify Internet Explorer', () => {
      // Assuming we can't mock document.documentMode directly, so this test might need adjustments
      mockNavigator('Mozilla/5.0 MSIE ...', '');
      // @ts-ignore
      if (document.documentMode === undefined) {
        // @ts-ignore
        document.documentMode = true;
      }
      expect(getBrowserName()).toBe(Browser.Explorer);
      // @ts-ignore
      document.documentMode = undefined;
    });

    it('should identify Opera', () => {
      mockNavigator('Mozilla/5.0 OPR/...', '');
      expect(getBrowserName()).toBe(Browser.Opera);
    });

    it('should identify Yandex', () => {
      mockNavigator('Mozilla/5.0 YaBrowser/...', 'Yandex');
      expect(getBrowserName()).toBe(Browser.Yandex);
    });

    it('should identify Vivaldi', () => {
      mockNavigator('Mozilla/5.0 Vivaldi/...', '');
      expect(getBrowserName()).toBe(Browser.Vivaldi);
    });

    it('should identify UC Browser', () => {
      mockNavigator('Mozilla/5.0 UCBrowser/...', '');
      expect(getBrowserName()).toBe(Browser.UCBrowser);
    });

    it('should identify Samsung Browser', () => {
      mockNavigator('Mozilla/5.0 SamsungBrowser/...', '');
      expect(getBrowserName()).toBe(Browser.Samsung);
    });

    it('should return Unknown for an unrecognized browser', () => {
      mockNavigator('Unknown Browser User Agent', '');
      expect(getBrowserName()).toBe(Browser.Unknown);
    });
  });

  describe('getBrowserVersion', () => {
    let userAgentSpy: jest.SpyInstance;

    beforeEach(() => {
      userAgentSpy = jest.spyOn(window.navigator, 'userAgent', 'get');
    });

    afterEach(() => {
      userAgentSpy.mockRestore();
    });

    const mockUserAgent = (userAgent: string): void => {
      userAgentSpy.mockReturnValue(userAgent);
    };

    // Tests for different browsers
    it('should get Chrome version', () => {
      mockUserAgent('Mozilla/5.0 Chrome/89.0.4389.82');
      expect(getBrowserVersion(Browser.Chrome)).toBe(89);
    });

    it('should get Firefox version', () => {
      mockUserAgent('Mozilla/5.0 Firefox/85.0');
      expect(getBrowserVersion(Browser.Firefox)).toBe(85);
    });

    it('should get Safari version', () => {
      mockUserAgent('Mozilla/5.0 Version/14.0 Safari/605.1.15');
      expect(getBrowserVersion(Browser.Safari)).toBe(14);
    });

    it('should get Edge version', () => {
      mockUserAgent('Mozilla/5.0 Edg/89.0.774.57');
      expect(getBrowserVersion(Browser.Edge)).toBe(89);
    });

    it('should return UNKNOWN_BROWSER_VERSION for an unknown browser', () => {
      expect(getBrowserVersion(Browser.Unknown)).toBe(UNKNOWN_BROWSER_VERSION);
    });
  });

  describe('getOS', () => {
    let userAgentSpy: jest.SpyInstance;
    let platformSpy: jest.SpyInstance;

    beforeEach(() => {
      userAgentSpy = jest.spyOn(window.navigator, 'userAgent', 'get');
      platformSpy = jest.spyOn(window.navigator, 'platform', 'get');
    });

    afterEach(() => {
      userAgentSpy.mockRestore();
      platformSpy.mockRestore();
    });

    // Test for Windows
    it('should identify Windows OS', () => {
      platformSpy.mockReturnValue('Win32');
      expect(getOS()).toBe(OS.Windows);
    });

    // Test for Mac
    it('should identify Mac OS', () => {
      platformSpy.mockReturnValue('MacIntel');
      expect(getOS()).toBe(OS.Mac);
    });

    // Test for Linux
    it('should identify Linux OS', () => {
      platformSpy.mockReturnValue('Linux x86_64');
      expect(getOS()).toBe(OS.Linux);
    });

    // Test for Android
    it('should identify Android OS', () => {
      userAgentSpy.mockReturnValue('Mozilla/5.0 (Linux; Android 10)');
      expect(getOS()).toBe(OS.Android);
    });

    // Test for iPad
    it('should identify iPad OS', () => {
      userAgentSpy.mockReturnValue('Mozilla/5.0 (iPad; CPU OS 10_3_3)');
      expect(getOS()).toBe(OS.iPad);
    });

    // Test for iPod
    it('should identify iPod OS', () => {
      userAgentSpy.mockReturnValue('Mozilla/5.0 (iPod; CPU iPhone OS 10_3_3)');
      expect(getOS()).toBe(OS.iPod);
    });

    // Test for iPhone
    it('should identify iPhone OS', () => {
      userAgentSpy.mockReturnValue('Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3)');
      expect(getOS()).toBe(OS.iPhone);
    });

    // Test for unknown OS
    it('should return unknown for an unidentifiable OS', () => {
      platformSpy.mockReturnValue('Unknown Platform');
      expect(getOS()).toBe(OS.Unknown);
    });
  });
});
