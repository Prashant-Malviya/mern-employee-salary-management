const fs = require('fs');
const path = require('path');

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'db' || file === 'dist' || file === 'build') continue;
    
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && (fullPath.endsWith('.js') || fullPath.endsWith('.jsx'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // Deduplicate object assignments like: employeeId: data.employeeId,\r\n employeeId: data.employeeId,
      content = content.replace(/(\s*)([a-zA-Z0-9_]+):\s*data\.\2,\r?\n\1\2:\s*data\.\2,/g, '$1$2: data.$2,');
      content = content.replace(/(\s*)([a-zA-Z0-9_]+):\s*employee\.\2,\r?\n\1\2:\s*employee\.\2,/g, '$1$2: employee.$2,');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

processDirectory('./Backend');
processDirectory('./Frontend/src');
console.log('Cleanup complete.');
