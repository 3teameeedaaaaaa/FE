export interface CreateChatSessionRequest {
    stockId: number;
    customStockName: string;
    sessionMode: "PRE" | "POST";
    emotion: string;
    singleChip: string;
    commonChip: string;
    content: string;
}

// 응답 타입
export interface CreateChatSessionResponse {
    sessionId: number;
    status: "ONGOING" | "ENDED";
}
