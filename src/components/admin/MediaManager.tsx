import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { mediaApi, uploadApi } from '../../utils/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

export function MediaManager() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingMedia, setEditingMedia] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'photo', // photo, video, livestream
    url: '',
    thumbnail: '',
    description: '',
    views: '',
    date: ''
  });

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const { media: data } = await mediaApi.getAll();
      setMedia(data);
    } catch (error) {
      console.error('Failed to load media:', error);
      alert('Failed to load media');
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

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    try {
      const { url } = await uploadApi.uploadFile(file);
      setFormData({ ...formData, thumbnail: url });
    } catch (error: any) {
      console.error('Failed to upload thumbnail:', error);
      alert(error.message || 'Failed to upload thumbnail');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingMedia) {
        await mediaApi.update(editingMedia.id, formData);
      } else {
        await mediaApi.create(formData);
      }
      
      await loadMedia();
      setShowDialog(false);
      resetForm();
      alert('Media saved successfully!');
    } catch (error: any) {
      console.error('Failed to save media:', error);
      alert(error.message || 'Failed to save media');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingMedia(item);
    setFormData({
      title: item.title || '',
      type: item.type || 'photo',
      url: item.url || '',
      thumbnail: item.thumbnail || '',
      description: item.description || '',
      views: item.views || '',
      date: item.date || ''
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media item?')) return;

    try {
      await mediaApi.delete(id);
      await loadMedia();
      alert('Media deleted successfully!');
    } catch (error: any) {
      console.error('Failed to delete media:', error);
      alert(error.message || 'Failed to delete media');
    }
  };

  const resetForm = () => {
    setEditingMedia(null);
    setFormData({
      title: '',
      type: 'photo',
      url: '',
      thumbnail: '',
      description: '',
      views: '',
      date: ''
    });
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'livestream':
        return '🔴';
      default:
        return '📸';
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl text-gray-800">Manage Media</h2>
        <Button
          onClick={() => {
            resetForm();
            setShowDialog(true);
          }}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Media
        </Button>
      </div>

      {loading && media.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Loading media...</p>
          </CardContent>
        </Card>
      ) : media.length === 0 ? (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <p className="text-gray-500">No media yet. Click "Add Media" to upload one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="h-40 overflow-hidden bg-gray-200 relative">
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {getMediaIcon(item.type)}
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {item.type}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm text-gray-800 line-clamp-2 flex-1 pr-2">{item.title}</h3>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {item.views && <p>👁️ {item.views}</p>}
                  {item.date && <p>📅 {item.date}</p>}
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
            <DialogTitle>{editingMedia ? 'Edit Media' : 'Add New Media'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="type">Media Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo">Photo Gallery</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="livestream">Livestream</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="url">Media URL</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://youtube.com/watch?v=... or livestream link"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                For videos: YouTube, Vimeo, or other video URL. For livestreams: Facebook, YouTube, or TikTok live URL
              </p>
            </div>

            <div>
              <Label htmlFor="thumbnail">Thumbnail Image *</Label>
              <div className="mt-1 space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="thumbnail"
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
                {formData.thumbnail && (
                  <div className="relative inline-block">
                    <img 
                      src={formData.thumbnail} 
                      alt="Preview" 
                      className="h-32 w-auto rounded border border-gray-200"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                      onClick={() => setFormData({ ...formData, thumbnail: '' })}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description..."
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="views">Views/Count</Label>
                <Input
                  id="views"
                  value={formData.views}
                  onChange={(e) => setFormData({ ...formData, views: e.target.value })}
                  placeholder="e.g., 1.2K views or 45 photos"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  placeholder="e.g., Nov 14, 2025"
                  className="mt-1"
                />
              </div>
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
                {loading ? 'Saving...' : editingMedia ? 'Update Media' : 'Add Media'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
