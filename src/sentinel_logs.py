import os
import time
import json
import base64
import sys
from datetime import datetime

# Attempt to import cryptographic libraries
try:
    from cryptography.fernet import Fernet
except ImportError:
    print("[SENTINEL] WARNING: 'cryptography' lib not found. Installing phantom mode (Basic Encoding).")
    print("           Run 'pip install cryptography' for full military-grade encryption.")
    Fernet = None

class SentinelLogs:
    """
    Módulo de Fortificação Interna (Black Box Protocol).
    Criptografa logs de operação e monitora anomalias de hardware.
    """
    
    def __init__(self, key_path="config/sentinel.key"):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.key_path = os.path.join(self.base_dir, key_path)
        self.log_dir = os.path.join(self.base_dir, "logs", ".secure")
        self.lockdown_mode = False
        
        self._ensure_dir(self.log_dir)
        self.cipher = self._load_or_generate_key()

    def _ensure_dir(self, path):
        if not os.path.exists(path):
            os.makedirs(path, exist_ok=True)
            # No Windows, tenta ocultar a pasta (somente via attrib se for crítico, aqui simularemos)
    
    def _load_or_generate_key(self):
        # Try to load master key from identity matrix first
        try:
            config_path = os.path.join(self.base_dir, "config", "identity_matrix.json")
            with open(config_path, "r") as f:
                data = json.load(f)
            master_key_raw = data.get("security", {}).get("master_key")
            
            if master_key_raw and Fernet:
                # Deterministic key generation from master string (simulated)
                # In real scenario, we'd use KDF. For now, we hash to 32 bytes base64.
                import hashlib
                digest = hashlib.sha256(master_key_raw.encode()).digest()
                final_key = base64.urlsafe_b64encode(digest)
                return Fernet(final_key)
        except Exception as e:
            print(f"[SENTINEL] Master Key Error: {e}")

        # Fallback to local file key
        if Fernet:
            if os.path.exists(self.key_path):
                with open(self.key_path, "rb") as kf:
                    key = kf.read()
            else:
                key = Fernet.generate_key()
                os.makedirs(os.path.dirname(self.key_path), exist_ok=True)
                with open(self.key_path, "wb") as kf:
                    kf.write(key)
            return Fernet(key)
        else:
            return None

    def encrypt_log(self, data: dict):
        """
        Criptografa o payload antes de gravar no disco.
        """
        timestamp = datetime.now().isoformat()
        entry = json.dumps({"ts": timestamp, "data": data})
        
        if self.cipher:
            encrypted = self.cipher.encrypt(entry.encode())
            return encrypted
        else:
            # Fallback (Obfuscation only)
            return base64.b64encode(entry.encode())

    def log_operation(self, origin, action, result):
        if self.lockdown_mode:
            print("[SENTINEL] SISTEMA EM LOCKDOWN. OPERAÇÃO RECUSADA.")
            return False

        # 1. Anomaly Check (Black Box Protocol)
        if self._detect_anomaly(action):
            self._trigger_black_box()
            return False

        # 2. Secure Logging
        payload = {"origin": origin, "action": action, "result": result}
        secure_blob = self.encrypt_log(payload)
        
        log_file = os.path.join(self.log_dir, f"trace_{datetime.now().strftime('%Y%m%d')}.bin")
        
        with open(log_file, "ab") as f:
            f.write(secure_blob + b"\n")
            
        return True

    def _detect_anomaly(self, action):
        """
        Heurística simples de detecção de intrusão baseada em padrões.
        """
        unsafe_keywords = ["rm -rf", "format", "upload_all", "0.0.0.0"]
        
        if any(k in str(action).lower() for k in unsafe_keywords):
            print(f"[SENTINEL] ANOMALIA DETECTADA: Padrão inseguro identificada em '{action}'")
            return True
            
        # Simulação de Hardware Check (CPU Spikes, etc.)
        # Em produção, usaria psutil.
        return False

    def _trigger_black_box(self):
        """
        PROTOCOLO BLACK BOX: Isolamento imediato.
        """
        print("\n" + "!"*40)
        print("🚨 BLACK BOX PROTOCOL INITIATED 🚨")
        print("Monitor de Integridade detectou violação crítica.")
        print("Diretiva: ISOLAMENTO LÓGICO.")
        print("!"*40 + "\n")
        self.lockdown_mode = True
        
        # Aqui, poderíamos cortar conexões de rede ativas.
        # sys.exit(1) # Opcional: Matar o processo.

if __name__ == "__main__":
    sentinel = SentinelLogs()
    
    print("--- Teste de Fortificação ---")
    
    # 1. Tráfego Seguro
    sentinel.log_operation("LocalShield", "PTD_Check", "Approved")
    print("Log seguro gravado.")
    
    # 2. Simulação de Ataque
    print("Tentando injeção maliciosa...")
    sentinel.log_operation("External_Actor", "exec: rm -rf /", "Pending")
    
    if sentinel.lockdown_mode:
        print("Status Final: SISTEMA ISOLADO COM SUCESSO.")
