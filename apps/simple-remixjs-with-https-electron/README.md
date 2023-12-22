# Overview

This repository contains a demonstration of a RemixJS application integrated with Electron, created within an NX workspace. The project, named **_`"simple-remixjs-with-https-electron"`_**, showcases how to build cross-platform desktop applications using web technologies and serves as a starting point for developers exploring RemixJS and Electron.

# Limitations

### MacOS Platform Build Limitation

This application has not been tested on the macOS platform due to the absence of code signing. The main reason for this limitation is the lack of a paid Apple developer account, which is necessary for code signing and distributing software securely on macOS. For more information on code signing in Electron, you can refer to the [Electron-builder code signing documentation](https://www.electron.build/code-signing). Additionally, the package [electron/notarize](https://github.com/electron/notarize) could be used for notarization once code signing is possible.

- https://support.magplus.com/hc/en-us/articles/203808748-iOS-Creating-a-Distribution-Certificate-and-p12-File
- https://www.youtube.com/watch?v=WnipZaYslRc&list=PLldmJwQKsCV5uSi1lvzljZXNUVVPrhCkR&index=12

##### Build assets

- build-assets
  - build-mac.sh
  - mac-cert.p12
  - win-cert.pfx

###### build-mac.sh

```bash
export CSC_LINK="$(pwd)/build-assets/mac-cert.p12"
export CSC_KEY_PASSWORD="password"
yarn build
```

###### build-win.cmd

```bash
set CSC_LINK=%cd%\build-assets\win-cert.pfx
set CSC_KEY_PASSWORD=password
yarn build
```

###### Update electron-builder configs

- Ignore `build-assets` when build
- `forceCodeSigning` should be `true`

###### Run

```bash
chmod +x build-assets/build-mac.sh

./build-assets/build-mac.sh
```

# Example configure file

```javascript
"use strict";

const builder = require("electron-builder");
const Platform = builder.Platform;

// Let's get that intellisense working
/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const options = {
  protocols: {
    name: "Deeplink Example",
    // Don't forget to set `MimeType: "x-scheme-handler/deeplink"` for `linux.desktop` entry!
    schemes: ["deeplink"],
  },

  // "store” | “normal” | "maximum". - For testing builds, use 'store' to reduce build time significantly.
  compression: "normal",
  removePackageScripts: true,

  afterSign: async (context) => {
    // Mac releases require hardening+notarization: https://developer.apple.com/documentation/xcode/notarizing_macos_software_before_distribution
    if (!isDebug && context.electronPlatformName === "darwin") {
      await notarizeMac(context);
    }
  },
  artifactBuildStarted: (context) => {
    identifyLinuxPackage(context);
  },
  afterAllArtifactBuild: (buildResult) => {
    return stampArtifacts(buildResult);
  },
  // force arch build if using electron-rebuild
  beforeBuild: async (context) => {
    const { appDir, electronVersion, arch } = context;
    await electronRebuild.rebuild({ buildPath: appDir, electronVersion, arch });
    return false;
  },
  nodeGypRebuild: false,
  buildDependenciesFromSource: false,

  directories: {
    output: "dist/artifacts/local",
    buildResources: "installer/resources",
  },
  files: ["out"],
  extraFiles: [
    {
      from: "build/Release",
      to: nodeAddonDir,
      filter: "*.node",
    },
  ],

  win: {
    target: "nsis",
  },
  nsis: {
    deleteAppDataOnUninstall: true,
    include: "installer/win/nsis-installer.nsh",
  },

  mac: {
    target: "dmg",
    hardenedRuntime: true,
    gatekeeperAssess: true,
    extendInfo: {
      NSAppleEventsUsageDescription: "Let me use Apple Events.",
      NSCameraUsageDescription: "Let me use the camera.",
      NSScreenCaptureDescription: "Let me take screenshots.",
    },
  },
  dmg: {
    background: "installer/mac/dmg-background.png",
    iconSize: 100,
    contents: [
      {
        x: 255,
        y: 85,
        type: "file",
      },
      {
        x: 253,
        y: 325,
        type: "link",
        path: "/Applications",
      },
    ],
    window: {
      width: 500,
      height: 500,
    },
  },

  linux: {
    desktop: {
      StartupNotify: "false",
      Encoding: "UTF-8",
      MimeType: "x-scheme-handler/deeplink",
    },
    target: ["AppImage", "rpm", "deb"],
  },
  deb: {
    priority: "optional",
    afterInstall: "installer/linux/after-install.tpl",
  },
  rpm: {
    fpm: ["--before-install", "installer/linux/before-install.tpl"],
    afterInstall: "installer/linux/after-install.tpl",
  },
};

// Promise is returned
builder
  .build({
    targets: Platform.MAC.createTarget(),
    config: options,
  })
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error(error);
  });
```
