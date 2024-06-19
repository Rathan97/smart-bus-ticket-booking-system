const XLSX = require('xlsx');

function readExcel(filePath, sheetName, columnName) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);

  return data.map(row => row[columnName]);
}

module.exports = readExcel;
