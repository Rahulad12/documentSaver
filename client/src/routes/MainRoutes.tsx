import Layout from "@/components/layout";
import LoginPage from "@/modules/auth/Login";
import RegisterPage from "@/modules/auth/Register";
import AddDocuments from "@/modules/documents/pages/AddDocuments";
import ListAddedDocument from "@/modules/documents/pages/ListAddedDocument";
import RequiredAuthLoader from "@/utils/RequiredAuthLoader";
import ValidUserLoader from "@/utils/ValidUserLoader";
import { createBrowserRouter } from "react-router";

const MainRoutes = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    loader: ValidUserLoader,
  },
  {
    path: "/register",
    element: <RegisterPage />,
    loader: ValidUserLoader,
  },
  {
    path: "/documents",
    element: <Layout />,
    loader: RequiredAuthLoader,
    children: [
      {
        path: "/documents/add",
        element: <AddDocuments />,
      },
      {
        path: "/documents/list",
        element: <ListAddedDocument />,
      },
    ],
  },
]);

export default MainRoutes;
