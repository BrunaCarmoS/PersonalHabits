import type { LucideIcon } from "lucide-react";
import { CheckSquare, BookOpen, Calendar, Target, BarChart3, ListChecks } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { title: "Visão de hoje", href: "/today", icon: CheckSquare },
  { title: "Hábitos", href: "/habits", icon: Target },
  { title: "Tarefas", href: "/tasks", icon: ListChecks },
  { title: "Diário", href: "/journal", icon: BookOpen },
  { title: "Calendário", href: "/calendar", icon: Calendar },
  { title: "Relatórios", href: "/reports", icon: BarChart3 },
];