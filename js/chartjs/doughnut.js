import {
  CHART_COLORS,
  TOOLTIP_SETTINGS,
  gradientTooltipPlugin,
} from "./config.js";

export const DOUGHNUT_CHART_CONFIG = {
  data: {
    labels: ["name1", "name2", "name3", "name4"],
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
    console.error(`Отсутвует canvas с id ${canvasId}`);
    return null;
  }

  const ctx = canvas.getContext("2d");

  function createGradient(ctx, color, centerX, centerY, radius) {
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      radius * 0.78,
      centerX,
      centerY,
      radius
    );

    const darkerColor = darkenColor(color, 0.5);

    gradient.addColorStop(0, darkerColor);
    gradient.addColorStop(1, color);

    return gradient;
  }

  function darkenColor(color, amount) {
    const hex = color.replace("#", "");
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    r = Math.max(0, Math.min(255, Math.floor(r * (1 - amount))));
    g = Math.max(0, Math.min(255, Math.floor(g * (1 - amount))));
    b = Math.max(0, Math.min(255, Math.floor(b * (1 - amount))));

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

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
    plugins: [
      gradientTooltipPlugin,
      {
        id: "customGradient",
        beforeDraw: function (chart) {
          const ctx = chart.ctx;
          const chartArea = chart.chartArea;
          const centerX = (chartArea.left + chartArea.right) / 2;
          const centerY = (chartArea.top + chartArea.bottom) / 2;
          const radius = Math.min(
            (chartArea.right - chartArea.left) / 2,
            (chartArea.bottom - chartArea.top) / 2
          );

          chart.data.datasets.forEach((dataset, datasetIndex) => {
            const meta = chart.getDatasetMeta(datasetIndex);
            meta.data.forEach((element, index) => {
              const originalColor = dataset.backgroundColor[index];
              const gradient = createGradient(
                ctx,
                originalColor,
                centerX,
                centerY,
                radius
              );
              element.options.backgroundColor = gradient;
            });
          });
        },
      },
    ],
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
