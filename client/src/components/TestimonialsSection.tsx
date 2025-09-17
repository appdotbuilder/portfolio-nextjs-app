import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Quote,
  Linkedin,
  Play,
  Pause
} from 'lucide-react';
import type { Testimonial } from '../../../server/src/schema';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // Demo testimonials when none provided
  const demoTestimonials: Testimonial[] = [
    {
      id: '1',
      client_name: 'Sarah Johnson',
      client_photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b5ab?w=100&h=100&fit=crop&crop=face',
      client_position: 'CTO',
      client_company: 'TechStartup Inc.',
      testimonial: 'Working with John was an absolute pleasure. His attention to detail and technical expertise helped us build a robust platform that scaled beautifully. The project was delivered on time and exceeded our expectations. His communication skills and proactive approach made the entire development process smooth and efficient.',
      rating: 5,
      linkedin_url: 'https://linkedin.com/in/sarah-johnson',
      created_at: new Date('2023-11-15')
    },
    {
      id: '2',
      client_name: 'Michael Chen',
      client_photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      client_position: 'Product Manager',
      client_company: 'Digital Solutions Ltd.',
      testimonial: 'John transformed our complex requirements into an elegant, user-friendly application. His full-stack development skills and understanding of modern web technologies are impressive. He consistently delivered high-quality code and was always available for discussions and iterations.',
      rating: 5,
      linkedin_url: 'https://linkedin.com/in/michael-chen',
      created_at: new Date('2023-10-08')
    },
    {
      id: '3',
      client_name: 'Emily Rodriguez',
      client_photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      client_position: 'Founder & CEO',
      client_company: 'InnovateNow',
      testimonial: 'Exceptional developer with great problem-solving skills! John helped us build our MVP from scratch and his technical guidance was invaluable. The application performs flawlessly and our users love the interface. I would definitely work with him again on future projects.',
      rating: 5,
      linkedin_url: 'https://linkedin.com/in/emily-rodriguez',
      created_at: new Date('2023-09-22')
    },
    {
      id: '4',
      client_name: 'David Kim',
      client_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      client_position: 'Head of Engineering',
      client_company: 'CloudTech Corp',
      testimonial: 'John is a talented developer who brings both technical excellence and creative problem-solving to every project. He helped us optimize our application performance by 60% and implemented several key features that improved user engagement significantly.',
      rating: 5,
      linkedin_url: 'https://linkedin.com/in/david-kim',
      created_at: new Date('2023-08-10')
    },
    {
      id: '5',
      client_name: 'Lisa Thompson',
      client_photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
      client_position: 'Marketing Director',
      client_company: 'GrowthHub',
      testimonial: 'Professional, reliable, and incredibly skilled. John developed our company website and integrated it with our marketing tools seamlessly. His attention to user experience and performance optimization resulted in a 40% increase in our conversion rates.',
      rating: 4,
      linkedin_url: null,
      created_at: new Date('2023-07-18')
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : demoTestimonials;

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoplay || displayTestimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === displayTestimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoplay, displayTestimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? displayTestimonials.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === displayTestimonials.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
        }`}
      />
    ));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  if (displayTestimonials.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-white dark:to-indigo-100 bg-clip-text text-transparent">
            Client Testimonials
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Testimonials will be displayed here once available.
          </p>
        </div>
      </div>
    );
  }

  const currentTestimonial = displayTestimonials[currentIndex];

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-white dark:to-indigo-100 bg-clip-text text-transparent">
            What Clients Say
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-6">
            Testimonials from clients and colleagues I've had the pleasure of working with. 
            Their feedback drives my commitment to excellence.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Main Testimonial Display */}
        <div className="relative">
          <Card className="border-0 shadow-2xl bg-white dark:bg-slate-800 overflow-hidden">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-2">
                {/* Left Side - Testimonial Content */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <Quote className="h-12 w-12 text-indigo-600 dark:text-indigo-400 opacity-30" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-6">
                    {renderStars(currentTestimonial.rating)}
                    <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                      {currentTestimonial.rating}/5 stars
                    </span>
                  </div>

                  {/* Testimonial Text */}
                  <blockquote className="text-lg lg:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 italic">
                    "{currentTestimonial.testimonial}"
                  </blockquote>

                  {/* Client Info */}
                  <div className="flex items-center">
                    <Avatar className="h-16 w-16 mr-4">
                      <AvatarImage 
                        src={currentTestimonial.client_photo || ''} 
                        alt={currentTestimonial.client_name}
                      />
                      <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                        {currentTestimonial.client_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {currentTestimonial.client_name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {currentTestimonial.client_position}
                      </p>
                      <p className="text-indigo-600 dark:text-indigo-400 font-medium">
                        {currentTestimonial.client_company}
                      </p>
                    </div>
                    {currentTestimonial.linkedin_url && (
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <a 
                          href={currentTestimonial.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          aria-label={`View ${currentTestimonial.client_name}'s LinkedIn profile`}
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                  </div>

                  <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(currentTestimonial.created_at)}
                  </div>
                </div>

                {/* Right Side - Visual Element */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-8 lg:p-12 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-6 relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
                      <Avatar className="w-full h-full border-4 border-white dark:border-slate-800 shadow-xl">
                        <AvatarImage 
                          src={currentTestimonial.client_photo || ''} 
                          alt={currentTestimonial.client_name}
                        />
                        <AvatarFallback className="text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                          {currentTestimonial.client_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentTestimonial.client_name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {currentTestimonial.client_position}
                      </p>
                      <p className="text-indigo-600 dark:text-indigo-400 font-semibold">
                        {currentTestimonial.client_company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            {/* Previous/Next Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goToPrevious}
                disabled={displayTestimonials.length <= 1}
                className="h-12 w-12"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={goToNext}
                disabled={displayTestimonials.length <= 1}
                className="h-12 w-12"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Dot Indicators */}
            <div className="flex space-x-2">
              {displayTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-indigo-600 dark:bg-indigo-400'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Autoplay Toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsAutoplay(!isAutoplay)}
              className="h-12 w-12"
              title={isAutoplay ? 'Pause autoplay' : 'Start autoplay'}
            >
              {isAutoplay ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Additional Testimonials Preview */}
        {displayTestimonials.length > 1 && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
              More Reviews
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTestimonials.slice(0, 3).map((testimonial, index) => (
                <Card 
                  key={testimonial.id}
                  className={`border-0 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer ${
                    index === currentIndex ? 'ring-2 ring-indigo-600 dark:ring-indigo-400' : ''
                  }`}
                  onClick={() => goToSlide(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage 
                          src={testimonial.client_photo || ''} 
                          alt={testimonial.client_name}
                        />
                        <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 text-sm">
                          {testimonial.client_name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                          {testimonial.client_name}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {testimonial.client_company}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      {renderStars(testimonial.rating)}
                    </div>
                    
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                      "{testimonial.testimonial}"
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Statistics */}
        <Card className="mt-12 border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {displayTestimonials.length}
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Happy Clients</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {(displayTestimonials.reduce((sum, t) => sum + t.rating, 0) / displayTestimonials.length).toFixed(1)}
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Average Rating</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                  100%
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Satisfaction Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestimonialsSection;