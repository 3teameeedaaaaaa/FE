import api from "../api/api";

const SESSION_STORAGE_KEY = "survey";

export const chatSession = async () => {
    try {
        const storedPayload = sessionStorage.getItem(SESSION_STORAGE_KEY);
        console.log("storedPayload: ", storedPayload);
        if (!storedPayload) {
            throw new Error("sessionStorage에 survey 데이터가 없습니다.");
        }

        const parsedPayload = JSON.parse(storedPayload);
        console.log(parsedPayload);
        // console.log(storedPayload);
        // const { ticker, mode, emotion, singleChip, text, id } = storedPayload;
        const payload = {
            stockId: parsedPayload.id,
            customStockName: parsedPayload.ticker,
            sessionMode: parsedPayload.mode,
            emotion: parsedPayload.emotion,
            singleChip: parsedPayload.singleChip,
            content: parsedPayload.text,
        };
        console.log("session 요청:", payload);
        const response = await api.post(`/api/chat/sessions`, payload, {
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
