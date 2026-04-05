from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class ConversationMessage(BaseModel):
    model_config = ConfigDict(extra="forbid")

    role: Literal["system", "user", "assistant"]
    content: str

    @field_validator("content")
    @classmethod
    def validate_content(cls, value: str) -> str:
        text = value.strip()
        if not text:
            raise ValueError("content must be a non-empty string")
        return text


class ChatRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    mode: Literal["pre", "post"]
    ticker: str | None = None
    situation: str
    single_chip: str = Field(alias="singleChip")
    emotion: str
    text: str
    turn_number: Literal[1, 2] = Field(alias="turn_number")
    previous_distortion_type: str | None = Field(
        default=None,
        alias="previous_distortion_type",
    )
    conversation_history: list[ConversationMessage] = Field(
        default_factory=list,
        alias="conversation_history",
    )

    @field_validator("ticker", "previous_distortion_type")
    @classmethod
    def normalize_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        text = value.strip()
        return text or None

    @field_validator("situation", "single_chip", "emotion", "text")
    @classmethod
    def validate_required_text(cls, value: str) -> str:
        text = value.strip()
        if not text:
            raise ValueError("must be a non-empty string")
        return text

    @field_validator("conversation_history", mode="before")
    @classmethod
    def normalize_conversation_history(
        cls,
        value: list[ConversationMessage] | list[dict[str, str]] | None,
    ) -> list[ConversationMessage] | list[dict[str, str]]:
        if value is None:
            return []
        return value

    @model_validator(mode="after")
    def validate_turn_rules(self) -> "ChatRequest":
        if self.mode == "post" and self.turn_number != 1:
            raise ValueError("post mode only supports turn_number=1")
        return self


class ChatResponse(BaseModel):
    model_config = ConfigDict(populate_by_name=True, extra="forbid")

    distortion_type: str = Field(alias="distortion_type")
    distortion_tag: str = Field(alias="distortion_tag")
    empathy: str
    question: str
    question_type: Literal["exploratory", "meta_cognition"] = Field(
        alias="question_type"
    )
    meta_question: str | None = Field(alias="meta_question")
    meta_options: list[str] | None = Field(alias="meta_options")
    reflection_summary: str | None = Field(alias="reflection_summary")
    required: bool
