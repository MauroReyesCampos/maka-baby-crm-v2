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
            <div id="print-area" className="hidden print:block p-[1.5cm] font-sans text-black w-[21cm] min-h-[29.7cm] bg-white mx-auto">
                <style dangerouslySetInnerHTML={{ __html: `
                    @media print {
                        body { background: white; }
                        #print-area { display: block !important; }
                        .no-print { display: none !important; }
                    }
                ` }} />
                
                {/* Header */}
                <div className="flex justify-between items-start mb-12">
                    <img src="/logo.png" className="w-[4.5cm] h-auto" alt="Logo" />
                    <div className="border border-black p-4 text-center min-w-[5cm]">
                        <div className="text-[10pt] tracking-widest uppercase mb-1">Factura de Venta</div>
                        <div className="text-[16pt] font-bold">N° {sale.saleNumber}</div>
                    </div>
                </div>

                {/* Client Info Grid */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-3 mb-8 text-[10.5pt]">
                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <span className="font-bold whitespace-nowrap">CLIENTE:</span>
                            <span className="capitalize">{client.name.toLowerCase()}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold whitespace-nowrap">NIT/CC:</span>
                            <span>{client.id || 'N/A'}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold whitespace-nowrap">DIR:</span>
                            <span>{client.address || 'N/A'} {client.complemento || ''}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold whitespace-nowrap">CIUDAD:</span>
                            <span className="capitalize">{(client.ciudad || client.city || 'Florencia').toLowerCase()}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex gap-2">
                            <span className="font-bold whitespace-nowrap">FECHA:</span>
                            <span>{formatDate(sale.date)}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold whitespace-nowrap">TEL:</span>
                            <span>{client.phone || 'N/A'}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold whitespace-nowrap">BARRIO:</span>
                            <span className="capitalize">{(client.barrio || client.neighborhood || 'N/A').toLowerCase()}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold whitespace-nowrap">DEPTO:</span>
                            <span className="capitalize">{(client.departamento || client.state || 'Caquetá').toLowerCase()}</span>
                        </div>
                    </div>
                </div>

                {/* Horizontal Divider */}
                <div className="border-b-[2px] border-black mb-6"></div>

                {/* Items Table */}
                <table className="w-full text-[10.5pt] border-collapse">
                    <thead>
                        <tr className="uppercase">
                            <th className="py-2 pr-4 text-left font-bold tracking-tight">Descripción</th>
                            <th className="py-2 px-4 text-center font-bold tracking-tight w-[2cm]">Cant</th>
                            <th className="py-2 px-4 text-right font-bold tracking-tight w-[3.5cm]">Valor Unit</th>
                            <th className="py-2 pl-4 text-right font-bold tracking-tight w-[3.5cm]">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan={4} className="border-t-[2px] border-black"></td>
                        </tr>
                        {sale.items.map((item, idx) => (
                            <tr key={idx} className="border-b border-gray-100">
                                <td className="py-3 pr-4 capitalize">{item.description.toLowerCase()}</td>
                                <td className="py-3 px-4 text-center">{item.quantity}</td>
                                <td className="py-3 px-4 text-right">{formatCurrency(item.price)}</td>
                                <td className="py-3 pl-4 text-right font-medium">{formatCurrency(item.quantity * item.price)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Footer Total */}
                <div className="mt-12 flex justify-end">
                    <div className="w-[8cm]">
                        <div className="border-t-[2.5px] border-black mb-2"></div>
                        <div className="flex justify-between items-center px-1">
                            <span className="font-bold uppercase tracking-tight text-[12pt]">Total:</span>
                            <span className="font-bold text-[14pt]">{formatCurrency(sale.grandTotal)}</span>
                        </div>
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
