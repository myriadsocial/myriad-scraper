import marked from "marked";
import express, { Application, Router,  Response as ExResponse,
  Request as ExRequest,
  NextFunction, } from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "../build/routes/routes";
import { ValidateError } from 'tsoa';
import * as dotenv from "dotenv";
import cors from "cors";

// require('gun/axe');
require('gun/sea');

const TerminalRenderer = require('marked-terminal');
const Gun = require('gun');
// const SEA = Gun.SEA;

dotenv.config();
const port = process.env.PORT || 5000; 
marked.setOptions({
  renderer: new TerminalRenderer()
})

export const app: Application = express();
app.use(express.static("public"));

console.log(marked('# Starting Gunpoint API !'))
export const gun = Gun({ 
  peers: [process.env.GUN_HOST],
  axe: false,
  multicast: {
    port: process.env.GUN_PORT
  },
});

//Init Gun
initGun()
initHTTPserver();
async function initGun() {
  let gunUser = gun.user()
  let appGunPubKey = "TBD"
  if (gunUser.is) {
    console.log('You are logged in');
    appGunPubKey = gunUser.is.pub;
  } else {
    console.log('You are NOT logged in');
    // appGunPubKey = gun.user().create(process.env.GUN_USER, process.env.GUN_PWD, (cb: any) => {
    //   console.log("create user cb", cb);
    //   if (cb.ok === 0) {
    //     return cb.pub
    //   }
      //login if create failed
      gun.user().auth("myriad-scraper", "supahScr3tPwd", async (cb: any) => {
        gunUser = gun.user();
        if (!gunUser.is) {
          console.log("LOGGED INTO GUN FAILED")
          return;
        }
        console.log("current user:", gunUser.is);
        
        return cb.get;
      })
    // })
  }
}

function initHTTPserver() {
  app.listen(port, () => { console.log(marked('**Express with GunDB is running at http://localhost:' + port + '**')) }),
  app.use(cors()); 
  app.use(Gun.serve)
  app.use(express.json())
  app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: "./swagger.json", 
      },
    })
  );

  app.use(function errorHandler(
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction
  ): ExResponse | void {
    if (err instanceof ValidateError) {
      console.warn(`Caught Validation Error for ${req.path}:`, err.fields);
      return res.status(422).json({
        message: "Validation Failed",
        details: err?.fields,
      });
    }
    if (err instanceof Error) {
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  
    next();
  });

  RegisterRoutes(app);
}
