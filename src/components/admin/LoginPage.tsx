import { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { Lock, Mail } from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (token: string) => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`https://${projectId}.supabase.co/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': publicAnonKey
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setError(data.error_description || data.error || 'Login failed');
        setLoading(false);
        return;
      }

      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        onLoginSuccess(data.access_token);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🕊️</span>
            </div>
            <h1 className="text-2xl text-gray-800 mb-2">Admin Login</h1>
            <p className="text-sm text-gray-600">Miracle Land City - Content Management</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@miraclelandcity.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <p className="text-xs text-gray-600 mb-2">
              <strong>First time setup?</strong>
            </p>
            <p className="text-xs text-gray-600">
              Contact your system administrator to create an admin account.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
