"use client";

import React from 'react';
import { Sale, Client } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface PrintViewProps {
    sale: Sale;
    client: Client;
    type: 'invoice' | 'label';
}

export const PrintView = ({ sale, client, type }: PrintViewProps) => {
    if (type === 'invoice') {
        return (
            <div id="print-area" className="hidden print:block p-[2cm] font-sans text-[#333] w-[21cm] min-h-[27cm] bg-white mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <img src="/logo.png" className="w-[4cm] h-auto" alt="Logo" />
                    <div className="border border-black p-2 text-center">
                        <div className="text-[0.8rem]">FACTURA DE VENTA</div>
                        <div className="text-[1.2rem] font-bold">N° {sale.saleNumber}</div>
                    </div>
                </div>

                <div className="border-b-2 border-black py-4 mb-4 grid grid-cols-2 gap-4">
                    <div><strong>CLIENTE:</strong> {client.name}</div>
                    <div className="text-right"><strong>FECHA:</strong> {formatDate(sale.date)}</div>
                    <div><strong>CONTACTO:</strong> {client.phone}</div>
                    <div className="text-right"><strong>EMAIL:</strong> {client.email || 'N/A'}</div>
                    <div className="col-span-2"><strong>DIRECCIÓN:</strong> {client.address || ''} {client.barrio ? `, ${client.barrio}` : ''}</div>
                    <div><strong>UBICACIÓN:</strong> {client.departamento || ''}</div>
                </div>

                <table className="w-full border-collapse mb-8 text-sm">
                    <thead>
                        <tr className="border-b-2 border-black">
                            <th className="p-2 text-left">DESCRIPCIÓN</th>
                            <th className="p-2 text-center">CANT</th>
                            <th className="p-2 text-right">VALOR UNIT</th>
                            <th className="p-2 text-right">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sale.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-100">
                                <td className="p-2">{item.description}</td>
                                <td className="p-2 text-center">{item.quantity}</td>
                                <td className="p-2 text-right">{formatCurrency(item.price)}</td>
                                <td className="p-2 text-right">{formatCurrency(item.quantity * item.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="flex justify-end">
                    <div className="w-[6cm] border-t-2 border-black pt-2 flex justify-between font-bold">
                        <span>TOTAL:</span>
                        <span>{formatCurrency(sale.grandTotal)}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div id="print-area" className="hidden print:block w-[21.59cm] h-[13.97cm] bg-white p-[0.5cm] mx-auto">
            <div className="w-full h-full border-[4px] border-black rounded-[40px] p-10 relative box-border">
                <div className="absolute top-10 left-16 text-[1.1rem] leading-tight">
                    <strong>Milena Raynaud Prado</strong><br />
                    Carrera 65 #169A-50 casa 44<br />
                    Conjunto Jardines del Cabo<br />
                    Bogotá D.C.<br />
                    3177875935
                </div>
                <img src="/logo.png" className="absolute top-4 right-16 w-36" alt="Logo" />
                <div className="absolute top-[175px] left-10 right-10 border-t-[3px] border-black"></div>
                <div className="absolute top-[205px] left-10 right-10 text-center space-y-2">
                    <div className="text-[2.6rem] font-bold">{client.name}</div>
                    <div className="text-[1.7rem]">{client.address || ''}</div>
                    <div className="text-[1.5rem]">
                        {[client.barrio, client.departamento].filter(Boolean).join(', ')}
                    </div>
                    <div className="text-[1.8rem] font-bold mt-4">{client.phone}</div>
                </div>
            </div>
        </div>
    );
};
