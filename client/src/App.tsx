import { RouterProvider } from "react-router";
import TanstackProvider from "./providers/TanstackProvider";
import MainRoutes from "./routes/MainRoutes";
import { Toaster } from "react-hot-toast";
import "react-day-picker/style.css";

function App() {
  return (
    <TanstackProvider>
      <RouterProvider router={MainRoutes} />

      <Toaster />
    </TanstackProvider>
  );
}

export default App;
