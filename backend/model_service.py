from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


DATA_ROOT = Path(__file__).resolve().parent / "data" / "kagglehub" / "datasets" / "rabieelkharoua"

PARKINSONS_FEATURES = [
    "Age",
    "Gender",
    "BMI",
    "Smoking",
    "AlcoholConsumption",
    "PhysicalActivity",
    "SleepQuality",
    "FamilyHistoryParkinsons",
    "TraumaticBrainInjury",
    "Hypertension",
    "Diabetes",
    "Depression",
    "Stroke",
    "UPDRS",
    "MoCA",
    "FunctionalAssessment",
    "Tremor",
    "Rigidity",
    "Bradykinesia",
    "PosturalInstability",
    "SpeechProblems",
    "SleepDisorders",
    "Constipation",
]

ALZHEIMERS_FEATURES = [
    "Age",
    "Gender",
    "BMI",
    "Smoking",
    "AlcoholConsumption",
    "PhysicalActivity",
    "SleepQuality",
    "FamilyHistoryAlzheimers",
    "CardiovascularDisease",
    "Diabetes",
    "Depression",
    "HeadInjury",
    "Hypertension",
    "MMSE",
    "FunctionalAssessment",
    "MemoryComplaints",
    "BehavioralProblems",
    "ADL",
    "Confusion",
    "Disorientation",
    "PersonalityChanges",
    "DifficultyCompletingTasks",
    "Forgetfulness",
]


@dataclass
class TrainedModel:
    key: str
    disease: str
    dataset_name: str
    dataset_handle: str
    model: Pipeline
    features: list[str]
    metadata: dict[str, Any]


def _bool(value: Any) -> int:
    return 1 if bool(value) else 0


def _gender(value: str | None) -> int:
    if not value:
        return 0
    return 1 if value.lower().startswith("f") else 0


def _round(value: float | None, digits: int = 3) -> float | None:
    if value is None:
        return None
    return round(float(value), digits)


def _find_csv(dataset_slug: str, file_name: str) -> Path | None:
    matches = list((DATA_ROOT / dataset_slug).glob(f"versions/*/{file_name}"))
    return matches[0] if matches else None


