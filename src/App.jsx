import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { Login, Register, ForgotPassword, ResetPassword, AuthCallback } from './pages/AuthPages';
import MemberDashboard from './pages/MemberDashboard';
import {
  Menu, X, ArrowRight, ArrowUpRight, Plane, Orbit, Satellite, Rocket,
  BookOpen, Users, FlaskConical, Lightbulb, CalendarDays, GraduationCap,
  Mail, MapPin, Linkedin, Youtube, Send, ChevronRight, Wind, Wrench,
  Cpu, ShieldCheck, Globe2, ExternalLink, CheckCircle2, Factory, Code2,
  ClipboardCheck, Boxes, Target, Microscope, Download, Search, Filter,
  Clock3, FileText, Award, Building2, CircleHelp, Layers3, Settings2,
  Gauge, Radar, Presentation, PenTool, BoxesIcon
} from 'lucide-react';

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || '';

const divisions = [
  { icon: Wind, title: 'Aircraft Design & Aerodynamics', focus: 'Configuration • Aerodynamics • Flight mechanics', text: 'Explore aircraft configuration, aerodynamic performance, flight mechanics concepts and engineering analysis.', activities: ['Airfoil and configuration studies', 'Introductory aerodynamic analysis', 'Flight-mechanics learning sessions'], outputs: 'Technical notes, analysis exercises and design studies.' },
  { icon: Plane, title: 'UAV Design & Development', focus: 'Requirements • CAD • Prototyping • Testing', text: 'Explore unmanned aircraft concepts through requirements, CAD, prototyping, systems integration and controlled evaluation.', activities: ['Mission and requirement definition', 'CAD and non-critical prototyping', 'Ground-test and documentation activities'], outputs: 'Design files, prototypes, test records and project reports.' },
  { icon: ShieldCheck, title: 'Aircraft Structures & Materials', focus: 'Structures • Materials • Manufacturing', text: 'Study structural integrity, lightweight materials, loads, stress analysis and aircraft maintenance concepts.', activities: ['Structural concept discussions', 'Material-selection exercises', 'Manufacturing and inspection activities'], outputs: 'Design calculations, material matrices and inspection records.' },
  { icon: Cpu, title: 'Flight Mechanics & Control', focus: 'Stability • Control • Simulation', text: 'Investigate stability, control systems, navigation, simulation and autonomous-flight concepts.', activities: ['Control-axis and stability studies', 'Simulation exercises', 'Flight-control architecture reviews'], outputs: 'Control diagrams, simulation evidence and technical presentations.' },
  { icon: Satellite, title: 'Space Science & Satellite Technology', focus: 'Space systems • Orbits • Remote sensing', text: 'Discover orbital mechanics, remote sensing, satellite systems and the expanding space sector.', activities: ['Space-science seminars', 'Satellite-system learning', 'Earth-observation applications'], outputs: 'Presentations, research briefs and collaborative studies.' },
  { icon: FlaskConical, title: 'Research & Innovation', focus: 'Research • Collaboration • Technical communication', text: 'Build research skills, share technical work and collaborate on solutions to aerospace challenges.', activities: ['Research-topic discussions', 'Student technical presentations', 'Interdisciplinary project development'], outputs: 'Research concepts, reports, posters and conference-ready work.' }
];

const projects = [
  { tag: 'UAV DEVELOPMENT', title: 'UAV Design-to-Piloting Programme', text: 'A structured 12-week pathway connecting UAV fundamentals, CAD, fabrication, embedded programming, testing, simulation and supervised readiness.', icon: Plane, status: 'Training programme', meta: '12 weeks • Beginner engineering level' },
  { tag: 'ENGINEERING EDUCATION', title: 'UAV Practical Laboratory Series', text: 'A 12-laboratory sequence designed to build traceable engineering evidence from inventory and component identification through testing and capstone review.', icon: FlaskConical, status: 'Laboratory framework', meta: 'Weeks 1–12 • Instructor-guided' },
  { tag: 'RESEARCH & DESIGN', title: 'Student Aerospace Project Portfolio', text: 'A future showcase for verified student work in aircraft design, structures, UAV systems, controls, space science and related aerospace topics.', icon: Layers3, status: 'Future showcase', meta: 'Projects added as activities are verified' }
];

const opportunities = [
  { type: 'SCHOLARSHIPS', title: 'Scholarships & fellowships', text: 'Funding opportunities for undergraduate, postgraduate and research participants, with eligibility checked before publication.', icon: GraduationCap },
  { type: 'INTERNSHIPS', title: 'Internships & training', text: 'Placements, short courses, technical training and professional-development opportunities relevant to aerospace and aviation.', icon: Wrench },
  { type: 'COMPETITIONS', title: 'Competitions & challenges', text: 'Aerospace, aviation, UAV, satellite and space-science challenges open to eligible participants.', icon: Award },
  { type: 'RESEARCH', title: 'Research calls & grants', text: 'Calls for proposals, student research programmes, grants and collaborative research opportunities.', icon: Microscope },
  { type: 'EVENTS', title: 'Conferences & workshops', text: 'Relevant conferences, workshops, webinars, seminars and technical events.', icon: Presentation },
  { type: 'INDUSTRY', title: 'Industry & academic opportunities', text: 'Career, networking and collaboration opportunities from verified aerospace, aviation and academic organizations.', icon: Building2 }
];

const uavWeeks = [
  ['01','UAV fundamentals & inventory','Terminology; fixed-wing, multirotor, single-rotor and hybrid VTOL; applications and safety.','Inventory worksheet and comparison chart.'],
  ['02','Flight principles & controls','Lift, thrust, drag; roll, pitch, yaw; stability, centre of gravity and payload effects.','Annotated flight diagram and quiz.'],
  ['03','Components & power systems','Frame, motors, propellers, ESC, battery, flight controller, sensors, radio link and GPS.','Component sheet and preliminary bill of materials.'],
  ['04','CAD & engineering design','Requirements, dimensions, constraints, tolerances, sketches, features and assemblies.','CAD files, drawing and design review.'],
  ['05','Materials & 3D printing','Density, stiffness, toughness, heat resistance, printability, orientation and defects.','Material matrix and inspected part.'],
  ['06','Arduino & embedded programming','Variables, conditions, loops, functions, serial monitor, sensor input and basic signals.','Source code, demonstration and test record.'],
  ['07','Flight control & simulation','IMU concepts, calibration, control-loop overview, motor mixing, failsafe and modes.','Control-system diagram and checklist.'],
  ['08','Assembly & integration','Fastening, vibration, connector compatibility, polarity, cable management and records.','Prototype, wiring diagram and integration checklist.'],
  ['09','Ground testing & troubleshooting','Acceptance criteria, fault isolation, battery condition, sensor checks and anomaly reporting.','Ground-test report and readiness decision.'],
  ['10','Simulation & pilot skills','Orientation, pre-flight planning, weather, hover, turns, landing and emergencies.','Individual pilot log and planning sheet.'],
  ['11','Controlled flight testing','Test objectives, repeatability, stability, flight-time measurement and limitations.','Test data and improvement list.'],
  ['12','Final project & design review','Reporting, cost analysis, limitations, maintenance and next iteration.','Final report, presentation and assessment.']
];

