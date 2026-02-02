/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AICopilot from './pages/AICopilot';
import AccessControl from './pages/AccessControl';
import AlertDetails from './pages/AlertDetails';
import Alerts from './pages/Alerts';
import Analytics from './pages/Analytics';
import AnomalyDetection from './pages/AnomalyDetection';
import Audit from './pages/Audit';
import AuditTrail from './pages/AuditTrail';
import Automations from './pages/Automations';
import Billing from './pages/Billing';
import BillingManagement from './pages/BillingManagement';
import CRM from './pages/CRM';
import Compliance from './pages/Compliance';
import Contracts from './pages/Contracts';
import Copilot from './pages/Copilot';
import CustomerPortal from './pages/CustomerPortal';
import Dashboard from './pages/Dashboard';
import DataImportExport from './pages/DataImportExport';
import DispatchMap from './pages/DispatchMap';
import Dispatches from './pages/Dispatches';
import FieldApp from './pages/FieldApp';
import FieldWorker from './pages/FieldWorker';
import FinancialDashboard from './pages/FinancialDashboard';
import FinancialIntelligence from './pages/FinancialIntelligence';
import HR from './pages/HR';
import Home from './pages/Home';
import Infrastructure from './pages/Infrastructure';
import IntegrationDetails from './pages/IntegrationDetails';
import IntegrationMarketplace from './pages/IntegrationMarketplace';
import Integrations from './pages/Integrations';
import Inventory from './pages/Inventory';
import LandingPage from './pages/LandingPage';
import LandingPageCode from './pages/LandingPageCode';
import LiveCollaboration from './pages/LiveCollaboration';
import Marketing from './pages/Marketing';
import NotificationsCenter from './pages/NotificationsCenter';
import Onboarding from './pages/Onboarding';
import Pricing from './pages/Pricing';
import Projects from './pages/Projects';
import Revenue from './pages/Revenue';
import Runs from './pages/Runs';
import ScheduledReports from './pages/ScheduledReports';
import Settings from './pages/Settings';
import SharedDashboards from './pages/SharedDashboards';
import SystemHealth from './pages/SystemHealth';
import TechStack from './pages/TechStack';
import WhiteLabel from './pages/WhiteLabel';
import WorkflowAutomation from './pages/WorkflowAutomation';
import WorkflowBuilder from './pages/WorkflowBuilder';
import WorkflowDetails from './pages/WorkflowDetails';
import WorkflowTemplates from './pages/WorkflowTemplates';
import Workflows from './pages/Workflows';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AICopilot": AICopilot,
    "AccessControl": AccessControl,
    "AlertDetails": AlertDetails,
    "Alerts": Alerts,
    "Analytics": Analytics,
    "AnomalyDetection": AnomalyDetection,
    "Audit": Audit,
    "AuditTrail": AuditTrail,
    "Automations": Automations,
    "Billing": Billing,
    "BillingManagement": BillingManagement,
    "CRM": CRM,
    "Compliance": Compliance,
    "Contracts": Contracts,
    "Copilot": Copilot,
    "CustomerPortal": CustomerPortal,
    "Dashboard": Dashboard,
    "DataImportExport": DataImportExport,
    "DispatchMap": DispatchMap,
    "Dispatches": Dispatches,
    "FieldApp": FieldApp,
    "FieldWorker": FieldWorker,
    "FinancialDashboard": FinancialDashboard,
    "FinancialIntelligence": FinancialIntelligence,
    "HR": HR,
    "Home": Home,
    "Infrastructure": Infrastructure,
    "IntegrationDetails": IntegrationDetails,
    "IntegrationMarketplace": IntegrationMarketplace,
    "Integrations": Integrations,
    "Inventory": Inventory,
    "LandingPage": LandingPage,
    "LandingPageCode": LandingPageCode,
    "LiveCollaboration": LiveCollaboration,
    "Marketing": Marketing,
    "NotificationsCenter": NotificationsCenter,
    "Onboarding": Onboarding,
    "Pricing": Pricing,
    "Projects": Projects,
    "Revenue": Revenue,
    "Runs": Runs,
    "ScheduledReports": ScheduledReports,
    "Settings": Settings,
    "SharedDashboards": SharedDashboards,
    "SystemHealth": SystemHealth,
    "TechStack": TechStack,
    "WhiteLabel": WhiteLabel,
    "WorkflowAutomation": WorkflowAutomation,
    "WorkflowBuilder": WorkflowBuilder,
    "WorkflowDetails": WorkflowDetails,
    "WorkflowTemplates": WorkflowTemplates,
    "Workflows": Workflows,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};