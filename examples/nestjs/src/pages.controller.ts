import { Controller, Get, Header } from "@nestjs/common";
import { page } from "./page";

@Controller()
export class PagesController {
  @Get()
  @Header("Content-Type", "text/html; charset=utf-8")
  home(): string {
    return page("home");
  }

  @Get("about")
  @Header("Content-Type", "text/html; charset=utf-8")
  about(): string {
    return page("about");
  }

  @Get("product")
  @Header("Content-Type", "text/html; charset=utf-8")
  product(): string {
    return page("product");
  }
}
