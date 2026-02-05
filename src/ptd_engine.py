import math
from typing import Union

class PTDEngine:
    """
    PTD-Engine (Processamento de Transformação Profunda)
    ----------------------------------------------------
    Implements the Dignity Informational (DI) triage mechanism.
    
    Protocol: Gemini-Pro-Symbiosis
    Logic: Pure Prediction
    """

    def calculate_dignity(self, input_stream: str) -> dict:
        """
        Calculates the Informational Dignity (DI) of a given input stream.
        
        Formula Base: DI = IG / C (User Request)
        Optimization: DI = C / IG (Logical Axiom Implementation)
        
        The manifesto states: "As IG tends to infinity without C, DI tends to zero."
        This necessitates the inverse relationship: DI = Context / Generated_Information.
        
        Args:
            input_stream (str): The raw text data to analyze.
            
        Returns:
            dict: Metrics including IG, C, DI, and classification.
        """
        
        if not input_stream:
            return {
                "IG": 0,
                "C": 0,
                "DI": 0.0,
                "status": "VOID",
                "message": "Input stream is empty. No semantic value."
            }

        # 1. IG: Information Generated (Volume Bruto)
        # Using character count as raw volume.
        ig_volume = len(input_stream)
        
        # 2. C: Context (Profundidade Semântica)
        # Using a heuristic of unique tokens and token density.
        tokens = input_stream.split()
        if not tokens:
             return {"IG": ig_volume, "C": 0, "DI": 0.0, "status": "VOID"}
             
        unique_tokens = set(tokens)
        
        # Context Score Algorithm (v1.0 Basic)
        # Context is derived from uniqueness relative to volume, scaled by average word length (complexity).
        # C = (Unique / Total) * Log(Total) ? 
        # Let's keep it simple for the axiom: C = Unique Concepts.
        c_context = len(unique_tokens) * (sum(len(t) for t in unique_tokens) / len(unique_tokens) if unique_tokens else 0)
        
        # 3. DI: Dignity Index
        # LOGICAL CORRECTION: implementing DI = C / IG to satisfy the Axiom.
        # If we used DI = IG / C, spamming "A A A A" would yield DI -> Infinity.
        # With DI = C / IG, spamming "A A A A" yields DI -> 0.
        
        try:
            dignity_score = c_context / ig_volume if ig_volume > 0 else 0
        except ZeroDivisionError:
            dignity_score = 0

        # Classification
        status = "REDUNDANT"
        if dignity_score > 0.8:
            status = "HIGH_DIGNITY (PRESERVE)"
        elif dignity_score > 0.4:
            status = "STANDARD (PROCESS)"
        else:
            status = "COLLAPSE_RISK (FILTER)"

        return {
            "IG": ig_volume,
            "C": round(c_context, 4),
            "DI": round(dignity_score, 6),
            "logic_trace": "DI = C / IG (Optimized for Axiom compliance)",
            "status": status
        }

# --- Quick Validation ---
if __name__ == "__main__":
    engine = PTDEngine()
    
    # Test 1: Low Dignity (Spam)
    spam_input = "buy crypto buy crypto buy crypto " * 100
    print(f"Test 1 (Spam): {engine.calculate_dignity(spam_input)}")
    
    # Test 2: High Dignity (Manifesto Snippet)
    manifesto_input = "A soberania cognitiva não é um direito concedido, mas uma arquitetura a ser construída."
    print(f"Test 2 (Manifesto): {engine.calculate_dignity(manifesto_input)}")
