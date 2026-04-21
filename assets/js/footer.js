/**
 * Global Footer Component
 * Reutilizable en todos los sub-índices del portafolio
 */

function createFooter(options = {}) {
    const {
        linkedinUrl = 'https://www.linkedin.com/in/LuisBarraganBonilla',
        githubUrl = 'https://github.com/LuisAlbertoBB94',
        year = new Date().getFullYear()
    } = options;

    const footerHTML = `
    <footer class="global-footer">
        <div class="footer-container">
            <div class="footer-content">
                <div class="footer-brand">
                    <h3>Luis Barragan, PhD</h3>
                    <p class="footer-tagline">Head of Data & BI | Data Engineer | AI Strategy</p>
                </div>
                
                <div class="footer-links">
                    <a href="https://www.linkedin.com/in/LuisBarraganBonilla" target="_blank" class="footer-link">
                        <i class="fab fa-linkedin"></i> LinkedIn
                    </a>
                    <a href="https://github.com/LuisAlbertoBB94" target="_blank" class="footer-link">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                    <a href="../index.html" class="footer-link">
                        <i class="fas fa-home"></i> Portafolio
                    </a>
                </div>
            </div>

            <div class="footer-divider"></div>

            <div class="footer-bottom">
                <p>&copy; ${year} Strategic Portfolio. Crafted for excellence.</p>
                <p class="footer-tech">Modern Data Stack | AI & Cloud Architecture | Executive BI</p>
            </div>
        </div>
    </footer>
    `;

    const style = `
    <style>
        .global-footer {
            background: rgba(2, 6, 23, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            padding: 60px 0 30px;
            margin-top: 100px;
            color: #94a3b8;
            font-size: 0.9rem;
        }

        .footer-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
        }

        .footer-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }

        .footer-brand h3 {
            color: #f8fafc;
            font-size: 1.3rem;
            font-weight: 900;
            margin-bottom: 8px;
            font-family: 'Outfit', sans-serif;
        }

        .footer-tagline {
            color: #3b82f6;
            font-size: 0.85rem;
            letter-spacing: 0.5px;
            font-weight: 600;
        }

        .footer-links {
            display: flex;
            gap: 25px;
            flex-wrap: wrap;
        }

        .footer-link {
            color: #94a3b8;
            text-decoration: none;
            transition: 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
        }

        .footer-link:hover {
            color: #3b82f6;
            transform: translateX(3px);
        }

        .footer-divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.08);
            margin-bottom: 30px;
        }

        .footer-bottom {
            text-align: center;
            font-size: 0.8rem;
            color: #475569;
        }

        .footer-tech {
            margin-top: 8px;
            color: #3b82f6;
            font-weight: 600;
            letter-spacing: 0.5px;
        }

        @media (max-width: 768px) {
            .global-footer { padding: 40px 0 20px; margin-top: 60px; }
            
            .footer-content {
                grid-template-columns: 1fr;
                gap: 25px;
            }

            .footer-links { justify-content: center; }
        }
    </style>
    `;

    return footerHTML + style;
}
