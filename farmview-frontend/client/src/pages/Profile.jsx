import { useAuthStore } from '../store/authStore';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaEnvelope, FaPhone, FaLanguage } from 'react-icons/fa';

export default function Profile() {
  const { t } = useTranslation();
  const { farmer } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto max-w-2xl">
        <Link to="/dashboard" className="flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>

        <div className="card">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('nav.profile')}</h1>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {farmer?.name?.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{farmer?.name}</h2>
                <p className="text-gray-600">Farmer ID: {farmer?.farmerId}</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <FaEnvelope className="text-primary-600 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">{t('auth.email')}</p>
                  <p className="font-medium text-gray-800">{farmer?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <FaPhone className="text-primary-600 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">{t('auth.mobile')}</p>
                  <p className="font-medium text-gray-800">{farmer?.mobile}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <FaLanguage className="text-primary-600 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Preferred Language</p>
                  <p className="font-medium text-gray-800">{farmer?.preferredLanguage || 'en'}</p>
                </div>
              </div>
            </div>

            <button className="btn-primary w-full mt-6">
              Edit Profile (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
