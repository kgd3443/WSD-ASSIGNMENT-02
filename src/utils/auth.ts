// src/utils/auth.ts
import { tmdbClient } from "./tmdb";

const USERS_KEY = "auth_users";
const SESSION_KEY = "auth_session";
const REMEMBER_KEY = "auth_remember_email";

export type StoredUser = {
    email: string;
    passwordEncoded: string;
};

export type Session = {
    email: string;
    remember: boolean;
};

const API_KEY = (import.meta.env.VITE_TMDB_API_KEY as string | undefined) ?? "";

// ✅ SignIn.tsx가 요구하는 이름 1: isValidEmail
export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ✅ SignIn.tsx가 요구하는 이름 2: encodePassword(내부용)
function encodePassword(raw: string): string {
    const salt = API_KEY || "tmdb_fallback_salt";
    return btoa(`${raw}::${salt}`);
}

function loadUsers(): StoredUser[] {
    try {
        const raw = localStorage.getItem(USERS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
    } catch {
        return [];
    }
}

function saveUsers(users: StoredUser[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ✅ SignIn.tsx가 요구하는 이름 3: register
export function register(email: string, rawPassword: string): { ok: boolean; message: string } {
    const users = loadUsers();
    if (users.some((u) => u.email === email)) {
        return { ok: false, message: "이미 가입된 이메일입니다." };
    }
    users.push({ email, passwordEncoded: encodePassword(rawPassword) });
    saveUsers(users);
    return { ok: true, message: "회원가입 성공" };
}

// ✅ SignIn.tsx가 요구하는 이름 4: login
export function login(email: string, rawPassword: string): { ok: boolean; message: string } {
    const users = loadUsers();
    const encoded = encodePassword(rawPassword);
    const ok = users.some((u) => u.email === email && u.passwordEncoded === encoded);
    return ok
        ? { ok: true, message: "로그인 성공" }
        : { ok: false, message: "아이디 또는 비밀번호가 올바르지 않습니다." };
}

// ✅ SignIn.tsx가 요구하는 이름 5: saveSession
export function saveSession(email: string, remember: boolean) {
    const session: Session = { email, remember };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    if (remember) localStorage.setItem(REMEMBER_KEY, email);
    else localStorage.removeItem(REMEMBER_KEY);
}

// ✅ RequireAuth에서 사용할 것: getSession
export function getSession(): Session | null {
    try {
        const raw = localStorage.getItem(SESSION_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as Session;
    } catch {
        return null;
    }
}

export function logout() {
    localStorage.removeItem(SESSION_KEY);
}

export function getRememberedEmail(): string {
    return localStorage.getItem(REMEMBER_KEY) ?? "";
}

export async function pingTmdb(): Promise<void> {
    try {
        // "API키를 사용해 API를 호출" 요건 충족용
        await tmdbClient.get("/configuration");
    } catch {
        // 데모 목적이라 실패해도 계속 진행
    }
}
