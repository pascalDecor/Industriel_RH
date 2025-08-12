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
  FileText,
  Code,
  Shield,
} from "lucide-react";
import Image from "next/image";
import { imagePathFinder } from "@/utils/imagePathFinder";
import React, { useState } from "react";
import { LuAlbum } from "react-icons/lu";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission, UserRole } from "@/types/auth";


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
  permissions?: Permission[];
  roles?: UserRole[];
  excludeRoles?: UserRole[];
}

const getRoutes = (userRole: UserRole | null): Onglet[] => [
  {
    label: "Dashboard",
    leading: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
    children: [
      {
        label: "Main",
        leading: LayoutDashboard,
        href: "/",
        color: "text-sky-500",
      },
      {
        label: "Analytics",
        leading: LayoutDashboard,
        href: "/analytics",
        color: "text-sky-500",
        roles: [UserRole.SUPER_ADMIN, UserRole.HR_DIRECTOR, UserRole.HR_MANAGER],
      },
      {
        label: "Ecommerce",
        leading: LayoutDashboard,
        href: "/ecommerce",
        color: "text-sky-500",
        excludeRoles: [UserRole.CONSULTANT],
      },
      {
        label: "Marketing",
        leading: LayoutDashboard,
        href: "/marketing",
        color: "text-sky-500",
        excludeRoles: [UserRole.CONSULTANT, UserRole.HR_ASSISTANT],
      },
    ]
  },
  {
    label: "Blog",
    leading: ShoppingCart,
    href: "/blog",
    color: "text-violet-500",
    excludeRoles: [UserRole.CONSULTANT],
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
    permissions: [Permission.APPLICATIONS_READ],
  },
  {
    label: "Embauches",
    leading: LuAlbum,
    href: "/hires",
    color: "text-orange-500",
    permissions: [Permission.HIRES_READ],
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
    excludeRoles: [UserRole.CONSULTANT, UserRole.HR_ASSISTANT],
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
  {
    label: "Contacts",
    leading: Inbox,
    href: "/contacts",
    color: "text-indigo-500",
    permissions: [Permission.CONTACTS_READ],
  },
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
    label: "Administration",
    leading: Settings,
    href: "",
    color: "text-red-500",
    permissions: [Permission.USERS_READ, Permission.ROLES_MANAGE],
    children: [
      {
        label: "Utilisateurs",
        leading: Users,
        href: "/users",
        color: "text-red-500",
        permissions: [Permission.USERS_READ],
      },
      {
        label: "Rôles & Permissions",
        leading: Shield,
        href: "/roles",
        color: "text-red-500",
        permissions: [Permission.ROLES_MANAGE],
      },
    ]
  },
  {
    label: "Développement",
    leading: Code,
    href: "",
    color: "text-purple-500",
    roles: [UserRole.SUPER_ADMIN],
    children: [
      {
        label: "API Docs",
        leading: FileText,
        href: "/api-docs",
        color: "text-purple-500",
      },
    ]
  },
  {
    label: "Settings",
    leading: Settings,
    href: "/settings",
    color: "text-gray-500",
  },
];

const isRouteVisible = (route: Onglet, userRole: UserRole | null, hasPermission: (permission: Permission) => boolean): boolean => {
  // Si l'utilisateur n'est pas connecté, ne pas afficher les routes protégées
  if (!userRole) return false;

  // Vérifier les rôles exclus
  if (route.excludeRoles && route.excludeRoles.includes(userRole)) {
    return false;
  }

  // Vérifier les rôles requis
  if (route.roles && !route.roles.includes(userRole)) {
    return false;
  }

  // Vérifier les permissions
  if (route.permissions) {
    return route.permissions.some(permission => hasPermission(permission));
  }

  return true;
};

export default function SideBar() {
  const { userRole, hasPermission } = usePermissions();
  const routes = getRoutes(userRole);

  const visibleRoutes = routes.filter(route => isRouteVisible(route, userRole, hasPermission));

  return (
    <div className="space-y-4 py-4 flex flex-col h-lvh bg-white w-64 !rounded-br-3xl !rounded-tl-3xl">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-5 mt-3">
          <Image loading="lazy" src={imagePathFinder.logo} alt="logo" width={150} />
        </Link>
        <div className="space-y-1">
          {visibleRoutes.map((route) => (
            <SideBarItem key={route.href} route={route} userRole={userRole} hasPermission={hasPermission} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SideBarItem({ route, userRole, hasPermission }: { 
  route: Onglet;
  userRole: UserRole | null;
  hasPermission: (permission: Permission) => boolean;
}) {
  const pathname = usePathname();
  const [check, setcheck] = useState(false);

  // Filtrer les enfants visibles
  const visibleChildren = route.children?.filter(child => 
    isRouteVisible(child, userRole, hasPermission)
  ) || [];

  return (
    <div className={cn((check && visibleChildren.length > 0) && "!bg-slate-200 rounded-xl pt-1")}>
      <Link
        onClick={() => { setcheck(!check); route.active = true; }}
        key={route.href}
        href={visibleChildren.length > 0 ? "#" : route.href}
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
          {visibleChildren.length > 0 && (
            !check ? <ChevronDown className="h-5 w-5 text-muted-foreground" /> :
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </Link>

      {(check && visibleChildren.length > 0) &&
        <div className="pl-5 pr-3 -mt-5">
          <div className="p-4 flex flex-col">
            {visibleChildren.map(child => {
              // Si l'href de l'enfant commence par "/", c'est un lien absolu
              const childHref = child.href.startsWith('/') ? child.href : route.href + child.href;
              return (
                <Link href={ route.href + childHref} key={child.href}
                  className="flex items-center hover:bg-slate-300 rounded-lg transition text-sm px-4 py-1 hover:py-2 hover:font-semibold"
                  target={child.href === '/api-docs' ? '_blank' : '_self'}
                  rel={child.href === '/api-docs' ? 'noopener noreferrer' : undefined}
                >
                  {child.leading && <child.leading className={cn("h-4 w-4 mr-2", child.color)} />}
                  {child.label}
                  {child.href === '/api-docs' && (
                    <svg className="h-3 w-3 ml-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </Link>
              );
            })}
          </div>
        </div>}
    </div>
  );
}