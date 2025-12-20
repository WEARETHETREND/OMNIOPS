import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const landingPageHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OmniOps - AI-Powered Enterprise Automation Platform</title>
    <meta name="description" content="Transform your business operations with OmniOps AI-powered automation. Streamline workflows, reduce costs, and boost efficiency with intelligent process automation.">
    <meta name="keywords" content="AI automation, workflow automation, business process automation, enterprise AI, operational efficiency">
    
    <!-- Open Graph / Social Media -->
    <meta property="og:title" content="OmniOps - AI-Powered Enterprise Automation">
    <meta property="og:description" content="Transform your business with intelligent automation">
    <meta property="og:type" content="website">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            background: #fff;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Header */
        header {
            background: #0f172a;
            color: white;
            padding: 20px 0;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .nav-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 24px;
            font-weight: bold;
            background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .cta-button {
            background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        }
        
        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            padding: 100px 0;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 56px;
            font-weight: 800;
            margin-bottom: 20px;
            line-height: 1.2;
        }
        
        .hero .gradient-text {
            background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .hero p {
            font-size: 20px;
            margin-bottom: 40px;
            color: #cbd5e1;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
        }
        
        /* Features */
        .features {
            padding: 80px 0;
            background: #f8fafc;
        }
        
        .section-title {
            text-align: center;
            font-size: 42px;
            font-weight: 700;
            margin-bottom: 60px;
            color: #0f172a;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 40px;
        }
        
        .feature-card {
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        
        .feature-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            margin-bottom: 20px;
        }
        
        .feature-card h3 {
            font-size: 24px;
            margin-bottom: 15px;
            color: #0f172a;
        }
        
        .feature-card p {
            color: #64748b;
            line-height: 1.7;
        }
        
        /* Stats */
        .stats {
            padding: 80px 0;
            background: #0f172a;
            color: white;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 40px;
            text-align: center;
        }
        
        .stat-number {
            font-size: 48px;
            font-weight: 800;
            background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
        }
        
        .stat-label {
            color: #cbd5e1;
            font-size: 18px;
        }
        
        /* CTA Section */
        .cta-section {
            padding: 100px 0;
            text-align: center;
            background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
            color: white;
        }
        
        .cta-section h2 {
            font-size: 42px;
            font-weight: 700;
            margin-bottom: 20px;
        }
        
        .cta-section p {
            font-size: 20px;
            margin-bottom: 40px;
            opacity: 0.9;
        }
        
        .cta-section .cta-button {
            background: white;
            color: #0f172a;
            font-size: 18px;
            padding: 16px 40px;
        }
        
        /* Footer */
        footer {
            background: #0f172a;
            color: #94a3b8;
            padding: 40px 0;
            text-align: center;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 36px;
            }
            
            .hero p {
                font-size: 18px;
            }
            
            .section-title {
                font-size: 32px;
            }
            
            .feature-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container">
            <div class="nav-container">
                <div class="logo">⚡ OmniOps</div>
                <a href="#contact" class="cta-button">Get Started</a>
            </div>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h1>
                Transform Your Business with<br>
                <span class="gradient-text">AI-Powered Automation</span>
            </h1>
            <p>
                Streamline operations, reduce costs by up to 60%, and boost efficiency with 
                intelligent process automation that works 24/7.
            </p>
            <a href="#contact" class="cta-button">Schedule a Demo</a>
        </div>
    </section>

    <!-- Features -->
    <section class="features">
        <div class="container">
            <h2 class="section-title">Why Choose OmniOps?</h2>
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="feature-icon">🤖</div>
                    <h3>AI-Powered Intelligence</h3>
                    <p>Advanced AI that learns from your operations and continuously optimizes workflows for maximum efficiency.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">⚡</div>
                    <h3>Real-Time Automation</h3>
                    <p>Automate complex business processes instantly with no-code workflow builders and smart triggers.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📊</div>
                    <h3>Predictive Analytics</h3>
                    <p>Get actionable insights with AI-driven analytics that predict trends and identify opportunities.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🔗</div>
                    <h3>Seamless Integration</h3>
                    <p>Connect with 100+ enterprise tools including Salesforce, SAP, Google Workspace, and more.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🛡️</div>
                    <h3>Enterprise Security</h3>
                    <p>Bank-level encryption, SOC 2 compliance, and advanced access controls keep your data safe.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📈</div>
                    <h3>Scalable Growth</h3>
                    <p>From startups to Fortune 500, our platform scales with your business needs effortlessly.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Stats -->
    <section class="stats">
        <div class="container">
            <div class="stats-grid">
                <div>
                    <div class="stat-number">60%</div>
                    <div class="stat-label">Cost Reduction</div>
                </div>
                <div>
                    <div class="stat-number">10x</div>
                    <div class="stat-label">Faster Operations</div>
                </div>
                <div>
                    <div class="stat-number">99.9%</div>
                    <div class="stat-label">Uptime</div>
                </div>
                <div>
                    <div class="stat-number">500+</div>
                    <div class="stat-label">Companies Trust Us</div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="cta-section" id="contact">
        <div class="container">
            <h2>Ready to Transform Your Operations?</h2>
            <p>Join hundreds of companies already automating with OmniOps</p>
            <a href="mailto:contact@omniops.com" class="cta-button">Contact Us Today</a>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <p>&copy; 2025 OmniOps. All rights reserved.</p>
            <p style="margin-top: 10px; font-size: 14px;">Enterprise AI-Powered Automation Platform</p>
        </div>
    </footer>

    <!-- Google Analytics (Add your tracking ID) -->
    <!-- <script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script> -->
</body>
</html>`;

export default function LandingPageCode() {
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(landingPageHTML);
    setCopied(true);
    toast.success('HTML copied! Upload to GoDaddy as index.html');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-3">🌐 Your Public Website Code</h1>
        <p className="text-emerald-50 text-lg">
          Copy this HTML and upload it to your GoDaddy hosting as <strong>index.html</strong>
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Complete HTML File</h2>
            <p className="text-sm text-slate-500">Ready to upload to GoDaddy File Manager</p>
          </div>
          <Button onClick={copyToClipboard} className="bg-slate-900">
            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </Button>
        </div>

        <div className="bg-slate-900 rounded-lg p-6 overflow-x-auto">
          <pre className="text-sm text-slate-100 whitespace-pre-wrap break-words">
            <code>{landingPageHTML}</code>
          </pre>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3">📋 How to Upload to GoDaddy:</h3>
        <ol className="space-y-2 text-blue-800">
          <li><strong>1.</strong> Click "Copy Code" button above</li>
          <li><strong>2.</strong> Log into your GoDaddy account</li>
          <li><strong>3.</strong> Go to <strong>Web Hosting → File Manager</strong></li>
          <li><strong>4.</strong> Navigate to <strong>public_html</strong> folder</li>
          <li><strong>5.</strong> Click <strong>Upload</strong> or <strong>Create New File</strong></li>
          <li><strong>6.</strong> Name it <strong>index.html</strong> and paste the code</li>
          <li><strong>7.</strong> Save and visit your domain!</li>
        </ol>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
        <h3 className="font-semibold text-emerald-900 mb-3">✅ SEO Optimized Features:</h3>
        <ul className="space-y-1 text-emerald-800">
          <li>✓ Meta descriptions for Google search results</li>
          <li>✓ Mobile responsive design</li>
          <li>✓ Fast loading (no external dependencies)</li>
          <li>✓ Professional design with gradient effects</li>
          <li>✓ Contact form ready (update email address)</li>
          <li>✓ Social media preview tags</li>
        </ul>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="font-semibold text-amber-900 mb-3">🎨 Customize Your Site:</h3>
        <p className="text-amber-800 mb-2">Edit these parts in the HTML:</p>
        <ul className="space-y-1 text-amber-700 text-sm">
          <li>• Change <code className="bg-amber-100 px-1 rounded">contact@omniops.com</code> to your email</li>
          <li>• Update company name and description</li>
          <li>• Add your Google Analytics ID</li>
          <li>• Modify colors, images, and text as needed</li>
        </ul>
      </div>
    </div>
  );
}