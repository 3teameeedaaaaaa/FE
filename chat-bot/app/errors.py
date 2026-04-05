from __future__ import annotations


class ChatGenerationError(RuntimeError):
    """Raised when the OpenAI response cannot be produced or validated."""

    def __init__(
        self,
        message: str,
        *,
        code: str = "chat_generation_error",
        status_code: int = 500,
    ) -> None:
        super().__init__(message)
        self.code = code
        self.status_code = status_code

