import "./App.css";
import {RouterProvider} from "react-router-dom";
import {router} from "./router";
import "@/components/graph/chart"

function App() {

  return (
    <main className="container">
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
