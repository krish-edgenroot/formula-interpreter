module.exports = {
  SUM: {
    params: [
      {
        name: "args",
        type: "number",
        required: true,
      },
    ],
    return: "number",
  },
  // func: SUM
  ROUND: {
    params: [
      {
        name: "number",
        type: "number",
        required: true,
      },
      {
        name: "numDigits",
        type: "number",
        required: true,
      },
    ],
    return: "number",
  },
  // ROUND
  INT: {
    params: [
      {
        name: "number",
        type: "number",
        required: true,
      },
    ],
    return: "number",
  },
};
