import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-slate-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl('LandingPage')} className="flex items-center gap-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692cc4fe31f31eedd47e4c98/3091574e2_Screenshot2025-12-19125112.png" 
              alt="OmniOps"
              className="h-10 w-auto"
            />
          </Link>
          <Link to={createPageUrl('LandingPage')}>
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-slate-600 mb-8">Last Updated: February 3, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Introduction</h2>
            <p className="text-slate-700 leading-relaxed">
              OmniOps, a product of OpsVanta LLC ("we," "our," or "us"), is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
              use our platform and services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Account information (name, email, company details)</li>
              <li>Billing and payment information</li>
              <li>Workflow configurations and automation data</li>
              <li>Support communications and feedback</li>
              <li>Any other information you choose to provide</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">2.2 Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Device and browser information</li>
              <li>IP addresses and location data</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-slate-700 leading-relaxed mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send transaction notifications</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Send you technical notices, updates, security alerts, and support messages</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, prevent, and address technical issues and security threats</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Data Sharing and Disclosure</h2>
            <p className="text-slate-700 leading-relaxed mb-4">We may share your information with:</p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf</li>
              <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-4">
              We do NOT sell your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Data Security</h2>
            <p className="text-slate-700 leading-relaxed">
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and penetration testing</li>
              <li>SOC 2 Type II compliance</li>
              <li>Access controls and authentication measures</li>
              <li>Employee training on data protection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Your Rights</h2>
            <p className="text-slate-700 leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Access, correct, or delete your personal information</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
              <li>Lodge a complaint with supervisory authorities</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-4">
              To exercise these rights, contact us at privacy@opsvanta.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Data Retention</h2>
            <p className="text-slate-700 leading-relaxed">
              We retain your information for as long as necessary to provide our services and comply with legal 
              obligations. When data is no longer needed, we securely delete or anonymize it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. International Data Transfers</h2>
            <p className="text-slate-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. 
              We ensure appropriate safeguards are in place to protect your data in compliance with applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Children's Privacy</h2>
            <p className="text-slate-700 leading-relaxed">
              Our services are not intended for individuals under the age of 18. We do not knowingly collect 
              personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Changes to This Policy</h2>
            <p className="text-slate-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes 
              by posting the new policy on this page and updating the "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Contact Us</h2>
            <p className="text-slate-700 leading-relaxed">
              If you have questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-4">
              <p className="text-slate-900 font-semibold mb-2">OpsVanta LLC</p>
              <p className="text-slate-700">Email: privacy@opsvanta.com</p>
              <p className="text-slate-700">Address: [Your Business Address]</p>
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-6 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm">OmniOps is a product of OpsVanta LLC</p>
          <p className="text-xs text-slate-500 mt-2">© 2026 OpsVanta LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}