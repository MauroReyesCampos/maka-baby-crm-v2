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
    CreditCard,
    Tag,
    RefreshCcw,
    CircleDollarSign,
    ChevronDown
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

    const [expandedMonths, setExpandedMonths] = useState<{ [key: string]: boolean }>({});

    const toggleMonth = (monthKey: string) => {
        setExpandedMonths(prev => ({
            ...prev,
            [monthKey]: !prev[monthKey]
        }));
    };

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

                <div className="space-y-4">
                    {/* Desktop Table View */}
                    <div className="hidden md:block glass-card overflow-hidden">
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
                                            <td className="p-4 uppercase font-bold text-xs text-primary">
                                                #{sale.saleNumber}
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
                                                    {sale.paid ? 'Pagado' : 'Pendiente'}
                                                </span>
                                            </td>
                                            <td className="p-4 font-bold text-primary">
                                                {formatCurrency(sale.grandTotal)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handlePrint(sale, 'invoice')} title="Imprimir" className="btn-icon">
                                                        <Printer className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handlePrint(sale, 'label')} title="Etiqueta" className="btn-icon text-accent border-accent/20">
                                                        <Tag className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleTogglePayment(sale)} title="Cambiar Estado" className="btn-icon">
                                                        <RefreshCcw className="w-4 h-4" />
                                                    </button>
                                                    {canEditOrDelete && (
                                                        <>
                                                            <button onClick={() => handleOpenModal(sale)} title="Editar" className="btn-icon">
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button onClick={() => deleteSale(sale.id)} title="Borrar" className="btn-icon text-danger border-danger/20">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredSales.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-12 text-center text-muted">
                                                <CircleDollarSign className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                                No hay registros de ventas.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-6">
                        {(() => {
                            const now = new Date();
                            const currentMonthKey = now.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

                            const grouped = filteredSales.reduce((acc: { [key: string]: Sale[] }, sale) => {
                                const date = new Date(sale.date);
                                const monthKey = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
                                if (!acc[monthKey]) acc[monthKey] = [];
                                acc[monthKey].push(sale);
                                return acc;
                            }, {});

                            const sortedMonths = Object.keys(grouped).sort((a, b) => {
                                const dateA = new Date(grouped[a][0].date);
                                const dateB = new Date(grouped[b][0].date);
                                return dateB.getTime() - dateA.getTime();
                            });

                            return sortedMonths.map(monthKey => {
                                const isCurrent = monthKey === currentMonthKey;
                                const isExpanded = isCurrent || expandedMonths[monthKey];
                                const monthSales = grouped[monthKey];
                                const capitalizedMonth = monthKey.charAt(0).toUpperCase() + monthKey.slice(1);

                                return (
                                    <div key={monthKey} className="space-y-4">
                                        <button
                                            onClick={() => !isCurrent && toggleMonth(monthKey)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-2 group transition-all",
                                                !isCurrent && "cursor-pointer hover:opacity-80"
                                            )}
                                        >
                                            <div className="h-px flex-1 bg-[#e8eeee]"></div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-muted uppercase tracking-widest">{capitalizedMonth}</span>
                                                {!isCurrent && (
                                                    <ChevronDown className={cn(
                                                        "w-3 h-3 transition-transform duration-300 text-primary",
                                                        isExpanded ? "rotate-180" : "rotate-0"
                                                    )} />
                                                )}
                                            </div>
                                            <div className="h-px flex-1 bg-[#e8eeee]"></div>
                                        </button>

                                        {isExpanded && (
                                            <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                                                {monthSales.map((sale) => (
                                                    <div key={sale.id} className="glass-card p-6 space-y-4">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <div className="text-xs font-bold text-primary uppercase tracking-tight mb-1">
                                                                    Venta #{sale.saleNumber}
                                                                </div>
                                                                <div className="font-bold text-lg text-main leading-tight">
                                                                    {sale.clientName}
                                                                </div>
                                                                <div className="text-xs text-muted mt-1">
                                                                    {formatDate(sale.date)}
                                                                </div>
                                                            </div>
                                                            <span className={cn(
                                                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                                                sale.paid
                                                                    ? "bg-green-50 text-green-600 border border-green-100"
                                                                    : "bg-red-50 text-red-600 border border-red-100"
                                                            )}>
                                                                {sale.paid ? 'Pagado' : 'Pendiente'}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between p-4 bg-sidebar/50 rounded-2xl">
                                                            <div className="text-sm font-medium text-muted">Total Venta</div>
                                                            <div className="text-xl font-black text-primary">
                                                                {formatCurrency(sale.grandTotal)}
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2">
                                                            <button onClick={() => handleTogglePayment(sale)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#e8eeee] rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-all">
                                                                <RefreshCcw className="w-4 h-4" />
                                                                Estado
                                                            </button>
                                                            <div className="flex gap-2 w-full">
                                                                <button onClick={() => handlePrint(sale, 'invoice')} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#e8eeee] rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-all">
                                                                    <Printer className="w-4 h-4" />
                                                                    Factura
                                                                </button>
                                                                <button onClick={() => handlePrint(sale, 'label')} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#e8eeee] rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-all text-accent">
                                                                    <Tag className="w-4 h-4" />
                                                                    Etiqueta
                                                                </button>
                                                            </div>
                                                            {canEditOrDelete && (
                                                                <div className="flex gap-2 w-full">
                                                                    <button onClick={() => handleOpenModal(sale)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-[#e8eeee] rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-all">
                                                                        <Edit2 className="w-4 h-4" />
                                                                        Editar
                                                                    </button>
                                                                    <button onClick={() => deleteSale(sale.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-danger rounded-xl text-sm font-bold shadow-sm active:scale-95 transition-all">
                                                                        <Trash2 className="w-4 h-4" />
                                                                        Borrar
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            });
                        })()}
                        {filteredSales.length === 0 && (
                            <div className="glass-card p-12 text-center text-muted">
                                <CircleDollarSign className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                No hay registros de ventas.
                            </div>
                        )}
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
