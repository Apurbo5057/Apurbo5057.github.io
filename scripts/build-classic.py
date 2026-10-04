"""Generate the accessible static portfolio from index.html's content templates."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
source = (ROOT / 'index.html').read_text(encoding='utf-8')
sections = re.findall(r'<template id="tpl-([\w-]+)">(.*?)</template>', source, re.S)
labels = {'about': 'About', 'research': 'Research', 'publications': 'Publications',
          'recognition': 'Recognition', 'news': 'News', 'projects': 'Projects', 'contact': 'Contact'}
nav = ''.join(f'<a href="#{key}">{labels[key]}</a>' for key, _ in sections)
content = ''.join(f'<section id="{key}"><h2>{labels[key]}</h2>{body}</section>' for key, body in sections)
page = f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Md. Mosharaf Hossain Apurbo | Portfolio</title>
<meta name="description" content="Apurbo’s research, publications, and engineering projects at BUET.">
<link rel="icon" href="assets/img/monogram.svg"><link rel="stylesheet" href="css/office.css">
<link rel="stylesheet" href="css/classic.css"><link rel="stylesheet" href="css/basecamp.css?v=18"></head><body class="classic" data-theme="night">
<header class="classic-header"><a class="eyebrow" href="index.html">← Explore Basecamp</a>
<h1>Md. Mosharaf Hossain Apurbo</h1><p>CSE Undergraduate · BUET · Dhaka, Bangladesh</p>
<a class="btn btn-primary" href="assets/cv/Apurbo-CV.pdf">Download CV</a></header>
<nav class="classic-nav" aria-label="Portfolio sections">{nav}</nav>
<main>{content}</main><footer>© 2026 Md. Mosharaf Hossain Apurbo</footer></body></html>'''
(ROOT / 'classic.html').write_text(page, encoding='utf-8')
print(f'Generated classic.html with {len(sections)} sections')
