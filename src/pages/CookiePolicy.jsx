import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function CookiePolicy() {
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
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Cookie Policy</h1>
        <p className="text-slate-600 mb-8">Last Updated: February 3, 2026</p>

        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. What Are Cookies</h2>
            <p className="text-slate-700 leading-relaxed">
              Cookies are small text files stored on your device when you visit OmniOps, a product of OpsVanta LLC. 
              They help us provide, improve, and secure our services. This Cookie Policy explains what cookies we use, 
              why we use them, and how you can manage them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">2.1 Essential Cookies</h3>
                <p className="text-slate-700 leading-relaxed mb-2">
                  These cookies are necessary for the website to function properly and cannot be disabled.
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-1">
                  <li>Authentication and session management</li>
                  <li>Security and fraud prevention</li>
                  <li>Load balancing</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">2.2 Performance Cookies</h3>
                <p className="text-slate-700 leading-relaxed mb-2">
                  These cookies help us understand how visitors interact with our service.
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-1">
                  <li>Page load times and performance metrics</li>
                  <li>Error tracking and diagnostics</li>
                  <li>Usage analytics</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">2.3 Functional Cookies</h3>
                <p className="text-slate-700 leading-relaxed mb-2">
                  These cookies enable enhanced functionality and personalization.
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-1">
                  <li>User preferences and settings</li>
                  <li>Language and region selection</li>
                  <li>Customized dashboard layouts</li>
                </ul>
              </div>

              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-900 mb-3">2.4 Analytics Cookies</h3>
                <p className="text-slate-700 leading-relaxed mb-2">
                  These cookies help us improve our service by collecting usage data.
                </p>
                <ul className="list-disc pl-6 text-slate-700 space-y-1">
                  <li>Feature usage tracking</li>
                  <li>User behavior analysis</li>
                  <li>A/B testing and optimization</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Third-Party Cookies</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              We may use third-party services that set cookies on your device:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li><strong>Analytics Providers:</strong> Google Analytics, Mixpanel</li>
              <li><strong>Support Tools:</strong> Intercom, Zendesk</li>
              <li><strong>Security Services:</strong> Cloudflare</li>
              <li><strong>Payment Processors:</strong> Stripe</li>
            </ul>
            <p className="text-slate-700 leading-relaxed mt-4">
              These third parties have their own privacy policies governing their use of cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Cookie Duration</h2>
            <p className="text-slate-700 leading-relaxed mb-4">We use both session and persistent cookies:</p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
              <li><strong>Persistent Cookies:</strong> Remain on your device for a set period or until manually deleted</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Managing Cookies</h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              You can control and manage cookies in several ways:
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3">5.1 Browser Settings</h3>
            <p className="text-slate-700 leading-relaxed mb-2">
              Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 text-slate-700 space-y-2">
              <li>View and delete cookies</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies</li>
              <li>Clear cookies when closing the browser</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">5.2 Cookie Preference Center</h3>
            <p className="text-slate-700 leading-relaxed">
              You can manage your cookie preferences through our Cookie Preference Center, accessible from 
              the footer of our website.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mt-4">
              <p className="text-amber-900 font-semibold mb-2">⚠️ Important Note</p>
              <p className="text-amber-800 text-sm">
                Disabling certain cookies may limit your ability to use some features of OmniOps. Essential 
                cookies cannot be disabled as they are necessary for the service to function.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Do Not Track</h2>
            <p className="text-slate-700 leading-relaxed">
              Some browsers have a "Do Not Track" feature. Currently, there is no industry standard for 
              responding to these signals. We do not currently respond to Do Not Track signals.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Updates to This Policy</h2>
            <p className="text-slate-700 leading-relaxed">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page 
              with an updated "Last Updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Contact Us</h2>
            <p className="text-slate-700 leading-relaxed">
              If you have questions about our use of cookies, contact us at:
            </p>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-4">
              <p className="text-slate-900 font-semibold mb-2">OpsVanta LLC</p>
              <p className="text-slate-700">Email: privacy@opsvanta.com</p>
              <p className="text-slate-700">Subject: Cookie Policy Inquiry</p>
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