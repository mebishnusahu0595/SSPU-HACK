import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import api from '../utils/api';

export default function Property() {
  const { t } = useTranslation();
  const mapRef = useRef(null);
  const drawLayerRef = useRef(null);
  const [address, setAddress] = useState('');
  const [searching, setSearching] = useState(false);
  const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // India fallback
  const [polygon, setPolygon] = useState(null);
  const [area, setArea] = useState('');
  const [files, setFiles] = useState([]);
  const [propertyName, setPropertyName] = useState('');
  const [currentCrop, setCurrentCrop] = useState('');
  const [soilType, setSoilType] = useState('Alluvial');
  const [irrigationType, setIrrigationType] = useState('Rainfed');
  const [submitting, setSubmitting] = useState(false);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all properties for the farmer
  const fetchProperties = async () => {
    try {
      setLoading(true);
      console.log('Fetching properties...');
      const res = await api.get('/property');
      console.log('Properties response:', res.data);
      if (res.data?.data) {
        setProperties(res.data.data);
        console.log('Properties set:', res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch properties', err);
      console.error('Error details:', err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('property-map').setView([center.lat, center.lng], 6);
      
      // Base layers
      const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      });

      const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19
      });

      const hybridLayer = L.layerGroup([
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
          maxZoom: 19
        }),
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          opacity: 0.3
        })
      ]);

      // Add default layer
      streetLayer.addTo(map);

      // Layer control
      const baseMaps = {
        "Street Map": streetLayer,
        "Satellite": satelliteLayer,
        "Hybrid": hybridLayer
      };

      L.control.layers(baseMaps).addTo(map);

      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      drawLayerRef.current = drawnItems;

      const drawControl = new L.Control.Draw({
        draw: {
          polygon: true,
          polyline: false,
          rectangle: true,
          circle: false,
          marker: false,
          circlemarker: false
        },
        edit: {
          featureGroup: drawnItems,
          remove: true
        }
      });

      map.addControl(drawControl);

      map.on(L.Draw.Event.CREATED, (e) => {
        // Remove existing
        drawnItems.clearLayers();
        const layer = e.layer;
        drawnItems.addLayer(layer);
        const latlngs = layer.getLatLngs();
        setPolygon(latlngs);
        const centroid = computeCentroid(latlngs[0]);
        setCenter({ lat: centroid.lat, lng: centroid.lng });
        setArea(formatArea(calcPolygonArea(latlngs[0])));
      });

      map.on('draw:edited', (e) => {
        const layers = e.layers;
        layers.eachLayer(layer => {
          const latlngs = layer.getLatLngs();
          setPolygon(latlngs);
          const centroid = computeCentroid(latlngs[0]);
          setCenter({ lat: centroid.lat, lng: centroid.lng });
          setArea(formatArea(calcPolygonArea(latlngs[0])));
        });
      });

      mapRef.current = map;
    }
  }, []);

  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.setView([center.lat, center.lng], 14);
    }
  }, [center]);

  // Simple geocode using Nominatim
  async function geocodeAddress() {
    if (!address) return;
    setSearching(true);
    try {
      const q = encodeURIComponent(address);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}`);
      const data = await res.json();
      if (data && data.length) {
        const place = data[0];
        setCenter({ lat: parseFloat(place.lat), lng: parseFloat(place.lon) });
        mapRef.current.setView([parseFloat(place.lat), parseFloat(place.lon)], 16);
      }
    } catch (err) {
      console.error('Geocode error', err);
    } finally {
      setSearching(false);
    }
  }

  function handleFiles(e) {
    setFiles(Array.from(e.target.files));
  }

  function computeCentroid(latlngs) {
    let sumX = 0, sumY = 0;
    latlngs.forEach(p => { sumX += p.lat; sumY += p.lng; });
    return { lat: sumX / latlngs.length, lng: sumY / latlngs.length };
  }

  // approximate area in hectares using equirectangular projection
  function calcPolygonArea(latlngs) {
    if (!latlngs || latlngs.length < 3) return 0;
    const R = 6371000; // meters
    const coords = latlngs.map(p => [p.lat * Math.PI / 180, p.lng * Math.PI / 180]);
    let area = 0;
    for (let i = 0; i < coords.length; i++) {
      const [lat1, lon1] = coords[i];
      const [lat2, lon2] = coords[(i + 1) % coords.length];
      area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }
    area = Math.abs(area) * (R * R) / 2.0; // in m^2
    return area / 10000; // hectares
  }

  function formatArea(ha) {
    if (!ha) return '0 ha';
    if (ha < 1) return `${(ha * 10000).toFixed(0)} m²`;
    return `${ha.toFixed(2)} ha`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!polygon || polygon.length === 0) {
      alert('Please draw your field boundary on the map');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('propertyName', propertyName || `Field ${new Date().toISOString()}`);
      formData.append('area', (calcPolygonArea(polygon[0]) || 0).toString());
      formData.append('areaUnit', 'hectares');
      
      // Close the polygon by adding first point at the end (GeoJSON requirement)
      const coords = polygon[0].map(p => [p.lng, p.lat]);
      if (coords.length > 0) {
        coords.push(coords[0]); // Close the polygon
      }
      
      formData.append('coordinates', JSON.stringify([coords]));
      const centroid = computeCentroid(polygon[0]);
      formData.append('latitude', centroid.lat);
      formData.append('longitude', centroid.lng);
      formData.append('address', JSON.stringify({ address }));
      formData.append('soilType', soilType);
      formData.append('currentCrop', currentCrop);
      formData.append('irrigationType', irrigationType);

      files.forEach(f => formData.append('documents', f));

      const res = await api.post('/property', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data?.success) {
        alert('Property created successfully');
        // Refresh property list and reset form
        await fetchProperties();
        setPropertyName('');
        setCurrentCrop('');
        setFiles([]);
        setPolygon(null);
        setArea('');
        if (drawLayerRef.current) {
          drawLayerRef.current.clearLayers();
        }
      } else {
        alert('Failed to create property');
      }

    } catch (err) {
      console.error('Submit error', err);
      alert(err.response?.data?.message || err.message || 'Failed to create property');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <Link to="/dashboard" className="flex items-center text-primary-600 hover:text-primary-700 mb-4">
          <FaArrowLeft className="mr-2" />
          Back to Dashboard
        </Link>

        {/* Property List Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">My Properties</h2>
          {loading ? (
            <p>Loading properties...</p>
          ) : properties.length === 0 ? (
            <p className="text-gray-600">No properties yet. Create your first property below.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map((prop) => (
                <div key={prop._id} className="card p-4 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold text-primary-600 mb-2">{prop.propertyName}</h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>Crop:</strong> {prop.currentCrop || 'N/A'}</p>
                    <p><strong>Area:</strong> {prop.area?.value ? `${prop.area.value.toFixed(2)} ${prop.area.unit || 'hectares'}` : 'N/A'}</p>
                    <p><strong>Soil Type:</strong> {prop.soilType}</p>
                    <p><strong>Irrigation:</strong> {prop.irrigationType}</p>
                    <p><strong>Verified:</strong> {prop.isVerified ? '✅ Yes' : '❌ No'}</p>
                    {prop.centerCoordinates?.latitude && prop.centerCoordinates?.longitude && (
                      <p className="text-xs text-gray-500">
                        📍 {prop.centerCoordinates.latitude.toFixed(4)}, {prop.centerCoordinates.longitude.toFixed(4)}
                      </p>
                    )}
                  </div>
                  {prop.documents && prop.documents.length > 0 && (
                    <p className="text-xs text-gray-500 mt-2">📄 {prop.documents.length} document(s)</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Property Section */}
        <h2 className="text-2xl font-bold mb-4">Add New Property</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div id="property-map" style={{ height: '600px', borderRadius: 8, overflow: 'hidden' }} />
          </div>

          <div className="col-span-1">
            <div className="card p-4">
              <h2 className="text-xl font-semibold mb-3">{t('property.add')}</h2>

              <label className="block mb-2">Address</label>
              <div className="flex mb-3">
                <input value={address} onChange={e => setAddress(e.target.value)} className="flex-1 input" placeholder="Type address and press search" />
                <button onClick={geocodeAddress} disabled={searching} className="btn ml-2">{searching ? 'Searching...' : 'Search'}</button>
              </div>

              <label className="block mb-2">Property Name</label>
              <input value={propertyName} onChange={e => setPropertyName(e.target.value)} className="input mb-3" placeholder="Name for this field" />

              <label className="block mb-2">Area</label>
              <div className="mb-3">{area || 'Draw polygon to calculate area'}</div>

              <label className="block mb-2">Crop</label>
              <input value={currentCrop} onChange={e => setCurrentCrop(e.target.value)} className="input mb-3" placeholder="e.g., Wheat" />

              <label className="block mb-2">Soil Type</label>
              <select value={soilType} onChange={e => setSoilType(e.target.value)} className="input mb-3">
                <option>Alluvial</option>
                <option>Black</option>
                <option>Red</option>
                <option>Laterite</option>
                <option>Desert</option>
                <option>Mountain</option>
                <option>Other</option>
              </select>

              <label className="block mb-2">Irrigation Type</label>
              <select value={irrigationType} onChange={e => setIrrigationType(e.target.value)} className="input mb-3">
                <option>Rainfed</option>
                <option>Drip</option>
                <option>Sprinkler</option>
                <option>Other</option>
              </select>

              <label className="block mb-2">Property Papers (images/PDF, max 5)</label>
              <input type="file" multiple onChange={handleFiles} className="mb-3" />

              <button onClick={handleSubmit} disabled={submitting} className="btn btn-primary w-full">{submitting ? 'Submitting...' : 'Create Property'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
