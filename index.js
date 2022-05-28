const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')
const _s = require('scramb')
const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter')
const fs = require('fs')
const PORT = 3000

// parse application/json
app.use(bodyParser.json())
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

    res.send(await sticker.toMessage());
    fs.unlinkSync('./tmp/' + name + '.png')
  } catch(e) {
    res.send(e)
    if(fs.existsSync('./tmp/' + name + '.png')) {
      fs.unlinkSync('./tmp/' + name + '.png')
    }
  }
})

app.listen(PORT, () => {
  console.log("read on port " + PORT);
})
