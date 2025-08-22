export const CHART_COLORS = {
  white: "#fff",
  green: "#4BD158",
  purple: "#A265FF",
  yellow: "#FFB202",
  pink: "#ED02AD",
  blue: "#218EF5",
  lightBlue: "#4A8EFF",
  red: "#EF364F",
  cyan: "#38C1F2",
  orange: "#F19B36",
  lightGreen: "#32E28B",
};

export const TOOLTIP_SETTINGS = {
  titleColor: CHART_COLORS.white,
  bodyColor: CHART_COLORS.white,
  borderWidth: 1,
  borderColor: "rgb(65, 66, 67)",
  borderRadius: 10,
  padding: 15,
  titleFontSize: 16,
  bodyFontSize: 20,
  bodyWeight: "bold",
};

export const GRID_SETTINGS = {
  color: "#363636",
};

// плагин для тултипа
export const gradientTooltipPlugin = {
  id: "gradientTooltip",
  beforeDraw: function (chart) {
    const tooltip = chart.tooltip;
    if (tooltip._active && tooltip._active.length) {
      const ctx = chart.ctx;
      const tooltipModel = tooltip;

      const gradient = ctx.createLinearGradient(
        tooltipModel.x,
        tooltipModel.y - tooltipModel.height,
        tooltipModel.x,
        tooltipModel.y
      );

      gradient.addColorStop(0, "rgba(45, 46, 46, 1)");
      gradient.addColorStop(1, "rgb(33, 36, 36)");

      tooltipModel.gradientBackground = gradient;
    }
  },
};
