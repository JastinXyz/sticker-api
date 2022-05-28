const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const _s = require('scramb')
//const multer = require('multer')
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter')
const fs = require('fs')
require('dotenv').config()
const PORT = process.env.PORT

// const storage = multer.diskStorage({
//    destination: 'tmp',
//    filename: (req, file, cb) => {
//        cb(null, `${file.fieldname}-${_s.makeId(8).result}`)
//    }
// });
//
// const upload = multer({
//    storage,
//    limits: {
//        fileSize: 25000000 // 25 MB
//    }
// })

// parse application/json
app.use(bodyParser.json({limit: '500mb'}))
//app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

app.get('/', async(req, res) => {
  res.sendStatus(200)
})

app.post('/api/sticker', async(req, res) => {
  var name = `${_s.makeId(8).result}-${Date.now()}`
  try {
    await fs.appendFileSync(`./tmp/${name}.png`, Buffer.from(req.body.data.buffer.data))
    const sticker = new Sticker(`./tmp/${name}.png`, {
      pack: req.body.data.packname, // The pack name
      author: req.body.data.author, // The author name
      type: StickerTypes.FULL, // The sticker type
      categories: req.body.data.emoji, // The sticker category
      id: req.body.data.id, // The sticker id
      quality: 50, // The quality of the output file
      background: req.body.data.background? req.body.data.background : "#000000"// The sticker background color (only for full stickers)
    })

    if(req.body.data.sendImage) {
       await sticker.toFile("./tmp/s.webp")
       await res.sendFile(__dirname + '/tmp/s.webp")
       fs.unlinkSync('./tmp/s.webp')
    } else {
       let resp;
       req.body.data.bufferRes? resp = await sticker.toBuffer() : resp = await sticker.toMessage()
       res.send(resp);
       fs.unlinkSync('./tmp/' + name + '.png')
    }
  } catch(e) {
    res.send(e)
    if(fs.existsSync('./tmp/' + name + '.png')) {
      fs.unlinkSync('./tmp/' + name + '.png')
    }
  }
})

// app.post('/api/sticker/upload', upload.single('file'), async(req, res) => {
//   var name = `${_s.makeId(8).result}-${Date.now()}`
//   console.log(req.file);
//   try {
//     //await fs.appendFileSync(`./tmp/${name}.png`, Buffer.from(req.body.data.buffer.data))
//     const sticker = new Sticker(req.body.data.file, {
//       pack: req.body.data.packname, // The pack name
//       author: req.body.data.author, // The author name
//       type: StickerTypes.FULL, // The sticker type
//       categories: req.body.data.emoji? req.body.data.emoji : [""], // The sticker category
//       id: req.body.data.id, // The sticker id
//       quality: 50, // The quality of the output file
//       background: req.body.data.background? req.body.data.background : "#000000"// The sticker background color (only for full stickers)
//     })
//
//     let resp;
//     req.body.data.bufferRes? resp = await sticker.toBuffer() : resp = await sticker.toMessage()
//     res.send(resp);
//     //fs.unlinkSync('./tmp/' + name + '.png')
//   } catch(e) {
//     res.send(e)
//     if(fs.existsSync('./tmp/' + name + '.png')) {
//       fs.unlinkSync('./tmp/' + name + '.png')
//     }
//   }
// })

app.listen(PORT, () => {
  console.log("ready on port " + PORT);
})
