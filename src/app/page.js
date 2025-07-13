'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link'
import { Briefcase, Home, PenSquare, ArrowUp, ExternalLink, FileText, School, ChevronLeft, Mail, CheckCircle, BrainCircuit, Award, User, GraduationCap, Search, X, ChevronDown, Clock, Tag } from 'lucide-react';
import { FaLinkedinIn } from "react-icons/fa6";
import { VscGithubAlt } from "react-icons/vsc";

// --- 3D Data for Real Proteins (used in background) ---
const proteinData = [
  { // Deep Blue
    colors: ['#93c5fd', '#3b82f6', '#1d4ed8'],
    coords: [{ x: 18.6, y: 51.9, z: 29.5 }, { x: 21.9, y: 53.3, z: 30.9 }, { x: 22.8, y: 53.1, z: 34.6 }, { x: 25.4, y: 50.1, z: 35.5 }, { x: 23.7, y: 47.4, z: 37.4 }, { x: 20.1, y: 48.4, z: 38.4 }, { x: 19.3, y: 51.9, z: 37.5 }, { x: 16.9, y: 51.6, z: 40.1 }, { x: 14.9, y: 54.3, z: 38.6 }, { x: 11.3, y: 53.9, z: 39.2 }, { x: 10.2, y: 50.4, z: 38.2 }, { x: 13.1, y: 48.3, z: 37.3 }, { x: 15.9, y: 49.7, z: 35.2 }, { x: 18.1, y: 46.6, z: 34.8 }, { x: 15.5, y: 44.6, z: 33.3 }, { x: 16.4, y: 44.3, z: 29.6 }, { x: 18.8, y: 41.8, z: 29.1 }, { x: 21.7, y: 43.6, z: 27.7 }, { x: 24.2, y: 41.1, z: 27.2 }, { x: 23.1, y: 38.2, z: 29.1 }]
  },
  { // Slate Gray
    colors: ['#cbd5e1', '#94a3b8', '#64748b'],
    coords: [{ x: 4.3, y: -1.3, z: 1.3 }, { x: 7.4, y: -2.4, z: 0.2 }, { x: 9.2, y: 0.5, z: -0.1 }, { x: 12.1, y: -0.3, z: -1.7 }, { x: 14.8, y: 1.2, z: 0.2 }, { x: 17.4, y: 0.4, z: 2.2 }, { x: 18.5, y: 3.6, z: 2.0 }, { x: 19.0, y: 2.1, z: -0.9 }, { x: 21.2, y: 3.9, z: -2.6 }, { x: 20.1, y: 7.3, z: -2.2 }, { x: 22.8, y: 8.5, z: -0.5 }, { x: 25.5, y: 6.8, z: 0.9 }, { x: 27.4, y: 9.9, z: 1.4 }, { x: 29.2, y: 8.6, z: 4.1 }, { x: 31.9, y: 9.2, z: 2.2 }, { x: 33.1, y: 6.2, z: 1.1 }, { x: 35.4, y: 6.3, z: -1.2 }, { x: 38.5, y: 7.1, z: -0.1 }, { x: 41.0, y: 5.2, z: -1.6 }, { x: 43.8, y: 6.4, z: 0.2 }]
  },
];

// --- Animated Background Component ---
const AnimatedBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let animationFrameId;
    const setCanvasDimensions = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    setCanvasDimensions();
    let proteins = [];
    const proteinCount = Math.floor(canvas.width / 40);
    class Protein {
      constructor() {
        const speed = 1
        const spin_speed = 0.05
        this.x = Math.random() * canvas.width; this.y = Math.random() * canvas.height;
        this.speedX = Math.random() * speed - speed / 2; this.speedY = Math.random() * speed - speed / 2;
        this.angleX = Math.random() * Math.PI * 2; this.angleY = Math.random() * Math.PI * 2; this.angleZ = Math.random() * Math.PI * 2;
        this.spinX = (Math.random() - 0.5) * spin_speed; this.spinY = (Math.random() - 0.5) * spin_speed; this.spinZ = (Math.random() - 0.5) * spin_speed;
        const model = proteinData[Math.floor(Math.random() * proteinData.length)]; this.colors = model.colors;
        let minX = Infinity, minY = Infinity, minZ = Infinity; let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
        for (const p of model.coords) { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); minZ = Math.min(minZ, p.z); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); maxZ = Math.max(maxZ, p.z); }
        const centerX = (minX + maxX) / 2; const centerY = (minY + maxY) / 2; const centerZ = (minZ + maxZ) / 2;
        const maxDim = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
        this.scale = (Math.random() * 25 + 20) / maxDim;
        this.baseCoords = model.coords.map(p => ({ x: (p.x - centerX), y: (p.y - centerY), z: (p.z - centerZ) }));
      }
      update() {
        if (this.x < -60 || this.x > canvas.width + 60) this.speedX *= -1; if (this.y < -60 || this.y > canvas.height + 60) this.speedY *= -1;
        this.x += this.speedX; this.y += this.speedY; this.angleX += this.spinX; this.angleY += this.spinY; this.angleZ += this.spinZ;
      }
      draw() {
        const rotatedCoords = this.baseCoords.map(p => {
          let d = Math.sqrt(p.x * p.x + p.z * p.z); let a = Math.atan2(p.z, p.x) + this.angleY; let x1 = d * Math.cos(a); let z1 = d * Math.sin(a);
          d = Math.sqrt(p.y * p.y + z1 * z1); a = Math.atan2(z1, p.y) + this.angleX; let y2 = d * Math.cos(a); let z2 = d * Math.sin(a);
          d = Math.sqrt(x1 * x1 + y2 * y2); a = Math.atan2(y2, x1) + this.angleZ; let x3 = d * Math.cos(a); let y3 = d * Math.sin(a);
          return { x: x3, y: y3, z: z2 };
        });
        rotatedCoords.sort((a, b) => a.z - b.z); ctx.save(); ctx.translate(this.x, this.y);
        rotatedCoords.forEach(p => {
          const perspective = 300 / (300 - p.z * this.scale); const projX = p.x * this.scale * perspective; const projY = p.y * this.scale * perspective; const radius = 4 * this.scale * perspective;
          ctx.beginPath(); ctx.arc(projX, projY, Math.max(0, radius), 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(projX - radius * 0.3, projY - radius * 0.3, 0, projX, projY, radius);
          gradient.addColorStop(0, this.colors[0]); gradient.addColorStop(0.8, this.colors[1]); gradient.addColorStop(1, this.colors[2]);
          ctx.fillStyle = gradient; ctx.fill();
        });
        ctx.restore();
      }
    }
    function init() { proteins = []; for (let i = 0; i < proteinCount; i++) { proteins.push(new Protein()); } }
    function animate() { ctx.clearRect(0, 0, canvas.width, canvas.height); proteins.forEach(p => { p.update(); p.draw(); }); animationFrameId = requestAnimationFrame(animate); }
    const handleResize = () => { setCanvasDimensions(); init(); };
    init(); animate(); window.addEventListener('resize', handleResize);
    return () => { window.removeEventListener('resize', handleResize); cancelAnimationFrame(animationFrameId); };
  }, []);
  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
};

