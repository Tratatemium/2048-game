const slide = (line) => {
  const nonZero = line.filter((tile) => tile.value !== 0);
  const result = [
    ...nonZero,
    ...Array(line.length - nonZero.length).fill({ value: 0, id: null }),
  ];
  return {
    line: result,
    gainedScore: 0,
  };
};

const merge = (line) => {
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

  const { line: slided } = slide(result);

  return {
    line: slided,
    gainedScore,
  };
};

export { slide, merge };
