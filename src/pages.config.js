import Dashboard from './pages/Dashboard';
import Workflows from './pages/Workflows';
import Analytics from './pages/Analytics';
import Integrations from './pages/Integrations';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import AlertDetails from './pages/AlertDetails';
import SystemHealth from './pages/SystemHealth';
import WorkflowBuilder from './pages/WorkflowBuilder';
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
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};