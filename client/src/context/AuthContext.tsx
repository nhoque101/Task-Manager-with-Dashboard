'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, LoginCredentials, SignupCredentials, StoredUser } from '../types/auth';

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    signup: (credentials: SignupCredentials) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
    | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
    | { type: 'LOGOUT' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
                error: null,
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };
        default:
            return state;
    }
};

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

const generateUserId = () => {
    return 'user_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const getStoredUsers = (): Record<string, StoredUser> => {
    if (typeof window === 'undefined') return {};
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : {};
};

const saveUser = (user: StoredUser) => {
    const users = getStoredUsers();
    users[user.id] = user;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Store current user without password
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem('currentUser', JSON.stringify({ 
        user: userWithoutPassword, 
        token: user.token 
    }));
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const { user, token } = JSON.parse(storedUser);
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, token },
            });
        } else {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const login = async (credentials: LoginCredentials) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const users = getStoredUsers();
            const user = Object.values(users).find(
                (u) => u.email === credentials.email && u.password === credentials.password
            );

            if (!user) {
                throw new Error('Invalid credentials');
            }

            const { password, ...userWithoutPassword } = user;
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user: userWithoutPassword, token: user.token },
            });
            localStorage.setItem('currentUser', JSON.stringify({ 
                user: userWithoutPassword, 
                token: user.token 
            }));
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
            throw error;
        }
    };

    const signup = async (credentials: SignupCredentials) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const users = getStoredUsers();
            if (Object.values(users).some((u) => u.email === credentials.email)) {
                throw new Error('Email already exists');
            }

            const userId = generateUserId();
            const token = 'token_' + Math.random().toString(36).substr(2);
            const newUser: StoredUser = {
                id: userId,
                email: credentials.email,
                name: credentials.name,
                password: credentials.password,
                token,
            };

            saveUser(newUser);

            const { password, ...userWithoutPassword } = newUser;
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user: userWithoutPassword, token },
            });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Signup failed' });
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('currentUser');
        dispatch({ type: 'LOGOUT' });
    };

    const value = {
        ...state,
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
