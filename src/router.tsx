import {createBrowserRouter} from "react-router-dom";
import TasksView from "@/components/TasksView.tsx";
import ErrorView from "@/components/ErrorView.tsx";
import AboutView from "@/components/AboutView.tsx";
import RootLayout from "@/components/RootLayout.tsx";
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
        element: <TasksView />,
      },
      {
        path: '/tasks',
        element: <TasksView />,
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