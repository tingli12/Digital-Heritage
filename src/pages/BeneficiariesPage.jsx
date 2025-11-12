import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Header, Main, Container } from '../components/Layout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import './BeneficiariesPage.css';

export function BeneficiariesPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    relationship: '',
  });

  useEffect(() => {
    if (user) {
      loadBeneficiaries();
    }
  }, [user]);

  const loadBeneficiaries = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('beneficiaries')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;
      setBeneficiaries(data || []);
    } catch (err) {
      console.error('Error loading beneficiaries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (!formData.name.trim() || !formData.email.trim()) {
        throw new Error('Name and email are required');
      }

      const { error: insertError } = await supabase
        .from('beneficiaries')
        .insert([
          {
            user_id: user.id,
            name: formData.name,
            email: formData.email,
            relationship: formData.relationship,
          },
        ]);

      if (insertError) throw insertError;

      setFormData({ name: '', email: '', relationship: '' });
      loadBeneficiaries();
    } catch (err) {
      setError(err.message || 'Failed to add beneficiary');
    }
  };

  const handleDeleteBeneficiary = async (beneficiaryId) => {
    try {
      await supabase
        .from('beneficiaries')
        .delete()
        .eq('id', beneficiaryId);

      loadBeneficiaries();
    } catch (err) {
      console.error('Error deleting beneficiary:', err);
    }
  };

  return (
    <>
      <Header />
      <Main>
        <Container>
          <div className="beneficiaries-page">
            <div className="beneficiaries-page__header">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                ← Back to Dashboard
              </Button>
              <h1>Manage Beneficiaries</h1>
              <p>Designate trusted people who will have access to your digital assets</p>
            </div>

            <div className="beneficiaries-page__grid">
              <Card className="beneficiaries-page__add-card">
                <CardHeader>
                  <h2>Add New Beneficiary</h2>
                </CardHeader>
                <CardBody>
                  <form onSubmit={handleAddBeneficiary} className="beneficiaries-page__form">
                    {error && <div className="beneficiaries-page__error">{error}</div>}

                    <Input
                      label="Full Name"
                      name="name"
                      placeholder="e.g., John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Email"
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Relationship"
                      name="relationship"
                      placeholder="e.g., Spouse, Child, Parent, Friend"
                      value={formData.relationship}
                      onChange={handleChange}
                    />

                    <Button type="submit" fullWidth>
                      Add Beneficiary
                    </Button>
                  </form>
                </CardBody>
              </Card>

              <div className="beneficiaries-page__list">
                <h2>Your Beneficiaries</h2>

                {loading ? (
                  <div className="beneficiaries-page__loading">Loading...</div>
                ) : beneficiaries.length === 0 ? (
                  <Card>
                    <CardBody>
                      <div className="beneficiaries-page__empty">
                        <span className="beneficiaries-page__empty-icon">👥</span>
                        <h3>No beneficiaries yet</h3>
                        <p>Add your first beneficiary using the form on the left</p>
                      </div>
                    </CardBody>
                  </Card>
                ) : (
                  <div className="beneficiaries-page__items">
                    {beneficiaries.map(beneficiary => (
                      <Card key={beneficiary.id}>
                        <CardBody>
                          <div className="beneficiary-item">
                            <div className="beneficiary-item__info">
                              <h3>{beneficiary.name}</h3>
                              <p>{beneficiary.email}</p>
                              {beneficiary.relationship && (
                                <span className="beneficiary-item__relation">
                                  {beneficiary.relationship}
                                </span>
                              )}
                              {beneficiary.notification_sent && (
                                <span className="beneficiary-item__notified">
                                  ✓ Notification sent
                                </span>
                              )}
                            </div>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteBeneficiary(beneficiary.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Main>
    </>
  );
}
