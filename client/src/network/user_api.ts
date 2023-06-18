import { User as UserModel } from "../models/user";
import fetchData from './notes_api'

export async function getLoggedInUser(): Promise<UserModel> {
    const response = await fetchData('/api/users', { method: 'GET' });
    return response.json()
}

export interface SignUpCredentials {
    username: string,
    email: string,
    password: string,
}

export async function signUp(credentials: SignUpCredentials): Promise<UserModel> {
    const respone = await fetchData('/api/users/signup', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    });
    return respone.json();
}

export interface LoginCredentials {
    username: string,
    password: string,
}

export async function login(credentials: LoginCredentials): Promise<UserModel> {
    const respone = await fetchData('/api/users/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
    });
    return respone.json();
}

export async function logout() {
    await fetchData('/api/users/logout', { method: "POST" });
}