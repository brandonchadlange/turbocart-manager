class HttpException {
  private readonly _response;
  private readonly _status;

  constructor(response: string | Record<string, any>, status: number) {
    this._response = response;
    this._status = status;
  }

  get response() {
    return this._response;
  }

  get status() {
    return this._status;
  }
}

export default HttpException;
