import {
  CHART_COLORS,
  TOOLTIP_SETTINGS,
  GRID_SETTINGS,
  gradientTooltipPlugin,
} from "./config.js";

// плагин для вертикальной линии при наведении
const verticalLinePlugin = {
  id: "verticalLinePlugin",
  beforeDatasetsDraw: function (chart) {
    if (chart.tooltip._active && chart.tooltip._active.length) {
      const ctx = chart.ctx;
      const activePoint = chart.tooltip._active[0];
      const x = activePoint.element.x;
      const y = activePoint.element.y;
      const chartArea = chart.chartArea;

      ctx.save();

      const gradient = ctx.createLinearGradient(x, chartArea.bottom, x, y);
      gradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
      gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.4)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 1)");

      ctx.beginPath();
      ctx.moveTo(x - 1, chartArea.bottom);
      ctx.lineTo(x - 1, y);
      ctx.lineTo(x + 1, y);
      ctx.lineTo(x + 1, chartArea.bottom);
      ctx.closePath();

      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.restore();
    }
  },
};

// градиент линии графика
function createGradient(ctx, chartArea) {
  const gradient = ctx.createLinearGradient(
    0,
    chartArea.bottom,
    0,
    chartArea.top
  );

  gradient.addColorStop(0, "rgba(37, 68, 40, 0.1)");
  gradient.addColorStop(0.5, "rgba(37, 68, 40, 0.6)");
  gradient.addColorStop(1, "rgba(37, 68, 40, 1)");

  return gradient;
}

// форматирование месяцев
function formatMonthLabels(dates) {
  const monthLabels = dates.map((date) => {
    const d = new Date(date);
    return d.toLocaleString("ru", { month: "short" });
  });

  // убирает дублирующиеся названия месяцев
  return monthLabels.map((month, index, array) => {
    return index === 0 || month !== array[index - 1] ? month : "";
  });
}

export const LINE_CHART_CONFIG = {
  data: {
    labels: [
      "2024-05-05",
      "2024-05-12",
      "2024-05-19",
      "2024-05-26",
      "2024-06-02",
      "2024-06-09",
      "2024-06-16",
      "2024-06-26",
      "2024-07-01",
      "2024-07-08",
      "2024-07-15",
      "2024-07-22",
      "2024-08-02",
    ],
    values: [
      100000, 103000, 101000, 120000, 125000, 115000, 118000, 116500, 116000,
      170000, 160000, 150000, 160000,
    ],
  },

  display: {
    lineColor: CHART_COLORS.green,
    tension: 0.25, // сглаживание перепадов на линии графика
    pointRadius: 0,
    pointHoverRadius: 6,
    pointHoverColor: "#000", // цвет точки при наведении
    pointHoverBorderColor: "#FFFFFF",
  },

  // шкала Y
  scaleY: {
    min: 75000,
    max: 200000,
    stepSize: 25000,
    allowedValues: [100000, 125000, 150000, 200000], // отображаются только эти значения, можно удалить
    format: (value) => value / 1000 + "k",
  },
};

// const maxValueFromData = Math.max(...LINE_CHART_CONFIG.data.values);

// if (LINE_CHART_CONFIG.scaleY.max < maxValueFromData) {
//   LINE_CHART_CONFIG.scaleY.max = maxValueFromData;
//   LINE_CHART_CONFIG.scaleY.allowedValues = null;
// }

export function initialLineChart(canvasId = "chart-line") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.error(`Отсутвует canvas с id ${canvasId}`);
    return null;
  }

  const ctx = canvas.getContext("2d");
  const formattedLabels = formatMonthLabels(LINE_CHART_CONFIG.data.labels);

  const chartConfig = {
    type: "line",
    data: {
      labels: formattedLabels,
      datasets: [
        {
          label: "",
          data: LINE_CHART_CONFIG.data.values,
          borderColor: LINE_CHART_CONFIG.display.lineColor,
          backgroundColor: function (context) {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            return chartArea ? createGradient(ctx, chartArea) : null;
          },
          fill: true,
          tension: LINE_CHART_CONFIG.display.tension,
          pointBackgroundColor: "transparent",
          pointBorderColor: "transparent",
          pointHoverBackgroundColor: LINE_CHART_CONFIG.display.pointHoverColor,
          pointHoverBorderColor:
            LINE_CHART_CONFIG.display.pointHoverBorderColor,
          pointHoverRadius: LINE_CHART_CONFIG.display.pointHoverRadius,
        },
      ],
    },
    plugins: [verticalLinePlugin, gradientTooltipPlugin],
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          min: LINE_CHART_CONFIG.scaleY.min,
          max: LINE_CHART_CONFIG.scaleY.max,
          ticks: {
            callback: function (value) {
              const allowedValues = LINE_CHART_CONFIG.scaleY.allowedValues;

              if (!allowedValues) {
                return LINE_CHART_CONFIG.scaleY.format(value);
              } else if (allowedValues.includes(value)) {
                return LINE_CHART_CONFIG.scaleY.format(value);
              } else {
                return null;
              }
            },
            stepSize: LINE_CHART_CONFIG.scaleY.stepSize,
            color: CHART_COLORS.white,
          },
          grid: { color: GRID_SETTINGS.color },
        },
        x: {
          grid: { color: GRID_SETTINGS.color },
          ticks: { color: CHART_COLORS.white, autoSkip: false },
        },
      },
      plugins: {
        tooltip: {
          titleFont: { size: TOOLTIP_SETTINGS.titleFontSize },
          titleAlign: "center",
          bodyFont: {
            size: TOOLTIP_SETTINGS.bodyFontSize,
            weight: TOOLTIP_SETTINGS.bodyWeight,
          },
          bodyAlign: "center",
          callbacks: {
            title: function (context) {
              const fullDate = new Date(
                LINE_CHART_CONFIG.data.labels[context[0].dataIndex]
              );
              return fullDate.toLocaleDateString("ru", {
                day: "numeric",
                month: "long",
              });
            },
            label: function (context) {
              return LINE_CHART_CONFIG.scaleY.format(context.parsed.y);
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
      interaction: {
        intersect: false,
        mode: "index",
      },
    },
  };

  return new Chart(ctx, chartConfig);
}
