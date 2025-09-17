import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ExternalLink, 
  Github, 
  Eye, 
  Star, 
  Calendar,
  Zap,
  Globe,
  Code,
  Smartphone,
  Database
} from 'lucide-react';
import type { Project } from '../../../server/src/schema';

interface ProjectsSectionProps {
  projects: Project[];
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Demo projects when none provided
  const demoProjects: Project[] = [
    {
      id: '1',
      title: 'E-Commerce Platform',
      description: 'A modern, full-featured e-commerce platform built with React, Node.js, and PostgreSQL. Features include user authentication, product catalog, shopping cart, payment integration, and admin dashboard.',
      thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop'
      ],
      tech_stack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
      live_url: 'https://demo-ecommerce.com',
      github_url: 'https://github.com/username/ecommerce-platform',
      featured: true,
      view_count: 1250,
      created_at: new Date('2023-08-15')
    },
    {
      id: '2',
      title: 'Task Management App',
      description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features. Built using modern web technologies.',
      thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop'
      ],
      tech_stack: ['React', 'Redux', 'Socket.io', 'Express', 'MongoDB'],
      live_url: 'https://taskflow-demo.com',
      github_url: 'https://github.com/username/task-manager',
      featured: true,
      view_count: 892,
      created_at: new Date('2023-06-20')
    },
    {
      id: '3',
      title: 'Weather Dashboard',
      description: 'A responsive weather dashboard that provides real-time weather information, forecasts, and interactive maps. Features include geolocation, favorite locations, and weather alerts.',
      thumbnail: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=500&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&h=600&fit=crop'
      ],
      tech_stack: ['Vue.js', 'Vuex', 'OpenWeatherMap API', 'Chart.js'],
      live_url: 'https://weather-dash-demo.com',
      github_url: 'https://github.com/username/weather-dashboard',
      featured: false,
      view_count: 634,
      created_at: new Date('2023-04-10')
    },
    {
      id: '4',
      title: 'Social Media Analytics',
      description: 'A comprehensive analytics dashboard for social media management. Tracks engagement metrics, audience growth, and provides actionable insights.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
      ],
      tech_stack: ['React', 'D3.js', 'Python', 'Flask', 'PostgreSQL'],
      live_url: null,
      github_url: 'https://github.com/username/social-analytics',
      featured: false,
      view_count: 445,
      created_at: new Date('2023-02-25')
    },
    {
      id: '5',
      title: 'Recipe Finder App',
      description: 'A mobile-first recipe discovery app with ingredient-based search, nutritional information, and meal planning features. Integrates with multiple recipe APIs.',
      thumbnail: 'https://images.unsplash.com/photo-1556909114-4098f4ccfa77?w=500&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1556909114-4098f4ccfa77?w=800&h=600&fit=crop'
      ],
      tech_stack: ['React Native', 'Expo', 'Firebase', 'Spoonacular API'],
      live_url: 'https://recipe-finder-demo.com',
      github_url: 'https://github.com/username/recipe-finder',
      featured: false,
      view_count: 723,
      created_at: new Date('2023-01-12')
    },
    {
      id: '6',
      title: 'Portfolio Website',
      description: 'A modern, responsive portfolio website built with React and TypeScript. Features smooth animations, dark mode, and optimized performance.',
      thumbnail: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=500&h=300&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop'
      ],
      tech_stack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      live_url: 'https://portfolio-demo.com',
      github_url: 'https://github.com/username/portfolio',
      featured: true,
      view_count: 1567,
      created_at: new Date('2022-12-05')
    }
  ];

  const displayProjects = projects.length > 0 ? projects : demoProjects;
  const featuredProjects = displayProjects.filter(p => p.featured);

  const categories = [
    { id: 'all', label: 'All Projects', icon: <Globe className="h-4 w-4" /> },
    { id: 'web', label: 'Web Apps', icon: <Code className="h-4 w-4" /> },
    { id: 'mobile', label: 'Mobile', icon: <Smartphone className="h-4 w-4" /> },
    { id: 'backend', label: 'Backend', icon: <Database className="h-4 w-4" /> },
  ];

  const getFilteredProjects = () => {
    if (selectedFilter === 'all') return displayProjects;
    
    const filterMap: Record<string, string[]> = {
      web: ['React', 'Vue.js', 'Angular', 'Next.js'],
      mobile: ['React Native', 'Flutter', 'Ionic'],
      backend: ['Node.js', 'Python', 'Django', 'Flask', 'Express'],
    };

    const filterTechs = filterMap[selectedFilter] || [];
    return displayProjects.filter(project => 
      project.tech_stack.some(tech => 
        filterTechs.some(filterTech => 
          tech.toLowerCase().includes(filterTech.toLowerCase())
        )
      )
    );
  };

  const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-md">
      {/* Project Image */}
      <div className="relative overflow-hidden">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
        
        {/* Featured Badge */}
        {project.featured && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}

        {/* View Count */}
        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
          <Eye className="h-3 w-3" />
          <span>{project.view_count.toLocaleString()}</span>
        </div>

        {/* Overlay Links */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex space-x-3">
            {project.live_url && (
              <Button
                size="sm"
                className="bg-white/90 text-gray-900 hover:bg-white"
                asChild
              >
                <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.github_url && (
              <Button
                size="sm"
                variant="outline"
                className="bg-black/80 text-white border-white/20 hover:bg-black hover:text-white"
                asChild
              >
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-1" />
                  Code
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {project.title}
          </h3>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {project.created_at.getFullYear()}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1 mb-4">
          {project.tech_stack.slice(0, 4).map((tech) => (
            <Badge 
              key={tech}
              variant="secondary"
              className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
            >
              {tech}
            </Badge>
          ))}
          {project.tech_stack.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{project.tech_stack.length - 4} more
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {project.live_url && (
            <Button size="sm" variant="outline" asChild className="flex-1">
              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Live Demo
              </a>
            </Button>
          )}
          {project.github_url && (
            <Button size="sm" variant="outline" asChild className="flex-1">
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="h-3 w-3 mr-1" />
                Code
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const ProjectModal: React.FC<{ project: Project }> = ({ project }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto">
          <ProjectCard project={project} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{project.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`${project.title} screenshot ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About This Project</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tech Stack */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech) => (
                <Badge 
                  key={tech}
                  className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex space-x-4 pt-4 border-t">
            {project.live_url && (
              <Button asChild>
                <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live Project
                </a>
              </Button>
            )}
            {project.github_url && (
              <Button variant="outline" asChild>
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  View Source Code
                </a>
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-white dark:to-indigo-100 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-6">
            A showcase of my recent work and side projects. Each project represents a unique challenge and learning opportunity.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Featured Projects Highlight */}
        {featuredProjects.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
              <Zap className="h-6 w-6 text-yellow-500 mr-2" />
              Featured Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectModal key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {/* Project Categories */}
        <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-8 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm">
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
                {getFilteredProjects().map((project) => (
                  <ProjectModal key={project.id} project={project} />
                ))}
              </div>
              
              {getFilteredProjects().length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-600 mb-4">
                    <Code className="h-16 w-16 mx-auto" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    No projects found in this category.
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Call to Action */}
        <Card className="mt-16 border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Interested in Working Together?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              I'm always excited to take on new challenges and create amazing digital experiences. 
              Let's discuss your next project!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                Start a Project
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
                asChild
              >
                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4 mr-2" />
                  View All on GitHub
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectsSection;