const { exec } = require('child_process');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const seven = require('node-7z');

const app = express();
const router = express.Router();

var urlencodedparser = bodyParser.urlencoded({extended: false});

app.use(router);

router.post('/', urlencodedparser ,function(req, res){
  var path = req.body.path;
  var newfiles = {}
  var i = 0
  const myStream = seven.extractFull('../shared/' + path, '../shared/', {
    $progress: true
  })
  
  myStream.on('end', function () {
      exec('chdman createcd "' + JSON.stringify(path).slice(0, -3) + '.cue" ../api/emu/' + JSON.stringify(path).slice(0, -3) + '.chd')
  })
  myStream.on('error', (err) => {
    throw err;
  })
})

app.listen(8081);