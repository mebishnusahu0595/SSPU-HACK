import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSeedling, FaCloudSun, FaFileAlt, FaShieldAlt, FaMapMarkedAlt, FaChartLine } from 'react-icons/fa';

export default function LandingPage() {
  const features = [
    {
      icon: <FaMapMarkedAlt className="text-5xl text-primary-600" />,
      title: 'Property Management',
      description: 'Draw and manage your farm boundaries on interactive maps'
    },
    {
      icon: <FaFileAlt className="text-5xl text-primary-600" />,
      title: 'Document Management',
      description: 'Securely store and manage all your farm documents'
    },
    {
      icon: <FaShieldAlt className="text-5xl text-primary-600" />,
      title: 'Insurance Integration',
      description: 'Manage policies and submit claims easily'
    },
    {
      icon: <FaCloudSun className="text-5xl text-primary-600" />,
      title: 'Weather Forecasts',
      description: 'Get real-time weather updates for your location'
    },
    {
      icon: <FaChartLine className="text-5xl text-primary-600" />,
      title: 'Crop Monitoring',
      description: 'Satellite-based crop health analysis'
    },
    {
      icon: <FaSeedling className="text-5xl text-primary-600" />,
      title: 'Smart Farming',
      description: 'AI-powered insights for better yields'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <FaSeedling className="text-primary-600 text-3xl" />
            <span className="text-2xl font-bold text-gray-800">FarmView AI</span>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/signup" className="btn-primary">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            Smart Farming with <span className="text-primary-600">AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Satellite-based crop monitoring, insurance integration, and complete farm management in one platform
          </p>
          <div className="space-x-4">
            <Link to="/signup" className="btn-primary text-lg px-8 py-4">
              Get Started Free
            </Link>
            <Link to="/login" className="btn-outline text-lg px-8 py-4">
              Login
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Everything You Need
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card text-center hover:scale-105 transition-transform"
            >
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of farmers using FarmView AI
          </p>
          <Link to="/signup" className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-4 px-8 rounded-lg text-lg transition-colors">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 FarmView AI. SSPU Hackathon Project. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
