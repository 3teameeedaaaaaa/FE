import api from "../api/api";

const SESSION_STORAGE_KEY = "survey";

export const chatSession = async () => {
    try {
        const storedPayload = sessionStorage.getItem(SESSION_STORAGE_KEY);

        if (!storedPayload) {
            throw new Error("sessionStorage에 survey 데이터가 없습니다.");
        }

        const response = await api.post(`/api/chat/sessions`, storedPayload, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error("createChatSession error:", error);
        throw error;
    }
};
