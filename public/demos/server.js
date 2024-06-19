const express = require('express');
const app = express();
const XLSX = require('xlsx');

// Specify the file path of the Excel file
const filePath = 'data.xlsx';

// API endpoint for retrieving places data
app.get('/places', (req, res) => {
  // Load the workbook
  const workbook = XLSX.readFile(filePath);

  // Choose the sheet you want to read
  const sheetName = 'list';
  const sheet = workbook.Sheets[sheetName];

  // Convert the sheet data to JSON format
  const jsonData = XLSX.utils.sheet_to_json(sheet);

  // Send the JSON data as a response
  res.json(jsonData);
});


app.get('/loginbookbus.html', (req, res) => {
    res.sendFile(__dirname + '/loginbookbus.html');
  });

  

// Serve the loginbookbus.html page
app.use(express.static('public'));

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
