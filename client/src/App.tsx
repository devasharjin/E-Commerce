import {  RouterProvider } from "react-router-dom";
import { useBootstrapAuth } from "./features/auth/usBootstrapAuth";
import { router } from "./router";


function App() {
  useBootstrapAuth()
  return <RouterProvider router={router}/>
}

export default App;