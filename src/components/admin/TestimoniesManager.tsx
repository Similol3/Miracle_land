import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { testimoniesApi } from '../../utils/api';

interface Testimony {
  id: string;
  name: string;
  testimony: string;
  amount: string;
  created_at: string;
}

export function TestimoniesManager() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    testimony: '',
    amount: ''
  });

  useEffect(() => {
    loadTestimonies();
  }, []);

  const loadTestimonies = async () => {
    try {
      const { testimonies: data } = await testimoniesApi.getAll();
      setTestimonies(data || []);
    } catch (error) {
      console.error('Failed to load testimonies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await testimoniesApi.update(editingId, formData);
      } else {
        await testimoniesApi.create(formData);
      }
      
      resetForm();
      await loadTestimonies();
      alert(editingId ? 'Testimony updated successfully!' : 'Testimony added successfully!');
    } catch (error: any) {
      console.error('Failed to save testimony:', error);
      alert(error.message || 'Failed to save testimony');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimony: Testimony) => {
    setFormData({
      name: testimony.name,
      testimony: testimony.testimony,
      amount: testimony.amount
    });
    setEditingId(testimony.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimony?')) return;

    setLoading(true);
    try {
      await testimoniesApi.delete(id);
      await loadTestimonies();
      alert('Testimony deleted successfully!');
    } catch (error: any) {
      console.error('Failed to delete testimony:', error);
      alert(error.message || 'Failed to delete testimony');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', testimony: '', amount: '' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl text-gray-800 mb-2">Givers' Testimonies</h2>
          <p className="text-sm sm:text-base text-gray-600">Manage testimonies from people who gave to the ministry</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
        >
          {showForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          {showForm ? 'Cancel' : 'Add Testimony'}
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg text-gray-800 mb-4">
              {editingId ? 'Edit Testimony' : 'Add New Testimony'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Sister Grace O."
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="testimony">Testimony *</Label>
                <Textarea
                  id="testimony"
                  value={formData.testimony}
                  onChange={(e) => setFormData({ ...formData, testimony: e.target.value })}
                  placeholder="Share their testimony of how God blessed them after giving..."
                  required
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="amount">Amount Given</Label>
                <Input
                  id="amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="e.g., ₦50,000"
                  className="mt-1"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editingId ? 'Update Testimony' : 'Add Testimony'}
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

      {/* Testimonies List */}
      <div className="space-y-4">
        {loading && testimonies.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              Loading testimonies...
            </CardContent>
          </Card>
        ) : testimonies.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              No testimonies yet. Click "Add Testimony" to create your first one.
            </CardContent>
          </Card>
        ) : (
          testimonies.map((testimony) => (
            <Card key={testimony.id} className="border-purple-100">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0 text-purple-700 text-lg">
                    {testimony.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                      <div>
                        <h3 className="text-gray-800">{testimony.name}</h3>
                        {testimony.amount && (
                          <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded inline-block mt-1">
                            {testimony.amount}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(testimony)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(testimony.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-600 italic text-sm sm:text-base break-words">
                      "{testimony.testimony}"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
