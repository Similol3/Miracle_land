import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { LogOut, Plus, Calendar, Newspaper, Image, Settings, Users, Heart, UserCheck } from 'lucide-react';
import { EventsManager } from './EventsManager';
import { NewsManager } from './NewsManager';
import { MediaManager } from './MediaManager';
import { SettingsManager } from './SettingsManager';
import { TestimoniesManager } from './TestimoniesManager';
import { LeadershipManager } from './LeadershipManager';
import { AdminSignup } from './AdminSignup';
import { authApi } from '../../utils/api';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { user } = await authApi.getUser();
      setUser(user);
    } catch (error) {
      console.error('Failed to load user:', error);
      onLogout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🕊️</span>
              </div>
              <div>
                <h1 className="text-2xl">Admin Dashboard</h1>
                <p className="text-sm text-purple-100">Miracle Land City Content Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden sm:block text-right">
                  <p className="text-sm">{user.user_metadata?.name || user.email}</p>
                  <p className="text-xs text-purple-200">Administrator</p>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-white text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-7 gap-1 mb-8 h-auto">
            <TabsTrigger value="events" className="flex-col sm:flex-row py-3">
              <Calendar className="w-4 h-4 sm:mr-2 mb-1 sm:mb-0" />
              <span className="text-xs sm:text-sm">Events</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex-col sm:flex-row py-3">
              <Newspaper className="w-4 h-4 sm:mr-2 mb-1 sm:mb-0" />
              <span className="text-xs sm:text-sm">News</span>
            </TabsTrigger>
            <TabsTrigger value="media" className="flex-col sm:flex-row py-3">
              <Image className="w-4 h-4 sm:mr-2 mb-1 sm:mb-0" />
              <span className="text-xs sm:text-sm">Media</span>
            </TabsTrigger>
            <TabsTrigger value="testimonies" className="flex-col sm:flex-row py-3">
              <Heart className="w-4 h-4 sm:mr-2 mb-1 sm:mb-0" />
              <span className="text-xs sm:text-sm">Testimonies</span>
            </TabsTrigger>
            <TabsTrigger value="leadership" className="flex-col sm:flex-row py-3">
              <UserCheck className="w-4 h-4 sm:mr-2 mb-1 sm:mb-0" />
              <span className="text-xs sm:text-sm">Leadership</span>
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex-col sm:flex-row py-3">
              <Users className="w-4 h-4 sm:mr-2 mb-1 sm:mb-0" />
              <span className="text-xs sm:text-sm">Admins</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-col sm:flex-row py-3">
              <Settings className="w-4 h-4 sm:mr-2 mb-1 sm:mb-0" />
              <span className="text-xs sm:text-sm">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <EventsManager />
          </TabsContent>

          <TabsContent value="news">
            <NewsManager />
          </TabsContent>

          <TabsContent value="media">
            <MediaManager />
          </TabsContent>

          <TabsContent value="testimonies">
            <TestimoniesManager />
          </TabsContent>

          <TabsContent value="leadership">
            <LeadershipManager />
          </TabsContent>

          <TabsContent value="admins">
            <AdminSignup />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}