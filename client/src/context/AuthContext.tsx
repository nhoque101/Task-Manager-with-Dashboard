'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User, LoginCredentials, SignupCredentials } from '../types/auth';
import { api } from '../services/api';

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

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user: JSON.parse(user), token },
            });
        } else {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, []);

    const login = async (credentials: LoginCredentials) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const { user, token } = await api.auth.login(credentials.email, credentials.password);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, token },
            });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Login failed' });
            throw error;
        }
    };

    const signup = async (credentials: SignupCredentials) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const { user, token } = await api.auth.signup(credentials.email, credentials.password, credentials.name);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user, token },
            });
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Signup failed' });
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
