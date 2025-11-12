import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Input, Textarea } from '../components/Input';
import { Button } from '../components/Button';
import { Card, CardBody } from '../components/Card';
import './AuthPage.css';

export function AuthPage() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) throw signInError;
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (signUpError) throw signUpError;

      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: authData.user.id,
          email: formData.email,
          full_name: formData.fullName,
        },
      ]);

      if (profileError) throw profileError;

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <div className="auth-page__content">
          <div className="auth-page__hero">
            <div className="auth-page__hero-icon">🛡️</div>
            <h1>DigitalHeritage</h1>
            <p>Protect and organize your digital legacy for future generations</p>
          </div>

          <Card className="auth-page__card">
            <CardBody>
              <div className="auth-page__header">
                <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
                <p>
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    className="auth-page__toggle"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError('');
                      setFormData({ email: '', password: '', fullName: '' });
                    }}
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>

              <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="auth-page__form">
                {error && <div className="auth-page__error">{error}</div>}

                {isSignUp && (
                  <Input
                    label="Full Name"
                    name="fullName"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                )}

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  disabled={loading}
                  className="auth-page__submit"
                >
                  {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
                </Button>
              </form>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
