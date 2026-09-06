import os
from typing import Dict, Any, List
from fastapi import UploadFile
from app.agents.copilot_graph import SCHEME_VECTOR_STORE

class DocumentIngestionService:
    """
    Ingests custom PDF, TXT, or Markdown policy documents uploaded by the user,
    extracts text content, and indexes them into the RAG scheme vector database.
    """

    @staticmethod
    async def process_and_index_document(file: UploadFile) -> Dict[str, Any]:
        filename = file.filename
        content_bytes = await file.read()
        
        # Extract text from plain text / markdown or PDF bytes
        text_content = ""
        if filename.endswith(".txt") or filename.endswith(".md"):
            text_content = content_bytes.decode("utf-8", errors="ignore")
        elif filename.endswith(".pdf"):
            try:
                import pypdf
                import io
                reader = pypdf.PdfReader(io.BytesIO(content_bytes))
                pages_text = [page.extract_text() for page in reader.pages if page.extract_text()]
                text_content = "\n".join(pages_text)
            except Exception:
                text_content = content_bytes.decode("utf-8", errors="ignore")
        else:
            text_content = content_bytes.decode("utf-8", errors="ignore")

        # Create structured RAG document entry
        doc_entry = {
            "scheme_name": f"Custom Upload: {filename}",
            "authority": "Uploaded Domain Policy / Document",
            "keywords": ["custom", "uploaded", "policy", "guidelines"],
            "clause": text_content[:1500] if text_content else f"Content extracted from {filename}",
            "url": f"/docs/uploads/{filename}"
        }

        # Index into live RAG Vector Store
        SCHEME_VECTOR_STORE.append(doc_entry)

        return {
            "status": "success",
            "filename": filename,
            "bytes_processed": len(content_bytes),
            "characters_indexed": len(text_content),
            "message": f"Successfully ingested and indexed '{filename}' into the RAG Vector Knowledge Base!",
            "total_documents_in_vector_store": len(SCHEME_VECTOR_STORE)
        }

document_ingestion_service = DocumentIngestionService()
