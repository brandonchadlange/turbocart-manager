import { HttpStatusCode } from "axios";
import HttpException from "../utility/http-exception";

export default class MerchantIdUndefinedOrNullException extends HttpException {
  constructor() {
    super({
      status: HttpStatusCode.BadRequest,
      response: "Could not determine merchant",
    });
  }
}
