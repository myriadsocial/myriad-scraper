import { Controller, Get, Route, Post, Body, Path } from "tsoa";
import { FacebookService } from "../services/facebook.service";

@Route("facebook")
export class FacebookController extends Controller {
  @Get("individual/{page}/{postId}")
  public async getPostByIdRoute(
    @Path() postId: string, page: string
  ): Promise<string> {
    const fbNode = await new FacebookService().getFacebookPostById(page, postId);
    return fbNode;
  }
  @Get("page/{page}")
  public async getFacebookNodeRoute(
    @Path() page: string
  ): Promise<object> {
    const fbNode = await new FacebookService().getFacebookPage(page);
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