"use client";

import Link from 'next/link';
import { ArrowRight, Briefcase, Brain, Activity, Microscope, Users } from 'lucide-react';

export default function SolutionsPage() {
  const solutions = [
    {
      id: "healthcare",
      title: "Healthcare Providers",
      icon: <Activity className="h-10 w-10 text-primary" />,
      description: "Integrate voice analysis into clinical workflows for early detection and monitoring of neurological conditions.",
      benefits: [
        "Early detection of Parkinson's and Alzheimer's biomarkers",
        "Objective progress tracking during treatment",
        "Remote patient monitoring capabilities",
        "Integration with existing EHR systems"
      ],
      caseStudy: {
        title: "Mayo Clinic Improves Early Detection Rates by 62%",
        quote: "NerVox's voice analysis technology has significantly improved our ability to detect early signs of neurodegenerative disorders, leading to earlier interventions and better patient outcomes.",
        author: "Dr. Sarah Johnson, Neurology Department Chair",
        organization: "Mayo Clinic"
      }
    },
    {
      id: "research",
      title: "Research Institutions",
      icon: <Microscope className="h-10 w-10 text-primary" />,
      description: "Accelerate discoveries with advanced voice analysis tools for neurological research.",
      benefits: [
        "Large-scale voice data analysis capabilities",
        "Customizable neural models for specific research needs",
        "Longitudinal studies tracking features over time",
        "API access for integration into research platforms"
      ],
      caseStudy: {
        title: "Stanford Research Team Publishes Breakthrough Study",
        quote: "The granularity of data provided by NerVox has enabled us to identify subtle vocal biomarkers that were previously undetectable. This has opened new avenues for our research.",
        author: "Prof. Michael Chen, PhD",
        organization: "Stanford Neuroscience Institute"
      }
    },
    {
      id: "pharma",
      title: "Pharmaceutical Companies",
      icon: <Brain className="h-10 w-10 text-primary" />,
      description: "Enhance clinical trials with objective voice-based endpoints and better patient stratification.",
      benefits: [
        "Objective digital endpoints for clinical trials",
        "Improved patient stratification capabilities",
        "Early efficacy signals through voice changes",
        "Longitudinal monitoring during trials"
      ],
      caseStudy: {
        title: "Novartis Reduces Trial Duration by 30%",
        quote: "Implementing NerVox's voice biomarker technology in our Phase II trials allowed us to detect treatment effects earlier and with greater sensitivity than traditional assessment methods.",
        author: "Dr. Emma Rodriguez, Clinical Research Director",
        organization: "Novartis Neuroscience"
      }
    },
    {
      id: "telemedicine",
      title: "Telemedicine Platforms",
      icon: <Users className="h-10 w-10 text-primary" />,
      description: "Enhance remote care with voice-based screening and monitoring capabilities.",
      benefits: [
        "Remote neurological assessment capabilities",
        "Continuous patient monitoring between visits",
        "Seamless API integration with existing platforms",
        "HIPAA-compliant data handling and storage"
      ],
      caseStudy: {
        title: "Teladoc Health Expands Neurological Services",
        quote: "NerVox has enabled us to offer specialized neurological assessments remotely, expanding our capabilities and improving access to care for patients in underserved areas.",
        author: "Jason Wright, VP of Product",
        organization: "Teladoc Health"
      }
    },
    {
      id: "eldercare",
      title: "Elder Care Facilities",
      icon: <Briefcase className="h-10 w-10 text-primary" />,
      description: "Monitor cognitive health and detect early signs of decline through regular voice assessments.",
      benefits: [
        "Non-invasive cognitive health screening",
        "Early detection of cognitive decline",
        "Objective progress tracking for interventions",
        "Easy-to-use interface for care staff"
      ],
      caseStudy: {
        title: "Sunrise Senior Living Implements Voice Screening",
        quote: "Since implementing NerVox's solution across our facilities, we've been able to detect cognitive changes an average of 8 months earlier than through traditional methods.",
        author: "Patricia Garcia, Director of Healthcare Innovation",
        organization: "Sunrise Senior Living"
      }
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
            <Link href="/solutions" className="text-sm font-medium text-white">Solutions</Link>
            <Link href="/test" className="text-sm font-medium hover:text-white/80">Test Demo</Link>
            <Link href="/team" className="text-sm font-medium hover:text-white/80">Our Team</Link>
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
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-bold mb-6 text-gray-900">Voice Analysis Solutions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our advanced neural models for voice analysis can be deployed across multiple healthcare and research settings, providing valuable insights for a variety of use cases.
            </p>
          </div>

          {/* Solutions List */}
          <div className="space-y-16">
            {solutions.map((solution, index) => (
              <section key={solution.id} className="scroll-mt-20" id={solution.id}>
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 ${index % 2 !== 0 ? 'lg:grid-flow-dense' : ''}`}>
                  <div className={`${index % 2 !== 0 ? 'lg:col-start-2' : ''}`}>
                    <div className="bg-secondary/30 rounded-xl p-6 inline-block mb-4">
                      {solution.icon}
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">{solution.title}</h2>
                    <p className="text-lg text-gray-600 mb-6">{solution.description}</p>
                    
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">Key Benefits</h3>
                    <ul className="space-y-2 mb-6">
                      {solution.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-primary mr-2 font-bold">•</span>
                          <span className="text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link href={`/solutions/${solution.id}`} className="inline-flex items-center text-primary font-medium hover:text-primary/80">
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                  
                  <div className={`${index % 2 !== 0 ? 'lg:col-start-1' : ''}`}>
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                      <div className="p-8">
                        <h3 className="text-xl font-semibold mb-6 text-gray-900">Case Study: {solution.caseStudy.title}</h3>
                        <blockquote className="italic text-gray-600 border-l-4 border-primary pl-4 mb-6">
                          &ldquo;{solution.caseStudy.quote}&rdquo;
                        </blockquote>
                        <div className="flex items-center">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                            {solution.caseStudy.author.split(' ')[0][0] + solution.caseStudy.author.split(' ')[1][0]}
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-900">{solution.caseStudy.author}</p>
                            <p className="text-sm text-gray-500">{solution.caseStudy.organization}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>

          {/* Integration */}
          <section className="mt-24">
            <div className="bg-secondary rounded-xl p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">Easy Integration</h2>
                  <p className="text-gray-600 mb-6">
                    Our voice analysis solutions can be easily integrated into your existing systems through our flexible API, SDKs, or white-labeled applications.
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <span className="text-primary mr-2 font-bold">•</span>
                      <span className="text-gray-600">Comprehensive REST API with detailed documentation</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 font-bold">•</span>
                      <span className="text-gray-600">SDKs for Python, JavaScript, iOS, and Android</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 font-bold">•</span>
                      <span className="text-gray-600">White-labeled web and mobile applications</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2 font-bold">•</span>
                      <span className="text-gray-600">HIPAA-compliant data handling and storage</span>
                    </li>
                  </ul>
                  <div className="flex space-x-4">
                    <Link href="/api" className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 font-medium">
                      API Documentation
                    </Link>
                    <Link href="/contact" className="bg-white text-gray-900 px-6 py-3 rounded-md hover:bg-white/90 font-medium">
                      Contact Sales
                    </Link>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg">
                  <div className="bg-gray-900 text-white p-4 rounded-md font-mono text-sm overflow-x-auto">
                    <pre className="whitespace-pre-wrap">
{`import nervox

# Initialize with your API key
client = nervox.Client(api_key="your_api_key")

# Analyze a voice recording
result = client.analyze("patient_recording.wav", 
                       model="neuro-v2")

# Access results
print(f"Confidence: {result.confidence}")
print(f"Predictions: {result.predictions}")
print(f"Recommendations: {result.recommendations}")

# Generate visualization
result.generate_report("patient_report.pdf")`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-24 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transform your approach to neurological assessment with our advanced voice analysis technology.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/try-api" className="bg-primary text-white px-8 py-4 rounded-md hover:bg-primary/90 font-medium">
                Try Demo
              </Link>
              <Link href="/contact" className="bg-secondary text-gray-900 px-8 py-4 rounded-md hover:bg-secondary/90 font-medium">
                Schedule Demo
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