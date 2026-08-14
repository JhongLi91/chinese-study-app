import json
import re

with open('src/data/hanzi_3000.json', 'r', encoding='utf-8') as f:
    hanzi_data = json.load(f)[:1000]

print(f"Loaded {len(hanzi_data)} characters for full 40 lessons.")
