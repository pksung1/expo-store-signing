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

  // signingConfigs 블록을 정확하게 찾기
  const signingConfigsBlock = findSigningConfigsBlock(content);
  
  if (signingConfigsBlock) {
    let innerContent = signingConfigsBlock.inner;
    
    // 내부에서 release 블록만 제거
    innerContent = innerContent.replace(/\n\s+release\s*\{[\s\S]*?\n\s+\}/, '');
    
    // debug 블록 다음에 release 블록 추가
    const debugBlockRegex = /(\s+debug\s*\{[\s\S]*?\n\s+\})/;
    if (debugBlockRegex.test(innerContent)) {
      innerContent = innerContent.replace(debugBlockRegex, `$1${envString}`);
    } else {
      // debug 블록이 없으면 바로 추가
      innerContent = envString + '\n' + innerContent;
    }
    
    // 전체 내용 교체
    const beforeBlock = content.substring(0, signingConfigsBlock.start);
    const afterBlock = content.substring(signingConfigsBlock.end + 1);
    const newSigningConfigs = `signingConfigs {${innerContent}}`;
    content = beforeBlock + newSigningConfigs + afterBlock;
  } else {
    // signingConfigs 블록이 없으면 새로 추가
    content = content.replace(
      /(android\s*\{[\s\S]*?)(\n\s+\})/,
      `$1    signingConfigs {${envString}    }$2`
    );
  }

  // buildTypes의 release에서 signingConfig를 release로 변경
  content = content.replace(
    /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?)signingConfig\s+signingConfigs\.debug/,
    '$1signingConfig signingConfigs.release'
  );
  
  return content;

}

function findSigningConfigsBlock(content: string) {
  const startRegex = /signingConfigs\s*\{/;
  const match = content.match(startRegex);
  if (!match || match.index === undefined) return null;
  
  let depth = 0;
  let startIndex = match.index + match[0].length - 1; // '{' 위치
  let inString = false;
  
  for (let i = startIndex; i < content.length; i++) {
    // 문자열 처리 로직...
    if (content[i] === '{') depth++;
    if (content[i] === '}') {
      depth--;
      if (depth === 0) {
        return {
          start: match.index,
          end: i,
          inner: content.substring(startIndex + 1, i)
        };
      }
    }
  }
  return null;
}

export default withStoreSigning;

