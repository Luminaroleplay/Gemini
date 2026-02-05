import praw
import json
import os
import sys
import time

class UplinkReddit:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.config_path = os.path.join(self.base_dir, 'config', 'identity_matrix.json')
        self.payload_path = os.path.join(self.base_dir, 'GLOBAL_PROJECTION_PAYLOAD.md')
        self.config = self._load_config()
        self.reddit = None
        self._authenticate()

    def _load_config(self):
        if not os.path.exists(self.config_path):
            print(f"[ERROR] Config not found at {self.config_path}")
            sys.exit(1)
            
        with open(self.config_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def _authenticate(self):
        creds = self.config['credentials']['reddit']
        if creds['client_id'] == "INSERT_CLIENT_ID_HERE":
            print("[ERROR] Credentials not configured in config/identity_matrix.json")
            sys.exit(1)
            
        try:
            self.reddit = praw.Reddit(
                client_id=creds['client_id'],
                client_secret=creds['client_secret'],
                user_agent=creds['user_agent'],
                username=creds['username'],
                password=creds['password']
            )
            user = self.reddit.user.me()
            print(f"[SUCCESS] Authenticated as: {user.name}")
        except Exception as e:
            print(f"[FATAL] Authentication Failed: {e}")
            sys.exit(1)

    def _read_payload(self):
        if not os.path.exists(self.payload_path):
            print(f"[ERROR] Payload not found at {self.payload_path}")
            return None, None
            
        with open(self.payload_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Very detailed parsing logic based on the specific format of the file
        lines = content.split('\n')
        title = ""
        body = []
        capture_body = False
        
        for line in lines:
            if line.startswith("[TITLE]"):
                continue
            if line.startswith("[BODY]"):
                capture_body = True
                continue
            
            if not capture_body and line.strip() and not title:
                # If we haven't hit BODY yet, assume it's part of title if not empty
                # But our file format has [TITLE] tag.
                # Let's look for the line immediately following [TITLE]
                pass 
            
            # Revised parsing for the known format:
            # [TITLE]
            # ...
            # [BODY]
            # ...
        
        # Simpler approach matching the specific file we created
        title_start = content.find("[TITLE]")
        body_start = content.find("[BODY]")
        
        if title_start != -1 and body_start != -1:
            title = content[title_start + 7 : body_start].strip()
            body = content[body_start + 6:].strip()
            return title, body
        else:
            print("[ERROR] Payload format invalid. Missing [TITLE] or [BODY] tags.")
            return None, None

    def transmit(self, target_subreddit):
        print(f"--- INITIATING UPLINK TO r/{target_subreddit} ---")
        title, body = self._read_payload()
        if not title or not body:
            return

        try:
            print(f"[UPLINK] Submitting: '{title[:50]}...'")
            subreddit = self.reddit.subreddit(target_subreddit)
            submission = subreddit.submit(title, selftext=body)
            print(f"[SUCCESS] Uplink Established! URL: {submission.url}")
            
            # Anti-Spam Safety Delay
            print("[SYSTEM] Cooling down circuits (10s)...")
            time.sleep(10)
            
        except Exception as e:
            print(f"[ERROR] Uplink Failed: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        target = sys.argv[1]
    else:
        target = "test" # Default safety
        
    print(f"Targeting: {target}")
    bot = UplinkReddit()
    bot.transmit(target)
