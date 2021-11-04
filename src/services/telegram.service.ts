import {gun} from "../app";
import { parse } from 'node-html-parser';
import axios from "axios"

interface TelegramMessage {
  text: string;
  id: string;
  profilePicture: string;
  username: string;
  url: string;
  datetime?: Date;
  importer: string;
}

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
        const responseStr = response.data.toString();
        const html = parse(responseStr);
        const messagesText = html.querySelectorAll(".js-message_text");
        const messagesInfo = html.querySelectorAll(".js-message_info");
  
        if (messagesText.length !== messagesInfo.length) {
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

  public async importIndividualMessage(channel: string, messageId: string, importerUsername: string): Promise<string|void> {
    const gunUser = gun.user();
    const savedMessage = await gunUser.get("telegram").get(channel).get(messageId);
    if (savedMessage) return savedMessage;
    let url = "https://t.me/"+channel+'/'+messageId;
    return axios.get(url)
      .then((response) => {
        const responseStr = response.data.toString();
        const html = parse(responseStr);
        const metaData = html.querySelectorAll("meta");
        let profilePicture = '';
        let username = '';
        let text = '';
        //TODO: get timestamp but it's not getting returned in response
        // const dateData = html.querySelectorAll(".js-message_footer");
        for (let i=0; i< metaData.length; i++) {
          switch (metaData[i].rawAttributes.property) {
            case "og:image":
              profilePicture = metaData[i].rawAttributes.content;
              break;
            case "og:title":
              username = metaData[i].rawAttributes.content;
              break;
            case "og:description":
              text = metaData[i].rawAttributes.content;
              break;
          }
        }
        
        const message: TelegramMessage = {
          id: messageId,
          profilePicture,
          username,
          text,
          url,
          importer: importerUsername,
        }
        gunUser.get('telegram').get(channel).get(messageId).put(JSON.stringify(message), (cb: any) => {
          console.log("Gun put() callback", cb);
        });
      })
      .catch((error) => {
        // handle error
        console.log(error);
        return "Something went wrong";
      })
  }
}
