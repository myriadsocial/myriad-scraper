import {gun} from "../app";
import fs from 'fs';
import csv from 'csv-parser';

export interface FbInidivdualPostsNode {
  [key: string]: string;
}

interface FBPost {
  text: string;
  images: string[];
  video: string;
  username: string;
  post_id: string;
  url: string;
  importers: string[];
  metrics: {
    likes: number,
    comments?: number,
    shares: number
  },
}
export class FacebookService {

  public async importFacebookPost(urlId: string, importerUsername: string): Promise<object> {
    const {exec} = require("child_process")
    return exec("python src/services/facebookScraper.py "+urlId, async (error: { message: string; }, stdout: string, stderr: string) => {
      if (error) {
        // console.log(`error: ${error.message}`);
      }
      if (stderr) {
        // console.log(`stderr: ${stderr}`);
      }
      if (stdout) {
        stdout = stdout.replace(/datetime.datetime/, '\'');
        stdout = stdout.replace(/, 'timestamp'/, '\', \'timestamp\'');
        stdout = stdout.replace(/'/g, '"');
        stdout = stdout.replace(/None/g, 'null');
        stdout = stdout.replace(/False/g, 'false');
        stdout = stdout.replace(/True/g, 'true');
        // console.log(`stdout: ${stdout}`);
        try {
          let rawJson = JSON.parse(stdout);
          let images = null;
          if (rawJson.images.length > 0) {
            images = rawJson.images;
          } else if (rawJson.images_lowquality.length > 0) {
            images = rawJson.images_lowquality;
          }
          //TODO: find a better way of removing unwanted keys
          let post: FBPost = {
            text: rawJson.text,
            video: rawJson.video,
            images,
            username: rawJson.username,
            post_id: rawJson.post_id,
            url: rawJson.post_url,
            importers: [importerUsername],
            metrics: {
              likes: rawJson.likes,
              comments: rawJson.comments,
              shares: rawJson.shares
            }
          }
          post.username = post.username.toLowerCase().replace(/ /g, '');
          gun.user().get("facebook").get(post.username).get(urlId).put(JSON.stringify(post), (cb: object) => {
            console.log("POST SUCCESSFULLY SAVED?", cb)
            // gun.user().get("facebook").get(post.username).get(urlId).once((s:object) => {
            //   console.log("saved post", s);
            // })
          });

        } catch (e) {
          console.log("error", e);
        }
      }
    });
  }

  public async getFacebookPostById(username: string, urlId: string): Promise<string> {
    // const fbPageNode = await this.getFacebookPage(page);
    const post = await gun.user().get("facebook").get(username).get(urlId);
    return post.toString();
  }

  public async getUsernamesPosts(username: string): Promise<FbInidivdualPostsNode> {
    return await gun.user().get("facebook").get(username);
  }

  public async scrapeFacebookPage(page: string): Promise<void> {
    const gunUser = gun.user();
    const results: FBPost[] = [];
    const {exec} = require("child_process")
    await exec("facebook-scraper --pages 3 "+page, async (error: { message: any; }, stdout: string | string[], stderr: any) => {
      fs.createReadStream("./"+page+"_posts.csv")
      .pipe(csv())
      .on('data', (data: FBPost) => results.push(data))
      .on('end', () => {
        results.forEach(post => {
          console.log(post.post_id);
          // post.text = post.text.replace(/'time'[^|]+, /g, '');
          gunUser.get("facebook").get(page).put({[post.post_id]: post.text});
        })
        fs.unlink("./"+page+"_posts.csv", (err) => {
          if (err) console.log(err);
          console.log("file deleted successfully");
        });  

      });
      if (error) {
          console.log(`error: ${error.message}`);
          return false
      }
      else if (stderr) {
          console.log(`stderr: ${stderr}`);
          return false
      }
      else {
        console.log(`stdout: ${stdout}`);
      }
  });
  }
}
