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
  
  myStream.on('data', function (data) {
    var i = i++
    let name = 'file' + i
    newfiles.file[i] = data.file
    console.log(data.file)
  })
  
  myStream.on('progress', function (progress) {
    console.log(progress.percent); 
  })
  
  myStream.on('end', function () {
    if(newfiles.file1.includes('.cue')){
      exec('chdman createcd "' + JSON.stringify(newfiles.file1) + '" "../api/emu/' + JSON.stringify(newfiles.file1).slice(0, -4) + '.chd"')
    }
    if(newfiles.file2.includes('.cue')){
      exec('chdman createcd "' + JSON.stringify(newfiles.file2) + '" "../api/emu/' + JSON.stringify(newfiles.file2).slice(0, -4) + '.chd"')
    }
    if(newfiles.file3.includes('.cue')){
      exec('chdman createcd "' + JSON.stringify(newfiles.file3) + '" ../api/emu/' + JSON.stringify(newfiles.file3).slice(0, -4) + '.chd')
    }
  })
  myStream.on('error', (err) => handleError(err))
})

app.listen(8081);