const fs = require('fs');
const path = require('path');

function loadEnvCommon() {
  const envCommonPath = path.resolve(process.cwd(), '.env.common');
  const envPath = path.resolve(process.cwd(), '.env');

  // 讀取 .env.common 文件
  let envCommonContent = '';
  try {
    envCommonContent = fs.readFileSync(envCommonPath, 'utf8');
  } catch (error) {
    console.error('Error reading .env.common:', error);
    return;
  }

  // 讀取現有的 .env 文件
  let envContent = '';
  try {
    envContent = fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    // 如果 .env 不存在，我們將創建它
    console.log('.env file does not exist. Creating a new one.');
  }

  // 解析 .env.common 內容
  const envCommonVars = {};
  envCommonContent.split('\n').forEach(line => {
    const [key, value] = line.split('=').map(part => part.trim());
    if (key && value && !key.startsWith('#')) {
      envCommonVars[key] = value;
    }
  });

  // 更新 .env 內容
  let updatedEnvContent = envContent;
  Object.entries(envCommonVars).forEach(([key, value]) => {
    const regex = new RegExp(`^${key}=.*`, 'm');
    if (regex.test(updatedEnvContent)) {
      // 如果變數已存在，更新它
      updatedEnvContent = updatedEnvContent.replace(regex, `${key}=${value}`);
    } else {
      // 如果變數不存在，添加它
      updatedEnvContent += `\n${key}=${value}`;
    }
  });

  // 寫入更新後的內容到 .env 文件
  try {
    fs.writeFileSync(envPath, updatedEnvContent);
    console.log('.env file updated successfully.');
  } catch (error) {
    console.error('Error writing to .env:', error);
  }
}

loadEnvCommon();