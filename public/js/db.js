const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'Rrs1234',
  database: 'bussystem'
});

function insertUser(fullname, email, mobilenumber, password, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      callback(err);
      return;
    }

    const insertDataQuery = `
      INSERT INTO passengers (fullname, email, mobilenumber, password)
      VALUES (?,?,?,?)
    `;

    connection.query(insertDataQuery, [fullname, email, mobilenumber, password], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error inserting data:', err);
        callback(err);
        return;
      }

      callback(null, results);
    });
  });
}

function getUser(mobilenumber, password, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      callback(err);
      return;
    }

    const selectDataQuery = `
      SELECT mobilenumber,password FROM passengers
      WHERE mobilenumber = ? AND password = ?
    `;

    connection.query(selectDataQuery, [mobilenumber, password], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error retrieving data:', err);
        callback(err);
        return;
      }

      callback(null, results);
    });
  });
}


function getUserDetails(mobilenumber, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      callback(err);
      return;
    }

  const Userquery = `SELECT id, fullname,email, mobilenumber FROM passengers WHERE mobilenumber = ?`;
  connection.query(Userquery, [mobilenumber], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (results.length > 0) {
      const user = results[0];
      callback(null, user);
    } else {
      callback(null, null);
    }
  });
});
}

function get(input, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      callback(err);
      return;
    }

    const selectQuery = `
      SELECT DISTINCT from_location
      FROM bus_details
      WHERE from_location LIKE '%${input}%'
      LIMIT 10
    `;

    connection.query(selectQuery, (err, results) => {
      connection.release();

      if (err) {
        console.error("Error retrieving 'To' options:", err);
        callback(err);
        return;
      }

      callback(null, results);
    });
  });
}

function getto(input, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      callback(err);
      return;
    }

    const selectQuery = `
      SELECT DISTINCT destination
      FROM bus_details
      WHERE destination LIKE '%${input}%'
      LIMIT 10
    `;

    connection.query(selectQuery, (err, results) => {
      connection.release();

      if (err) {
        console.error("Error retrieving 'To' options:", err);
        callback(err);
        return;
      }

      callback(null, results);
    });
  });
}

function getstod(fromLocation, toLocation, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      callback(err);
      return;
    }

    const selectQuery = `
      SELECT BUS_NUMBERS, FROM_LOCATION, DESTINATION, DISTANCE
      FROM bus_details
      WHERE \`FROM_LOCATION\` = ? AND DESTINATION = ?
    `;

    connection.query(selectQuery, [fromLocation, toLocation], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error retrieving data:', err);
        callback(err);
        return;
      }

      callback(null, results);
    });
  });
}
  function getCoordinates(location, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to MySQL database:', err);
        callback(err);
        return;
      }
  
      const selectQuery = `
        SELECT latitude, longitude
        FROM areaslatlon
        WHERE area = ?
        LIMIT 1
      `;
  
      connection.query(selectQuery, [location], (err, results) => {
        connection.release();
  
        if (err) {
          console.error('Error retrieving coordinates:', err);
          callback(err);
          return;
        }
  
        if (results.length > 0) {
          const { latitude, longitude } = results[0];
          callback(null, { latitude, longitude });
          
        } else {
          callback(new Error('Location not found'));
        }
      });
    });
  }

  // Conductor Section //
  function getCon(id, password, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to MySQL database:', err);
        callback(err);
        return;
      }
  
      const selectDataQuery = `
        SELECT id,password FROM conductors
        WHERE id = ? AND password = ?
      `;
  
      connection.query(selectDataQuery, [id, password], (err, results) => {
        connection.release();
  
        if (err) {
          console.error('Error retrieving data:', err);
          callback(err);
          return;
        }
  
        callback(null, results);
      });
    });
  }
  
  
  function getConDetails(id, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to MySQL database:', err);
        callback(err);
        return;
      }
  
    const Userquery = `SELECT id,name, mobilenumber FROM conductors WHERE id = ?`;
    connection.query(Userquery, [id], (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      if (results.length > 0) {
        const con = results[0];
        callback(null, con);
      } else {
        callback(null, null);
      }
    });
  });
  }

  function getC(input, callback) {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to MySQL database:', err);
        callback(err);
        return;
      }
  
      const selectQuery = `
        SELECT DISTINCT bus_numbers
        FROM bus_details
        WHERE bus_numbers LIKE  CONCAT('%', '%${input}%', '%')
        LIMIT 10
      `;
  
      connection.query(selectQuery, (err, results) => {
        connection.release();
  
        if (err) {
          console.error("Error retrieving data:", err);
          callback(err);
          return;
        }
  
        callback(null, results);
      });
    });
  }

  
function getBusRoute(busNumber, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to MySQL database:", err);
      callback(err);
      return;
    }

    const selectQuery = `
      SELECT from_location, destination
      FROM bus_details
      WHERE bus_numbers = ?
    `;

    connection.query(selectQuery, [busNumber], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error retrieving bus route data:", err);
        callback(err);
        return;
      }

      if (!results || results.length === 0) {
        callback(new Error("Bus route data not found"));
        return;
      }

      const routeData = {
        fromLocation: results[0].from_location,
        toLocation: results[0].destination,
      };

      callback(null, routeData);
    });
  });
}

function getcoordinates(location, callback) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error connecting to MySQL database:', err);
      callback(err);
      return;
    }

    const selectQuery = `
    SELECT latitude, longitude
    FROM areaslatlon
    WHERE area = ?
    LIMIT 1
    `;

    connection.query(selectQuery, [location], (err, results) => {
      connection.release();

      if (err) {
        console.error('Error retrieving coordinates:', err);
        callback(err);
        return;
      }

      if (results.length > 0) {
        const { latitude, longitude } = results[0];
        callback(null, { latitude, longitude });
        
      } else {
        callback(new Error('Location not found'));
      }
    });
  });
}



module.exports = {
  insertUser,
  getUser,
  getUserDetails,
  getCon,
  getConDetails,
  getstod,
  get,
  getC,
  getto,
  getBusRoute,
  getCoordinates,
  getcoordinates
};
