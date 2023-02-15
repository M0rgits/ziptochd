const { spawn } = require('child_process');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const seven = require('node-7z');
const app = express();
const router = express.Router();

var urlencodedparser = bodyParser.urlencoded({extended: false});

app.use(router);

router.post('/upload', urlencodedparser, async function(req, res){
  req.setTimeout(9999999999);
  var form = new formidable.IncomingForm({uploadDir: './tmp/', maxFileSize: 2048 * 1024 * 1024});
  form.parse(req, function (err, fields, files) {
    if(err) throw err;
    if(files.romupload){
      zipupload(files);
    }
    var oldpath = files.upload.filepath;
    var newpath = `../api/img/${fields.type}/` + files.upload.originalFilename;
    var imgname = files.upload.originalFilename;
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
    });
    if(fields.type === 'h5g'){
      let jsonpath = '../api/json/h5g.json';
      let json = JSON.parse(fs.readFileSync(jsonpath));
      let name = fields.name
      if(fields.path != ''){
        let path = fields.path
        json.push({name: name, path: path, img: imgname, pop:0});
        let data = JSON.stringify(json);
        fs.writeFileSync(jsonpath, data);
        res.send(name + " added to h5g.json")
        res.end()
      }
      if(fields.iframe != ''){
        let iframe = fields.iframe
        json.push({name: name, iframe: iframe, img: imgname, pop:0});
        let data = JSON.stringify(json);
        fs.writeFileSync(jsonpath, data);
        res.send(name + " added to h5g.json")
      }
      if(fields.custom != ''){
        if(fields.prox != ''){
          let custom = fields.custom;
          let prox = fields.prox;
          json.push({name: name, custom: custom, prox: prox ,img: imgname, pop:0});
          let data = JSON.stringify(json);
          fs.writeFileSync(jsonpath, data);
          res.send(name + " added to h5g.json")
          res.end()
        }
        else{
          let custom = fields.path
          json.push({name: name, custom: custom, img: imgname, pop:0});
          let data = JSON.stringify(json);
          fs.writeFileSync(jsonpath, data);
          console.log(name + " added to h5g.json")
          res.end()
        }
      }
    }
    if(fields.type === 'emu'){
      let jsonpath = '../api/json/emu.json';
      let json = JSON.parse(fs.readFileSync(jsonpath));
      let name = fields.name;
      let core = fields.core;
      let rom = files.romupload.originalFilename;
      json.push({name: name, core: core, rom: rom, img: imgname, pop:0});
      let data = JSON.stringify(json);
      fs.writeFileSync(jsonpath, data);
      res.send(name + " added to emu.json")
      res.end();
      }
    })
  });

async function zipupload(filename){
  let base = string.sanitize(JSON.stringify(files.romupload.originalFilename).slice(0, -3));
  let oldzippath = files.romupload.filepath;
  let zippath = './tmp/' + base + '.7z'
  fs.rename(oldzippath, zippath, async function(err){
    if (err) throw err;
    else{
      let dirpath =  unzip(zippath);
      chdman(dirpath, base);
    }
  })
}

function unzip(zippath){
  let dirpath = './tmp/' + zippath.slice(0, -3) + '/'
  let unzip = seven.extractFull(zippath, './tmp/', {$progress: true})
  unzip.on('error', (err) => {
    console.warn(err);
  })
  unzip.on('end', function(){
    console.log('Unzipped ' + zippath);
    let rmzip = spawn('rm', [zippath]);
    rmzip.on('err', (err) => {
      console.warn(err); 
    })
    return dirpath;
  })
}

function chdman(dirpath, base){
  let chdman = spawn('chdman', ['createcd', '-i ' + dirpath + base + '.cue', '-o ../api/emu/' + base + '.chd'])
  chdman.on('error', (err) => {
    console.warn(err); 
  })
  chdman.on('data', (data) => {
    console.log(data);
  })
  chdman.on('close', function(){
    let rmdir = spawn('rm', ['-r', dirpath]);
    rmdir.on('close', function(){
      console.log('SUCCESS!');
    })
  })
}

app.listen(8081);
