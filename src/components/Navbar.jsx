import { Link, useNavigate } from 'react-router';
import { useContext, useState, useEffect } from 'react';
import SessionContext from '../context/SessionContext';
import supabase from '../supabase/supabase-client';

export default function Navbar() {
    const navigate = useNavigate();
    const { session } = useContext(SessionContext);
    const [username, setUsername] = useState('');
    
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
            <nav className="navbar navbar-expand-lg custom-navbar">
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
                                LOGIN
                            </button>
                        ) : (
                            <button className="custom-navbar-button" onClick={handleAccountClick} data-bs-toggle="collapse" data-bs-target="#navbarNav">
                                <i className="fas fa-user"></i> {username || 'User'}
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}