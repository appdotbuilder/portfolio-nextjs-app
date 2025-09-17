import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Search, Code, Lightbulb, Settings, Globe } from 'lucide-react';
import type { Skill } from '../../../server/src/schema';

interface SkillsSectionProps {
  skills: Skill[];
}

const SkillsSection: React.FC<SkillsSectionProps> = ({ skills }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [animatedLevels, setAnimatedLevels] = useState<Record<string, number>>({});

  // Demo skills when none provided
  const demoSkills: Skill[] = [
    // Technical Skills
    { id: '1', name: 'React', category: 'Technical', level: 95, icon: '⚛️', experience: 4 },
    { id: '2', name: 'TypeScript', category: 'Technical', level: 90, icon: '📘', experience: 3 },
    { id: '3', name: 'Node.js', category: 'Technical', level: 88, icon: '🟢', experience: 4 },
    { id: '4', name: 'Python', category: 'Technical', level: 85, icon: '🐍', experience: 3 },
    { id: '5', name: 'PostgreSQL', category: 'Technical', level: 82, icon: '🐘', experience: 3 },
    { id: '6', name: 'GraphQL', category: 'Technical', level: 78, icon: '💜', experience: 2 },
    { id: '7', name: 'AWS', category: 'Technical', level: 75, icon: '☁️', experience: 2 },
    { id: '8', name: 'Docker', category: 'Technical', level: 80, icon: '🐳', experience: 2 },

    // Tools
    { id: '9', name: 'VS Code', category: 'Tools', level: 95, icon: '💙', experience: 5 },
    { id: '10', name: 'Git', category: 'Tools', level: 90, icon: '📊', experience: 5 },
    { id: '11', name: 'Figma', category: 'Tools', level: 70, icon: '🎨', experience: 2 },
    { id: '12', name: 'Postman', category: 'Tools', level: 85, icon: '📬', experience: 3 },
    { id: '13', name: 'Jest', category: 'Tools', level: 80, icon: '🧪', experience: 3 },

    // Soft Skills
    { id: '14', name: 'Problem Solving', category: 'Soft Skills', level: 92, icon: '🧩', experience: 5 },
    { id: '15', name: 'Communication', category: 'Soft Skills', level: 88, icon: '💬', experience: 5 },
    { id: '16', name: 'Team Leadership', category: 'Soft Skills', level: 85, icon: '👥', experience: 3 },
    { id: '17', name: 'Project Management', category: 'Soft Skills', level: 80, icon: '📋', experience: 3 },

    // Languages
    { id: '18', name: 'English', category: 'Languages', level: 100, icon: '🇺🇸', experience: null },
    { id: '19', name: 'Spanish', category: 'Languages', level: 75, icon: '🇪🇸', experience: null },
    { id: '20', name: 'French', category: 'Languages', level: 60, icon: '🇫🇷', experience: null },
  ];

  const displaySkills = skills.length > 0 ? skills : demoSkills;

  const categories = [
    { id: 'all', label: 'All Skills', icon: <Globe className="h-4 w-4" /> },
    { id: 'Technical', label: 'Technical', icon: <Code className="h-4 w-4" /> },
    { id: 'Tools', label: 'Tools', icon: <Settings className="h-4 w-4" /> },
    { id: 'Soft Skills', label: 'Soft Skills', icon: <Lightbulb className="h-4 w-4" /> },
    { id: 'Languages', label: 'Languages', icon: <Globe className="h-4 w-4" /> },
  ];

  // Filter skills based on search and category
  useEffect(() => {
    setFilteredSkills(displaySkills.filter(skill =>
      skill.name.toLowerCase().includes(searchTerm.toLowerCase())
    ));
  }, [searchTerm, displaySkills]);

  // Animate skill levels when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      const levels: Record<string, number> = {};
      displaySkills.forEach(skill => {
        levels[skill.id] = skill.level;
      });
      setAnimatedLevels(levels);
    }, 300);

    return () => clearTimeout(timer);
  }, [displaySkills]);

  const getSkillsByCategory = (category: string) => {
    if (category === 'all') return filteredSkills;
    return filteredSkills.filter(skill => skill.category === category);
  };



  const SkillCard: React.FC<{ skill: Skill }> = ({ skill }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md hover:scale-105">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{skill.icon}</span>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {skill.name}
              </h3>
              <Badge 
                variant="secondary" 
                className="text-xs mt-1 bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
              >
                {skill.category}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {skill.level}%
            </div>
            {skill.experience && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {skill.experience} years
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Proficiency</span>
            <span>{skill.level}%</span>
          </div>
          <Progress 
            value={animatedLevels[skill.id] || 0}
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-white dark:to-indigo-100 bg-clip-text text-transparent">
            Skills & Expertise
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-6">
            Here's a comprehensive overview of my technical skills, tools I work with, and soft skills that help me deliver exceptional results.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* Skills Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-8 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center space-x-2 data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all duration-200"
              >
                {category.icon}
                <span className="hidden sm:inline">{category.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getSkillsByCategory(category.id).map((skill) => (
                  <SkillCard key={skill.id} skill={skill} />
                ))}
              </div>
              
              {getSkillsByCategory(category.id).length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-600 mb-4">
                    <Search className="h-16 w-16 mx-auto" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    No skills found matching your search.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Skill Summary */}
        <Card className="mt-12 border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {displaySkills.length}
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Total Skills</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {displaySkills.filter(s => s.category === 'Technical').length}
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Technical Skills</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                  {Math.round(displaySkills.reduce((acc, skill) => acc + skill.level, 0) / displaySkills.length)}%
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Average Proficiency</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  5+
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Years Experience</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SkillsSection;