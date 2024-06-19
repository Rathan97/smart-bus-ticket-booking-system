const express = require('express');
const app = express();
const port = 3000;
const db = require('./public/js/db');
const path = require('path');
const XLSX = require('xlsx');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/views/index1.html');
});

// ...

// Database setup (Replace with your own database configuration)
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rrs1234',
  database: 'bussystem',
});

// ...

// Function to create table based on the Excel data
function createTable(data, callback) {
    const columns = Object.keys(data[0]);
    const columnDefinitions = columns.map(column => {
      const maxLength = Math.max(...data.map(row => row[column] ? row[column].toString().length : 0));
      const columnSize = maxLength > 255 ? maxLength : 255;
      return `${column || 'column'} VARCHAR(${columnSize})`;
    });
    const createTableQuery = `CREATE TABLE IF NOT EXISTS areaslatlon (${columnDefinitions.join(', ')})`;
  
    connection.query(createTableQuery, (err, result) => {
      if (err) {
        console.error('Error creating table:', err);
        callback(err);
        return;
      }
  
      console.log('Table created successfully!');
      callback(null);
    });
  }
  
  // ...
  
  // Function to insert data into the table
  function insertData(data, callback) {
    const columns = Object.keys(data[0]);
    const insertQuery = `INSERT INTO areaslatlon (${columns.join(', ')}) VALUES ?`;
  
    const values = data.map(row => {
      const rowValues = [];
      for (let column of columns) {
        const value = row[column] ? row[column].toString() : null;
        rowValues.push(value);
      }
      return rowValues;
    });
  
    connection.query(insertQuery, [values], (err, result) => {
      if (err) {
        console.error('Error inserting data into the database:', err);
        callback(err);
        return;
      }
  
      console.log('Data inserted successfully!');
      callback(null);
    });
  }
  
  // ...
  

// API route to retrieve locations from Excel file and insert into the database
app.get('/api/locations', (req, res) => {
  const workbook = XLSX.readFile('./bus info/areas latlon.xlsx');
  const sheetName = 'latlon'; // Replace with your sheet name

  const worksheet = workbook.Sheets[sheetName];
  const location = XLSX.utils.sheet_to_json(worksheet);

  // Create table
  createTable(location, (err) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }

    // Insert data
    insertData(location, (err) => {
      if (err) {
        res.status(500).send('Internal Server Error');
        return;
      }

      res.json({ message: 'Data inserted successfully' });
    });
  });
});

// ...

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
