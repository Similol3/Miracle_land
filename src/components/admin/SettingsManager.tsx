import { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Upload, X } from 'lucide-react';
import { settingsApi, uploadApi } from '../../utils/api';

export function SettingsManager() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    churchName: '',
    tagline: '',
    heroSubtitle: '',
    heroImage: '',
    logoUrl: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    facebookUrl: '',
    youtubeUrl: '',
    tiktokUrl: '',
    instagramUrl: '',
    serviceTime: '',
    serviceDay: '',
    donationTitle: '',
    donationDescription: '',
    donationGoal: '',
    donationCurrent: '',
    donationCurrency: '₦',
    serviceTimes: []
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { settings } = await settingsApi.get();
      setFormData({
        churchName: settings.churchName || '',
        tagline: settings.tagline || '',
        heroSubtitle: settings.heroSubtitle || '',
        heroImage: settings.heroImage || '',
        logoUrl: settings.logoUrl || '',
        contactEmail: settings.contactEmail || '',
        contactPhone: settings.contactPhone || '',
        address: settings.address || '',
        bankName: settings.bankName || '',
        accountNumber: settings.accountNumber || '',
        accountName: settings.accountName || '',
        facebookUrl: settings.facebookUrl || '',
        youtubeUrl: settings.youtubeUrl || '',
        tiktokUrl: settings.tiktokUrl || '',
        instagramUrl: settings.instagramUrl || '',
        serviceTime: settings.serviceTime || '',
        serviceDay: settings.serviceDay || '',
        donationTitle: settings.donationTitle || '',
        donationDescription: settings.donationDescription || '',
        donationGoal: settings.donationGoal || '',
        donationCurrent: settings.donationCurrent || '',
        donationCurrency: settings.donationCurrency || '₦',
        serviceTimes: settings.serviceTimes || []
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'heroImage' | 'logoUrl') => {
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
      setFormData({ ...formData, [field]: url });
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
      await settingsApi.update(formData);
      alert('Settings updated successfully!');
    } catch (error: any) {
      console.error('Failed to update settings:', error);
      alert(error.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  const addServiceTime = () => {
    setFormData({
      ...formData,
      serviceTimes: [
        ...formData.serviceTimes,
        { day: '', type: '', time: '' }
      ]
    });
  };

  const removeServiceTime = (index: number) => {
    setFormData({
      ...formData,
      serviceTimes: formData.serviceTimes.filter((_: any, i: number) => i !== index)
    });
  };

  const updateServiceTime = (index: number, field: string, value: string) => {
    const updated = [...formData.serviceTimes];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, serviceTimes: updated });
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl text-gray-800 mb-2">Church Settings</h2>
        <p className="text-sm sm:text-base text-gray-600">Manage church information, branding, and website content</p>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Church Information */}
            <div>
              <h3 className="text-base sm:text-lg text-gray-800 mb-4">Church Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="churchName">Church Name *</Label>
                  <Input
                    id="churchName"
                    value={formData.churchName}
                    onChange={(e) => setFormData({ ...formData, churchName: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="tagline">Tagline/Subtitle *</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    placeholder="e.g., Power of God Renewed & Evangelical Ministry"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
                  <Input
                    id="heroSubtitle"
                    value={formData.heroSubtitle}
                    onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                    placeholder="e.g., Standing Firm in Faith and Praise"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="logoUrl">Church Logo</Label>
                  <div className="mt-1 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        id="logoUrl"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'logoUrl')}
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
                    {formData.logoUrl && (
                      <div className="relative inline-block">
                        <img 
                          src={formData.logoUrl} 
                          alt="Logo Preview" 
                          className="h-24 w-auto rounded border border-gray-200 bg-white p-2"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                          onClick={() => setFormData({ ...formData, logoUrl: '' })}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="heroImage">Hero Banner Image</Label>
                  <div className="mt-1 space-y-2">
                    <div className="flex gap-2">
                      <Input
                        id="heroImage"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'heroImage')}
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
                    {formData.heroImage && (
                      <div className="relative inline-block">
                        <img 
                          src={formData.heroImage} 
                          alt="Hero Preview" 
                          className="h-32 w-auto rounded border border-gray-200"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                          onClick={() => setFormData({ ...formData, heroImage: '' })}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Service Times */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base sm:text-lg text-gray-800">Service Times</h3>
                <Button type="button" size="sm" onClick={addServiceTime} variant="outline">
                  Add Service
                </Button>
              </div>
              <div className="space-y-3">
                {formData.serviceTimes.map((service: any, index: number) => (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-gray-50 rounded-lg">
                    <Input
                      placeholder="Day (e.g., Sunday)"
                      value={service.day}
                      onChange={(e) => updateServiceTime(index, 'day', e.target.value)}
                    />
                    <Input
                      placeholder="Type (e.g., Main Worship)"
                      value={service.type}
                      onChange={(e) => updateServiceTime(index, 'type', e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Time (e.g., 8:00 AM)"
                        value={service.time}
                        onChange={(e) => updateServiceTime(index, 'time', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeServiceTime(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="border-t pt-6">
              <h3 className="text-base sm:text-lg text-gray-800 mb-4">Social Media Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebookUrl">Facebook URL</Label>
                  <Input
                    id="facebookUrl"
                    type="url"
                    value={formData.facebookUrl}
                    onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="youtubeUrl">YouTube URL</Label>
                  <Input
                    id="youtubeUrl"
                    type="url"
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    placeholder="https://youtube.com/..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="tiktokUrl">TikTok URL</Label>
                  <Input
                    id="tiktokUrl"
                    type="url"
                    value={formData.tiktokUrl}
                    onChange={(e) => setFormData({ ...formData, tiktokUrl: e.target.value })}
                    placeholder="https://tiktok.com/..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="instagramUrl">Instagram URL</Label>
                  <Input
                    id="instagramUrl"
                    type="url"
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/..."
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Donation Settings */}
            <div className="border-t pt-6">
              <h3 className="text-base sm:text-lg text-gray-800 mb-4">Donation Settings</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="donationTitle">Donation Box Title</Label>
                  <Input
                    id="donationTitle"
                    value={formData.donationTitle}
                    onChange={(e) => setFormData({ ...formData, donationTitle: e.target.value })}
                    placeholder="e.g., Support Our Ministry"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="donationDescription">Donation Description</Label>
                  <Textarea
                    id="donationDescription"
                    value={formData.donationDescription}
                    onChange={(e) => setFormData({ ...formData, donationDescription: e.target.value })}
                    placeholder="e.g., Help us spread God's word"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="donationCurrency">Currency</Label>
                    <Input
                      id="donationCurrency"
                      value={formData.donationCurrency}
                      onChange={(e) => setFormData({ ...formData, donationCurrency: e.target.value })}
                      placeholder="₦"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="donationCurrent">Current Amount</Label>
                    <Input
                      id="donationCurrent"
                      type="number"
                      value={formData.donationCurrent}
                      onChange={(e) => setFormData({ ...formData, donationCurrent: e.target.value })}
                      placeholder="50000"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="donationGoal">Goal Amount</Label>
                    <Input
                      id="donationGoal"
                      type="number"
                      value={formData.donationGoal}
                      onChange={(e) => setFormData({ ...formData, donationGoal: e.target.value })}
                      placeholder="200000"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-base sm:text-lg text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Contact Phone *</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Physical Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Bank Details */}
            <div className="border-t pt-6">
              <h3 className="text-base sm:text-lg text-gray-800 mb-4">Bank Details (for Donations)</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="accountName">Account Name *</Label>
                  <Input
                    id="accountName"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={loading || uploading}
              >
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}