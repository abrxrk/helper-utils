export class ApiResponse<T> {
  readonly success: boolean;
  readonly message: string;
  readonly data?: T;

  constructor(message: string, data?: T) {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}
