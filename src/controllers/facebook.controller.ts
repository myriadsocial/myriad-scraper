import { Controller, Get, Route, Post, Body, Path } from "tsoa";
import { FacebookService } from "../services/facebook.service";

@Route("facebook")
export class FacebookController extends Controller {

  @Get("individual/{username}/{postId}")
  public async getPostByIdRoute(
    @Path() postId: string, username: string
  ): Promise<string> {
    const fbNode = await new FacebookService().getFacebookPostById(username, postId);
    return fbNode;
  }
  @Get("username/{username}")
  public async getUsernameRoute(
    @Path() username: string
  ): Promise<object> {
    const fbNode = await new FacebookService().getUsernamesPosts(username);
    return fbNode;
  }
  @Post("individual")
  public async importFacebookPostRoute(
    @Body() body: { 
      urlId: string,
      importerUsername: string,
    }
  ): Promise<object> {
    return await new FacebookService().importFacebookPost(body.urlId, body.importerUsername)
  }

  @Post("username")
  public async scrapeFacebookUsernameRoute(
    @Body() body: { username: string }, 
  ): Promise<void> {
    new FacebookService().scrapeFacebookUsername(body.username)
  }
}