const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const cors = require("cors");
const formidable= require("formidable")
const { copyFile, rename } = require("fs/promises");
const fs = require("fs");


app.use("/static", express.static('src/public/static'))
app.set('trust proxy', 1)
app.enable('trust proxy')
app.use(express.json())


const whitelist = ["http://localhost:5500", "https://rasel-code-dev.github.io"]
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      // callback(null, true)
      // console.log(origin)
      callback(null, false)
      // callback(new Error('Not allowed by CORS'))
    }
  }
}

// app.use(cors(corsOptions))

// const multer  = require('multer')


const path = require("path");


// const upload = multer({ dest: '/function' })

// let cloud_name="dbuvg9h1e"
// let api_key="969784531238854"
// let api_secret="uG8W2VcpeejkZoBbxyTq8PPJFXA"
//
// cloudinary.config({cloud_name,  api_key,  api_secret});


app.post('/upload',  async (req, res) => {
  const body = req.body;
  
  const form = formidable({multiples: false})

  form.parse(req, async (err, fields, files)=> {

    if (err) {
      console.log(err)
      res.send(err)
      return
    }

    try {
      let p = files.file.filepath
      let newPath = p.slice(0, p.lastIndexOf('\\'))
      let f = newPath + "/" + files.file.originalFilename
      await rename(p, f)
      res.json({newPath: path.resolve(f)})
    } catch (ex){
      res.status(500).json({err: ex.message, m: "copy error"})
    }
  })
  
});


app.post('/upload/cp', async (req, res) => {
  let f = "/tmp/384d73c3db9c3df918d4a7b00"
  try {
    let r = await copyFile(f, "public")
      res.json({result: r})
   
  } catch (ex){
    res.status(500).json({err: ex.message})
  }
  
});


app.post('/upload/temp', async (req, res) => {
  let f = "/tmp/384d73c3db9c3df918d4a7b00"
  fs.stat(f, (err, r)=>{
    res.json({err: err,  r: r})
  })
});

app.post('/public', async (req, res) => {
  let f = "/tmp/384d73c3db9c3df918d4a7b00"
  fs.readdir("public", (err, r)=>{
    res.json({err: err,  r: r})
  })
});

app.post('/temp', async (req, res) => {
  fs.readdir("/temp", (err, r)=>{
    res.json({err: err,  r: r})
  })
});



app.get('/api/test', (req, res) => {
  try{
    res.send("test")
  } catch (ex){
    res.send("test err")
  } finally {
  
  }
});


app.get('/', async  (req, res) => {
  try{
    res.json([{name: "rasel"}])
  } catch (ex){
    res.setHeader("Content-Type", "application/json")
    res.json([{name: "rasel err"}])
  } finally {
  
  }
});

let PORT = process.env.PORT || 8888

app.use(bodyParser.json());
app.listen(PORT, ()=> console.log(`server is running on port ${PORT}`) )
