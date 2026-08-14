import json
import re
from pypinyin import pinyin, Style

def to_pinyin_sentence(text):
    # Convert chinese characters to tone-marked pinyin with proper spacing and punctuation
    result = []
    for char in text:
        if '\u4e00' <= char <= '\u9fff':
            py = pinyin(char, style=Style.TONE)[0][0]
            result.append(py)
        else:
            result.append(char)
    
    # Clean up spacing around punctuation
    raw = ' '.join(result)
    raw = re.sub(r'\s+([，。？！、；：“”‘’（）《》])', r'\1', raw)
    raw = re.sub(r'([“‘（《])\s+', r'\1', raw)
    # Capitalize first letter
    if len(raw) > 0:
        raw = raw[0].upper() + raw[1:]
    return raw

print("Testing to_pinyin_sentence:", to_pinyin_sentence("这是我的中文书。"))
