import { Heart, Camera, Mic, Monitor, DollarSign, Copy, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { testimoniesApi, settingsApi } from '../utils/api';

interface Testimony {
  id: string;
  name: string;
  testimony: string;
  amount: string;
}

export function GivePage() {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    accountName: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [testimonyData, settingsData] = await Promise.all([
        testimoniesApi.getAll(),
        settingsApi.get()
      ]);
      
      setTestimonies(testimonyData.testimonies || []);
      setBankDetails({
        bankName: settingsData.settings.bankName || '',
        accountNumber: settingsData.settings.accountNumber || '',
        accountName: settingsData.settings.accountName || ''
      });
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const fundingGoals = [
    {
      id: 1,
      title: 'New 4K Camera System',
      raised: 125000,
      goal: 350000,
      icon: Camera,
      description: 'Professional 4K cameras for high-quality livestreaming and recording'
    },
    {
      id: 2,
      title: 'Audio Equipment Upgrade',
      raised: 80000,
      goal: 150000,
      icon: Mic,
      description: 'Wireless microphones and mixing console for crystal-clear sound'
    },
    {
      id: 3,
      title: 'LED Video Wall',
      raised: 200000,
      goal: 500000,
      icon: Monitor,
      description: 'Large LED screen for better visibility during services and events'
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'New Camera Purchased',
      image: 'https://images.unsplash.com/photo-1758851088217-df00ca346e24?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBlcXVpcG1lbnQlMjBtZWRpYXxlbnwxfHx8fDE3NjE3MzQwNjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Thanks to your donations, we acquired a professional 4K camera!'
    },
    {
      id: 2,
      title: 'Livestream Upgrade Complete',
      image: 'https://images.unsplash.com/photo-1629143949694-606987575b07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjB3b3JzaGlwJTIwcHJhaXNlfGVufDF8fHx8MTc2MTczNDA2N3ww&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'We can now broadcast in HD to reach more souls worldwide!'
    },
    {
      id: 3,
      title: 'Audio System Enhanced',
      image: 'https://images.unsplash.com/photo-1745852737143-a8b275407f2a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjBjaG9pciUyMHNpbmdpbmd8ZW58MXx8fHwxNzYxNzM0MDY4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      description: 'Crystal clear sound quality for all our services and events!'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white" fill="currentColor" />
          </div>
          <h1 className="text-4xl md:text-5xl mb-4">Support Our Ministry</h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Your giving keeps the message of Christ shining through our screens and reaching souls worldwide
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Funding Goals */}
            <div>
              <h2 className="text-2xl text-gray-800 mb-6">Current Funding Goals</h2>
              <div className="space-y-4">
                {fundingGoals.map((goal) => {
                  const Icon = goal.icon;
                  const percentage = (goal.raised / goal.goal) * 100;
                  
                  return (
                    <Card key={goal.id} className="border-purple-100">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg text-gray-800 mb-1">{goal.title}</h3>
                            <p className="text-sm text-gray-600">{goal.description}</p>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className="text-purple-600">
                              ₦{goal.raised.toLocaleString()} / ₦{goal.goal.toLocaleString()}
                            </span>
                          </div>
                          <Progress value={percentage} className="h-3" />
                        </div>
                        
                        <p className="text-sm text-gray-500">
                          {percentage.toFixed(0)}% funded • ₦{(goal.goal - goal.raised).toLocaleString()} remaining
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Donation Impact */}
            <div>
              <h2 className="text-2xl text-gray-800 mb-6">What Your Donations Achieved</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className="overflow-hidden">
                    <div className="h-40 overflow-hidden">
                      <ImageWithFallback
                        src={achievement.image}
                        alt={achievement.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-gray-800 mb-2">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Testimonies */}
            <div>
              <h2 className="text-2xl text-gray-800 mb-6">💫 Givers' Testimonies</h2>
              {loading ? (
                <Card className="border-purple-100">
                  <CardContent className="p-6 text-center text-gray-500">
                    Loading testimonies...
                  </CardContent>
                </Card>
              ) : testimonies.length === 0 ? (
                <Card className="border-purple-100">
                  <CardContent className="p-6 text-center text-gray-500">
                    No testimonies yet. Check back soon!
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {testimonies.map((testimony) => (
                    <Card key={testimony.id} className="border-purple-100 bg-gradient-to-br from-purple-50 to-white">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0 text-purple-700">
                            {testimony.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-gray-800">{testimony.name}</h3>
                              {testimony.amount && (
                                <span className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded">
                                  {testimony.amount}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 italic">"{testimony.testimony}"</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Bank Details Card */}
            <Card className="border-2 border-purple-200 sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <DollarSign className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl text-gray-800 mb-2">Give Now</h3>
                  <p className="text-sm text-gray-600">
                    Support the Media Ministry
                  </p>
                </div>

                {loading ? (
                  <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-100 text-center text-gray-500">
                    Loading bank details...
                  </div>
                ) : bankDetails.bankName ? (
                  <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-100">
                    <p className="text-xs text-gray-500 mb-3">Bank Transfer Details:</p>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500">Bank Name</label>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-700">{bankDetails.bankName}</p>
                          <button
                            onClick={() => copyToClipboard(bankDetails.bankName, 'bank')}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            {copiedField === 'bank' ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500">Account Number</label>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-gray-700">{bankDetails.accountNumber}</p>
                          <button
                            onClick={() => copyToClipboard(bankDetails.accountNumber, 'account')}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            {copiedField === 'account' ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-500">Account Name</label>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-700">{bankDetails.accountName}</p>
                          <button
                            onClick={() => copyToClipboard(bankDetails.accountName, 'name')}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            {copiedField === 'name' ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-purple-50 rounded-lg p-4 mb-6 border border-purple-100 text-center text-sm text-gray-600">
                    Bank details will be available soon.
                  </div>
                )}

                <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
                  <p className="text-xs text-gray-500 mb-2 text-center">Or scan QR code:</p>
                  <div className="w-40 h-40 bg-gray-100 rounded-lg mx-auto flex items-center justify-center">
                    <p className="text-xs text-gray-400 text-center px-4">QR Code Placeholder</p>
                  </div>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700 mb-4">
                  <Heart className="w-4 h-4 mr-2" fill="currentColor" />
                  Give via Paystack
                </Button>

                <p className="text-xs text-center text-gray-500 italic leading-relaxed">
                  "Your giving keeps the message of Christ shining through our screens."
                </p>
              </CardContent>
            </Card>

            {/* Info Box */}
            <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
              <CardContent className="p-6">
                <h3 className="text-lg text-gray-800 mb-3">Why Give?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Reach more souls through livestreaming</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Preserve powerful messages for future generations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Enhance worship experience with better technology</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>Support our media team's training and growth</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}