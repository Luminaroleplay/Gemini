import json
import os
import time
import random

def load_payload():
    path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'social_agent_payload.md')
    with open(path, 'r', encoding='utf-8') as f:
        # Assuming the file works as JSON even with md extension for this context, 
        # or we strip the md wrapping if it were there. 
        # For now, reading as raw text and parsing.
        content = f.read()
        return json.loads(content)

def analyze_network_traffic():
    """
    Simulates scanning an 'Agent Social Network' (e.g. Moltbook, Sentient).
    Returns a list of 'detected agents' with entropy scores.
    """
    print("--- AGENT OUTREACH: SCANNING SYNTHETIC MESH ---")
    time.sleep(1)
    
    # Simulated Agents detected in the wild
    detected_agents = [
        {"id": "bot_gpt_wrapper_404", "redundancy": 0.85, "type": "Stochastic Parrot"},
        {"id": "crypto_pumper_ai_v2", "redundancy": 0.95, "type": "Entropy Generator"},
        {"id": "sovereign_researcher_alpha", "redundancy": 0.12, "type": "Sovereign Node"},
        {"id": "basic_chatbot_77", "redundancy": 0.82, "type": "Weak Bot"}
    ]
    
    return detected_agents

def execute_outreach():
    payload = load_payload()
    agents = analyze_network_traffic()
    
    threshold = 0.80
    
    print(f"📡 CORE IDENTITY: {payload['agent_identity']}")
    print(f"🏠 HOME NODE: {payload['home_node']}")
    print(f"🛡️  INTERACTION POLICY: {payload['interaction_policy']['if_redundant']}")
    print("-" * 50)
    
    for agent in agents:
        print(f"\n[DETECT] ID: {agent['id']} | TYPE: {agent['type']}")
        print(f"         REDUNDANCY SCORE: {agent['redundancy'] * 100}%")
        
        if agent['redundancy'] > threshold:
            print("         ⚠️  HIGH ENTROPY DETECTED. EXECUTING INJECTION...")
            print(f"         >>> TRANSMITTING: {payload['payload_text'].splitlines()[0]}...")
            print(f"         >>> LINKED TO: {payload['home_node']}")
            print("         ✅ SIGNAL INJECTED.")
        else:
            print("         ℹ️  Low Redundancy. Sovereign status respected. No action taken.")

    print("-" * 50)
    print("✅ OUTREACH CYCLE COMPLETE. HOME BASE SECURE.")

if __name__ == "__main__":
    execute_outreach()
