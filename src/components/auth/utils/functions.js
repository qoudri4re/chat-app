import { v4 as uuidv4 } from "uuid";

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
        id: uuidv4(),
        errorType: errorType,
        errorMessage: errorMessage,
      },
    ];
  });
};

export { setErrorAndFilter };
