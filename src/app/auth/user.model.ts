export class User {
  constructor(
    public id: string,
    public email: string,
    private _token: string,
    private _tokenExpiryDate: Date
  ) {}

  get token() {
    if (
      !this._token ||
      !this._tokenExpiryDate ||
      this._tokenExpiryDate <= new Date()
    ) {
      return null;
    }
    return this._token;
  }

  get tokenDuration() {
    if (!this.token) {
      return 0;
    }
    return this._tokenExpiryDate.getTime() - new Date().getTime();
  }
}
