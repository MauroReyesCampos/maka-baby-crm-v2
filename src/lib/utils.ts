import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    }).format(amount).replace(/\s/g, '');
}

export function formatDate(date: string) {
    return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
    }).format(new Date(date));
}

export function formatDateSimple(date: string) {
    const d = new Date(date);
    const day = d.getUTCDate();
    const month = d.getUTCMonth() + 1;
    const year = d.getUTCFullYear();
    return `${day}/${month}/${year}`;
}
