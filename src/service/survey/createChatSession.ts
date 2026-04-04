import type { CreateChatSessionRequest } from "@/type/createChat";

import api from "../api/api";

export const createChatSession = async (payload: CreateChatSessionRequest) => {
    const res = await api.post("/api/chat/ask", payload);
    return res.data;
};
