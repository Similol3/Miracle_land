import { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Radio, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { eventsApi } from '../utils/api';

export function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { events: data } = await eventsApi.getAll();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingEvents = events.filter(e => !e.isPast);
  const pastEvents = events.filter(e => e.isPast);
  const featuredEvent = upcomingEvents.find(e => e.featured);
  const otherUpcomingEvents = upcomingEvents.filter(e => !e.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl mb-4">Church Events</h1>
          <p className="text-xl text-purple-100">Stay connected with all our upcoming programs and celebrations</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">Loading events...</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-8">
              {upcomingEvents.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-500">No upcoming events at the moment.</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Featured Event */}
                  {featuredEvent && (
                    <Card className="overflow-hidden border-2 border-purple-300 shadow-lg">
                      <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="relative h-64 lg:h-auto">
                          {featuredEvent.image && (
                            <ImageWithFallback
                              src={featuredEvent.image}
                              alt={featuredEvent.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <Badge className="bg-purple-600 text-white">Featured Event</Badge>
                            {featuredEvent.liveStream && (
                              <Badge className="bg-red-600 text-white">
                                <Radio className="w-3 h-3 mr-1" />
                                Will Be Livestreamed
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-8">
                          <h2 className="text-3xl text-purple-800 mb-4">{featuredEvent.title}</h2>
                          <p className="text-gray-600 mb-6">{featuredEvent.description}</p>
                          
                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-gray-700">
                              <Calendar className="w-5 h-5 text-purple-600" />
                              <span>{featuredEvent.date}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                              <Clock className="w-5 h-5 text-purple-600" />
                              <span>{featuredEvent.time}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                              <MapPin className="w-5 h-5 text-purple-600" />
                              <span>{featuredEvent.location}</span>
                            </div>
                          </div>

                          <p className="text-xs text-gray-400 mt-4 text-center">
                            Powered by Miracle Land Media Group
                          </p>
                        </CardContent>
                      </div>
                    </Card>
                  )}

                  {/* Other Upcoming Events */}
                  {otherUpcomingEvents.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {otherUpcomingEvents.map((event) => (
                        <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative h-48">
                            {event.image && (
                              <ImageWithFallback
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                            {event.liveStream && (
                              <div className="absolute top-3 right-3">
                                <Badge className="bg-red-600 text-white">
                                  <Radio className="w-3 h-3 mr-1" />
                                  Live
                                </Badge>
                              </div>
                            )}
                          </div>
                          <CardContent className="p-6">
                            <h3 className="text-xl text-gray-800 mb-3">{event.title}</h3>
                            <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                            
                            <div className="space-y-2 mb-4 text-sm">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4 text-purple-600" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-4 h-4 text-purple-600" />
                                <span>{event.time}</span>
                              </div>
                              <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-4 h-4 text-purple-600" />
                                <span>{event.location}</span>
                              </div>
                            </div>

                            <p className="text-xs text-gray-400 mt-3 text-center">
                              Powered by Miracle Land Media Group
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="past">
              {pastEvents.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-500">No past events to display.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {pastEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                      <div className="relative h-56 overflow-hidden">
                        {event.image && (
                          <ImageWithFallback
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                          <div className="text-white">
                            <p className="text-xs text-purple-200 mb-1">{event.date}</p>
                            <h3 className="text-lg">{event.title}</h3>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs text-gray-400 text-center">
                          Powered by Miracle Land Media Group
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
