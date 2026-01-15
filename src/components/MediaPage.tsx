import { useState, useEffect } from 'react';
import { Play, Image as ImageIcon, Video, Radio } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { mediaApi } from '../utils/api';

export function MediaPage() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const { media: data } = await mediaApi.getAll();
      setMedia(data);
    } catch (error) {
      console.error('Failed to load media:', error);
    } finally {
      setLoading(false);
    }
  };

  const livestreams = media.filter(m => m.type === 'livestream');
  const photos = media.filter(m => m.type === 'photo');
  const videos = media.filter(m => m.type === 'video');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl mb-4">Media Gallery</h1>
          <p className="text-xl text-purple-100">Experience our worship services, events, and performances</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">Loading media...</p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="livestreams" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="livestreams">
                <Radio className="w-4 h-4 mr-2" />
                Livestreams
              </TabsTrigger>
              <TabsTrigger value="photos">
                <ImageIcon className="w-4 h-4 mr-2" />
                Photos
              </TabsTrigger>
              <TabsTrigger value="videos">
                <Video className="w-4 h-4 mr-2" />
                Videos
              </TabsTrigger>
            </TabsList>

            {/* Livestreams Tab */}
            <TabsContent value="livestreams">
              {livestreams.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-500">No livestreams available at the moment.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {livestreams.map((stream) => (
                    <Card key={stream.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                      <div className="relative h-48">
                        {stream.thumbnail && (
                          <ImageWithFallback
                            src={stream.thumbnail}
                            alt={stream.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-purple-600 ml-1" fill="currentColor" />
                          </div>
                        </div>
                        {stream.views && (
                          <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {stream.views}
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-gray-800 mb-1">{stream.title}</h3>
                        {stream.description && <p className="text-sm text-gray-500">{stream.description}</p>}
                        <p className="text-xs text-gray-400 mt-2">Powered by Miracle Land Media Group</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Photos Tab */}
            <TabsContent value="photos">
              {photos.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-500">No photo galleries available at the moment.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {photos.map((gallery) => (
                    <Card key={gallery.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                      <div className="relative h-56">
                        {gallery.thumbnail && (
                          <ImageWithFallback
                            src={gallery.thumbnail}
                            alt={gallery.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                          {gallery.views && (
                            <div className="absolute top-4 right-4 bg-white/90 text-purple-800 px-3 py-1 rounded-full text-sm">
                              <ImageIcon className="w-3 h-3 inline mr-1" />
                              {gallery.views}
                            </div>
                          )}
                          {gallery.date && <p className="text-xs text-purple-200 mb-1">{gallery.date}</p>}
                          <h3 className="text-white text-lg">{gallery.title}</h3>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <p className="text-xs text-gray-400 text-center">Powered by Miracle Land Media Group</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos">
              {videos.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-gray-500">No videos available at the moment.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                      <div className="relative h-48">
                        {video.thumbnail && (
                          <ImageWithFallback
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-purple-600 ml-1" fill="currentColor" />
                          </div>
                        </div>
                        {video.views && (
                          <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded">
                            {video.views}
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="text-gray-800 mb-1">{video.title}</h3>
                        {video.description && <p className="text-sm text-gray-500">{video.description}</p>}
                        <p className="text-xs text-gray-400 mt-2">Powered by Miracle Land Media Group</p>
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
