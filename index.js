const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;
const db = require('./public/js/db');
const qrCode = require('qrcode');
const path = require('path');
const axios = require('axios');
const qs = require('querystring');


app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());



app.use(
  session({
    secret: '209617',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, 
  })
);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/views/index1.html');
  });
  
  app.get('/conductor', (req, res) => {
    res.sendFile(__dirname + '/public/views/conductor.html');
  });

  app.get('/service', (req, res) => {
    res.sendFile(__dirname + '/public/views/service.html');
  });

  app.get('/contactus', (req, res) => {
    res.sendFile(__dirname + '/public/views/contact.html');
  });

  app.get('/bookbus', (req, res) => {
    if (req.session.user) {
      res.sendFile(__dirname + '/public/views/loginbookbus.html');
    } else {
      res.redirect('/');
    }
    
  });

  app.get('/forgot', (req, res) => {
    res.sendFile(__dirname + '/public/views/forgot.html');
  });



app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/views/signup.html');
});

app.post('/signup', (req, res) => {
  const {fullname, email, mobilenumber, password } = req.body;

  db.insertUser(fullname, email, mobilenumber, password, (err, results) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }

    res.sendFile(__dirname + '/public/views/signupsuccess.html');
  });
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/views/index1.html');
});

app.post('/login', (req, res) => {
  const { mobilenumber, password } = req.body;

  db.getUser(mobilenumber, password, (err, results) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.length > 0) {
      const user = results[0];
      db.getUserDetails(mobilenumber, (err, userDetails) => {
        if (err) {
          res.status(500).send('Internal Server Error');
          return;
        }
        if (userDetails) {
          req.session.user = {
            id: userDetails.id,
            fullname: userDetails.fullname,
            email: userDetails.email,
            mobilenumber: userDetails.mobilenumber,
          };
         
          res.sendFile(__dirname + '/public/views/loginsuccess.html');
       
        } else {
          res.send('Invalid mobile number or password');
        }
      });

      
    } else {
      res.send('Invalid mobile number or password');
    }
  });
});


app.get('/profile', (req, res) => {
  // Check if the user is logged in (session contains user information)
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'public', 'views', 'profile.html'));
  } else {
    res.redirect('/');
  }
});


app.get('/user-details', (req, res) => {
  
  if (req.session.user) {
    const user = req.session.user;
    res.json(user);
  } else {
    res.status(401).json({ error: 'Not authorized' });
  }
});


app.get('/logout', (req, res) => {
 
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});





app.get("/api/from-options", (req, res) => {
  const input = req.query.input || "";

 db.get(input,(err,results)=>{
  if (err) {
    res.status(500).send('Internal Server Error');
    return;
  }
  const options = results.map((result) => result.from_location);
  res.json(options);

 });

   
  });

app.get("/api/to-options", (req, res) => {
  const input = req.query.input || "";

  db.getto(input,(err,results)=>{
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
    const options = results.map((result) => result.destination);
    res.json(options);
  
   });
  
     
    });

app.post("/api/find-buses", (req, res) => {
  const { fromLocation, toLocation } = req.body;

  db.getstod(fromLocation, toLocation, (err,results)=>{
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }
       res.json(results);
  });
});




app.get("/api/get-coordinates", (req, res) => {
  const location = req.query.location;

  db.getCoordinates(location, (err, coordinates) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json(coordinates);
  });
});

app.get("/paymentdetails", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'paymentdetails.html'));
});


// Conductor Section
app.get('/validateQRCode', (req, res) => {
  res.sendFile(__dirname + '/public/views/validateQRCode.html');
});

app.post('/conductor-dashboard', (req, res) => {
  const { id, password } = req.body;

  db.getCon(id, password, (err, results) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }

    if (results.length > 0) {
      const con = results[0];
      db.getConDetails(id, (err, ConDetails) => {
        if (err) {
          res.status(500).send('Internal Server Error');
          return;
        }
        if (ConDetails) {
          req.session.con = {
            id: ConDetails.id,
            fullname: ConDetails.name,
            mobilenumber: ConDetails.mobilenumber,
          };
         
          res.sendFile(__dirname + '/public/views/conductor_dashboard.html');
       
        } else {
          res.send('Invalid Id or password');
        }
      });

      
    } else {
      res.send('Invalid Id or password');
    }
  });
});

app.get('/con-details', (req, res) => {
  
  if (req.session.con) {
    const con = req.session.con;
    res.json(con);
  } else {
    res.status(401).json({ error: 'Not authorized' });
  }
});

app.get("/api/bus-options", (req, res) => {
  const input = req.query.input || "";

 db.getC(input,(err,results)=>{
  if (err) {
    res.status(500).send('Internal Server Error');
    return;
  }
  const options = results.map((result) => result.bus_numbers);
  res.json(options);

 });
});

app.get("/api/get-map-data", (req, res) => {
  const selectedBusNumber = req.query.busNumber;

  db.getBusRoute(selectedBusNumber, (err, routeData) => {
    if (err) {
      console.error("Error fetching bus route data:", err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }

    if (!routeData || routeData.length === 0) {
      res.status(404).json({ error: "Bus route data not found" });
      return;
    }

    const fromLocation = routeData.fromLocation;
    console.log(fromLocation)
    const toLocation = routeData.toLocation;

    db.getcoordinates(fromLocation, (err, fromCoordinates) => {
      if (err) {
        console.error("Error fetching 'from' coordinates:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      db.getcoordinates(toLocation, (err, toCoordinates) => {
        if (err) {
          console.error("Error fetching 'to' coordinates:", err);
          res.status(500).json({ error: "Internal Server Error" });
          return;
        }

        const mapData = {
          fromLocation: {
            name: fromLocation,
            coordinates: fromCoordinates,
          },
          toLocation: {
            name: toLocation,
            coordinates: toCoordinates,
          },
        };

        res.json(mapData);
      });
    });
  });
});





// API route to retrieve locations from Excel file
/* app.get('/api/locations', (req, res) => {
  const XLSX = require('xlsx');
  const workbook = XLSX.readFile('./bus info/bus route details.xlsx');
  const sheetName = 'bus_1'; // Replace with your sheet name
  
  const worksheet = workbook.Sheets[sheetName];
  const location = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  res.json(location);
}); */

app.listen(port, () => {
  console.log(`Server started on port localhost${port}`);
});
