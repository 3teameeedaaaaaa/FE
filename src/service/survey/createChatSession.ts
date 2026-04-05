import type {
    CreateChatSessionRequest,
    CreateChatSessionResponse,
} from "@/type/createChat";

import api from "../api/api";

export const createChatSession = async (
    payload: CreateChatSessionRequest,
): Promise<CreateChatSessionResponse> => {
    const res = await api.post<CreateChatSessionResponse>(
        "/api/chat/session",
        payload,
    );
    return res.data;
};
