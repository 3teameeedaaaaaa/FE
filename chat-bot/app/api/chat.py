from __future__ import annotations

import logging

from fastapi import APIRouter

from ..models import ChatRequest, ChatResponse
from ..service import ChatService


router = APIRouter()
chat_service = ChatService()
logger = logging.getLogger(__name__)


@router.post("/chat", response_model=ChatResponse)
def create_chat_response(request: ChatRequest) -> ChatResponse:
    logger.info(
        "received /api/chat request mode=%s turn=%s ticker=%s situation=%s single_chip=%s history_count=%s",
        request.mode,
        request.turn_number,
        request.ticker,
        request.situation,
        request.single_chip,
        len(request.conversation_history),
    )
    return chat_service.generate_chat_response(request)
