import { isAuthenticate } from "@/apis/service/auth.service";
import { redirect } from "react-router";

const ValidUserLoader = () => {
  const isValidUser = isAuthenticate();
  if (isValidUser) return redirect("/documents");
  return null;
};

export default ValidUserLoader;
