import { isBrowser } from '../../isBrowser';

/**
 * Enum representing different browsers.
 */
export enum Browser {
  Edge = 'edg',
  EdgeLegacy = 'edge',
  Chrome = 'chrome',
  Explorer = 'explorer',
  Vivaldi = 'vivaldi',
  Yandex = 'yandex',
  Firefox = 'firefox',
  Safari = 'safari',
  Opera = 'opera',
  Samsung = 'samsung',
  UCBrowser = 'ucbrowser',
  Unknown = 'unknown-browser',
}

/**
 * Enum representing different operating systems.
 */
export enum OS {
  Windows = 'windows',
  Mac = 'mac',
  Linux = 'linux',
  Android = 'android',
  iPad = 'ipad',
  iPod = 'ipod',
  iPhone = 'iphone',
  Unknown = 'unknown-os',
}

/**
 * Determine the browser name from the user agent and vendor.
 * @returns {Browser} - Enum indicating the browser type.
 */
export const getBrowserName = (): Browser => {
  if (!isBrowser()) {
    return Browser.Unknown;
  }
  const { userAgent, vendor } = navigator;
  // @ts-ignore
  const ie = !!document.documentMode;
  const edge = userAgent.includes('Edg/');
  const edgeLegacy = userAgent.includes('Edge');
  const opera = userAgent.includes('Opera') || userAgent.includes('OPR');
  const vivaldi = userAgent.includes('Vivaldi');
  const firefox = userAgent.includes('Firefox');
  const uc = userAgent.includes('UCBrowser');
  const samsung = userAgent.includes('SamsungBrowser');
  const yandex = vendor.includes('Yandex');
  const chrome =
    userAgent.includes('CriOS') ||
    (userAgent.includes('Chrom') && !edge && !edgeLegacy && !opera && !yandex && !vivaldi && !samsung && !uc);
  const safari = vendor.includes('Apple') && !chrome;

  switch (true) {
    case chrome:
      return Browser.Chrome;
    case firefox:
      return Browser.Firefox;
    case safari:
      return Browser.Safari;
    case edge:
      return Browser.Edge;
    case edgeLegacy:
      return Browser.EdgeLegacy;
    case ie:
      return Browser.Explorer;
    case opera:
      return Browser.Opera;
    case yandex:
      return Browser.Yandex;
    case vivaldi:
      return Browser.Vivaldi;
    case uc:
      return Browser.UCBrowser;
    case samsung:
      return Browser.Samsung;
    default:
      return Browser.Unknown;
  }
};

export const UNKNOWN_BROWSER_VERSION = 'unknown-browser-version';
/**
 * Type representing the browser version.
 */
type BrowserVersion = typeof UNKNOWN_BROWSER_VERSION | number;

/**
 * Parse version from user agent string.
 * @param {string} prefix - The prefix to search for.
 * @param {Navigator} param1 - Navigator object with userAgent string.
 * @returns {BrowserVersion} - Browser version.
 */
const parseVersion = (prefix: string, { userAgent }: Navigator): BrowserVersion => {
  const start = userAgent.indexOf(prefix);
  if (start !== -1) {
    return parseInt(userAgent.substring(start + prefix.length + 1), 10);
  }

  return UNKNOWN_BROWSER_VERSION;
};

/**
 * Get the browser version for a given browser name.
 * @param {Browser} browser - Enum indicating the browser type.
 * @returns {number | 'unknown-browser-version'} - Browser version.
 */
export const getBrowserVersion = (browser: Browser): number | typeof UNKNOWN_BROWSER_VERSION => {
  if (!isBrowser()) {
    return UNKNOWN_BROWSER_VERSION;
  }
  switch (browser) {
    case Browser.Chrome: {
      const chromeDesktop = parseVersion('Chrome', navigator);
      return chromeDesktop !== UNKNOWN_BROWSER_VERSION ? chromeDesktop : parseVersion('CriOS', navigator);
    }
    case Browser.Firefox:
      return parseVersion('Firefox', navigator);
    case Browser.Safari:
      return parseVersion('Version', navigator);
    case Browser.Edge:
      return parseVersion('Edg', navigator);
    case Browser.EdgeLegacy:
      return parseVersion('Edge', navigator);
    case Browser.Opera:
      return parseVersion('OPR', navigator);
    case Browser.Explorer: {
      const msie = parseVersion('MSIE', navigator);
      return msie !== UNKNOWN_BROWSER_VERSION ? msie : parseVersion('rv', navigator);
    }
    case Browser.Yandex:
      return parseVersion('YaBrowser', navigator);
    case Browser.Vivaldi:
      return parseVersion('Vivaldi', navigator);
    case Browser.Samsung:
      return parseVersion('SamsungBrowser', navigator);
    case Browser.UCBrowser:
      return parseVersion('UCBrowser', navigator);
    default:
      return UNKNOWN_BROWSER_VERSION;
  }
};

/**
 * Determine the operating system from the user agent and platform.
 * @returns {OS} - Enum indicating the operating system.
 */
export const getOS = (): OS => {
  if (!isBrowser()) {
    return OS.Unknown;
  }
  const { userAgent, platform } = navigator;
  const win = platform.includes('Win');
  const mac = platform.includes('Mac');
  const linux = platform.includes('Linux');
  const android = userAgent.includes('Android');
  const ipad = userAgent.includes('iPad');
  const ipod = userAgent.includes('iPod');
  const iphone = userAgent.includes('iPhone');

  switch (true) {
    case win:
      return OS.Windows;
    case mac:
      return OS.Mac;
    case ipad:
      return OS.iPad;
    case ipod:
      return OS.iPod;
    case iphone:
      return OS.iPhone;
    case android:
      return OS.Android;
    case linux:
      return OS.Linux;
    default:
      return OS.Unknown;
  }
};

export const browserNameStr = getBrowserName();
export const browserVersion = getBrowserVersion(browserNameStr);
export const osStr = getOS();

// Export helper APIs for convenience
export const isIE = (): boolean => browserNameStr === Browser.Explorer;
export const isFirefox = (): boolean => browserNameStr === Browser.Firefox;
export const isYandex = (): boolean => browserNameStr === Browser.Yandex;
export const isVivaldi = (): boolean => browserNameStr === Browser.Vivaldi;
export const isEdge = (): boolean => browserNameStr === Browser.Edge;
export const isEdgeLegacy = (): boolean => browserNameStr === Browser.EdgeLegacy;
export const isSamsung = (): boolean => browserNameStr === Browser.Samsung;
export const isUC = (): boolean => browserNameStr === Browser.UCBrowser;
export const isOpera = (): boolean => browserNameStr === Browser.Opera;
export const isChrome = (): boolean => browserNameStr === Browser.Chrome;
export const isSafari = (): boolean => browserNameStr === Browser.Safari;
export const isWindows = (): boolean => osStr === OS.Windows;
export const isMac = (): boolean => osStr === OS.Mac;
export const isLinux = (): boolean => osStr === OS.Linux;
export const isAndroid = (): boolean => osStr === OS.Android;
export const isIPad = (): boolean => osStr === OS.iPad;
export const isIPod = (): boolean => osStr === OS.iPod;
export const isIPhone = (): boolean => osStr === OS.iPhone;
export const isIos = (): boolean => isIPad() || isIPhone() || isIPod();
export const isTouch = (): boolean => {
  return isIPad() || isIPhone() || isIPod() || isAndroid();
};
