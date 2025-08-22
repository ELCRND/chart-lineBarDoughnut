import {
  CHART_COLORS,
  TOOLTIP_SETTINGS,
  gradientTooltipPlugin,
} from "./config.js";

export const DOUGHNUT_CHART_CONFIG = {
  data: {
    labels: ["1", "2", "3", "4"],
    values: [47, 20, 20, 13],
    colors: [
      CHART_COLORS.red,
      CHART_COLORS.cyan,
      CHART_COLORS.orange,
      CHART_COLORS.lightGreen,
    ],
  },

  display: {
    cutout: "70%", // вырез в центре
    borderRadius: 12, // скругление секторов
    borderWidth: 0,
    spacing: 8, // растояние между секторами
  },
};

export function initialDoughnutChart(canvasId = "chart-doughnut") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Canvas element with id '${canvasId}' not found`);
    return null;
  }

  const ctx = canvas.getContext("2d");

  const chartConfig = {
    type: "doughnut",
    data: {
      labels: DOUGHNUT_CHART_CONFIG.data.labels,
      datasets: [
        {
          data: DOUGHNUT_CHART_CONFIG.data.values,
          backgroundColor: DOUGHNUT_CHART_CONFIG.data.colors,
          borderColor: "transparent",
          borderRadius: DOUGHNUT_CHART_CONFIG.display.borderRadius,
          borderWidth: DOUGHNUT_CHART_CONFIG.display.borderWidth,
          spacing: DOUGHNUT_CHART_CONFIG.display.spacing,
        },
      ],
    },
    plugins: [gradientTooltipPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: DOUGHNUT_CHART_CONFIG.display.cutout,
      plugins: {
        tooltip: {
          bodyFont: {
            size: 16,
            weight: "bold",
          },
          bodyAlign: "center",
          callbacks: {
            title: function () {
              return "";
            },
            label: function (context) {
              return context.label + ": " + context.parsed + "%";
            },
          },
          backgroundColor: function (context) {
            return context.chart.tooltip.gradientBackground;
          },
          titleColor: TOOLTIP_SETTINGS.titleColor,
          bodyColor: TOOLTIP_SETTINGS.bodyColor,
          borderColor: TOOLTIP_SETTINGS.borderColor,
          borderWidth: TOOLTIP_SETTINGS.borderWidth,
          displayColors: false,
          cornerRadius: TOOLTIP_SETTINGS.borderRadius,
          padding: TOOLTIP_SETTINGS.padding,
        },
        legend: { display: false },
      },
    },
  };

  return new Chart(ctx, chartConfig);
}
