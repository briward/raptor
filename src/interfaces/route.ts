export interface Route {
  name: string;
  pathname: URLPattern;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  action: CallableFunction
};
