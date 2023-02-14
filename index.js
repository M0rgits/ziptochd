const { exec } = require('node:child_process');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

var urlencodedparser = bodyParser.urlencoded({extended: false});

app.use(router);

router.post('/', urlencodedparser ,function(req, res){
  var path = req.body.path;
  exec('unzip ' + path && 'rm ' + path);
  exec('chdman createcd ' + '../shared' + path.slice(0, -3) + '.cue');
  fs.rename(path.slice(0, -3) + '.chd' , '../api/emu/' + path.slice(0, -3) + '.chd')
})

app.listen(8081);