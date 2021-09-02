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
}