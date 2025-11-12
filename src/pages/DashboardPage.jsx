import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Header, Main, Container } from '../components/Layout';
import { Button } from '../components/Button';
import { Card, CardHeader, CardBody, CardFooter } from '../components/Card';
import './DashboardPage.css';

export function DashboardPage() {
  const { user } = useContext(AuthContext);
  const [assets, setAssets] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      const [assetsRes, beneficiariesRes] = await Promise.all([
        supabase.from('digital_assets').select('*').eq('user_id', user.id),
        supabase.from('beneficiaries').select('*').eq('user_id', user.id),
      ]);

      setAssets(assetsRes.data || []);
      setBeneficiaries(beneficiariesRes.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAsset = async (assetId) => {
    try {
      await supabase.from('digital_assets').delete().eq('id', assetId);
      setAssets(assets.filter(a => a.id !== assetId));
    } catch (err) {
      console.error('Error deleting asset:', err);
    }
  };

  const assetTypeIcons = {
    account: '👤',
    document: '📄',
    photo: '📷',
    video: '🎥',
    email: '📧',
    social: '📱',
    other: '📦',
  };

  return (
    <>
      <Header />
      <Main>
        <Container>
          <div className="dashboard">
            <div className="dashboard__header">
              <div>
                <h1>Digital Heritage Dashboard</h1>
                <p>Manage and protect your digital legacy</p>
              </div>
              <div className="dashboard__actions">
                <Button onClick={() => window.location.href = '/add-asset'}>
                  + Add Asset
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => window.location.href = '/beneficiaries'}
                >
                  Manage Beneficiaries
                </Button>
              </div>
            </div>

            <div className="dashboard__grid">
              <div className="dashboard__section">
                <div className="dashboard__section-header">
                  <h2>Your Digital Assets</h2>
                  <span className="dashboard__count">{assets.length}</span>
                </div>

                {loading ? (
                  <div className="dashboard__loading">Loading assets...</div>
                ) : assets.length === 0 ? (
                  <Card>
                    <CardBody>
                      <div className="dashboard__empty">
                        <span className="dashboard__empty-icon">📭</span>
                        <h3>No assets yet</h3>
                        <p>Start by adding your first digital asset to protect</p>
                        <Button
                          onClick={() => window.location.href = '/add-asset'}
                          className="dashboard__empty-button"
                        >
                          Add Your First Asset
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ) : (
                  <div className="dashboard__assets">
                    {assets.map(asset => (
                      <Card key={asset.id} className="asset-card">
                        <CardHeader>
                          <div className="asset-card__header">
                            <div className="asset-card__icon-title">
                              <span className="asset-card__icon">
                                {assetTypeIcons[asset.asset_type] || assetTypeIcons.other}
                              </span>
                              <div>
                                <h3>{asset.title}</h3>
                                <span className="asset-card__type">{asset.asset_type}</span>
                              </div>
                            </div>
                            <span className={`asset-card__status asset-card__status--${asset.status}`}>
                              {asset.status}
                            </span>
                          </div>
                        </CardHeader>
                        <CardBody>
                          <p>{asset.description || 'No description provided'}</p>
                          {asset.access_instructions && (
                            <div className="asset-card__instructions">
                              <strong>Access Instructions:</strong>
                              <p>{asset.access_instructions}</p>
                            </div>
                          )}
                        </CardBody>
                        <CardFooter>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.location.href = `/edit-asset/${asset.id}`}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteAsset(asset.id)}
                          >
                            Delete
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div className="dashboard__section">
                <div className="dashboard__section-header">
                  <h2>Beneficiaries</h2>
                  <span className="dashboard__count">{beneficiaries.length}</span>
                </div>

                {beneficiaries.length === 0 ? (
                  <Card>
                    <CardBody>
                      <div className="dashboard__empty">
                        <span className="dashboard__empty-icon">👥</span>
                        <h3>No beneficiaries added</h3>
                        <p>Designate heirs to access your digital assets</p>
                        <Button
                          onClick={() => window.location.href = '/beneficiaries'}
                          className="dashboard__empty-button"
                        >
                          Add Beneficiaries
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                ) : (
                  <div className="dashboard__beneficiaries">
                    {beneficiaries.map(beneficiary => (
                      <Card key={beneficiary.id}>
                        <CardBody>
                          <div className="beneficiary-card">
                            <div>
                              <h4>{beneficiary.name}</h4>
                              <p>{beneficiary.email}</p>
                              {beneficiary.relationship && (
                                <span className="beneficiary-card__relationship">
                                  {beneficiary.relationship}
                                </span>
                              )}
                            </div>
                            {beneficiary.notification_sent && (
                              <span className="beneficiary-card__notified">✓ Notified</span>
                            )}
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
