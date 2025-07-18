import "./App.css";
// import MainRouterView from "@/components/MainRouterView.tsx";
import {createBrowserRouter, RouterProvider, useNavigate} from "react-router-dom";
import HomeView from "@/components/HomeView.tsx";
import ErrorView from "@/components/ErrorView.tsx";
import AboutView from "@/components/AboutView.tsx";
import {useEffect} from "react";
import {listen} from "@tauri-apps/api/event";
import RootLayout from "@/components/RootLayout.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorView />,
    children: [
      {
        index: true,
        path: '/home',
        element: <HomeView />,
      },
      {
        path: '/about',
        element: <AboutView />,
      },
    ]
  },
]);

function App() {

  return (
    <main className="container">
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
