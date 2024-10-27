export interface Error {
  status: number;
  message: string;
  errors?: string[];
  render: CallableFunction;
}
