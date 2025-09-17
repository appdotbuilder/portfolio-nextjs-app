import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ExternalLink, 
  Calendar, 
  Award, 
  Verified,
  Search,
  Star
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { Certificate } from '../../../server/src/schema';

interface CertificatesSectionProps {
  certificates: Certificate[];
}

const CertificatesSection: React.FC<CertificatesSectionProps> = ({ certificates }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Demo certificates when none provided
  const demoCertificates: Certificate[] = [
    {
      id: '1',
      title: 'AWS Certified Solutions Architect - Professional',
      issuer: 'Amazon Web Services',
      issue_date: new Date('2023-09-15'),
      credential_id: 'AWS-SAP-2023-091501',
      verify_url: 'https://aws.amazon.com/verification/AWS-SAP-2023-091501',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
      category: 'Cloud Computing'
    },
    {
      id: '2',
      title: 'Google Cloud Professional Cloud Architect',
      issuer: 'Google Cloud',
      issue_date: new Date('2023-07-22'),
      credential_id: 'GCP-PCA-2023-072201',
      verify_url: 'https://cloud.google.com/certification/verify/GCP-PCA-2023-072201',
      image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop',
      category: 'Cloud Computing'
    },
    {
      id: '3',
      title: 'Meta Frontend Developer Professional Certificate',
      issuer: 'Meta (Facebook)',
      issue_date: new Date('2023-05-10'),
      credential_id: 'META-FE-2023-051001',
      verify_url: 'https://coursera.org/verify/META-FE-2023-051001',
      image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=300&fit=crop',
      category: 'Frontend Development'
    },
    {
      id: '4',
      title: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation',
      issue_date: new Date('2023-03-18'),
      credential_id: 'CKA-2023-031801',
      verify_url: 'https://training.linuxfoundation.org/verification/CKA-2023-031801',
      image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400&h=300&fit=crop',
      category: 'DevOps'
    },
    {
      id: '5',
      title: 'MongoDB Certified Developer Associate',
      issuer: 'MongoDB University',
      issue_date: new Date('2023-01-25'),
      credential_id: 'MDB-DEV-2023-012501',
      verify_url: 'https://university.mongodb.com/verify/MDB-DEV-2023-012501',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop',
      category: 'Database'
    },
    {
      id: '6',
      title: 'Docker Certified Associate',
      issuer: 'Docker, Inc.',
      issue_date: new Date('2022-11-12'),
      credential_id: 'DCA-2022-111201',
      verify_url: 'https://docker.com/verify/DCA-2022-111201',
      image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=300&fit=crop',
      category: 'DevOps'
    },
    {
      id: '7',
      title: 'React - The Complete Guide',
      issuer: 'Udemy',
      issue_date: new Date('2022-08-20'),
      credential_id: 'UC-REACT-2022-082001',
      verify_url: null,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
      category: 'Frontend Development'
    },
    {
      id: '8',
      title: 'Scrum Master Certified (SMC)',
      issuer: 'Scrum Alliance',
      issue_date: new Date('2022-06-15'),
      credential_id: 'SMC-2022-061501',
      verify_url: 'https://scrumalliance.org/verify/SMC-2022-061501',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      category: 'Project Management'
    }
  ];

  const displayCertificates = certificates.length > 0 ? certificates : demoCertificates;

  // Get unique categories
  const categories = ['all', ...new Set(displayCertificates.map(cert => cert.category).filter((category): category is string => Boolean(category)))];

  // Filter certificates
  const filteredCertificates = displayCertificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.issuer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cert.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long'
    });
  };

  const getIssuedThisYear = (date: Date) => {
    return date.getFullYear() === new Date().getFullYear();
  };

  const CertificateCard: React.FC<{ certificate: Certificate }> = ({ certificate }) => (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden">
      <div className="relative">
        <img 
          src={certificate.image} 
          alt={certificate.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* New Badge for certificates issued this year */}
        {getIssuedThisYear(certificate.issue_date) && (
          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
            <Star className="h-3 w-3 mr-1" />
            New
          </Badge>
        )}

        {/* Verified Badge */}
        {certificate.verify_url && (
          <Badge className="absolute top-3 right-3 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            <Verified className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
      </div>

      <CardContent className="p-6">
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
            {certificate.title}
          </h3>
          <p className="text-indigo-600 dark:text-indigo-400 font-medium">
            {certificate.issuer}
          </p>
        </div>

        {certificate.category && (
          <Badge 
            variant="secondary"
            className="mb-3 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
          >
            {certificate.category}
          </Badge>
        )}

        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Issued {formatDate(certificate.issue_date)}</span>
        </div>

        {certificate.credential_id && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-mono bg-gray-50 dark:bg-gray-800 p-2 rounded">
            <strong>Credential ID:</strong> {certificate.credential_id}
          </div>
        )}

        <div className="flex space-x-2">
          {certificate.verify_url && (
            <Button size="sm" className="flex-1" asChild>
              <a href={certificate.verify_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Verify
              </a>
            </Button>
          )}
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="flex-1">
                <Award className="h-3 w-3 mr-1" />
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{certificate.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <img 
                  src={certificate.image} 
                  alt={certificate.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Issuing Organization</h4>
                    <p className="text-gray-600 dark:text-gray-300">{certificate.issuer}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Issue Date</h4>
                    <p className="text-gray-600 dark:text-gray-300">{formatDate(certificate.issue_date)}</p>
                  </div>
                  
                  {certificate.category && (
                    <div>
                      <h4 className="font-semibold mb-2">Category</h4>
                      <Badge variant="secondary">{certificate.category}</Badge>
                    </div>
                  )}
                  
                  {certificate.credential_id && (
                    <div>
                      <h4 className="font-semibold mb-2">Credential ID</h4>
                      <p className="text-gray-600 dark:text-gray-300 font-mono text-sm">{certificate.credential_id}</p>
                    </div>
                  )}
                </div>
                
                {certificate.verify_url && (
                  <div className="pt-4 border-t">
                    <Button asChild>
                      <a href={certificate.verify_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Verify Certificate
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
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
            Certifications & Achievements
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-6">
            Professional certifications and achievements that validate my expertise and commitment to continuous learning in the tech industry.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto rounded-full"></div>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-700"
            />
          </div>

          {/* Category Tabs */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all duration-200"
              >
                All
              </TabsTrigger>
              {categories.slice(1).map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white transition-all duration-200 text-sm"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCertificates.map((certificate) => (
                  <CertificateCard key={certificate.id} certificate={certificate} />
                ))}
              </div>
              
              {filteredCertificates.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 dark:text-gray-600 mb-4">
                    <Award className="h-16 w-16 mx-auto" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    No certificates found matching your criteria.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Statistics */}
        <Card className="mt-12 border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {displayCertificates.length}
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Total Certifications</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {displayCertificates.filter(c => getIssuedThisYear(c.issue_date)).length}
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Earned This Year</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                  {displayCertificates.filter(c => c.verify_url).length}
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Verified</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  {categories.length - 1}
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">Skill Areas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="max-w-2xl mx-auto">
                <Award className="h-12 w-12 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Continuous Learning Journey
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  I believe in staying updated with the latest technologies and industry best practices. 
                  These certifications represent my commitment to professional growth and excellence.
                </p>
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  View All Certifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CertificatesSection;