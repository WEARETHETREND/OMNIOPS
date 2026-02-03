import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
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
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
        <p className="text-slate-600 mb-8">Last Updated: February 3, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-slate-700 leading-relaxed">
              By accessing or using OmniOps, a product of OpsVanta LLC ("we," "our," or "us"), you agree to be 
              bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Description of Service</h2>
            <p className="text-slate-700 leading-relaxed">
              OmniOps is an enterprise AI-powered operations automation platform that enables businesses to automate 
              workflows, integrate systems, and optimize operational processes. Our services include but are not limited to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Workflow automation and orchestration</li>
              <li>AI-powered copilot and assistants</li>
              <li>System integrations and data synchronization</li>
              <li>Analytics and reporting tools</li>
              <li>Compliance and security features</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Account Registration</h2>
            <p className="text-slate-700 leading-relaxed mb-4">To use OmniOps, you must:</p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be at least 18 years of age</li>
              <li>Represent a legitimate business entity</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-4">
              You are responsible for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Acceptable Use</h2>
            <p className="text-slate-700 leading-relaxed mb-4">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Use the service for any illegal or unauthorized purpose</li>
              <li>Violate any laws, regulations, or third-party rights</li>
              <li>Upload malicious code, viruses, or harmful content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Use the service to transmit spam or unsolicited communications</li>
              <li>Reverse engineer, decompile, or disassemble our software</li>
              <li>Resell or redistribute our services without permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Subscription and Payment</h2>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">5.1 Fees</h3>
            <p className="text-slate-700 leading-relaxed">
              Subscription fees are based on your selected plan and are billed in advance on a recurring basis 
              (monthly or annually). All fees are non-refundable except as required by law.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">5.2 Payment Terms</h3>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>You authorize us to charge your payment method for all fees</li>
              <li>Prices are subject to change with 30 days' notice</li>
              <li>Failed payments may result in service suspension</li>
              <li>You are responsible for all applicable taxes</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">5.3 Cancellation</h3>
            <p className="text-slate-700 leading-relaxed">
              You may cancel your subscription at any time. Cancellation takes effect at the end of your current 
              billing period. No refunds will be provided for partial billing periods.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Intellectual Property</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              OpsVanta LLC retains all rights, title, and interest in OmniOps, including:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Software, code, and algorithms</li>
              <li>Trademarks, logos, and branding</li>
              <li>Documentation and training materials</li>
              <li>All improvements and derivatives</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-4">
              You retain ownership of your data and content. By using our services, you grant us a license to 
              process, store, and transmit your data solely to provide our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Data and Privacy</h2>
            <p className="text-slate-700 leading-relaxed">
              Your use of OmniOps is also governed by our Privacy Policy. We are committed to protecting your data 
              and maintaining compliance with GDPR, CCPA, SOC 2, and other applicable regulations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Service Level and Availability</h2>
            <p className="text-slate-700 leading-relaxed">
              We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. We may perform 
              maintenance, updates, and improvements that may temporarily affect availability. We are not liable 
              for any downtime or service interruptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>OpsVanta LLC is not liable for indirect, incidental, or consequential damages</li>
              <li>Our total liability shall not exceed the fees paid by you in the 12 months prior to the claim</li>
              <li>We provide the service "AS IS" without warranties of any kind</li>
              <li>We do not warrant that the service will be error-free or uninterrupted</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Indemnification</h2>
            <p className="text-slate-700 leading-relaxed">
              You agree to indemnify and hold harmless OpsVanta LLC from any claims, damages, or expenses arising 
              from your use of the service, violation of these Terms, or infringement of any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Termination</h2>
            <p className="text-slate-700 leading-relaxed">
              We may suspend or terminate your access to OmniOps at any time for:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Non-payment of fees</li>
              <li>Any reason with 30 days' notice</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-4">
              Upon termination, you will lose access to your account and data. We may retain data as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">12. Dispute Resolution</h2>
            <p className="text-slate-700 leading-relaxed">
              Any disputes shall be resolved through binding arbitration in accordance with the rules of the 
              American Arbitration Association. You waive your right to participate in class actions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">13. Governing Law</h2>
            <p className="text-slate-700 leading-relaxed">
              These Terms are governed by the laws of [Your State/Country], without regard to conflict of law principles.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">14. Changes to Terms</h2>
            <p className="text-slate-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. Material changes will be notified via email 
              or service notification. Continued use after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">15. Contact Information</h2>
            <p className="text-slate-700 leading-relaxed">
              For questions about these Terms, contact us at:
            </p>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-4">
              <p className="text-slate-900 font-semibold mb-2">OpsVanta LLC</p>
              <p className="text-slate-700">Email: legal@opsvanta.com</p>
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