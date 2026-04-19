"use client";

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useStore } from '@/hooks/useStore';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    UserPlus,
    Phone,
    Mail,
    MapPin,
    X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Client } from '@/types';

export default function ClientsPage() {
    const { clients, addClient, updateClient, deleteClient } = useStore();
    const [searchTerm, setSearchTerm] = useState('');


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        complemento: '',
        barrio: '',
        ciudad: '',
        departamento: ''
    });


    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    const handleOpenModal = (client?: Client) => {
        if (client) {
            setEditingClient(client);
            setFormData({
                name: client.name,
                phone: client.phone,
                email: client.email || '',
                address: client.address || '',
                complemento: client.complemento || client.complement || '',
                barrio: client.barrio || client.neighborhood || '',
                ciudad: client.ciudad || client.city || '',
                departamento: client.departamento || client.state || ''
            });


        } else {
            setEditingClient(null);
            setFormData({ name: '', phone: '', email: '', address: '', complemento: '', barrio: '', ciudad: '', departamento: '' });
        }

        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingClient) {
                await updateClient(editingClient.id, formData);
            } else {
                await addClient({ ...formData, createdAt: new Date().toISOString() });
            }
            setIsModalOpen(false);
        } catch (error) {
            alert('Error al guardar cliente');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar este cliente?')) {
            await deleteClient(id);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-8 animate-in fade-in duration-700">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
                        <p className="text-muted mt-1">Gestione su base de datos de clientes.</p>
                    </div>
                    <button onClick={() => handleOpenModal()} className="btn btn-primary">
                        <Plus className="w-5 h-5" />
                        Nuevo Cliente
                    </button>
                </header>

                <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-[#e8eeee] shadow-sm">
                    <div className="ml-3 text-muted">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Buscar por nombre o teléfono..."
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
                                    <th className="p-4 text-sm font-semibold text-muted">Nombre</th>
                                    <th className="p-4 text-sm font-semibold text-muted">Contacto</th>
                                    <th className="p-4 text-sm font-semibold text-muted">Ubicación</th>
                                    <th className="p-4 text-sm font-semibold text-muted text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e8eeee]">
                                {filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-sidebar/30 transition-colors">
                                        <td className="p-4">
                                            <div className="font-semibold text-main">{client.name}</div>
                                            <div className="text-xs text-muted">ID: {client.id.slice(0, 8)}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="w-3 h-3 text-primary" />
                                                {client.phone}
                                            </div>
                                            {client.email && (
                                                <div className="flex items-center gap-2 text-xs text-muted mt-1">
                                                    <Mail className="w-3 h-3" />
                                                    {client.email}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="w-3 h-3 text-accent" />
                                                {client.address || 'Sin dirección'}
                                            </div>
                                            <div className="text-xs text-muted ml-5">
                                                {[
                                                    client.barrio || client.neighborhood,
                                                    client.ciudad || client.city,
                                                    client.departamento || client.state
                                                ].filter(Boolean).join(', ') || '-'}
                                            </div>



                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleOpenModal(client)} className="btn-icon">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(client.id)} className="btn-icon hover:bg-danger hover:border-danger hover:text-white">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredClients.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center">
                                            <div className="flex flex-col items-center gap-3 text-muted">
                                                <UserPlus className="w-12 h-12 opacity-20" />
                                                <p>No se encontraron clientes.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Cliente */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-primary">
                                {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="btn-icon">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-muted ml-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-muted ml-1">Teléfono</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        required
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-muted ml-1">Email (Opcional)</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-muted ml-1">Dirección</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-muted ml-1">Complemento (Opcional)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Ej: Apto 201, Edificio X, etc."
                                        value={formData.complemento}
                                        onChange={e => setFormData({ ...formData, complemento: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-muted ml-1">Barrio</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.barrio}
                                        onChange={e => setFormData({ ...formData, barrio: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-muted ml-1">Ciudad</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.ciudad}
                                        onChange={e => setFormData({ ...formData, ciudad: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-muted ml-1">Departamento</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData.departamento}
                                        onChange={e => setFormData({ ...formData, departamento: e.target.value })}
                                    />
                                </div>

                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost px-8">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-primary px-8">
                                    {editingClient ? 'Actualizar' : 'Guardar Cliente'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
