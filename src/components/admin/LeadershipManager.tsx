import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react';
import { leadersApi, uploadApi } from '../../utils/api';

interface Leader {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  type: 'leadership' | 'media';
  created_at: string;
}

export function LeadershipManager() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'leadership' | 'media'>('leadership');
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    image: '',
    type: 'leadership' as 'leadership' | 'media'
  });

  useEffect(() => {
    loadLeaders();
  }, []);

  const loadLeaders = async () => {
    try {
      const { leaders: data } = await leadersApi.getAll();
      setLeaders(data || []);
    } catch (error) {
      console.error('Failed to load leaders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const { url } = await uploadApi.uploadFile(file);
      setFormData({ ...formData, image: url });
    } catch (error: any) {
      console.error('Failed to upload image:', error);
      alert(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await leadersApi.update(editingId, { ...formData, type: activeTab });
      } else {
        await leadersApi.create({ ...formData, type: activeTab });
      }
      
      resetForm();
      await loadLeaders();
      alert(editingId ? 'Leader updated successfully!' : 'Leader added successfully!');
    } catch (error: any) {
      console.error('Failed to save leader:', error);
      alert(error.message || 'Failed to save leader');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (leader: Leader) => {
    setFormData({
      name: leader.name,
      role: leader.role,
      bio: leader.bio,
      image: leader.image,
      type: leader.type
    });
    setEditingId(leader.id);
    setActiveTab(leader.type);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this leader?')) return;

    setLoading(true);
    try {
      await leadersApi.delete(id);
      await loadLeaders();
      alert('Leader deleted successfully!');
    } catch (error: any) {
      console.error('Failed to delete leader:', error);
      alert(error.message || 'Failed to delete leader');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', role: '', bio: '', image: '', type: 'leadership' });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredLeaders = leaders.filter(l => l.type === activeTab);

  return (
    <div className="max-w-6xl">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl text-gray-800 mb-2">Leadership & Media Team</h2>
          <p className="text-sm sm:text-base text-gray-600">Manage church leadership and media team members</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
        >
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? 'Cancel' : 'Add Member'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('leadership')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'leadership'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Church Leadership
        </button>
        <button
          onClick={() => setActiveTab('media')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'media'
              ? 'text-purple-600 border-b-2 border-purple-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Media Team
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg text-gray-800 mb-4">
              {editingId ? 'Edit Member' : `Add New ${activeTab === 'leadership' ? 'Leader' : 'Team Member'}`}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Pastor David Okonkwo"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="role">Role/Position *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="e.g., Senior Pastor"
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio/Description *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Brief description about this person..."
                  required
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="image">Profile Image</Label>
                <div className="mt-1 space-y-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                  />
                  {uploading && <p className="text-sm text-purple-600">Uploading...</p>}
                  {formData.image && (
                    <div className="relative inline-block">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="h-32 w-32 rounded-lg border border-gray-200 object-cover"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                        onClick={() => setFormData({ ...formData, image: '' })}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  disabled={loading || uploading}
                >
                  {loading ? 'Saving...' : editingId ? 'Update Member' : 'Add Member'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Leaders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && filteredLeaders.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center text-gray-500">
              Loading...
            </CardContent>
          </Card>
        ) : filteredLeaders.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-8 text-center text-gray-500">
              No {activeTab === 'leadership' ? 'leaders' : 'team members'} yet. Click "Add Member" to create one.
            </CardContent>
          </Card>
        ) : (
          filteredLeaders.map((leader) => (
            <Card key={leader.id} className="overflow-hidden">
              {leader.image && (
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardContent className="p-4">
                <h3 className="text-lg text-gray-800 mb-1">{leader.name}</h3>
                <p className="text-sm text-purple-600 mb-2">{leader.role}</p>
                <p className="text-xs text-gray-600 mb-4 line-clamp-2">{leader.bio}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(leader)}
                    className="flex-1"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(leader.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}