const CHANCE_OF_4 = 0.2;

const getRandomValue = () => (Math.random() > CHANCE_OF_4 ? 2 : 4);

export const addNumberAtRandom = (gameArray) => {
  const emptyTiles = gameArray.flatMap((row, i) =>
    row.map((tile, j) => (tile.value === 0 ? [i, j] : null)).filter(Boolean),
  );

  if (emptyTiles.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyTiles.length);
    const [i, j] = emptyTiles[randomIndex];

    gameArray[i][j] = {
      ...gameArray[i][j],
      value: getRandomValue(),
      id: crypto.randomUUID(),
    };
  }
};

export { addNumberAtRandom };
