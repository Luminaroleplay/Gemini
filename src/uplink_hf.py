import os
import json
import sys

# Attempt to import standard HF libraries
try:
    from huggingface_hub import HfApi
    HF_LIB_AVAILABLE = True
except ImportError as e:
    print(f"[DEBUG] Import Error: {e}")
    HF_LIB_AVAILABLE = False

class UplinkHF:
    def __init__(self, dry_run=True):
        self.dry_run = dry_run
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.config_path = os.path.join(self.base_dir, 'config', 'identity_matrix.json')
        self.space_dir = os.path.join(self.base_dir, 'hf_space')
        self.token = None
        
        print(f"--- HF UPLINK MODULE INITIALIZED (Dry-Run: {self.dry_run}) ---")
        self._load_config()

    def _load_config(self):
        if not os.path.exists(self.config_path):
            print(f"[FATAL] Identity Config not found at {self.config_path}")
            sys.exit(1)
            
        with open(self.config_path, 'r') as f:
            data = json.load(f)
            
        self.token = data.get("credentials", {}).get("huggingface", {}).get("write_token")
        
        if not self.token or "INSERT" in self.token:
            print("[WARN] Valid 'write_token' not found in config. Operations limited.")
        else:
            print("[AUTH] Token detected in matrix.")

    def run_projection(self, repo_id):
        """
        Executes the projection (upload) to the HF Space.
        """
        print(f"[TARGET] Projection Vector: {repo_id}")
        
        # 1. Scan Local Assets
        files_to_upload = []
        for root, _, files in os.walk(self.space_dir):
            for file in files:
                abs_path = os.path.join(root, file)
                rel_path = os.path.relpath(abs_path, self.space_dir)
                files_to_upload.append((abs_path, rel_path))
                
        print(f"[SCAN] Detected {len(files_to_upload)} assets in bunker '{self.space_dir}':")
        for _, rel in files_to_upload:
            print(f"  - {rel}")

        # 2. Upload (or Simulate)
        if self.dry_run:
            print("\n[SIMULATION] Dry-Run Enabled. Skipping physical upload.")
            print(f"Would upload to repo '{repo_id}' using token '***'.")
            print("Status: READY_TO_FIRE")
            return

        if not HF_LIB_AVAILABLE:
            print("\n[ERROR] 'huggingface_hub' library not installed.")
            print("Run: pip install huggingface_hub")
            return

        if not self.token:
            print("\n[ERROR] Authentication failed. Cannot upload without token.")
            return

        print(f"\n[ENGAGE] Initiating Uplink to {repo_id}...")
        try:
            api = HfApi()
            api.upload_folder(
                folder_path=self.space_dir,
                repo_id=repo_id,
                repo_type="space",
                token=self.token,
                commit_message="Inauguração do Nexo Lomar-Link: Protocolo PTD V2.0 - Assinado por Lomar & Gemini"
            )
            print("[SUCCESS] Signal projected to the global repository.")
        except Exception as e:
            print(f"[FAIL] Transmit error: {e}")

if __name__ == "__main__":
    # Usage: python uplink_hf.py [start/dry] [repo_id]
    
    mode = "dry"
    repo = "User/Gemini-Symbiosis-Space" # Placeholder
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "live":
            mode = "live"
    
    if len(sys.argv) > 2:
        repo = sys.argv[2]
        
    dry = (mode != "live")
    
    uplink = UplinkHF(dry_run=dry)
    uplink.run_projection(repo)
