import { uniqueNamesGenerator, Config, adjectives, animals } from "unique-names-generator";

const maxNum = 100;
const numbers = [];
for (let i = 1; i <= maxNum; i++) {
  numbers.push(i.toString());
}

const nameConfig: Config = {
  dictionaries: [adjectives, animals, numbers],
  separator: "-",
  length: 3,
  style: "capital",
};

export const genScreenName = () => {
  return uniqueNamesGenerator(nameConfig);
};
