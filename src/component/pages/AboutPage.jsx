import { useEffect, useState } from 'react';
import { 
  Stethoscope, 
  Globe, 
  Building2, 
  Wrench, 
  MapPin, 
  Phone, 
  Mail, 
  Shield, 
  Users, 
  Award,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import '../../style/aboutPage.css';

const AboutPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleSlides, setVisibleSlides] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      const newVisibleSlides = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
      setVisibleSlides(newVisibleSlides);
      setCurrentIndex(0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const slideInterval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(slideInterval);
    };
  }, []);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev < partners.length - visibleSlides ? prev + 1 : 0));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : partners.length - visibleSlides));
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const partners = [
    { logo: "/images/meditech.png", name: "MEDITECH ENDOSCOPY" },
    { logo: "/images/africa.png", name: "AFRICAMEDICAL DENTAL" },
    { logo: "/images/ga.png", name: "GAMEDICAL SERVICE" },
    { logo: "/images/cb.jpg", name: "CB MEDICALE" },
    { logo: "/images/mdcare.jpg", name: "MDCARE Beyond Vision" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <h1 className="hero-title">
            FAM <span className="text-yellow">MED</span>
          </h1>
          <p className="hero-subtitle">
            Votre partenaire de confiance en équipements biomédicaux au Maroc depuis 2021
          </p>
          <div className="hero-tagline">
            <Stethoscope className="icon" />
            <span>Excellence • Innovation • Service</span>
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid-2">
            <div>
              <div className="badge">Depuis 2021</div>
              <h2 className="section-title">Notre Histoire</h2>
              <p className="text-large mb-6">
                Fam Med est une entreprise créée en 2021, spécialisée dans l'importation, la distribution et la
                maintenance d'équipements biomédicaux. Basée à Salé, nous nous sommes rapidement imposés comme un acteur
                de référence dans le secteur de la santé au Maroc.
              </p>
              <p className="text-large">
                Grâce à nos partenariats internationaux et notre équipe dédiée, nous fournissons des équipements
                certifiés tout en garantissant un service après-vente personnalisé à nos clients.
              </p>
            </div>
            <div className="stats-container">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-number">2021</div>
                  <div className="stat-label">Année de création</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">4+</div>
                  <div className="stat-label">Cliniques partenaires</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">100%</div>
                  <div className="stat-label">Équipements certifiés</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Support technique</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Services */}
      <section className="section bg-blue-light">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Nos Services</h2>
            <p className="text-large text-gray">
              Une expertise complète au service de vos besoins en équipements biomédicaux
            </p>
          </div>
          <div className="grid-3">
            <div className="service-card">
              <div className="service-icon">
                <Globe className="icon" />
              </div>
              <h3 className="service-title">Importation</h3>
              <p className="service-description">Importation d'équipements biomédicaux certifiés de haute qualité</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <Building2 className="icon" />
              </div>
              <h3 className="service-title">Distribution</h3>
              <p className="service-description">Distribution sur l'ensemble du territoire marocain</p>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <Wrench className="icon" />
              </div>
              <h3 className="service-title">Maintenance</h3>
              <p className="service-description">Service après-vente personnalisé et maintenance technique</p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Clients */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Nos Clients de Confiance</h2>
            <p className="text-large text-gray">
              Nous collaborons avec les établissements de santé les plus prestigieux du Maroc
            </p>
          </div>
          <div className="grid-4">
            <div className="partner-card">
              <Building2 className="partner-icon" />
              <h3 className="partner-name">Clinique Taiba</h3>
              <div className="partner-location">
                <MapPin className="icon" />
                <span>Fès</span>
              </div>
            </div>
            <div className="partner-card">
              <Building2 className="partner-icon" />
              <h3 className="partner-name">Clinique Beausejour</h3>
              <div className="partner-location">
                <MapPin className="icon" />
                <span>Salé</span>
              </div>
            </div>
            <div className="partner-card">
              <Building2 className="partner-icon" />
              <h3 className="partner-name">Clinique Da Vinci</h3>
              <div className="partner-location">
                <MapPin className="icon" />
                <span>Casablanca</span>
              </div>
            </div>
            <div className="partner-card">
              <Building2 className="partner-icon" />
              <h3 className="partner-name">Polyclinique Internationale</h3>
              <div className="partner-location">
                <MapPin className="icon" />
                <span>Rabat</span>
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-gray italic">+ Divers cabinets médicaux à travers le royaume</p>
          </div>
        </div>
      </section>

      {/* Nos Partenariats */}
      <section className="section bg-blue-light">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">Nos Partenariats</h2>
            <p className="text-large text-gray">
              Nous travaillons avec des marques internationales de renom dans le domaine médical
            </p>
          </div>
          
          <div className="partners-slider-container">
            <button 
              className="slider-btn prev-btn" 
              onClick={prevSlide}
              disabled={currentIndex === 0}
              aria-label="Previous slide"
            >
              <ChevronLeft className="icon" />
            </button>
            
            <div className="partners-slider">
              <div 
                className="slider-track" 
                style={{ 
                  transform: `translateX(-${currentIndex * (100 / visibleSlides)}%)`,
                  width: `${(partners.length / visibleSlides) * 100}%`
                }}
              >
                {partners.map((partner, index) => (
                  <div 
                    key={index} 
                    className="slide"
                    style={{ width: `${100 / visibleSlides}%` }}
                  >
                    <div className="partner-logo-container">
                      <img 
                        src={partner.logo} 
                        alt={partner.name} 
                        className="partner-logo" 
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = "/images/placeholder-logo.png";
                        }}
                      />
                    </div>
                    <h3 className="partner-name">{partner.name}</h3>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className="slider-btn next-btn" 
              onClick={nextSlide}
              disabled={currentIndex >= partners.length - visibleSlides}
              aria-label="Next slide"
            >
              <ChevronRight className="icon" />
            </button>
          </div>
          
          <div className="slider-dots">
            {Array.from({ length: Math.ceil(partners.length / visibleSlides) }).map((_, i) => (
              <button
                key={i}
                className={`slider-dot ${i === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="section bg-blue-dark">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title text-white">Nos Valeurs</h2>
            <p className="text-large text-blue-light">Les principes qui guident notre action au quotidien</p>
          </div>
          <div className="grid-3">
            <div className="value-item">
              <div className="value-icon">
                <Shield className="icon" />
              </div>
              <h3 className="value-title">Qualité</h3>
              <p className="value-description">Équipements certifiés et conformes aux normes internationales</p>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <Users className="icon" />
              </div>
              <h3 className="value-title">Service Client</h3>
              <p className="value-description">Accompagnement personnalisé et relation de proximité</p>
            </div>
            <div className="value-item">
              <div className="value-icon">
                <Award className="icon" />
              </div>
              <h3 className="value-title">Expertise</h3>
              <p className="value-description">Équipe technique qualifiée et expérimentée</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section bg-yellow-light">
        <div className="container">
          <div className="contact-container">
            <div className="grid-2 contact-grid">
              <div>
                <h2 className="section-title">Contactez-nous</h2>
                <p className="text-large text-gray mb-8">
                  Notre équipe technique et techno-commerciale est à votre disposition pour répondre à tous vos besoins
                  en équipements biomédicaux.
                </p>
                <div className="contact-info">
                  <div className="contact-item">
                    <div className="contact-icon">
                      <MapPin className="icon" />
                    </div>
                    <div>
                      <div className="contact-label">Siège Social</div>
                      <div className="contact-value">Salé, Maroc</div>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">
                      <Phone className="icon" />
                    </div>
                    <div>
                      <div className="contact-label">Téléphone</div>
                      <div className="contact-value">+212 XXX XXX XXX</div>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">
                      <Mail className="icon" />
                    </div>
                    <div>
                      <div className="contact-label">Email</div>
                      <div className="contact-value">contact@fammed.ma</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="contact-cta">
                <Stethoscope className="cta-icon" />
                <h3 className="cta-title">Partenaire de votre succès</h3>
                <p className="cta-description">
                  Ensemble, construisons l'avenir de la santé au Maroc avec des équipements biomédicaux de qualité
                  supérieure.
                </p>
                <div className="cta-badge">
                  Service disponible sur tout le territoire
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;