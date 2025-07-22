import {createBrowserRouter} from "react-router-dom";
import TaskView from "@/routes/TaskView.tsx";
import ErrorView from "@/components/ErrorView.tsx";
import AboutView from "@/routes/AboutView.tsx";
import RootLayout from "@/routes/RootLayout.tsx";
import GraphBarChart from "@/components/graph/GraphBarChart.tsx";
import GraphLineChart from "@/components/graph/GraphLineChart.tsx";

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
        element: <GraphBarChart />,
      },
      {
        path: '/line-chart',
        element: <GraphLineChart />,
      },
      {
        path: '/about',
        element: <AboutView />,
      }
    ]
  },
]);