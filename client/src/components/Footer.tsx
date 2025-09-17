import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  ArrowUp, 
  Heart,
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { trpc } from '@/utils/trpc';
import type { CreateNewsletterSubscriptionInput } from '../../../server/src/schema';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' }
  ];

  const projectLinks = [
    { label: 'All Projects', href: '#projects' },
    { label: 'Web Applications', href: '#projects' },
    { label: 'Mobile Apps', href: '#projects' },
    { label: 'Open Source', href: 'https://github.com' }
  ];

  const socialLinks = [
    {
      icon: <Github className="h-5 w-5" />,
      label: 'GitHub',
      href: 'https://github.com',
      username: '@johndoe'
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      label: 'LinkedIn',
      href: 'https://linkedin.com',
      username: 'in/johndoe'
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      label: 'Twitter',
      href: 'https://twitter.com',
      username: '@johndoe'
    },
    {
      icon: <Mail className="h-5 w-5" />,
      label: 'Email',
      href: 'mailto:john.doe@example.com',
      username: 'john.doe@example.com'
    }
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    setSubscriptionStatus('idle');

    try {
      const subscriptionData: CreateNewsletterSubscriptionInput = { email };
      await trpc.createNewsletterSubscription.mutate(subscriptionData);
      setSubscriptionStatus('success');
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription failed:', error);
      setSubscriptionStatus('error');
    } finally {
      setIsSubscribing(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand and Description */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  John Doe
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Full Stack Developer
                </p>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 max-w-md">
                Passionate about creating exceptional digital experiences through clean code, 
                modern design, and innovative solutions. Let's build something amazing together.
              </p>

              {/* Newsletter Subscription */}
              <div className="max-w-md">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Stay Updated
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Get the latest updates on my projects and tech insights.
                </p>
                
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="flex space-x-2">
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      disabled={isSubscribing}
                      required
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={isSubscribing || !email}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      {isSubscribing ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Status Messages */}
                  {subscriptionStatus === 'success' && (
                    <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Successfully subscribed! Thank you.</span>
                    </div>
                  )}

                  {subscriptionStatus === 'error' && (
                    <div className="flex items-center text-red-600 dark:text-red-400 text-sm">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>Subscription failed. Please try again.</span>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleLinkClick(link.href)}
                      className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 mt-8">
                Projects
              </h4>
              <ul className="space-y-3">
                {projectLinks.map((link, index) => (
                  <li key={index}>
                    {link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <button
                        onClick={() => handleLinkClick(link.href)}
                        className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Let's Connect
              </h4>
              
              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                    Email me
                  </p>
                  <a 
                    href="mailto:john.doe@example.com"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    john.doe@example.com
                  </a>
                </div>
                
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                    Call me
                  </p>
                  <a 
                    href="tel:+15551234567"
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>

              {/* Social Media Links */}
              <div>
                <h5 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                  Follow Me
                </h5>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="icon"
                      asChild
                      className="hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={social.label}
                      >
                        {social.icon}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-200 dark:bg-gray-700" />

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 text-sm">
              <span>© {currentYear} John Doe. Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>using React & TypeScript</span>
            </div>

            {/* Additional Info */}
            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <span>Last updated: {new Date().toLocaleDateString()}</span>
              <Separator orientation="vertical" className="h-4 bg-gray-300 dark:bg-gray-600" />
              <button
                onClick={scrollToTop}
                className="flex items-center space-x-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="Back to top"
              >
                <ArrowUp className="h-4 w-4" />
                <span>Back to top</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      <Button
        onClick={scrollToTop}
        size="icon"
        className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 z-40"
        title="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </footer>
  );
};

export default Footer;