import json
from typing import Dict, Any, List

class FineTuningEngine:
    """
    Generates structured JSONL training datasets from domain documents
    for fine-tuning LLMs (Moonshot / OpenAI format).
    """

    @staticmethod
    def generate_jsonl_dataset(documents: List[Dict[str, str]]) -> Dict[str, Any]:
        training_samples = []

        for doc in documents:
            title = doc.get("title", "Conservation Policy")
            content = doc.get("content", "")

            # Generate synthetic fine-tuning pairs
            sample = {
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an expert AI Conservation Copilot trained on Indian Government Schemes and Environmental Protection Guidelines."
                    },
                    {
                        "role": "user",
                        "content": f"What are the funding guidelines and technical rules under {title}?"
                    },
                    {
                        "role": "assistant",
                        "content": f"According to {title}: {content[:1000]}"
                    }
                ]
            }
            training_samples.append(sample)

        jsonl_output = "\n".join([json.dumps(s) for s in training_samples])

        return {
            "status": "success",
            "total_samples_generated": len(training_samples),
            "format": "OpenAI / Moonshot JSONL Fine-Tuning Format",
            "dataset_preview": training_samples[:2],
            "jsonl_string": jsonl_output
        }

fine_tuning_engine = FineTuningEngine()
