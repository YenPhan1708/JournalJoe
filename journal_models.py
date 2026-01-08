# journal_models.py
from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Optional
import re

from transformers import pipeline, AutoTokenizer


# ---------------- Preprocessing ----------------

@dataclass
class PreprocessConfig:
    lowercase: bool = False
    strip_whitespace: bool = True
    collapse_whitespace: bool = True
    normalize_repeated_chars: bool = True
    max_repeated_chars: int = 3

    use_token_chunking: bool = True
    max_tokens: int = 512
    overlap_tokens: int = 50


class JournalPreprocessor:
    def __init__(self, bart_model_name: str, config: Optional[PreprocessConfig] = None):
        self.config = config or PreprocessConfig()
        self.tokenizer = AutoTokenizer.from_pretrained(bart_model_name)

    def preprocess_for_all(self, text: str) -> Dict[str, Any]:
        clean = self._basic_clean(text)
        chunks = self._chunk_by_tokens(clean) if self.config.use_token_chunking else [clean]
        return {"clean_text": clean, "chunks_for_summarizer": chunks}

    def _basic_clean(self, text: str) -> str:
        if text is None:
            text = ""
        if not isinstance(text, str):
            text = str(text)

        text = text.replace("\r\n", "\n").replace("\r", "\n")

        if self.config.strip_whitespace:
            text = text.strip()
        if self.config.collapse_whitespace:
            text = re.sub(r"\s+", " ", text)

        if self.config.normalize_repeated_chars:
            n = self.config.max_repeated_chars
            text = re.sub(r"([A-Za-z])\1{" + str(n) + r",}", r"\1" * n, text)

        if self.config.lowercase:
            text = text.lower()

        return text

    def _chunk_by_tokens(self, text: str) -> List[str]:
        if not text:
            return [""]

        encoding = self.tokenizer(
            text,
            add_special_tokens=False,
            return_attention_mask=False,
            return_tensors=None,
        )
        input_ids = encoding["input_ids"]

        max_len = self.config.max_tokens
        overlap = self.config.overlap_tokens

        if len(input_ids) <= max_len:
            return [text]

        chunks: List[str] = []
        start = 0
        while start < len(input_ids):
            end = start + max_len
            chunk_ids = input_ids[start:end]
            chunk_text = self.tokenizer.decode(chunk_ids, skip_special_tokens=True)
            chunks.append(chunk_text)

            if end >= len(input_ids):
                break
            start = end - overlap

        return chunks


# ---------------- Emotion aggregation ----------------

EMOTION_CLUSTERS: Dict[str, List[str]] = {
    "sadness": ["sadness", "disappointment", "grief", "remorse"],
    "anxiety_fear": ["fear", "nervousness", "embarrassment"],
    "anger": ["anger", "annoyance", "disgust", "disapproval"],
    "joy": ["joy", "amusement", "excitement", "gratitude", "relief", "pride"],
    "love_caring": ["love", "caring", "admiration", "optimism", "approval"],
    "curiosity_confusion": ["curiosity", "confusion", "realization", "surprise"],
    "neutral": ["neutral"],
}

def aggregate_emotions(
    emotion_outputs: List[Dict[str, Any]],
    top_n: int = 5,
) -> Dict[str, Any]:
    # emotion_outputs: list of {"label": str, "score": float}
    raw_sorted = sorted(emotion_outputs, key=lambda x: x.get("score", 0.0), reverse=True)
    top_emotions = raw_sorted[:top_n]

    label_scores = {str(x["label"]).lower(): float(x["score"]) for x in raw_sorted}

    cluster_scores: Dict[str, float] = {}
    for cluster_name, labels in EMOTION_CLUSTERS.items():
        scores = [label_scores.get(lbl.lower(), 0.0) for lbl in labels]
        cluster_scores[cluster_name] = max(scores) if scores else 0.0

    cluster_ranking = sorted(cluster_scores.items(), key=lambda kv: kv[1], reverse=True)

    return {
        "raw_sorted": raw_sorted,
        "top_emotions": top_emotions,
        "cluster_scores": cluster_scores,
        "cluster_ranking": cluster_ranking,
    }


# ---------------- Risk assessment (your notebook logic) ----------------

SUICIDAL_LABEL_ID = ["1"]
DEPRESSION_LABEL_ID = ["2"]

DEFAULT_SUICIDAL_THRESHOLD = 0.5
DEPRESSION_CRISIS_THRESHOLD = 0.9

