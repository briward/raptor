export default class NotFound implements Error {
  public name : string = 'Not Found';
  public message : string = 'The resource requested could not be found';
  public status : number = 404;
};
