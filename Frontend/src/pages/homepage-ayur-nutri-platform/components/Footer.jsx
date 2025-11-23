import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { name: 'Intelligence Center', path: '/ayurvedic-intelligence-center' },
        { name: 'Professional Portal', path: '/professional-dashboard-portal' },
        { name: 'Wellness Hub', path: '/personal-wellness-hub' },
        { name: 'Research Library', path: '/clinical-research-library' },
        { name: 'Success Stories', path: '/patient-success-stories' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', path: '/docs' },
        { name: 'API Reference', path: '/api' },
        { name: 'Help Center', path: '/help' },
        { name: 'Training Materials', path: '/training' },
        { name: 'Webinars', path: '/webinars' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Careers', path: '/careers' },
        { name: 'Press Kit', path: '/press' },
        { name: 'Partners', path: '/partners' },
        { name: 'Contact', path: '/contact' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'HIPAA Compliance', path: '/hipaa' },
        { name: 'Security', path: '/security' },
        { name: 'Accessibility', path: '/accessibility' }
      ]
    }
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: 'Linkedin', url: 'https://linkedin.com/company/ayurnutri' },
    { name: 'Twitter', icon: 'Twitter', url: 'https://twitter.com/ayurnutri' },
    { name: 'YouTube', icon: 'Youtube', url: 'https://youtube.com/ayurnutri' },
    { name: 'Instagram', icon: 'Instagram', url: 'https://instagram.com/ayurnutri' }
  ];

  const certifications = [
    { name: 'HIPAA Compliant', icon: 'Shield' },
    { name: 'SOC 2 Type II', icon: 'Award' },
    { name: 'FDA Registered', icon: 'CheckCircle' },
    { name: 'ISO 27001', icon: 'Lock' }
  ];

  return (
    <footer className="bg-gradient-to-br from-primary/5 to-background border-t border-border">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-display font-bold text-text-primary mb-4">
                Stay Updated with AyurNutri Insights
              </h3>
              <p className="text-text-secondary">
                Get the latest research, case studies, and platform updates delivered to your inbox. 
                Join 5,000+ healthcare professionals advancing integrative medicine.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <Button
                  variant="default"
                  className="bg-primary hover:bg-primary/90 px-6"
                  iconName="Mail"
                  iconPosition="left"
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-text-secondary">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from AyurNutri.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/homepage-ayur-nutri-platform" className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <svg width="40" height="40" viewBox="0 0 40 40" className="text-primary">
                  <circle cx="20" cy="20" r="18" fill="currentColor" className="opacity-10" />
                  <path
                    d="M20 8c-1.5 0-3 .5-4 1.5L12 14l4 4 4-4-4-4c1-.5 2.5-1 4-1s3 .5 4 1l-4 4 4 4 4-4.5c1-1 1.5-2.5 1.5-4s-.5-3-1.5-4S21.5 8 20 8z"
                    fill="currentColor"
                  />
                  <circle cx="20" cy="26" r="6" fill="var(--color-secondary)" className="opacity-80" />
                  <circle cx="20" cy="26" r="3" fill="currentColor" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-display font-semibold text-primary leading-tight">
                  AyurNutri
                </span>
                <span className="text-xs font-accent text-text-secondary leading-none">
                  Ancient Wisdom • Modern Precision
                </span>
              </div>
            </Link>
            
            <p className="text-text-secondary mb-6 leading-relaxed">
              Pioneering the future of healthcare by seamlessly integrating 5,000-year-old Ayurvedic wisdom 
              with cutting-edge nutritional science and AI technology.
            </p>
            
            <div className="flex space-x-4">
              {socialLinks?.map((social) => (
                <a
                  key={social?.name}
                  href={social?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted/50 text-text-secondary hover:bg-primary/10 hover:text-primary organic-transition"
                  aria-label={social?.name}
                >
                  <Icon name={social?.icon} size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections?.map((section) => (
            <div key={section?.title}>
              <h4 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-4">
                {section?.title}
              </h4>
              <ul className="space-y-3">
                {section?.links?.map((link) => (
                  <li key={link?.name}>
                    <Link
                      to={link?.path}
                      className="text-text-secondary hover:text-primary organic-transition text-sm"
                    >
                      {link?.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Certifications */}
        {/* <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h4 className="text-sm font-semibold text-text-primary mb-4">
                Security & Compliance
              </h4>
              <div className="flex flex-wrap gap-4">
                {certifications?.map((cert) => (
                  <div
                    key={cert?.name}
                    className="flex items-center space-x-2 bg-muted/50 px-3 py-2 rounded-lg"
                  >
                    <Icon name={cert?.icon} size={16} className="text-success" />
                    <span className="text-xs font-medium text-text-primary">{cert?.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center lg:text-right">
              <p className="text-sm text-text-secondary mb-2">
                Trusted by 500+ healthcare professionals
              </p>
              <div className="flex items-center justify-center lg:justify-end space-x-4">
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={16} className="text-yellow-500" />
                  <span className="text-sm font-medium text-text-primary">4.9/5</span>
                  <span className="text-xs text-text-secondary">(2,500+ reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-text-secondary">
              <p>© {currentYear} AyurNutri. All rights reserved.</p>
              <div className="flex items-center space-x-4">
                <Link to="/privacy" className="hover:text-primary organic-transition">
                  Privacy
                </Link>
                <Link to="/terms" className="hover:text-primary organic-transition">
                  Terms
                </Link>
                <Link to="/cookies" className="hover:text-primary organic-transition">
                  Cookies
                </Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-text-secondary">
              <span>Made with</span>
              <Icon name="Heart" size={16} className="text-red-500" />
              <span>for healthcare innovation</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;