def assess_suicidal_risk(
    raw_risk_outputs: List[Dict[str, Any]],
    suicidal_threshold: float = DEFAULT_SUICIDAL_THRESHOLD,
    depression_threshold: float = DEPRESSION_CRISIS_THRESHOLD,
) -> Dict[str, Any]:
    if not raw_risk_outputs:
        return {
            "is_crisis": False,
            "reason": "none",
            "suicidal_score": None,
            "suicidal_label": None,
            "depression_score": None,
            "depression_label": None,
            "raw_risk_outputs": [],
        }

    suicidal_score: Optional[float] = None
    suicidal_label: Optional[str] = None
    depression_score: Optional[float] = None
    depression_label: Optional[str] = None

    for out in raw_risk_outputs:
        raw_label = str(out.get("label", ""))
        label_lower = raw_label.lower()
        score = float(out.get("score", 0.0))

        if any(candidate in label_lower for candidate in SUICIDAL_LABEL_ID):
            if suicidal_score is None or score > suicidal_score:
                suicidal_score = score
                suicidal_label = raw_label

        if any(candidate in label_lower for candidate in DEPRESSION_LABEL_ID):
            if depression_score is None or score > depression_score:
                depression_score = score
                depression_label = raw_label

        if raw_label in DEPRESSION_LABEL_ID:
            if depression_score is None or score > depression_score:
                depression_score = score
                depression_label = raw_label

    suicidal_crisis = suicidal_score is not None and suicidal_score >= suicidal_threshold
    depression_crisis = depression_score is not None and depression_score >= depression_threshold

    if suicidal_crisis:
        return {
            "is_crisis": True,
            "reason": "suicidal",
            "suicidal_score": suicidal_score,
            "suicidal_label": suicidal_label,
            "depression_score": depression_score,
            "depression_label": depression_label,
            "raw_risk_outputs": raw_risk_outputs,
        }
    if depression_crisis:
        return {
            "is_crisis": True,
            "reason": "severe_depression",
            "suicidal_score": suicidal_score,
            "suicidal_label": suicidal_label,
            "depression_score": depression_score,
            "depression_label": depression_label,
            "raw_risk_outputs": raw_risk_outputs,
        }

    return {
        "is_crisis": False,
        "reason": "none",
        "suicidal_score": suicidal_score,
        "suicidal_label": suicidal_label,
        "depression_score": depression_score,
        "depression_label": depression_label,
        "raw_risk_outputs": raw_risk_outputs,
    }


# ---------------- App-ready service wrapper ----------------

class JournalNLPService:
    """
    Loads models once. Call .predict(text) for any journal entry input.
    """
    def __init__(
        self,
        emotion_model: str = "SamLowe/roberta-base-go_emotions",
        summarizer_model: str = "facebook/bart-large-cnn",
        risk_model: str = "ourafla/mental-health-bert-finetuned",
        language_model: str = "papluca/xlm-roberta-base-language-detection",
        preprocess_config: Optional[PreprocessConfig] = None,
    ):
        self.classifier = pipeline("text-classification", model=emotion_model, top_k=None)
        self.summarizer = pipeline("summarization", model=summarizer_model)
        self.alarm = pipeline("text-classification", model=risk_model, top_k=None)
        self.lng_detect = pipeline("text-classification", model=language_model)

        self.preprocessor = JournalPreprocessor(
            bart_model_name=summarizer_model,
            config=preprocess_config or PreprocessConfig(max_tokens=512, overlap_tokens=50),
        )

    def predict(self, raw_text: Any) -> Dict[str, Any]:
        prep = self.preprocessor.preprocess_for_all(raw_text)
        clean_text: str = prep["clean_text"]
        chunks: List[str] = prep["chunks_for_summarizer"]

        # Ensure “any input” doesn’t crash on empties
        if not clean_text.strip():
            return {
                "clean_text": clean_text,
                "language": None,
                "summary": "",
                "chunk_summaries": [],
                "emotion_outputs_raw": [],
                "emotion_top_labels": [],
                "emotion_cluster_scores": {},
                "emotion_cluster_ranking": [],
                "risk_outputs_raw": [],
                "suicidal_is_crisis": False,
                "suicidal_score": None,
                "suicidal_label": None,
            }

        language = self.lng_detect(clean_text)[0]  # {"label": "...", "score": ...}

        # Emotion + risk models: be explicit about truncation for extremely long inputs
        emotion_outputs = self.classifier(clean_text, truncation=True)[0]
        emotion_analysis = aggregate_emotions(emotion_outputs)

        raw_risk_outputs = self.alarm(clean_text, truncation=True)[0]
        suicidal_assessment = assess_suicidal_risk(raw_risk_outputs)

        # Summarize chunks (BART-safe)
        chunk_summaries: List[str] = []
        for chunk in chunks:
            if not chunk.strip():
                continue
            s = self.summarizer(chunk, max_length=120, min_length=40, do_sample=False)[0]["summary_text"]
            chunk_summaries.append(s)

        if len(chunk_summaries) == 1:
            final_summary = chunk_summaries[0]
        elif len(chunk_summaries) > 1:
            combined = " ".join(chunk_summaries)
            final_summary = self.summarizer(combined, max_length=150, min_length=60, do_sample=False)[0]["summary_text"]
        else:
            final_summary = ""

        return {
            "clean_text": clean_text,
            "language": language,

            "emotion_outputs_raw": emotion_analysis["raw_sorted"],
            "emotion_top_labels": emotion_analysis["top_emotions"],
            "emotion_cluster_scores": emotion_analysis["cluster_scores"],
            "emotion_cluster_ranking": emotion_analysis["cluster_ranking"],

            "risk_outputs_raw": raw_risk_outputs,
            "suicidal_is_crisis": suicidal_assessment["is_crisis"],
            "suicidal_score": suicidal_assessment["suicidal_score"],
            "suicidal_label": suicidal_assessment["suicidal_label"],

            "summary": final_summary,
            "chunk_summaries": chunk_summaries,
        }
