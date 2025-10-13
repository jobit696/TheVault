import { useState } from "react";
import {
  ConfirmSchema,
  getErrors,
  getFieldError,
} from '../../lib/validationForm';
import supabase from "../../supabase/supabase-client";
import { Link, useNavigate } from "react-router";
import avatarandomizer from '../../functions/avatarRandomizer'; 

export default function RegisterPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    sex: "",
  });
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);

    // Validazione sex
    if (!formState.sex) {
      setFormErrors(prev => ({ ...prev, sex: 'Please select your gender' }));
      return;
    }

    const { error, data } = ConfirmSchema.safeParse(formState);
    if (error) {
      const errors = getErrors(error);
      setFormErrors(errors);
      console.log(errors);
    } else {
      // ← AGGIUNTO: Genera avatar in base al sesso
      const randomAvatar = avatarandomizer(formState.sex);

      let { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            username: data.username,
            sex: formState.sex,
            avatar_url: randomAvatar // ← AGGIUNTO: Avatar casuale
          }
        }
      });
      if (error) {
        alert("Signing up error!");
      } else {
        alert("Signed up!");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("/");
      }
    }
  };

  const onBlur = (property) => () => {
    const message = getFieldError(property, formState[property]);
    setFormErrors((prev) => ({ ...prev, [property]: message }));
    setTouchedFields((prev) => ({ ...prev, [property]: true }));
  };

  const isInvalid = (property) => {
    if (formSubmitted || touchedFields[property]) {
      return !!formErrors[property];
    }
    return undefined;
  };

  const setField = (property, valueSelector) => (e) => {
    setFormState((prev) => ({
      ...prev,
      [property]: valueSelector ? valueSelector(e) : e.target.value,
    }));
  };

  return (
    <div className="container mb-5">
      <div className="row justify-content-center">
        <div className="col-12">
          <section className="form-container">
            <div className="register-form">
              <div className="text">REGISTER</div>
              <form onSubmit={onSubmit} noValidate>
                <div className="form-fields-grid">
                  {/* Email */}
                  <div className="field">
                    <div className="fas fa-envelope custom-input-icon"></div>
                    <input
                      className="register-input"
                      type="email"
                      placeholder="Email or Phone"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={setField("email")}
                      onBlur={onBlur("email")}
                      aria-invalid={isInvalid("email")}
                      required
                      autoComplete="email"
                    />
                    {formErrors.email && <small>{formErrors.email}</small>}
                  </div>

                  {/* First Name */}
                  <div className="field">
                    <div className="fas fa-user custom-input-icon"></div>
                    <input
                      className="register-input"
                      type="text"
                      placeholder="First Name"
                      id="firstName"
                      name="firstName"
                      value={formState.firstName}
                      onChange={setField("firstName")}
                      onBlur={onBlur("firstName")}
                      aria-invalid={isInvalid("firstName")}
                      required
                    />
                    {formErrors.firstName && <small>{formErrors.firstName}</small>}
                  </div>

                  {/* Last Name */}
                  <div className="field">
                    <div className="fas fa-user custom-input-icon"></div>
                    <input
                      className="register-input"
                      type="text"
                      placeholder="Last Name"
                      id="lastName"
                      name="lastName"
                      value={formState.lastName}
                      onChange={setField("lastName")}
                      onBlur={onBlur("lastName")}
                      aria-invalid={isInvalid("lastName")}
                      required
                    />
                    {formErrors.lastName && <small>{formErrors.lastName}</small>}
                  </div>

                  {/* Username */}
                  <div className="field">
                    <div className="fas fa-user custom-input-icon"></div>
                    <input
                      className="register-input"
                      type="text"
                      placeholder="Username"
                      id="username"
                      name="username"
                      value={formState.username}
                      onChange={setField("username")}
                      onBlur={onBlur("username")}
                      aria-invalid={isInvalid("username")}
                      required
                      autoComplete="username"
                    />
                    {formErrors.username && <small>{formErrors.username}</small>}
                  </div>

                  {/* Gender Selection */}
                  <div className="field full-width">
                    <div className="gender-selection">
                      <label className="gender-label">
                        <input
                          type="radio"
                          name="sex"
                          value="M"
                          checked={formState.sex === 'M'}
                          onChange={setField("sex")}
                          className="gender-radio"
                        />
                        <span className="gender-text">
                          <i className="fas fa-mars"></i> Male
                        </span>
                      </label>
                      
                      <label className="gender-label">
                        <input
                          type="radio"
                          name="sex"
                          value="F"
                          checked={formState.sex === 'F'}
                          onChange={setField("sex")}
                          className="gender-radio"
                        />
                        <span className="gender-text">
                          <i className="fas fa-venus"></i> Female
                        </span>
                      </label>
                    </div>
                    {formErrors.sex && <small style={{ color: 'red', display: 'block', textAlign: 'center', marginTop: '5px' }}>{formErrors.sex}</small>}
                  </div>

                  {/* Password */}
                  <div className="field full-width password-field">
                    <input
                      className="register-input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      id="password"
                      name="password"
                      value={formState.password}
                      onChange={setField("password")}
                      onBlur={onBlur("password")}
                      aria-invalid={isInvalid("password")}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <div className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></div>
                    </button>
                    {formErrors.password && <small>{formErrors.password}</small>}
                  </div>
                </div>

                <button className="register-button" type="submit">REGISTER</button>

                <div className="link">
                  Already a member? <Link to="/login">Login now</Link>
                </div>

              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}