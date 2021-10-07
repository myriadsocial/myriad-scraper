import {gun} from "../app";
import fs from 'fs';
import csv from 'csv-parser';

export interface FbInidivdualPostsNode {
  [key: string]: string;
}

interface FBPost {
  text: string;
  // images: string[];
  // video: string;
  // username: string;
  post_id: string;
}

export class FacebookService {
  public async importFacebookPost(postId: string): Promise<object> {
    const {exec} = require("child_process")
    return exec("python src/services/facebookScraper.py "+postId, async (error: { message: string; }, stdout: string, stderr: string) => {
      if (error) {
        console.log(`error: ${error.message}`);
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
      }
      if (stdout) {
        // stdout = stdout.replace(/'time'.*?), /g, '');
        stdout = stdout.replace(/'time'[^|]+, /g, '');
        
        //TODO: fix regex replace (removing too much data) thhen parse into FBPost interface 
        // let post: FBPost = JSON.parse(stdout);
        //TODO: parse the page from the scraped data and put in appropiate page's node
        gun.user().get("facebook").put({[postId]: stdout});
      }
    });
  }

  public async getFacebookPostById(page: string, postId: string): Promise<string> {
    const fbPageNode = await this.getFacebookPage(page);
    return fbPageNode[postId];
  }

  public async getFacebookPage(page: string): Promise<FbInidivdualPostsNode> {
    return await gun.user().get("facebook").get(page);
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
