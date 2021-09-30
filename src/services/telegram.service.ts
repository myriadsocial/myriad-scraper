import {gun} from "../app";
import { parse } from 'node-html-parser';
import axios from "axios"

export class TelegramService {
  public async scrapeChannelPreviewHTML(channel: string): Promise<boolean> {
    const gunUser = gun.user();
    const node = await gunUser.get("telegram").get(channel);
    // console.log("TELEGRAM NODE", node);
    //Get the highest message ID by sorting the keys by descending order
    let telegramQueryParam: string = "";
    if (node) {
      telegramQueryParam = "?after="+Object.keys(node).sort((a,b) => {return parseInt(b, 10)-parseInt(a, 10)})[0]
      // console.log(telegramQueryParam, Object.keys(node).sort((a,b) => {return parseInt(b, 10)-parseInt(a, 10)}))
    }
    
    let output = await axios.get("https://t.me/s/"+channel+telegramQueryParam)
      .then((response) => {
        // res.send("NICE!");
        const responseStr = response.data.toString();
        // console.log(responseStr)
        const html = parse(responseStr);
        const messagesText = html.querySelectorAll(".js-message_text");
        const messagesInfo = html.querySelectorAll(".js-message_info");
  
        if (messagesText.length !== messagesInfo.length) {
          // return res.send("BAD REQUEST");
          return "BAD"
        }
        
        for (let i=0; i< messagesText.length; i++) {
          const msg = messagesText[i].text;
          const msgHref = messagesInfo[i].querySelector(".tgme_widget_message_date").getAttribute("href");
          const splitHref = msgHref!.split('/');
          const msgId = splitHref[splitHref.length-1];
          gunUser.get('telegram').get(channel).put({[msgId]: msg});
        }
        
      })
      .catch((error) => {
        // handle error
        console.log(error);
        // res.send(error)
        return "BAD"
      })
    if (output) return true;
    return false;
  }
}
