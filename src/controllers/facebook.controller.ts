import { Controller, Get, Route, Post, Body, Path } from "tsoa";
import { FacebookService, ImportIndividualFacebookPostParams, FbInidivdualPostsNode } from "../services/facebook.service";

@Route("facebook")
export class FacebookController extends Controller {
  @Post("individual")
  public async importFacebookPostRoute(
    @Body() body: ImportIndividualFacebookPostParams
  ): Promise<object> {
    return await new FacebookService().importFacebookPost(body.postId)
  }
  @Get("individual/{postId}")
  public async getPostById(
    @Path() postId: string
  ): Promise<string> {
    const fbNode = await new FacebookService().getFacebookPostById(postId);
    return fbNode;
  }
  @Post("page")
  public async scrapeFacebookPageRoute(
    @Body() page: string, 
  ): Promise<boolean> {
    return false //TODO: new FacebookService().scrapeFacebookPage(page, fetchAfterDate)
  }
}