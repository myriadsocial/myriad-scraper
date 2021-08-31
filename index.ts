import marked from "marked";
import express from "express";

import {scrapeChannelPreviewHTML} from "./src/telegram/telegramScraper";

require('gun/axe');
require('gun/sea');

const TerminalRenderer = require('marked-terminal');
const Gun = require('gun');
const SEA = Gun.SEA;

const port = process.env.PORT || 5000; 
marked.setOptions({
  renderer: new TerminalRenderer()
})

const app = express();
console.log(marked('# Starting Gunpoint API !'))
export const gun = Gun({ 
  web: app.listen(port, () => { console.log(marked('**Gunpoint is running at http://localhost:' + port + '**')) }),
  peers: ["http://host.docker.internal:8765/gun"]
});

initGun()
//Init Gun
async function initGun() {
  let gunUser = gun.user()
  let appGunPubKey = "TBD"
  if (gunUser.is) {
    console.log('You are logged in');
    appGunPubKey = gunUser.is.pub;
  } else {
    console.log('You are NOT logged in');
    appGunPubKey = gun.user().create("myriad-scraper", "supahScr3tPwd", (cb: any) => {
      console.log("create user cb", cb);
      if (cb.ok === 0) {
        return cb.pub
      }
      //login if create failed
      gun.user().auth("myriad-scraper", "supahScr3tPwd", async (cb: any) => {
        gunUser = gun.user()
        if (!gunUser.is) {
          console.log("LOGGED INTO GUN FAILED")
          return;
        }
        console.log("current user:", gunUser.is)
        initHTTPserver()
        return cb.get;
      })
    })
  }
}

function initHTTPserver() {
  app.use(Gun.serve)
  app.use(express.json())
  
  app.get('/', (_,res) => res.send('TypeScript Express + GunDB Server'));
  
  app.get("/telegram", (req, res) => {
    
    let channel = req.query.channel;
    scrapeChannelPreviewHTML(channel as string, res);
  })
}