// --- Project Data ---
const showcaseProjects = [
  {
    title: "Protein Folding Simulation Toolkit",
    description: "A Python-based toolkit for running and analyzing molecular dynamics simulations of protein folding, featuring a streamlined pipeline for GROMACS and a web-based visualization dashboard built with React.",
    achievements: [
      "Engineered a data processing pipeline that reduced analysis time by 40%.",
      "Developed an interactive 3D protein viewer using React and Three.js.",
      "Implemented a REST API with FastAPI to serve simulation results to the frontend.",
    ],
    tags: ["Python", "React", "GROMACS", "MDAnalysis", "Data Viz", "FastAPI", "Three.js"],
    imageUrl: "protein.jpeg",
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Deep Learning for Ligand Binding Affinity",
    description: "Published research on a novel graph neural network architecture that predicts small molecule binding affinity with state-of-the-art accuracy, outperforming traditional docking methods.",
    achievements: [
      "Achieved a 15% improvement in prediction accuracy over existing baseline models.",
      "Co-authored a paper published in the Journal of Chemical Information and Modeling.",
      "Designed and trained a Graph Convolutional Network on a dataset of over 100,000 protein-ligand complexes.",
    ],
    tags: ["PyTorch", "GNN", "Drug Discovery", "Publication", "Machine Learning", "Pandas"],
    videoUrl: "https://www.youtube.com/embed/qhyIGt9wrD8?si=7RmUwTERdALLdX6R",
    paperUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Interactive Cell Signaling Pathway Explorer",
    description: "A web application that allows users to explore complex cell signaling pathways interactively. Built with D3.js for data visualization and integrated with pathway databases like KEGG.",
    achievements: [
      "Visualized complex biological networks using force-directed graphs in D3.js.",
      "Integrated real-time data from the KEGG API to ensure pathway information is up-to-date.",
      "Created a user-friendly interface that received positive feedback for its intuitive design.",
    ],
    tags: ["JavaScript", "D3.js", "API Integration", "Bioinformatics", "UI/UX Design"],
    imageUrl: "protein_app.jpeg",
    liveUrl: "#",
  }
];

// --- Article Data ---
const allArticles = [
  { slug: "statistical-mechanics-of-folding", title: "On the Statistical Mechanics of Protein Folding Models", summary: "A review of first-principle and data-driven models in predicting protein conformation, examining their underlying physical assumptions.", date: "2025-07-10", readTime: "15 min read", tags: ["Biophysics", "Methods"], content: "Full article content...", thumbnailUrl: "protein.jpeg" },
  { slug: "data-driven-binding-affinity", title: "Data-Driven Approaches for Small Molecule Binding Affinity", summary: "An analysis of recent machine learning architectures for predicting ligand-protein interactions and their implications for therapeutic design.", date: "2025-06-21", readTime: "11 min read", tags: ["Machine Learning", "Methods"], content: "Full article content...", thumbnailUrl: "protein_app.jpeg" },
  { slug: "emergence-in-biology", title: "Emergence and Complexity in Biological Systems", summary: "A perspective on the challenges and opportunities in deriving macroscopic biological phenomena from fundamental physical laws.", date: "2025-05-05", readTime: "9 min read", tags: ["Biophysics", "Philosophy"], content: "Full article content...", thumbnailUrl: "proteome.jpeg" },
  { slug: "alphafold-impact", title: "The Impact of AlphaFold on Structural Biology", summary: "Exploring how deep learning models like AlphaFold are revolutionizing the field of protein structure prediction.", date: "2025-03-15", readTime: "12 min read", tags: ["Machine Learning", "Biophysics"], content: "Full article content...", thumbnailUrl: "hpc.jpeg" },
  { slug: "python-for-hpc", title: "Optimizing Python for High-Performance Computing", summary: "Techniques and libraries for scaling Python code on large compute clusters, including Dask and Numba.", date: "2025-01-20", readTime: "18 min read", tags: ["Methods", "Python"], content: "Full article content...", thumbnailUrl: "protein.jpeg" },
  { slug: "future-of-drug-discovery", title: "Generative Models in Drug Discovery", summary: "A look at how generative AI is being used to design novel molecules with desired therapeutic properties.", date: "2024-11-30", readTime: "10 min read", tags: ["Machine Learning", "Drug Discovery"], content: "Full article content...", thumbnailUrl: "protein_app.jpeg" },
  { slug: "quantum-biology", title: "An Introduction to Quantum Biology", summary: "Exploring the non-trivial quantum effects that may play a role in biological processes like photosynthesis and enzyme catalysis.", date: "2024-09-01", readTime: "14 min read", tags: ["Biophysics", "Philosophy"], content: "Full article content...", thumbnailUrl: "proteome.jpeg" },
];


