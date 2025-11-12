# @pksung1/expo-store-signing

Expo config plugin for Android store signing. This plugin automatically configures your Android app's signing configuration by modifying the `build.gradle` file.

This plugin is designed for Expo CNG (Continuous Native Generation), allowing you to configure Android signing settings through the Expo config plugin system without manually editing native files.

**한국어 문서**: [README.ko.md](./README.ko.md)

## Installation

```bash
npm install @pksung1/expo-store-signing
# or
pnpm add @pksung1/expo-store-signing
# or
yarn add @pksung1/expo-store-signing
```

## Usage

### 1. Add the plugin to app.config.js or app.json

```javascript
export default {
  expo: {
    // ... other config
    plugins: [
      [
        "@pksung1/expo-store-signing",
        {
          storeFile: "./credentials/prod.keystore",
          storePassword: process.env.ANDROID_KEYSTORE_PASSWORD,
          keyAlias: process.env.ANDROID_KEY_ALIAS,
          keyPassword: process.env.ANDROID_KEY_PASSWORD,
        },
      ],
    ],
  },
};
```

### 2. Set up environment variables

Add the following environment variables to your `.env` file:

```env
ANDROID_KEYSTORE_PASSWORD=your_keystore_password
ANDROID_KEY_ALIAS=your_key_alias
ANDROID_KEY_PASSWORD=your_key_password
```

### 3. Prepare keystore file

Place your keystore file in the project root. Example: `./credentials/prod.keystore`

## Configuration Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `storeFile` | `string` | ✅ | Path to the keystore file (relative to project root) |
| `storePassword` | `string` | ✅ | Keystore password |
| `keyAlias` | `string` | ✅ | Key alias name |
| `keyPassword` | `string` | ✅ | Key password |

## How It Works

This plugin performs the following operations:

1. **Keystore file validation**: Verifies that the keystore file exists at the specified path.
2. **build.gradle modification**: 
   - Adds a `release` configuration to the `signingConfigs` block.
   - Sets `signingConfig signingConfigs.release` in the `release` build type.

### Example: build.gradle Changes

**Before:**
```gradle
android {
    signingConfigs {
        debug {
            // debug config
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.debug
        }
    }
}
```

**After:**
```gradle
android {
    signingConfigs {
        debug {
            // debug config
        }
        release {
            storeFile file('/path/to/your/keystore')
            storePassword 'your_store_password'
            keyAlias 'your_key_alias'
            keyPassword 'your_key_password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

## Important Notes

- ⚠️ Never commit keystore files and passwords to version control systems.
- ⚠️ It is strongly recommended to use environment variables to manage passwords.
- ⚠️ Verify that the keystore file is in the correct location before production builds.

## Requirements

- Expo SDK 49 or higher
- React Native project (bare workflow or using prebuild)

## License

ISC

## Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide](https://github.com/expo/expo#contributing).
