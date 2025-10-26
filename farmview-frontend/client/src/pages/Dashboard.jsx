import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FaFileAlt, FaMapMarkedAlt, FaShieldAlt, FaCloudSun, FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function Dashboard() {
  const { t } = useTranslation();
  const { farmer, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const quickActions = [
    { icon: <FaFileAlt />, title: t('nav.documents'), path: '/documents', color: 'bg-blue-500' },
    { icon: <FaMapMarkedAlt />, title: t('nav.property'), path: '/property', color: 'bg-green-500' },
    { icon: <FaShieldAlt />, title: t('nav.insurance'), path: '/insurance', color: 'bg-purple-500' },
    { icon: <FaCloudSun />, title: t('nav.weather'), path: '/weather', color: 'bg-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary-600">FarmView AI</h1>
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                <FaUser />
                <span>{farmer?.name}</span>
              </Link>
              <button onClick={handleLogout} className="btn-outline flex items-center space-x-2">
                <FaSignOutAlt />
                <span>{t('nav.logout')}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg p-8 mb-8 text-white">
          <h2 className="text-3xl font-bold mb-2">{t('dashboard.welcome')}, {farmer?.name}!</h2>
          <p className="text-primary-100">{t('dashboard.farmerId')}: <span className="font-bold">{farmer?.farmerId}</span></p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <h3 className="text-gray-700 text-sm font-medium">{t('dashboard.totalProperties')}</h3>
            <p className="text-3xl font-bold text-primary-700 mt-2">0</p>
          </div>
          <div className="stat-card">
            <h3 className="text-gray-700 text-sm font-medium">{t('dashboard.activeInsurance')}</h3>
            <p className="text-3xl font-bold text-primary-700 mt-2">0</p>
          </div>
          <div className="stat-card">
            <h3 className="text-gray-700 text-sm font-medium">{t('dashboard.documents')}</h3>
            <p className="text-3xl font-bold text-primary-700 mt-2">0</p>
          </div>
          <div className="stat-card">
            <h3 className="text-gray-700 text-sm font-medium">Status</h3>
            <p className="text-lg font-bold text-green-600 mt-2">Active</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('dashboard.quickActions')}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                className="card hover:scale-105 transition-transform text-center"
              >
                <div className={`${action.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl`}>
                  {action.icon}
                </div>
                <h4 className="font-semibold text-gray-800">{action.title}</h4>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="card">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">{t('dashboard.recentActivity')}</h3>
          <p className="text-gray-600 text-center py-8">{t('common.noData')}</p>
        </div>
      </div>
    </div>
  );
}
