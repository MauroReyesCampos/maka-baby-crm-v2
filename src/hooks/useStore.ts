"use client";

import { useState, useEffect } from 'react';
import {
    collection,
    onSnapshot,
    query,
    orderBy,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Client, Sale, User } from '@/types';

export const useStore = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubClients = onSnapshot(collection(db, "clients"), (snapshot) => {
            setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client)));
            setLoading(false);
        });

        const unsubSales = onSnapshot(query(collection(db, "sales"), orderBy("date", "desc")), (snapshot) => {
            setSales(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Sale)));
        });

        const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
            setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User)));
        });

        return () => {
            unsubClients();
            unsubSales();
            unsubUsers();
        };
    }, []);

    const addClient = async (client: Omit<Client, 'id'>) => {
        await addDoc(collection(db, "clients"), client);
    };

    const updateClient = async (id: string, client: Partial<Client>) => {
        await updateDoc(doc(db, "clients", id), client);
    };

    const deleteClient = async (id: string) => {
        await deleteDoc(doc(db, "clients", id));
    };

    const addSale = async (sale: Omit<Sale, 'id' | 'saleNumber'>) => {
        const year = new Date().getFullYear();
        const yearSales = sales.filter(s => s.saleNumber?.startsWith(year.toString()));

        let nextNum = 1;
        if (yearSales.length > 0) {
            const nums = yearSales.map(s => {
                const parts = s.saleNumber.split('-');
                return parts.length > 1 ? parseInt(parts[1]) : 0;
            });
            nextNum = Math.max(...nums) + 1;
        }

        const saleNumber = `${year}-${nextNum.toString().padStart(3, '0')}`;

        await addDoc(collection(db, "sales"), {
            ...sale,
            saleNumber,
            date: new Date().toISOString(),
        });
    };

    const updateSale = async (id: string, sale: Partial<Sale>) => {
        await updateDoc(doc(db, "sales", id), sale);
    };

    const deleteSale = async (id: string) => {
        await deleteDoc(doc(db, "sales", id));
    };

    return {
        clients,
        sales,
        users,
        loading,
        addClient,
        updateClient,
        deleteClient,
        addSale,
        updateSale,
        deleteSale
    };
};
