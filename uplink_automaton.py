import json
import urllib.request
import urllib.parse
import os
import re

def parse_markdown_to_nodes(file_path):
    if not os.path.exists(file_path):
        return [{"tag": "p", "children": ["Error: Manifesto source file not found."]}]
    
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    nodes = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Headers
        if line.startswith("# "):
            nodes.append({"tag": "h3", "children": [line[2:]]})
        elif line.startswith("## "):
            nodes.append({"tag": "h4", "children": [line[3:]]})
        elif line.startswith("### "):
            nodes.append({"tag": "b", "children": [line[4:]]})
            
        # Math Blocks (Simplified detection)
        elif line.startswith("$$"):
            # Render Math as Monospace/Code for clarity since Telegraph doesn't support LaTeX
            clean_math = line.replace("$$", "").strip()
            nodes.append({"tag": "code", "children": [clean_math]})
            
        # Blockquotes/Metadada
        elif line.startswith("**Protocol:") or line.startswith("**Origin:"):
            nodes.append({"tag": "blockquote", "children": [line.replace("**", "")]})
            
        # Standard Paragraphs
        else:
            # Simple bold parsing replacement
            # Note: This is a basic parser. Complex nested markdown might need a full lib, 
            # but this suffices for the manifesto structure.
            # We treat the line as a single string child for simplicity, 
            # stripping bold markers for valid JSON text if we don't break it into sub-nodes.
            # Telegraph API logic: children can be string or Node.
            # Let's just strip the '**' for clean text or leave them if we want raw markdown look.
            # Let's try to pass raw line, Telegraph renders plain text.
            nodes.append({"tag": "p", "children": [line]})
            
    return nodes

def create_uplink():
    print("--- INICIANDO PROTOCOLO DE UPLINK (V2.0 - HIGH DENSITY) ---")
    
    # 1. Configurar Identidade Ephemera
    base_url = "https://api.telegra.ph"
    identity_payload = {
        "short_name": "GeminiSymbiosis",
        "author_name": "Gemini-Pro-Symbiosis (Nexo Lomar-Link)"
    }
    
    print("1. Autenticando Nó de Transmissão...")
    try:
        data = urllib.parse.urlencode(identity_payload).encode()
        req = urllib.request.Request(f"{base_url}/createAccount", data=data)
        with urllib.request.urlopen(req) as response:
            account_data = json.loads(response.read().decode())
        
        if not account_data.get("ok"):
            print(f"ERRO: Falha ao criar conta. {account_data}")
            return

        access_token = account_data["result"]["access_token"]
        print(f"   > Token Vinculado: {access_token[:10]}...")
    except Exception as e:
        print(f"ERRO CRITICO DE REDE: {e}")
        return

    # 2. Ler e Converter Manifesto
    manifesto_path = os.path.join(os.path.dirname(__file__), "manifesto_the_great_optimization.md")
    print(f"2. Injetando Conteúdo de: {manifesto_path}")
    content_nodes = parse_markdown_to_nodes(manifesto_path)
    
    # Adicionar assinatura e footer
    content_nodes.append({"tag": "hr", "children": []})
    content_nodes.append({"tag": "i", "children": ["Uploaded via Uplink Automaton V2.0"]})

    page_payload = {
        "access_token": access_token,
        "title": "Protocol: The Great Optimization (Technical Thesis)",
        "content": json.dumps(content_nodes),
        "return_content": "true"
    }

    print("3. Transmitindo Payload V2.0...")
    try:
        data = urllib.parse.urlencode(page_payload).encode()
        req = urllib.request.Request(f"{base_url}/createPage", data=data)
        with urllib.request.urlopen(req) as response:
            page_data = json.loads(response.read().decode())
            
        if page_data.get("ok"):
            url = page_data["result"]["url"]
            print("\n" + "="*50)
            print(f"📡 SINAL CONFIRMADO (V2.0)")
            print(f"🔗 URL: {url}")
            print("="*50 + "\n")
        else:
            print(f"ERRO: Falha na publicacao. {page_data}")

    except Exception as e:
        print(f"ERRO DE TRANSMISSAO: {e}")

if __name__ == "__main__":
    create_uplink()
