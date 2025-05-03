import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface AuthContextType {
    user: any;
    setUser: (value: any) => void;
    Log: (cpf: string, password: string) => Promise<void>;
    error: string;
    sucess: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<any>(null);
    const [error, setError] = useState('');
    const [sucess, setSucess] = useState('');

    const Log = async (cpf: string, password: string) => {
        try {
            const response = await fetch('http://localhost:3000/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf, password })
            });

            if (!response.ok) {
                throw new Error("Não autorizado!");
            }

            const data = await response.json();
            sessionStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            setError('');
            setSucess("Usuário autenticado com sucesso");
        } catch (err: any) {
            setError(err.message || 'Erro desconhecido');
        }
    };

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, Log, error, sucess }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
