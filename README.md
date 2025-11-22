<!--
  -- This file is auto-generated from README_js.md. Changes should be made there.
  -->

# pixel-asa-save-toolkit [![CI](https://github.com/pixelfoundries/pixel-asa-save-toolkit/workflows/CI/badge.svg)](https://github.com/pixelfoundries/pixel-asa-save-toolkit/actions?query=workflow%3ACI) [![Browser](https://github.com/pixelfoundries/pixel-asa-save-toolkit/workflows/Browser/badge.svg)](https://github.com/pixelfoundries/pixel-asa-save-toolkit/actions/workflows/browser.yml)

For reading in and writing out Ark ASA save files including writing out save file data to other formats including JSON.

- **Complete** - Support for all ASA save file objects including Unreal Engine 5.5 format
- **Cross-platform** - Support for...
  - [Typescript](#support)
  - [NodeJS](#support)
- **CLI** - [`ark-asa-save` command line](#command-line) utility

## Quickstart

**1. Install**

```shell
npm install ark-asa-save-toolkit-sdk
```

**2. Create a Save File Object**

```javascript
import { AsaSaveFile } from 'pixel-asa-save-toolkit';

const saveFile = new AsaSaveFile('TheIsland_WP.ark');
```

## Support

**Browsers**: `pixel-asa-save-toolkit` [builds are tested](/pixelfoundries/pixel-asa-save-toolkit/blob/main/wdio.conf.js) against the latest version of desktop Chrome, Safari, Firefox, and Edge. Mobile versions of these same browsers are expected to work but aren't currently tested.

**Node**: `pixel-asa-save-toolkit` [builds are tested](https://github.com/pixelfoundries/pixel-asa-save-toolkit/blob/main/.github/workflows/ci.yml#L26-L27) against node ([LTS releases](https://github.com/nodejs/Release)), plus one prior. E.g. At the time of this writing `node@20` is the "maintenance" release and `node@24` is the "current" release, so `uuid` supports `node@18`-`node@24`.

**Typescript**: TS versions released within the past two years are supported. [source](https://github.com/microsoft/TypeScript/issues/49088#issuecomment-2468723715)

## Known issues

None

---

Markdown generated from [README_js.md](README_js.md) by <a href="https://github.com/broofa/runmd"><image height="13" src="https://camo.githubusercontent.com/5c7c603cd1e6a43370b0a5063d457e0dabb74cf317adc7baba183acb686ee8d0/687474703a2f2f692e696d6775722e636f6d2f634a4b6f3662552e706e67" /></a>
