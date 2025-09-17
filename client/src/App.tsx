import React, { useState, useEffect, useRef } from 'react';
import { trpc } from '@/utils/trpc';

// Import components
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import CertificatesSection from '@/components/CertificatesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import LoadingSpinner from '@/components/LoadingSpinner';

// Import types
import type { 
  User, 
  Skill, 
  Project, 
  Experience, 
  Certificate, 
  Testimonial 
} from '../../server/src/schema';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Refs for section navigation
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({
    home: null,
    about: null,
    skills: null,
    experience: null,
    projects: null,
    certificates: null,
    testimonials: null,
    contact: null,
  });

  // Initialize dark mode from system preference
  useEffect(() => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  // Load all data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load all data concurrently
        const [
          userData,
          skillsData,
          projectsData,
          experienceData,
          certificatesData,
          testimonialsData
        ] = await Promise.all([
          trpc.getUser.query(),
          trpc.getSkills.query(),
          trpc.getProjects.query(),
          trpc.getExperience.query(),
          trpc.getCertificates.query(),
          trpc.getTestimonials.query()
        ]);

        setUser(userData);
        setSkills(skillsData);
        setProjects(projectsData);
        setExperience(experienceData);
        setCertificates(certificatesData);
        setTestimonials(testimonialsData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const section = sectionsRef.current[sectionId];
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-slate-900' : 'bg-white'
    }`}>
      <ScrollProgress />
      
      <Navigation 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        scrollToSection={scrollToSection}
      />

      <main className="relative">
        {/* Hero Section */}
        <section 
          ref={(el: HTMLElement | null) => { sectionsRef.current.home = el; }}
          id="home" 
          className="min-h-screen"
        >
          <HeroSection 
            user={user} 
            scrollToSection={scrollToSection}
          />
        </section>

        {/* About Section */}
        <section 
          ref={(el: HTMLElement | null) => { sectionsRef.current.about = el; }}
          id="about" 
          className="py-20"
        >
          <AboutSection user={user} />
        </section>

        {/* Skills Section */}
        <section 
          ref={(el: HTMLElement | null) => { sectionsRef.current.skills = el; }}
          id="skills" 
          className="py-20 bg-gray-50 dark:bg-slate-800/50"
        >
          <SkillsSection skills={skills} />
        </section>

        {/* Experience Section */}
        <section 
          ref={(el: HTMLElement | null) => { sectionsRef.current.experience = el; }}
          id="experience" 
          className="py-20"
        >
          <ExperienceSection experience={experience} />
        </section>

        {/* Projects Section */}
        <section 
          ref={(el: HTMLElement | null) => { sectionsRef.current.projects = el; }}
          id="projects" 
          className="py-20 bg-gray-50 dark:bg-slate-800/50"
        >
          <ProjectsSection projects={projects} />
        </section>

        {/* Certificates Section */}
        <section 
          ref={(el: HTMLElement | null) => { sectionsRef.current.certificates = el; }}
          id="certificates" 
          className="py-20"
        >
          <CertificatesSection certificates={certificates} />
        </section>

        {/* Testimonials Section */}
        <section 
          ref={(el: HTMLElement | null) => { sectionsRef.current.testimonials = el; }}
          id="testimonials" 
          className="py-20 bg-gray-50 dark:bg-slate-800/50"
        >
          <TestimonialsSection testimonials={testimonials} />
        </section>

        {/* Contact Section */}
        <section 
          ref={(el: HTMLElement | null) => { sectionsRef.current.contact = el; }}
          id="contact" 
          className="py-20"
        >
          <ContactSection />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;