from typing import List, Dict, Any, Optional
from typing_extensions import TypedDict

class AgentState(TypedDict):
    query: str
    project_id: Optional[str]
    project_metadata: Dict[str, Any]
    retrieved_schemes: List[Dict[str, Any]]
    tavily_search_results: List[str]
    final_answer: str
    recommended_schemes: List[Dict[str, Any]]
    suggested_technical_solution: str
    iteration_count: int
    is_casual: Optional[bool]
    scraped_web_content: Optional[List[Dict[str, Any]]]
