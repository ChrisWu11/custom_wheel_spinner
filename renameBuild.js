// renameBuild.js
const fs = require('fs');
const path = require('path');

const oldPath = path.join(__dirname, 'build');
const newPath = path.join(__dirname, 'docs');

if (fs.existsSync(newPath)) {
  fs.rmSync(newPath, { recursive: true, force: true }); // 先删除已存在的 docs
}

if (fs.existsSync(oldPath)) {
  fs.renameSync(oldPath, newPath);
  console.log('✅ build 文件夹已重命名为 docs');
} else {
  console.log('❌ build 文件夹不存在');
}
