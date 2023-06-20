class HttpException<T = any> {
  private readonly _response;
  private readonly _status;

  constructor(options: { response?: any; status: number }) {
    this._response = options.response;
    this._status = options.status;
  }

  get response() {
    return this._response;
  }

  get status() {
    return this._status;
  }
}

export default HttpException;
