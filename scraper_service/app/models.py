from __future__ import annotations

from typing import Literal, Optional

from pydantic import BaseModel, HttpUrl


class ScanRequest(BaseModel):
    url: HttpUrl


class MediaAsset(BaseModel):
    url: str
    label: str
    type: Literal["image", "video"]
    alt: Optional[str] = None
