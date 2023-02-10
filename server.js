const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');


const helpers = require('./utils/helpers');


const hBars = require('express-handlebars');
const hbrs = hBars.create({helpers});

// session (connects session to sequelize Database)
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3001;

const getSequilize = require('connect-session-sequelize')(session.Store);

// create session 
const newSession = {
  secret: "Privet",
  cookie: { originalMaxAge: 600000 },
  resave: false,
  saveUninitialized: true,
  store: new getSequilize({
    db: sequelize
  })
};

app.use(session(newSession));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.engine('handlebars', hbrs.engine);
app.set('view engine', 'handlebars');


app.use(routes);


sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});