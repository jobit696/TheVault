import { Link } from "react-router";

export default function Footer() {
    return(
        <footer className="vault-footer">
            <div className="container">
                <div className="row footer-content">
                    <div className="col-lg-3 col-md-6 col-sm-6 mb-4">
                        <div className="footer-section">
                            <div className="footer-logo">
                                <h3>The Vault</h3>
                            </div>
                            <p className="footer-tagline">Your ultimate gaming database</p>
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-6 col-sm-6 mb-4">
                        <div className="footer-section">
                            <h4>Platform</h4>
                            <ul className="list-unstyled">
                                <li>
                                   <Link to="/platform/4">Xbox</Link>
                                </li>
                                <li>
                                   <Link to="/platform/187">PS5</Link>
                                </li>
                               <li>
                                   <Link to="/platform/7">Switch</Link>
                                </li>
                                <li>
                                   <Link to="/platform/4">PC</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-6 col-sm-6 mb-4">
                        <div className="footer-section">
                            <h4>Interactivity</h4>
                            <ul className="list-unstyled">
                                <li><Link to="/arcade">Pico-8 player</Link></li>
                                {/* <li><a href="#">Ratings</a></li>
                                <li><a href="#">Forums</a></li>
                                <li><a href="#">Blog</a></li> */}
                            </ul>
                        </div>
                    </div>

                    <div className="col-lg-2 col-md-6 col-sm-6 mb-4">
                        <div className="footer-section">
                            <h4>Support</h4>
                            <ul className="list-unstyled">
                               <li><Link to="/contact">Contact Us</Link></li>
                                {/* <li><a href="#">FAQ</a></li>
                                <li><a href="#">Privacy</a></li>
                                <li><a href="#">Terms</a></li> */}
                            </ul>
                        </div>
                    </div>

                    <div className="col-lg-3 col-md-12 col-sm-12 mb-4">
                        <div className="footer-section">
                            <h4>Follow Us</h4>
                            <div className="social-icons d-flex flex-wrap gap-3">
                               <a href="https://twitter.com/" className="social-icon" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-twitter"></i>
</a>
<a href="https://discord.gg/" className="social-icon" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-discord"></i>
</a>
<a href="https://twitch.tv/" className="social-icon" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-twitch"></i>
</a>
<a href="https://youtube.com/" className="social-icon" target="_blank" rel="noopener noreferrer">
    <i className="fab fa-youtube"></i>
</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <div className="footer-bottom d-flex justify-content-between align-items-center flex-wrap">
                            <p className="mb-2 mb-md-0">&copy; 2025 The Vault. All rights reserved.</p>
                            <div className="footer-stats d-flex align-items-center gap-3 flex-wrap">
                                <span>320K Games</span>
                                <span className="d-none d-sm-inline">•</span>
                                <span>26.3M Ratings</span>
                                <span className="d-none d-sm-inline">•</span>
                                <span>8.1M Reviews</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}