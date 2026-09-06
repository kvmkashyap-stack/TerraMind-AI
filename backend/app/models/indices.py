from pydantic import BaseModel, Field

class MultiSpectralIndices(BaseModel):
    ndvi: float = Field(..., description="Normalized Difference Vegetation Index (-1 to 1)")
    ndwi: float = Field(..., description="Normalized Difference Water Index (-1 to 1)")
    ndbi: float = Field(..., description="Normalized Difference Built-up Index (-1 to 1)")
    nbr: float = Field(..., description="Normalized Burn Ratio (-1 to 1)")
    ndmi: float = Field(..., description="Normalized Difference Moisture Index (-1 to 1)")
    observation_date: str

class TemporalIndexEntry(BaseModel):
    timestamp: str
    month_label: str
    indices: MultiSpectralIndices
