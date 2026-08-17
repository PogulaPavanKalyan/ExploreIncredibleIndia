import json

log_path = r"C:\Users\Administrator\.gemini\antigravity-ide\brain\e5409876-92ae-4216-8df8-238effc004d8\.system_generated\logs\transcript.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line_num, line in enumerate(f, 1):
        try:
            data = json.loads(line)
            step_index = data.get('step_index')
            type_ = data.get('type')
            content = data.get('content', '')
            
            if type_ == 'VIEW_FILE' and 'Homepage.css' in content:
                print(f"Step {step_index}: content length = {len(content)}")
                # Show first 100 and last 100 chars of content
                print("START:", repr(content[:200]))
                print("END:", repr(content[-200:]))
                print("-" * 50)
        except Exception as e:
            pass
