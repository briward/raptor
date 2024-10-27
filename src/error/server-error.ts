export default class ServerError implements Error {
  public name: string = "Server Error";
  public message: string = "There was a server error handling the request";
  public status: number = 500;
}
