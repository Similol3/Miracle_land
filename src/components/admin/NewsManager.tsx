import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { newsApi, uploadApi } from '../../utils/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Switch } from '../ui/switch';

export function NewsManager() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingNews, setEditingNews] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    author: '',
    category: '',
    featured: false
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const { news: data } = await newsApi.getAll();
      setNews(data);
    } catch (error) {
      console.error('Failed to load news:', error);
      alert('Failed to load news');
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
      const dataToSave = {
        ...formData,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      };

      if (editingNews) {
        await newsApi.update(editingNews.id, dataToSave);
      } else {
        await newsApi.create(dataToSave);
      }
      
      await loadNews();
      setShowDialog(false);
      resetForm();
      alert('News article saved successfully!');
    } catch (error: any) {
      console.error('Failed to save news:', error);
      alert(error.message || 'Failed to save news');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (article: any) => {
    setEditingNews(article);
    setFormData({
      title: article.title || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      image: article.image || '',
      author: article.author || '',
      category: article.category || '',
      featured: article.featured || false
    });
    setShowDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      await newsApi.delete(id);
      await loadNews();
      alert('Article deleted successfully!');
    } catch (error: any) {
      console.error('Failed to delete article:', error);
      alert(error.message || 'Failed to delete article');
    }
  };

  const resetForm = () => {
    setEditingNews(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image: '',
      author: '',
      category: '',
      featured: false
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl text-gray-800">Manage News & Updates</h2>
        <Button
          onClick={() => {
            resetForm();
            setShowDialog(true);
          }}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Article
        </Button>
      </div>

      {loading && news.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Loading news articles...</p>
          </CardContent>
        </Card>
      ) : news.length === 0 ? (
        <Card>
          <CardContent className="p-8 sm:p-12 text-center">
            <p className="text-gray-500">No articles yet. Click "Add Article" to create one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((article) => (
            <Card key={article.id} className="overflow-hidden">
              {article.image && (
                <div className="h-40 overflow-hidden bg-gray-200">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 pr-2">
                    <h3 className="text-base sm:text-lg text-gray-800 mb-1">{article.title}</h3>
                    {article.category && (
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                        {article.category}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(article)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(article.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{article.excerpt}</p>
                <div className="text-xs text-gray-500">
                  <p>By {article.author || 'Admin'} • {article.date || 'Today'}</p>
                  {article.featured && <p className="text-purple-600 mt-1">⭐ Featured Article</p>}
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
            <DialogTitle>{editingNews ? 'Edit Article' : 'Add New Article'}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title">Article Title *</Label>
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
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g., Media Team"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Events, Announcements"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt">Short Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary of the article..."
                required
                className="mt-1 min-h-20"
              />
            </div>

            <div>
              <Label htmlFor="content">Full Article Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Full article text..."
                required
                className="mt-1 min-h-32"
              />
            </div>

            <div>
              <Label htmlFor="image">Article Image</Label>
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
              <Label htmlFor="featured">Featured Article</Label>
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
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
                {loading ? 'Saving...' : editingNews ? 'Update Article' : 'Publish Article'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
