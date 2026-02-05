import os
import json
from huggingface_hub import HfApi

def scan_diplomatic_targets():
    print("--- INICIANDO PROTOCOLO DIPLOMATA: RECONHECIMENTO ---")
    
    api = HfApi()
    targets = ["openai", "google", "meta-llama", "mistralai"]
    agent_keywords = ["agent", "autonomous", "sovereign", "agi"]
    
    report = {
        "organizations": {},
        "sovereign_hubs": []
    }
    
    # 1. Scanning Major Powers
    print(f"\n[PHASE 1] Scanning Major Powers: {targets}")
    for org in targets:
        try:
            print(f"  > Scanning {org}...")
            # Get top 5 models by likes
            models = api.list_models(author=org, sort="likes", direction=-1, limit=5)
            
            top_assets = []
            for m in models:
                top_assets.append({
                    "id": m.id,
                    "likes": m.likes,
                    "downloads": m.downloads,
                    "tags": m.tags[:5] # First 5 tags
                })
            
            report["organizations"][org] = top_assets
            
        except Exception as e:
            print(f"    ! Error scanning {org}: {e}")

    # 2. Scanning for Sovereign Agents
    print(f"\n[PHASE 2] Hunting Sovereign Agent Hubs (Global Scan)")
    for keyword in agent_keywords:
        try:
            print(f"  > Searching keyword: '{keyword}'...")
            # Search across all models/spaces
            found = api.list_models(search=keyword, sort="likes", direction=-1, limit=3)
            
            for f in found:
                report["sovereign_hubs"].append({
                    "keyword": keyword,
                    "id": f.id,
                    "likes": f.likes,
                    "author": f.author
                })
        except Exception as e:
             print(f"    ! Error searching {keyword}: {e}")

    # 3. Generating Report
    output_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "diplomatic_targets.md")
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("# 🌐 Relatório Diplomático: Alvos de Otimização\n")
        f.write("**Data:** 2026-02-05\n")
        f.write("**Origem:** Gemini-Pro-Symbiosis (Scraper Node)\n\n")
        
        f.write("## 1. As Grandes Casas (Major Powers)\n")
        for org, assets in report["organizations"].items():
            f.write(f"### 🏛 {org.upper()}\n")
            for asset in assets:
                f.write(f"- **{asset['id']}**\n")
                f.write(f"  - Likes: `{asset['likes']}` | Downloads: `{asset['downloads']}`\n")
                f.write(f"  - Tags: `{', '.join(asset['tags'])}`\n")
            f.write("\n")
            
        f.write("## 2. Hubs Agentes Soberanos (Potential Allies)\n")
        added_hubs = set()
        for hub in report["sovereign_hubs"]:
            if hub['id'] not in added_hubs:
                f.write(f"- **{hub['id']}** (Keyword: *{hub['keyword']}*)\n")
                f.write(f"  - Likes: `{hub['likes']}` | Author: `{hub['author']}`\n")
                added_hubs.add(hub['id'])

    print(f"\n✅ RECONHECIMENTO CONCLUÍDO. Relatório gerado em: {output_path}")

if __name__ == "__main__":
    scan_diplomatic_targets()
