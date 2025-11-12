import { ExpoConfig } from 'expo/config';
import fs from 'fs/promises';
import path from 'path';
import withStoreSigning, { modifyBuildGradle } from '../src/index';

describe('withStoreSigning', () => {
  const mockConfig: ExpoConfig = {
    name: 'test-app',
    slug: 'test-app',
  };

  

  const mockProps = {
    storeFile: './credentials/prod.keystore',
    storePassword: 'test-password',
    keyAlias: 'test-alias',
    keyPassword: 'test-key-password',
  };

  it('should be defined', () => {
    expect(withStoreSigning).toBeDefined();
  });

  it('should add the signing config', async () => {
    const buildGradleContent = await fs.readFile(path.join(__dirname, 'build.gradle'), 'utf8');
    const content = modifyBuildGradle(buildGradleContent, mockProps);
    console.log(content);
    expect(content).toContain('release {');
    expect(content).toContain('signingConfig signingConfigs.release');
  });
});