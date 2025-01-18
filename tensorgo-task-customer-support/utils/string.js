const toTitleCase = (str) => {
  return str
    .split(" ")
    .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
    .join(" ");
};

const string = {
  toTitleCase,
};

export default string;
