import type { CreateChatSessionRequest } from "@/type/createChat";

import api from "../api/api";

export const createChatSession = async (payload: CreateChatSessionRequest) => {
    const res = await api.post("/api/analysis/sessions/ask", payload, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    return res.data;
};
