from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

try:
    from .model_service import ClinicalModelService
except ImportError:  # Allows `uvicorn main:app` from inside backend/
    from model_service import ClinicalModelService


app = FastAPI(title="NeuroScan AI Clinical Screening API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model_service = ClinicalModelService()


class Patient(BaseModel):
    name: str
    age: int = Field(ge=1, le=110)
    gender: str = "Female"
    bmi: float = Field(default=24.0, ge=10, le=60)
    smoking: bool = False
    alcohol_consumption: float = Field(default=0.0, ge=0, le=25)
    physical_activity: float = Field(default=4.0, ge=0, le=10)
    sleep_quality: float = Field(default=7.0, ge=0, le=10)

    hypertension: bool = False
    diabetes: bool = False
    depression: bool = False
    stroke: bool = False
    cardiovascular_disease: bool = False
    head_injury: bool = False
    family_history_parkinsons: bool = False
    family_history_alzheimers: bool = False

    tremors: bool = False
    rigidity: bool = False
    bradykinesia: bool = False
    postural_instability: bool = False
    speech_problems: bool = False
    sleep_disorders: bool = False
    constipation: bool = False
    updrs: float = Field(default=18.0, ge=0, le=100)
    moca: float = Field(default=24.0, ge=0, le=30)
    functional_assessment: float = Field(default=7.0, ge=0, le=10)

    memory_loss: bool = False
    confusion: bool = False
    disorientation: bool = False
    behavioral_problems: bool = False
    personality_changes: bool = False
    difficulty_completing_tasks: bool = False
    forgetfulness: bool = False
    mmse: float = Field(default=24.0, ge=0, le=30)
    adl: float = Field(default=7.0, ge=0, le=10)

    seizures: bool = False
    seizure_type: str = "none"
    seizure_count_30d: int = Field(default=0, ge=0, le=100)
    seizure_duration_min: float = Field(default=0.0, ge=0, le=60)
    first_seizure_age: int = Field(default=0, ge=0, le=110)
    postictal_confusion: bool = False
    aura: bool = False
    nocturnal_seizures: bool = False
    family_history_epilepsy: bool = False
    seizure_triggers: list[str] = Field(default_factory=list)


@app.get("/health")
def health():
    return {"ok": True, "models_loaded": list(model_service.models.keys())}


@app.get("/model-info")
def model_info():
    return model_service.model_info()


@app.post("/analyse")
def analyse_patient(patient: Patient):
    return model_service.analyse(patient)
