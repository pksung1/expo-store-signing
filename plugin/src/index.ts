import { ConfigPlugin, withAppBuildGradle } from '@expo/config-plugins';
import fs from 'fs';
import path from 'path';

export interface AndroidSigningParams {
  storeFile: string;
  storePassword: string;
  keyAlias: string;
  keyPassword: string;
}

type StoreSigningPluginProps = AndroidSigningParams;

const withStoreSigning: ConfigPlugin<StoreSigningPluginProps> = (config, props) => {
  return withAppBuildGradle(config, (config) => {

    const keystorePath = path.join(process.cwd(), props.storeFile);

    if (!fs.existsSync(keystorePath)) {
      throw new Error(`Keystore file not found at ${keystorePath}. Please check the path and try again.`);
    }

    const content = modifyBuildGradle(config.modResults.contents, {
      ...props,
      storeFile: keystorePath,
    });
    config.modResults.contents = content;

    return config;
  });
};

export function modifyBuildGradle(content: string, params: AndroidSigningParams) {

  const envString = `
        release {
            storeFile file('${params.storeFile}')
            storePassword '${params.storePassword}'
            keyAlias '${params.keyAlias}'
            keyPassword '${params.keyPassword}'
        }`

  content = content.replace(
    /(signingConfigs\s*\{[^}]*debug\s*\{[^}]*\})/s,
    `$1\n${envString}`
  );
  content = content.replace(
    /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig\s+signingConfigs\.debug/,
    '$1signingConfig signingConfigs.release'
  );
  return content;

}

function appendSigningConfig(content: string, params: AndroidSigningParams) {}

export default withStoreSigning;

