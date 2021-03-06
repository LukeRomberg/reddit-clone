const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const hbs = require('hbs');
const bodyParser = require('body-parser');
const db = require('./db/query');


app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');

app.get('/', (req,res) => {
  db.getBeers()
  .then(beers => {
    res.render('index', {
      beers: beers
    });
  });
});

app.get('/beer/:id', (req,res) => {
  db.getBeer(req.params.id)
    .then(beers => {
      let beer = beers[0];
      db.getComments(beer.id)
      .then(comments =>{
        res.render('beer', {
          beer: beer,
          comments: comments,
        });
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/beer/:id', (req,res) => {
  db.getBeer(req.params.id)
    .then(beers => {
      let beer = beers[0];
      db.getComments(beer.id)
      .then(comments =>{
        res.render('beer', {
          beer: beer,
          comments: comments,
        });
      });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/rating/:id', (req, res) => {
  db.getBeer(req.params.id)
  .then(beer => {
    var newRating = beer[0].rating + Number(req.body.vote);
    db.updateRating(newRating, req.params.id)
    .then(newBeer => {
      res.redirect('/');
    });
  });
});

app.post('/newbeer', (req,res) => {
  req.body.rating = 0;
  db.insertBeer(req.body)
  .then(beer => {
    res.redirect('/');
  });
});

app.post('/newComment/:id', (req,res) => {
  req.body.beer_id = Number(req.params.id);
  db.insertComment(req.body)
  .then(comment => {
    res.redirect('/beer/' + req.params.id);
  });
});

app.get('/hello', (req,res) => {
  res.send('index');
});

app.listen(port, (req,res) => {
  console.log("You're doing wonderful! :)");
});
