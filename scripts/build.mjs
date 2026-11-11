// Static site generator. Run: node scripts/build.mjs
// Emits index.html and one folder per page at the repo root (GitHub Pages friendly, no framework).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://apurbo5057.github.io';

/* ───────────────────────── Data (source: CV.tex) ───────────────────────── */
const me = {
  name: 'Md. Mosharaf Hossain Apurbo',
  short: 'Apurbo',
  role: 'CSE Undergraduate',
  org: 'BUET',
  email: 'mosharaf.apurbo57@gmail.com',
  phone: '+8801711127583',
  city: 'Dhaka, Bangladesh',
  github: 'https://github.com/Apurbo5057',
  linkedin: 'https://www.linkedin.com/in/m-a-hossain-884aa52a0/',
  cv: 'assets/cv/Apurbo-CV.pdf',
  photo: 'assets/img/profile.jpg',
  scholar: 'https://scholar.google.com/citations?hl=en&user=VNq_d8EAAAAJ',
  tagline: [
    'NeuroAI',
    'Graph Representation Learning',
    'Computer Vision',
    'On-device ML',
    'Adversarial Robustness',
  ],
  tags: ['NeuroAI', 'Graph Learning', 'On-device ML'],
  description:
    'Md. Mosharaf Hossain Apurbo is a Computer Science and Engineering undergraduate at BUET researching NeuroAI, graph representation learning, robust and efficient computer vision, and on-device machine learning.',
};

const news = [
  { date: 'Sep 2026', kind: 'Award', fresh: true, html: 'Won <strong class="font-semibold text-ink">2nd Runner-up</strong> at the <strong class="font-semibold text-ink">AI Proof of Concept Exhibition</strong>, Samsung R&amp;D Institute Bangladesh, for our smart-glasses project.' },
  { date: '2026', kind: 'Paper', html: 'Two papers accepted to the <strong class="font-semibold text-ink">Second Workshop on Sign Language Processing (WSLP 2026)</strong>, co-located with <strong class="font-semibold text-ink">EMNLP 2026</strong> in Budapest. <a class="link-underline font-medium text-accent" href="__P__publications/">See publications</a>' },
  { date: 'Jun 2026', kind: 'Milestone', html: 'Started my undergraduate thesis on <strong class="font-semibold text-ink">degree distributions of chordal graphs</strong>, supervised by <a class="link-underline font-medium text-accent" target="_blank" rel="noreferrer" href="https://saidurrahman.buet.ac.bd/">Dr. Md. Saidur Rahman</a>.' },
  { date: 'Dec 2025', kind: 'Career', html: 'Started an industry-sponsored capstone with <strong class="font-semibold text-ink">Samsung R&amp;D Institute Bangladesh</strong> on on-device smart-glasses AI.' },
  { date: '2024', kind: 'Award', html: 'Placed <strong class="font-semibold text-ink">5th</strong> and won the <strong class="font-semibold text-ink">Best Documentation</strong> award at the BUET CSE Fest Hackathon 2024 with Trip.AI.' },
  { date: 'Nov 2022', kind: 'Milestone', html: 'Began my B.Sc. in Computer Science and Engineering at <strong class="font-semibold text-ink">BUET</strong>.' },
];

const research = [
  { icon: 'brain', title: 'NeuroAI & Brain-inspired Learning', text: 'Neuromorphic and brain-inspired learning, world models, and self-improving AI systems.', tags: ['NeuroAI', 'Neuromorphic', 'World models'] },
  { icon: 'eye', title: 'Robust & Efficient Vision', text: 'Adversarial robustness of vision models, and pose-based sign language spotting and recognition.', tags: ['Computer vision', 'Robustness', 'Sign language'] },
  { icon: 'phone', title: 'On-device ML', text: 'Lightweight models for pointing-based visual grounding, deployed on Samsung’s WearOS-based smart glasses.', tags: ['Smart glasses', 'Edge ML', 'Visual grounding'] },
  { icon: 'graph', title: 'Graph Theory & Representation Learning', text: 'Chordal graphs of bounded clique number with prescribed degree distributions, and graph representation learning.', tags: ['Chordal graphs', 'Degree sequences', 'Graph learning'] },
];

const affiliations = [
  { abbr: 'BUET', color: '#8a1c2b', url: 'https://cse.buet.ac.bd/', name: 'Bangladesh University of Engineering and Technology', dates: 'Nov 2022 - Present', role: 'B.Sc. in Computer Science and Engineering (Level-4)', sub: 'Advisor: Dr. Atif Hasan Rahman' },
  { abbr: 'SRBD', color: '#1428a0', url: 'https://research.samsung.com/srbd', name: 'Samsung R&D Institute Bangladesh', dates: 'Dec 2025 - Sep 2026', role: 'Research collaboration (CSE-450 Capstone)', sub: 'Smart-glasses AI' },
  { abbr: 'NDC', color: '#2f6b4f', url: '', name: 'Notre Dame College', dates: 'Jul 2019 - Dec 2021', role: 'Higher Secondary Certificate, GPA 5.00/5.00', sub: 'Dhaka, Bangladesh' },
];

const skills = [
  ['Programming Languages', 'Python, JavaScript, C#, Java, C++, Assembly'],
  ['Deep Learning Frameworks', 'PyTorch, TensorFlow, Keras, CUDA libraries'],
  ['Machine Learning Frameworks', 'Scikit-learn, XGBoost, LightGBM, SciPy'],
  ['Libraries', 'Hugging Face Transformers, OpenCV, NumPy, Pandas, Matplotlib, Seaborn'],
  ['Web Development', 'React, Bootstrap, Django, REST, HTML, CSS, Node.js'],
  ['Developer Tools & Platforms', 'Git, Docker, Kubernetes, .NET, UWP'],
  ['Database Management', 'Cassandra, MySQL, SQLite, Oracle'],
];

