# @pksung1/expo-store-signing

Android 앱 서명을 위한 Expo config plugin입니다. 이 플러그인은 `build.gradle` 파일을 수정하여 Android 앱의 서명 설정을 자동으로 구성합니다.

이 플러그인은 Expo CNG(Continuous Native Generation)를 위해 설계되었으며, 네이티브 파일을 수동으로 편집하지 않고도 Expo config plugin 시스템을 통해 Android 서명 설정을 구성할 수 있게 해줍니다.

**English**: [README.md](./README.md)

## 설치 (Installation)

```bash
npm install @pksung1/expo-store-signing
# 또는
pnpm add @pksung1/expo-store-signing
# 또는
yarn add @pksung1/expo-store-signing
```

## 사용 방법 (Usage)

### 1. app.config.js 또는 app.json에 플러그인 추가

```javascript
export default {
  expo: {
    // ... 기타 설정
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

### 2. 환경 변수 설정

`.env` 파일에 다음 환경 변수를 설정하세요:

```env
ANDROID_KEYSTORE_PASSWORD=your_keystore_password
ANDROID_KEY_ALIAS=your_key_alias
ANDROID_KEY_PASSWORD=your_key_password
```

### 3. Keystore 파일 준비

프로젝트 루트에 keystore 파일을 배치하세요. 예: `./credentials/prod.keystore`

## 설정 옵션 (Configuration Options)

| 옵션 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `storeFile` | `string` | ✅ | Keystore 파일의 경로 (프로젝트 루트 기준) |
| `storePassword` | `string` | ✅ | Keystore 비밀번호 |
| `keyAlias` | `string` | ✅ | Key alias 이름 |
| `keyPassword` | `string` | ✅ | Key 비밀번호 |

## 동작 방식

이 플러그인은 다음 작업을 수행합니다:

1. **Keystore 파일 검증**: 지정된 경로에 keystore 파일이 존재하는지 확인합니다.
2. **build.gradle 수정**: 
   - `signingConfigs` 블록에 `release` 설정을 추가합니다.
   - `buildTypes`의 `release`에서 `signingConfig signingConfigs.release`를 설정합니다.

### 예시: build.gradle 변경 사항

**변경 전:**
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

**변경 후:**
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

## 주의사항

- ⚠️ Keystore 파일과 비밀번호는 민감한 정보이므로 절대 버전 관리 시스템에 커밋하지 마세요.
- ⚠️ 환경 변수를 사용하여 비밀번호를 관리하는 것을 강력히 권장합니다.
- ⚠️ 프로덕션 빌드 전에 keystore 파일이 올바른 위치에 있는지 확인하세요.

## 요구사항

- Expo SDK 49 이상
- React Native 프로젝트 (bare workflow 또는 prebuild 사용)

## 라이선스

ISC

## 기여 (Contributing)

기여를 환영합니다! [기여 가이드라인](https://github.com/expo/expo#contributing)을 참고해주세요.

