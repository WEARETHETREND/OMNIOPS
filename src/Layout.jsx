import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from './utils';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import {
        LayoutDashboard,
        Workflow,
        BarChart3,
          Bell,
        Settings,
        TrendingUp,
        Menu,
        X,
        ChevronRight,
        Zap,
        LogOut,
        User,
        Shield,
        FileText,
        Users,
        Palette,
        Bot,
        Search,
        Activity,
        Server,
        Package,
        Folder,
        DollarSign,
        Megaphone,
        Download,
        Share2,
        MapPin,
        GitBranch
      } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import AIAssistant from '@/components/ai/AIAssistant';
import GlobalSearch from '@/components/ui/GlobalSearch';
import KeyboardShortcuts from '@/components/ui/KeyboardShortcuts';
import OnboardingTour from '@/components/ui/OnboardingTour';
import ProjectSelector from '@/components/layout/ProjectSelector';
import QuickActions from '@/components/layout/QuickActions';
import NotificationsDropdown from '@/components/layout/NotificationsDropdown';
import Footer from '@/components/layout/Footer';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

const navigation = [
  { name: 'Command Center', page: 'Dashboard', icon: LayoutDashboard },
  { name: 'AI Copilot', page: 'Copilot', icon: Bot },
  { name: 'Workflows', page: 'Workflows', icon: Workflow },
  { name: 'Runs', page: 'Runs', icon: Activity },
  { name: 'Alerts', page: 'Alerts', icon: Bell },
  { name: 'Workflow Builder', page: 'WorkflowBuilder', icon: Workflow },
  { name: 'Templates', page: 'WorkflowTemplates', icon: Zap },
  { name: 'Dispatches', page: 'Dispatches', icon: Activity },
  { name: 'Dispatch Map', page: 'DispatchMap', icon: MapPin },
  { name: 'Field Worker', page: 'FieldWorker', icon: MapPin },
  { name: 'CRM', page: 'CRM', icon: Users },
  { name: 'Contracts', page: 'Contracts', icon: FileText },
  { name: 'Inventory', page: 'Inventory', icon: Package },
  { name: 'Projects', page: 'Projects', icon: Folder },
  { name: 'HR', page: 'HR', icon: Users },
  { name: 'Field Worker App', page: 'FieldWorkerApp', icon: MapPin },
  { name: 'Field Services Hub', page: 'FieldServicesHub', icon: MapPin },
  { name: 'ROI & Outcomes', page: 'ROIOutcomes', icon: TrendingUp },
  { name: 'Customer Success', page: 'CustomerSuccess', icon: Users },
  { name: 'Workflow Rules', page: 'WorkflowRulesBuilder', icon: GitBranch },
  { name: 'Operational Metrics', page: 'OperationalMetrics', icon: BarChart3 },
  { name: 'Financial Intelligence', page: 'FinancialIntelligence', icon: DollarSign },
  { name: 'System Health', page: 'SystemHealth', icon: Server },
  { name: 'Billing', page: 'BillingManagement', icon: DollarSign },
  { name: 'Pricing', page: 'Pricing', icon: DollarSign },
  { name: 'Revenue', page: 'Revenue', icon: DollarSign },
  { name: 'Marketing', page: 'Marketing', icon: Megaphone },
  { name: 'Financial Ops', page: 'FinancialDashboard', icon: DollarSign },
  { name: 'Reports', page: 'ScheduledReports', icon: FileText },
  { name: 'Import/Export', page: 'DataImportExport', icon: Download },
  { name: 'Dashboards', page: 'SharedDashboards', icon: Share2 },
  { name: 'Compliance', page: 'Compliance', icon: Shield },
  { name: 'Access Control', page: 'AccessControl', icon: Users },
  { name: 'Audit Trail', page: 'Audit', icon: FileText },
  { name: 'Notifications', page: 'NotificationsCenter', icon: Bell },
  { name: 'White Label', page: 'WhiteLabel', icon: Palette },
  { name: 'Product Roadmap', page: 'ProductRoadmap', icon: TrendingUp },
  
  { name: 'Integrations', page: 'IntegrationMarketplace', icon: Package },
  { name: 'Settings', page: 'Settings', icon: Settings },
];

