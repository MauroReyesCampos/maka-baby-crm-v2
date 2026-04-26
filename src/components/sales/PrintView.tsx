"use client";

import React from 'react';
import { Sale, Client } from '@/types';
import { formatCurrency, formatDate, formatDateSimple } from '@/lib/utils';

interface PrintViewProps {
    sale: Sale;
    client: Client;
    type: 'invoice' | 'label';
}

export const PrintView = ({ sale, client, type }: PrintViewProps) => {
    if (type === 'invoice') {
        return (
            <div id="print-area" className="hidden print:block font-sans text-[#2d2d2d] bg-white mx-auto">
                <style dangerouslySetInnerHTML={{ __html: `
                    @media print {
                        @page { 
                            size: letter;
                            margin: 0 !important; 
                        }
                        html, body {
                            margin: 0 !important;
                            padding: 0 !important;
                        }
                        body { 
                            background: white; 
                            -webkit-print-color-adjust: exact;
                        }
                        #print-wrapper {
                            padding: 1.5cm;
                            width: 100%;
                        }
                        #print-area { 
                            display: block !important; 
                            width: 100% !important;
                        }
                        .no-print { display: none !important; }
                        
                        thead { display: table-header-group; }
                        tr { page-break-inside: avoid; }
                    }
                    * { box-sizing: border-box; }
                ` }} />
                
                <div id="print-wrapper">
                    <div className="w-full">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-16">
                            <div className="w-[3.5cm]">
                                <img src="/logo.png" className="w-full h-auto" alt="Logo" />
                            </div>
                            <div className="border-[1.5px] border-black py-4 px-6 text-center min-w-[5.5cm]">
                                <div className="text-[10pt] tracking-[0.25em] uppercase mb-1.5 font-medium text-gray-700">Factura de Venta</div>
                                <div className="text-[19pt] font-black">N° {sale.saleNumber}</div>
                            </div>
                        </div>

                        {/* Client Info Grid */}
                        <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-12 text-[11.5pt]">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <span className="font-bold text-gray-900 whitespace-nowrap min-w-[2.4cm]">CLIENTE:</span>
                                    <span className="text-gray-800">{client.name}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-bold text-gray-900 whitespace-nowrap min-w-[2.4cm]">NIT/CC:</span>
                                    <span className="text-gray-800">{(client as any).nit || (client as any).documento || client.id || 'N/A'}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-bold text-gray-900 whitespace-nowrap min-w-[2.4cm]">DIR:</span>
                                    <span className="text-gray-800">{client.address || 'N/A'} {client.complemento || ''}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-bold text-gray-900 whitespace-nowrap min-w-[2.4cm]">CIUDAD:</span>
                                    <span className="text-gray-800">{client.ciudad || client.city || 'Florencia'}</span>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <span className="font-bold text-gray-900 whitespace-nowrap min-w-[2.4cm]">FECHA:</span>
                                    <span className="text-gray-800">{formatDateSimple(sale.date)}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-bold text-gray-900 whitespace-nowrap min-w-[2.4cm]">TEL:</span>
                                    <span className="text-gray-800">{client.phone || 'N/A'}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-bold text-gray-900 whitespace-nowrap min-w-[2.4cm]">BARRIO:</span>
                                    <span className="text-gray-800">{client.barrio || client.neighborhood || 'N/A'}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="font-bold text-gray-900 whitespace-nowrap min-w-[2.4cm]">DEPTO:</span>
                                    <span className="text-gray-800">{client.departamento || client.state || 'Caquetá'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Main Divider */}
                        <div className="border-b-[2.5px] border-black mb-8"></div>

                        {/* Items Table */}
                        <table className="w-full text-[11.5pt] border-collapse">
                            <thead>
                                <tr className="uppercase text-gray-900">
                                    <th className="pb-3 pr-4 text-left font-black tracking-widest">Descripción</th>
                                    <th className="pb-3 px-4 text-center font-black tracking-widest w-[2cm]">Cant</th>
                                    <th className="pb-3 px-4 text-right font-black tracking-widest w-[3.5cm] whitespace-nowrap">Valor Unit</th>
                                    <th className="pb-3 pl-4 text-right font-black tracking-widest w-[4cm]">Total</th>
                                </tr>
                                <tr>
                                    <td colSpan={4} className="border-t-[4px] border-black pb-2"></td>
                                </tr>
                            </thead>
                            <tbody>
                                {sale.items.map((item, idx) => {
                                    const price = item.price || (item as any).unitPrice || 0;
                                    return (
                                        <tr key={idx} className="border-b border-gray-100">
                                            <td className="py-5 pr-4 text-gray-800 font-medium">{item.description}</td>
                                            <td className="py-5 px-4 text-center text-gray-800">{item.quantity}</td>
                                            <td className="py-5 px-4 text-right text-gray-800">{formatCurrency(price)}</td>
                                            <td className="py-5 pl-4 text-right font-bold text-gray-900">{formatCurrency(item.quantity * price)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* Footer Total */}
                        <div className="mt-16 flex justify-end">
                            <div className="w-[9cm] break-inside-avoid">
                                <div className="border-t-[4px] border-black mb-4"></div>
                                <div className="flex justify-between items-center px-2">
                                    <span className="font-black uppercase tracking-[0.2em] text-[13pt] text-gray-900">Total:</span>
                                    <span className="font-black text-[19pt] text-gray-900">{formatCurrency(sale.grandTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // LABEL PRINT VIEW
    return (
        <div id="print-area" className="hidden print:block font-sans text-[#5d5d5d] bg-white">
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    @page { 
                        size: letter portrait;
                        margin: 0 !important; 
                    }
                    html, body {
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    #print-area { 
                        display: block !important; 
                        width: 100vw !important;
                        height: 100vh !important;
                        padding: 5mm 10mm 10mm 10mm;
                    }
                }
            ` }} />
            
            <div className="w-full h-[12.5cm] border-[3.5px] border-black rounded-[45px] p-10 relative bg-white overflow-hidden">
                {/* Header Sender */}
                <div className="absolute top-6 left-14 text-[13pt] leading-[1.3] font-medium text-[#5d5d5d]">
                    <div className="font-bold text-gray-800 mb-0.5">Milena Raynaud Prado</div>
                    <div>Carrera 65 #169A-50 casa 44</div>
                    <div>Conjunto Jardines del Cabo</div>
                    <div>Bogotá D.C.</div>
                    <div>3177875935</div>
                </div>

                {/* Logo top right */}
                <div className="absolute top-4 right-14 w-[3.8cm]">
                    <img src="/logo.png" className="w-full h-auto" alt="Logo" />
                </div>

                {/* Horizontal Line */}
                <div className="absolute top-[175px] left-0 right-0 border-t-[3px] border-black"></div>

                {/* Client Info Centered */}
                <div className="mt-[165px] flex flex-col items-center justify-center text-center space-y-2.5">
                    <div className="text-[34pt] font-black text-[#5d5d5d] mb-1 leading-tight">{client.name}</div>
                    
                    <div className="text-[20pt] font-medium text-[#6d6d6d]">
                        {client.address || ''}
                    </div>
                    
                    {(client.complemento || client.complement) && (
                        <div className="text-[19pt] font-medium text-[#6d6d6d]">
                            {client.complemento || client.complement}
                        </div>
                    )}

                    <div className="text-[19pt] font-medium text-[#6d6d6d]">
                        {client.barrio || client.neighborhood || ''}
                    </div>

                    <div className="text-[19pt] font-medium text-[#6d6d6d]">
                        {[client.ciudad || client.city, client.departamento || client.state].filter(Boolean).join(' - ')}
                    </div>

                    <div className="text-[26pt] font-bold text-[#5d5d5d] mt-8 tracking-wide">
                        ({client.phone.slice(0, 3)}) {client.phone.slice(3)}
                    </div>
                </div>
            </div>
        </div>
    );
};
