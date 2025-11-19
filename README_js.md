# ark-asa-save-toolkit-sdk [![CI](https://github.com/pixelfoundries/ark-asa-save-toolkit-sdk/workflows/CI/badge.svg)](https://github.com/pixelfoundries/ark-asa-save-toolkit-sdk/actions?query=workflow%3ACI) [![Browser](https://github.com/pixelfoundries/ark-asa-save-toolkit-sdk/workflows/Browser/badge.svg)](https://github.com/pixelfoundries/ark-asa-save-toolkit-sdk/actions/workflows/browser.yml)

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

```javascript --run
import { AsaSaveFile } from 'ark-asa-save-toolkit-sdk';

AsaSaveFile('TheIsland_WP.ark'); // RESULT
```

## Support

**Node**: `ark-asa-save-toolkit-sdk` [builds are tested](https://github.com/pixelfoundries/ark-asa-save-toolkit-sdk/blob/main/.github/workflows/ci.yml#L26-L27) against node ([LTS releases](https://github.com/nodejs/Release)), plus one prior. E.g. At the time of this writing `node@20` is the "maintenance" release and `node@24` is the "current" release, so `uuid` supports `node@18`-`node@24`.

**Typescript**: TS versions released within the past two years are supported. [source](https://github.com/microsoft/TypeScript/issues/49088#issuecomment-2468723715)

## Known issues

None