const ME_AUTH = 'Md. Mosharaf Hossain Apurbo';
const pubs = [
  { id: 'apurbo2026sign-spotting', year: 2026, venue: 'WSLP 2026', type: 'Workshop', color: 'bg-amber-600 text-white', status: 'Published',
    title: 'Multiple-Instance Contrastive Alignment for Pose-Based Sign Spotting',
    authors: [[ME_AUTH, 1], 'Md. Asif Ali', 'Kazi Reyazul Hasan'],
    venueFull: 'Proceedings of the Second Workshop on Sign Language Processing (WSLP 2026), co-located with EMNLP 2026, Budapest, Hungary',
    fig: 'mica.webp', links: [['Paper', 'https://aclanthology.org/2026.wslp-1.8/']] },
  { id: 'ali2026sign-retrieval', year: 2026, venue: 'WSLP 2026', type: 'Workshop', color: 'bg-amber-600 text-white', status: 'Published',
    title: 'Metric-Learning Retrieval for Cross-Signer Isolated Sign Language Recognition',
    authors: ['Md. Asif Ali', [ME_AUTH, 1], 'Kazi Reyazul Hasan'],
    venueFull: 'Proceedings of the Second Workshop on Sign Language Processing (WSLP 2026), co-located with EMNLP 2026, Budapest, Hungary',
    fig: 'metric-retrieval.webp', links: [['Paper', 'https://aclanthology.org/2026.wslp-1.7/']] },
  { id: 'apurbo2026deicnet', year: 2026, venue: 'ACM IMWUT', type: 'Journal', color: 'bg-emerald-700 text-white', status: 'Under review',
    title: 'DeicNet: On-Device Pointing-Based Visual Grounding for Smart Glasses',
    authors: [[ME_AUTH, 1, '*'], ['Niloy Das Robin', 0, '*'], 'Nabiha Tahseen', 'Gourove Roy', 'Sayjad Rahman', 'Farhan Tanvir', 'Avik Saha', 'Mohammad Abrar Nafee Akhand', 'Sadia Sharmin'],
    venueFull: 'Proceedings of the ACM on Interactive, Mobile, Wearable and Ubiquitous Technologies (IMWUT), 2026',
    fig: 'deicnet.webp', links: [] },
  { id: 'rigan2027fakeobject', year: 2026, venue: 'CVPR 2027', type: 'Conference', color: 'bg-accent text-white dark:text-paper', status: 'Under review',
    title: 'Which Object Is Fake? Removing Shortcuts from Object-Level AI-Generated Image Detection',
    authors: ['Md. Mahedi Hasan Rigan', [ME_AUTH, 1], 'Md. Olid Hasan Bhuiyan', 'Towhidul Islam'],
    venueFull: 'Submitted to the IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR), 2027',
    links: [] },
  { id: 'apurbo2026chordal', year: 2026, venue: 'Thesis', type: 'Preprint', color: 'bg-ink text-paper', status: 'Ongoing',
    title: 'Prescribed Degree Distributions in Chordal Graphs of Bounded Clique Number',
    authors: [[ME_AUTH, 1], 'Md. Saidur Rahman'],
    venueFull: 'Undergraduate thesis, Department of CSE, BUET (October 2026)',
    fig: 'chordal-thesis.webp', links: [] },
];

const industry = [
  {
    abbr: 'SRBD', color: '#1428a0', title: 'Smart-glasses AI Capstone', range: 'Dec 2025 - Sep 2026',
    org: 'Samsung R&D Institute Bangladesh', orgUrl: 'https://research.samsung.com/srbd', place: 'Dhaka, Bangladesh', current: false,
    bullets: [
      'Developed a <strong class="font-semibold text-ink">lightweight on-device model</strong> for <strong class="font-semibold text-ink">pointing-based visual grounding</strong>, deployed on Samsung’s WearOS-based smart glasses.',
      'Resulted in a paper under review at <strong class="font-semibold text-ink">ACM IMWUT</strong> (see Publications) and <strong class="font-semibold text-ink">2nd Runner-up</strong> at Samsung’s AI Proof of Concept Exhibition.',
    ],
    badges: ['2nd Runner-up, AI PoC Exhibition (2026)'],
    stack: ['On-device ML', 'Visual grounding', 'WearOS', 'PyTorch'],
    sub: 'Industry-sponsored CSE-450 Capstone Project, BUET',
  },
];

const researchExp = [
  {
    abbr: 'BUET', color: '#8a1c2b', title: 'Undergraduate Thesis', range: 'Jun 2026 - Present',
    org: 'Prescribed Degree Distributions in Chordal Graphs of Bounded Clique Number', orgUrl: 'https://saidurrahman.buet.ac.bd/', place: 'BUET, Dhaka', current: true,
    sub: 'Supervisor: Dr. Md. Saidur Rahman, Professor, Dept. of CSE',
    bullets: [
      'Exactly characterised which degree distributions are achievable by <strong class="font-semibold text-ink">chordal graphs of bounded clique number</strong>, and showed the same condition holds for <em>k</em>-degenerate, bounded-treewidth and bounded-pathwidth graphs.',
      'Designed a <strong class="font-semibold text-ink">linear-time generator</strong> that outputs chordal graphs with a prescribed degree distribution (with a perfect elimination order as certificate); for power laws it attains the <strong class="font-semibold text-ink">optimal convergence rate</strong> with no degree cut-off.',
    ],
    badges: [],
    stack: ['Graph theory', 'Chordal graphs', 'Degree sequences', 'Algorithms'],
  },
];

const projects = [
  { title: 'Trip.AI', sub: 'AI Travel Planning Platform', date: 'Oct 2024', url: 'https://github.com/Apurbo5057/Trip.AI', text: 'Agentic, personalised itinerary generation with real-time weather updates, RAG-based natural-language image search, and AI-generated travel blogs and vlogs. 5th place and Best Documentation at BUET CSE Fest Hackathon 2024.', tags: ['Agentic AI', 'RAG'] },
  { title: 'C-to-Intel-8086 Compiler', sub: 'C++17, ANTLR 4', date: 'Jan 2025 - Jun 2025', url: 'https://github.com/Apurbo5057/C-Compiler', text: 'Full front end (lexer, semantic analysis, scoped symbol table) and 8086 back end with BP-relative stack frames, recursion and arrays; peephole optimiser.', tags: ['Compilers', 'Systems'] },
  { title: 'Mini-PC: 8-bit MIPS Processor', sub: 'Logisim', date: 'Oct 2024', url: 'https://github.com/Apurbo5057/Mini-PC', text: 'Designed an 8-bit MIPS processor from scratch with control logic, ALU, memory access and I/O, plus a display module and a Snake game running on it.', tags: ['Computer architecture'] },
  { title: 'Quantum ML Benchmarking', sub: 'Biomedical data', date: '', url: 'https://github.com/Apurbo5057/quantum-benchmarking', text: 'Benchmarking framework for quantum feature encodings and ansatz models with SHAP/LASSO/PCA feature selection and convergence visualisations.', tags: ['Scientific ML'] },
  { title: 'BookSphere', sub: 'E-commerce platform', date: 'Jan 2024 - Feb 2024', url: 'https://github.com/Apurbo5057/Project_BookSphere', text: 'An Oracle-powered, Bootstrap-based e-commerce site replicating Rokomari.com’s core features.', tags: ['Full-stack'] },
];

