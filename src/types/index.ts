export type UserRole = 'Super Admin' | 'Admin' | 'Vendedor' | 'Invitado';

export interface User {
    id: string;
    uid: string;
    name: string;
    email: string;
    role: UserRole;
    createdAt?: string;
}

export interface Client {
    id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    complemento?: string;
    complement?: string; // Legacy
    barrio?: string;
    neighborhood?: string; // Legacy
    ciudad?: string;
    city?: string; // Legacy
    departamento?: string;
    state?: string; // Legacy
    nit?: string;
    createdAt: string;
}

export interface SaleItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
    unitPrice?: number; // Legacy
    total?: number; // Legacy
}

export interface Sale {
    id: string;
    saleNumber: string;
    clientId: string;
    clientName?: string; // Optional for legacy
    items: SaleItem[];
    subtotal: number;
    discount: number;
    grandTotal: number;
    date: string;
    paid: boolean;
    paymentDate?: string;
    status: 'Pendiente' | 'Pagado' | 'Cancelado';
    notes?: string;
}
