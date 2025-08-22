import { initialBarChart } from "./chartjs/bar.js";
import { initialDoughnutChart } from "./chartjs/doughnut.js";
import { initialLineChart } from "./chartjs/line.js";

document.addEventListener("DOMContentLoaded", () => {
  try {
    initialLineChart();
    initialBarChart();
    initialDoughnutChart();
  } catch (error) {
    console.error(error);
  }
});
