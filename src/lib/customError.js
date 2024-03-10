class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;

    // NOTE: カスタムエラーではエラーの原因が特定できるものに使用するので、エラーのスタックトレースを作成しない
    Error.captureStackTrace(this, this.constructor);
    this.stack = ''
  }
}

class ValidationError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

const CustomErrorNames = [
  'ValidationError',
]

module.exports = {
  ValidationError,
  CustomErrorNames,
}
