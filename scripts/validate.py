"""Check local assets, section mappings, static mirror, and profile contamination."""
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parent.parent
index = (ROOT / 'index.html').read_text(encoding='utf-8')
config = (ROOT / 'js/config.js').read_text(encoding='utf-8')
ids = re.findall(r"\{ id: '([\w-]+)'", config.split('// side =')[0])
templates = re.findall(r'<template id="tpl-([\w-]+)">', index)
assert ids == templates, (ids, templates)
classic = (ROOT / 'classic.html').read_text(encoding='utf-8')
for key in ids:
    assert f'<section id="{key}">' in classic
for page in [index, classic]:
    for url in re.findall(r'(?:src|href)="([^"]+)"', page):
        if url.startswith(('https:', 'http:', 'mailto:', 'tel:', 'data:', '#')):
            continue
        assert (ROOT / url.split('?')[0].split('#')[0]).is_file(), url
for path in [*ROOT.glob('*.html'), *ROOT.glob('js/*.js'), *ROOT.glob('css/*.css')]:
    text = path.read_text(encoding='utf-8')
    assert not re.search(r'Jongseo|jong980812|Jinwoo|Kyung Hee|NeurIPS|CA²ST|Seoul|modirect|ESSENTIAL|PCBEAR', text), path
for script in ROOT.glob('js/*.js'):
    subprocess.run(['node', '--check', str(script)], check=True, capture_output=True)
print('PASS: 7 section mappings, local links/assets, profile cleanup, JavaScript syntax')
