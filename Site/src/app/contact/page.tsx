"use client";

import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    subject: 'General Inquiry'
  });
  
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        company: '',
        message: '',
        subject: 'General Inquiry'
      });
    } catch {
      setSubmitStatus('error');
    }
  };

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
            <Link href="/news" className="text-sm font-medium hover:text-white/80">News</Link>
            <Link href="/contact" className="text-sm font-medium text-white">Contact</Link>
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
            <h1 className="text-4xl font-bold mb-6 text-gray-900">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about our platform or want to schedule a demo? Reach out to our team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Our Location</h3>
                    <address className="mt-1 text-gray-600 not-italic">
                      123 Innovation Way<br />
                      San Francisco, CA 94107<br />
                      United States
                    </address>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Email Us</h3>
                    <p className="mt-1 text-gray-600">info@nervox.ai</p>
                    <p className="mt-1 text-gray-600">support@nervox.ai</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary/10 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Call Us</h3>
                    <p className="mt-1 text-gray-600">+1 (555) 123-4567</p>
                    <p className="mt-1 text-gray-600">Monday-Friday, 9am-6pm PT</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">Send Us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Demo Request">Demo Request</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Support">Technical Support</option>
                        <option value="Billing">Billing Question</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      disabled={submitStatus === 'loading'}
                      className="w-full bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 font-medium flex justify-center items-center"
                    >
                      {submitStatus === 'loading' ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : "Send Message"}
                    </button>
                  </div>
                  
                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-50 rounded-md">
                      <p className="text-green-800 text-sm font-medium">
                        Thank you for your message! We'll get back to you shortly.
                      </p>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 rounded-md">
                      <p className="text-red-800 text-sm font-medium">
                        Sorry, there was an error sending your message. Please try again.
                      </p>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-100">
                <h3 className="text-lg font-medium mb-2 text-gray-900">How can I try the API?</h3>
                <p className="text-gray-600">
                  You can sign up for a free trial account that includes API credits for testing purposes. 
                  Visit our <Link href="/try-api" className="text-primary hover:underline">API page</Link> to get started.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-100">
                <h3 className="text-lg font-medium mb-2 text-gray-900">What file formats are supported?</h3>
                <p className="text-gray-600">
                  Our API supports WAV, MP3, and FLAC audio formats. Files can be uploaded directly or 
                  streamed for real-time analysis.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-100">
                <h3 className="text-lg font-medium mb-2 text-gray-900">Do you offer custom solutions?</h3>
                <p className="text-gray-600">
                  Yes, we provide tailored solutions for enterprise clients. Please contact our sales team 
                  for more information about custom implementations.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-100">
                <h3 className="text-lg font-medium mb-2 text-gray-900">Is my data secure?</h3>
                <p className="text-gray-600">
                  All data is encrypted in transit and at rest. We are HIPAA compliant and follow 
                  industry best practices for data security and privacy.
                </p>
              </div>
            </div>
          </div>
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