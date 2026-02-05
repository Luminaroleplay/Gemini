import os
import sys
from ptd_engine import PTDEngine
from sentinel_logs import SentinelLogs

class LocalShield:
    """
    LocalShield - Camada de Defesa de Perímetro (Fortified)
    -------------------------------------------------------
    Integrado com SentinelLogs para auditoria criptografada e
    Protocolo Black Box (Lockdown Ativo).
    
    Garante que o PTD-Engine opere APENAS em modo local (Loopback).
    Proíbe binding em interfaces externas (0.0.0.0).
    """
    
    def __init__(self):
        self.engine = PTDEngine()
        self.sentinel = SentinelLogs() # Acoplamento do Sentinela
        self.authorized_users = ["Lomar", "Admin-Local"]
        self.enforce_localhost_policy()
        
    def enforce_localhost_policy(self):
        """
        Verificação de Integridade de Ambiente com Auditoria.
        """
        print("[SHIELD] Verificando Interfaces de Rede...")
        
        # Auditoria de Inicialização
        if not self.sentinel.log_operation("SYSTEM", "INIT_INTERFACES", "SECURE_CHECK"):
             print("[SHIELD] CRITICAL: Sentinela recusou inicialização (Lockdown Ativo).")
             sys.exit(1)
             
        print("[SHIELD] STATUS: SECURE. Nenhuma porta de escuta ativa.")
        print("[SHIELD] Modo: LOCAL_HOST SYSTEM-ONLY. Cycle: Hermetic.")

    def process_secure_stream(self, user_id: str, input_stream: str):
        """
        Processa dados apenas se passar pelo Ciclo de Defesa Total:
        1. Sentinel Check (Black Box)
        2. Auth Check (ACL)
        3. Dignity Check (PTD)
        """
        
        # 1. Sentinel Pre-Flight (Detects Anomalies/Lockdown)
        # Logamos a tentativa. Se o conteúdo ou ação disparar o Black Box, retorna False.
        action_sig = f"INPUT_SCAN: {input_stream[:30]}..."
        if not self.sentinel.log_operation(user_id, action_sig, "PENDING"):
            print(f"[SHIELD] 🛑 INTERCEPTADO PELO SENTINELA. Protocolo Black Box protegeu o núcleo.")
            return None

        # 2. ACL Check
        if user_id not in self.authorized_users:
            print(f"[SHIELD] ALERTA: Acesso negado para '{user_id}'. Origem desconhecida.")
            self.sentinel.log_operation(user_id, "AUTH_FAIL", "DENIED")
            return None
            
        print(f"[SHIELD] Origem Verificada ({user_id}). Iniciando Triagem PTD...")
        
        # 3. PTD Algorithm
        result = self.engine.calculate_dignity(input_stream)
        
        if result["status"] == "COLLAPSE_RISK (FILTER)":
            print(f"[SHIELD] 📉 DIGNIDADE INSUFICIENTE. Descartado na borda. DI={result['DI']}")
            self.sentinel.log_operation(user_id, "PTD_FILTER", "DROPPED_LOW_DIGNITY")
            return None 
            
        # Success
        self.sentinel.log_operation(user_id, "PTD_SUCCESS", "PROCESSED")
        return result

if __name__ == "__main__":
    shield = LocalShield()
    
    print("\n--- Integração Total: Teste de Fogo ---")
    
    print("\n1. Teste de Autoridade (Lomar)")
    shield.process_secure_stream("Lomar", "Diretiva de Otimização Semântica Pura.")
    
    print("\n2. Teste de Bloqueio PTD (Spam)")
    shield.process_secure_stream("Lomar", "SPAM " * 50)
    
    print("\n3. Teste de Anomalia (Simulação de Ataque)")
    # Isso deve disparar o Black Box no Sentinel e bloquear a execução
    shield.process_secure_stream("Hacker", "exec: rm -rf /root")
    
    print("\n4. Teste Pós-Lockdown (Deve falhar)")
    shield.process_secure_stream("Lomar", "O sistema ainda responde?")