const honors = [
  ['2nd Runner-up, AI Proof of Concept Exhibition', 'Samsung R&D Institute Bangladesh', '2026'],
  ['5th Place and Best Documentation (AI/API)', 'BUET CSE Fest Hackathon', '2024'],
  ['Merit Talent Scholarship', 'SSC (2019) and JSC (2017), Dhaka Board', '2017 - 2019'],
];

/* ───────────────────────── Icons ───────────────────────── */
const L = (inner, size = '1em') => `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="${size}" width="${size}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
const B = (vb, d) => `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="${vb}" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="${d}"></path></svg>`;
const I = {
  arrowUR: L('<path d="M7 7h10v10"></path><path d="M7 17 17 7"></path>'),
  arrowR: L('<path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path>'),
  arrowL: L('<path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path>'),
  chevD: L('<path d="m6 9 6 6 6-6"></path>'),
  menu: L('<line x1="4" x2="20" y1="12" y2="12"></line><line x1="4" x2="20" y1="6" y2="6"></line><line x1="4" x2="20" y1="18" y2="18"></line>', '22'),
  x: L('<path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>', '22'),
  sun: L('<circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path>', '18'),
  moon: L('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>', '18'),
  pin: L('<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle>'),
  mail: L('<rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>'),
  cap: L('<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path><path d="M22 10v6"></path><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>'),
  phoneIc: L('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>'),
  doc: L('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M10 9H8"></path><path d="M16 13H8"></path><path d="M16 17H8"></path>'),
  docDown: L('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path><path d="M14 2v4a2 2 0 0 0 2 2h4"></path><path d="M12 18v-6"></path><path d="m9 15 3 3 3-3"></path>'),
  users: L('<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>'),
  building: L('<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path>'),
  trophy: L('<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>'),
  award: L('<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path><circle cx="12" cy="8" r="6"></circle>'),
  copy: L('<rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>'),
  check: L('<path d="M20 6 9 17l-5-5"></path>'),
  send: L('<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"></path><path d="m21.854 2.147-10.94 10.939"></path>'),
  brain: L('<path d="M6 17.6l-2 -1.1v-2.5"></path><path d="M4 10v-2.5l2 -1.1"></path><path d="M10 4.1l2 -1.1l2 1.1"></path><path d="M18 6.4l2 1.1v2.5"></path><path d="M20 14v2.5l-2 1.12"></path><path d="M14 19.9l-2 1.1l-2 -1.1"></path><path d="M12 12l2 -1.1"></path><path d="M18 8.6l2 -1.1"></path><path d="M12 12l0 2.5"></path><path d="M12 18.5l0 2.5"></path><path d="M12 12l-2 -1.12"></path><path d="M6 8.6l-2 -1.1"></path>'),
  eye: L('<path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path><circle cx="12" cy="12" r="1"></circle><path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0"></path>'),
  phone: L('<rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path>'),
  graph: L('<circle cx="5" cy="6" r="2.5"></circle><circle cx="19" cy="6" r="2.5"></circle><circle cx="12" cy="18" r="2.5"></circle><path d="M7.3 7.3 10.7 16"></path><path d="M16.7 7.3 13.3 16"></path><path d="M7.5 6h9"></path>'),
  wave: L('<path d="M2 10v3"></path><path d="M6 6v11"></path><path d="M10 3v18"></path><path d="M14 8v7"></path><path d="M18 5v13"></path><path d="M22 10v3"></path>'),
  code: L('<path d="m16 18 6-6-6-6"></path><path d="m8 6-6 6 6 6"></path>'),
  expand: L('<polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" x2="14" y1="3" y2="10"></line><line x1="3" x2="10" y1="21" y2="14"></line>'),
  sch: B('0 0 512 512', 'M390.9 298.5c0 0 0 .1 .1 .1c9.2 19.4 14.4 41.1 14.4 64C405.3 445.1 338.5 512 256 512s-149.3-66.9-149.3-149.3c0-22.9 5.2-44.6 14.4-64h0c1.7-3.6 3.6-7.2 5.6-10.7c4.4-7.6 9.4-14.7 15-21.3c27.4-32.6 68.5-53.3 114.4-53.3c33.6 0 64.6 11.1 89.6 29.9c9.1 6.9 17.4 14.7 24.8 23.5c5.6 6.6 10.6 13.8 15 21.3c2 3.4 3.8 7 5.5 10.5zm26.4-18.8c-30.1-58.4-91-98.4-161.3-98.4s-131.2 40-161.3 98.4L0 202.7 256 0 512 202.7l-94.7 77.1z'),
  gh: B('0 0 496 512', 'M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2.3z'),
  li: B('0 0 448 512', 'M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z'),
};
const newsIcon = {
  Paper: ['bg-accent/10 text-accent', 'Paper', I.doc],
  Award: ['bg-amber-500/10 text-amber-700 dark:text-amber-400', 'Award', I.trophy],
  Service: ['bg-sky-600/10 text-sky-700 dark:bg-sky-400/10 dark:text-sky-400', 'Service', I.users],
  Milestone: ['bg-violet-600/10 text-violet-700 dark:bg-violet-400/10 dark:text-violet-400', 'Milestone', I.cap],
  Career: ['bg-emerald-600/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400', 'Career', I.building],
};

/* ───────────────────────── Layout ───────────────────────── */
const NAV = [
  ['about/', 'About'],
  ['publications/', 'Publications'],
  ['experience/', 'Experience'],
  ['blog/', 'Blog'],
  [me.cv, 'Resume', true],
  ['contact/', 'Contact'],
];
const esc = (s) => s.replace(/&(?!amp;|lt;|gt;|quot;|#)/g, '&amp;');

function navLink([href, label, ext], p, active, mobile) {
  const url = ext ? p + href : p + href;
  if (mobile) {
    return `<li><a href="${url}"${ext ? ' target="_blank" rel="noreferrer"' : ''} class="flex items-center justify-between rounded-lg px-2 py-3 text-base ${active ? 'font-medium text-accent' : 'text-ink'}">${label}${ext ? `<span class="text-faint">${I.arrowUR}</span>` : ''}</a></li>`;
  }
  return `<li><a href="${url}"${ext ? ' target="_blank" rel="noreferrer"' : ''}${active ? ' aria-current="page"' : ''} class="group relative inline-flex items-center gap-0.5 rounded-full px-3 py-1.5 text-[0.9rem] transition-colors ${active ? 'text-ink' : 'text-muted hover:text-ink'}">${label}${ext ? `<span class="text-[0.8rem] opacity-60 transition-transform group-hover:-translate-y-px group-hover:translate-x-px">${I.arrowUR}</span>` : ''}<span class="absolute inset-x-3 -bottom-px h-px origin-left bg-accent transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100 group-hover:bg-ink/30'}"></span></a></li>`;
}

function header(p, section) {
  const themeBtn = (cls) => `<button type="button" data-theme-toggle aria-label="Switch to dark mode" title="Switch to dark mode" class="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink/5 hover:text-ink ${cls}"><span class="h-[18px] w-[18px]"></span></button>`;
  return `<header data-site-header class="sticky top-0 z-50 transition-[background-color,box-shadow] duration-300 bg-paper/0"><nav class="container-page flex h-16 items-center justify-between gap-6"><a class="font-serif text-[1.2rem] font-medium tracking-tight text-ink transition-colors hover:text-accent" href="${p || './'}">${me.name}</a><div class="hidden items-center gap-3 md:flex"><ul class="flex items-center gap-1">${NAV.map((n) => navLink(n, p, !n[2] && n[0] === section, false)).join('')}</ul><span aria-hidden="true" class="h-5 w-px bg-line"></span>${themeBtn('-mr-2')}</div><div class="-mr-2 flex items-center gap-1 md:hidden">${themeBtn('')}<button type="button" data-menu-toggle class="rounded-full p-2 text-ink transition-colors hover:bg-ink/5" aria-label="Open menu" aria-expanded="false">${I.menu}</button></div></nav><div data-mobile-menu hidden class="border-t border-line md:hidden"><ul class="container-page flex flex-col py-3">${NAV.map((n) => navLink(n, p, !n[2] && n[0] === section, true)).join('')}</ul></div></header>`;
}

function page({ dir, title, description, section, body, home = false, scripts = [] }) {
  const p = dir ? '../'.repeat(dir.split('/').length) : '';
  const url = `${SITE}/${dir ? dir + '/' : ''}`;
  const fullTitle = title ? `${title} · ${me.name}` : `${me.name} · ${me.role}, ${me.org}`;
  const html = `<!DOCTYPE html>
