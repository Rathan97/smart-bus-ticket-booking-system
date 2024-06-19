const XLSX = require('xlsx');
const workbook = XLSX.readFile('data.xlsx');
const sheetName = 'list'; // Replace with your sheet name

const worksheet = workbook.Sheets[sheetName];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

console.log(jsonData);
