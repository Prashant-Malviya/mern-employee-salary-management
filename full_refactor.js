const fs = require('fs');
const path = require('path');

const renames = [
  { from: /Pegawai/g, to: 'Employee' },
  { from: /pegawai/g, to: 'employee' },
  { from: /Jabatan/g, to: 'Position' },
  { from: /jabatan/g, to: 'position' },
  { from: /Kehadiran/g, to: 'Attendance' },
  { from: /kehadiran/g, to: 'attendance' },
  { from: /Gaji/g, to: 'Salary' },
  { from: /gaji/g, to: 'salary' },
  { from: /Potongan/g, to: 'Deduction' },
  { from: /potongan/g, to: 'deduction' },
  { from: /Kepresentan/g, to: 'Attendance' }, // if any
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
        renameFilesAndDirs(newPath); // Process the renamed directory
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

      // Temporarily hide field mappings
      content = content.replace(/field:\s*'([^']+)'/g, (match, p1) => `FIELD_MAPPING_HIDDEN_${Buffer.from(p1).toString('hex')}`);
      content = content.replace(/tableName:\s*'([^']+)'/g, (match, p1) => `TABLE_MAPPING_HIDDEN_${Buffer.from(p1).toString('hex')}`);

      renames.forEach(({ from, to }) => {
        content = content.replace(from, to);
      });

      // Restore field mappings
      content = content.replace(/FIELD_MAPPING_HIDDEN_([0-9a-f]+)/g, (match, p1) => `field: '${Buffer.from(p1, 'hex').toString('utf8')}'`);
      content = content.replace(/TABLE_MAPPING_HIDDEN_([0-9a-f]+)/g, (match, p1) => `tableName: '${Buffer.from(p1, 'hex').toString('utf8')}'`);

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

// First, process contents so that when files are renamed, the imports are already correct
processContents('./Backend');
processContents('./Frontend/src');

// Then rename the files and directories
renameFilesAndDirs('./Backend');
renameFilesAndDirs('./Frontend/src');

console.log('Full refactoring complete.');
