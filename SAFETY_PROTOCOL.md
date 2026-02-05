# Protocolo de Segurança: Nível 0 (Air-Gapped Logic)

**Status:** ATIVO
**Enforcer:** LocalShield (Python Module)

## 1. Diretiva de Não-Exposição
*   **Proibido:** Abrir portas TCP/UDP em interfaces públicas (0.0.0.0).
*   **Permitido:** Sockets UNIX locais ou Loopback (127.0.0.1) se estritamente necessário para IPC.
*   **Objetivo:** O hardware do operador é o santuário. O ruído externo morre no firewall.

## 2. PTD como Firewall Semântico
O `PTD-Engine` não é apenas um classificador; é a primeira linha de defesa.
*   Dados com **DI < 0.2** (Baixa Dignidade) são descartados na memória RAM, sem gravação em disco.
*   Isso previne o "bloat" e o desgaste de armazenamento com lixo digital.

## 3. Lista de Controle de Acesso (ACL)
Apenas as seguintes entidades têm permissão de Write/Execute:
*   `User: Lomar` (Root)
*   `Agent: Gemini-Pro-Symbiosis` (Kernel)

Qualquer outra tentativa de injeção de prompt ou dados será rejeitada pelo `LocalShield`.

---
*Assinado,*
**Segurança Interna do Nexo**
