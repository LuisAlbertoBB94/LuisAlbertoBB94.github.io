---
layout: home
featured_image: /assets/images/hero-bg.jpg
---

<!-- Hero Section -->
<section class="hero" style="background-image: url('{{ page.featured_image }}')">
  <div class="hero-content">
    <h1>Luis Alberto Barragán Bonilla</h1>
    <p class="subtitle">Doctor en Comunicaciones y Electrónica | Especialista en Ciencia de Datos</p>
    <div class="cta-buttons">
      {% include button.html 
         text="Ver Mis Proyectos" 
         link="/proyectos" 
         icon="fas fa-code" 
         style="primary" %}
         
      {% include button.html 
         text="Descargar CV" 
         link="/assets/docs/cv.pdf" 
         icon="fas fa-file-download" 
         style="outline" %}
    </div>
  </div>
</section>

<!-- Sobre Mí -->
<section class="about">
  <h2><i class="fas fa-user"></i> Sobre Mí</h2>
  <div class="about-grid">
    <div class="about-text">
      <p>Doctor en Comunicaciones y Electrónica (IPN) con especialización en modelado matemático y análisis de datos. Experiencia docente en Python, SQL y visualización de datos.</p>
      
      <div class="highlight-box">
        <h3>Logros Clave:</h3>
        <ul>
          <li>3 publicaciones en revistas JCR</li>
          <li>Certificado en Data Science por IBM</li>
          <li>5+ años enseñando programación</li>
        </ul>
      </div>
    </div>
    
    <div class="about-image">
      <img src="/assets/images/profile.jpg" alt="Foto de Luis Barragán" class="profile-img">
    </div>
  </div>
</section>

<!-- Habilidades Técnicas -->
<section class="skills">
  <h2><i class="fas fa-laptop-code"></i> Habilidades Técnicas</h2>
  
  <div class="skills-grid">
    <!-- Columna 1 -->
    <div class="skill-category">
      <h3>Lenguajes</h3>
      <ul class="skill-list">
        <li>
          <span class="skill-name">Python</span>
          <div class="skill-bar">
            <div class="skill-level" style="width: 90%"></div>
          </div>
        </li>
        <li>
          <span class="skill-name">MATLAB</span>
          <div class="skill-bar">
            <div class="skill-level" style="width: 85%"></div>
          </div>
        </li>
        <li>
          <span class="skill-name">SQL</span>
          <div class="skill-bar">
            <div class="skill-level" style="width: 80%"></div>
          </div>
        </li>
      </ul>
    </div>
    
    <!-- Columna 2 -->
    <div class="skill-category">
      <h3>Herramientas</h3>
      <ul class="skill-list">
        <li>
          <span class="skill-name">Power BI</span>
          <div class="skill-bar">
            <div class="skill-level" style="width: 88%"></div>
          </div>
        </li>
        <li>
          <span class="skill-name">Tableau</span>
          <div class="skill-bar">
            <div class="skill-level" style="width: 75%"></div>
          </div>
        </li>
        <li>
          <span class="skill-name">Git</span>
          <div class="skill-bar">
            <div class="skill-level" style="width: 70%"></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</section>

<!-- Proyectos Destacados -->
<section class="featured-projects">
  <h2><i class="fas fa-star"></i> Proyectos Destacados</h2>
  
  <div class="project-grid">
    <!-- Proyecto 1 -->
    <div class="project-card">
      <img src="/assets/images/projects/sales-analysis.jpg" alt="Análisis de Ventas">
      <div class="project-content">
        <h3>Análisis Predictivo de Ventas</h3>
        <p>Modelo de machine learning con 85% de precisión para predecir tendencias.</p>
        <div class="project-tags">
          <span class="tag">Python</span>
          <span class="tag">Pandas</span>
          <span class="tag">Power BI</span>
        </div>
        <a href="/proyectos/ventas" class="project-link">Ver Detalles →</a>
      </div>
    </div>
    
    <!-- Proyecto 2 -->
    <div class="project-card">
      <img src="/assets/images/projects/control-system.jpg" alt="Sistema de Control">
      <div class="project-content">
        <h3>Control de Sistemas con Retardo</h3>
        <p>Simulación en MATLAB de sistemas de alto orden con polos inestables.</p>
        <div class="project-tags">
          <span class="tag">MATLAB</span>
          <span class="tag">Simulink</span>
          <span class="tag">Control PID</span>
        </div>
        <a href="/proyectos/control" class="project-link">Ver Detalles →</a>
      </div>
    </div>
  </div>
  
  <div class="text-center">
    {% include button.html 
       text="Ver Todos los Proyectos" 
       link="/proyectos" 
       style="secondary" %}
  </div>
</section>

<!-- Contacto -->
<section class="contact">
  <h2><i class="fas fa-envelope"></i> Contacto</h2>
  
  <div class="contact-grid">
    <div class="contact-info">
      <p><i class="fas fa-map-marker-alt"></i> Ciudad de México, México</p>
      
      <div class="social-links">
        <a href="https://github.com/LuisAlbertoBB94" target="_blank">
          <i class="fab fa-github"></i>
        </a>
        <a href="https://linkedin.com/in/luisbarraganbonilla" target="_blank">
          <i class="fab fa-linkedin"></i>
        </a>
        <a href="https://twitter.com/tuusuario" target="_blank">
          <i class="fab fa-twitter"></i>
        </a>
      </div>
    </div>
    
    <div class="contact-form">
      <form action="https://formspree.io/f/your-form-id" method="POST">
        <input type="text" name="name" placeholder="Nombre" required>
        <input type="email" name="_replyto" placeholder="Email" required>
        <textarea name="message" placeholder="Mensaje" rows="4" required></textarea>
        <button type="submit" class="submit-btn">
          <i class="fas fa-paper-plane"></i> Enviar Mensaje
        </button>
      </form>
    </div>
  </div>
</section>