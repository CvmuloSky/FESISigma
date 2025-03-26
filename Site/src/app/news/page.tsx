"use client";

import Link from 'next/link';
import { ArrowRight, Calendar, User } from 'lucide-react';

export default function NewsPage() {
  const newsItems = [
    {
      id: 1,
      title: "NerVox Secures $25M Series B Funding",
      summary: "Funding will accelerate the development of our neural models for voice-based disease detection and expand our clinical trial programs.",
      date: "May 15, 2024",
      author: "NerVox Team",
      image: "/news/funding.jpg",
      category: "Company News",
      featured: true
    },
    {
      id: 2,
      title: "New Research Collaboration with Mayo Clinic",
      summary: "NerVox partners with Mayo Clinic to investigate vocal biomarkers for early Parkinson's detection using our proprietary algorithms.",
      date: "April 22, 2024",
      author: "Research Team",
      image: "/news/research.jpg",
      category: "Research",
      featured: true
    },
    {
      id: 3,
      title: "NerVox API 2.0 Released",
      summary: "Our latest API version offers improved accuracy, lower latency, and expanded detection capabilities across multiple neurological conditions.",
      date: "March 10, 2024",
      author: "Product Team",
      image: "/news/api.jpg",
      category: "Product",
      featured: false
    },
    {
      id: 4,
      title: "NerVox Opens New Office in Boston",
      summary: "Expanding our presence in the biotech hub to strengthen partnerships with healthcare institutions and accelerate R&D efforts.",
      date: "February 28, 2024",
      author: "NerVox Team",
      image: "/news/office.jpg",
      category: "Company News",
      featured: false
    },
    {
      id: 5,
      title: "Dr. Aisha Patel to Present at TEDMED",
      summary: "Our Chief Research Officer will discuss the future of voice-based diagnostics and our latest breakthroughs in neural modeling.",
      date: "February 15, 2024",
      author: "Events Team",
      image: "/news/conference.jpg",
      category: "Events",
      featured: false
    },
    {
      id: 6,
      title: "Clinical Trial Results Show 94% Accuracy",
      summary: "Recent trial validates our voice analysis technology's ability to detect early-stage Alzheimer's with unprecedented accuracy.",
      date: "January 30, 2024",
      author: "Research Team",
      image: "/news/clinical.jpg",
      category: "Research",
      featured: false
    },
  ];

  const featuredNews = newsItems.filter(item => item.featured);
  const regularNews = newsItems.filter(item => !item.featured);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-primary text-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link className="flex items-center space-x-2" href="/">
            <span className="font-bold text-xl">NerVox</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/api" className="text-sm font-medium hover:text-white/80">API</Link>
            <Link href="/solutions" className="text-sm font-medium hover:text-white/80">Solutions</Link>
            <Link href="/test" className="text-sm font-medium hover:text-white/80">Test Demo</Link>
            <Link href="/team" className="text-sm font-medium hover:text-white/80">Our Team</Link>
            <Link href="/news" className="text-sm font-medium text-white">News</Link>
            <Link href="/contact" className="text-sm font-medium hover:text-white/80">Contact</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/try-api" className="bg-white text-primary px-4 py-1 rounded-full text-sm font-medium hover:bg-white/90">
              Try API
            </Link>
          </div>
        </div>
        <div className="bg-accent text-white text-center py-1 text-xs">
          <span>NerVox 2.0: Analyze voice data with our new neural models.</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">Latest News</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest developments, research breakthroughs, and company announcements.
            </p>
          </div>

          {/* Featured News */}
          {featuredNews.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-8 text-gray-900">Featured News</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredNews.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    {/* Placeholder for image */}
                    <div className="h-56 bg-primary/10 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/30 flex items-center justify-center text-white font-bold text-xl">
                        NV
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-3">
                        <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                          {item.category}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          {item.date}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 mb-4">{item.summary}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-500">
                          <User className="h-4 w-4 mr-1" />
                          {item.author}
                        </div>
                        <Link href={`/news/${item.id}`} className="text-primary hover:text-primary/80 flex items-center text-sm font-medium">
                          Read more <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent News */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-gray-900">Recent News</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {regularNews.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  {/* Placeholder for image */}
                  <div className="h-40 bg-secondary flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center text-white font-bold text-sm">
                      NV
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                        {item.category}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {item.date}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.summary}</p>
                    <Link href={`/news/${item.id}`} className="text-primary hover:text-primary/80 flex items-center text-sm font-medium">
                      Read more <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Newsletter */}
          <section className="bg-secondary rounded-xl p-10 mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Subscribe to Our Newsletter</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Get the latest updates on our research, product developments, and company news delivered straight to your inbox.
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                />
                <button className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 font-medium">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-10 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">NerVox</h3>
              <p className="text-gray-400">
                Advanced voice analysis platform for healthcare professionals and researchers.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2">
                <li><Link href="/api" className="text-gray-400 hover:text-white">API</Link></li>
                <li><Link href="/solutions" className="text-gray-400 hover:text-white">Solutions</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-gray-400 hover:text-white">Documentation</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 NerVox. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 