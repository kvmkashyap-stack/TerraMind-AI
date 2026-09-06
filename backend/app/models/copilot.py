from typing import List, Optional
from pydantic import BaseModel

class CopilotQueryRequest(BaseModel):
    query: str
    project_id: Optional[str] = None

class SchemeCitation(BaseModel):
    scheme_name: str
    authority: str
    relevant_clause: str
    url: Optional[str] = None

class CopilotQueryResponse(BaseModel):
    answer: str
    recommended_schemes: List[SchemeCitation]
    suggested_technical_solution: str
    tavily_web_citations: List[str]
