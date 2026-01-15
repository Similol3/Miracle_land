import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useState } from 'react';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [prayerRequest, setPrayerRequest] = useState({
    name: '',
    email: '',
    request: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handlePrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Your prayer request has been received. We are praying for you!');
    setPrayerRequest({ name: '', email: '', request: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl mb-4">Contact Us</h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            We'd love to hear from you. Reach out to us with any questions or prayer requests.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* General Contact Form */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl text-gray-800 mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+234 123 456 7890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        type="text"
                        placeholder="How can we help?"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="mt-1 min-h-32"
                    />
                  </div>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Prayer Request Form */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl text-gray-800">Prayer Request</h2>
                    <p className="text-sm text-gray-600">We believe in the power of prayer</p>
                  </div>
                </div>
                
                <form onSubmit={handlePrayerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prayer-name">Your Name *</Label>
                      <Input
                        id="prayer-name"
                        type="text"
                        placeholder="Enter your name"
                        required
                        value={prayerRequest.name}
                        onChange={(e) => setPrayerRequest({ ...prayerRequest, name: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="prayer-email">Email Address *</Label>
                      <Input
                        id="prayer-email"
                        type="email"
                        placeholder="your.email@example.com"
                        required
                        value={prayerRequest.email}
                        onChange={(e) => setPrayerRequest({ ...prayerRequest, email: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="prayer-request">Your Prayer Request *</Label>
                    <Textarea
                      id="prayer-request"
                      placeholder="Share your prayer request with us..."
                      required
                      value={prayerRequest.request}
                      onChange={(e) => setPrayerRequest({ ...prayerRequest, request: e.target.value })}
                      className="mt-1 min-h-32"
                    />
                  </div>

                  <p className="text-xs text-gray-500 italic">
                    Your prayer request will be handled with confidentiality and prayed over by our pastoral team.
                  </p>

                  <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Submit Prayer Request
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map */}
            <Card>
              <CardContent className="p-0">
                <div className="h-96 bg-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    title="Church Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7285403879567!2d3.3792057!3d6.4281395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2s!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Contact Details */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-lg text-gray-800 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Address</p>
                      <p className="text-gray-700">123 Faith Street<br />Lagos, Nigeria</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <a href="tel:+2341234567890" className="text-gray-700 hover:text-purple-600">
                        +234 123 456 7890
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <a href="mailto:info@miraclelandcity.org" className="text-gray-700 hover:text-purple-600 break-all">
                        info@miraclelandcity.org
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Office Hours</p>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p>Mon - Fri: 9:00 AM - 5:00 PM</p>
                        <p>Sat: 10:00 AM - 2:00 PM</p>
                        <p>Sun: Closed (Worship Services)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Card */}
            <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-800">Chat with Us</h3>
                    <p className="text-xs text-gray-600">Quick response on WhatsApp</p>
                  </div>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message on WhatsApp
                </Button>
              </CardContent>
            </Card>

            {/* Social Media Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg text-gray-800 mb-4">Connect With Us</h3>
                <div className="space-y-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">Facebook</p>
                      <p className="text-xs text-gray-500">@miraclelandcity</p>
                    </div>
                  </a>

                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">YouTube</p>
                      <p className="text-xs text-gray-500">Miracle Land City</p>
                    </div>
                  </a>

                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">Instagram</p>
                      <p className="text-xs text-gray-500">@miraclelandcity</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
