const express = require('express');
const app = express();
const port = 3000;
const db = require('./public/js/db');
const path = require('path');
const mysql = require('mysql');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ...

app.get('/bookbus', (req, res) => {
    res.sendFile(__dirname + '/public/views/loginbookbus.html');
  });


// API route to find buses based on from and to locations
app.post('/api/find-buses', (req, res) => {
  const { fromLocation, toLocation } = req.body;

  // Database setup (Replace with your own database configuration)
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Rrs1234',
    database: 'bussystem',
  });

  const selectQuery = `
    SELECT * 
    FROM bus_details
    WHERE \`FROM_LOCATION\` = ? AND \`DESTINATION\` = ?
  `;

  connection.query(selectQuery, [fromLocation, toLocation], (err, results) => {
    if (err) {
      console.error('Error retrieving bus data:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });

  connection.end();
});

// ...

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
