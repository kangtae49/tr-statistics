import { Bar } from "react-chartjs-2";
import React, {useEffect, useRef} from "react";


const options = {
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

// type Prop = {
//   style?: React.CSSProperties
// }

function GraphBarChart() {
  // const chartRef = useRef<any>(null);
  //
  // useEffect(() => {
  //   const handleResize = () => {
  //     if (chartRef.current) {
  //       chartRef.current.chartInstance?.resize();
  //     }
  //   };
  //
  //   window.addEventListener('resize', handleResize);
  //   return () => window.removeEventListener('resize', handleResize);
  // }, []);

  return (
    // <Bar ref={chartRef} options={options} data={data} style={style}/>
    <Bar options={options} data={data} />
  )
}

export default GraphBarChart;
