import {
  CHART_COLORS,
  TOOLTIP_SETTINGS,
  GRID_SETTINGS,
  gradientTooltipPlugin,
} from "./config.js";

export const BAR_CHART_CONFIG = {
  data: {
    labels: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    datasets: [
      {
        label: "name1",
        data: [2000, 1000, 4000, 2500, 7100, 5900, 6800], // каждый первый день
        color: CHART_COLORS.purple,
      },
      {
        label: "name2",
        data: [6500, 4700, 500, 8000, 5500, 6200, 5300], // каждый второй день
        color: CHART_COLORS.yellow,
      },
      {
        label: "name3",
        data: [7500, 9000, 5000, 9000, 4900, 4500, 5100],
        color: CHART_COLORS.pink,
      },
      {
        label: "name4",
        data: [1000, 3100, 6000, 800, 4100, 3700, 4200],
        color: CHART_COLORS.green,
      },
      {
        label: "name5",
        data: [8500, 6000, 10000, 7500, 3200, 2900, 3500],
        color: CHART_COLORS.blue,
      },
      {
        label: "name6",
        data: [5500, 4000, 3000, 3500, 2400, 2100, 2700],
        color: CHART_COLORS.lightBlue,
      },
    ],
  },

  display: {
    borderRadius: 6,
    barPercentage: 0.65, // ширина столбцов
    categoryPercentage: 0.85, // пространтсво занимаемое каждым днем
  },

  // Y
  scaleY: {
    max: 10000,
    stepSize: 2500,
    format: (value) => "$" + value / 1000 + "k",
  },
};

BAR_CHART_CONFIG.scaleY.max = Math.max(
  ...BAR_CHART_CONFIG.data.datasets.flatMap((dataset) => dataset.data)
);

export function initialBarChart(canvasId = "chart-bar") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Отсутвует canvas с id ${canvasId}`);
    return null;
  }

  const ctx = canvas.getContext("2d");

  const chartConfig = {
    type: "bar",
    data: {
      labels: BAR_CHART_CONFIG.data.labels,
      datasets: BAR_CHART_CONFIG.data.datasets.map((dataset) => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: dataset.color,
        borderRadius: BAR_CHART_CONFIG.display.borderRadius,
      })),
    },
    plugins: [gradientTooltipPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: BAR_CHART_CONFIG.scaleY.max,
          ticks: {
            callback: BAR_CHART_CONFIG.scaleY.format,
            stepSize: BAR_CHART_CONFIG.scaleY.stepSize,
            color: CHART_COLORS.white,
          },
          grid: { color: GRID_SETTINGS.color },
        },
        x: {
          grid: { color: GRID_SETTINGS.color },
          ticks: { color: CHART_COLORS.white },
        },
      },
      plugins: {
        tooltip: {
          bodyFont: {
            size: 16,
            weight: "bold",
          },
          titleAlign: "center",
          bodyAlign: "center",
          callbacks: {
            title: function (context) {
              return context[0].dataset.label;
            },
            label: function (context) {
              return "$" + context.parsed.y;
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
      datasets: {
        bar: {
          barPercentage: BAR_CHART_CONFIG.display.barPercentage,
          categoryPercentage: BAR_CHART_CONFIG.display.categoryPercentage,
        },
      },
    },
  };

  return new Chart(ctx, chartConfig);
}
