import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, MapPin, Mail, Phone, Calendar, User as UserIcon, Briefcase } from 'lucide-react';
import type { User } from '../../../server/src/schema';

interface AboutSectionProps {
  user: User | null;
}

const AboutSection: React.FC<AboutSectionProps> = ({ user }) => {
  const [counters, setCounters] = useState({
    projects: 0,
    experience: 0,
    clients: 0,
    awards: 0
  });

  // Demo data for when user is null
  const demoUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'I am a passionate Full Stack Developer with 5+ years of experience in creating innovative web applications. I specialize in React, Node.js, and modern web technologies. I love turning complex problems into simple, beautiful designs and user-friendly experiences.',
    avatar: null,
    created_at: new Date('2019-01-15')
  };

  const displayUser = user || demoUser;

  // Animate counters on component mount
  useEffect(() => {
    const targets = { projects: 50, experience: 5, clients: 30, awards: 8 };
    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const stepTime = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounters({
        projects: Math.floor(targets.projects * progress),
        experience: Math.floor(targets.experience * progress),
        clients: Math.floor(targets.clients * progress),
        awards: Math.floor(targets.awards * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setCounters(targets); // Ensure final values are exact
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  const personalInfo = [
    {
      icon: <UserIcon className="h-5 w-5" />,
      label: 'Full Name',
      value: displayUser.name
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: 'Experience',
      value: `${new Date().getFullYear() - displayUser.created_at.getFullYear()}+ Years`
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'Email',
      value: displayUser.email,
      link: `mailto:${displayUser.email}`
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567'
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: 'Location',
      value: 'San Francisco, CA'
    },
    {
      icon: <Briefcase className="h-5 w-5" />,
      label: 'Status',
      value: 'Available for hire',
      badge: true
    }
  ];

  const stats = [
    {
      number: counters.projects,
      label: 'Projects Completed',
      suffix: '+'
    },
    {
      number: counters.experience,
      label: 'Years Experience',
      suffix: '+'
    },
    {
      number: counters.clients,
      label: 'Happy Clients',
      suffix: '+'
    },
    {
      number: counters.awards,
      label: 'Awards Won',
      suffix: ''
    }
  ];

  const technologies = [
    'React', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 
    'AWS', 'Docker', 'GraphQL', 'Next.js', 'TailwindCSS'
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-white dark:to-indigo-100 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Image and Personal Info */}
          <div className="space-y-8">
            {/* Professional Photo */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-8 flex items-center justify-center">
                {displayUser.avatar ? (
                  <img 
                    src={displayUser.avatar} 
                    alt={displayUser.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-6xl font-bold text-white">
                      {displayUser.name.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full opacity-20"></div>
            </div>

            {/* Personal Information Cards */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                  Personal Information
                </h3>
                <div className="space-y-4">
                  {personalInfo.map((info, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {info.label}
                        </p>
                        <div className="flex items-center space-x-2">
                          {info.link ? (
                            <a 
                              href={info.link}
                              className="font-medium text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="font-medium text-gray-900 dark:text-white">
                              {info.value}
                            </p>
                          )}
                          {info.badge && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              Available
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Download CV Button */}
            <Button 
              size="lg"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Download className="mr-2 h-5 w-5" />
              Download My Resume
            </Button>
          </div>

          {/* Right Column - Story and Stats */}
          <div className="space-y-8">
            {/* Bio/Story */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                My Story
              </h3>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {displayUser.bio}
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  When I'm not coding, you can find me exploring new technologies, contributing to open source projects, 
                  or sharing knowledge through blog posts and community talks. I believe in continuous learning and 
                  staying updated with the latest industry trends.
                </p>
              </div>
            </div>

            {/* Statistics */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
              <CardContent className="p-8">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                        {stat.number}{stat.suffix}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Technologies */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                Technologies I Love
              </h3>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <Badge 
                    key={index}
                    variant="secondary"
                    className="px-3 py-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors cursor-default"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Fun Facts */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Fun Facts
                </h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                    <span>☕ Coffee enthusiast - I run on caffeine and clean code</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-purple-600 rounded-full"></span>
                    <span>🎮 Gaming in spare time - strategy games are my favorite</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-pink-600 rounded-full"></span>
                    <span>📚 Always learning - currently exploring AI/ML</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                    <span>🌍 Love traveling and experiencing new cultures</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;