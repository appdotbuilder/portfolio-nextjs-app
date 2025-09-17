import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  Github,
  Linkedin,
  Twitter,
  CheckCircle,
  AlertCircle,
  Paperclip
} from 'lucide-react';
import { trpc } from '@/utils/trpc';
import type { CreateContactMessageInput } from '../../../server/src/schema';

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<CreateContactMessageInput>({
    name: '',
    email: '',
    subject: '',
    message: '',
    attachment: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email',
      value: 'john.doe@example.com',
      link: 'mailto:john.doe@example.com',
      description: 'Drop me a line anytime!'
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Phone',
      value: '+1 (555) 123-4567',
      link: 'tel:+15551234567',
      description: 'Available Mon-Fri, 9AM-6PM PST'
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Location',
      value: 'San Francisco, CA',
      link: 'https://maps.google.com/?q=San+Francisco,+CA',
      description: 'Open to remote opportunities'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Response Time',
      value: 'Within 24 hours',
      link: null,
      description: 'Usually much faster!'
    }
  ];

  const socialLinks = [
    {
      icon: <Github className="h-5 w-5" />,
      name: 'GitHub',
      url: 'https://github.com',
      color: 'hover:bg-gray-100 dark:hover:bg-gray-800'
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      color: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600'
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      name: 'Twitter',
      url: 'https://twitter.com',
      color: 'hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:text-sky-600'
    },
    {
      icon: <Mail className="h-5 w-5" />,
      name: 'Email',
      url: 'mailto:john.doe@example.com',
      color: 'hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600'
    }
  ];

  const handleInputChange = (field: keyof CreateContactMessageInput, value: string) => {
    setFormData((prev: CreateContactMessageInput) => ({
      ...prev,
      [field]: value || (field === 'attachment' ? null : '')
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await trpc.createContactMessage.mutate(formData);
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        attachment: null
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-indigo-900 dark:from-white dark:to-indigo-100 bg-clip-text text-transparent">
            Let's Work Together
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-6">
            Have a project in mind? I'd love to hear about it. Send me a message and let's start building something amazing together.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-white">
                  Send me a message
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          handleInputChange('name', e.target.value)
                        }
                        placeholder="Your full name"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          handleInputChange('email', e.target.value)
                        }
                        placeholder="your.email@example.com"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                        handleInputChange('subject', e.target.value)
                      }
                      placeholder="What's this about?"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                        handleInputChange('message', e.target.value)
                      }
                      placeholder="Tell me about your project, timeline, budget, or anything else you'd like to discuss..."
                      rows={6}
                      required
                      disabled={isSubmitting}
                      className="resize-none"
                    />
                  </div>

                  {/* File Attachment */}
                  <div className="space-y-2">
                    <Label htmlFor="attachment">Attachment (Optional)</Label>
                    <div className="relative">
                      <Input
                        id="attachment"
                        type="file"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            // In a real app, you'd upload the file and get a URL
                            handleInputChange('attachment', file.name);
                          }
                        }}
                        disabled={isSubmitting}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-300"
                      />
                      <Paperclip className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Max file size: 10MB. Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-6 text-lg font-medium"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                      <p className="text-green-800 dark:text-green-300">
                        Message sent successfully! I'll get back to you within 24 hours.
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="flex items-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
                      <p className="text-red-800 dark:text-red-300">
                        Failed to send message. Please try again or contact me directly at john.doe@example.com
                      </p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {info.title}
                        </h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            target={info.link.startsWith('http') ? '_blank' : undefined}
                            rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-medium"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-gray-900 dark:text-white font-medium">
                            {info.value}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {info.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Social Links */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Connect with me
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {socialLinks.map((social, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      asChild
                      className={`h-12 justify-start ${social.color}`}
                    >
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-3"
                      >
                        {social.icon}
                        <span>{social.name}</span>
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Availability Status */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Available for New Projects
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  I'm currently taking on new freelance projects and contract work. 
                  Let's discuss how I can help bring your ideas to life.
                </p>
                <div className="flex items-center justify-center space-x-2 text-sm text-green-700 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">Available now</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Response Promise */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  What happens next?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      1
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      I'll review your message and respond within 24 hours
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      2
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      We'll schedule a call to discuss your project in detail
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      3
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      I'll provide a detailed proposal and timeline
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;