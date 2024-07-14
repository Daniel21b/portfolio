import React, { useState, useEffect, useRef } from 'react';

const ParticleBackground = ({ mousePosition }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      particles = [];
      const particleCount = 80;
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.1,
          speedY: (Math.random() - 0.5) * 0.1,
        });
      }
      particlesRef.current = particles;
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(100, 149, 237, 0.7)';
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = 'rgba(100, 149, 237, 0.2)';
      ctx.lineWidth = 0.3;
      particles.forEach((particle, index) => {
        particles.slice(index + 1).forEach((otherParticle) => {
          const dx = otherParticle.x - particle.x;
          const dy = otherParticle.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });
    };

    const updateParticles = () => {
      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        if (mousePosition) {
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            particle.speedX += dx * 0.00001;
            particle.speedY += dy * 0.00001;
          }
        }

        particle.speedX *= 0.99;
        particle.speedY *= 0.99;
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [mousePosition]);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />;
};

const Navigation = ({ currentSection, onNavigate }) => {
  return (
    <nav style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      padding: '20px',
      display: 'flex',
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(17, 17, 17, 0.8)',
      zIndex: 1000
    }}>
      {['Home', 'About', 'Projects', 'Contact'].map(item => (
        <span key={item} 
              onClick={() => onNavigate(item.toLowerCase())}
              style={{ 
                marginLeft: '20px', 
                color: currentSection === item.toLowerCase() ? '#ff4b4b' : '#fff',
                cursor: 'pointer',
                position: 'relative',
                transition: 'color 0.3s ease'
              }}>
          {item}
          {currentSection === item.toLowerCase() && (
            <span style={{
              position: 'absolute',
              bottom: '-5px',
              left: 0,
              width: '100%',
              height: '2px',
              backgroundColor: '#ff4b4b',
              animation: 'glow 1.5s ease-in-out infinite alternate'
            }}></span>
          )}
        </span>
      ))}
    </nav>
  );
};

