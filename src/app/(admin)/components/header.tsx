"use client";

import { Bell, Search, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Button from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { User } from "@/models/user";
import { FaAngleDown } from "react-icons/fa";
import { useLogout } from "@/hooks/useLogin";
import { redirect } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function Header({ user }: Readonly<{ user: User | null }>) {
  const { hasInternalAccess } = useAuth();

  const handleLogout = async () => {
    const res = await useLogout();
    if (res) {
      redirect('/login');
    }
  }


  return (
    <div className="border-b">
      <div className="flex h-16 items-center justify-end px-10">
        <div className="flex items-center gap-4">
          <Button variant="dark" size="sm" className="bg-white !text-gray-800 !border-none !rounded-full aspect-ratio-1 hover:!text-gray-100 h-10 w-10 p-0 flex items-center justify-center">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="dark" size="sm" className="bg-white !text-gray-800 !border-none !rounded-full aspect-ratio-1 hover:!text-gray-100 h-10 w-10 p-0 flex items-center justify-center">
            <Bell className="h-5 w-5" />
          </Button>
          {hasInternalAccess && (
            <Link href="/api-docs">
              <Button variant="dark" size="sm" className="bg-purple-100 !text-purple-800 !border-none !rounded-full aspect-ratio-1 hover:!bg-purple-200 h-10 w-10 p-0 flex items-center justify-center">
                <FileText className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center justify-center gap-2 cursor-pointer">
                <Avatar className="cursor-pointer">
                  {user?.avatarUrl && <AvatarImage src={user.avatarUrl} className="rounded-full h-10 w-10 bg-blue-300" />}
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-gray-700 my-0">{user?.name}</p>
                  <p className="text-xs text-gray-500 my-0">{user?.email}</p>
                </div>
                <FaAngleDown width={20} height={20} className="text-gray-500" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-none">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}