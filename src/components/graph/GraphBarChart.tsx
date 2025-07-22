import { Bar } from "react-chartjs-2";
import React from "react";
import {ChartData} from "chart.js";


export const sample_options = {
  responsive: true,
  maintainAspectRatio: false,
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


export const sample_data = {
  labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
  datasets: [
    {
      label: "2024년",
      data: [120, 190, 300, 250, 500, 420],
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    },
  ],
};


type Prop = {
  style?: React.CSSProperties
  options: object
  data: ChartData<any>
}

function GraphBarChart({style, options, data}: Prop) {
  return (
    <Bar options={options} data={data} style={style} />
  )
}

export default GraphBarChart;
