export class ApiResponse {
  constructor(message, data = undefined) {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}
