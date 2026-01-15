import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { UserPlus } from 'lucide-react';
import { authApi } from '../../utils/api';

export function AdminSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);

    try {
      await authApi.signup(formData.email, formData.password, formData.name);
      setMessage({ type: 'success', text: 'Admin account created successfully!' });
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Failed to create admin:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to create admin account' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl text-gray-800 mb-2">Create Admin Account</h2>
        <p className="text-gray-600">Add new administrators who can manage website content</p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardContent className="p-6">
            {message.text && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-700'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@miraclelandcity.org"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  required
                  className="mt-1"
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  disabled={loading}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {loading ? 'Creating Account...' : 'Create Admin Account'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="text-sm text-blue-900 mb-2">ℹ️ Important Notes:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Admin accounts have full access to manage website content</li>
              <li>Email verification is automatically confirmed in this system</li>
              <li>Admins can create events, news, media, and manage settings</li>
              <li>Keep admin credentials secure and confidential</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
