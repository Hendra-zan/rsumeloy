"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useContextHooks';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '../../components/ui/Card';
import { Loader2, ArrowLeft } from '../../components/icons';
import OptimizedImage from '../../components/ui/OptimizedImage';
import Link from 'next/link';

const LoginPage: React.FC = () => {
    const { login, session, loading: authLoading } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!authLoading && session) {
            router.replace('/admin');
        }
    }, [session, authLoading, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await login(email, password);
            // Navigation is handled by the AuthContext now
        } catch (err: any) {
            setError(err.message || 'Login gagal. Periksa kembali email dan password Anda.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || session) {
        return (
            <div className="flex-1 flex h-screen items-center justify-center bg-secondary">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }


    return (
        <div className="flex-1 flex items-center justify-center bg-secondary">
            <Card className="w-full max-w-md animate-fade-in">
                <CardHeader className="text-center">
                    <OptimizedImage publicId="logo_rsmeloy_web" alt="Logo" width={64} height={64} className="w-16 h-16 mx-auto mb-4" />
                    <CardTitle>Admin Login</CardTitle>
                    <CardDescription>
                        Halaman ini khusus untuk administrator website. <br/>
                        Masuk ke dasbor untuk mengelola konten.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium" htmlFor="email">Email</label>
                            <input 
                                id="email"
                                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-base" 
                                type="email" 
                                placeholder="admin@rsumeloy.com" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium" htmlFor="password">Password</label>
                            <input 
                                id="password"
                                className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-base" 
                                type="password" 
                                placeholder="******" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Login'}
                        </Button>
                    </form>
                     <div className="mt-6 text-center">
                        <Button variant="link" asChild className="text-sm text-muted-foreground">
                             <Link href="/">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Kembali ke Halaman Utama
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;