// --- Main App Component ---
export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [viewingDocument, setViewingDocument] = useState(null);

  const homeRef = useRef(null);
  const showcaseRef = useRef(null);
  const blogRef = useRef(null);
  const connectRef = useRef(null);

  const scrollTo = (id) => {
    setViewingDocument(null);
    let element;
    if (id === 'home') element = homeRef.current;
    if (id === 'showcase') element = showcaseRef.current;
    if (id === 'blog') element = blogRef.current;
    if (id === 'connect') element = connectRef.current;

    if (element) {
      window.scrollTo({
        top: element.offsetTop - 70,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const sectionRefs = [
      { id: 'home', ref: homeRef },
      { id: 'showcase', ref: showcaseRef },
      { id: 'blog', ref: blogRef },
      { id: 'connect', ref: connectRef },
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 75;

      const currentSection = sectionRefs.findLast(
        ({ ref }) => ref.current && ref.current.offsetTop <= scrollPosition
      );

      if (currentSection) {
        setActiveSection(currentSection.id);
      }

      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (viewingDocument) {
    return <DocumentViewer docType={viewingDocument} onBack={() => setViewingDocument(null)} />;
  }

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); body { font-family: 'Inter', sans-serif; }`}</style>
      <div className="bg-slate-50 text-slate-700 antialiased">
        <Header scrollTo={scrollTo} activeSection={activeSection} setViewingDocument={setViewingDocument} />
        <main>
          <div ref={homeRef} id="home"><HomeSection /></div>
          <div><EducationSection /></div>
          <SkillsCloudSection />
          <div ref={showcaseRef} id="showcase"><ShowcaseSection /></div>
          <div ref={blogRef} id="blog"><WritingsSection articles={allArticles} /></div>
        </main>
        <div ref={connectRef}><Footer /></div>
        <button onClick={() => scrollTo('home')} className={`fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform ${showScrollTop ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`} aria-label="Scroll to top"><ArrowUp size={24} /></button>
      </div>
    </>
  );
}

const Header = ({ scrollTo, activeSection, setViewingDocument }) => {
  const scrollNavItems = [
    { id: 'home', title: 'Home' },
    { id: 'showcase', title: 'Showcase' },
    { id: 'blog', title: 'Blog' },
  ];

  const docNavItems = [
    { id: 'resume', title: 'Resume' },
    { id: 'cv', title: 'CV' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 border-b border-slate-200">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button onClick={() => scrollTo('home')} className="text-2xl font-bold tracking-tight text-slate-900">Andre Fortes</button>
        <ul className="hidden md:flex items-center space-x-6">
          {scrollNavItems.map((item) => (<li key={item.id}> <button onClick={() => scrollTo(item.id)} className={`text-lg font-medium transition-colors duration-300 ${activeSection === item.id ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>{item.title}</button> </li>))}
          <li className="h-6 border-l border-slate-300"></li>
          {docNavItems.map((item) => (<li key={item.id}> <button onClick={() => setViewingDocument(item.id)} className="text-lg font-medium text-slate-600 hover:text-blue-600 transition-colors duration-300">{item.title}</button> </li>))}
          <li> <button onClick={() => scrollTo('connect')} className={`ml-4 font-semibold py-2 px-5 rounded-lg transition-colors ${activeSection === 'connect' ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>Contact</button> </li>
        </ul>
        <div className="md:hidden flex items-center space-x-4">
          {/* Mobile nav could be implemented with a dropdown menu */}
        </div>
      </nav>
    </header>
  );
}


// --- Section Components ---

const HomeSection = () => (
  <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden bg-slate-900">
    <AnimatedBackground />
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[4px] z-10"></div>
    <div className="relative z-20 container mx-auto px-6">
      <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">Simulating <span className="text-blue-400">Biological Systems</span></h2>
      <p className="mt-6 text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">A computational approach to understanding the physics of life, from protein dynamics to molecular interactions.</p>
      <div className="mt-10"><button onClick={() => document.getElementById('showcase')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="bg-white text-slate-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-slate-200 transition-all duration-300 transform hover:scale-105 shadow-lg">View My Work</button></div>
    </div>
  </section>
);

const EducationSection = () => {

  return (
    <section className="py-20 md:py-24 bg-white border-slate-100">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 inline-flex items-center gap-4">
          Education
        </h2>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">My academic background and research experience.</p>
      </div>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8 max-w-4xl mx-auto">
          {/* JHU */}
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-full max-w-[300px] h-20 flex items-center justify-center p-2">
              <svg className="fill-[#002d72] max-w-full max-h-full" role="img" aria-label="Johns Hopkins University Logo" viewBox="0 0 260.704 49.406">
                <path d="M91.861 39.828a10.32 10.32 0 0 0-.269-2.945.88.88 0 0 0-.713-.3l-.355-.028a.259.259 0 0 1 .026-.342c.543.029 1.068.042 1.624.042.6 0 .981-.014 1.494-.042a.248.248 0 0 1 .03.342l-.343.028a.831.831 0 0 0-.711.343 12.81 12.81 0 0 0-.2 2.9v1.61a4.943 4.943 0 0 1-1 3.4 3.75 3.75 0 0 1-2.72 1.042 4.049 4.049 0 0 1-2.66-.783c-.753-.626-1.111-1.664-1.111-3.358v-3.36c0-1.48-.029-1.723-.854-1.794l-.354-.028c-.086-.057-.059-.3.026-.342.711.029 1.2.042 1.765.042s1.054-.014 1.749-.042c.086.042.115.285.03.342l-.341.028c-.826.071-.854.314-.854 1.794v3.075c0 2.29.711 3.8 2.888 3.8 2.064 0 2.847-1.619 2.847-3.784Z"></path>
                <path d="M110.459 43.231c0 .426 0 2.12.042 2.49a.254.254 0 0 1-.269.157c-.171-.242-.583-.741-1.821-2.149l-3.3-3.758c-.386-.442-1.353-1.608-1.651-1.923h-.029a3.646 3.646 0 0 0-.072.925v3.1a11.13 11.13 0 0 0 .258 2.948c.085.156.37.241.727.269l.44.045a.259.259 0 0 1-.03.355 36.81 36.81 0 0 0-1.664-.044c-.6 0-.982.016-1.48.044a.26.26 0 0 1-.029-.355l.384-.045c.33-.042.556-.127.627-.285a13.684 13.684 0 0 0 .185-2.932v-4.109a1.308 1.308 0 0 0-.312-1.026 1.554 1.554 0 0 0-.883-.34l-.24-.03a.25.25 0 0 1 .026-.356c.6.042 1.353.042 1.608.042a4.569 4.569 0 0 0 .656-.042 19.576 19.576 0 0 0 2.434 3.131l1.379 1.553c.983 1.094 1.68 1.893 2.351 2.577h.026a1.411 1.411 0 0 0 .059-.6v-3.045a10.057 10.057 0 0 0-.288-2.946c-.085-.131-.314-.216-.883-.285l-.242-.03c-.1-.085-.086-.314.029-.356.655.029 1.139.042 1.68.042.61 0 .982-.014 1.464-.042a.25.25 0 0 1 .03.356l-.2.03c-.456.069-.741.184-.8.3a11.525 11.525 0 0 0-.215 2.932Z"></path>
                <path d="M121.06 38.42c0-1.509-.029-1.751-.868-1.821l-.356-.029c-.086-.059-.056-.315.029-.357.711.03 1.2.042 1.794.042.568 0 1.052-.013 1.764-.042.085.042.114.3.029.357l-.355.029c-.841.07-.869.312-.869 1.821v5.067c0 1.508.029 1.707.869 1.805l.355.045c.085.056.056.312-.029.355-.712-.026-1.2-.042-1.764-.042-.6 0-1.083.016-1.794.042a.275.275 0 0 1-.029-.355l.356-.045c.84-.1.868-.3.868-1.805Z"></path>
                <path d="M132.587 37.764c-.327-.8-.541-1.1-1.153-1.167l-.258-.029a.241.241 0 0 1 .03-.357c.412.03.868.044 1.48.044s1.123-.014 1.723-.044a.252.252 0 0 1 .029.357l-.215.029c-.541.07-.653.155-.668.27a17.4 17.4 0 0 0 .711 1.994c.655 1.652 1.31 3.286 2.024 4.91.439-.939 1.038-2.4 1.366-3.159.411-.967 1.082-2.576 1.323-3.188a1.493 1.493 0 0 0 .129-.556c0-.1-.144-.214-.642-.27l-.255-.029a.248.248 0 0 1 .029-.357c.4.03.939.044 1.478.044.471 0 .913-.014 1.382-.044a.286.286 0 0 1 .03.357l-.427.029a.912.912 0 0 0-.742.5 34.7 34.7 0 0 0-1.593 3.273l-.769 1.749c-.57 1.313-1.238 2.961-1.48 3.716a.289.289 0 0 1-.154.042.6.6 0 0 1-.216-.042 16.663 16.663 0 0 0-.655-1.893Z"></path>
                <path d="M149.72 38.393c0-1.483-.029-1.7-.868-1.794l-.229-.03c-.085-.059-.056-.314.029-.356.613.029 1.1.042 1.68.042h2.676a19.158 19.158 0 0 0 1.92-.042 16.157 16.157 0 0 1 .229 1.895.28.28 0 0 1-.356.026c-.214-.668-.341-1.166-1.082-1.352a6.689 6.689 0 0 0-1.382-.086h-1.024c-.424 0-.424.03-.424.571v2.846c0 .4.042.4.466.4h.828a5.292 5.292 0 0 0 1.208-.086c.173-.057.272-.144.343-.5l.115-.583a.28.28 0 0 1 .368.014c0 .343-.059.9-.059 1.44 0 .511.059 1.054.059 1.363a.277.277 0 0 1-.368.016l-.131-.554a.6.6 0 0 0-.439-.541 4.665 4.665 0 0 0-1.1-.072h-.828c-.424 0-.466.014-.466.386v2.005c0 .755.042 1.238.266 1.478.172.171.471.328 1.725.328a4.152 4.152 0 0 0 1.821-.214 3.56 3.56 0 0 0 1.009-1.379.258.258 0 0 1 .356.1 12.187 12.187 0 0 1-.641 1.975 187.565 187.565 0 0 0-3.814-.042h-1.281c-.612 0-1.1.016-1.937.042a.273.273 0 0 1-.028-.354l.469-.045c.813-.07.884-.285.884-1.777Z"></path>
                <path d="M165.143 38.406c0-1.353-.042-1.6-.625-1.668l-.456-.057a.239.239 0 0 1 .016-.357c.794-.072 1.779-.115 3.171-.115a5.042 5.042 0 0 1 2.378.428 2.122 2.122 0 0 1 1.18 1.995 2.631 2.631 0 0 1-1.777 2.375c-.071.085 0 .229.07.343a15.243 15.243 0 0 0 2.862 3.784 1.706 1.706 0 0 0 .982.4.119.119 0 0 1 .014.2 2.211 2.211 0 0 1-.626.072c-1.211 0-1.937-.357-2.945-1.793-.372-.527-.956-1.509-1.4-2.149a1.015 1.015 0 0 0-1.01-.455c-.641 0-.668.013-.668.314v1.793c0 1.492.028 1.664.854 1.777l.3.045a.277.277 0 0 1-.026.354 39.424 39.424 0 0 0-1.694-.042c-.6 0-1.113.016-1.779.042a.273.273 0 0 1-.029-.354l.354-.045c.826-.1.854-.285.854-1.777Zm1.169 2.034a1.137 1.137 0 0 0 .043.471c.042.042.256.07.981.07a2.374 2.374 0 0 0 1.467-.371 2.038 2.038 0 0 0 .711-1.763 2.1 2.1 0 0 0-2.279-2.194c-.88 0-.922.056-.922.456Z"></path>
                <path d="M182.344 45.878a4.45 4.45 0 0 1-2.221-.527 6.642 6.642 0 0 1-.386-1.993c.072-.1.286-.129.343-.042a2.588 2.588 0 0 0 2.447 2.119 1.617 1.617 0 0 0 1.781-1.635 2.136 2.136 0 0 0-1.169-1.991l-1.349-.883a3.036 3.036 0 0 1-1.539-2.447c0-1.353 1.054-2.45 2.9-2.45a5.568 5.568 0 0 1 1.325.184 1.824 1.824 0 0 0 .5.085 6.268 6.268 0 0 1 .261 1.739c-.056.085-.285.127-.355.042a1.862 1.862 0 0 0-1.935-1.61 1.493 1.493 0 0 0-1.694 1.581 2.232 2.232 0 0 0 1.209 1.749l1.139.713a3.2 3.2 0 0 1 1.779 2.732c0 1.565-1.181 2.633-3.033 2.633"></path>
                <path d="M195.052 38.42c0-1.509-.028-1.751-.868-1.821l-.356-.029c-.086-.059-.056-.315.029-.357.713.03 1.2.042 1.794.042.57 0 1.052-.013 1.766-.042.085.042.114.3.026.357l-.357.029c-.836.07-.866.312-.866 1.821v5.067c0 1.508.03 1.707.866 1.805l.357.045c.087.056.059.312-.026.355-.714-.026-1.2-.042-1.766-.042-.6 0-1.081.016-1.794.042a.275.275 0 0 1-.029-.355l.356-.045c.841-.1.868-.3.868-1.805Z"></path>
                <path d="M210.855 43.516c0 1.492.026 1.707.85 1.777l.458.045c.085.056.055.311-.03.355-.812-.028-1.294-.044-1.864-.044s-1.067.016-1.98.044a.248.248 0 0 1 0-.355l.513-.045c.812-.07.883-.285.883-1.777v-6.364c0-.442 0-.455-.428-.455h-.782a2.917 2.917 0 0 0-1.75.356 2.6 2.6 0 0 0-.641.983.279.279 0 0 1-.371-.1 14.749 14.749 0 0 0 .541-2.122.363.363 0 0 1 .271 0c.086.455.557.44 1.212.44h5.765c.767 0 .895-.028 1.108-.4.071-.026.229-.014.255.042a8.59 8.59 0 0 0-.213 2.165c-.056.113-.3.113-.371.026a1.834 1.834 0 0 0-.354-1.038 2.84 2.84 0 0 0-1.654-.356h-1.01c-.426 0-.41.013-.41.484Z"></path>
                <path d="M227.075 43.487c0 1.521.085 1.749.854 1.805l.543.045a.277.277 0 0 1-.03.355 58.187 58.187 0 0 0-1.937-.042c-.6 0-1.108.015-1.864.042a.276.276 0 0 1-.03-.355l.444-.045c.823-.085.85-.285.85-1.805v-.727a2.872 2.872 0 0 0-.452-1.763l-1.68-3.275c-.485-.939-.7-1.011-1.124-1.081l-.4-.071a.264.264 0 0 1 .029-.357c.454.029.967.042 1.652.042.655 0 1.166-.014 1.523-.042.127.042.127.271.043.357l-.184.029c-.5.07-.6.141-.6.256a7.159 7.159 0 0 0 .442 1.1c.525 1.052 1.052 2.175 1.609 3.161.439-.757.91-1.581 1.337-2.407a12.915 12.915 0 0 0 .923-1.88c0-.085-.255-.184-.6-.226l-.256-.029a.239.239 0 0 1 .029-.357 22.046 22.046 0 0 0 2.689 0 .24.24 0 0 1 .03.357l-.4.071c-.741.127-1.169 1.026-1.88 2.25l-.895 1.55a3.274 3.274 0 0 0-.671 2.3Z"></path>
                <path d="M24.118 49.407a36.482 36.482 0 0 0 4.278-2.8V32.213l-4.278-2.846Z"></path>
                <path d="m24.118 19.401 4.278 2.848v-7.273q-2.136-.1-4.278-.116Z"></path>
                <path d="M36.959 15.733a105.155 105.155 0 0 0-4.28-.456v9.821l4.28 2.849Z"></path>
                <path d="M32.679 35.062v7.828a43.411 43.411 0 0 0 4.28-4.968v-.013Z"></path>
                <path d="m36.959 37.922.006-.011h-.006Z"></path>
                <path d="M41.231 16.377v14.416l.013.007a49.2 49.2 0 0 0 4.22-13.623l-.146-.029a110.63 110.63 0 0 0-4.086-.771"></path>
                <path d="M28.402 22.253v9.963l4.278 2.846v-9.963Z"></path>
                <path d="M36.959 27.947v9.966h.006a44.284 44.284 0 0 0 4.269-7.088v-.029Z"></path>
                <path d="M41.231 30.823a.114.114 0 0 0 .013-.023l-.013-.006Z"></path>
                <path d="M14.734 32.864a6.732 6.732 0 0 0 3.224-2.005 13.077 13.077 0 0 0-1.64-.475 10.338 10.338 0 0 1-1.584 2.481"></path>
                <path d="M7.945 30.861a6.723 6.723 0 0 0 3.228 2.005 10.411 10.411 0 0 1-1.586-2.485 13.269 13.269 0 0 0-1.642.48"></path>
                <path d="M12.331 20.483a9.525 9.525 0 0 0-1.463 2.141c.458.061.945.1 1.463.122Z"></path>
                <path d="M16.749 29.216a14.147 14.147 0 0 1 1.966.61 6.653 6.653 0 0 0 .926-2.817h-2.5a9.657 9.657 0 0 1-.4 2.207"></path>
                <path d="M11.173 19.919a6.725 6.725 0 0 0-3.228 2.006 13.4 13.4 0 0 0 1.641.477 10.381 10.381 0 0 1 1.587-2.483"></path>
                <path d="M17.958 21.925a6.716 6.716 0 0 0-3.224-2 10.373 10.373 0 0 1 1.585 2.481 13.38 13.38 0 0 0 1.639-.477"></path>
                <path d="M17.145 25.775h2.5a6.637 6.637 0 0 0-.926-2.817 14.267 14.267 0 0 1-1.966.609 9.668 9.668 0 0 1 .4 2.209"></path>
                <path d="M13.567 32.308a9.519 9.519 0 0 0 1.471-2.147c-.461-.061-.952-.1-1.471-.124Z"></path>
                <path d="M12.331 27.009H9.992a8.325 8.325 0 0 0 .39 1.972 16.812 16.812 0 0 1 1.944-.178Z"></path>
                <path d="M13.567 28.804a16.739 16.739 0 0 1 1.952.177 8.3 8.3 0 0 0 .389-1.971h-2.341Z"></path>
                <path d="M15.044 22.623a9.316 9.316 0 0 0-1.477-2.153v2.276c.523-.017 1.016-.06 1.477-.121"></path>
                <path d="M15.909 25.777a8.314 8.314 0 0 0-.387-1.973 17.275 17.275 0 0 1-1.955.179v1.794Z"></path>
                <path d="M10.868 30.161a9.688 9.688 0 0 0 1.463 2.14v-2.263q-.777.033-1.463.123"></path>
                <path d="M9.156 23.568a14.42 14.42 0 0 1-1.972-.609 6.714 6.714 0 0 0-.923 2.817h2.5a9.668 9.668 0 0 1 .4-2.209"></path>
                <path d="M12.331 23.977a16.812 16.812 0 0 1-1.944-.178 8.3 8.3 0 0 0-.395 1.978h2.335Z"></path>
                <path d="M8.76 27.009h-2.5a6.7 6.7 0 0 0 .923 2.817 14.545 14.545 0 0 1 1.972-.612 9.614 9.614 0 0 1-.4-2.205"></path>
                <path d="M.76 17.185c3.138 19.411 15.293 28.884 21.346 32.221V14.86A107.686 107.686 0 0 0 .908 17.152Zm12.189 1.252a7.955 7.955 0 1 1-7.951 7.955 7.965 7.965 0 0 1 7.954-7.955"></path>
                <path d="m45.305 2.345-.016-.008a106.323 106.323 0 0 0-44.378.008l-.031.008A1.16 1.16 0 0 0 0 3.48v4.013a61.564 61.564 0 0 0 .45 7.482 110.216 110.216 0 0 1 45.329-.007 62.135 62.135 0 0 0 .446-7.475V3.48a1.157 1.157 0 0 0-.921-1.135m-5 9.932A96.723 96.723 0 0 0 23.115 10.9a96.693 96.693 0 0 0-17.19 1.38.251.251 0 0 1-.28-.372L9.3 3.824c.037-.075 2.4-1.245 2.4-1.245a23.777 23.777 0 0 1 11.407.921h.013a23.773 23.773 0 0 1 11.4-.916s2.364 1.17 2.4 1.245l3.658 8.081a.249.249 0 0 1-.277.372"></path>
                <path d="m33.573 3.966 1.539 4.121a22.261 22.261 0 0 0-10.943 1.168v.386c4.145-.156 9.386-.387 13.624.524l-2.309-5.312Z"></path>
                <path d="m11.067 8.087 1.539-4.121-1.91.888-2.312 5.311c4.236-.912 9.478-.681 13.622-.524v-.385a22.245 22.245 0 0 0-10.939-1.169"></path>
                <path d="M59.89 10.71c0-3.628-.325-4.02-2.254-4.184l-.815-.064c-.2-.131-.131-.719.065-.817 1.894.064 3 .1 4.377.1 1.308 0 2.419-.033 3.725-.1.2.1.263.686.067.817l-.49.064c-1.927.263-1.993.718-1.993 4.184v12.12a18.192 18.192 0 0 1-.751 6.336 7.1 7.1 0 0 1-6.443 4.709c-.39 0-1.4-.033-1.4-.687 0-.556.488-1.5 1.175-1.5a3.99 3.99 0 0 1 1.21.2 5.056 5.056 0 0 0 1.371.229 1.4 1.4 0 0 0 1.308-.85c.751-1.537.848-6.436.848-8.2Z"></path>
                <path d="M64.985 18.403a9.529 9.529 0 0 1 9.816-9.73c6.367 0 9.565 4.6 9.565 9.454a9.409 9.409 0 0 1-9.565 9.619c-6.119 0-9.813-4.381-9.813-9.343m16.621.579c0-4.547-2.012-9.454-7.277-9.454-2.867 0-6.587 1.958-6.587 7.995 0 4.077 1.983 9.372 7.415 9.372 3.308 0 6.449-2.481 6.449-7.912"></path>
                <path d="M90.624 18.404c-1.322 0-1.378.056-1.378.884v3.88c0 2.894.138 3.28 1.68 3.445l.8.084c.165.109.11.605-.055.688a87.801 87.801 0 0 0-3.5-.083c-1.184 0-2.122.056-3.2.083a.535.535 0 0 1-.054-.688l.469-.084c1.542-.276 1.6-.551 1.6-3.445v-9.919c0-2.894-.193-3.362-1.626-3.473l-.717-.055c-.167-.11-.11-.606.054-.689 1.351.026 2.289.083 3.473.083 1.076 0 2.013-.026 3.2-.083.167.083.223.579.055.689l-.524.055c-1.6.165-1.653.579-1.653 3.473v3.171c0 .853.056.882 1.378.882h7.883c1.323 0 1.377-.029 1.377-.882v-3.171c0-2.894-.054-3.308-1.68-3.473l-.524-.055c-.165-.11-.11-.606.055-.689 1.268.056 2.2.083 3.334.083 1.076 0 2.013-.026 3.254-.083.164.083.221.579.055.689l-.579.055c-1.6.165-1.654.579-1.654 3.473v9.919c0 2.894.055 3.252 1.654 3.445l.662.084c.164.109.11.605-.056.688a74.179 74.179 0 0 0-3.335-.083c-1.13 0-2.121.026-3.334.083a.534.534 0 0 1-.055-.688l.524-.084c1.68-.276 1.68-.551 1.68-3.445v-3.88c0-.828-.054-.884-1.377-.884Z"></path>
                <path d="M123.287 22.621c0 .828 0 4.107.083 4.822a.5.5 0 0 1-.524.3c-.332-.466-1.13-1.431-3.527-4.161l-6.395-7.277c-.747-.854-2.619-3.115-3.2-3.719h-.055a6.978 6.978 0 0 0-.138 1.789v6.01c0 1.294.028 4.879.5 5.7.168.305.717.47 1.407.525l.852.084a.5.5 0 0 1-.053.688 70.196 70.196 0 0 0-3.225-.083c-1.158 0-1.9.028-2.868.083a.51.51 0 0 1-.055-.688l.744-.084c.635-.083 1.075-.248 1.213-.551.385-.991.359-4.354.359-5.677v-7.959a2.517 2.517 0 0 0-.608-1.985 2.984 2.984 0 0 0-1.709-.663l-.469-.054a.486.486 0 0 1 .055-.69c1.158.083 2.62.083 3.116.083a8.694 8.694 0 0 0 1.266-.083c.554 1.407 3.806 5.045 4.716 6.065l2.671 3c1.9 2.122 3.252 3.666 4.549 4.989h.055a2.75 2.75 0 0 0 .111-1.158v-5.9c0-1.3-.03-4.878-.552-5.706-.164-.248-.608-.413-1.709-.551l-.467-.054c-.193-.165-.168-.608.053-.69 1.27.056 2.206.083 3.254.083 1.185 0 1.9-.026 2.838-.083a.485.485 0 0 1 .056.69l-.386.054c-.882.138-1.434.359-1.545.579-.467.992-.412 4.41-.412 5.678Z"></path>
                <path d="M130.572 27.746a8.611 8.611 0 0 1-4.3-1.019 12.8 12.8 0 0 1-.745-3.858c.14-.2.552-.249.663-.083.413 1.4 1.542 4.107 4.741 4.107a3.132 3.132 0 0 0 3.447-3.17 4.142 4.142 0 0 0-2.261-3.86l-2.619-1.71a5.879 5.879 0 0 1-2.976-4.74c0-2.619 2.039-4.74 5.622-4.74a10.723 10.723 0 0 1 2.565.357 3.6 3.6 0 0 0 .962.167 12.044 12.044 0 0 1 .5 3.362c-.11.167-.551.248-.69.084-.357-1.324-1.1-3.116-3.747-3.116-2.7 0-3.28 1.792-3.28 3.062 0 1.6 1.324 2.754 2.343 3.389l2.205 1.377c1.738 1.075 3.445 2.674 3.445 5.292 0 3.032-2.288 5.1-5.871 5.1"></path>
                <path d="M152.804 16.755c-1.568 0-1.633.063-1.633 1.043v4.608c0 3.429.163 3.888 1.993 4.085l.949.1c.2.13.131.718-.067.813-1.764-.064-2.875-.1-4.148-.1-1.406 0-2.517.064-3.791.1a.629.629 0 0 1-.065-.813l.556-.1c1.828-.328 1.895-.656 1.895-4.085V10.643c0-3.43-.229-3.986-1.927-4.116l-.85-.065c-.2-.13-.131-.719.065-.817 1.6.032 2.712.1 4.117.1 1.274 0 2.384-.032 3.79-.1.2.1.261.687.063.817l-.62.065c-1.894.2-1.959.686-1.959 4.116v3.758c0 1.013.065 1.044 1.633 1.044h9.345c1.568 0 1.633-.031 1.633-1.044v-3.758c0-3.43-.065-3.919-1.994-4.116l-.621-.065c-.2-.13-.13-.719.067-.817 1.5.065 2.614.1 3.953.1a78.82 78.82 0 0 0 3.857-.1c.2.1.261.687.063.817l-.685.068c-1.9.2-1.96.686-1.96 4.116v11.76c0 3.429.065 3.855 1.96 4.085l.783.1c.2.13.132.718-.065.813a91.858 91.858 0 0 0-3.953-.1c-1.339 0-2.515.031-3.953.1a.63.63 0 0 1-.067-.813l.621-.1c1.994-.328 1.994-.656 1.994-4.085v-4.608c0-.98-.065-1.043-1.633-1.043Z"></path>
                <path d="M168.998 18.403a9.53 9.53 0 0 1 9.813-9.73c6.368 0 9.565 4.6 9.565 9.454a9.409 9.409 0 0 1-9.565 9.618c-6.118 0-9.813-4.381-9.813-9.343m16.621.579c0-4.547-2.011-9.454-7.277-9.454-2.865 0-6.587 1.958-6.587 7.995 0 4.077 1.985 9.372 7.415 9.372 3.309 0 6.449-2.481 6.449-7.912"></path>
                <path d="M193.365 23.173c0 2.894.055 3.252 1.819 3.445l.744.083a.538.538 0 0 1-.055.689 93.976 93.976 0 0 0-3.583-.083c-1.158 0-2.15.026-3.362.083a.533.533 0 0 1-.055-.689l.579-.083c1.6-.219 1.653-.551 1.653-3.445v-10.17c0-2.344-.055-2.813-1.3-2.95l-.992-.111a.458.458 0 0 1 .056-.688 43.187 43.187 0 0 1 5.456-.222 9.943 9.943 0 0 1 5.292 1.1 4.762 4.762 0 0 1 2.205 4.133 4.67 4.67 0 0 1-2.756 4.384 9.3 9.3 0 0 1-3.8.826c-.193-.08-.193-.495-.028-.549 2.977-.552 4.052-2.235 4.052-4.632a4.063 4.063 0 0 0-4.437-4.409c-1.462 0-1.49.108-1.49.992Z"></path>
                <path d="M204.833 13.249c0-2.894-.056-3.335-1.654-3.472l-.69-.055c-.165-.111-.109-.608.055-.69 1.351.056 2.233.083 3.472.083 1.076 0 2.013-.026 3.2-.083.165.083.222.579.054.69l-.523.055c-1.6.164-1.654.578-1.654 3.472v3.172c0 .523.055 1.045.359 1.045a1.561 1.561 0 0 0 .771-.3c.386-.33 1.1-1.047 1.407-1.323l2.976-2.948c.524-.5 1.874-1.9 2.15-2.288a.815.815 0 0 0 .194-.442c0-.109-.11-.192-.47-.274l-.744-.165a.462.462 0 0 1 .055-.69c.965.056 2.067.083 3.032.083s1.9-.026 2.728-.083a.511.511 0 0 1 .056.69 6.8 6.8 0 0 0-2.562.772 27.406 27.406 0 0 0-3.86 3.2l-2.481 2.342c-.386.388-.634.635-.634.854 0 .2.165.415.524.854 2.619 3 4.741 5.485 6.892 7.745a3.193 3.193 0 0 0 2.1 1.131l.532.083a.48.48 0 0 1-.056.689c-.717-.056-1.472-.084-2.768-.084-1.13 0-2.1.028-3.364.084-.193-.056-.274-.526-.11-.689l.634-.113c.387-.054.661-.137.661-.273 0-.167-.193-.386-.387-.635-.524-.662-1.239-1.406-2.287-2.591l-2.205-2.481c-1.571-1.763-2.012-2.314-2.674-2.314-.413 0-.469.358-.469 1.323v3.556c0 2.893.055 3.279 1.6 3.445l.745.083c.163.11.11.605-.056.689a76.564 76.564 0 0 0-3.364-.084 61.17 61.17 0 0 0-3.2.084.533.533 0 0 1-.055-.689l.552-.083c1.46-.221 1.516-.552 1.516-3.445Z"></path>
                <path d="M223.752 13.305c0-2.922-.055-3.391-1.682-3.528l-.687-.055c-.167-.111-.111-.606.053-.69 1.379.056 2.316.084 3.474.084 1.1 0 2.04-.028 3.417-.084.167.084.222.579.056.69l-.689.055c-1.626.137-1.681.606-1.681 3.528v9.811c0 2.923.055 3.309 1.681 3.5l.689.083c.165.11.11.605-.056.689a78.794 78.794 0 0 0-3.417-.084c-1.158 0-1.99.028-3.367.084a.536.536 0 0 1-.055-.689l.582-.083c1.627-.193 1.682-.579 1.682-3.5Z"></path>
                <path d="M247.594 22.621c0 .828 0 4.107.084 4.822a.5.5 0 0 1-.524.3c-.331-.466-1.13-1.431-3.528-4.161l-6.395-7.277c-.744-.854-2.62-3.115-3.2-3.719h-.054a6.9 6.9 0 0 0-.14 1.789v6.01c0 1.294.029 4.879.5 5.7.166.305.717.47 1.406.525l.854.084a.506.506 0 0 1-.055.688 70.16 70.16 0 0 0-3.225-.083c-1.157 0-1.9.028-2.865.083a.508.508 0 0 1-.056-.688l.745-.084c.633-.083 1.074-.248 1.212-.551.386-.991.358-4.354.358-5.677v-7.959a2.524 2.524 0 0 0-.606-1.985 2.99 2.99 0 0 0-1.709-.663l-.469-.054a.483.483 0 0 1 .056-.69c1.158.083 2.617.083 3.113.083a8.737 8.737 0 0 0 1.268-.083c.552 1.407 3.8 5.045 4.712 6.065l2.675 3c1.9 2.122 3.251 3.666 4.548 4.989h.055a2.776 2.776 0 0 0 .11-1.158v-5.9c0-1.3-.028-4.878-.551-5.706-.165-.248-.605-.413-1.708-.551l-.469-.054c-.194-.165-.167-.608.053-.69 1.269.056 2.205.083 3.254.083 1.186 0 1.9-.026 2.838-.083a.485.485 0 0 1 .056.69l-.386.054c-.882.138-1.433.359-1.545.579-.469.992-.413 4.41-.413 5.678Z"></path>
                <path d="M254.834 27.746a8.612 8.612 0 0 1-4.3-1.019 12.8 12.8 0 0 1-.745-3.858c.14-.2.554-.249.663-.083.413 1.4 1.544 4.107 4.742 4.107a3.132 3.132 0 0 0 3.445-3.17 4.144 4.144 0 0 0-2.261-3.86l-2.617-1.71a5.876 5.876 0 0 1-2.978-4.74c0-2.619 2.04-4.74 5.624-4.74a10.73 10.73 0 0 1 2.563.357 3.611 3.611 0 0 0 .962.167 12 12 0 0 1 .5 3.362c-.111.167-.55.248-.689.084-.358-1.324-1.1-3.116-3.747-3.116-2.7 0-3.281 1.792-3.281 3.062 0 1.6 1.324 2.754 2.342 3.389l2.206 1.377c1.736 1.075 3.445 2.674 3.445 5.292 0 3.032-2.288 5.1-5.87 5.1"></path>
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-slate-900">Master of Science in Bioinformatics</h3>
              <p className="text-slate-600">Johns Hopkins University</p>
              <p className="text-sm text-slate-500 mt-1">Researching under: TBD</p>
            </div>
          </div>
          {/* UBC */}
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-full max-w-[300px] h-20 flex items-center justify-center p-2">
              <img className="w-full" src="ubc.png" alt="#" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-slate-900">Bachelor of Science in Physics</h3>
              <p className="text-slate-600">University of British Columbia</p>
              <p className="text-sm text-slate-500 mt-1">Researched under Park Lab</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};


const SkillsCloudSection = () => {
  const [words, setWords] = useState([]);

  useEffect(() => {
    const allTags = showcaseProjects.flatMap(p => p.tags);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});

    const maxCount = Math.max(...Object.values(tagCounts));
    const minCount = Math.min(...Object.values(tagCounts));

    const colors = ['text-blue-600', 'text-slate-800', 'text-blue-500', 'text-slate-600', 'text-sky-600'];

    const generatedWords = Object.entries(tagCounts).map(([text, count], index) => {
      const size = 1.25 + (3.5 - 1.25) * ((count - minCount) / (maxCount - minCount || 1));
      return {
        text,
        size: isNaN(size) ? 1.25 : size,
        color: colors[index % colors.length],
      };
    });

    for (let i = generatedWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [generatedWords[i], generatedWords[j]] = [generatedWords[j], generatedWords[i]];
    }

    setWords(generatedWords);
  }, []);

  return (
    <section id="skills" className="py-20 md:py-28 bg-slate-100 border-y border-slate-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 inline-flex items-center gap-4">
            Core Competencies
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">A visual summary of the key technologies and methodologies utilized in my work.</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 md:gap-x-10 md:gap-y-6 max-w-4xl mx-auto">
          {words.map(word => (
            <span
              key={word.text}
              className={`font-bold transition-all duration-300 hover:scale-110 ${word.color}`}
              style={{ fontSize: `${word.size}rem` }}
            >
              {word.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

const ShowcaseSection = () => {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
            Project Showcase
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">A selection of my recent work, from published research to interactive web applications.</p>
        </div>

        <div className="space-y-20 md:space-y-28">
          {showcaseProjects.map((project, index) => (
            <ProjectShowcaseItem key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectShowcaseItem = ({ project, index }) => {
  const isReversed = index % 2 !== 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center">
      <div className={`md:col-span-3 ${isReversed ? 'md:order-last' : ''}`}>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          {project.videoUrl ? (
            <iframe
              className="w-full h-full"
              src={project.videoUrl}
              title={project.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          ) : project.imageUrl ? (
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover"
              // INSERT DEFAULT IMAGE HERE
              onError={(e) => (e.currentTarget.src = null)} />
          ) : (
            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
              <Briefcase className="w-12 h-12 text-slate-400" />
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        <h3 className="text-3xl font-bold text-slate-900 mb-3">{project.title}</h3>
        <div className="flex flex-wrap gap-2 mb-5">
          {project.tags.map(tag => (
            <span key={tag} className="bg-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">{tag}</span>
          ))}
        </div>
        <p className="text-slate-600 mb-6 text-base leading-relaxed">{project.description}</p>

        <ul className="space-y-3 mb-6">
          {project.achievements.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700">{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-4 flex-wrap">
          {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700 transition-colors"><ExternalLink size={18} /> Live Demo</a>}
          {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-slate-800 transition-colors"><VscGithubAlt size={18} /> Code</a>}
          {project.paperUrl && <a href={project.paperUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-slate-800 transition-colors"><FileText size={18} /> Read Paper</a>}
        </div>
      </div>
    </div>
  );
};

const WritingsSection = ({ articles }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTime, setSelectedTime] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 3;

  const allTags = useMemo(() => [...new Set(articles.flatMap(a => a.tags))], [articles]);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const searchMatch = searchQuery === '' ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase());

      const tagMatch = selectedTags.length === 0 ||
        selectedTags.every(tag => article.tags.includes(tag));

      const timeMatch = selectedTime === 'All' || (() => {
        const now = new Date();
        const articleDate = new Date(article.date);
        const cutoffDate = new Date();
        if (selectedTime === '30d') cutoffDate.setDate(now.getDate() - 30);
        if (selectedTime === '6m') cutoffDate.setMonth(now.getMonth() - 6);
        if (selectedTime === '1y') cutoffDate.setFullYear(now.getFullYear() - 1);
        return articleDate >= cutoffDate;
      })();

      return searchMatch && tagMatch && timeMatch;
    });
  }, [searchQuery, selectedTags, selectedTime, articles]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedTags, selectedTime]);

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const paginatedArticles = filteredArticles.slice((currentPage - 1) * articlesPerPage, currentPage * articlesPerPage);

  // In Next.js, this would be a <Link> component
  const onViewArticle = (slug) => {
    alert(`Navigate to /blog/${slug}`);
  };

  return (
    <section className="py-20 md:py-32 bg-slate-100 border-b border-slate-200">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Writing Section</h2>
          <p className="mt-4 text-lg text-slate-600">Commentary on recent developments in computational biology.</p>
        </div>

        <div className="mb-12 p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center gap-4 max-w-4xl mx-auto">
          <div className="relative w-full lg:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              name="search"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 pl-12 pr-10 py-3 border border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2"><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>}
          </div>
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <MultiSelectDropdown
              options={allTags}
              selectedOptions={selectedTags}
              onSelectionChange={handleTagToggle}
              onClear={() => setSelectedTags([])}
            />
            <div className="hidden md:block relative w-full lg:w-auto">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                name='time'
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full appearance-none bg-slate-50 pl-12 pr-10 py-3 border border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All Time</option>
                <option value="30d">Last 30 days</option>
                <option value="6m">Last 6 months</option>
                <option value="1y">Last year</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {paginatedArticles.length > 0 ? (
          <div className="space-y-8 max-w-4xl mx-auto">
            {paginatedArticles.map((article) => (
              <Link href="#" key={article.slug} className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group flex flex-col md:flex-row items-start gap-8">
                <div className="w-full h-full md:w-1/3 flex-shrink-0 overflow-hidden rounded-lg">
                  <img
                    // INSERT DEFAULT IMAGE INSTEAD OF NULL
                    src={article.thumbnailUrl || null}
                    alt={article.title}
                    className="w-full h-full object-cover object-center aspect-[3/3] transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col flex-grow self-stretch md:h-full">
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{article.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.tags.map(tag => <span key={tag} className={`text-xs font-medium px-2.5 py-1 rounded-full ${selectedTags.includes(tag) ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>{tag}</span>)}
                  </div>
                  <p className="text-slate-600 mb-4 flex-grow h-24 overflow-hidden">{article.summary}</p>
                  <div className="flex items-center justify-between text-sm text-slate-500 mt-auto pt-4 border-t border-slate-200">
                    <div><span>{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span><span className="mx-2">&bull;</span><span>{article.readTime}</span></div>
                    <button onClick={() => onViewArticle(article.slug)} className="font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Read More &rarr;</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-slate-200 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-slate-700">No Articles Found</h3>
            <p className="text-slate-500 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <button
              onClick={() => setCurrentPage(p => p - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &larr; Previous
            </button>
            <span className="text-slate-600">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next &rarr;
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const MultiSelectDropdown = ({ options, selectedOptions, onSelectionChange, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full lg:w-auto min-w-[16em]" ref={dropdownRef}>
      <div className="relative">
        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-slate-50 pl-12 pr-10 py-3 border border-transparent rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center text-left"
        >
          <span className="truncate">
            {selectedOptions.length > 0
              ? <span className="text-slate-800">{selectedOptions.length} tag(s) selected</span>
              : <span className="text-slate-500">Filter by tags...</span>
            }
          </span>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg">
          <div className="p-2">
            <input
              name="tags"
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md"
            />
          </div>
          <ul className="max-h-60 overflow-y-auto p-2">
            {filteredOptions.map(option => (
              <li key={option}>
                <label className="flex items-center space-x-3 p-2 hover:bg-slate-100 rounded-md cursor-pointer">
                  <input
                    name="tag checkbox"
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={() => onSelectionChange(option)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700">{option}</span>
                </label>
              </li>
            ))}
          </ul>
          {selectedOptions.length > 0 && (
            <div className="p-2 border-t border-slate-200">
              <button onClick={() => { onClear(); }} className="w-full text-center text-sm text-blue-600 hover:underline">Clear selection</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const Footer = () => {
  return (
    <footer id="connect" className="bg-slate-900 border-t border-slate-800">
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white">Let's Connect</h2>
        <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
          Questions, comments, or discussions are all welcome. Feel free to reach out.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
          <a href="mailto:andre@andrefortes.com" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
            <Mail size={20} />
            <span>Email Me</span>
          </a>
          <a href="https://github.com/computationtime" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
            <VscGithubAlt size={20} />
            <span>GitHub</span>
          </a>
          <a href="https://www.linkedin.com/in/andre-fortes/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
            <FaLinkedinIn size={20} />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
      <div className="py-6 border-t border-slate-800">
        <div className="container mx-auto px-6 text-center text-sm text-slate-500">
          <p>Based in Brazil &bull; &copy; {new Date().getFullYear()} Andre Fortes. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const ArticlePage = ({ article, onBack }) => (
  <div className="bg-slate-50 text-slate-700 antialiased min-h-screen">
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 border-b border-slate-200">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <button onClick={onBack} className="flex items-center text-slate-600 hover:text-blue-600 transition-colors"><ChevronLeft className="w-5 h-5 mr-2" /> Back to Site</button>
        <h1 className="text-lg font-bold tracking-tight text-slate-900 hidden sm:block">Andre Fortes</h1>
      </div>
    </header>
    <main className="pt-24 pb-16">
      <article className="prose prose-lg mx-auto px-6 max-w-3xl prose-headings:text-slate-900 prose-a:text-blue-600 hover:prose-a:text-blue-700 prose-strong:text-slate-800">
        <h1>{article.title}</h1>
        <div className="text-slate-500 text-base mb-8"><span>{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span><span className="mx-2">&bull;</span><span>{article.readTime}</span></div>
        <p className="lead">{article.summary}</p>
        <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }} />
      </article>
    </main>
    <Footer />
  </div>
);

const DocumentViewer = ({ docType, onBack }) => {
  // In a real Next.js app, these URLs would point to files in your /public directory
  const pdfUrl = docType === 'resume' ? '/test.pdf' : '/test.pdf';

  return (
    <div className="bg-slate-200">
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={onBack} className="flex items-center text-slate-600 hover:text-blue-600 transition-colors text-xl font-medium duration-300"><ChevronLeft className="w-5 h-5 mr-2" /> Back to Site</button>
        </div>
      </header>
      <main className="pt-15">
        <iframe
          src={pdfUrl}
          className="w-full h-screen border-none"
          title={docType}
        ></iframe>
      </main>
    </div>
  );
};