const labs = [
  ['Lab 1','Drone Inventory & Classification','Identify aircraft types, record visible equipment, distinguish verified facts from assumptions and create a safe traceable register.'],
  ['Lab 2','Flight Axes & Basic Motion','Identify roll, pitch and yaw and observe control behaviour using a simulator or instructor-approved demonstration.'],
  ['Lab 3','Component Identification & System Diagram','Identify major components and separate energy flow from information/control flow using confirmed information.'],
  ['Lab 4','CAD Modelling Fundamentals','Translate a simple design requirement into dimensions and create a basic constrained 3D part.'],
  ['Lab 5','Material Selection & 3D-Print Inspection','Compare materials, print a non-flight-critical part and inspect it against design requirements.'],
  ['Lab 6','Arduino Sensor Programming','Read sensor values, display data and document a safe bench-level embedded exercise.'],
  ['Lab 7','Flight-Controller Concepts & Safe Configuration','Study controller architecture and perform non-flying configuration inspection with propellers removed.'],
  ['Lab 8','Prototype Assembly & Wiring Inspection','Inspect low-risk assembly, wiring, fastening, strain relief and centre-of-mass considerations.'],
  ['Lab 9','Ground Tests & Fault Reporting','Use staged, controlled testing and document measurable observations, faults and stop conditions.'],
  ['Lab 10','Piloting Fundamentals Using a Simulator','Practise orientation, turns, altitude awareness, recovery and pre-flight decision making without flight risk.'],
  ['Lab 11','Supervised Flight Readiness','Apply a formal readiness checklist and conduct real flight only when aircraft, site, permissions and instructor approval are confirmed.'],
  ['Lab 12','Capstone Demonstration & Review','Present the design-to-test process, evidence, limitations, safety decisions and next steps.']
];

const inventory = [
  ['01','Drone camera','1','Camera-system familiarization; inspect exact model and compatibility.'],
  ['02','Mini drone HP camera 14+AC,DC','1','Introductory familiarization; exact model/specification needs verification.'],
  ['03','Mini drone','1','Introductory controls and component identification if functional.'],
  ['04','Ultra-compact folding micro drone','1','Portable mini-drone familiarization; confirm controller and battery.'],
  ['05','Drone small E5705','1','Model-specific familiarization; verify manufacturer and documentation.'],
  ['06','Brushless motor ESC camera drone','1','Potential propulsion-system demonstration; confirm model and inspect.'],
  ['07','Folding mini drone','1','Introductory controls and flight-system familiarization if functional.'],
  ['08','Mini drone','1','Introductory controls and component identification if functional.'],
  ['09','Emotion Drone packe','2','Name unclear in source inventory; inspect physical label before assigning use.'],
  ['10','Drone camera without controller','1','Camera/system inspection; do not assume compatibility without verification.'],
  ['11','Mini drone','1','Introductory familiarization if functional.'],
  ['12','Mini Drone pro','2','Potential piloting/comparison activity after model and controller checks.'],
  ['13','Collapsible Over Roof Drone Toys','1','Name unclear; verify exact item and whether it is a drone or accessory.'],
  ['14','Folding drone','1','Introductory familiarization if functional.'],
  ['15','Fold Drone','1','Introductory familiarization if functional.'],
  ['16','Drone for Kids','1','Basic drone-type discussion; check suitability and condition.'],
  ['17','Drone 12 camrd m/n none','1','Camera/model information unclear; verify label.'],
  ['18','Mini drone toys','1','Basic classification or introductory demonstration if functional.'],
  ['19','Mini drone toys','1','Basic classification or introductory demonstration if functional.'],
  ['20','mach x vidio Drone','1','Name unclear; inspect label and verify specifications.'],
  ['21','4 axis quad copter drone','1','Potential quadcopter architecture and component-identification demonstration.'],
  ['22','DRON Camera Remote Control DJI mini 3 pro','1','Controller listed; confirm exact controller model and compatible aircraft.']
];

const purchasePlan = [
  ['Arduino-compatible starter kits','2–4 kits','ETB 8,900–12,500 per kit','ETB 17,800–50,000','High — target 5–6 team kits total'],
  ['Digital multimeters','3–5 units if fewer are available','ETB 1,500–3,500 each','ETB 4,500–17,500','High — electrical measurement and troubleshooting'],
  ['Breadboards, jumper wires, resistors, LEDs, connectors','Top up to 5–6 team sets','ETB 1,500–3,000 per set','ETB 7,500–18,000','High — avoid duplicate purchase if current sets are complete'],
  ['Digital calipers / precision measurement','2 units if not already available','ETB 1,500–4,000 each','ETB 3,000–8,000','High — CAD-to-print inspection'],
  ['Filament and printer consumables','2–4 rolls if stock is insufficient','ETB 2,500–5,000 per roll','ETB 5,000–20,000','High — non-flight-critical learning parts'],
  ['Battery-safe storage, labels, PPE and basic fire-safety provisions','One suitable lab setup','ETB 10,000–25,000 allowance','ETB 10,000–25,000','High — confirm with local safety officer'],
  ['Storage bins, labels and inventory log materials','One shared set','ETB 2,000–5,000 allowance','ETB 2,000–5,000','Medium — asset and fault tracking']
];

const newsPlaceholders = [
  ['EAC LAUNCH', 'Club activities and announcements', 'Use this area for confirmed EAC announcements once institutional approval, dates and responsible contacts are established.', CalendarDays],
  ['TECHNICAL SESSION', 'Aerospace seminars & workshops', 'Feature confirmed seminars, guest lectures, practical workshops and technical sessions with dates and registration information.', Presentation],
  ['STUDENT PROJECTS', 'Project stories & technical highlights', 'Publish verified student work, design milestones, laboratory outcomes and research presentations.', Rocket]
];

function Brand({ light = false }) {
  return <Link to="/" className={`brand ${light ? 'brand-light' : ''}`} aria-label="Ethiopian Aerospace Club home">
    <img className="brand-logo" src="/eac-logo.png" alt="Ethiopian Aerospace Club official emblem" />
    <span><strong>ETHIOPIAN</strong><b>AEROSPACE CLUB</b><small>EAC</small></span>
  </Link>;
}

