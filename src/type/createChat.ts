export interface CreateChatSessionRequest {
    mode: string;
    ticker: string;
    emotion: string;
    situation: string;
    singleChip: string;
    text: string;
    turn_number: number;
    previous_distortion_type: string;
    conversation_history: [];
}
