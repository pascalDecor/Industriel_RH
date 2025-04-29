import { format } from "date-fns";
import { fr } from "date-fns/locale";

export function formatDateFr(date: Date | string, pattern = "PPP") {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, pattern, { locale: fr });
}


export function formatDate(date: Date | string, pattern = "PPP") {
    const d = typeof date === "string" ? new Date(date) : date;
    return format(d, pattern);
  }
