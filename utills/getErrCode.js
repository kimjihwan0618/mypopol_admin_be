const getErrorCode = (err) => {
  if (err instanceof SomeSpecificErrorType) {
    return 500; // 예시: 특정 에러 유형에 대한 에러 코드
  } else if (err instanceof AnotherErrorType) {
    return 404; // 예시: 다른 특정 에러 유형에 대한 에러 코드
  } else {
    return 400; // 기본적으로 사용할 에러 코드
  }
};

module.exports = getErrorCode;
