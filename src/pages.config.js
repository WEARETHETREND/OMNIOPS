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
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};