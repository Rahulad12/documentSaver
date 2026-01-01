import { User } from "lucide-react";
import { useNavigate } from "react-router";
import { useGetUserProfile, useLogout } from "@/apis/hooks/auth.hooks";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
const Navbar = () => {
  const navigate = useNavigate();
  const { mutateAsync: logOut } = useLogout();
  const id: string | null = sessionStorage.getItem("user_id")
  console.log(id);
  const { data } = useGetUserProfile(id as string)

  const logOutHandler = async () => {
    await logOut();
    navigate("/");
  };
  return (
    <div className="flex py-2 bg-white shadow-xs border-b items-center justify-between">
      <div className="flex min-w-[40%] relative gap-2 flex-row "></div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            className="bg-primary h-10 w-10 rounded-full  text-white hover:bg-primary/90"
            size="icon"
            aria-label="Open profile menu"
          >
            <User className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48 p-2">
          <div className="flex flex-col">
            <div className="px-2 py-2">
              <p className="text-sm font-medium capitalize">
                {data?.user?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {data?.user?.email}
              </p>
            </div>

            <div className="border-t my-2" />
            <button
              className="w-full text-left px-2 py-2 rounded-md text-sm text-destructive hover:bg-destructive/10 cursor-pointer"
              onClick={logOutHandler}
            >
              Logout
            </button>
          </div>
        </PopoverContent>
      </Popover>

    </div>
  );
};

export default Navbar;
