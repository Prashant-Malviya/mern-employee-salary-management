const fs = require('fs');
const path = require('path');

const mappings = [
  // UI Strings
  { from: /Data Pegawai/g, to: 'Employee Data' },
  { from: /Nama Pegawai/g, to: 'Employee Name' },
  { from: /Jabatan/g, to: 'Position' },
  { from: /Gaji Pokok/g, to: 'Base Salary' },
  { from: /Gaji/g, to: 'Salary' },
  { from: /Penggajian/g, to: 'Payroll' },
  { from: /Absensi/g, to: 'Attendance' },
  { from: /Tanggal Masuk/g, to: 'Join Date' },
  { from: /Jenis Kelamin/g, to: 'Gender' },
  { from: /Hak Akses/g, to: 'Role' },
  { from: /Data Jabatan/g, to: 'Position Data' },
  { from: /Data Kehadiran/g, to: 'Attendance Data' },
  { from: /Laporan Gaji/g, to: 'Salary Report' },
  { from: /Laporan/g, to: 'Report' },
  { from: /Potongan/g, to: 'Deduction' },

  // Variables and fields
  { from: /data_pegawai/g, to: 'employeeData' },
  { from: /id_pegawai/g, to: 'employeeId' },
  { from: /nama_pegawai/g, to: 'employeeName' },
  { from: /jabatan/g, to: 'position' },
  { from: /gaji/g, to: 'salary' },
  { from: /penggajian/g, to: 'payroll' },
  { from: /absensi/g, to: 'attendance' },
  { from: /tanggal_masuk/g, to: 'joinDate' },
  { from: /jenis_kelamin/g, to: 'gender' },
  { from: /hak_akses/g, to: 'role' },
  { from: /id_jabatan/g, to: 'positionId' },
  { from: /nama_jabatan/g, to: 'positionName' },
  { from: /gaji_pokok/g, to: 'baseSalary' },
  { from: /tj_transport/g, to: 'transportAllowance' },
  { from: /uang_makan/g, to: 'mealAllowance' },
  { from: /jml_potongan/g, to: 'deductionAmount' },
  { from: /potongan/g, to: 'deduction' },
  { from: /kehadiran/g, to: 'attendance' },
  { from: /bulan/g, to: 'month' },
  { from: /hadir/g, to: 'present' },
  { from: /sakit/g, to: 'sick' },
  { from: /alpha/g, to: 'absent' },
  
  // Single word lowercase match for exact variables
  { from: /\bpegawai\b/g, to: 'employee' },
  { from: /\bPegawai\b/g, to: 'Employee' },
  { from: /\bnik\b/g, to: 'nationalId' },
  { from: /\bNIK\b/g, to: 'National ID' }
];

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'db' || file === 'dist' || file === 'build') continue;
    
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile() && (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.css') || fullPath.endsWith('.html'))) {
      if (fullPath.includes('models') && fullPath.endsWith('Model.js')) {
          // Model definitions might have "field: 'nama_pegawai'"
          // We will skip renaming properties inside models because we want to preserve them or handle them specially
          // Actually, replacing all is fine EXCEPT field: '...'
          let content = fs.readFileSync(fullPath, 'utf8');
          // Temporarily hide field mappings
          content = content.replace(/field:\s*'([^']+)'/g, (match, p1) => `FIELD_MAPPING_HIDDEN_${Buffer.from(p1).toString('hex')}`);
          content = content.replace(/tableName:\s*'([^']+)'/g, (match, p1) => `TABLE_MAPPING_HIDDEN_${Buffer.from(p1).toString('hex')}`);
          
          mappings.forEach(({ from, to }) => {
            content = content.replace(from, to);
          });

          // Restore field mappings
          content = content.replace(/FIELD_MAPPING_HIDDEN_([0-9a-f]+)/g, (match, p1) => `field: '${Buffer.from(p1, 'hex').toString('utf8')}'`);
          content = content.replace(/TABLE_MAPPING_HIDDEN_([0-9a-f]+)/g, (match, p1) => `tableName: '${Buffer.from(p1, 'hex').toString('utf8')}'`);
          
          fs.writeFileSync(fullPath, content, 'utf8');
      } else {
          let content = fs.readFileSync(fullPath, 'utf8');
          const original = content;
          mappings.forEach(({ from, to }) => {
            content = content.replace(from, to);
          });
          if (content !== original) {
            fs.writeFileSync(fullPath, content, 'utf8');
          }
      }
    }
  }
}

processDirectory('./Backend');
processDirectory('./Frontend/src');
console.log('Refactoring complete.');
