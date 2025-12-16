import Dashboard from './pages/Dashboard';
import Workflows from './pages/Workflows';
import Analytics from './pages/Analytics';
import Integrations from './pages/Integrations';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import AlertDetails from './pages/AlertDetails';
import SystemHealth from './pages/SystemHealth';
import WorkflowBuilder from './pages/WorkflowBuilder';
import Compliance from './pages/Compliance';
import AuditTrail from './pages/AuditTrail';
import AccessControl from './pages/AccessControl';
import WhiteLabel from './pages/WhiteLabel';
import Automations from './pages/Automations';
import Infrastructure from './pages/Infrastructure';
import TechStack from './pages/TechStack';
import AICopilot from './pages/AICopilot';
import FieldApp from './pages/FieldApp';
import CustomerPortal from './pages/CustomerPortal';
import FinancialIntelligence from './pages/FinancialIntelligence';
import WorkflowAutomation from './pages/WorkflowAutomation';
import LiveCollaboration from './pages/LiveCollaboration';
import WorkflowDetails from './pages/WorkflowDetails';
import Dispatches from './pages/Dispatches';
import Audit from './pages/Audit';
import Copilot from './pages/Copilot';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Workflows": Workflows,
    "Analytics": Analytics,
    "Integrations": Integrations,
    "Alerts": Alerts,
    "Settings": Settings,
    "AlertDetails": AlertDetails,
    "SystemHealth": SystemHealth,
    "WorkflowBuilder": WorkflowBuilder,
    "Compliance": Compliance,
    "AuditTrail": AuditTrail,
    "AccessControl": AccessControl,
    "WhiteLabel": WhiteLabel,
    "Automations": Automations,
    "Infrastructure": Infrastructure,
    "TechStack": TechStack,
    "AICopilot": AICopilot,
    "FieldApp": FieldApp,
    "CustomerPortal": CustomerPortal,
    "FinancialIntelligence": FinancialIntelligence,
    "WorkflowAutomation": WorkflowAutomation,
    "LiveCollaboration": LiveCollaboration,
    "WorkflowDetails": WorkflowDetails,
    "Dispatches": Dispatches,
    "Audit": Audit,
    "Copilot": Copilot,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};