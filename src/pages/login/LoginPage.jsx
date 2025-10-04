import { useState } from "react";
import supabase from "../../supabase/supabase-client";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: formState.email,
      password: formState.password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate("/");
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

                  <div className="field full-width">
                    <div className="fas fa-lock custom-input-icon"></div>
                    <input
                      className="register-input"
                      type="password"
                      placeholder="Password"
                      id="password"
                      name="password"
                      value={formState.password}
                      onChange={setField("password")}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    <small style={{ color: 'red' }}>{error}</small>
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