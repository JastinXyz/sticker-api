const fs = require('fs');
 const axios = require('axios')

axios.post('http://localhost:3000/api/sticker', {
  headers: {
    "User-Agent": "wcode"
  },
  data: {
    buffer: fs.readFileSync('./saweria.png'),
    packname: "pack",
    author: "author",
    emoji: ["🙄️"],
    id: "12345"
  }
}).then(x => {
  //fs.writeFileSync('./sticker.webp', x.data);
  console.log(x.data);
})
