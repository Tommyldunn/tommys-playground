var express = require('express');
var compress = require('compression');
var app = express();

app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/src/views');
app.set('view engine', 'html');

app.use(compress());
app.use(express.static(__dirname + '/dist'));

var port = process.env.PORT || 8000;

app.get('/', function (req, res) {
  res.render('index', {title: 'tommyldunns playground'});
})

app.get('/local-storage', function (req, res) {
  res.render('LocalStorage/index.html', {title: 'local-storage'});
})

app.get('/drum-kit', function (req, res) {
  res.render('drum-kit/index.html', {title: 'drum-kit'});
})

app.listen(port, function() {
	console.log('server running on port ' + port);
});
