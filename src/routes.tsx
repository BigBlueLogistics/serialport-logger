import { createHashRouter } from "react-router-dom";
import Home from "./screens/Home";
import Settings from "./screens/Settings";

const routes = createHashRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
]);

export default routes;
