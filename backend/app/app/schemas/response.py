from typing import Any, List, Optional
from pydantic import BaseModel


class GenericResponse(BaseModel):
    message: str
    user: Optional[Any] = None
    status_code: int
