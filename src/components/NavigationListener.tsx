import {createHashRouter, RouterProvider, useNavigate} from 'react-router-dom';
import HomeView from "@/components/HomeView.tsx";
import AboutView from "@/components/AboutView.tsx";
import ErrorView from "@/components/ErrorView.tsx";
import {useEffect} from "react";
import {listen} from "@tauri-apps/api/event";


function NavigationListener() {

  const navigate = useNavigate();

  useEffect(() => {
    const unlisten = listen<string>('navigate', (event) => {
      navigate(event.payload);
    });
    return () => {
      unlisten.then((f) => f());
    };

  }, [navigate])
  return null;
}

export default NavigationListener;