import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Download, MessageCircle, ChevronDown, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import type { User } from '../../../server/src/schema';

interface HeroSectionProps {
  user: User | null;
  scrollToSection: (section: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ user, scrollToSection }) => {
  const [currentText, setCurrentText] = useState('');
  
  // Demo data for when user is null
  const demoUser = {
    name: 'John Doe',
    bio: 'Full Stack Developer passionate about creating amazing digital experiences',
    avatar: null,
    social_links: {
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'john@example.com'
    }
  };

  const displayUser = user || demoUser;
  
  const titles = [
    'Full Stack Developer',
    'Frontend Specialist', 
    'Backend Engineer',
    'UI/UX Enthusiast'
  ];

  useEffect(() => {
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseSpeed = 2000;

    const typeWriter = () => {
      const currentTitle = titles[titleIndex];
      
      if (!isDeleting) {
        setCurrentText(currentTitle.substring(0, charIndex + 1));
        charIndex++;
        
        if (charIndex === currentTitle.length) {
          setTimeout(() => {
            isDeleting = true;
          }, pauseSpeed);
        }
      } else {
        setCurrentText(currentTitle.substring(0, charIndex - 1));
        charIndex--;
        
        if (charIndex === 0) {
          isDeleting = false;
          titleIndex = (titleIndex + 1) % titles.length;
        }
      }
      
      const speed = isDeleting ? deleteSpeed : typeSpeed;
      setTimeout(typeWriter, speed);
    };

    typeWriter();
  }, [titles]);

  // Particle animation effect
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-indigo-400 rounded-full opacity-70 animate-pulse';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 2 + 's';
      
      const container = document.getElementById('hero-particles');
      if (container) {
        container.appendChild(particle);
        
        setTimeout(() => {
          if (container.contains(particle)) {
            container.removeChild(particle);
          }
        }, 4000);
      }
    };

    const interval = setInterval(createParticle, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        <div id="hero-particles" className="absolute inset-0"></div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Profile Image */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full p-1 animate-spin-slow">
              <div className="bg-white dark:bg-slate-900 rounded-full p-1">
                <Avatar className="w-32 h-32 md:w-40 md:h-40">
                  <AvatarImage 
                    src={displayUser.avatar || ''} 
                    alt={displayUser.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    {displayUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </div>

        {/* Name and Title */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent">
            {displayUser.name}
          </h1>
          
          <div className="text-xl md:text-2xl lg:text-3xl text-indigo-600 dark:text-indigo-400 font-semibold h-8 md:h-10 flex items-center justify-center">
            <span>{currentText}</span>
            <span className="animate-pulse ml-1">|</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          {displayUser.bio}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-medium transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Download className="mr-2 h-5 w-5" />
            Download CV
          </Button>
          
          <Button 
            size="lg"
            variant="outline" 
            onClick={() => scrollToSection('contact')}
            className="border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white px-8 py-6 text-lg font-medium transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Contact Me
          </Button>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-12">
          {displayUser.social_links?.github && (
            <a 
              href={displayUser.social_links.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <Github className="h-6 w-6" />
            </a>
          )}
          
          {displayUser.social_links?.linkedin && (
            <a 
              href={displayUser.social_links.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <Linkedin className="h-6 w-6" />
            </a>
          )}
          
          {displayUser.social_links?.twitter && (
            <a 
              href={displayUser.social_links.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <Twitter className="h-6 w-6" />
            </a>
          )}
          
          {displayUser.social_links?.email && (
            <a 
              href={`mailto:${displayUser.social_links.email}`}
              className="p-3 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <Mail className="h-6 w-6" />
            </a>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="animate-bounce">
          <button 
            onClick={() => scrollToSection('about')}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            aria-label="Scroll to about section"
          >
            <ChevronDown className="h-8 w-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;