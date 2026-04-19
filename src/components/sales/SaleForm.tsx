"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, X, Search } from 'lucide-react';
import { Client, Sale, SaleItem } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';

interface SaleFormProps {
    sale?: Sale | null;
    clients: Client[];
    onSubmit: (saleData: any) => Promise<void>;
    onClose: () => void;
}

export const SaleForm = ({ sale, clients, onSubmit, onClose }: SaleFormProps) => {
    const [clientId, setClientId] = useState(sale?.clientId || '');
    const [items, setItems] = useState<Omit<SaleItem, 'id'>[]>(
        sale?.items.map(({ id, ...rest }) => ({
            ...rest,
            price: rest.price ?? rest.unitPrice ?? 0
        })) || [{ description: '', quantity: 1, price: 0 }]
    );


    const [loading, setLoading] = useState(false);

    const subtotal = items.reduce((sum, item) => sum + (item.quantity * (item.price ?? 0)), 0);

    const grandTotal = subtotal; // Simplified for now, can add discount later

    const handleAddItem = () => {
        setItems([...items, { description: '', quantity: 1, price: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: keyof Omit<SaleItem, 'id'>, value: string | number) => {
        const newItems = [...items];
        if (field === 'price' && typeof value === 'string') {
            value = parseInt(value.replace(/\D/g, '')) || 0;
        }
        (newItems[index] as any)[field] = value;
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientId) return alert('Por favor seleccione un cliente');
        if (items.some(i => !i.description)) return alert('Todos los productos deben tener una descripción');

        setLoading(true);
        try {
            const client = clients.find(c => c.id === clientId);
            await onSubmit({
                clientId,
                clientName: client?.name || 'Desconocido',
                items: items.map((item, index) => ({ ...item, id: index.toString() })),
                subtotal,
                discount: 0,
                grandTotal,
                status: sale?.status || 'Pendiente',
                paid: sale?.paid || false,
                paymentDate: sale?.paymentDate || null
            });
        } catch (err) {
            alert('Error al guardar la venta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-4xl p-8 shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-primary">
                        {sale ? `Editar Venta ${sale.saleNumber}` : 'Nueva Venta'}
                    </h2>
                    <button onClick={onClose} className="btn-icon">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted ml-1">Seleccionar Cliente</label>
                        <select
                            className="form-control"
                            required
                            value={clientId}
                            onChange={e => setClientId(e.target.value)}
                        >
                            <option value="">Seleccione un cliente...</option>
                            {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.name} {c.phone ? `(${c.phone})` : ''}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-main">Detalle de Productos</h3>
                            <button
                                type="button"
                                onClick={handleAddItem}
                                className="btn btn-ghost text-primary border-primary/20"
                            >
                                <Plus className="w-4 h-4" />
                                Añadir Producto
                            </button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-[1fr_80px_150px_130px_40px] gap-3 items-end p-4 bg-background rounded-2xl border border-[#e8eeee]">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-muted uppercase ml-1">Descripción</label>
                                        <input
                                            type="text"
                                            className="form-control py-2"
                                            placeholder="Nombre del producto"
                                            value={item.description}
                                            onChange={e => updateItem(index, 'description', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-muted uppercase ml-1">Cant.</label>
                                        <input
                                            type="number"
                                            className="form-control py-2 text-center"
                                            min="1"
                                            value={item.quantity}
                                            onChange={e => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-muted uppercase ml-1">Precio Unit.</label>
                                        <input
                                            type="text"
                                            className="form-control py-2"
                                            value={(item.price ?? 0).toLocaleString()}
                                            onChange={e => updateItem(index, 'price', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-muted uppercase ml-1">Total</label>
                                        <div className="bg-white border border-[#e8eeee] rounded-xl px-3 py-2 text-sm font-bold text-primary flex items-center h-[46px]">
                                            {formatCurrency(item.quantity * (item.price ?? 0))}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(index)}
                                        className="p-3 text-danger hover:bg-red-50 rounded-xl transition-colors h-[46px] flex items-center justify-center"
                                        disabled={items.length === 1}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-[#e8eeee] flex flex-col items-end">
                        <div className="text-right space-y-1">
                            <span className="text-sm text-muted">Total Venta</span>
                            <div className="text-3xl font-bold text-primary">{formatCurrency(grandTotal)}</div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8">
                        <button type="button" onClick={onClose} className="btn btn-ghost px-8">
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary px-8" disabled={loading}>
                            {loading ? 'Guardando...' : sale ? 'Actualizar Venta' : 'Registrar Venta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