function AccountNav(){
  const { user, isAdmin, signOut, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Link to="/login">Sign in</Link>;
  return <span className="account-nav"><Link to={isAdmin?'/admin':'/dashboard'}>{isAdmin?'Admin dashboard':'Member dashboard'}</Link><button type="button" onClick={signOut}>Sign out</button></span>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const headerRef = useRef(null);

  const links = [
    ['Home','/'],
    ['About','/about', [['About EAC','/about'], ['Vision & Mission','/about'], ['Leadership & Committee','/about']]],
    ['Academics','/divisions', [['Technical Divisions','/divisions'], ['UAV Laboratory','/uav-lab'], ['Training Programme','/uav-lab']]],
    ['Research','/projects', [['Projects & Research','/projects'], ['Research Areas','/divisions']]],
    ['News & Events','/news', [['News & Announcements','/news'], ['Events','/news']]],
    ['Opportunities','/opportunities'],
    ['Membership','/membership'],
    ['Contact','/contact']
  ];

  const searchable=[['About EAC','/about'],['Technical Divisions','/divisions'],['UAV Laboratory','/uav-lab'],['Projects & Research','/projects'],['Opportunities','/opportunities'],['News & Events','/news'],['Membership','/membership'],['Contact','/contact']];
  const results=searchable.filter(([t])=>t.toLowerCase().includes(query.toLowerCase()));

  useEffect(()=>{
    setOpenDropdown(null);
    setOpen(false);
    setSearchOpen(false);
    setQuery('');
    window.scrollTo({top:0, behavior:'smooth'});
  },[location.pathname]);

  useEffect(()=>{
    const handlePointerDown = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setSearchOpen(false);
        setOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenDropdown(null);
        setSearchOpen(false);
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  },[]);

  useEffect(()=>{
    document.body.style.overflow = open && window.innerWidth <= 760 ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  },[open]);

  const closeMenus = () => { setOpenDropdown(null); setSearchOpen(false); setOpen(false); };
  const toggleDropdown = (label) => {
    setSearchOpen(false);
    setOpenDropdown(current => current === label ? null : label);
  };
  const toggleSearch = () => {
    setOpenDropdown(null);
    setSearchOpen(current => !current);
    setOpen(false);
  };

  return <>
    <header ref={headerRef} className="site-header institutional-header">
      <div className="institutional-top">
        <div className="container institutional-top-inner">
          <div className="top-affiliation">
            <span>ETHIOPIAN DEFENCE UNIVERSITY</span><i></i>
            <span>COLLEGE OF ENGINEERING</span><i></i>
            <span>AEROSPACE ENGINEERING DEPARTMENT</span>
          </div>
          <div className="top-links">
            <Link to="/about">About EAC</Link><Link to="/contact">Contact</Link><AccountNav/>
          </div>
        </div>
      </div>

      <div className="container nav institutional-brand-row">
        <Brand/>
        <div className="institutional-search-wrap">
          <button className="search-trigger" onClick={toggleSearch} aria-label="Search website">
            <Search size={19}/><span>Search everything...</span>
          </button>
          {searchOpen && <div className="search-panel">
            <input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search EAC..."/>
            <div>{results.map(([t,to])=><Link key={`${t}-${to}`} to={to} onClick={closeMenus}>{t}<ArrowUpRight size={14}/></Link>)}
              {results.length===0&&<p>No matching page found.</p>}
            </div>
          </div>}
        </div>
        <button className="menu-btn" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button>
      </div>

      <div className="institutional-nav-bar">
        <div className="container nav nav-main">
          <nav className={open ? 'open' : ''}>
            <div className="mobile-menu-search">
              <Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search EAC..." aria-label="Search EAC"/>
            </div>
            {links.map(([label,to,drop]) => {
              if (drop) {
                const isOpen = openDropdown === label;
                const isParentActive = location.pathname === to || drop.some(([,dt]) => location.pathname === dt);
                return <div className={`nav-dropdown ${isOpen ? 'is-open' : ''}`} key={to}>
                  <button
                    type="button"
                    className={`nav-parent ${isParentActive ? 'active' : ''}`}
                    aria-expanded={isOpen}
                    onClick={()=>toggleDropdown(label)}
                  >
                    {label}
                  </button>
                  <div className="dropdown-menu" aria-hidden={!isOpen}>
                    {drop.map(([dl,dt])=><Link key={`${dl}-${dt}`} to={dt} onClick={closeMenus}>{dl}<ChevronRight size={14}/></Link>)}
                  </div>
                </div>;
              }
              return <NavLink key={to} to={to} end={to==='/'} onClick={closeMenus}>{label}</NavLink>;
            })}
          </nav>
          <Link className="nav-cta" to="/membership" onClick={closeMenus}>Join EAC <ArrowUpRight size={15}/></Link>
        </div>
      </div>
    </header>
  </>;
}

function BackToTop(){
  const [visible,setVisible]=useState(false);
  useEffect(()=>{
    const onScroll=()=>setVisible(window.scrollY>520);
    window.addEventListener('scroll',onScroll,{passive:true});
    onScroll();
    return()=>window.removeEventListener('scroll',onScroll);
  },[]);
  return visible ? <button className="back-to-top" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})} aria-label="Back to top"><ArrowUpRight size={18}/></button> : null;
}

function Footer(){return <footer className="footer institutional-footer"><div className="container footer-main"><div className="footer-about"><Brand light/><p>A proposed university-based aerospace community focused on learning, engineering practice, research, collaboration and responsible innovation.</p><div className="footer-affiliation"><span>EAC PROPOSED ACADEMIC CONTEXT</span><strong>Ethiopian Defence University</strong><small>College of Engineering • Aerospace Engineering Department</small></div></div><div><h4>Explore</h4><Link to="/about">About EAC</Link><Link to="/divisions">Academics & divisions</Link><Link to="/uav-lab">UAV laboratory</Link><Link to="/projects">Research & projects</Link><Link to="/opportunities">Opportunities</Link></div><div><h4>Connect</h4><Link to="/news">News & events</Link><Link to="/membership">Membership</Link><Link to="/contact">Contact</Link><a href="https://t.me/Ethiopian_Aerospace_Club" target="_blank" rel="noreferrer">Telegram</a><a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a></div></div><div className="designer-credit"><div className="container"><div><span>WEBSITE DESIGN & DEVELOPMENT</span><strong>Haile Assefa Wube</strong></div><div className="designer-contact"><span>Official EAC digital platform</span><span>Telegram: @Ethiopian_Aerospace_Club</span></div></div></div><div className="footer-bottom"><div className="container"><span>© {new Date().getFullYear()} Ethiopian Aerospace Club</span><span>Proposed initiative • Institutional approval and official recognition subject to applicable procedures</span></div></div></footer>}

function PageIntro({eyebrow,title,text}){return <section className="page-intro"><div className="container page-intro-grid"><div className="page-intro-copy"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{text}</p></div><div className="page-intro-art"><div className="intro-orbit intro-orbit-a"></div><div className="intro-orbit intro-orbit-b"></div><div className="intro-core"><Plane size={42}/><span>EAC / AE</span></div><div className="intro-code">01 / LEARN<br/>02 / DESIGN<br/>03 / TEST</div></div></div></section>}
function SectionHeading({eyebrow,title,text,link,to}){return <div className="section-heading"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{text&&<p>{text}</p>}</div>{link&&<Link className="text-link" to={to}>{link}<ArrowRight size={17}/></Link>}</div>}
function CTA(){return <section className="cta-band"><div className="container cta-inner"><div><div className="eyebrow eyebrow-gold">BE PART OF THE JOURNEY</div><h2>Help shape the future of aerospace in Ethiopia.</h2><p>Connect with fellow learners, share ideas and take part in engineering activities.</p></div><Link className="button button-gold" to="/membership">Explore membership <ArrowRight size={17}/></Link></div></section>}
function Notice({icon:Icon=ShieldCheck,children,gold=false}){return <div className={`notice ${gold?'notice-gold':''}`}><Icon/><div>{children}</div></div>}

