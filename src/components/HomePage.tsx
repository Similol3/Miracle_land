import { Calendar, Clock, Heart, Radio } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useEffect, useState } from 'react';
import { eventsApi, newsApi, settingsApi } from '../utils/api';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [eventsData, newsData, settingsData] = await Promise.all([
        eventsApi.getAll(),
        newsApi.getAll(),
        settingsApi.get()
      ]);
      
      setEvents(eventsData.events || []);
      setNews(newsData.news || []);
      setSettings(settingsData.settings || {});
    } catch (error) {
      console.error('Failed to load home page data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get featured event
  const featuredEvent = events.find(e => e.featured && !e.isPast);
  
  // Get next upcoming event for countdown
  const upcomingEvents = events.filter(e => !e.isPast).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const nextEvent = upcomingEvents[0];

  // Countdown timer for next event
  useEffect(() => {
    if (!nextEvent?.date) return;

    const calculateCountdown = () => {
      const eventDate = new Date(nextEvent.date).getTime();
      const now = new Date().getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, [nextEvent]);

  // Get latest news (first 2)
  const latestNews = news.slice(0, 2);

  // Check if there's a live event
  const liveEvent = events.find(e => e.liveStream && !e.isPast);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          {settings?.heroImage ? (
            <ImageWithFallback
              src={settings.heroImage}
              alt="Church Hero"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-purple-900 to-purple-800"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-purple-800/80"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              🕊️ Welcome to {settings?.churchName || 'Miracle Land City'}
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 sm:mb-6">
              {settings?.tagline || 'Power of God Renewed & Evangelical Ministry'}
            </h1>
            <p className="text-lg sm:text-xl text-purple-100 mb-6 sm:mb-8">
              {settings?.heroSubtitle || 'Standing Firm in Faith and Praise'}
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Button 
                size="lg" 
                className="bg-white text-purple-800 hover:bg-purple-50" 
                onClick={() => onNavigate('media')}
              >
                <Radio className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Watch Live
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10" 
                onClick={() => onNavigate('events')}
              >
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Events
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10" 
                onClick={() => onNavigate('give')}
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Give
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Row - Only show if there's a next event */}
      {nextEvent && (
        <div className="bg-gradient-to-r from-purple-700 to-purple-600 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-white">
              {/* Countdown */}
              <div className="flex items-center gap-3 sm:gap-4">
                <Calendar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-purple-100 truncate">Next Event: {nextEvent.title}</p>
                  <div className="flex gap-1 sm:gap-2 mt-1 flex-wrap">
                    <div className="bg-white/20 px-2 sm:px-3 py-1 rounded">
                      <span className="text-lg sm:text-xl">{countdown.days}</span>
                      <span className="text-xs ml-1">d</span>
                    </div>
                    <div className="bg-white/20 px-2 sm:px-3 py-1 rounded">
                      <span className="text-lg sm:text-xl">{countdown.hours}</span>
                      <span className="text-xs ml-1">h</span>
                    </div>
                    <div className="bg-white/20 px-2 sm:px-3 py-1 rounded">
                      <span className="text-lg sm:text-xl">{countdown.minutes}</span>
                      <span className="text-xs ml-1">m</span>
                    </div>
                    <div className="bg-white/20 px-2 sm:px-3 py-1 rounded">
                      <span className="text-lg sm:text-xl">{countdown.seconds}</span>
                      <span className="text-xs ml-1">s</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Time */}
              {settings?.serviceTime && (
                <div className="flex items-center gap-3 sm:gap-4">
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-purple-100">{settings.serviceDay || 'Join Us This Sunday'}</p>
                    <p className="text-lg sm:text-xl">{settings.serviceTime}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Livestream Banner - Only show if there's a live event */}
      {liveEvent && (
        <div className="bg-red-600 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse"></span>
                </div>
                <div className="text-white">
                  <p className="text-base sm:text-lg">🔴 We're Live Now!</p>
                  <p className="text-sm text-red-100 hidden sm:block">{liveEvent.title}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                {settings?.facebookUrl && (
                  <Button size="sm" className="bg-white text-red-600 hover:bg-red-50" asChild>
                    <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </a>
                  </Button>
                )}
                {settings?.youtubeUrl && (
                  <Button size="sm" className="bg-white text-red-600 hover:bg-red-50" asChild>
                    <a href={settings.youtubeUrl} target="_blank" rel="noopener noreferrer">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                      YouTube
                    </a>
                  </Button>
                )}
                {settings?.tiktokUrl && (
                  <Button size="sm" className="bg-white text-red-600 hover:bg-red-50" asChild>
                    <a href={settings.tiktokUrl} target="_blank" rel="noopener noreferrer">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                      </svg>
                      TikTok
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            {/* Featured Event */}
            {featuredEvent && (
              <Card className="overflow-hidden border-2 border-purple-200">
                {featuredEvent.image && (
                  <div className="relative h-48 sm:h-56 md:h-64">
                    <ImageWithFallback
                      src={featuredEvent.image}
                      alt={featuredEvent.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-purple-600 text-white">Featured Event</Badge>
                    </div>
                  </div>
                )}
                <CardContent className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl text-purple-800 mb-2">{featuredEvent.title}</h2>
                  <p className="text-sm sm:text-base text-gray-600 mb-4">{featuredEvent.description}</p>
                  <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{featuredEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{featuredEvent.time}</span>
                    </div>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => onNavigate('events')}>
                    View Event Details
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Latest News Preview */}
            {latestNews.length > 0 && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl sm:text-2xl text-gray-800">Latest News & Updates</h2>
                  <Button variant="ghost" className="text-purple-600" onClick={() => onNavigate('news')}>
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {latestNews.map((article) => (
                    <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                      {article.image && (
                        <div className="h-32 overflow-hidden">
                          <ImageWithFallback
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <p className="text-xs text-purple-600 mb-1">{article.date}</p>
                        <h3 className="text-base text-gray-800 mb-2">{article.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{article.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {!featuredEvent && latestNews.length === 0 && (
              <Card>
                <CardContent className="p-8 sm:p-12 text-center">
                  <p className="text-gray-500">
                    Welcome to {settings?.churchName || 'Miracle Land City'}! Content will appear here once the admin team adds events and news.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Donate Box */}
            {settings?.showDonationBox !== false && (
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="p-4 sm:p-6">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg sm:text-xl text-gray-800 mb-2">
                      {settings?.donationTitle || 'Support Our Ministry'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {settings?.donationDescription || 'Help us spread God\'s word'}
                    </p>
                  </div>

                  {settings?.donationGoal && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Goal Progress</span>
                        <span className="text-purple-600">
                          {settings.donationCurrency || '₦'}{settings.donationCurrent || 0} / {settings.donationCurrency || '₦'}{settings.donationGoal}
                        </span>
                      </div>
                      <Progress value={(settings.donationCurrent || 0) / settings.donationGoal * 100} className="h-2" />
                    </div>
                  )}

                  {settings?.bankName && (
                    <div className="bg-white rounded-lg p-3 sm:p-4 mb-4 border border-purple-100">
                      <p className="text-xs text-gray-500 mb-2">Bank Details:</p>
                      <p className="text-sm text-gray-700">Bank: {settings.bankName}</p>
                      <p className="text-sm text-gray-700">Account: {settings.accountNumber}</p>
                      <p className="text-sm text-gray-700">Name: {settings.accountName}</p>
                    </div>
                  )}

                  <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => onNavigate('give')}>
                    Give Now
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Service Times */}
            {settings?.serviceTimes && settings.serviceTimes.length > 0 && (
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg text-gray-800 mb-4">Service Times</h3>
                  <div className="space-y-3">
                    {settings.serviceTimes.map((service: any, index: number) => (
                      <div key={index} className={`flex justify-between items-center ${index < settings.serviceTimes.length - 1 ? 'pb-3 border-b border-gray-100' : ''}`}>
                        <div>
                          <p className="text-sm sm:text-base text-gray-800">{service.day}</p>
                          <p className="text-xs sm:text-sm text-gray-500">{service.type}</p>
                        </div>
                        <p className="text-sm sm:text-base text-purple-600">{service.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
