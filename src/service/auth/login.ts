import api from "../api/api";

export interface LoginRequest {
    loginId: string;
    hashedPassword: string;
}

export interface LoginResponse {
    id: number;
    loginId: string;
    nickname: string;
}

export const login = async (data: LoginRequest) => {
    const response = await api.post<LoginResponse>("/api/members/login", data);
    return response.data;
};
