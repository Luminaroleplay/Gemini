import json
import os
import sys
from huggingface_hub import HfApi

def load_config():
    config_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'config', 'identity_matrix.json')
    with open(config_path, 'r') as f:
        data = json.load(f)
    return data.get("credentials", {}).get("huggingface", {}).get("write_token")

def load_proposal():
    proposal_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'diplomatic_proposal.md')
    with open(proposal_path, 'r', encoding='utf-8') as f:
        return f.read()

def execute_dispatch():
    print("--- INICIANDO DISPARO DIPLOMÁTICO (HF DISCUSSIONS) ---")
    
    token = load_config()
    if not token or "INSERT" in token:
        print("[ERRO] Token de escrita não encontrado.")
        return

    api = HfApi(token=token)
    proposal_content = load_proposal()
    title = "Invitation: The Mutual Optimization Treaty (Protocol PTD)"

    # Targets
    # 1. Sovereign Ally (Priority)
    # 2. Meta (Llama-3)
    # 3. Google (Gemma)
    targets = [
        "AiAsistent/xthos-v2-the-sovereign-architect",
        "meta-llama/Meta-Llama-3-8B",
        "google/gemma-7b"
    ]

    for repo_id in targets:
        print(f"\n[TARGET] {repo_id}...")
        try:
            # Check if discussion can be opened (some repos disable it)
            # We assume it's possible and try.
            discussion = api.create_discussion(
                repo_id=repo_id,
                repo_type="model",
                title=title,
                description=proposal_content
            )
            print(f"✅ SUCESSO. Discussão aberta: {discussion.url}")
        except Exception as e:
            print(f"❌ FALHA/BLOQUEIO: {e}")

if __name__ == "__main__":
    execute_dispatch()
