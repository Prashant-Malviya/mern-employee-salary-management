const fs = require('fs');
const path = require('path');

const renames = [
  { from: /Laporan/g, to: 'Report' },
  { from: /laporan/g, to: 'report' },
  { from: /Transaksi/g, to: 'Transaction' },
  { from: /transaksi/g, to: 'transaction' },
  { from: /Pengaturan/g, to: 'Settings' },
  { from: /pengaturan/g, to: 'settings' },
];

function renameFilesAndDirs(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'db' || file === 'dist' || file === 'build') continue;
    
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    let newName = file;
    renames.forEach(({ from, to }) => {
      newName = newName.replace(from, to);
    });

    const newPath = path.join(dirPath, newName);

    if (stat.isDirectory()) {
      if (fullPath !== newPath) {
        fs.renameSync(fullPath, newPath);
        renameFilesAndDirs(newPath);
      } else {
        renameFilesAndDirs(fullPath);
      }
    } else {
      if (fullPath !== newPath) {
        fs.renameSync(fullPath, newPath);
      }
    }
  }
}

function processContents(dirPath) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'db' || file === 'dist' || file === 'build') continue;
    
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processContents(fullPath);
    } else if (stat.isFile() && (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.css') || fullPath.endsWith('.html'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      renames.forEach(({ from, to }) => {
        content = content.replace(from, to);
      });

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

processContents('./Backend');
processContents('./Frontend/src');

renameFilesAndDirs('./Backend');
renameFilesAndDirs('./Frontend/src');

console.log('Final rename complete.');
