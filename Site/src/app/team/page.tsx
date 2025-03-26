"use client";

import Link from 'next/link';
import { Linkedin, Twitter } from 'lucide-react';

export default function TeamPage() {
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Founder & CEO",
      bio: "Ph.D. in Neuroscience from Stanford, with 15+ years experience in voice analysis and AI. Previously led research at Google Brain.",
      image: "/team/sarah.jpg"
    },
    {
      name: "Michael Rodriguez",
      role: "CTO",
      bio: "Former Director of Engineering at OpenAI. Specializes in machine learning systems and large-scale data processing.",
      image: "/team/michael.jpg"
    },
    {
      name: "Dr. Aisha Patel",
      role: "Chief Research Officer",
      bio: "Pioneered techniques in vocal biomarker detection. Previously research scientist at Johns Hopkins Neurology Department.",
      image: "/team/aisha.jpg"
    }
  ];

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
            <Link href="/team" className="text-sm font-medium text-white">Our Team</Link>
            <Link href="/news" className="text-sm font-medium hover:text-white/80">News</Link>
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
        <div className="max-w-4xl mx-auto">
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">Our Team</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We are a team of doctors, scientists, engineers, and business professionals united by our mission to transform healthcare through voice analysis.
            </p>
          </div>

          {/* Leadership Section */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-10 text-center text-gray-900">Leadership</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                  <div className="h-64 bg-primary/10 flex items-center justify-center">
                    {/* Placeholder for image */}
                    <div className="w-32 h-32 rounded-full bg-primary/30 flex items-center justify-center text-white font-bold text-xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-1 text-gray-900">{member.name}</h3>
                    <p className="text-primary font-medium mb-4">{member.role}</p>
                    <p className="text-gray-600 mb-4">{member.bio}</p>
                    <div className="flex space-x-3">
                      <a href="#" className="text-gray-400 hover:text-primary">
                        <Linkedin className="h-5 w-5" />
                      </a>
                      <a href="#" className="text-gray-400 hover:text-primary">
                        <Twitter className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Careers Section */}
          <section>
            <div className="bg-secondary rounded-xl p-10 text-center">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Join Our Team</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                We are always looking for talented individuals who are passionate about using AI to improve healthcare outcomes.
              </p>
              <Link 
                href="/careers" 
                className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 font-medium"
              >
                View Open Positions
              </Link>
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