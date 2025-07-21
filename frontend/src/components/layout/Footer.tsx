import { useLocation } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, MessageSquare, Heart, Shield } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Hide footer on chat page
  const location = useLocation();
  if (['/chatbot'].includes(location.pathname)) {
    return null;
  }

  
  const scrollToSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      window.location.href = `/${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  interface FooterLink {
    name: string;
    path: string;
    icon: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
  }

  const footerLinks = [
    {
      title: 'Navegación',
      links: [
        { 
          name: 'Inicio', 
          path: '/', 
          icon: <MessageSquare className="h-4 w-4 mr-2" />,
          onClick: (e: React.MouseEvent) => {
            e.preventDefault();
            if (location.pathname !== '/') {
              window.location.href = '/';
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }
        },
        { 
          name: 'Características', 
          path: '#features', 
          icon: <MessageSquare className="h-4 w-4 mr-2" />,
          onClick: (e: React.MouseEvent) => scrollToSection(e, '#features')
        },
        { 
          name: 'Cómo Funciona', 
          path: '#how-it-works', 
          icon: <MessageSquare className="h-4 w-4 mr-2" />,
          onClick: (e: React.MouseEvent) => scrollToSection(e, '#how-it-works')
        },
      ] as FooterLink[],
    },
    {
      title: 'Legal',
      links: [
        { 
          name: 'Términos de Servicio', 
          path: '', 
          icon: <Shield className="h-4 w-4 mr-2" />
        },
        { 
          name: 'Política de Privacidad', 
          path: '', 
          icon: <Shield className="h-4 w-4 mr-2" />
        },
        { 
          name: 'Aviso Legal', 
          path: '', 
          icon: <Shield className="h-4 w-4 mr-2" />
        },
      ] as FooterLink[],
    },
  ];

  const contactInfo = [
    {
      icon: <MapPin className="h-5 w-5 text-aiuda-coral flex-shrink-0 mt-1" />,
      text: 'Av. Arequipa 1801, Lima, Perú',
    },
    {
      icon: <Mail className="h-5 w-5 text-aiuda-coral flex-shrink-0" />,
      text: 'hola@aiuda.com',
      url: 'mailto:hola@aiuda.com',
    },
    {
      icon: <Phone className="h-5 w-5 text-aiuda-coral flex-shrink-0" />,
      text: '+51 987 654 321',
      url: 'tel:+51987654321',
    },
  ];

  const socialLinks = [
    { 
      icon: <Facebook size={20} />, 
      url: 'https://facebook.com/aiuda', 
      label: 'Facebook',
      color: 'hover:text-[#1877F2]',
    },
    { 
      icon: <Twitter size={20} />, 
      url: 'https://twitter.com/aiuda', 
      label: 'Twitter',
      color: 'hover:text-[#1DA1F2]',
    },
    { 
      icon: <Instagram size={20} />, 
      url: 'https://instagram.com/aiuda', 
      label: 'Instagram',
      color: 'hover:text-[#E1306C]',
    },
  ];

  return (
    <footer className="bg-aiuda-navy text-white pt-16 pb-8 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-aiuda-coral/10 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-32 -left-20 w-72 h-72 bg-aiuda-blue/10 rounded-full filter blur-3xl opacity-20"></div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/img/logo.png" 
                alt="AIUDA Logo" 
                className="h-12 w-auto"
              />
            </div>
            <p className="text-aiuda-gray-300 leading-relaxed">
              Tu asistente médico inteligente que utiliza IA para brindarte información médica confiable y accesible en cualquier momento y lugar.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-aiuda-gray-400 hover:text-white transition-colors ${social.color} transform hover:-translate-y-0.5`}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-5">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <span className="w-1 h-5 bg-aiuda-coral rounded-full mr-2"></span>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex} className="flex items-center">
                    <span className="text-aiuda-gray-300 flex items-center">
                      <span className="transition-transform">
                        {link.icon}
                      </span>
                      <span className="ml-2">{link.name}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact info */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <span className="w-1 h-5 bg-aiuda-coral rounded-full mr-2"></span>
              Contáctanos
            </h3>
            <ul className="space-y-4">
              {contactInfo.map((item, index) => {
                const content = (
                  <div className="flex space-x-3">
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <span className="text-aiuda-gray-300 leading-relaxed">
                      {item.text}
                    </span>
                  </div>
                );

                return (
                  <li key={index} className="group">
                    {item.url ? (
                      <a 
                        href={item.url} 
                        className="hover:text-aiuda-coral transition-colors"
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Copyright and bottom bar */}
        <div className="border-t border-aiuda-gray-800 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-aiuda-gray-500 text-sm">
              © {currentYear} AIUDA. Todos los derechos reservados.
            </p>
            <div className="flex items-center space-x-1 text-aiuda-gray-500 text-sm">
              <span>Hecho con</span>
              <Heart className="h-4 w-4 mx-1 text-aiuda-coral" />
              <span>para la comunidad</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