export default function Layout({ children, currentPageName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Hypnotic orb pulse animation
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes hypnotic-pulse {
        0%, 100% { 
          filter: brightness(1) drop-shadow(0 0 5px rgba(123, 179, 66, 0.3));
        }
        50% { 
          filter: brightness(1.2) drop-shadow(0 0 15px rgba(123, 179, 66, 0.9)) drop-shadow(0 0 30px rgba(33, 150, 243, 0.6));
        }
      }
      .hypnotic-orb {
        animation: hypnotic-pulse 3.5s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-72 bg-slate-900 transform transition-transform duration-300 ease-out lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 h-20 border-b border-slate-800">
            <Link to={createPageUrl('Dashboard')} className="flex items-center gap-3 relative">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692cc4fe31f31eedd47e4c98/1fc38aba0_Screenshot2025-12-19124649.png" 
                alt="OmniOps Orb"
                className="h-12 w-12 absolute left-0 hypnotic-orb"
              />
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692cc4fe31f31eedd47e4c98/3091574e2_Screenshot2025-12-19125112.png" 
                alt="OmniOps"
                className="h-12 w-auto relative z-10"
              />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Project Selector */}
                      <div className="px-4 py-2 border-b border-slate-800">
                        <ProjectSelector />
                      </div>

                      {/* Navigation */}
                      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = currentPageName === item.page;
              return (
                <Link
                                        key={item.name}
                                        to={createPageUrl(item.page)}
                                        onClick={() => setSidebarOpen(false)}
                                        data-tour={item.page.toLowerCase()}
                                        className={cn(
                                          "group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                          isActive 
                                            ? "bg-gradient-to-r from-[#7cb342]/20 to-[#2196f3]/20 text-white" 
                                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                                        )}
                                        >
                                        <item.icon className={cn(
                                          "w-5 h-5 transition-colors",
                                          isActive ? "text-[#7cb342]" : "text-slate-500 group-hover:text-slate-300"
                                        )} />
                                        <span>{item.name}</span>
                                        {isActive && (
                                          <ChevronRight className="w-4 h-4 ml-auto text-[#7cb342]" />
                                        )}
                                      </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
                        <QuickActions />

                        {/* User section */}
                        <div className="p-4 border-t border-slate-800">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-colors">
                  <Avatar className="h-9 w-9 border-2 border-slate-700">
                    <AvatarFallback className="bg-gradient-to-br from-[#1e3a5f] to-[#7cb342] text-white text-sm font-medium">
                      {getInitials(user?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-white truncate">{user?.full_name || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to={createPageUrl('Settings')} className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-rose-500 focus:text-rose-500"
                  onClick={() => base44.auth.logout()}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">
                  {navigation.find(n => n.page === currentPageName)?.name || currentPageName}
                </h1>
                <p className="text-sm text-slate-500">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
                            <Button 
                                              variant="outline" 
                                              className="hidden md:flex items-center gap-2 text-slate-500 w-64"
                                              onClick={() => setSearchOpen(true)}
                                              data-tour="search"
                                            >
                                              <Search className="w-4 h-4" />
                                              <span className="flex-1 text-left">Search...</span>
                                              <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 bg-slate-100 text-slate-400 text-xs rounded">
                                                ⌘K
                                              </kbd>
                                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="md:hidden"
                              onClick={() => setSearchOpen(true)}
                            >
                              <Search className="w-5 h-5 text-slate-600" />
                            </Button>
                            <NotificationsDropdown />
                          </div>
          </div>
        </header>

        {/* Breadcrumbs */}
                    <div className="px-6 pt-4">
                      <Breadcrumbs items={[{ label: navigation.find(n => n.page === currentPageName)?.name || currentPageName }]} />
                    </div>

                    {/* Page content */}
                    <main className="px-6 pb-6">
                      {children}
                    </main>

                    {/* Footer */}
                    <Footer />
        </div>

        {/* AI Assistant */}
                    <AIAssistant />

                    {/* Global Search */}
                                <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

                                {/* Keyboard Shortcuts */}
                                <KeyboardShortcuts onSearch={() => setSearchOpen(true)} />

                                {/* Onboarding Tour */}
                                <OnboardingTour />
                                </div>
        );
        }