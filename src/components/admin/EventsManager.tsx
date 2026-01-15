import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { eventsApi, uploadApi } from '../../utils/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Switch } from '../ui/switch';

export function EventsManager() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    image: '',
    featured: false,
    liveStream: false,
    isPast: false
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { events: data } = await eventsApi.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
      alert('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
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
      if (editingEvent) {
        await eventsApi.update(editingEvent.id, formData);
      } else {
        await eventsApi.create(formData);
      }
      
      await loadEvents();
      setShowDialog(false);
      resetForm();
      alert('Event saved successfully!');
    } catch (error: any) {
      console.error('Failed to save event:', error);
      alert(error.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      date: event.date || '',
      time: event.time || '',
      location: event.location || '',
      description: event.description || '',
      image: event.image || '',
      featured: event.featured || false,
      liveStream: event.liveStream || false,
      isPast: event.isPast || false
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventsApi.delete(id);
      await loadEvents();
      alert('Event deleted successfully!');
    } catch (error: any) {
      console.error('Failed to delete event:', error);
      alert(error.message || 'Failed to delete event');
    }
  };

  const resetForm = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      image: '',
      featured: false,
      liveStream: false,
      isPast: false
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl text-gray-800">Manage Events</h2>
        <Button
          onClick={() => {
            resetForm();
            setShowDialog(true);
          }}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
      </div>

      {loading && events.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Loading events...</p>
          </CardContent>
        </Card>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <p className="text-gray-500">No events yet. Click "Add Event" to create one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              {event.image && (
                <div className="h-40 overflow-hidden bg-gray-200">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-base sm:text-lg text-gray-800 flex-1 pr-2">{event.title}</h3>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(event)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>📅 {event.date}</p>
                  <p>🕐 {event.time}</p>
                  <p>📍 {event.location}</p>
                  {event.featured && <p className="text-purple-600">⭐ Featured</p>}
                  {event.liveStream && <p className="text-red-600">🔴 Livestream</p>}
                  {event.isPast && <p className="text-gray-400">Past Event</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g., November 14, 2025"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder="e.g., 10:00 AM - 2:00 PM"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="mt-1 min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="image">Event Image</Label>
              <div className="mt-1 space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={uploading}
                    className="flex-1"
                  />
                  {uploading && (
                    <Button type="button" disabled className="flex-shrink-0">
                      <Upload className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </Button>
                  )}
                </div>
                {formData.image && (
                  <div className="relative inline-block">
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="h-32 w-auto rounded border border-gray-200"
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

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <Label htmlFor="featured">Featured Event</Label>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <Label htmlFor="liveStream">Will be Livestreamed</Label>
              <Switch
                id="liveStream"
                checked={formData.liveStream}
                onCheckedChange={(checked) => setFormData({ ...formData, liveStream: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <Label htmlFor="isPast">Past Event</Label>
              <Switch
                id="isPast"
                checked={formData.isPast}
                onCheckedChange={(checked) => setFormData({ ...formData, isPast: checked })}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700"
                disabled={loading || uploading}
              >
                {loading ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
