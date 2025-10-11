import { logout } from "@/app/(public)/(auth)/actions";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export default function Logout() {
    const router = useRouter();
    return (
        <DropdownMenuItem
            onClick={async () => {
                await logout();
                toast.success("Logged out successfully");
                router.push("/login");
            }}
        >
            <LogOut />
            Log out
        </DropdownMenuItem>
    );
}
