import Dashboard from './pages/Dashboard';
import Workflows from './pages/Workflows';
import Analytics from './pages/Analytics';
import Integrations from './pages/Integrations';
import Alerts from './pages/Alerts';
import Settings from './pages/Settings';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Workflows": Workflows,
    "Analytics": Analytics,
    "Integrations": Integrations,
    "Alerts": Alerts,
    "Settings": Settings,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};