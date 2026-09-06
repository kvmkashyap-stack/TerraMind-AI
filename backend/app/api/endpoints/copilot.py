from typing import List, Dict
from fastapi import APIRouter, UploadFile, File
from app.models.copilot import CopilotQueryRequest, CopilotQueryResponse
from app.services.langgraph_copilot import copilot_service
from app.services.document_ingestion import document_ingestion_service
from app.services.fine_tuning_engine import fine_tuning_engine

router = APIRouter()

@router.post("/copilot/chat", response_model=CopilotQueryResponse, summary="LangGraph RAG & Kimi K3 Copilot Chat")
async def chat_copilot(req: CopilotQueryRequest):
    """Answers queries regarding Govt schemes, technical solutions, and project telemetry using LangGraph, Tavily Search, Trafilatura, and Kimi K3."""
    return await copilot_service.query_copilot(req.query, req.project_id)

@router.post("/copilot/upload-document", summary="Upload Custom Policy/Guideline Documents to RAG Vector Store")
async def upload_document_to_rag(file: UploadFile = File(...)):
    """Uploads custom PDF, TXT, or Markdown documents to be processed and indexed into the live RAG vector knowledge base."""
    return await document_ingestion_service.process_and_index_document(file)

@router.post("/copilot/generate-finetune-dataset", summary="Generate Model Training / Fine-Tuning JSONL Dataset from Documents")
async def generate_finetune_dataset(documents: List[Dict[str, str]]):
    """Converts uploaded policy documents into a JSONL training dataset formatted for fine-tuning Moonshot / OpenAI LLMs."""
    return fine_tuning_engine.generate_jsonl_dataset(documents)
