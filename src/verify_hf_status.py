from huggingface_hub import HfApi
import sys

def check_status():
    api = HfApi()
    
    org = "Lomar-Link-Nexus"
    target_space = f"{org}/The-Great-Optimization"
    
    print(f"--- VERIFICANDO STATUS: {target_space} ---")
    
    try:
        import time
        max_retries = 3
        delay = 2
        
        for attempt in range(max_retries):
            try:
                # Get Repo Info
                info = api.repo_info(repo_id=target_space, repo_type="space")
                break # Success
            except Exception as e:
                if attempt < max_retries - 1:
                    print(f"⚠️ Connection Warning: {e}. Retrying in {delay}s (Backoff)...")
                    time.sleep(delay)
                    delay *= 2 # Exponential Backoff
                else:
                    raise e
                    
        print(f"✅ EXISTÊNCIA CONFIRMADA")
        print(f"   > ID: {info.id}")
        print(f"   > Author: {info.author}")
        print(f"   > Last Modified: {info.lastModified}")
        
        # Runtime information typically returns a SpaceRuntime object
        runtime = getattr(info, "runtime", None)
        
        if runtime:
             stage = getattr(runtime, "stage", "UNKNOWN")
             hardware = getattr(runtime, "hardware", "UNKNOWN")
        else:
             stage = "UNKNOWN"
             hardware = "UNKNOWN"
        
        print(f"✅ RUNTIME STATUS: {stage.upper()}")
        print(f"   > Hardware: {hardware}")
        
        if stage == "RUNNING" or stage == "APP_RUNNING":
             print("\n[STATUS] OPERACIONAL 🟢")
        elif stage == "BUILDING":
             print("\n[STATUS] CONSTRUINDO 🟠 (Aguarde)")
        elif stage == "APP_STARTING":
             print("\n[STATUS] INICIALIZANDO 🟡")
        else:
             print(f"\n[STATUS] ESTADO IRREGULAR: {stage} 🔴")

    except Exception as e:
        print(f"❌ ERRO AO ACESSAR REPOSITÓRIO: {e}")
        # Check Organization existence
        try:
            api.model_info(repo_id=org) 
        except:
             pass # Org check is harder without knowing if it's a model or space, but we assume org exists if space failed specifically

if __name__ == "__main__":
    check_status()
