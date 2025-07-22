import {createBrowserRouter} from "react-router-dom";
import TaskView from "@/routes/TaskView.tsx";
import ErrorView from "@/components/ErrorView.tsx";
import AboutView from "@/routes/AboutView.tsx";
import RootLayout from "@/routes/RootLayout.tsx";
import GraphBarChart, {sample_options as options_bar, sample_data as data_bar} from "@/components/graph/GraphBarChart.tsx";
import GraphLineChart, {sample_options as options_line, sample_data as data_line} from "@/components/graph/GraphLineChart.tsx";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorView />,
    children: [
      {
        index: true,
        element: <TaskView />,
      },
      {
        path: '/task',
        element: <TaskView />,
      },
      {
        path: '/bar-chart',
        element: <GraphBarChart options={options_bar} data={data_bar}/>,
      },
      {
        path: '/line-chart',
        element: <GraphLineChart options={options_line} data={data_line}/>,
      },
      {
        path: '/about',
        element: <AboutView />,
      }
    ]
  },
]);