import { Link } from 'react-router';
import '../../css/ErrorPage.css';

export default function ErrorPage() {
    return (
        <div className="error-page-container">
            <div className="error-content">
                <h1 className="error-code">404</h1>
                <h2 className="error-title">VAULT LOCKED</h2>
                <p className="error-message">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="error-button">
                    RETURN TO BASE
                </Link>
            </div>
        </div>
    );
}