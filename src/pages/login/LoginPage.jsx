import { useState, useEffect } from "react";
import supabase from "../../supabase/supabase-client";
import { useNavigate } from "react-router";
import { isUserBanned } from "../../services/userManagementService";

export default function LoginPage() {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false); // ← Default false
  const navigate = useNavigate();

  // Carica credenziali salvate all'avvio
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    const savedPassword = localStorage.getItem('remembered_password');
    const wasRemembered = localStorage.getItem('remember_me') === 'true';

    if (wasRemembered && savedEmail && savedPassword) {
      setFormState({
        email: savedEmail,
        password: savedPassword,
      });
      setRememberMe(true);
    }
  }, []);

  // Salva/rimuovi credenziali quando checkbox cambia
  const handleRememberMeChange = (e) => {
    const checked = e.target.checked;
    setRememberMe(checked);

    if (!checked) {
      // Se deselezionato, cancella le credenziali salvate
      localStorage.removeItem('remembered_email');
      localStorage.removeItem('remembered_password');
      localStorage.removeItem('remember_me');
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Login
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: formState.email,
        password: formState.password,
      });

      if (loginError) {
        setError(loginError.message);
        setLoading(false);
        return;
      }

      // Controlla se bannato
      if (data?.user) {
        const banned = await isUserBanned(data.user.id);
        
        if (banned) {
          await supabase.auth.signOut();
          setError("Your account has been banned. Please contact support.");
          setLoading(false);
          return;
        }
      }

      // Salva credenziali se Remember Me è attivo
      if (rememberMe) {
        localStorage.setItem('remembered_email', formState.email);
        localStorage.setItem('remembered_password', formState.password);
        localStorage.setItem('remember_me', 'true');
      } else {
        // Se non selezionato, rimuovi credenziali salvate
        localStorage.removeItem('remembered_email');
        localStorage.removeItem('remembered_password');
        localStorage.removeItem('remember_me');
      }

      // Login OK, vai ad account
      navigate("/account");
      
    } catch (err) {
      
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const setField = (property) => (e) => {
    setFormState((prev) => ({
      ...prev,
      [property]: e.target.value,
    }));
  };

  return (
    <div className="container mb-5">
      <div className="row justify-content-center">
        <div className="col-12">
          <section className="form-container">
            <div className="register-form">
              <div className="text">LOGIN</div>
              <form onSubmit={onSubmit} noValidate>
                <div className="form-fields-grid">
                  <div className="field full-width">
                    <div className="fas fa-envelope custom-input-icon"></div>
                    <input
                      className="register-input"
                      type="email"
                      placeholder="Email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={setField("email")}
                      required
                      autoComplete="email"
                    />
                  </div>

                  <div className="field full-width password-field">
                    <input
                      className="register-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      id="password"
                      name="password"
                      value={formState.password}
                      onChange={setField("password")}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>

                  <div className="field full-width remember-me-field">
                    <label className="remember-me-label">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={handleRememberMeChange}
                        className="remember-me-checkbox"
                      />
                      <span className="remember-me-text">Remember me</span>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    <p className="error-message-text">{error}</p>
                  </div>
                )}

                <button 
                  className="register-button" 
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'LOADING...' : 'LOGIN'}
                </button>

                <div className="link">
                  Not a member? <a href="/register">Register now</a>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}