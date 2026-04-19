"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    // Redirect if already logged in
    React.useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Check if trying to create a Super Admin and if one already exists
            const q = query(collection(db, "users"), where("role", "==", "Super Admin"));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                throw new Error('Ya existe un Super Administrador. No se puede crear otro.');
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            await updateProfile(firebaseUser, { displayName: name });

            await setDoc(doc(db, "users", firebaseUser.uid), {
                uid: firebaseUser.uid,
                name,
                email,
                role: 'Super Admin',
                createdAt: new Date().toISOString()
            });

            alert('¡Cuenta creada con éxito! Ahora puedes entrar.');
            router.push('/login');
        } catch (err: any) {
            setError(err.message || 'Error al crear la cuenta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 lg:p-12 shadow-glass animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                <img src="/logo.png" className="w-32 h-auto mx-auto mb-6" alt="Logo" />
                <h2 className="text-2xl lg:text-3xl font-bold text-main mb-2">Configuración Inicial</h2>
                <p className="text-muted mb-8">Cree su cuenta de Admin en la nube</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-danger rounded-xl text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted ml-1">Nombre Completo</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted ml-1">Correo Electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-muted ml-1">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={6}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-full justify-center mt-6 h-12"
                        disabled={loading}
                    >
                        {loading ? 'Creando...' : 'Crear Cuenta'}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-[#e8eeee]">
                    <p className="text-sm text-muted">
                        ¿Ya tienes cuenta? <Link href="/login" className="text-primary font-bold hover:underline">Iniciar Sesión</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
