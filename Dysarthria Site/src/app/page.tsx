"use client";
import React, { useEffect } from 'react';
import 'aos/dist/aos.css';
import AOS from 'aos';
import Image from 'next/image';
import FuturisticBackground from '../components/background';


export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (

    <div className="min-h-screen bg-gray-900 text-white font-sans">

      <FuturisticBackground />
      {/* Header */}
      <header className="flex items-center justify-between p-6 bg-black bg-opacity-80 fixed top-0 left-0 right-0 z-50">
        <div className="text-2xl font-bold">Dysarthria Diagnostics</div>
        <nav>
          <ul className="flex space-x-6">
            <li><a href="#hero" className="hover:text-blue-400">Home</a></li>
            <li><a href="#about" className="hover:text-blue-400">About</a></li>
            <li><a href="#solutions" className="hover:text-blue-400">Solutions</a></li>
            <li><a href="#case-studies" className="hover:text-blue-400">Case Studies</a></li>
            <li><a href="#contact" className="hover:text-blue-400">Contact</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <FuturisticBackground />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4" data-aos="fade-up">
          <h1 className="text-6xl font-extrabold mb-4">
            Diagnosing Dysarthria with AI
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Harnessing advanced speech pattern analysis to detect early signs of dysarthria and improve patient outcomes.
          </p>
          <a
            href="#about"
            className="px-8 py-3 bg-blue-600 rounded-lg text-lg hover:bg-blue-700 transition"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Learn More
          </a>
        </div>

        {/* Optional Overlay */}
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 px-6 bg-gray-700" data-aos="fade-up">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Our Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-800 rounded-lg" data-aos="fade-up" data-aos-delay="100">
              <h3 className="text-2xl font-semibold mb-4">Real-Time Speech Analysis</h3>
              <p>
                Continuously monitor speech patterns to detect anomalies indicative of dysarthria.
              </p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg" data-aos="fade-up" data-aos-delay="200">
              <h3 className="text-2xl font-semibold mb-4">Non-Invasive Diagnostics</h3>
              <p>
                Use a standard laptop microphone for hassle-free, on-the-go assessments.
              </p>
            </div>
            <div className="p-6 bg-gray-800 rounded-lg" data-aos="fade-up" data-aos-delay="300">
              <h3 className="text-2xl font-semibold mb-4">Actionable Reports</h3>
              <p>
                Generate detailed insights and metrics to help clinicians tailor treatment plans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section id="case-studies" className="py-20 px-6 bg-gray-800" data-aos="fade-up">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Case Studies</h2>
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center" data-aos="fade-up" data-aos-delay="100">
              <div className="md:w-1/2">
                <Image
                  src="/images/case-study-1.jpg"
                  alt="Early detection in clinical trials"
                  width={500}
                  height={300}
                  className="rounded-lg"
                />
              </div>
              <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0">
                <h3 className="text-2xl font-semibold mb-2">Early Detection in Clinical Trials</h3>
                <p>
                  Our solution was implemented in clinical trials, accurately identifying early speech anomalies in patients, leading to timely interventions.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center" data-aos="fade-up" data-aos-delay="200">
              <div className="md:w-1/2">
                <Image
                  src="/images/case-study-2.jpg"
                  alt="Enhancing telehealth diagnostics"
                  width={500}
                  height={300}
                  className="rounded-lg"
                />
              </div>
              <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0">
                <h3 className="text-2xl font-semibold mb-2">Enhancing Telehealth Diagnostics</h3>
                <p>
                  Integrated with telehealth platforms, our AI tool enables remote monitoring of speech patterns, ensuring that doctors can diagnose dysarthria without the need for in‑person visits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gray-700" data-aos="fade-up">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
          <p className="text-lg mb-8">
            Interested in learning more about our innovative diagnostic solutions? Contact us today to schedule a demo or consult with our experts.
          </p>
          <a
            href="mailto:contact@dysarthriadiagnostics.com"
            className="px-8 py-3 bg-blue-600 rounded-lg text-lg hover:bg-blue-700 transition"
          >
            Contact Us
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-black text-center text-sm">
        <p>&copy; 2025 PLACEHOLDER. All rights reserved.</p>
      </footer>
    </div>
  );
}