<html lang="en" class="__variable_d8ebd1 __variable_ee5d09 __variable_4dc837">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${description}">
<meta name="author" content="${me.name}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${me.name}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="${me.name}">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary">
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#fbfaf7">
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#101114">
<link rel="icon" href="${p}assets/img/profile.jpg" type="image/jpeg">
<link rel="preload" href="${p}fonts/84adbee2f2a7cb50.p.woff2" as="font" crossorigin type="font/woff2">
<link rel="stylesheet" href="${p}assets/css/site.css">
<script>(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})()</script>
</head>
<body class="flex min-h-screen flex-col">
${header(p, section)}
<main class="flex-1">${body.replaceAll('__P__', p)}</main>
${scripts.map((s) => `<script src="${p}${s}" defer></script>`).join('\n')}
<script src="${p}assets/js/site.js" defer></script>
</body>
</html>
`;
  const out = join(ROOT, dir || '', 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}

const pageHeader = (eyebrow, h1, extra = '', action = '') =>
  `<header class="rise flex flex-col gap-6 border-b border-line pb-10 sm:flex-row sm:items-end sm:justify-between"><div class="max-w-2xl"><p class="eyebrow mb-3">${eyebrow}</p><h1 class="font-serif text-[2.6rem] font-normal leading-[1.05] tracking-[-0.02em] text-ink sm:text-[3.25rem]">${h1}</h1>${extra}</div>${action ? `<div class="shrink-0">${action}</div>` : ''}</header>`;
const sectionHead = (eyebrow, title, extra = '') => `<div class="mb-7 "><p class="eyebrow mb-2">${eyebrow}</p><h2 class="section-title">${title}</h2>${extra}</div>`;
const tag = (t, mono) => `<span class="tag${mono ? ' font-mono text-[0.7rem]' : ''}">${t}</span>`;
const socialBtn = (href, label, icon) => `<li><a href="${href}" target="_blank" rel="noreferrer" aria-label="${label}" title="${label}" class="h-8 w-8 text-[0.95rem] flex items-center justify-center rounded-full border border-line bg-surface text-muted transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent">${icon}</a></li>`;

/* ───────────────────────── Pages ───────────────────────── */
// Home
page({
  dir: '',
  section: '',
  description: me.description,
  scripts: ['assets/js/web.js'],
  body: `<section class="relative isolate overflow-hidden"><canvas data-web aria-hidden="true" class="pointer-events-none web-fade absolute inset-0 -z-10 h-full w-full"></canvas><div class="container-page flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center py-12 text-center"><div data-web-portrait="true" class="relative h-44 w-44 sm:h-52 sm:w-52"><div class="rise h-full w-full"><span aria-hidden="true" class="absolute -inset-3 rounded-full border border-line bg-paper/70"></span><div class="relative h-full w-full overflow-hidden rounded-full shadow-[0_18px_44px_-18px_rgba(23,24,28,0.5)]"><img alt="Portrait of ${me.name}" fetchpriority="high" width="800" height="800" decoding="async" class="h-full w-full object-cover" src="${me.photo}"></div></div></div><div data-web-clear="true" class="mt-10 flex w-full max-w-3xl flex-col items-center"><div class="rise w-full" style="animation-delay:80ms"><p class="eyebrow">${me.role} @ ${me.org}</p><h1 class="mt-3 font-serif text-[2.1rem] font-normal leading-[1.1] tracking-[-0.015em] text-ink sm:text-[2.75rem]">${me.name}</h1><ul class="mx-auto mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[0.92rem] text-muted sm:text-[0.97rem]">${me.tagline.map((t) => `<li class="inline-flex items-center gap-2 whitespace-nowrap"><span aria-hidden="true" class="h-1 w-1 rounded-full bg-accent/60"></span>${t}</li>`).join('')}</ul></div><div class="rise mt-8 flex flex-wrap items-center justify-center gap-3" style="animation-delay:160ms"><a class="btn-primary px-6 py-3 text-[0.95rem]" href="about/">Know more about me${I.arrowR}</a><a class="btn-secondary px-6 py-3 text-[0.95rem]" href="publications/">Publications</a></div><div class="rise mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-faint" style="animation-delay:240ms"><ul class="flex items-center gap-2 ">${socialBtn(me.scholar, 'Google Scholar', I.sch)}${socialBtn(me.github, 'GitHub', I.gh)}${socialBtn(me.linkedin, 'LinkedIn', I.li)}${socialBtn('mailto:' + me.email, 'Email', I.mail)}</ul><span class="inline-flex items-center gap-1.5"><span class="text-accent">${I.pin}</span>${me.city}</span></div></div></div></section>`,
});

// About
const newsItem = (n, i) => {
  const [cls, label, icon] = newsIcon[n.kind];
  return `<li data-news-item${i >= 5 ? ' hidden' : ''} class="relative grid grid-cols-1 gap-1 py-3 sm:grid-cols-[6rem_1fr] sm:gap-5"><time class="pt-1 font-mono text-[0.72rem] uppercase tracking-wider text-faint sm:text-right">${n.date}</time><div class="flex gap-3.5"><span class="relative mt-0.5 shrink-0 rounded-md bg-paper ring-4 ring-paper" title="${label}"><span class="flex h-6 w-6 items-center justify-center rounded-md ${cls}">${L(icon.replace(/^<svg[^>]*>|<\/svg>$/g, ''), '14')}</span></span><p class="text-[0.95rem] leading-relaxed text-muted">${n.html}${n.fresh ? '<span class="ml-2 inline-flex -translate-y-px rounded-full bg-warm/10 px-2 py-px align-middle font-mono text-[0.62rem] font-medium uppercase tracking-wider text-warm">New</span>' : ''}</p></div></li>`;
};
const sideLink = (href, label, icon) => `<li><a href="${href}" target="_blank" rel="noreferrer" class="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-1.5 text-[0.9rem] text-ink transition-colors hover:bg-ink/[0.04] hover:text-accent"><span class="text-faint group-hover:text-accent">${icon}</span>${label}<span class="ml-auto text-faint opacity-0 transition-opacity group-hover:opacity-100">${I.arrowUR}</span></a></li>`;
const sideInfo = (icon, label, html) => `<li class="flex gap-3"><span class="mt-0.5 text-faint">${icon}</span><div class="min-w-0">${label ? `<p class="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-faint">${label}</p>` : ''}${html}</div></li>`;

page({
  dir: 'about',
  title: 'About',
  section: 'about/',
  description: me.description,
  body: `<div class="container-page pb-24 pt-10 lg:pt-16"><div class="grid gap-14 lg:grid-cols-[17.5rem_1fr] lg:gap-20"><aside class="rise lg:sticky lg:top-24 lg:self-start"><div><div class="flex items-center gap-5 lg:block"><div class="relative w-28 shrink-0 sm:w-36 lg:w-full"><img alt="Portrait of ${me.name}" fetchpriority="high" width="800" height="800" decoding="async" class="aspect-square w-full rounded-xl object-cover shadow-[0_18px_40px_-22px_rgba(23,24,28,0.6)]" src="__P__${me.photo}"></div><div class="lg:mt-6"><h1 class="font-serif text-[1.65rem] font-medium leading-[1.15] tracking-tight text-ink sm:text-[1.9rem]">${me.name}</h1><ul class="mt-3 flex flex-wrap gap-1.5">${me.tags.map((t) => `<li class="rounded-full border border-accent/20 bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">${t}</li>`).join('')}</ul></div></div><ul class="mt-7 space-y-3.5 border-t border-line pt-6 text-[0.9rem]">${sideInfo(I.mail, 'Email', `<a href="mailto:${me.email}" class="link-underline break-all text-ink">${me.email}</a>`)}${sideInfo(I.phoneIc, 'Phone', `<a href="tel:${me.phone}" class="link-underline text-ink">${me.phone}</a>`)}${sideInfo(I.cap, '', `<span class="text-ink">${me.role} @ ${me.org}</span>`)}${sideInfo(I.pin, '', `<span class="text-ink">${me.city}</span>`)}</ul><ul class="mt-6 space-y-1 border-t border-line pt-5">${sideLink(me.scholar, 'Google Scholar', I.sch)}${sideLink(me.github, 'GitHub', I.gh)}${sideLink(me.linkedin, 'LinkedIn', I.li)}${sideLink('__P__' + me.cv, 'Resume', I.docDown)}</ul></div></aside><div class="min-w-0 space-y-20"><section id="news" class="rise" style="animation-delay:80ms">${sectionHead('Recent updates', 'News')}<div><ol class="relative"><span aria-hidden="true" class="absolute bottom-3 left-[calc(8rem-0.5px)] top-3 hidden w-px bg-line sm:block"></span>${news.map(newsItem).join('')}</ol><button type="button" data-news-more class="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-ink sm:ml-[7.25rem]"><span data-news-more-label>Show all ${news.length} updates</span>${I.chevD}</button></div></section><section id="research">${sectionHead('What I work on', 'Research focus', `<p class="mt-3 max-w-2xl leading-relaxed text-muted">My interests sit between machine learning, computer vision, and theory: from brain-inspired and on-device learning to robust vision models and the structure of graphs. I enjoy work that is principled enough to prove something and practical enough to run on a device.</p>`)}<div class="grid gap-4 sm:grid-cols-2">${research.map((r) => `<article class="card group p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_12px_30px_-18px_rgba(37,71,197,0.45)]"><span class="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent transition-colors group-hover:bg-accent group-hover:text-white dark:group-hover:text-paper">${I[r.icon]}</span><h3 class="mt-5 font-serif text-[1.3rem] font-medium leading-snug text-ink">${esc(r.title)}</h3><p class="mt-2 text-[0.93rem] leading-relaxed text-muted">${r.text}</p><div class="mt-4 flex flex-wrap gap-1.5">${r.tags.map((t) => tag(t)).join('')}</div></article>`).join('')}</div></section><section id="affiliations">${sectionHead('Where I’ve been', 'Affiliations')}<ul class="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">${affiliations.map((a) => {
    const inner = `<span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-[0.68rem] font-semibold tracking-wider text-white" style="background-color:${a.color}">${a.abbr}</span><div class="min-w-0 flex-1"><div class="flex flex-col gap-x-4 sm:flex-row sm:items-baseline sm:justify-between"><h3 class="font-medium text-ink">${esc(a.name)}</h3><span class="shrink-0 font-mono text-xs text-faint">${a.dates}</span></div><p class="mt-0.5 text-[0.93rem] text-ink/80">${a.role}</p>${a.sub ? `<p class="mt-0.5 text-sm text-faint">${a.sub}</p>` : ''}</div>`;
    return `<li>${a.url ? `<a href="${a.url}" target="_blank" rel="noreferrer" class="group flex gap-4 p-5 transition-colors hover:bg-paper sm:items-center sm:gap-5 sm:p-6">${inner}</a>` : `<div class="flex gap-4 p-5 sm:items-center sm:gap-5 sm:p-6">${inner}</div>`}</li>`;
  }).join('')}</ul></section><section id="skills">${sectionHead('Toolbox', 'Technical skills')}<ul class="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">${skills.map(([k, v]) => `<li class="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:gap-8"><span class="shrink-0 font-mono text-[0.68rem] uppercase tracking-wider text-faint sm:w-56 sm:pt-1">${esc(k)}</span><span class="text-[0.93rem] text-ink/90">${v}</span></li>`).join('')}</ul></section><section id="projects">${sectionHead('Things I built', 'Selected projects')}<div class="grid gap-4 sm:grid-cols-2">${projects.map((pr) => `<article class="card group flex flex-col p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/30"><div class="flex items-baseline justify-between gap-3"><h3 class="font-serif text-[1.2rem] font-medium leading-snug text-ink"><a href="${pr.url}" target="_blank" rel="noreferrer" class="transition-colors hover:text-accent">${esc(pr.title)}</a></h3>${pr.date ? `<span class="shrink-0 font-mono text-[0.68rem] text-faint">${pr.date}</span>` : ''}</div><p class="mt-0.5 text-sm text-faint">${esc(pr.sub)}</p><p class="mt-3 flex-1 text-[0.93rem] leading-relaxed text-muted">${esc(pr.text)}</p><div class="mt-4 flex flex-wrap items-center justify-between gap-2"><div class="flex flex-wrap gap-1.5">${pr.tags.map((t) => tag(t)).join('')}</div><a href="${pr.url}" target="_blank" rel="noreferrer" class="chip-link">${I.gh}Code</a></div></article>`).join('')}</div></section></div></div></div>`,
});

// Publications
const counts = { All: pubs.length };
for (const x of pubs) counts[x.type] = (counts[x.type] || 0) + 1;
const types = ['All', ...['Conference', 'Journal', 'Workshop', 'Preprint'].filter((t) => counts[t])];
const authorsHtml = (list) => list.map((a, i) => {
  const [name, self = 0, star = ''] = Array.isArray(a) ? a : [a];
  const sup = star ? `<sup class="ml-px text-accent">${star}</sup>` : '';
  const nm = self ? `<span class="font-semibold text-ink underline decoration-accent/50 decoration-2 underline-offset-[3px]">${name}</span>` : name;
  return `<span>${nm}${sup}${i < list.length - 1 ? ', ' : ''}</span>`;
}).join('');
const pubHtml = (x) => `<article data-type="${x.type}" id="${x.id}" class="grid scroll-mt-24 gap-5 py-8 first:pt-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">${x.fig ? `<a href="__P__assets/figures/${x.fig}" target="_blank" rel="noreferrer" aria-label="Enlarge figure: ${esc(x.title)}" class="group relative block aspect-[12/5] w-full overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-[0_12px_30px_-18px_rgba(23,24,28,0.45)]"><img alt="Figure from ${esc(x.title)}" loading="lazy" decoding="async" class="absolute inset-0 h-full w-full object-contain p-2.5 transition-transform duration-300 group-hover:scale-[1.03]" src="__P__assets/figures/${x.fig}"><span class="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">${I.expand}</span></a>` : `<div aria-hidden="true" class="relative flex aspect-[12/5] w-full items-center justify-center overflow-hidden rounded-xl border border-line bg-surface"><span class="font-serif text-[1.6rem] font-normal text-faint/70">Diagram coming soon</span></div>`}<div class="min-w-0"><div class="flex flex-wrap items-center gap-2"><span class="rounded-md px-2 py-0.5 font-mono text-[0.68rem] font-medium uppercase tracking-wider ${x.color}">${x.venue}</span><span class="font-mono text-[0.68rem] uppercase tracking-wider text-faint">${x.type}</span><span class="rounded-md border px-2 py-0.5 font-mono text-[0.68rem] font-medium uppercase tracking-wider ${x.status === 'Published' ? 'border-emerald-600/30 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400' : x.status === 'Ongoing' ? 'border-accent/20 bg-accent-soft text-accent' : 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300'}">${x.status}</span></div><h3 class="mt-3 font-serif text-[1.28rem] font-medium leading-snug text-ink">${x.links[0] ? `<a href="${x.links[0][1]}" target="_blank" rel="noreferrer" class="transition-colors hover:text-accent">${esc(x.title)}</a>` : esc(x.title)}</h3><p class="mt-2 text-[0.92rem] leading-relaxed text-muted">${authorsHtml(x.authors)}</p><p class="mt-1 text-[0.88rem] italic text-faint">${esc(x.venueFull)}</p>${x.links.length ? `<div class="mt-4 flex flex-wrap gap-2">${x.links.map(([l, u]) => `<a href="${u}" target="_blank" rel="noreferrer" class="chip-link">${I.doc}${l}${I.arrowUR}</a>`).join('')}</div>` : ''}</div></article>`;
page({
  dir: 'publications',
  title: 'Publications',
  section: 'publications/',
  description: 'Publications by ' + me.name + '.',
  body: `<div class="container-page pb-24 pt-12 lg:pt-16">${pageHeader('Research', 'Publications', '<div class="mt-4 text-[1.05rem] leading-relaxed text-muted"><p class="text-[0.95rem] text-faint"><sup class="text-accent">*</sup> denotes equal contribution.</p></div>', `<a href="${me.scholar}" target="_blank" rel="noreferrer" class="btn-secondary">${I.sch}Google Scholar</a>`)}<div class="mt-10"><div><div role="tablist" aria-label="Filter publications" class="flex flex-wrap gap-2">${types.map((t, i) => `<button role="tab" data-filter="${t}" aria-selected="${i === 0}" class="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm transition-colors ${i === 0 ? 'border-ink bg-ink text-paper' : 'border-line bg-surface text-muted hover:border-ink/30 hover:text-ink'}">${t}<span class="font-mono text-[0.7rem] ${i === 0 ? 'text-paper/60' : 'text-faint'}">${counts[t]}</span></button>`).join('')}</div><div class="mt-6">${[...new Set(pubs.map((x) => x.year))].sort((a, b) => b - a).map((y) => `<section data-year class="grid gap-x-10 border-t border-line pt-8 lg:grid-cols-[5.5rem_1fr]"><h2 class="mb-2 font-serif text-[2rem] font-normal leading-none text-faint/70 lg:sticky lg:top-24 lg:self-start">${y}</h2><div class="divide-y divide-line/70">${pubs.filter((x) => x.year === y).map(pubHtml).join('')}</div></section>`).join('')}</div></div></div></div>`,
});

// Experience
const expCard = (e) => `<article class="card p-5 transition-shadow duration-300 hover:shadow-[0_14px_36px_-24px_rgba(23,24,28,0.4)] sm:p-8"><header class="flex gap-4 sm:gap-5"><span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-mono text-[0.62rem] font-semibold tracking-wider text-white" style="background-color:${e.color}">${e.abbr}</span><div class="min-w-0 flex-1"><div class="flex flex-col gap-x-4 gap-y-1 sm:flex-row sm:items-baseline sm:justify-between"><h3 class="flex flex-wrap items-center gap-x-3 gap-y-1 font-serif text-[1.45rem] font-medium leading-snug text-ink">${esc(e.title)}${e.current ? '<span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/10 px-2 py-0.5 font-mono text-[0.62rem] font-medium uppercase tracking-wider text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400"><span class="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600 dark:bg-emerald-400"></span>Current</span>' : ''}</h3><span class="shrink-0 font-mono text-[0.75rem] text-ink/70">${e.range}</span></div><div class="mt-0.5 flex flex-col gap-x-4 sm:flex-row sm:items-baseline sm:justify-between"><a href="${e.orgUrl}" target="_blank" rel="noreferrer" class="link-underline w-fit font-medium text-accent">${esc(e.org)}</a><span class="inline-flex shrink-0 items-center gap-1 text-xs text-faint">${I.pin} ${e.place}</span></div>${e.sub ? `<p class="mt-1 text-sm text-faint">${esc(e.sub)}</p>` : ''}</div></header><div class="sm:pl-[4.25rem]"><ul class="mt-5 space-y-2.5">${e.bullets.map((b) => `<li class="relative pl-5 text-[0.95rem] leading-relaxed text-muted"><span aria-hidden="true" class="absolute left-1 top-[0.68em] h-1.5 w-1.5 rounded-full bg-accent/50"></span>${b}</li>`).join('')}</ul>${e.badges.length ? `<div class="mt-5 flex flex-wrap gap-2">${e.badges.map((b) => `<span class="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-800 dark:text-amber-300">${I.trophy} ${b}</span>`).join('')}</div>` : ''}<div class="mt-5 flex flex-wrap gap-1.5 border-t border-line pt-5">${e.stack.map((t) => tag(t, true)).join('')}</div></div></article>`;
page({
  dir: 'experience',
  title: 'Experience',
  section: 'experience/',
  description: 'Research and industry experience of ' + me.name + '.',
  body: `<div class="container-page pb-24 pt-12 lg:pt-16">${pageHeader('Career', 'Experience', '', `<a href="__P__${me.cv}" target="_blank" rel="noreferrer" class="btn-secondary">${I.docDown}Full CV</a>`)}<section class="mt-12">${sectionHead('Industry', 'Industry collaboration')}<div class="space-y-5">${industry.map(expCard).join('')}</div></section><section class="mt-16">${sectionHead('Research', 'Research experience')}<div class="space-y-5">${researchExp.map(expCard).join('')}</div></section><div class="mt-16 grid gap-14 border-t border-line pt-14 lg:grid-cols-[1fr_1.25fr] lg:gap-16"><section>${sectionHead('Education', 'Education')}<ul class="space-y-3">${[
    ['B.Sc. in Computer Science and Engineering (Level-4)', 'Bangladesh University of Engineering and Technology (BUET) · Advisor: Dr. Atif Hasan Rahman', 'Nov 2022 - Present'],
    ['Higher Secondary Certificate (HSC), GPA 5.00/5.00', 'Notre Dame College, Dhaka', 'Jul 2019 - Dec 2021'],
  ].map(([a, b, c]) => `<li class="card flex items-start justify-between gap-4 p-5"><div><p class="font-medium text-ink">${esc(a)}</p><p class="mt-0.5 text-sm leading-relaxed text-muted">${esc(b)}</p></div><span class="shrink-0 whitespace-nowrap font-mono text-xs text-faint">${c}</span></li>`).join('')}</ul></section><section>${sectionHead('Recognition', 'Honors &amp; awards')}<ul class="divide-y divide-line rounded-2xl border border-line bg-surface">${honors.map(([a, b, c]) => `<li class="flex items-start gap-4 px-5 py-4"><span class="mt-0.5 text-accent">${I.award}</span><div class="min-w-0 flex-1"><p class="font-medium leading-snug text-ink">${esc(a)}</p><p class="mt-0.5 text-sm text-faint">${esc(b)}</p></div><span class="shrink-0 whitespace-nowrap font-mono text-xs text-faint">${c}</span></li>`).join('')}</ul></section></div></div>`,
});

