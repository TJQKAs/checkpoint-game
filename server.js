var express = require('express');
var app = express();

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/app/index.html');
});

var express = require('express'),
app = express();
app.use(express.static('www'));
app.set('port', process.env.PORT || 5000);
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});



var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
