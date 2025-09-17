import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Calendar, 
  Building, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import type { Experience } from '../../../server/src/schema';

interface ExperienceSectionProps {
  experience: Experience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experience }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Demo experience data when none provided
  const demoExperience: Experience[] = [
    {
      id: '1',
      company: 'TechCorp Solutions',
      position: 'Senior Full Stack Developer',
      location: 'San Francisco, CA',
      start_date: new Date('2022-01-15'),
      end_date: null,
      current: true,
      description: [
        'Led development of a microservices architecture serving 1M+ daily active users',
        'Architected and implemented real-time chat system using WebSocket and Redis',
        'Reduced application load time by 60% through performance optimization',
        'Mentored junior developers and established coding standards for the team',
        'Collaborated with product and design teams to deliver user-centric features'
      ],
      company_logo: null
    },
    {
      id: '2',
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      location: 'Remote',
      start_date: new Date('2020-06-01'),
      end_date: new Date('2021-12-31'),
      current: false,
      description: [
        'Built MVP from scratch using React, Node.js, and PostgreSQL',
        'Implemented CI/CD pipeline reducing deployment time by 80%',
        'Developed RESTful APIs serving mobile and web applications',
        'Worked directly with founders to define product requirements',
        'Scaled application to handle 10k+ concurrent users'
      ],
      company_logo: null
    },
    {
      id: '3',
      company: 'Digital Agency Pro',
      position: 'Frontend Developer',
      location: 'New York, NY',
      start_date: new Date('2019-03-01'),
      end_date: new Date('2020-05-31'),
      current: false,
      description: [
        'Developed responsive websites for 20+ clients across various industries',
        'Implemented modern CSS techniques and animations for enhanced UX',
        'Collaborated with designers to pixel-perfect implementation',
        'Optimized websites for SEO resulting in 40% increase in organic traffic',
        'Integrated third-party APIs and payment gateways'
      ],
      company_logo: null
    },
    {
      id: '4',
      company: 'Freelance',
      position: 'Web Developer',
      location: 'Remote',
      start_date: new Date('2018-01-01'),
      end_date: new Date('2019-02-28'),
      current: false,
      description: [
        'Delivered custom web solutions for small to medium businesses',
        'Built e-commerce platforms using WordPress and WooCommerce',
        'Created custom themes and plugins tailored to client needs',
        'Managed client relationships and project timelines independently'
      ],
      company_logo: null
    }
  ];

  const displayExperience = experience.length > 0 ? experience : demoExperience;

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const getDuration = (startDate: Date, endDate: Date | null) => {
    const end = endDate || new Date();
    const months = (end.getFullYear() - startDate.getFullYear()) * 12 + 
                   (end.getMonth() - startDate.getMonth());
    
    if (months < 12) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }
    
    return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  };

  const ExperienceCard: React.FC<{ exp: Experience; index: number }> = ({ exp, index }) => {
    const isExpanded = expandedItems.has(exp.id);
    const isEven = index % 2 === 0;
    
    return (
      <div className={`flex ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-8 lg:gap-12`}>
        {/* Timeline dot and line */}
        <div className="hidden lg:flex flex-col items-center">
          <div className={`w-4 h-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 ${
            exp.current ? 'ring-4 ring-indigo-200 dark:ring-indigo-800' : ''
          }`}></div>
          {index < displayExperience.length - 1 && (
            <div className="w-px h-24 bg-gradient-to-b from-indigo-600 to-purple-600 opacity-30 mt-4"></div>
          )}
        </div>

        {/* Content Card */}
        <div className="flex-1 lg:max-w-md">
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
            <CardContent className="p-6">
              {/* Company Logo & Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                    {exp.company_logo ? (
                      <img 
                        src={exp.company_logo} 
                        alt={`${exp.company} logo`}
                        className="w-8 h-8 object-contain"
                      />
                    ) : (
                      <Building className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {exp.position}
                    </h3>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                      {exp.company}
                    </p>
                  </div>
                </div>
                {exp.current && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Current
                  </Badge>
                )}
              </div>

              {/* Location and Date */}
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{exp.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <Badge variant="outline" className="text-xs">
                  {getDuration(exp.start_date, exp.end_date)}
                </Badge>
              </div>

              {/* Description */}
              <div className="space-y-2">
                {exp.description.slice(0, isExpanded ? exp.description.length : 2).map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              {/* Expand/Collapse button */}
              {exp.description.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(exp.id)}
                  className="mt-4 p-0 h-auto font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Show more ({exp.description.length - 2} more)
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Spacer for timeline alignment */}
        <div className="hidden lg:block lg:max-w-md flex-1"></div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-white dark:to-indigo-100 bg-clip-text text-transparent">
            Professional Journey
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-6">
            My career path and the exciting challenges I've tackled along the way. Each role has shaped my expertise and passion for creating exceptional digital experiences.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Mobile Timeline Line */}
          <div className="lg:hidden absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-600 to-purple-600 opacity-30"></div>
          
          <div className="space-y-12 lg:space-y-16">
            {displayExperience.map((exp, index) => (
              <div key={exp.id} className="relative">
                {/* Mobile Timeline Dot */}
                <div className={`lg:hidden absolute left-4 w-4 h-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 ${
                  exp.current ? 'ring-4 ring-indigo-200 dark:ring-indigo-800' : ''
                } transform -translate-x-1/2`}></div>
                
                {/* Mobile Content */}
                <div className="lg:hidden ml-12">
                  <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                            {exp.position}
                          </h3>
                          <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                            {exp.company}
                          </p>
                        </div>
                        {exp.current && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Current
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{exp.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <Badge variant="outline" className="text-xs">
                          {getDuration(exp.start_date, exp.end_date)}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        {exp.description.slice(0, expandedItems.has(exp.id) ? exp.description.length : 2).map((item, idx) => (
                          <div key={idx} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>

                      {exp.description.length > 2 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(exp.id)}
                          className="mt-4 p-0 h-auto font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                        >
                          {expandedItems.has(exp.id) ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Show less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Show more ({exp.description.length - 2} more)
                            </>
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:block">
                  <ExperienceCard exp={exp} index={index} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <Card className="mt-16 border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {new Date().getFullYear() - displayExperience[displayExperience.length - 1].start_date.getFullYear()}+
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Years of Experience</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {displayExperience.length}
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Companies Worked</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                  50+
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Projects Delivered</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExperienceSection;