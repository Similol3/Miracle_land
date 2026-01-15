import { Target, Eye, Heart, Users, Camera, Video, Radio, Edit } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { leadersApi } from '../utils/api';

interface Leader {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  type: 'leadership' | 'media';
}

export function AboutPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaders();
  }, []);

  const loadLeaders = async () => {
    try {
      const { leaders: data } = await leadersApi.getAll();
      setLeaders(data || []);
    } catch (error) {
      console.error('Failed to load leaders:', error);
    } finally {
      setLoading(false);
    }
  };

  const leadership = leaders.filter(l => l.type === 'leadership');
  const mediaTeam = leaders.filter(l => l.type === 'media');

  const coreBeliefs = [
    {
      title: 'The Holy Bible',
      description: 'We believe the Bible is the inspired, infallible Word of God and our ultimate authority for faith and practice.'
    },
    {
      title: 'The Trinity',
      description: 'We believe in one God eternally existing in three persons: Father, Son, and Holy Spirit.'
    },
    {
      title: 'Salvation',
      description: 'We believe salvation is a gift of God\'s grace through faith in Jesus Christ alone.'
    },
    {
      title: 'The Church',
      description: 'We believe the church is the body of Christ, called to worship, fellowship, and serve together.'
    },
    {
      title: 'The Holy Spirit',
      description: 'We believe in the baptism and gifts of the Holy Spirit for all believers today.'
    },
    {
      title: 'Second Coming',
      description: 'We believe in the personal return of Jesus Christ to establish His eternal kingdom.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl mb-4">About Us</h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Miracle Land City - Power of God Renewed & Evangelical Ministry
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Intro Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl text-gray-800 mb-6">Welcome to Miracle Land City</h2>
            <p className="text-gray-600 mb-4">
              Miracle Land City is a vibrant, Spirit-filled church committed to spreading the gospel of Jesus Christ 
              through worship, prayer, and modern media technology. We are a community of believers standing firm in 
              faith and praise, united in our mission to reach souls for Christ.
            </p>
            <p className="text-gray-600 mb-4">
              Founded on the principles of God's Word, we believe in the power of the Holy Spirit to transform lives 
              and communities. Our church is more than a building—it's a family where everyone is welcome to encounter 
              the living God.
            </p>
            <p className="text-gray-600">
              Through our dedicated Media Group, we leverage technology to broadcast the gospel message far and wide, 
              reaching people who might never step through our doors. Every service, every event, and every message is 
              an opportunity to witness God's miraculous power at work.
            </p>
          </div>
          <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1629143949694-606987575b07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHVyY2glMjB3b3JzaGlwJTIwcHJhaXNlfGVufDF8fHx8MTc2MTczNDA2N3ww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Church Worship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl text-gray-800 mb-3">Our Mission</h3>
              <p className="text-gray-600">
                To preach the gospel, make disciples, and demonstrate God's love through worship, fellowship, and service to our community and beyond.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl text-gray-800 mb-3">Our Vision</h3>
              <p className="text-gray-600">
                To be a light in our generation, raising Spirit-filled believers who impact their world through faith, excellence, and godly character.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl text-gray-800 mb-3">Our Values</h3>
              <p className="text-gray-600">
                Faith, Excellence, Integrity, Love, and Unity. These values guide everything we do as we serve God and minister to people.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Core Beliefs */}
        <div className="mb-16">
          <h2 className="text-3xl text-gray-800 mb-8 text-center">What We Believe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreBeliefs.map((belief, index) => (
              <Card key={index} className="border-purple-100">
                <CardContent className="p-6">
                  <h3 className="text-lg text-purple-700 mb-2">{belief.title}</h3>
                  <p className="text-sm text-gray-600">{belief.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Leadership */}
        {leadership.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl text-gray-800 mb-8 text-center">Our Leadership</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {leadership.map((leader) => (
                <Card key={leader.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {leader.image && (
                    <div className="h-64 overflow-hidden">
                      <img
                        src={leader.image}
                        alt={leader.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-5 text-center">
                    <h3 className="text-lg text-gray-800 mb-1">{leader.name}</h3>
                    <p className="text-sm text-purple-600 mb-3">{leader.role}</p>
                    <p className="text-xs text-gray-600">{leader.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Media Team */}
        {mediaTeam.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl text-gray-800 mb-3">Meet the Media Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our dedicated media team works tirelessly to ensure every service and event is broadcast with excellence, 
                bringing the gospel to screens around the world.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaTeam.map((member) => (
                <Card key={member.id} className="border-purple-100 hover:border-purple-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {member.image && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg text-gray-800 mb-1">{member.name}</h3>
                        <p className="text-sm text-purple-600 mb-2">{member.role}</p>
                        <p className="text-xs text-gray-600">{member.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-8">
              Powered by Miracle Land Media Group
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}