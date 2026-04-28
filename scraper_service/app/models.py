from typing import Literal

from pydantic import BaseModel, HttpUrl


class ScanRequest(BaseModel):
    url: HttpUrl


class MediaAsset(BaseModel):
    url: str
    label: str
    type: Literal["image", "video"]
    alt: str | None = None
