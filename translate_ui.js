const fs = require('fs');
const path = require('path');

const dict = {
  'Simpan': 'Save',
  'Kembali': 'Back',
  'Berhasil': 'Success',
  'Gagal': 'Failed',
  'Masukkan nomor nationalId': 'Enter National ID',
  'Masukkan nama lengkap': 'Enter full name',
  'Masukkan username': 'Enter username',
  'Masukkan password': 'Enter password',
  'Pilih jenis kelamin': 'Select gender',
  '>Laki-Laki<': '>Male<',
  '>Perempuan<': '>Female<',
  '>Karyawan Tetap<': '>Permanent Employee<',
  '>Karyawan Tidak Tetap<': '>Contract Employee<',
  'Pilih hak akses': 'Select role',
  'Pilih status': 'Select status',
  'Pilih designation': 'Select designation',
  'Konfirmasi password': 'Confirm password',
  'Konfirmasi Password': 'Confirm Password',
  'Nama Lengkap': 'Full Name',
  'Cetak': 'Print',
  'Tambah': 'Add',
  'Hapus': 'Delete',
  'Pilih bulan': 'Select month',
  'Pilih tahun': 'Select year',
  'Tanda Tangan': 'Signature',
  'Dicetak Pada': 'Printed On',
  'Laki-laki': 'Male',
  'Terjadi kesalahan': 'An error occurred'
};

function processContents(dirPath) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    if (file === 'node_modules' || file === '.git') continue;
    
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processContents(fullPath);
    } else if (stat.isFile() && (fullPath.endsWith('.js') || fullPath.endsWith('.jsx'))) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      for (const [id, en] of Object.entries(dict)) {
        content = content.split(id).join(en);
      }

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

processContents('./Frontend/src');
console.log('UI translation complete.');
