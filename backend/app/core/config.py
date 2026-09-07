import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Conservation Impact Intelligence System"
    API_V1_STR: str = "/api/v1"
    
    # LLM & Search Configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    MOONSHOT_API_KEY: str = os.getenv("MOONSHOT_API_KEY", "mock-moonshot-key")
    MOONSHOT_BASE_URL: str = os.getenv("MOONSHOT_BASE_URL", "https://api.moonshot.cn/v1")
    KIMI_MODEL_NAME: str = os.getenv("KIMI_MODEL_NAME", "moonshot-v1-8k")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "mock-tavily-key")
    
    # Copernicus / Satellite API Credentials
    COPERNICUS_CLIENT_ID: str = os.getenv("COPERNICUS_CLIENT_ID", "")
    COPERNICUS_CLIENT_SECRET: str = os.getenv("COPERNICUS_CLIENT_SECRET", "")
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
