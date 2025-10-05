import { Link, useNavigate } from 'react-router';
import { useContext, useState, useEffect, useRef } from 'react';
import SessionContext from '../context/SessionContext';
import supabase from '../supabase/supabase-client';

export default function Navbar() {
    const navigate = useNavigate();
    const { session } = useContext(SessionContext);
    const [username, setUsername] = useState('');
    const navbarRef = useRef(null);
    
    useEffect(() => {
        const getUsername = async () => {
            if (session) {
                const { data } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('id', session.user.id)
                    .single();
                
                if (data) {
                    setUsername(data.username);
                }
            }
        };
        
        getUsername();
    }, [session]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const navbarCollapse = document.getElementById('navbarNav');
            const navbarToggler = document.querySelector('.navbar-toggler');
            
            // Verifica se il click è fuori dalla navbar
            if (navbarRef.current && 
                !navbarRef.current.contains(event.target)) {
                
                // Se il menu è aperto, chiudilo
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    navbarToggler?.click();
                }
            }
        };

        document.addEventListener('click', handleClickOutside);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);
    
    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleAccountClick = () => {
        navigate("/account");
    };

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error(error);
        } else {
            navigate("/");
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg custom-navbar" ref={navbarRef}>
                <Link className="custom-navbar-brand" to="/">V</Link>
                <div className="container-fluid">
                    
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">
                                    Home
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/platform/1">
                                    Xbox
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/platform/187">
                                    PS5
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/platform/7">
                                    Switch
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/platform/4">
                                    PC
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/games">
                                    All
                                </Link>
                            </li>
                        </ul>
                        
                        {!session ? (
                            <button className="custom-navbar-button" onClick={handleLoginClick} data-bs-toggle="collapse" data-bs-target="#navbarNav">
                                <i className="fas fa-user"></i> Join
                            </button>
                        ) : (
                            <div className="navbar-user-buttons">
                                <button 
                                    className="navbar-circle-button" 
                                    onClick={handleAccountClick}
                                    title={username || 'User'}
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#navbarNav"
                                >
                                    <i className="fas fa-user"></i>
                                </button>
                                <button 
                                    className="navbar-circle-button logout-button" 
                                    onClick={handleSignOut}
                                    title="Logout"
                                    data-bs-toggle="collapse" 
                                    data-bs-target="#navbarNav"
                                >
                                    <i className="fas fa-sign-out-alt"></i>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}