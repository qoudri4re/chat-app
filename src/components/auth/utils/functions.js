//sets error and filters out redundant error message
const setErrorAndFilter = (errorType, errorMessage, setErrors) => {
  setErrors((prevVal) => {
    //filter out redundant error message
    const newVal = prevVal.filter((item) => {
      return item.errorType !== errorType;
    });
    return [
      ...newVal,
      {
        id: randomNumber(1, 10) + randomNumber(0, 10),
        errorType: errorType,
        errorMessage: errorMessage,
      },
    ];
  });
};

const randomNumber = (start, end) => {
  return Math.floor(Math.random() * end) + start;
};

export { setErrorAndFilter };
