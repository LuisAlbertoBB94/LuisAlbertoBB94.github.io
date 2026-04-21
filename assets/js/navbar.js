/**
 * Global Navigation Bar Component
 * Reutilizable en todos los sub-índices del portafolio
 */

function createNavbar(options = {}) {
    const {
        projectTitle = 'Proyecto',
        backLink = '../index.html',
        enableLogo = true
    } = options;

    const navHTML = `
    <nav class="sticky-nav">
        <div class="nav-container">
            <div class="nav-left">
                ${enableLogo ? '<a href="' + backLink + '" class="nav-logo"><span class="logo-accent">←</span> Portafolio</a>' : ''}
            </div>
            <div class="nav-center">
                <span class="nav-project-title">${projectTitle}</span>
            </div>
            <div class="nav-right">
                <a href="${backLink}" class="nav-link">Volver</a>
                <a href="https://www.linkedin.com/in/LuisBarraganBonilla" target="_blank" class="nav-link">
                    <i class="fab fa-linkedin"></i>
                </a>
            </div>
            <button class="hamburger" id="nav-toggle"><i class="fas fa-bars"></i></button>
        </div>
    </nav>

    <div class="nav-drawer" id="nav-drawer">
        <a href="${backLink}" class="nav-drawer-link">Volver al Portafolio</a>
        <a href="https://www.linkedin.com/in/LuisBarraganBonilla" target="_blank" class="nav-drawer-link">
            <i class="fab fa-linkedin"></i> LinkedIn
        </a>
    </div>
    `;

    const style = `
    <style>
        /* Navbar Sticky */
        .sticky-nav {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(2, 6, 23, 0.95);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding: 12px 0;
            transition: all 0.3s ease;
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 50px;
        }

        .nav-left, .nav-right { display: flex; align-items: center; gap: 30px; }

        .nav-logo {
            text-decoration: none;
            font-weight: 900;
            font-size: 0.95rem;
            color: #f8fafc;
            text-transform: uppercase;
            letter-spacing: -0.5px;
            transition: 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .nav-logo:hover { color: #3b82f6; }
        .logo-accent { color: #3b82f6; font-weight: 900; }

        .nav-center { flex: 1; text-align: center; }

        .nav-project-title {
            color: #f8fafc;
            font-size: 1rem;
            font-weight: 700;
            display: none;
        }

        .nav-link {
            color: #94a3b8;
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 600;
            transition: 0.3s;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .nav-link:hover {
            color: #f8fafc;
            color: #3b82f6;
        }

        .hamburger {
            display: none;
            background: none;
            border: none;
            color: #f8fafc;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 2001;
        }

        /* Mobile Drawer */
        .nav-drawer {
            position: fixed;
            top: 62px;
            left: 0;
            right: 0;
            background: rgba(2, 6, 23, 0.95);
            backdrop-filter: blur(20px);
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 15px 20px;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            z-index: 999;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .nav-drawer.active { max-height: 300px; }

        .nav-drawer-link {
            color: #94a3b8;
            text-decoration: none;
            padding: 12px 15px;
            border-radius: 6px;
            font-weight: 600;
            transition: 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .nav-drawer-link:hover {
            background: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .nav-container { padding: 0 16px; }
            
            .nav-right { display: none; }
            
            .hamburger { display: block; }
            
            .nav-project-title { display: block; }
            
            .nav-left, .nav-center { flex: 1; }
        }
    </style>
    `;

    return navHTML + style;
}

// Inicializar navbar
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navDrawer = document.getElementById('nav-drawer');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navDrawer.classList.toggle('active');
            const icon = navToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
    }

    // Cerrar drawer al hacer click en un link
    document.querySelectorAll('.nav-drawer-link').forEach(link => {
        link.addEventListener('click', function() {
            navDrawer.classList.remove('active');
            if (navToggle) navToggle.querySelector('i').classList.add('fa-bars');
            if (navToggle) navToggle.querySelector('i').classList.remove('fa-times');
        });
    });
});
