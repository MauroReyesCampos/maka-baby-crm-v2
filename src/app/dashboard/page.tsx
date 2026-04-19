"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/hooks/useStore';
import { formatCurrency, cn } from '@/lib/utils';
import {
    TrendingUp,
    Users,
    CreditCard,
    Clock,
    ChevronRight
} from 'lucide-react';

export default function DashboardPage() {
    const { sales, loading } = useStore();
    const [showYearlyDetail, setShowYearlyDetail] = useState(false);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthSales = sales.filter(s => {
        const date = new Date(s.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const paidSalesThisMonth = sales.filter(s => {
        if (!s.paid || !s.paymentDate) return false;
        const pDate = new Date(s.paymentDate + 'T00:00:00');
        return pDate.getMonth() === currentMonth && pDate.getFullYear() === currentYear;
    });

    const paidSalesThisYear = sales.filter(s => {
        if (!s.paid || !s.paymentDate) return false;
        const pDate = new Date(s.paymentDate + 'T00:00:00');
        return pDate.getFullYear() === currentYear;
    });

    const monthTotal = paidSalesThisMonth.reduce((sum, s) => sum + (Number(s.grandTotal) || 0), 0);
    const pendingTotal = monthSales.filter(s => !s.paid).reduce((sum, s) => sum + (Number(s.grandTotal) || 0), 0);
    const yearTotal = paidSalesThisYear.reduce((sum, s) => sum + (Number(s.grandTotal) || 0), 0);

    const stats = [
        {
            label: 'Ventas del Mes',
            value: monthSales.length,
            desc: 'Cantidad total',
            icon: Users,
            color: 'bg-blue-50 text-blue-600'
        },
        {
            label: 'Por Cobrar',
            value: formatCurrency(pendingTotal),
            desc: 'Pendiente mes',
            icon: Clock,
            color: 'bg-danger/10 text-danger'
        },
        {
            label: 'Ingresos del Mes',
            value: formatCurrency(monthTotal),
            desc: 'Cobrado mes',
            icon: TrendingUp,
            color: 'bg-primary/10 text-primary'
        },
        {
            label: 'Total Año',
            value: formatCurrency(yearTotal),
            desc: currentYear.toString(),
            icon: CreditCard,
            color: 'bg-accent/10 text-main',
            onClick: () => setShowYearlyDetail(true)
        },
    ];

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const monthlySummary = Array.from({ length: 12 }, (_, i) => {
        const createdThisMonth = sales.filter(s => {
            const date = new Date(s.date);
            return date.getMonth() === i && date.getFullYear() === currentYear;
        });
        const paidThisMonth = sales.filter(s => {
            if (!s.paid || !s.paymentDate) return false;
            const pDate = new Date(s.paymentDate + 'T00:00:00');
            return pDate.getMonth() === i && pDate.getFullYear() === currentYear;
        });
        const total = paidThisMonth.reduce((sum, s) => sum + (Number(s.grandTotal) || 0), 0);
        return { month: monthNames[i], total, count: createdThisMonth.length };
    });

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in duration-700">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted mt-1">Resumen general de su negocio hoy.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.label}
                                onClick={stat.onClick}
                                className={cn(
                                    "glass-card p-6 flex flex-col justify-between transition-all duration-300 hover:translate-x-1 hover:border-primary",
                                    stat.onClick && "cursor-pointer active:scale-95"
                                )}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={cn("p-3 rounded-2xl", stat.color)}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    {stat.onClick && <ChevronRight className="w-5 h-5 text-muted" />}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted">{stat.label}</p>
                                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                                    <p className="text-xs text-muted mt-1">{stat.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="glass-card p-8 lg:p-12 text-center border-dashed">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-primary mb-3">¡Bienvenido a MÄKA Baby CRM!</h2>
                        <p className="text-muted leading-relaxed">
                            Use el menú lateral para gestionar sus clientes, registrar nuevas ventas o administrar su equipo de trabajo.
                            Toda la información se sincroniza en tiempo real con la nube.
                        </p>
                    </div>
                </div>
            </div>

            {/* Yearly Detail Modal */}
            {showYearlyDetail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-primary">Resumen Anual {currentYear}</h2>
                            <button onClick={() => setShowYearlyDetail(false)} className="btn-icon">
                                <Clock className="w-5 h-5" /> {/* Close icon substitution if needed, but I'll use X if available or just text */}
                            </button>
                        </div>

                        <div className="border border-[#e8eeee] rounded-2xl overflow-hidden mb-6">
                            <div className="max-h-[400px] overflow-y-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-sidebar sticky top-0">
                                        <tr>
                                            <th className="p-4 text-sm font-semibold text-muted">Mes</th>
                                            <th className="p-4 text-sm font-semibold text-muted text-center">Cant.</th>
                                            <th className="p-4 text-sm font-semibold text-muted text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {monthlySummary.map((m) => (
                                            <tr key={m.month} className="border-t border-[#e8eeee] hover:bg-sidebar/50 transition-colors">
                                                <td className="p-4 text-sm font-medium">{m.month}</td>
                                                <td className="p-4 text-sm text-center">{m.count}</td>
                                                <td className="p-4 text-sm font-bold text-right">{formatCurrency(m.total)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button onClick={() => setShowYearlyDetail(false)} className="btn btn-primary px-8">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
