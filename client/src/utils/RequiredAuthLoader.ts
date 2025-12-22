import { isAuthenticate } from "@/apis/service/auth.service";
import { redirect } from "react-router";

const RequiredAuthLoader = () => {
  const isValidUser = isAuthenticate();
  if (!isValidUser) return redirect("/");
  return null;
};

export default RequiredAuthLoader;
