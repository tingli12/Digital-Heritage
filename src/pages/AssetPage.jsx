import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Header, Main, Container } from '../components/Layout';
import { Input, Textarea, Select } from '../components/Input';
import { Button } from '../components/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import './AssetPage.css';

export function AssetPage() {
  const navigate = useNavigate();
  const { assetId } = useParams();
  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(!!assetId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    asset_type: 'account',
    access_instructions: '',
    status: 'active',
  });

  useEffect(() => {
    if (assetId && user) {
      loadAsset();
    }
  }, [assetId, user]);

  const loadAsset = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('digital_assets')
        .select('*')
        .eq('id', assetId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setFormData(data);
      } else {
        setError('Asset not found');
      }
    } catch (err) {
      setError(err.message || 'Failed to load asset');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }

      if (assetId) {
        const { error: updateError } = await supabase
          .from('digital_assets')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', assetId)
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('digital_assets')
          .insert([
            {
              ...formData,
              user_id: user.id,
            },
          ]);

        if (insertError) throw insertError;
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to save asset');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Main>
          <Container>
            <div className="asset-page__loading">Loading...</div>
          </Container>
        </Main>
      </>
    );
  }

  return (
    <>
      <Header />
      <Main>
        <Container>
          <div className="asset-page">
            <div className="asset-page__header">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                ← Back to Dashboard
              </Button>
              <h1>{assetId ? 'Edit Asset' : 'Add New Asset'}</h1>
            </div>

            <Card className="asset-page__card">
              <CardBody>
                <form onSubmit={handleSubmit} className="asset-page__form">
                  {error && <div className="asset-page__error">{error}</div>}

                  <Input
                    label="Asset Title"
                    name="title"
                    placeholder="e.g., Gmail Account, Crypto Wallet"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />

                  <Textarea
                    label="Description"
                    name="description"
                    placeholder="Describe this digital asset and why it's important"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                  />

                  <Select
                    label="Asset Type"
                    name="asset_type"
                    value={formData.asset_type}
                    onChange={handleChange}
                    options={[
                      { value: 'account', label: 'Online Account' },
                      { value: 'document', label: 'Document' },
                      { value: 'photo', label: 'Photo Collection' },
                      { value: 'video', label: 'Video' },
                      { value: 'email', label: 'Email Account' },
                      { value: 'social', label: 'Social Media' },
                      { value: 'other', label: 'Other' },
                    ]}
                  />

                  <Textarea
                    label="Access Instructions"
                    name="access_instructions"
                    placeholder="Provide clear instructions for beneficiaries to access this asset (e.g., location of password, recovery phrases, etc.)"
                    value={formData.access_instructions}
                    onChange={handleChange}
                    rows={4}
                  />

                  <Select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'archived', label: 'Archived' },
                    ]}
                  />

                  <div className="asset-page__actions">
                    <Button
                      variant="secondary"
                      onClick={() => navigate('/dashboard')}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                      {saving ? 'Saving...' : assetId ? 'Update Asset' : 'Create Asset'}
                    </Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>
        </Container>
      </Main>
    </>
  );
}