function Home(){
  const [slide,setSlide]=useState(0);
  const [cms,setCms]=useState(()=>{try{return JSON.parse(localStorage.getItem('eac_cms')||'{}')}catch{return {}}});
  const slides=(cms.heroSlides&&cms.heroSlides.length?cms.heroSlides:[
    {label:'ETHIOPIAN AEROSPACE CLUB',title:'Building the next generation of aerospace engineers.',text:'A proposed university-based community connecting aerospace learning, practical engineering, research and collaboration.',image:''},
    {label:'UAV & ENGINEERING',title:'Learn. Design. Build. Test.',text:'Explore UAV systems, CAD, embedded systems, simulation and responsible engineering practice.',image:''},
    {label:'RESEARCH & INNOVATION',title:'Turn aerospace curiosity into technical work.',text:'Create a platform for student projects, research conversations, technical sessions and future opportunities.',image:''}
  ]);
  useEffect(()=>{const id=setInterval(()=>setSlide(s=>(s+1)%slides.length),7000);return()=>clearInterval(id)},[slides.length]);
  const active=slides[slide%slides.length];
  return <>
    <section className="institutional-hero" style={active.image?{backgroundImage:`linear-gradient(90deg,rgba(4,19,36,.86) 0%,rgba(4,19,36,.56) 48%,rgba(4,19,36,.18) 100%),url(${active.image})`}:{}}>
      <div className="hero-overlay"><div className="container hero-content"><div className="hero-slide-copy"><div className="institution-chip"><span></span>{active.label}</div><h1>{active.title}</h1><p>{active.text}</p><div className="hero-actions"><Link className="button button-gold" to="/about">Discover EAC <ArrowRight size={17}/></Link><Link className="button button-light" to="/projects">Explore research <ArrowRight size={17}/></Link></div></div></div></div>
      <div className="hero-controls"><button onClick={()=>setSlide((slide-1+slides.length)%slides.length)} aria-label="Previous slide">‹</button><div className="hero-dots">{slides.map((_,i)=><button key={i} className={i===slide?'active':''} onClick={()=>setSlide(i)} aria-label={`Slide ${i+1}`}></button>)}</div><button onClick={()=>setSlide((slide+1)%slides.length)} aria-label="Next slide">›</button></div>
      <div className="hero-counter"><span>{String(slide+1).padStart(2,'0')}</span> / {String(slides.length).padStart(2,'0')}</div>
    </section>
    <section className="institution-strip"><div className="container"><div><span>PROPOSED LEADING BODY</span><strong>Aerospace Engineering Department</strong></div><ChevronRight/><div><span>COLLEGE</span><strong>College of Engineering</strong></div><ChevronRight/><div><span>UNIVERSITY</span><strong>Ethiopian Defence University</strong></div></div></section>
    <section className="quick-links"><div className="container"><div className="quick-link-title"><span>QUICK LINKS</span><strong>EAC at a glance</strong></div><Link to="/about"><BookOpen/>About EAC<ArrowUpRight/></Link><Link to="/uav-lab"><Plane/>UAV Laboratory<ArrowUpRight/></Link><Link to="/projects"><Microscope/>Research & Projects<ArrowUpRight/></Link><Link to="/news"><CalendarDays/>News & Events<ArrowUpRight/></Link></div></section>
    <section className="section welcome-section"><div className="container welcome-grid"><div><div className="eyebrow">WELCOME TO THE ETHIOPIAN AEROSPACE CLUB</div><h2>A technical community for aerospace learning, engineering and innovation.</h2></div><div><p className="lead">The EAC is envisioned as a university-based aerospace community that complements formal education through practical activities, technical exchange, research and responsible experimentation.</p><Link className="text-link" to="/about">Learn more about EAC <ArrowRight size={17}/></Link></div></div></section>
    <section className="section section-soft"><div className="container"><SectionHeading eyebrow="ACADEMICS & PROGRAMMES" title="Explore aerospace through structured technical pathways." text="The club can organize learning around engineering disciplines and practical programmes that grow with member interests, expertise and approved resources."/><div className="feature-grid institution-feature-grid"><article><span className="feature-icon"><Plane/></span><div><h3>UAV Systems</h3><p>Design, CAD, electronics, integration, simulation and supervised testing.</p><Link to="/uav-lab" className="text-link">View programme <ArrowRight size={15}/></Link></div></article><article><span className="feature-icon"><Wind/></span><div><h3>Aircraft & Aerodynamics</h3><p>Aircraft configuration, aerodynamic concepts, flight mechanics and engineering analysis.</p><Link to="/divisions" className="text-link">Explore division <ArrowRight size={15}/></Link></div></article><article><span className="feature-icon"><Cpu/></span><div><h3>Avionics & Control</h3><p>Embedded systems, sensors, control concepts, simulation and technical documentation.</p><Link to="/divisions" className="text-link">Explore division <ArrowRight size={15}/></Link></div></article></div></div></section>
    <section className="section section-dark"><div className="container"><SectionHeading eyebrow="RESEARCH & INNOVATION" title="A home for verified aerospace work." text="Student projects, research interests, design activities and technical presentations can be published here as the club develops." link="View research & projects" to="/projects"/><div className="research-highlight"><div className="research-image-placeholder"><Microscope size={62}/><span>FEATURED RESEARCH IMAGE</span></div><div><div className="eyebrow eyebrow-gold">FEATURED AREA</div><h3>From engineering question to documented result.</h3><p>Use the EAC platform to connect technical questions with evidence, design work, testing, limitations and clear communication.</p><div className="research-points"><span><CheckCircle2/> Define</span><span><CheckCircle2/> Design</span><span><CheckCircle2/> Test</span><span><CheckCircle2/> Communicate</span></div></div></div></div></section>
    <section className="section"><div className="container"><SectionHeading eyebrow="UAV LABORATORY" title="A practical learning environment for unmanned aircraft systems." text="The UAV laboratory programme connects fundamentals, CAD, embedded systems, assembly, testing, simulation and supervised flight readiness." link="Open UAV laboratory" to="/uav-lab"/><div className="lab-cards"><article><span>01</span><h3>12-week training</h3><p>Structured pathway from fundamentals to capstone review.</p></article><article><span>02</span><h3>12 practical labs</h3><p>Traceable activities designed around safe engineering evidence.</p></article><article><span>03</span><h3>Design-to-piloting</h3><p>Observe, analyse, design, build, test and communicate.</p></article></div></div></section>
    <section className="section section-soft"><div className="container"><SectionHeading eyebrow="NEWS & EVENTS" title="Stay connected with EAC activity." text="Confirmed announcements, seminars, workshops, competitions and project stories can be published here." link="View all news & events" to="/news"/><div className="news-grid">{newsPlaceholders.map(([tag,title,text,Icon],i)=><article key={title}><div className="news-art"><Icon size={34}/><span>{tag}</span></div><div className="news-body"><div className="eyebrow">{tag}</div><h3>{title}</h3><p>{text}</p><span className="status-label">Ready for verified content</span></div></article>)}</div></div></section>
    <section className="cta-band"><div className="container cta-inner"><div><div className="eyebrow eyebrow-gold">JOIN THE COMMUNITY</div><h2>Bring your curiosity. Build what comes next.</h2><p>Membership, technical participation and future opportunities can grow through approved EAC activities.</p></div><Link className="button button-gold" to="/membership">Explore membership <ArrowRight size={17}/></Link></div></section>
  </>;
}

