import {useNavigate} from 'react-router-dom';
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