const express = require("express");
const app = express();
const port = 3000;
const mysql = require("mysql");
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// ...

// Database setup (Replace with your own database configuration)
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Rrs1234',
    database: 'bussystem'
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

app.get("/api/from-options", (req, res) => {
  const input = req.query.input || "";

  const selectQuery = `
    SELECT DISTINCT from_location
    FROM bus_details
    WHERE from_location LIKE '%${input}%'
    LIMIT 10
  `;

  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error("Error retrieving 'From' options:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    const options = results.map((result) => result.from_location);
    res.json(options);
  });
});

app.get("/api/to-options", (req, res) => {
  const input = req.query.input || "";

  const selectQuery = `
    SELECT DISTINCT destination
    FROM bus_details
    WHERE destination LIKE '%${input}%'
    LIMIT 10
  `;

  connection.query(selectQuery, (err, results) => {
    if (err) {
      console.error("Error retrieving 'To' options:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    const options = results.map((result) => result.destination);
    res.json(options);
  });
});

app.post("/api/find-buses", (req, res) => {
  const { fromLocation, toLocation } = req.body;

  const selectQuery = `
    SELECT BUS_NUMBERS,FROM_LOCATION,DESTINATION,DISTANCE
    FROM bus_details
    WHERE \`FROM_LOCATION\` = ? AND destination = ?
  `;

  connection.query(selectQuery, [fromLocation, toLocation], (err, results) => {
    if (err) {
      console.error("Error retrieving bus data:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    res.json(results);
  });
});

// ...

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
