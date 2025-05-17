"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Wallet,
  Briefcase,
  CheckSquare,
  MessageSquare,
  Inbox,
  Calendar,
  Megaphone,
  Settings,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import { imagePathFinder } from "@/utils/imagePathFinder";
import React, { useState } from "react";
import { LuAlbum } from "react-icons/lu";


interface Onglet {
  label: string;
  leading?: React.ComponentType<React.SVGProps<SVGSVGElement> & { className?: string }>;
  trailling?: React.ComponentType<React.SVGProps<SVGSVGElement> & { className?: string }>;
  href: string;
  color: string;
  disabled?: boolean;
  active?: boolean;
  tooltip?: string;
  tooltipPosition?: "top" | "right" | "bottom" | "left";
  tooltipClassName?: string;
  tooltipDelay?: number;
  tooltipOffset?: number;
  children?: Onglet[];
}

const routes: Onglet[] = [
  {
    label: "Dashboard",
    leading: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
    children: [
      {
        label: "Main",
        leading: LayoutDashboard,
        href: "/dashboard",
        color: "text-sky-500",
      },
      {
        label: "Analytics",
        leading: LayoutDashboard,
        href: "/analytics",
        color: "text-sky-500",
      },
      {
        label: "Ecommerce",
        leading: LayoutDashboard,
        href: "/ecommerce",
        color: "text-sky-500",
      },
      {
        label: "Marketing",
        leading: LayoutDashboard,
        href: "/marketing",
        color: "text-sky-500",
      },
    ]
  },
  {
    label: "Blog",
    leading: ShoppingCart,
    href: "/blog",
    color: "text-violet-500",
    children: [
      {
        label: "Articles",
        leading: LayoutDashboard,
        href: "/articles",
        color: "text-sky-500",
      },
      {
        label: "Spécialités",
        leading: LayoutDashboard,
        href: "/specialites",
        color: "text-sky-500",
      },
    ]
  },
  {
    label: "Candidatures",
    leading: Users,
    href: "/candidatures",
    color: "text-pink-500",
  },
  {
    label: "Embauches",
    leading: LuAlbum,
    href: "/hires",
    color: "text-orange-500",
  },
  // {
  //   label: "Finance",
  //   leading: Wallet,
  //   href: "/finance",
  //   color: "text-orange-500",
  // },
  {
    label: "Management",
    leading: Briefcase,
    href: "/management",
    color: "text-emerald-500",
    children: [
      {
        label: "Secteurs",
        leading: LayoutDashboard,
        href: "/secteurs",
        color: "text-sky-500",
      },
      {
        label: "Avis",
        leading: LayoutDashboard,
        href: "/notices",
        color: "text-sky-500",
      },
    ]
  },
  // {
  //   label: "Tasks",
  //   leading: CheckSquare,
  //   href: "/tasks",
  //   color: "text-red-500",
  // },
  // {
  //   label: "Messages",
  //   leading: MessageSquare,
  //   href: "/messages",
  //   color: "text-blue-500",
  // },
  // {
  //   label: "Inbox",
  //   leading: Inbox,
  //   href: "/inbox",
  //   color: "text-indigo-500",
  // },
  // {
  //   label: "Calendar",
  //   leading: Calendar,
  //   href: "/calendar",
  //   color: "text-green-500",
  // },
  // {
  //   label: "Campaigns",
  //   leading: Megaphone,
  //   href: "/campaigns",
  //   color: "text-yellow-500",
  // },
  {
    label: "Settings",
    leading: Settings,
    href: "/settings",
    color: "text-gray-500",
  },
];

export default function SideBar() {
  return (
    <div className="space-y-4 py-4 flex flex-col h-lvh bg-white w-64 !rounded-br-3xl !rounded-tl-3xl">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-5 mt-3">
          <Image src={imagePathFinder.logo} alt="logo" width={150} />
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <SideBarItem key={route.href} route={route} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SideBarItem({ route }: { route: Onglet }) {
  const pathname = usePathname();

  const [check, setcheck] = useState(false);

  return (
    <div className={cn((check && route.children) && "!bg-slate-200 rounded-xl pt-1")}>
      <Link
        onClick={() => { setcheck(!check); route.active = true; }}
        key={route.href}
        href={route.children ? "#" : route.href}
        className={cn(
          "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:font-semibold hover:bg-slate-200 rounded-lg transition",
          pathname === route.href ? "bg-slate-200" : "transparent",

        )}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center flex-1">
            {route.leading && <route.leading className={cn("h-5 w-5 mr-3", route.color)} />}
            {route.label}
          </div>
          {route.children && (
            !check ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> :
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </Link>

      {(check && route.children) &&
        <div className="pl-5 pr-3 -mt-5">
          <div className="p-4 flex flex-col">
            {route.children?.map(child => <Link href={route.href + child.href} key={child.href}
              className="flex items-center hover:bg-slate-300 rounded-lg transition text-sm px-4 py-1 hover:py-2 hover:font-semibold">
              {child.label}
            </Link>)}
          </div>
        </div>}
    </div>
  );
}