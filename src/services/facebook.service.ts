import {gun} from "../app";

export interface ImportIndividualFacebookPostParams {
  postId: string;
}

export interface FbInidivdualPostsNode {
  [key: string]: string;
}

interface FBPost {
  text: string;
  // images: string[];
  // video: string;
  // username: string;
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
        gun.user().get("facebook").put({[postId]: stdout});
      }
    });
  }

  public async getFacebookPostById(): Promise<FbInidivdualPostsNode> {
    return gun.user().get("facebook");
  }
}
