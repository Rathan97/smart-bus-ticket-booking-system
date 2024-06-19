const express = require('express');
const app = express();
const xlsx = require('xlsx');

// Read the Excel file
const workbook = xlsx.readFile('data.xlsm');
const worksheet = workbook.Sheets['list'];
const data = xlsx.utils.sheet_to_json(worksheet);

// Route to retrieve dropdown data
app.get('/dropdown-data', (req, res) => {
  // Extract the desired column from the Excel data
  const locations = data.map((row) => row.List);

  // Send the data as JSON
  res.json(locations);
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
