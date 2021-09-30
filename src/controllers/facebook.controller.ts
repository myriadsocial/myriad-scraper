import { Controller, Get, Route, Post, Body, Path } from "tsoa";
import { FacebookService } from "../services/facebook.service";

@Route("facebook")
export class FacebookController extends Controller {
  @Get("individual/{postId}")
  public async getPostByIdRoute(
    @Path() postId: string
  ): Promise<string> {
    const fbNode = await new FacebookService().getFacebookPostById(postId);
    return fbNode;
  }
  @Get("page")
  public async getFacebookNodeRoute(
  ): Promise<object> {
    const fbNode = await new FacebookService().getFacebookNode();
    return fbNode;
  }
  @Post("individual")
  public async importFacebookPostRoute(
    @Body() body: { postId: string }
  ): Promise<object> {
    return await new FacebookService().importFacebookPost(body.postId)
  }

  @Post("page")
  public async scrapeFacebookPageRoute(
    @Body() body: { page: string } , 
  ): Promise<void> {
    new FacebookService().scrapeFacebookPage(body.page)
  }
}