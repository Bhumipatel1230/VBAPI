var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require('./routes/testAPI');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/testAPI", testAPIRouter);

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Bhumi:Bhumi@cluster0.llo1i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
let con;
async function connect(service) {
  if (con) return con; // return connection if already conncted
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  con = client.connect()
  console.log('con:------- ', con);
  return con;
}

async function FetchAllserviceSearch(service) {
  console.log("INSIDE FUNC----------")
  const client = await connect();
  console.log('client:------- ', client);
  const database = client.db("sample_analytics")
  let dataCursor = await database.collection("accounts").find({})
  while (await dataCursor.hasNext()) {                       //make sure to put await on cursor .hasnext()
      let results = await dataCursor.next()
      console.log('results:------------ ', results);
  }
  return { message: "User Added to Database" }
}

FetchAllserviceSearch().then((res) => {
  console.log('res:----------- ', res);

})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