function About(){return <><PageIntro eyebrow="ABOUT EAC" title="A university-based aerospace community with an engineering focus." text="The Ethiopian Aerospace Club is envisioned as an academic and extracurricular initiative supporting aerospace learning, collaboration, research and innovation."/><section className="section"><div className="container two-col"><div><div className="eyebrow">OUR PURPOSE</div><h2>Bringing aerospace ideas into the learning environment.</h2><p className="lead">EAC seeks to create an active community where members can deepen their understanding of aerospace engineering and explore emerging technologies together.</p><p>Through technical sessions, collaborative projects, research presentations and professional-development activities, the club aims to complement formal academic learning with practical and interdisciplinary experiences.</p></div><div className="about-visual"><div className="about-orbit"></div><div className="about-emblem"><Plane size={62}/><span>ETHIOPIAN<br/>AEROSPACE<br/>CLUB</span><small>EAC</small></div><div className="about-caption">LEARN • DESIGN • DISCOVER</div></div></div></section><section className="section section-soft"><div className="container"><div className="vision-grid"><div><div className="eyebrow">OUR VISION</div><h2>To become a leading university-based aerospace community contributing to aerospace education, research and technological development in Ethiopia.</h2></div><div><div className="eyebrow">OUR MISSION</div><p>To inspire and develop future aerospace engineers, researchers and innovators through technical education, practical engineering activities, research collaboration, knowledge exchange and professional development.</p></div></div><div className="objectives"><h3>Proposed objectives</h3><div className="objective-grid">{['Promote interest in aerospace science and engineering.','Encourage practical design, simulation and prototyping.','Support student research and technical communication.','Connect members with academic and professional opportunities.','Promote collaboration, creativity and responsible innovation.','Share aerospace knowledge with the wider community.'].map((x,i)=><div key={x}><span>0{i+1}</span>{x}</div>)}</div></div></div></section><section className="section"><div className="container"><SectionHeading eyebrow="INSTITUTIONAL CONTEXT" title="Proposed academic affiliation" text="The proposed club is intended to operate within the academic environment of Ethiopian Defence University."/><div className="affiliation"><div><span>INSTITUTIONAL AUTHORITY</span><strong>Ethiopian Defence University</strong></div><ChevronRight/><div><span>ACADEMIC CONTEXT</span><strong>College of Engineering</strong></div><ChevronRight/><div><span>PROPOSED LEADING BODY</span><strong>Aerospace Engineering Department</strong></div></div><Notice><strong>Institutional status</strong><p>The organizational relationship, use of institutional identity and official recognition are subject to approval through the university's applicable procedures.</p></Notice></div></section><CTA/></>}

function Divisions(){
  const [selected,setSelected]=useState(0);
  const d=divisions[selected];
  const Icon=d.icon;
  return <>
    <PageIntro eyebrow="TECHNICAL DIVISIONS" title="Six pathways for aerospace exploration." text="Proposed technical focus areas give members a structured way to explore specialist topics, build skills and collaborate on engineering activities."/>
    <section className="section">
      <div className="container division-explorer">
        <div className="division-selector">
          {divisions.map((x,i)=>{
            const I=x.icon;
            return <button key={x.title} className={selected===i?'active':''} onClick={()=>setSelected(i)}>
              <I size={19}/>
              <span><small>0{i+1}</small>{x.title}</span>
              <ChevronRight size={15}/>
            </button>;
          })}
        </div>
        <div className="division-detail">
          <div className="detail-icon"><Icon/></div>
          <div className="eyebrow">TECHNICAL PATHWAY 0{selected+1}</div>
          <h2>{d.title}</h2>
          <p className="lead">{d.text}</p>
          <div className="detail-columns">
            <div><span>FOCUS</span><p>{d.focus}</p></div>
            <div><span>POSSIBLE OUTPUTS</span><p>{d.outputs}</p></div>
          </div>
          <div className="activity-list">
            <h3>Possible activities</h3>
            {d.activities.map(a=><div key={a}><CheckCircle2 size={16}/>{a}</div>)}
          </div>
          <Notice icon={Lightbulb}>
            <strong>Working groups are proposed.</strong>
            <p>Specific divisions and activities can be established according to member interests, available expertise, resources and university approval.</p>
          </Notice>
        </div>
      </div>
    </section>
    <CTA/>
  </>
}

function UavLab(){const [week,setWeek]=useState(0);const [tab,setTab]=useState('curriculum');return <>
  <section className="uav-hero-strip"><div className="container uav-hero-grid"><div className="uav-hero-copy"><div className="eyebrow eyebrow-gold">UAV ENGINEERING • PRACTICAL LABORATORY</div><h1>UAV Design-to-Piloting</h1><p>A 12-week practical engineering pathway supported by supervised laboratory work, documentation, simulation and readiness checks.</p><div className="uav-hero-actions"><a className="button button-gold" href="#curriculum">Explore curriculum <ArrowRight size={16}/></a><a className="button button-outline-light" href="#laboratories">Laboratory map <FlaskConical size={16}/></a></div></div><div className="uav-system-art"><div className="uav-ring ring-one"></div><div className="uav-ring ring-two"></div><div className="uav-crosshair"></div><div className="uav-center"><Plane size={39}/><span>EAC UAV LAB</span></div><div className="uav-node node-a">CAD / DESIGN</div><div className="uav-node node-b">SIMULATION</div><div className="uav-node node-c">TESTING</div><div className="uav-node node-d">SAFETY</div></div></div></section>
  <section className="section"><div className="container"><div className="uav-kpi-grid"><div><span>PROGRAMME</span><strong>12 weeks</strong><p>Suggested 6–8 contact hours per week for beginner engineering learners.</p></div><div><span>LABORATORIES</span><strong>12 practical labs</strong><p>Weeks 1–12 move from inventory and fundamentals to capstone review.</p></div><div><span>TEAM MODEL</span><strong>3–4 learners</strong><p>Suggested project teams with individual evidence for programming and piloting.</p></div><div><span>CAPSTONE</span><strong>Design evidence</strong><p>Prototype, mock-up or validated training-drone evidence depending on readiness.</p></div></div></div></section>
  <section className="section section-soft" id="curriculum"><div className="container"><SectionHeading eyebrow="12-WEEK CURRICULUM" title="A staged path from fundamentals to engineering evidence." text="The programme uses existing drones as teaching specimens and stages the custom-build project so that flight is attempted only after documented readiness and instructor approval."/><div className="uav-week-layout"><div className="uav-week-list">{uavWeeks.map((w,i)=><button key={w[0]} className={week===i?'active':''} onClick={()=>setWeek(i)}><span>{w[0]}</span><strong>{w[1]}</strong><ChevronRight size={14}/></button>)}</div><div className="uav-week-detail"><div className="eyebrow">WEEK {uavWeeks[week][0]}</div><h3>{uavWeeks[week][1]}</h3><div className="detail-columns"><div><span>CORE CONTENT</span><p>{uavWeeks[week][2]}</p></div><div><span>EVIDENCE</span><p>{uavWeeks[week][3]}</p></div></div><div className="progress-line"><i style={{width:`${((week+1)/12)*100}%`}}></i></div><small>{week+1} of 12 weeks</small></div></div></div></section>
  <section className="section" id="laboratories"><div className="container"><SectionHeading eyebrow="PRACTICAL LABORATORIES" title="Twelve laboratories that build traceable engineering practice." text="Each laboratory produces evidence, observations or records that feed into later design, testing and capstone work."/><div className="lab-grid">{labs.map((l,i)=><article className="lab-card" key={l[0]}><div className="lab-num">{String(i+1).padStart(2,'0')}</div><div><div className="eyebrow">{l[0]}</div><h3>{l[1]}</h3><p>{l[2]}</p></div></article>)}</div></div></section>
  <section className="section section-soft"><div className="container"><SectionHeading eyebrow="ENGINEERING WORKFLOW" title="Observe → Analyse → Design → Fabricate → Program → Test."/><div className="uav-flow">{[['01','Observe','Inventory, classification and safe familiarization.'],['02','Analyse','Forces, systems, requirements and evidence.'],['03','Design','CAD, materials and engineering decisions.'],['04','Fabricate','3D printing and low-risk prototype work.'],['05','Program','Bench-level embedded and sensor exercises.'],['06','Test','Ground tests, simulation, readiness and review.']].map(x=><div className="uav-flow-step" key={x[1]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></div>)}</div></div></section>
  <section className="uav-safety-section"><div className="container uav-safety-grid"><div><div className="eyebrow eyebrow-gold">SAFETY & READINESS</div><h2>Engineering judgment includes knowing when not to fly.</h2><p>The supplied manuals emphasize instructor supervision, manufacturer documentation, staged testing and compliance with applicable institutional and Ethiopian aviation requirements. A simulator, tabletop exercise or grounded prototype can be the correct outcome when readiness is not established.</p></div><div className="safety-list">{['Remove propellers for appropriate bench work and configuration checks.','Inspect batteries, wiring, aircraft condition and controller compatibility.','Use designated test areas, supervision and clear abort procedures.','Do not fly an unverified, damaged or unapproved aircraft.','Real flight requires appropriate site, permissions, instructor approval and applicable requirements.'].map(x=><div key={x}><ShieldCheck size={18}/><span>{x}</span></div>)}</div></div></section>
  <section className="section"><div className="container"><SectionHeading eyebrow="TRAINING INVENTORY" title="Initial UAV inventory: 22 entries for verification and planning." text="The supplied inventory is a transcription from an inventory photograph. It should not be interpreted as proof of airworthiness, compatibility or operational readiness."/><div className="table-wrap"><table><thead><tr><th>No.</th><th>Inventory name</th><th>Qty.</th><th>Possible teaching use / action</th></tr></thead><tbody>{inventory.map(r=><tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}</tbody></table></div></div></section>
  <section className="section section-soft"><div className="container"><SectionHeading eyebrow="LABORATORY DEVELOPMENT" title="Prioritized purchases are planning allowances, not quotations." text="The supplied purchase plan recommends inspecting existing resources before buying and obtaining current local written quotations."/><div className="budget-card"><div><span>INDICATIVE ESSENTIAL / TOP-UP SUBTOTAL</span><strong>ETB 49,800–143,500</strong></div><div><span>PROVISIONAL PLANNING CEILING</span><strong>ETB 160,000</strong></div></div><div className="table-wrap"><table><thead><tr><th>Item</th><th>Quantity / basis</th><th>Unit estimate</th><th>Line estimate</th><th>Priority</th></tr></thead><tbody>{purchasePlan.map(r=><tr key={r[0]}>{r.map((c,j)=><td key={j}>{c}</td>)}</tr>)}</tbody></table></div></div></section>
  <section className="section"><div className="container capstone-wrap"><SectionHeading eyebrow="CAPSTONE" title="The final project rewards evidence, engineering reasoning and safe decisions." text="The supplied Weeks 7–12 manual frames the capstone around problem definition, design, manufacturing, electronics/programming understanding, assembly, testing, safety and communication."/><div className="capstone-grid">{[['10%','Problem definition & requirements'],['15%','CAD/design & technical reasoning'],['10%','Material selection & manufacturing'],['15%','Electronics/programming understanding'],['15%','Assembly & inspection'],['15%','Testing & evidence'],['10%','Safety & compliance'],['10%','Communication & reflection']].map(x=><article key={x[1]}><span>{x[0]}</span><h3>{x[1]}</h3></article>)}</div><Notice icon={ClipboardCheck}><strong>Important capstone principle</strong><p>A well-documented mock-up, simulator demonstration or grounded prototype can be a successful outcome when flight is not safe or authorized. Do not claim a test was passed if it was not performed.</p></Notice></div></section>
  <CTA/>
</>}

function Projects(){return <><PageIntro eyebrow="PROJECTS & RESEARCH" title="A home for verified aerospace work." text="Showcase student projects, research interests, design activities and collaborative experiments as EAC activities are developed and verified."/><section className="section"><div className="container"><Notice icon={ShieldCheck} gold><strong>Project publishing standard</strong><p>Cards below describe programme frameworks or proposed activities. Completed projects should be added only with verified project status, contributors, dates and evidence.</p></Notice><div className="project-grid project-grid-expanded">{projects.map((p,i)=>{const Icon=p.icon;return <article className="project-card" key={p.title}><div className={`project-art project-art-${i+1}`}><Icon size={56}/><span>EAC / PROJECT {String(i+1).padStart(2,'0')}</span></div><div className="project-body"><div className="eyebrow">{p.tag}</div><h3>{p.title}</h3><p>{p.text}</p><div className="project-meta"><span>{p.status}</span><span>{p.meta}</span></div><Link className="text-link" to="/contact">Discuss this area <ArrowRight size={15}/></Link></div></article>})}</div></div></section><section className="section section-dark"><div className="container"><SectionHeading eyebrow="FUTURE PROJECT CATEGORIES" title="A structured portfolio can grow with the club."/><div className="project-category-grid">{[['Aircraft','Design studies, structures and aerodynamics.'],['UAV Systems','Design, electronics, simulation and testing.'],['Space','Satellite, orbital and remote-sensing topics.'],['Research','Student research, papers and technical presentations.']].map(([a,b])=><div key={a}><span>{a}</span><p>{b}</p></div>)}</div><div className="project-lifecycle">{[['01','Question','Define the engineering or research problem.'],['02','Evidence','Collect requirements, references and measurements.'],['03','Engineering','Design, simulate, prototype or model the solution.'],['04','Validation','Test what can safely be tested and record limitations.'],['05','Communication','Present the result clearly and preserve the evidence.']].map(([n,t,d])=><div key={n}><span>{n}</span><strong>{t}</strong><p>{d}</p></div>)}</div></div></section><CTA/></>}

function Opportunities(){const [filter,setFilter]=useState('ALL');const [query,setQuery]=useState('');const filtered=useMemo(()=>opportunities.filter(o=>(filter==='ALL'||o.type===filter)&&o.title.toLowerCase().includes(query.toLowerCase())),[filter,query]);return <><PageIntro eyebrow="OPPORTUNITIES" title="A verified gateway to aerospace opportunities." text="The EAC opportunity hub prioritizes Ethiopia and Africa while including international opportunities genuinely open to Ethiopian applicants or participants."/><section className="section"><div className="container"><Notice><strong>Verification standard</strong><p>Each live listing should be checked against the current official organizer, university, employer or funding-source page. A listing should show eligibility, deadline or event date, location/online format, funding or fees when stated, and a direct official source.</p></Notice><div className="opportunity-controls"><div className="search-box"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search opportunity categories..."/></div><div className="filter-row"><Filter size={15}/>{['ALL',...opportunities.map(o=>o.type)].map(f=><button key={f} className={filter===f?'active':''} onClick={()=>setFilter(f)}>{f}</button>)}</div></div><div className="opportunity-grid opportunity-grid-full">{filtered.map((o,i)=>{const Icon=o.icon;return <article className="opportunity-card" key={o.title}><span className="opportunity-number">0{i+1}</span><Icon className="opp-icon"/><div className="opportunity-status"><span className="verified-dot"></span>VERIFICATION REQUIRED</div><div className="eyebrow">{o.type}</div><h3>{o.title}</h3><p>{o.text}</p><div className="opportunity-fields"><span><Clock3 size={13}/> Deadline: publish only when verified</span><span><Globe2 size={13}/> Ethiopia • Africa • International</span></div><Link className="text-link" to="/contact">Submit an opportunity <ArrowRight size={15}/></Link></article>})}</div><div className="digest-panel"><div><div className="eyebrow">WEEKLY DIGEST</div><h3>Time-sensitive aerospace opportunities, in one place.</h3><p>The future digest can be organized by deadline, category and eligibility. No unsupported or unverified opportunity should be presented as confirmed.</p></div><div className="digest-tags"><span>Scholarships</span><span>Internships</span><span>Competitions</span><span>Research</span><span>Events</span></div></div></div></section><CTA/></>}

function News(){return <><PageIntro eyebrow="NEWS & EVENTS" title="A place for confirmed EAC activity." text="Announcements, seminars, workshops, competitions and stories can be published here as the club's activity calendar develops."/><section className="section"><div className="container"><Notice icon={CalendarDays}><strong>Publication rule</strong><p>Use this page for confirmed EAC activities and announcements. Dates, venues, registration details and responsible contacts should be verified before publication.</p></Notice><div className="news-grid">{newsPlaceholders.map(([tag,title,text,Icon])=><article key={title}><div className="news-art"><Icon size={34}/><span>{tag}</span></div><div className="news-body"><div className="eyebrow">{tag}</div><h3>{title}</h3><p>{text}</p><span className="status-label">Ready for verified content</span></div></article>)}</div><div className="empty-state compact"><CalendarDays size={36}/><div className="eyebrow">EVENT CALENDAR</div><h2>Confirmed events will appear here.</h2><p>Use the contact page to provide approved event information when the EAC programme is ready for publication.</p><Link to="/contact" className="button button-primary">Contact the club <ArrowRight size={16}/></Link></div></div></section><CTA/></>}

function useFormSubmit(){const [state,setState]=useState({loading:false,success:false,error:''});async function submit(e){e.preventDefault();const form=e.currentTarget;const data=Object.fromEntries(new FormData(form).entries());if(!contactEmail){setState({loading:false,success:false,error:'Email delivery is not configured yet. Add VITE_CONTACT_EMAIL to your deployment environment and redeploy.'});return;}setState({loading:true,success:false,error:''});try{const res=await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(contactEmail)}`,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({...data,_subject:`EAC website: ${data.formType||'New message'}`})});if(!res.ok)throw new Error('Submission failed. Please try again or contact the club by email.');setState({loading:false,success:true,error:''});form.reset();}catch(err){setState({loading:false,success:false,error:err.message||'Something went wrong.'});}}return {state,submit};}
function FormFeedback({state}){return state.success?<div className="form-success"><CheckCircle2/> Your message has been submitted. Thank you.</div>:state.error?<div className="form-error">{state.error}</div>:null}

function Membership(){const {state,submit}=useFormSubmit();return <><PageIntro eyebrow="MEMBERSHIP" title="Bring your curiosity. Build what comes next." text="Membership is intended for learners and aerospace enthusiasts who want to participate in technical learning, collaboration and innovation."/><section className="section"><div className="container form-layout"><div className="form-aside"><div className="eyebrow">WHY JOIN EAC?</div><h2>Learn with a community. Grow through practice.</h2><ul className="check-list"><li><CheckCircle2/> Participate in technical discussions and seminars.</li><li><CheckCircle2/> Explore engineering projects and working groups.</li><li><CheckCircle2/> Develop research and communication skills.</li><li><CheckCircle2/> Discover learning and career opportunities.</li></ul><Notice icon={Users}><strong>Membership status</strong><p>This form collects expressions of interest. Membership eligibility, approval and registration procedures should follow university rules and the club's approved constitution.</p></Notice></div><form className="form-card" onSubmit={submit}><input type="hidden" name="formType" value="Membership application"/><h3>Membership interest form</h3><p>Complete the fields below. Required fields are marked.</p><div className="form-row"><label>Full name *<input required name="Full name" placeholder="Your full name"/></label><label>Email address *<input required type="email" name="Email" placeholder="name@example.com"/></label></div><div className="form-row"><label>Institution / organization<input name="Institution" placeholder="University or organization"/></label><label>Department / field of study<input name="Department" placeholder="e.g. Aerospace Engineering"/></label></div><div className="form-row"><label>Study / professional level<select name="Level" defaultValue=""><option value="" disabled>Select one</option><option>Undergraduate student</option><option>Postgraduate student</option><option>Academic staff</option><option>Professional</option><option>Other</option></select></label><label>Area of interest<select name="Interest" defaultValue=""><option value="" disabled>Select an area</option>{divisions.map(d=><option key={d.title}>{d.title}</option>)}<option>Multiple areas</option></select></label></div><label>Why would you like to join?<textarea name="Motivation" rows="4" placeholder="Tell us briefly about your interests..."/></label><label className="consent"><input required type="checkbox" name="Consent" value="I agree to be contacted about EAC membership"/> I agree to be contacted about this membership enquiry. *</label><button className="button button-primary" disabled={state.loading}>{state.loading?'Submitting…':'Submit interest form'} <Send size={16}/></button><FormFeedback state={state}/><p className="form-footnote">Do not submit sensitive personal information. Member data should be handled according to applicable university requirements.</p></form></div></section></>}

function Contact(){const {state,submit}=useFormSubmit();return <><PageIntro eyebrow="CONTACT" title="Let's connect around aerospace." text="Have a question, idea, collaboration proposal or interest in the club? Send a message."/><section className="section"><div className="container contact-layout"><div className="contact-info"><div className="eyebrow">GET IN TOUCH</div><h2>Start a conversation.</h2><p>Use the form to contact the club. Official contact details can be added here after they are approved and established.</p><div className="contact-item"><MapPin/><div><strong>Proposed institutional affiliation</strong><span>Ethiopian Defence University<br/>College of Engineering<br/>Aerospace Engineering Department</span></div></div><div className="contact-item"><Mail/><div><strong>Email</strong><span>{contactEmail||'Club contact email to be configured'}</span></div></div><div className="contact-item"><Globe2/><div><strong>Online presence</strong><span>Official website and social channels can be added after institutional approval.</span></div></div><div className="contact-note">Please do not treat this demonstration site as an official university communication channel until it has been approved.</div></div><form className="form-card" onSubmit={submit}><input type="hidden" name="formType" value="Contact message"/><h3>Send a message</h3><div className="form-row"><label>Your name *<input required name="Name" placeholder="Your name"/></label><label>Email address *<input required type="email" name="Email" placeholder="name@example.com"/></label></div><label>Subject<input name="Subject" placeholder="How can we help?"/></label><label>Message *<textarea required name="Message" rows="6" placeholder="Write your message..."/></label><button className="button button-primary" disabled={state.loading}>{state.loading?'Sending…':'Send message'} <ArrowRight size={16}/></button><FormFeedback state={state}/></form></div></section></>}
function Admin(){
 const defaultSlides=[
  {label:'ETHIOPIAN AEROSPACE CLUB',title:'Building the next generation of aerospace engineers.',text:'A proposed university-based community connecting aerospace learning, practical engineering, research and collaboration.',image:''},
  {label:'UAV & ENGINEERING',title:'Learn. Design. Build. Test.',text:'Explore UAV systems, CAD, embedded systems, simulation and responsible engineering practice.',image:''},
  {label:'RESEARCH & INNOVATION',title:'Turn aerospace curiosity into technical work.',text:'Create a platform for student projects, research conversations and future opportunities.',image:''}
 ];
 const defaultCms={heroSlides:defaultSlides,site:{tagline:'Learn • Design • Discover',email:'',phone:'',location:'Ethiopian Defence University'},social:{telegram:'https://t.me/Ethiopian_Aerospace_Club',linkedin:'',youtube:'',facebook:''},committee:[]};
 const [cms,setCms]=useState(()=>{try{return {...defaultCms,...JSON.parse(localStorage.getItem('eac_cms')||'{}')}}catch{return defaultCms}});
 const [tab,setTab]=useState('overview');
 const [saved,setSaved]=useState(false);
 const save=(next=cms)=>{localStorage.setItem('eac_cms',JSON.stringify(next));setCms(next);setSaved(true);setTimeout(()=>setSaved(false),1800)};
 const updateSlide=(i,key,val)=>setCms(c=>({...c,heroSlides:c.heroSlides.map((s,idx)=>idx===i?{...s,[key]:val}:s)}));
 const upload=(i,file)=>{if(!file)return;const reader=new FileReader();reader.onload=e=>updateSlide(i,'image',e.target.result);reader.readAsDataURL(file)};
 const addSlide=()=>setCms(c=>({...c,heroSlides:[...c.heroSlides,{label:'EAC',title:'New EAC banner',text:'Add your approved banner message here.',image:''}]}));
 const removeSlide=i=>setCms(c=>({...c,heroSlides:c.heroSlides.filter((_,idx)=>idx!==i)}));
 const updateSite=(key,val)=>setCms(c=>({...c,site:{...c.site,[key]:val}}));
 const updateSocial=(key,val)=>setCms(c=>({...c,social:{...c.social,[key]:val}}));
 const addMember=()=>setCms(c=>({...c,committee:[...c.committee,{name:'',position:'',department:'',year:'',photo:'',bio:''}]}));
 const updateMember=(i,key,val)=>setCms(c=>({...c,committee:c.committee.map((m,idx)=>idx===i?{...m,[key]:val}:m)}));
 const uploadMember=(i,file)=>{if(!file)return;const reader=new FileReader();reader.onload=e=>updateMember(i,'photo',e.target.result);reader.readAsDataURL(file)};
 const nav=[['overview','Overview'],['hero','Hero & banners'],['committee','Committee'],['settings','Site settings'],['social','Social links']];
 return <>
  <section className="admin-dashboard-head"><div className="container"><div><div className="eyebrow eyebrow-gold">EAC CONTROL CENTER</div><h1>Website administration</h1><p>Manage approved EAC content, presentation and institutional information from one place.</p></div><div className="admin-head-actions"><Link className="button button-light" to="/">View live website <ExternalLink size={15}/></Link><button className="button button-gold" onClick={()=>save()}>{saved?'Saved ✓':'Save all changes'}</button></div></div></section>
  <section className="section admin-section"><div className="container admin-layout">
    <aside className="admin-sidebar"><div className="admin-profile"><div className="admin-avatar"><Settings2 size={21}/></div><div><strong>EAC Administrator</strong><span>Content management</span></div></div><div className="admin-nav">{nav.map(([id,label])=><button key={id} className={tab===id?'active':''} onClick={()=>setTab(id)}>{label}<ChevronRight size={15}/></button>)}</div><div className="admin-side-note"><ShieldCheck size={17}/><span>Only publish information that has been verified and approved for the club website.</span></div></aside>
    <div className="admin-workspace">
      {tab==='overview'&&<><div className="admin-welcome"><div><div className="eyebrow">CONTROL CENTER</div><h2>Good to see you.</h2><p>The dashboard is designed to keep the public website clean while giving the EAC team a single place to maintain approved content.</p></div><div className="admin-status"><span></span>Secure account active</div></div><div className="admin-stat-grid"><div><span>HERO SLIDES</span><strong>{cms.heroSlides.length}</strong><p>Homepage banners</p></div><div><span>COMMITTEE</span><strong>{cms.committee.length}</strong><p>Profile records</p></div><div><span>SOCIAL</span><strong>{Object.values(cms.social).filter(Boolean).length}</strong><p>Configured links</p></div><div><span>STATUS</span><strong>READY</strong><p>Content can be edited</p></div></div><div className="admin-quick-grid"><button onClick={()=>setTab('hero')}><Plane/><strong>Update hero</strong><span>Images, headlines and supporting copy</span></button><button onClick={()=>setTab('committee')}><Users/><strong>Manage committee</strong><span>Profiles, roles and photographs</span></button><button onClick={()=>setTab('settings')}><Settings2/><strong>Site settings</strong><span>Institutional and contact information</span></button></div><div className="admin-note"><ShieldCheck size={18}/><div><strong>Important</strong><p>Authentication and role protection are now handled by the Supabase backend. The existing CMS editor remains browser-local in this phase; its content tables and security policies are included in supabase/schema.sql so the CMS can be migrated to shared database storage next.</p></div></div></>}
      {tab==='hero'&&<div><div className="admin-section-title"><div><div className="eyebrow">HOMEPAGE</div><h2>Hero & banners</h2><p>Replace the default presentation with approved EAC or university photographs. The public homepage never displays an upload instruction.</p></div><button className="button button-primary" onClick={addSlide}>+ Add banner</button></div>{cms.heroSlides.map((s,i)=><div className="admin-card" key={i}><div className="admin-card-head"><div><span>SLIDE {String(i+1).padStart(2,'0')}</span><h3>{s.label||'Untitled slide'}</h3></div><button className="admin-remove" onClick={()=>removeSlide(i)} disabled={cms.heroSlides.length===1}>Remove</button></div><div className="admin-grid"><div><div className="admin-preview" style={s.image?{backgroundImage:`url(${s.image})`}:{}}>{!s.image&&<><Plane size={34}/><span>Upload an approved image</span></>}</div><label className="upload-button">Upload / replace image<input type="file" accept="image/*" onChange={e=>upload(i,e.target.files[0])}/></label></div><div className="admin-fields"><label>Small label<input value={s.label} onChange={e=>updateSlide(i,'label',e.target.value)}/></label><label>Headline<textarea rows="2" value={s.title} onChange={e=>updateSlide(i,'title',e.target.value)}/></label><label>Supporting text<textarea rows="3" value={s.text} onChange={e=>updateSlide(i,'text',e.target.value)}/></label></div></div></div>)}</div>}
      {tab==='committee'&&<div><div className="admin-section-title"><div><div className="eyebrow">PEOPLE</div><h2>Committee profiles</h2><p>Keep fields blank until members provide approved information. Status terminology can be defined by the EAC.</p></div><button className="button button-primary" onClick={addMember}>+ Add member</button></div>{cms.committee.length===0&&<div className="admin-empty"><Users size={30}/><h3>No committee profiles added</h3><p>Add the first profile when the member information is ready.</p></div>}{cms.committee.map((m,i)=><div className="admin-card" key={i}><div className="admin-card-head"><div><span>PROFILE {String(i+1).padStart(2,'0')}</span><h3>{m.name||'New committee profile'}</h3></div><button className="admin-remove" onClick={()=>setCms(c=>({...c,committee:c.committee.filter((_,idx)=>idx!==i)}))}>Remove</button></div><div className="admin-grid"><div><div className="admin-preview member-preview" style={m.photo?{backgroundImage:`url(${m.photo})`}:{}}>{!m.photo&&<Users size={34}/>}</div><label className="upload-button">Upload member photo<input type="file" accept="image/*" onChange={e=>uploadMember(i,e.target.files[0])}/></label></div><div className="admin-fields"><div className="form-row"><label>Full name<input value={m.name} onChange={e=>updateMember(i,'name',e.target.value)} /></label><label>Position / title<input value={m.position} onChange={e=>updateMember(i,'position',e.target.value)} /></label></div><div className="form-row"><label>Department<input value={m.department} onChange={e=>updateMember(i,'department',e.target.value)} /></label><label>Year / level<input value={m.year} onChange={e=>updateMember(i,'year',e.target.value)} /></label></div><label>Short biography<textarea rows="3" value={m.bio} onChange={e=>updateMember(i,'bio',e.target.value)}/></label></div></div></div>)}</div>}
      {tab==='settings'&&<div><div className="admin-section-title"><div><div className="eyebrow">INSTITUTIONAL SETTINGS</div><h2>Site settings</h2><p>Keep approved institutional and contact information editable without touching the source code.</p></div></div><div className="admin-card"><div className="admin-fields admin-settings-grid"><label>Site tagline<input value={cms.site.tagline} onChange={e=>updateSite('tagline',e.target.value)}/></label><label>Official email<input type="email" value={cms.site.email} onChange={e=>updateSite('email',e.target.value)}/></label><label>Phone<input value={cms.site.phone} onChange={e=>updateSite('phone',e.target.value)}/></label><label>Office / location<input value={cms.site.location} onChange={e=>updateSite('location',e.target.value)}/></label></div></div></div>}
      {tab==='social'&&<div><div className="admin-section-title"><div><div className="eyebrow">OFFICIAL CHANNELS</div><h2>Social links</h2><p>Only publish official links. Leave any unconfirmed channel blank.</p></div></div><div className="admin-card"><div className="admin-fields admin-settings-grid"><label>Telegram<input value={cms.social.telegram} onChange={e=>updateSocial('telegram',e.target.value)} placeholder="https://t.me/..."/></label><label>LinkedIn<input value={cms.social.linkedin} onChange={e=>updateSocial('linkedin',e.target.value)} placeholder="https://www.linkedin.com/..."/></label><label>YouTube<input value={cms.social.youtube} onChange={e=>updateSocial('youtube',e.target.value)} placeholder="https://youtube.com/..."/></label><label>Facebook<input value={cms.social.facebook} onChange={e=>updateSocial('facebook',e.target.value)} placeholder="https://facebook.com/..."/></label></div></div></div>}
    </div>
  </div></section></>;
}
function NotFound(){return <PageIntro eyebrow="404" title="This page is out of orbit." text="The page you are looking for may have moved. Return to the EAC homepage to continue exploring."/>}

export default function App() {
  return (
    <AuthProvider>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/divisions" element={<Divisions />} />
          <Route path="/uav-lab" element={<UavLab />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/news" element={<News />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MemberDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <BackToTop />
      <Footer />
    </AuthProvider>
  );
}
