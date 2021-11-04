import { Controller, Get, Route, Tags, Post, Body, Path } from "tsoa";
import { TelegramService } from "../services/telegram.service";

@Route("telegram")
export class TelegramController extends Controller {
  @Get('{channel}')
  public async scrapeTelegramChannelRoute(
    @Path() channel: string
  ): Promise<boolean> {
    return new TelegramService().scrapeChannelPreviewHTML(channel)
  }

  @Post("individual")
  public async importTelegramMessage(
    @Body() body: { 
      url: string,
      importerUsername: string,
    }
  ): Promise<string|void> {
    const splitUrl = body.url.split('/');
    if (splitUrl[2] !== "t.me") return "bad request";
    return new TelegramService().importIndividualMessage(splitUrl[3], splitUrl[4], body.importerUsername)
  }
}