import { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronRight, User } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { newsApi } from '../utils/api';

export function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const { news: data } = await newsApi.getAll();
      setNews(data);
    } catch (error) {
      console.error('Failed to load news:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredArticle = news.find(a => a.featured);
  const otherArticles = news.filter(a => !a.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl mb-4">News & Updates</h1>
          <p className="text-xl text-purple-100">Stay informed about what's happening in our church community</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">Loading news...</p>
            </CardContent>
          </Card>
        ) : news.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500">No news articles available at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Featured Article */}
            {featuredArticle && (
              <Card className="overflow-hidden mb-12 border-2 border-purple-200 shadow-lg">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto">
                    {featuredArticle.image && (
                      <ImageWithFallback
                        src={featuredArticle.image}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-purple-600 text-white">Featured Story</Badge>
                    </div>
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    {featuredArticle.category && (
                      <Badge className="w-fit mb-3 bg-purple-100 text-purple-800 border-purple-300">
                        {featuredArticle.category}
                      </Badge>
                    )}
                    <h2 className="text-3xl text-gray-800 mb-4">{featuredArticle.title}</h2>
                    <p className="text-gray-600 mb-6">{featuredArticle.excerpt}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{featuredArticle.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{featuredArticle.author}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-400 mt-4 text-center">
                      Powered by Miracle Land Media Group
                    </p>
                  </CardContent>
                </div>
              </Card>
            )}

            {/* Article Grid */}
            {otherArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherArticles.map((article) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                    <div className="relative h-48 overflow-hidden">
                      {article.image && (
                        <ImageWithFallback
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                      {article.category && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-purple-600/90 text-white">
                            {article.category}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{article.author}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg text-gray-800 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
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
      </div>
    </div>
  );
}
