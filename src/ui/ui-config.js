const uiConfig = {
  animationDuration:
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--animation-duration",
      ),
    ) * 1000,
};

export { uiConfig };
