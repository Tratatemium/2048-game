const { state } = require("../state.js");

const printGameArray = () => {
  console.log("-------");
  console.log(
    state.gameArray
      .map((row) => row.map((el) => el.value).join(" "))
      .join("\n"),
  );
};

module.exports = { printGameArray };