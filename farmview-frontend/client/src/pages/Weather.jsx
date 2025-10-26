import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import api from '../utils/api';

export default function Weather() {
  const { t } = useTranslation();
  const [properties, setProperties] = useState([]);
  const [selected, setSelected] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      const res = await api.get('/property');
      if (res.data?.success) setProperties(res.data.data || []);
    } catch (err) {
      console.error('Fetch props', err);
    }
  }

  async function fetchWeatherFor(prop) {
    if (!prop) return;
    setLoading(true);
    try {
      const lat = prop.centerCoordinates.latitude;
      const lon = prop.centerCoordinates.longitude;
      const res = await api.get('/weather/current', { params: { latitude: lat, longitude: lon } });
      if (res.data?.success) setWeather(res.data.data);
      setSelected(prop);
    } catch (err) {
      console.error('Weather fetch', err);
      alert('Failed to fetch weather');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        <Link to="/dashboard" className="flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="card p-4">
              <h2 className="font-semibold mb-3">Your Properties</h2>
              {properties.length === 0 ? (
                <p>No properties found. Add a property first.</p>
              ) : (
                <ul className="space-y-2">
                  {properties.map(p => (
                    <li key={p._id} className="p-2 bg-white rounded flex justify-between items-center">
                      <div>
                        <div className="font-medium">{p.propertyName}</div>
                        <div className="text-sm text-gray-500">{p.area?.value} {p.area?.unit}</div>
                      </div>
                      <button onClick={() => fetchWeatherFor(p)} className="btn btn-sm">Check</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="col-span-2">
            <div className="card p-4">
              <h2 className="text-xl font-semibold mb-3">Weather</h2>
              {loading ? <p>Loading weather...</p> : (
                weather ? (
                  <div>
                    <div className="text-lg font-bold">{weather.location.name}, {weather.location.country}</div>
                    <div className="mt-2">Temperature: {weather.current.temperature} °C</div>
                    <div>Humidity: {weather.current.humidity}%</div>
                    <div>Wind: {weather.current.windSpeed} m/s</div>
                    <div>Conditions: {weather.current.weather.description}</div>
                    <div className="mt-4">
                      <button onClick={async () => {
                        // trigger ML prediction for selected property
                        if (!selected) return alert('Select a property first');
                        try {
                          const payload = {
                            cropType: selected.currentCrop || 'Unknown',
                            temperature: weather.current.temperature,
                            rainfall: 0,
                            humidity: weather.current.humidity,
                            soilType: selected.soilType || 'Loamy',
                            irrigationType: selected.irrigationType || 'Rainfed'
                          };
                          const res = await api.post('/alerts/predict', payload);
                          if (res.data?.success) {
                            alert('Prediction: ' + JSON.stringify(res.data.data, null, 2));
                          }
                        } catch (err) {
                          console.error('Predict', err);
                          alert('Prediction failed');
                        }
                      }} className="btn btn-primary">Run ML Prediction</button>
                    </div>
                  </div>
                ) : (
                  <p>Select a property and press Check to view current weather.</p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