class ClinicalModelService:
    def __init__(self) -> None:
        self.trained_at = datetime.now(timezone.utc).isoformat()
        self.models: dict[str, TrainedModel] = {}
        self.errors: list[str] = []
        self._train_available_models()

    def _train_available_models(self) -> None:
        self._train_model(
            key="parkinsons",
            disease="Parkinson's",
            dataset_slug="parkinsons-disease-dataset-analysis",
            file_name="parkinsons_disease_data.csv",
            dataset_name="Parkinson's Disease Dataset Analysis",
            dataset_handle="rabieelkharoua/parkinsons-disease-dataset-analysis",
            features=PARKINSONS_FEATURES,
        )
        self._train_model(
            key="alzheimers",
            disease="Alzheimer's",
            dataset_slug="alzheimers-disease-dataset",
            file_name="alzheimers_disease_data.csv",
            dataset_name="Alzheimer's Disease Dataset",
            dataset_handle="rabieelkharoua/alzheimers-disease-dataset",
            features=ALZHEIMERS_FEATURES,
        )

    def _train_model(
        self,
        *,
        key: str,
        disease: str,
        dataset_slug: str,
        file_name: str,
        dataset_name: str,
        dataset_handle: str,
        features: list[str],
    ) -> None:
        csv_path = _find_csv(dataset_slug, file_name)
        if csv_path is None:
            self.errors.append(f"{dataset_name} CSV not found. Run backend/download_datasets.py first.")
            return

        try:
            df = pd.read_csv(csv_path)
            available_features = [feature for feature in features if feature in df.columns]
            if "Diagnosis" not in df.columns or len(available_features) != len(features):
                missing = sorted(set(features + ["Diagnosis"]) - set(df.columns))
                self.errors.append(f"{dataset_name} is missing columns: {', '.join(missing)}")
                return

            X = df[available_features].apply(pd.to_numeric, errors="coerce")
            y = pd.to_numeric(df["Diagnosis"], errors="coerce").fillna(0).astype(int)
            X_train, X_test, y_train, y_test = train_test_split(
                X,
                y,
                test_size=0.25,
                random_state=42,
                stratify=y,
            )

            model = Pipeline(
                steps=[
                    ("imputer", SimpleImputer(strategy="median")),
                    (
                        "classifier",
                        RandomForestClassifier(
                            n_estimators=250,
                            random_state=42,
                            class_weight="balanced",
                            min_samples_leaf=3,
                        ),
                    ),
                ]
            )
            model.fit(X_train, y_train)
            predictions = model.predict(X_test)
            probabilities = model.predict_proba(X_test)[:, 1]

            metadata = {
                "available": True,
                "disease": disease,
                "dataset_name": dataset_name,
                "dataset_handle": dataset_handle,
                "rows": int(len(df)),
                "positive_rate": _round(float(y.mean())),
                "test_rows": int(len(y_test)),
                "accuracy": _round(accuracy_score(y_test, predictions)),
                "roc_auc": _round(roc_auc_score(y_test, probabilities)),
                "features": available_features,
                "target": "Diagnosis",
                "trained_at": self.trained_at,
                "model_type": "RandomForestClassifier",
            }
            self.models[key] = TrainedModel(
                key=key,
                disease=disease,
                dataset_name=dataset_name,
                dataset_handle=dataset_handle,
                model=model,
                features=available_features,
                metadata=metadata,
            )
        except Exception as exc:  # pragma: no cover - keeps API alive if local data is damaged
            self.errors.append(f"{dataset_name} training failed: {exc}")

    def model_info(self) -> dict[str, Any]:
        return {
            "trained_at": self.trained_at,
            "models": {key: trained.metadata for key, trained in self.models.items()},
            "epilepsy": {
                "available": True,
                "model_type": "Clinical rule score",
                "dataset_name": None,
                "note": "No local epilepsy dataset is used. This score is rule-based and not a diagnosis.",
            },
            "errors": self.errors,
        }

    def analyse(self, patient: Any) -> dict[str, Any]:
        parkinsons_score = self._model_score("parkinsons", self._parkinsons_input(patient))
        alzheimers_score = self._model_score("alzheimers", self._alzheimers_input(patient))
        epilepsy_score, epilepsy_reasons = self._epilepsy_rule_score(patient)

        scores = {
            "Parkinson's": parkinsons_score,
            "Alzheimer's": alzheimers_score,
            "Epilepsy": epilepsy_score,
        }
        primary_diagnosis, risk = max(scores.items(), key=lambda item: item[1])

        if risk < 20:
            diagnosis = "No high-risk pattern detected"
        elif primary_diagnosis == "Alzheimer's" and risk < 55:
            diagnosis = "Cognitive impairment risk"
        else:
            diagnosis = primary_diagnosis

        reasons = self._risk_reasons(patient)
        if primary_diagnosis == "Epilepsy":
            reasons = epilepsy_reasons + reasons
        reasons = reasons[:10] or ["No major risk factors selected."]

        status = self._status_for_risk(risk)

        return {
            "name": patient.name,
            "age": patient.age,
            "risk": int(round(risk)),
            "diagnosis": diagnosis,
            "status": status,
            "risk_scores": {key: int(round(value)) for key, value in scores.items()},
            "reasons": reasons,
            "recommendation": self._recommendation(status, diagnosis),
            "evidence_basis": {
                "Parkinson's": self._basis_for("parkinsons"),
                "Alzheimer's": self._basis_for("alzheimers"),
                "Epilepsy": "Rule-based seizure risk score from submitted seizure history; no EEG model is used.",
            },
            "disclaimer": "Screening support only. This is not a medical diagnosis.",
        }

    def _model_score(self, key: str, values: dict[str, Any]) -> float:
        trained = self.models.get(key)
        if trained is None:
            return self._fallback_score(key, values)

        row = pd.DataFrame([{feature: values.get(feature) for feature in trained.features}])
        probability = trained.model.predict_proba(row)[0][1]
        return float(probability * 100)

    def _basis_for(self, key: str) -> str:
        trained = self.models.get(key)
        if trained is None:
            return "Fallback clinical rules; Kaggle CSV was not available at backend startup."

        accuracy = trained.metadata.get("accuracy")
        auc = trained.metadata.get("roc_auc")
        return (
            f"Random forest trained on {trained.metadata['rows']} Kaggle rows "
            f"({trained.dataset_handle}); holdout accuracy {accuracy}, ROC-AUC {auc}."
        )

    def _parkinsons_input(self, patient: Any) -> dict[str, Any]:
        return {
            "Age": patient.age,
            "Gender": _gender(patient.gender),
            "BMI": patient.bmi,
            "Smoking": _bool(patient.smoking),
            "AlcoholConsumption": patient.alcohol_consumption,
            "PhysicalActivity": patient.physical_activity,
            "SleepQuality": patient.sleep_quality,
            "FamilyHistoryParkinsons": _bool(patient.family_history_parkinsons),
            "TraumaticBrainInjury": _bool(patient.head_injury),
            "Hypertension": _bool(patient.hypertension),
            "Diabetes": _bool(patient.diabetes),
            "Depression": _bool(patient.depression),
            "Stroke": _bool(patient.stroke),
            "UPDRS": patient.updrs,
            "MoCA": patient.moca,
            "FunctionalAssessment": patient.functional_assessment,
            "Tremor": _bool(patient.tremors),
            "Rigidity": _bool(patient.rigidity),
            "Bradykinesia": _bool(patient.bradykinesia),
            "PosturalInstability": _bool(patient.postural_instability),
            "SpeechProblems": _bool(patient.speech_problems),
            "SleepDisorders": _bool(patient.sleep_disorders),
            "Constipation": _bool(patient.constipation),
        }

    def _alzheimers_input(self, patient: Any) -> dict[str, Any]:
        return {
            "Age": patient.age,
            "Gender": _gender(patient.gender),
            "BMI": patient.bmi,
            "Smoking": _bool(patient.smoking),
            "AlcoholConsumption": patient.alcohol_consumption,
            "PhysicalActivity": patient.physical_activity,
            "SleepQuality": patient.sleep_quality,
            "FamilyHistoryAlzheimers": _bool(patient.family_history_alzheimers),
            "CardiovascularDisease": _bool(patient.cardiovascular_disease),
            "Diabetes": _bool(patient.diabetes),
            "Depression": _bool(patient.depression),
            "HeadInjury": _bool(patient.head_injury),
            "Hypertension": _bool(patient.hypertension),
            "MMSE": patient.mmse,
            "FunctionalAssessment": patient.functional_assessment,
            "MemoryComplaints": _bool(patient.memory_loss),
            "BehavioralProblems": _bool(patient.behavioral_problems),
            "ADL": patient.adl,
            "Confusion": _bool(patient.confusion),
            "Disorientation": _bool(patient.disorientation),
            "PersonalityChanges": _bool(patient.personality_changes),
            "DifficultyCompletingTasks": _bool(patient.difficulty_completing_tasks),
            "Forgetfulness": _bool(patient.forgetfulness),
        }

    def _epilepsy_rule_score(self, patient: Any) -> tuple[float, list[str]]:
        seizure_count = max(patient.seizure_count_30d, 0)
        duration = max(patient.seizure_duration_min, 0)
        seizure_type_weights = {
            "none": 0,
            "absence": 20,
            "focal": 24,
            "tonic_clonic": 30,
            "unknown": 16,
        }

        score = seizure_type_weights.get(patient.seizure_type, 0)
        reasons: list[str] = []

        if seizure_count > 0:
            score += 20 + min(seizure_count, 10) * 3
            reasons.append(f"{seizure_count} seizure event(s) reported in the last 30 days")
        if patient.seizures and seizure_count == 0:
            score += 25
            reasons.append("Seizure history selected")
        if patient.seizure_type != "none":
            reasons.append(f"Seizure type reported: {patient.seizure_type.replace('_', ' ')}")
        if duration >= 5:
            score += 15
            reasons.append("Typical seizure duration is 5 minutes or longer")
        elif duration >= 1:
            score += 8
            reasons.append("Typical seizure duration is at least 1 minute")
        if patient.postictal_confusion:
            score += 10
            reasons.append("Post-event confusion reported")
        if patient.aura:
            score += 6
            reasons.append("Aura reported before events")
        if patient.nocturnal_seizures:
            score += 8
            reasons.append("Nocturnal events reported")
        if patient.family_history_epilepsy:
            score += 7
            reasons.append("Family history of epilepsy")
        if patient.seizure_triggers:
            score += min(len(patient.seizure_triggers), 4) * 2
            reasons.append("Potential seizure triggers selected")

        return min(float(score), 100.0), reasons

    def _fallback_score(self, key: str, values: dict[str, Any]) -> float:
        if key == "parkinsons":
            score = (
                values.get("Tremor", 0) * 22
                + values.get("Rigidity", 0) * 18
                + values.get("Bradykinesia", 0) * 18
                + values.get("PosturalInstability", 0) * 14
                + values.get("SpeechProblems", 0) * 8
                + values.get("FamilyHistoryParkinsons", 0) * 8
                + (10 if values.get("Age", 0) >= 60 else 0)
            )
            return min(float(score), 100.0)

        score = (
            values.get("MemoryComplaints", 0) * 20
            + values.get("Confusion", 0) * 12
            + values.get("Disorientation", 0) * 12
            + values.get("DifficultyCompletingTasks", 0) * 10
            + values.get("Forgetfulness", 0) * 8
            + values.get("FamilyHistoryAlzheimers", 0) * 8
            + (12 if values.get("Age", 0) >= 65 else 0)
        )
        return min(float(score), 100.0)

    def _risk_reasons(self, patient: Any) -> list[str]:
        reasons: list[str] = []
        if patient.age >= 65:
            reasons.append("Age 65 or older")
        elif patient.age >= 50:
            reasons.append("Age 50 or older")
        if patient.tremors:
            reasons.append("Tremor present")
        if patient.rigidity:
            reasons.append("Rigidity present")
        if patient.bradykinesia:
            reasons.append("Bradykinesia present")
        if patient.memory_loss:
            reasons.append("Memory complaints reported")
        if patient.confusion:
            reasons.append("Confusion reported")
        if patient.disorientation:
            reasons.append("Disorientation reported")
        if patient.hypertension:
            reasons.append("Hypertension history")
        if patient.diabetes:
            reasons.append("Diabetes history")
        if patient.depression:
            reasons.append("Depression history")
        if patient.head_injury:
            reasons.append("Head injury history")
        return reasons

    @staticmethod
    def _status_for_risk(risk: float) -> str:
        if risk >= 80:
            return "URGENT"
        if risk >= 60:
            return "HIGH"
        if risk >= 40:
            return "MODERATE"
        if risk >= 20:
            return "MONITOR"
        return "CLEAR"

    @staticmethod
    def _recommendation(status: str, diagnosis: str) -> str:
        if status in {"URGENT", "HIGH"}:
            return f"Prioritize clinician review for the {diagnosis} screening signal."
        if status == "MODERATE":
            return "Schedule follow-up assessment and consider specialist referral if symptoms persist."
        if status == "MONITOR":
            return "Monitor symptoms and repeat screening if new signs appear."
        return "No high-risk pattern detected from the submitted screening fields."
