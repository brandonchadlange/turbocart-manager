import { HttpStatusCode } from "axios";
import HttpException from "../utility/http-exception";

export default class MerchantNotFoundException extends HttpException {
  constructor() {
    super({
      status: HttpStatusCode.NotFound,
      response: "Could not find merchant",
    });
  }
}
