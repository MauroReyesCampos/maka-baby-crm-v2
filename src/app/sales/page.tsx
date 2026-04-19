"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/hooks/useStore';
import { useAuth } from '@/context/AuthContext';
import {
    Plus,
    Search,
    Printer,
    Package,
    DollarSign,
    Edit2,
    Trash2,
    Calendar,
    X,
    CreditCard
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Sale } from '@/types';
import { SaleForm } from '@/components/sales/SaleForm';
import { PrintView } from '@/components/sales/PrintView';

export default function SalesPage() {
    const { sales, clients, addSale, updateSale, deleteSale } = useStore();
    const { user } = useAuth();

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSale, setEditingSale] = useState<Sale | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [saleForPayment, setSaleForPayment] = useState<Sale | null>(null);
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);

    const [printData, setPrintData] = useState<{ sale: Sale; type: 'invoice' | 'label' } | null>(null);

    const canEditOrDelete = user?.role !== 'Vendedor';

    const normalizedSales = sales.map(sale => {
        if (!sale.clientName) {
            const client = clients.find(c => c.id === sale.clientId);
            return { ...sale, clientName: client?.name || 'Cliente Desconocido' };
        }
        return sale as Sale & { clientName: string };
    });

    const filteredSales = normalizedSales.filter(s =>
        s.saleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const handleOpenModal = (sale?: Sale) => {
        setEditingSale(sale || null);
        setIsModalOpen(true);
    };

    const handleTogglePayment = (sale: Sale) => {
        if (!canEditOrDelete) return alert('No tienes permisos.');
        if (sale.paid) {
            if (confirm('¿Marcar esta venta como Pendiente?')) {
                updateSale(sale.id, { paid: false, status: 'Pendiente', paymentDate: undefined });
            }
        } else {
            setSaleForPayment(sale);
            setIsPaymentModalOpen(true);
        }
    };

    const handleConfirmPayment = async () => {
        if (!saleForPayment) return;
        await updateSale(saleForPayment.id, {
            paid: true,
            status: 'Pagado',
            paymentDate: paymentDate
        });

        setIsPaymentModalOpen(false);
        setSaleForPayment(null);
    };

    const handlePrint = (sale: Sale, type: 'invoice' | 'label') => {
        setPrintData({ sale, type });
        setTimeout(() => {
            window.print();
            setPrintData(null);
        }, 100);
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in duration-700 print:hidden">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Ventas</h1>
                        <p className="text-muted mt-1">Gestión de transacciones y facturación.</p>
                    </div>
                    <button onClick={() => handleOpenModal()} className="btn btn-primary">
                        <Plus className="w-5 h-5" />
                        Nueva Venta
                    </button>
                </header>

                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-[#e8eeee] shadow-sm">
                    <div className="ml-3 text-muted">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por número de venta o cliente..."
                        className="flex-1 bg-transparent border-none focus:ring-0 p-2 text-main"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-sidebar">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-muted">No. Venta</th>
                                    <th className="p-4 text-sm font-semibold text-muted">Fecha</th>
                                    <th className="p-4 text-sm font-semibold text-muted">Cliente</th>
                                    <th className="p-4 text-sm font-semibold text-muted text-center">Estado</th>
                                    <th className="p-4 text-sm font-semibold text-muted">Total</th>
                                    <th className="p-4 text-sm font-semibold text-muted text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e8eeee]">
                                {filteredSales.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-sidebar/30 transition-colors">
                                        <td className="p-4 uppercase font-bold text-xs">
                                            <span className="bg-white border border-[#e8eeee] px-2 py-1 rounded-lg">
                                                {sale.saleNumber}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-muted">
                                            {formatDate(sale.date)}
                                        </td>
                                        <td className="p-4">
                                            <div className="font-semibold text-main">{sale.clientName}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                sale.paid
                                                    ? "bg-green-50 text-green-600 border border-green-100"
                                                    : "bg-red-50 text-red-600 border border-red-100"
                                            )}>
                                                {sale.paid ? 'Pagada' : 'Pendiente'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-primary">{formatCurrency(sale.grandTotal)}</div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handlePrint(sale, 'invoice')} className="btn-icon" title="Imprimir Factura">
                                                    <Printer className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handlePrint(sale, 'label')} className="btn-icon" title="Etiqueta de Envío">
                                                    <Package className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleTogglePayment(sale)}
                                                    className={cn("btn-icon", sale.paid ? "text-green-600 border-green-600" : "text-amber-600 border-amber-600")}
                                                    title={sale.paid ? "Marcar como pendiente" : "Registrar pago"}
                                                >
                                                    {sale.paid ? <CreditCard className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                                                </button>
                                                {canEditOrDelete && (
                                                    <>
                                                        <button onClick={() => handleOpenModal(sale)} className="btn-icon" title="Editar">
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        <button onClick={() => deleteSale(sale.id)} className="btn-icon text-danger border-none hover:bg-red-50" title="Eliminar">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <SaleForm
                    sale={editingSale}
                    clients={clients}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={async (data) => {
                        if (editingSale) await updateSale(editingSale.id, data);
                        else await addSale(data);
                        setIsModalOpen(false);
                    }}
                />
            )}

            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h2 className="text-xl font-bold mb-4">Registrar Pago</h2>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm text-muted">Fecha de Pago</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={paymentDate}
                                    onChange={e => setPaymentDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button onClick={() => setIsPaymentModalOpen(false)} className="btn btn-ghost">Cancelar</button>
                            <button onClick={handleConfirmPayment} className="btn btn-primary">Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {printData && (
                <PrintView
                    sale={printData.sale}
                    client={clients.find(c => c.id === printData.sale.clientId)!}
                    type={printData.type}
                />
            )}
        </DashboardLayout>
    );
}