const App = () => {
  const [mousePosition, setMousePosition] = useState(null);
  const [currentSection, setCurrentSection] = useState('home');

  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  const handleMouseMove = (event) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  const scrollTo = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigation = (section) => {
    switch(section) {
      case 'home':
        scrollTo(homeRef);
        break;
      case 'about':
        scrollTo(aboutRef);
        break;
      case 'projects':
        scrollTo(projectsRef);
        break;
      case 'contact':
        scrollTo(contactRef);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    observer.observe(homeRef.current);
    observer.observe(aboutRef.current);
    observer.observe(projectsRef.current);
    observer.observe(contactRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div onMouseMove={handleMouseMove}>
      <style>
        {`
          @keyframes glow {
            from {
              box-shadow: 0 0 5px #ff4b4b, 0 0 10px #ff4b4b, 0 0 15px #ff4b4b;
            }
            to {
              box-shadow: 0 0 10px #ff4b4b, 0 0 20px #ff4b4b, 0 0 30px #ff4b4b;
            }
          }
          .skill:hover {
            box-shadow: 0 0 10px #ff4b4b, 0 0 20px #ff4b4b, 0 0 30px #ff4b4b;
            transform: scale(1.1);
            transition: transform 0.3s, box-shadow 0.3s;
          }
          .project-button:hover {
            background-color: #ff4b4b;
            color: #111;
            box-shadow: 0 0 5px #ff4b4b, 0 0 10px #ff4b4b, 0 0 15px #ff4b4b;
            transition: all 0.3s ease;
          }
        `}
      </style>
      <Navigation currentSection={currentSection} onNavigate={handleNavigation} />
      
      <div id="home" ref={homeRef} style={{ 
        height: '100vh', 
        background: '#111', 
        color: '#fff', 
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <ParticleBackground mousePosition={mousePosition} />
        <h1 style={{ fontSize: '3em', marginBottom: '0.2em', zIndex: 1 }}>
          Hello, I'm <span style={{ color: '#ff4b4b' }}>Daniel Berhane</span>.
        </h1>
        <p style={{ fontSize: '1.5em', marginBottom: '1em', zIndex: 1 }}>
          I'm a student at University of Maryland Colllege Park.
        </p>
        <button 
          onClick={() => scrollTo(projectsRef)}
          style={{
            padding: '10px 20px',
            fontSize: '1em',
            color: '#ff4b4b',
            backgroundColor: 'transparent',
            border: '2px solid #ff4b4b',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 1
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#ff4b4b';
            e.target.style.color = '#111';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#ff4b4b';
          }}
        >
          View my work ↓
        </button>
      </div>

      <div id="about" ref={aboutRef} style={{ 
        minHeight: '100vh', 
        background: '#111', 
        color: '#fff', 
        fontFamily: 'Arial, sans-serif',
        padding: '80px 20px 20px',
        boxSizing: 'border-box'
      }}>
        <h1 style={{ 
          fontSize: '4em', 
          textAlign: 'center', 
          marginBottom: '40px',
          position: 'relative'
        }}>
          About
          <div style={{ 
            height: '10px', 
            width: '80px', 
            backgroundColor: '#ff4b4b', 
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}></div>
        </h1>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ flex: '0 0 40%', marginRight: '40px', marginBottom: '20px' }}>
            <div style={{ 
              width: '200px', 
              height: '200px', 
              border: '2px solid #ff4b4b', 
              borderRadius: '50%', 
              margin: '0 auto 20px',
              backgroundImage: 'url(dani.jepg)', // Path to the image,
              backgroundSize: 'cover',
              backgroundPosition: 'center' 
            }}></div>
            <p style={{ lineHeight: '1.6', fontSize: '1.1em' }}>
            Fully committed to the philosophy of lifelong learning, I'm a student interested in the worlds of finance and programming.
             The unique combination of creativity, logic, technology, and the endless discovery of new concepts drives my excitement and passion.
              When I'm not at my computer, I enjoy spending time reading finance book.
            </p>
          </div>
          <div style={{ 
            flex: '0 0 50%', 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'flex-end',
            gap: '10px'
          }}>
            {[
              'JavaScript', 'React','Java', 'Python', 'C++', 'HTML5', 'LINUX (basic)', 'C', 'Assembly', 'PHP'
            ].map(tech => (
              <div key={tech} className="skill" style={{
                padding: '10px 20px',
                backgroundColor: '#222',
                borderRadius: '5px',
                fontSize: '0.9em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #ff4b4b',
                minWidth: '100px',
                maxWidth: '150px',
                flexGrow: 1,
                transition: 'transform 0.3s, box-shadow 0.3s'
              }}>
                {tech}
              </div>
            ))}
          </div>
        </div>

        <div style={{ 
          marginTop: '40px',
          textAlign: 'center',
          color: '#ff4b4b',
          fontSize: '1.5em'
        }}>
          Skills
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          gap: '10px',
          marginTop: '20px'
        }}>
          {[
            'Node', 'MongoDB', 'Pandas', 'Express', 'Github', 'Docker', 'Postman', 'Excel', 'Git', 
            'Project Management', 'Agile', 'Time Management','IBM Consulting Certificate'
          ].map(skill => (
            <div key={skill} className="skill" style={{
              padding: '10px 20px',
              backgroundColor: '#222',
              borderRadius: '5px',
              fontSize: '0.9em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #ff4b4b',
              minWidth: '100px',
              maxWidth: '150px',
              flexGrow: 1,
              transition: 'transform 0.3s, box-shadow 0.3s'
            }}>
              {skill}
            </div>
          ))}
        </div>
      </div>

      <div id="projects" ref={projectsRef} style={{ 
        minHeight: '100vh', 
        background: '#111', 
        color: '#fff', 
        fontFamily: 'Arial, sans-serif',
        padding: '80px 20px 20px',
        boxSizing: 'border-box'
      }}>
        <h1 style={{ 
          fontSize: '4em', 
          textAlign: 'center', 
          marginBottom: '40px',
          position: 'relative'
        }}>
          Projects
          <div style={{ 
            height: '10px', 
            width: '120px', 
            backgroundColor: '#ff4b4b', 
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}></div>
        </h1>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '40px',
          flexWrap: 'wrap'
        }}>
          {[{
            title: "Financial Statement Visualization",
            description: `Developed a comprehensive project for visualizing financial statements, focusing on 10-Q and 10-K reports. Collected data from multiple sources including SEC EDGAR database and company websites using APIs and webscraping techniques. Developed a web application using React and Flask to host and serve visualizations, enabling user interaction through filtering, sorting, and selection features.`,
            technologies: "Python, JavaScript",
            image: "SecFinancial.png",
            liveDemo: "https://github.com/Daniel21b/Financial-Statement-Visualization"
          },
          {
            title: "Hospital Occupancy Monitoring System",
            description: `Developed a system to monitor and predict hospital occupancy levels using mobile ping location data, analyzing data from over 1 million mobile devices. Parsed and cleaned location data to ensure accuracy and consistency, achieving a 95% reduction in data errors. Analyzed mobile ping density and frequency around hospital locations to estimate occupancy levels, identifying key patterns and trends.`,
            technologies: "Python, SQL, JavaScript",
            image: "Hospital_image.png",
            liveDemo: "https://github.com/Daniel21b/Hospital-Occupancy-Monitoring-System"
          },
          {
            title: "S&P 500 Index Analysis and Prediction",
            description: `Conducted comprehensive data analysis and visualization of the S&P 500 index using Python, pandas, and matplotlib. Analyzed over 20 years of historical data comprising more than 5,000 data points. Advanced machine learning techniques, including feature scaling and time series analysis, were used to enhance model performance. Achieved a Mean Absolute Percentage Error (MAPE) of less than 5%. Utilized Keras and TensorFlow for building and training models.`,
            technologies: "Python",
            image: "bull.jpeg",
            liveDemo: "https://daniel21b.github.io/CMSC320-Final_Group_project/"
          }].map((project, index) => (
            <div key={index} style={{
              display: 'flex',
              width: '100%',
              maxWidth: '1200px',
              backgroundColor: '#1a1a1a',
              borderRadius: '10px',
              overflow: 'hidden',
              flexDirection: 'row',
              marginBottom: '40px'
            }}>
              <div style={{
                flex: '1 1 40%',
                backgroundImage: `url(${project.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '300px'
              }}></div>
              <div style={{
                flex: '1 1 60%',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                backgroundColor: '#4B0082'
              }}>
                <h2 style={{ fontSize: '2em', marginBottom: '10px' }}>{project.title}</h2>
                <p style={{ marginBottom: '20px' }}>{project.description}</p>
                <p style={{ marginBottom: '20px', fontStyle: 'italic' }}>{project.technologies}</p>
                <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="project-button" style={{
                  padding: '10px 20px',
                  backgroundColor: '#ff4b4b',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '5px',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}>LIVE DEMO</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div id="contact" ref={contactRef} style={{ 
        minHeight: '100vh', 
        background: '#111', 
        color: '#fff', 
        fontFamily: 'Arial, sans-serif',
        padding: '80px 20px 20px',
        boxSizing: 'border-box'
      }}>
        <h1 style={{ 
          fontSize: '4em', 
          textAlign: 'center', 
          marginBottom: '40px',
          position: 'relative'
        }}>
          Contact
          <div style={{ 
            height: '10px', 
            width: '100px', 
            backgroundColor: '#ff4b4b', 
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}></div>
        </h1>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <p style={{ marginBottom: '20px', fontSize: '1.2em', textAlign: 'center' }}>
            If you'd like to get in touch, feel free to reach out via the following channels:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            {[
              { label: 'Email', value: 'd.asfaw10@gmail.com' },
              { label: 'Phone', value: '+' },
              { label: 'LinkedIn', value: 'https://www.linkedin.com/in/daniel-berhane/' }
            ].map((contact, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 20px',
                backgroundColor: '#222',
                borderRadius: '5px',
                border: '1px solid #ff4b4b'
              }}>
                <span style={{ color: '#ff4b4b' }}>{contact.label}</span>
                <span>{contact.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
