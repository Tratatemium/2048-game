export const slide = (line) => {
  let nonZero = line.filter((tile) => tile.value !== 0);

  return [
    ...nonZero,
    ...Array(line.length - nonZero.length).fill({ value: 0, id: null }),
  ];
};

export const merge = (line) => {
  const result = [...line];
  let gainedScore = 0;

  for (let i = 0; i < result.length - 1; i++) {
    const current = result[i];
    const next = result[i + 1];

    if (current.value !== 0 && current.value === next.value) {
      result[i] = {
        ...current,
        value: current.value * 2,
        id: crypto.randomUUID(),
      };

      result[i + 1] = {
        ...next,
        value: 0,
        id: null,
      };

      gainedScore += result[i].value;
      i++;
    }
  }

  return {
    line: slide(result),
    gainedScore,
  };
};