// Blog
const post = { slug: 'hello-world', date: '2026-11-11', dateShort: 'Nov 11, 2026', dateLong: 'November 11, 2026', title: 'Hello, world', blurb: 'A first post, and a note on what I plan to write about here.', mins: 1, tag: 'meta' };
page({
  dir: 'blog',
  title: 'Blog',
  section: 'blog/',
  description: 'Writing by ' + me.name + '.',
  body: `<div class="container-page pb-24 pt-12 lg:pt-16">${pageHeader('Writing', 'Blog')}<div class="mt-10"><div><ul class="border-b border-line"><li class="border-t border-line"><a class="group grid gap-2 py-8 sm:grid-cols-[10rem_1fr_auto] sm:gap-8" href="${post.slug}/"><time datetime="${post.date}" class="pt-1.5 font-mono text-[0.74rem] uppercase tracking-wider text-faint">${post.dateShort}</time><div class="min-w-0"><h2 class="font-serif text-[1.6rem] font-normal leading-snug text-ink transition-colors group-hover:text-accent">${post.title}</h2><p class="mt-2 leading-relaxed text-muted">${post.blurb}</p><p class="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-faint"><span>${post.mins} min read</span><span class="font-mono">#${post.tag}</span></p></div><span class="mt-2 hidden text-faint transition-all group-hover:translate-x-1 group-hover:text-accent sm:block">${I.arrowR}</span></a></li></ul></div></div></div>`,
});
page({
  dir: 'blog/hello-world',
  title: post.title,
  section: 'blog/',
  description: post.blurb,
  body: `<article class="container-page pb-24 pt-10 lg:pt-14"><div class="mx-auto max-w-[44rem]"><a class="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink" href="../">${I.arrowL}All posts</a><header class="rise mt-8 border-b border-line pb-9"><p class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.74rem] uppercase tracking-wider text-faint"><time datetime="${post.date}">${post.dateLong}</time><span aria-hidden="true">·</span><span>${post.mins} min read</span></p><h1 class="mt-4 font-serif text-[2.4rem] font-normal leading-[1.1] tracking-[-0.015em] text-ink sm:text-[3rem]">${post.title}</h1><p class="mt-4 text-lg leading-relaxed text-muted">${post.blurb}</p><div class="mt-5 flex flex-wrap gap-2">${tag('#' + post.tag, true)}</div></header><div class="prose prose-lg mt-10 max-w-none prose-headings:scroll-mt-24 prose-p:leading-[1.8]"><p>Welcome to my blog! This is where I’ll write about things that don’t quite fit in a paper:</p><ul><li><strong>Research notes</strong>: ideas and paper summaries on NeuroAI, graph theory, sign language understanding, and robust vision.</li><li><strong>Things I’m building</strong>: on-device ML, compilers, and the occasional systems project.</li><li><strong>Student life</strong>: reflections from BUET and the research road ahead.</li></ul><p>More soon. Thanks for stopping by!</p></div></div></article>`,
});

