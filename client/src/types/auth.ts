export interface User {
    id: string;
    email: string;
    name: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupCredentials extends LoginCredentials {
    name: string;
}

export interface StoredUser extends User {
    password: string;
    token: string;
}
