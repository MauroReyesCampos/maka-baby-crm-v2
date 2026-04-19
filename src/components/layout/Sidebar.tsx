"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    CircleDollarSign,
    UserCircle,
    Settings,
    LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const { user } = useAuth();

    const navItems = [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Clientes', href: '/clients', icon: UserCircle },
        { label: 'Ventas', href: '/sales', icon: CircleDollarSign },
    ];

    if (user?.role === 'Super Admin') {
        navItems.push({ label: 'Usuarios', href: '/users', icon: Users });
    }

    navItems.push({ label: 'Perfil', href: '/settings', icon: Settings });

    const handleLogout = async () => {
        if (confirm('¿Deseas cerrar sesión?')) {
            await signOut(auth);
        }
    };

    return (
        <>
            {/* Mobile Toggle Removed as requested */}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-[#e8eeee] flex flex-col transition-transform duration-300 transform lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 flex items-center gap-3">
                    <div className="w-12 h-12 flex items-center justify-center bg-transparent">
                        <img src="/logo.png" alt="MÄKA Baby" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">MÄKA Baby</span>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                                    isActive
                                        ? "bg-white text-primary border border-[#e8eeee] shadow-glass"
                                        : "text-muted hover:bg-white hover:text-primary"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-[#e8eeee]">
                    {user && (
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 rounded-full bg-white border border-[#e8eeee] flex items-center justify-center font-bold text-primary shadow-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-semibold truncate">{user.name}</span>
                                <span className="text-xs text-muted">{user.role}</span>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>


        </>
    );
};