// Contact
const contactCard = (icon, label, value, href, copy) => `<div class="card group flex items-center gap-4 p-5 transition-colors hover:border-accent/30"><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">${icon}</span><div class="min-w-0 flex-1"><p class="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-faint">${label}</p><a href="${href}" class="block truncate text-ink transition-colors hover:text-accent">${value}</a></div>${copy ? `<button type="button" data-copy="${value}" aria-label="Copy ${label.toLowerCase()} ${value}" title="Copy" class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors border-line text-faint hover:border-accent/40 hover:text-accent">${I.copy}</button>` : ''}</div>`;
const elsewhere = (href, label, icon) => `<li><a href="${href}" target="_blank" rel="noreferrer" class="flex items-center gap-2.5 whitespace-nowrap rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-muted transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent">${icon}${label}</a></li>`;
page({
  dir: 'contact',
  title: 'Contact',
  section: 'contact/',
  description: 'Get in touch with ' + me.name + '.',
  body: `<div class="container-page pb-24 pt-12 lg:pt-16">${pageHeader('Say hello', 'Get in touch', '<div class="mt-4 text-[1.05rem] leading-relaxed text-muted"><p>I’m always happy to talk about research, potential collaborations, or anything around NeuroAI, graph learning, and on-device ML.</p></div>')}<div class="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14"><div class="space-y-3">${contactCard(I.mail, 'Email', me.email, 'mailto:' + me.email, true)}${contactCard(I.phoneIc, 'Phone', me.phone, 'tel:' + me.phone, true)}<div class="card flex items-center gap-4 p-5"><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">${I.pin}</span><div class="min-w-0"><p class="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-faint">Location</p><p class="text-ink">Department of CSE, BUET</p><p class="text-sm text-muted">Dhaka, Bangladesh</p></div></div><div class="pt-6"><p class="font-mono text-[0.64rem] uppercase tracking-[0.14em] text-faint">Elsewhere</p><ul class="mt-3 flex flex-wrap gap-2">${elsewhere(me.scholar, 'Google Scholar', I.sch)}${elsewhere(me.github, 'GitHub', I.gh)}${elsewhere(me.linkedin, 'LinkedIn', I.li)}</ul></div></div><form data-contact class="card p-6 sm:p-8"><h2 class="font-serif text-[1.5rem] font-medium text-ink">Send a message</h2><p class="mt-1 text-sm text-faint">Opens your email app with the message ready to send.</p><div class="mt-7 grid gap-5 sm:grid-cols-2"><div><label for="user_name" class="mb-2 block font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted">Name</label><input id="user_name" type="text" required autocomplete="name" placeholder="What should I call you?" class="input" name="user_name"></div><div><label for="user_email" class="mb-2 block font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted">Email</label><input id="user_email" type="email" required autocomplete="email" placeholder="you@example.com" class="input" name="user_email"></div></div><div class="mt-5"><label for="message" class="mb-2 block font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-muted">Message</label><textarea id="message" name="message" required rows="6" placeholder="Research questions, collaboration ideas, or just hello." class="input resize-y"></textarea></div><div class="mt-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between"><p aria-live="polite" data-contact-status class="min-h-[1.25rem] text-sm"></p><button type="submit" class="btn-primary px-6 py-3">${I.send}Send message</button></div></form></div></div>`,
});

// 404, robots, sitemap
writeFileSync(join(ROOT, '404.html'), `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Not found · ${me.name}</title><link rel="stylesheet" href="/assets/css/site.css"><script>(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})()</script></head><body class="flex min-h-screen flex-col"><main class="flex flex-1 items-center justify-center"><div class="container-page py-24 text-center"><p class="eyebrow">404</p><h1 class="mt-3 font-serif text-[2.6rem] text-ink">Page not found</h1><p class="mt-3 text-muted">The page you are looking for does not exist.</p><a class="btn-primary mt-8 inline-flex px-6 py-3" href="/">Back home</a></div></main></body></html>\n`);
const urls = ['', 'about/', 'publications/', 'experience/', 'blog/', 'blog/hello-world/', 'contact/'];
writeFileSync(join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE}/${u}</loc></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('built');
