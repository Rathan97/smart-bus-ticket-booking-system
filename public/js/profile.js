
app.get('/profile', (req, res) => {
    if (req.session.user) {
      const user = req.session.user;
      res.render('profile', { user: user }); 
    } else {
      res.redirect('/');
    }
  });
  