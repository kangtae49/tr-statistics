
import { Line } from "react-chartjs-2";

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "월별 매출",
    },
  },
};

const labels = ["1월", "2월", "3월", "4월", "5월", "6월"];

const data = {
  labels,
  datasets: [
    {
      label: "2024년",
      data: [120, 190, 300, 250, 500, 420],
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    },
  ],
};

function GraphLineChart() {
  return (
    <Line options={options} data={data} />
  )
}

export default GraphLineChart;
