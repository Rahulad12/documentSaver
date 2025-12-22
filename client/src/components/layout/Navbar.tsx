import { User2Icon } from "lucide-react";
import { useNavigate } from "react-router";
import { useGetUserProfile, useLogout } from "@/apis/hooks/auth.hooks";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
const Navbar = () => {
  const navigate = useNavigate();
  const { mutateAsync: logOut } = useLogout();
  const id: string | null = localStorage.getItem("user_id")
  console.log(id);
  const { data } = useGetUserProfile(id as string)

  const logOutHandler = async () => {
    await logOut();
    navigate("/");
  };
  return (
    <div className="flex items-center justify-end px-4 py-2 border-b ">
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full bg-primary flex items-center justify-center size-8 p-2 cursor-pointer">
          <User2Icon className="text-primary-foreground font-bold" />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="bg-background mr-2">
          <DropdownMenuLabel className="capitalize font-bold">{data?.user?.name}</DropdownMenuLabel>
          <DropdownMenuLabel className="text-secondary text-xs">{data?.user?.email}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logOutHandler}
            className="text-destructive cursor-pointer"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Navbar;
