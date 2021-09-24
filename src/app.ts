import marked from "marked";
import express, { Application, Router } from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes";

require('gun/axe');
require('gun/sea');

const TerminalRenderer = require('marked-terminal');
const Gun = require('gun');
const SEA = Gun.SEA;

const port = process.env.PORT || 5000; 
marked.setOptions({
  renderer: new TerminalRenderer()
})

const app: Application = express();
app.use(express.static("public"));

console.log(marked('# Starting Gunpoint API !'))
export const gun = Gun({ 
  web: app.listen(port, () => { console.log(marked('**Express with GunDB is running at http://localhost:' + port + '**')) }),
  peers: ["http://host.docker.internal:8765/gun"]
});

//Init Gun
initGun()
initHTTPserver()

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
        return cb.get;
      })
    })
  }
}

function initHTTPserver() {
  app.use(Gun.serve)
  app.use(express.json())
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: "/swagger.json",
      },
    })
  );

  RegisterRoutes(app);
}
