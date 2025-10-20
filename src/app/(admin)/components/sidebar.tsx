"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  UserCheck,
  Users,
  Wallet,
  Building2,
  Tag,
  Star,
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
  Mail,
  Activity,
  Languages,
  Image as ImageIcon,
  ClipboardList,
  BarChart3,
  TrendingUp,
  Package,
} from "lucide-react";
import { DynamicImage } from "@/components/ui/DynamicImage";
import React, { useState } from "react";
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

interface SidebarSection {
  title?: string;
  routes: Onglet[];
}

const getSidebarSections = (userRole: UserRole | null): SidebarSection[] => [
  // SECTION: Vue d'ensemble
  {
    title: "Vue d'ensemble",
    routes: [
      {
        label: "Tableau de bord",
        leading: LayoutDashboard,
        href: "/dashboard",
        color: "text-blue-600",
      },
    ]
  },

  // SECTION: Recrutement
  {
    title: "Recrutement",
    routes: [
      {
        label: "Candidatures",
        leading: ClipboardList,
        href: "/candidatures",
        color: "text-amber-600",
        permissions: [Permission.APPLICATIONS_READ],
      },
      {
        label: "Embauches",
        leading: UserCheck,
        href: "/hires",
        color: "text-green-600",
        permissions: [Permission.HIRES_READ],
      },
      {
        label: "Contacts",
        leading: Inbox,
        href: "/contacts",
        color: "text-purple-600",
        permissions: [Permission.CONTACTS_READ],
      },
    ]
  },

  // SECTION: Contenu
  {
    title: "Contenu",
    routes: [
      {
        label: "Blog",
        leading: BookOpen,
        href: "/blog",
        color: "text-indigo-600",
        excludeRoles: [UserRole.CONSULTANT],
        children: [
          {
            label: "Articles",
            leading: FileText,
            href: "/articles",
            color: "text-indigo-500",
          },
          {
            label: "Spécialités",
            leading: Package,
            href: "/specialites",
            color: "text-indigo-500",
          },
          {
            label: "Tags",
            leading: Tag,
            href: "/tags",
            color: "text-indigo-500",
          },
        ]
      },
    ]
  },

  // SECTION: Configuration
  {
    title: "Configuration",
    routes: [
      {
        label: "Contenu du site",
        leading: Settings,
        href: "/management",
        color: "text-emerald-600",
        excludeRoles: [UserRole.CONSULTANT, UserRole.HR_ASSISTANT],
        children: [
          {
            label: "Secteurs",
            leading: Building2,
            href: "/secteurs",
            color: "text-emerald-500",
          },
          {
            label: "Avis clients",
            leading: Star,
            href: "/notices",
            color: "text-yellow-500",
          },
          {
            label: "Newsletters",
            leading: Mail,
            href: "/newsletters",
            color: "text-blue-500",
          },
          {
            label: "Traductions",
            leading: Languages,
            href: "/translations",
            color: "text-teal-500",
          },
          {
            label: "Médias",
            leading: ImageIcon,
            href: "/media",
            color: "text-pink-500",
          },
        ]
      },
      {
        label: "Administration",
        leading: Shield,
        href: "",
        color: "text-red-600",
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
        color: "text-violet-600",
        roles: [UserRole.SUPER_ADMIN],
        children: [
          {
            label: "API Docs",
            leading: FileText,
            href: "/api-docs",
            color: "text-violet-500",
          },
        ]
      },
    ]
  },

  // SECTION: Journal
  {
    title: "Journal",
    routes: [
      {
        label: "Activités",
        leading: Activity,
        href: "/activites",
        color: "text-slate-600",
      },
    ]
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
  const sections = getSidebarSections(userRole ?? null);

  return (
    <div className="space-y-4 py-4 flex flex-col h-lvh bg-white w-64 !rounded-br-3xl !rounded-tl-3xl overflow-y-auto">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center justify-center mb-6 mt-3">
          <DynamicImage imageKey="logo" alt="logo" width={140} height={45} />
        </Link>

        <div className="space-y-6">
          {sections.map((section, sectionIndex) => {
            const visibleRoutes = section.routes.filter(route =>
              isRouteVisible(route, userRole ?? null, hasPermission)
            );

            if (visibleRoutes.length === 0) return null;

            return (
              <div key={sectionIndex} className="space-y-1">
                {section.title && (
                  <div className="px-3 mb-2">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                )}
                {visibleRoutes.map((route) => (
                  <SideBarItem
                    key={route.href}
                    route={route}
                    userRole={userRole ?? null}
                    hasPermission={hasPermission}
                  />
                ))}
              </div>
            );
          })}
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

  const isActive = pathname === route.href || pathname!.startsWith(route.href + '/');

  return (
    <div className={cn((check && visibleChildren.length > 0) && "!bg-slate-50 rounded-xl pt-1")}>
      <Link
        onClick={() => { setcheck(!check); route.active = true; }}
        key={route.href}
        href={visibleChildren.length > 0 ? "#" : route.href}
        className={cn(
          "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-slate-100 rounded-lg transition-all duration-200",
          isActive ? "bg-slate-100 text-slate-900 shadow-sm" : "text-slate-600",
        )}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center flex-1">
            {route.leading && <route.leading className={cn("h-5 w-5 mr-3", isActive ? route.color : "text-slate-400", "group-hover:scale-110 transition-transform")} />}
            <span className={cn(isActive && "font-semibold")}>{route.label}</span>
          </div>
          {visibleChildren.length > 0 && (
            !check ? <ChevronDown className="h-4 w-4 text-slate-400" /> :
              <ChevronUp className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </Link>

      {(check && visibleChildren.length > 0) &&
        <div className="pl-3 pr-2 mt-1">
          <div className="py-2 flex flex-col space-y-0.5">
            {visibleChildren.map(child => {
              // Si l'href de l'enfant commence par "/", c'est un lien absolu
              const childHref = child.href.startsWith('/') ? child.href : route.href + child.href;
              const isChildActive = pathname === (route.href + childHref);

              return (
                <Link href={route.href + childHref} key={child.href}
                  className={cn(
                    "flex items-center hover:bg-slate-200 rounded-lg transition-all duration-200 text-sm px-4 py-2",
                    isChildActive ? "bg-slate-200 text-slate-900 font-medium" : "text-slate-600"
                  )}
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