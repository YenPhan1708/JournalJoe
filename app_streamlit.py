import json
import streamlit as st

from journal_models import JournalNLPService

st.set_page_config(page_title="Journal NLP Test", layout="wide")
st.title("Journal NLP Test Interface")

@st.cache_resource
def load_service():
    return JournalNLPService()

service = load_service()

text = st.text_area(
    "Paste a journal entry:",
    height=220,
    placeholder="Today I felt..."
)

col1, col2 = st.columns([1, 1])
with col1:
    run = st.button("Run prediction", type="primary")
with col2:
    show_clean = st.checkbox("Show cleaned text", value=False)

if run:
    with st.spinner("Running models..."):
        result = service.predict(text)

    st.subheader("Summary")
    st.write(result.get("summary", ""))

    st.subheader("Crisis / Risk flag")
    st.write(
        {
            "suicidal_is_crisis": result.get("suicidal_is_crisis"),
            "suicidal_score": result.get("suicidal_score"),
            "suicidal_label": result.get("suicidal_label"),
        }
    )

    st.subheader("Top emotions")
    st.write(result.get("emotion_top_labels", []))

    st.subheader("Emotion clusters")
    st.write(result.get("emotion_cluster_ranking", []))

    if show_clean:
        st.subheader("Cleaned text")
        st.write(result.get("clean_text", ""))

    st.subheader("Full JSON")
    st.code(json.dumps(result, indent=2), language="json")
