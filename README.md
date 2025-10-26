# 🌾 FarmView AI - Smart Agriculture Platform

<div align="center">

![FarmView AI Logo](https://img.shields.io/badge/FarmView-AI-2ecc71?style=for-the-badge&logo=satellite&logoColor=white)

**AI-powered crop monitoring, weather prediction, and insurance management for farmers**

[![Node.js](https://img.shields.io/badge/Node.js-20.19+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2+-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.21+-000000?style=flat&logo=express&logoColor=white)](https://expressjs.com/)

</div>

---

## 🎯 Overview

**FarmView AI** is a comprehensive agricultural management platform that helps farmers monitor their properties, predict crop damage using ML weather analysis, manage insurance policies, and handle document storage. The system provides real-time weather monitoring with automated risk assessments every 6 hours.

### Key Features

- �️ **Interactive Property Mapping**: Draw farm boundaries using Leaflet.js with satellite/street/hybrid views
- 🌦️ **Weather Integration**: Real-time weather data from OpenWeatherMap API
- 🤖 **ML Crop Prediction**: Automated risk assessment analyzing 6 factors (waterlogging, drought, heat stress, cold stress, disease, wind damage)
- � **Document Management**: Upload/download property documents using GridFS
- � **Insurance Policies**: Manage crop insurance policies and claims
- � **Automated Alerts**: Cron job running every 6 hours for weather-based risk monitoring
- � **Secure Authentication**: JWT-based authentication with farmer profiles
- � **Property Dashboard**: View all properties with area, crop, soil type, and verification status

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   React Frontend (Vite)             │
│   - Leaflet Maps + Drawing          │
│   - Property/Weather/Insurance UI   │
│   Port: 5173                        │
└────────────┬────────────────────────┘
             │ Axios API Calls
             ▼
┌─────────────────────────────────────┐
│   Express.js Backend                │
│   - REST API                        │
│   - JWT Auth Middleware             │
│   Port: 5000                        │
└────────────┬────────────────────────┘
             │
    ┌────────┴────────┬──────────────┬─────────────┐
    ▼                 ▼              ▼             ▼
┌─────────┐    ┌──────────┐   ┌──────────┐  ┌──────────┐
│OpenWeather│  │GridFS    │   │ML Crop   │  │Cron Jobs │
│Map API   │   │Documents │   │Prediction│  │(6 hours) │
└─────────┘    └──────────┘   └──────────┘  └──────────┘
                      │              │             │
                      └──────────────┴─────────────┘
                                 │
                                 ▼
                         ┌──────────────┐
                         │ MongoDB Atlas│
                         │ - farmers    │
                         │ - properties │
                         │ - insurance  │
                         │ - alerts     │
                         │ - documents  │
                         └──────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20.19+ and npm
- MongoDB Atlas account (or local MongoDB)
- OpenWeatherMap API key ([Get free key](https://openweathermap.org/api))
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mebishnusahu0595/SSPU-HACK.git
   cd SSPU-HACK
   ```

2. **Backend Setup**
   ```bash
   cd farmview-frontend/server
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file in server directory
   nano .env
   ```

   Required configurations:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/farmview_ai?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key_here
   WEATHER_API_KEY=your_openweathermap_api_key
   PORT=5000
   NODE_ENV=development
   ```

4. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

5. **Run the application**

   **Terminal 1 - Backend:**
   ```bash
   cd farmview-frontend/server
   npm start
   ```

   **Terminal 2 - Frontend:**
   ```bash
   cd farmview-frontend/client
   npm run dev
   ```

   - Backend API: `http://localhost:5000`
   - Frontend UI: `http://localhost:5173`

---

## 📖 Usage Guide

### Step-by-Step Workflow

#### 1️⃣ Register/Login
- Navigate to `http://localhost:5173`
- Sign up with name, email, phone, and password
- Auto-generated Farmer ID (format: FV2025XXXXXX)
- Login with email and password

#### 2️⃣ Add Property
- Go to **Property** page
- Search address using geocoding (Nominatim API)
- Switch map view: Street/Satellite/Hybrid
- Draw field boundary using polygon/rectangle tools
- Fill details:
  - Property Name
  - Current Crop (wheat, rice, sugarcane, etc.)
  - Soil Type (Alluvial, Black, Red, Laterite, Desert, Mountain)
  - Irrigation Type (Rainfed, Drip, Sprinkler, Flood, Mixed)
- Upload property documents (PDF/images, max 5 files)
- Click **Create Property**

#### 3️⃣ Weather & ML Prediction
- System automatically fetches weather on property creation
- Go to **Weather** page
- Select property from dropdown
- View current weather conditions
- Click **Trigger ML Prediction** for risk assessment
- ML analyzes 6 risk factors:
  - Waterlogging risk
  - Drought stress
  - Heat stress
  - Cold/frost damage
  - Disease risk
  - Wind damage

#### 4️⃣ Manage Insurance
- Go to **Insurance** page
- Create new policy with:
  - Policy number
  - Insurance provider
  - Premium amount
  - Coverage amount
  - Start/end dates
- Link to existing properties
- View all active policies

#### 5️⃣ Document Management
- Go to **Documents** page
- Upload property-related documents
- Download previously uploaded files
- Organized by property

---

## 🛠️ API Documentation

### Authentication Endpoints

#### `POST /api/auth/signup`
Register a new farmer.

**Request Body:**
```json
{
  "name": "Ramesh Kumar",
  "email": "ramesh@example.com",
  "phone": "9876543210",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "message": "Farmer registered successfully",
  "farmerId": "FV2025000001",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### `POST /api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "ramesh@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "farmer": {
    "_id": "507f1f77bcf86cd799439011",
    "farmerId": "FV2025000001",
    "name": "Ramesh Kumar",
    "email": "ramesh@example.com"
  }
}
```

---

### Property Endpoints

#### `POST /api/property`
Create a new property with documents.

**Request:** multipart/form-data
- `propertyName`: string
- `currentCrop`: string
- `soilType`: enum (Alluvial, Black, Red, etc.)
- `irrigationType`: enum (Rainfed, Drip, etc.)
- `coordinates`: JSON string (GeoJSON polygon)
- `area`: number (hectares)
- `areaUnit`: string
- `latitude`: number
- `longitude`: number
- `address`: JSON string
- `documents`: files (max 5)

**Response:**
```json
{
  "success": true,
  "message": "Property created successfully",
  "property": {
    "_id": "507f1f77bcf86cd799439012",
    "propertyName": "my_wheat_property",
    "area": { "value": 1.3, "unit": "hectares" },
    "currentCrop": "wheat",
    "weatherData": { "temp": 28, "humidity": 65 },
    "riskAssessment": {
      "waterloggingRisk": 2.1,
      "overallRisk": 4.5
    }
  }
}
```

---

#### `GET /api/property`
Get all properties for logged-in farmer.

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "propertyName": "my_wheat_property",
      "currentCrop": "wheat",
      "area": { "value": 1.3, "unit": "hectares" },
      "soilType": "Alluvial",
      "isVerified": false
    }
  ]
}
```

---

#### `GET /api/property/:id`
Get single property by ID.

---

#### `PUT /api/property/:id`
Update property (blocked if verified).

---

#### `DELETE /api/property/:id`
Delete property (blocked if verified).

---

### Weather Endpoints

#### `GET /api/weather/current`
Get current weather for coordinates.

**Query Params:**
- `latitude`: number
- `longitude`: number

**Response:**
```json
{
  "coord": { "lon": 78.97, "lat": 20.58 },
  "weather": [{ "main": "Clear", "description": "clear sky" }],
  "main": {
    "temp": 28.5,
    "feels_like": 30.2,
    "humidity": 65,
    "pressure": 1012
  },
  "wind": { "speed": 3.5 }
}
```

---

### Alert Endpoints

#### `POST /api/alerts/predict`
Trigger ML prediction for property.

**Request Body:**
```json
{
  "propertyId": "507f1f77bcf86cd799439012"
}
```

**Response:**
```json
{
  "success": true,
  "propertyId": "507f1f77bcf86cd799439012",
  "riskAssessment": {
    "waterloggingRisk": 2.1,
    "droughtStress": 1.5,
    "heatStress": 3.2,
    "coldStress": 0.8,
    "diseaseRisk": 2.7,
    "windDamage": 1.3,
    "overallRisk": 4.5
  },
  "alertLevel": "moderate"
}
```

---

### Document Endpoints

#### `POST /api/documents/upload`
Upload a document to GridFS.

**Request:** multipart/form-data
- `document`: file
- `propertyId`: string (optional)

**Response:**
```json
{
  "success": true,
  "fileId": "507f191e810c19729de860ea",
  "filename": "property_deed.pdf"
}
```

---

#### `GET /api/documents`
Get all documents for logged-in farmer.

---

#### `GET /api/documents/file/:id`
Download document by file ID.

---

### Insurance Endpoints

#### `POST /api/insurance`
Create insurance policy.

**Request Body:**
```json
{
  "policyNumber": "POL-2025-001",
  "insuranceProvider": "National Insurance Co.",
  "premiumAmount": 5000,
  "coverageAmount": 50000,
  "startDate": "2025-01-01",
  "endDate": "2025-12-31",
  "propertyId": "507f1f77bcf86cd799439012"
}
```

---

#### `GET /api/insurance`
Get all insurance policies for farmer.

---

## 🧮 ML Crop Prediction Model

### Risk Factors Analyzed

The system uses weather data to calculate 6 risk scores (0-10 scale):

#### 1. **Waterlogging Risk**
```javascript
score = (rainfall / 50) + (humidity / 20)
```
- High rainfall + high humidity = flooding risk
- Critical for rice, sugarcane

#### 2. **Drought Stress**
```javascript
score = Math.max(0, (30 - temp) / 5) + (rainfall < 10 ? 5 : 0)
```
- Low temperature + minimal rain = drought
- Affects wheat, cotton

#### 3. **Heat Stress**
```javascript
score = Math.max(0, (temp - 35) / 2)
```
- Extreme temperatures (>35°C) damage crops
- Critical during flowering stage

#### 4. **Cold/Frost Damage**
```javascript
score = Math.max(0, (10 - temp) / 2)
```
- Low temperatures (<10°C) cause frost
- Harmful to tropical crops

#### 5. **Disease Risk**
```javascript
score = (humidity / 15) + (rainfall / 30)
```
- High humidity + rain = fungal diseases
- Requires preventive spraying

#### 6. **Wind Damage**
```javascript
score = Math.max(0, (windSpeed - 20) / 5)
```
- High wind speeds (>20 km/h) break stems
- Lodging in wheat/rice

### Overall Risk Score
```javascript
overallRisk = average of all 6 factors
```

### Alert Levels
| Score | Level | Action |
|-------|-------|--------|
| 0-3   | Low   | Normal monitoring |
| 3-6   | Moderate | Watch conditions |
| 6-8   | High  | Take preventive action |
| 8-10  | Severe | Emergency response |

### Automated Monitoring
- Cron job runs every 6 hours
- Checks all properties in database
- Fetches latest weather data
- Recalculates risk scores
- Sends alerts for high-risk properties

---

## 🔧 Configuration

### OpenWeatherMap API Setup

1. Create free account at [OpenWeatherMap](https://openweathermap.org/)
2. Go to API Keys section
3. Generate new API key
4. Add to `.env` file:
   ```env
   WEATHER_API_KEY=your_api_key_here
   ```

### MongoDB Setup

**Option 1: MongoDB Atlas (Recommended)**
1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user with password
3. Whitelist IP address (0.0.0.0/0 for development)
4. Get connection string
5. Add to `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/farmview_ai?retryWrites=true&w=majority
   ```

**Option 2: Local MongoDB**
```bash
# Install MongoDB
sudo apt-get install mongodb

# Start service
sudo systemctl start mongodb

# Use local connection
MONGODB_URI=mongodb://localhost:27017/farmview_ai
```

### JWT Secret

Generate a secure random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env`:
```env
JWT_SECRET=your_generated_secret_here
```

---

## 📊 Sample Output

### Property Dashboard
![Property List](https://via.placeholder.com/800x400/2ecc71/ffffff?text=Property+Dashboard+-+List+View)

### Interactive Map
![Leaflet Map](https://via.placeholder.com/800x500/3498db/ffffff?text=Interactive+Map+with+Satellite+View)

### Weather & Risk Assessment
```json
{
  "propertyName": "my_wheat_property",
  "currentWeather": {
    "temp": 28.5,
    "humidity": 65,
    "rainfall": 5.2,
    "windSpeed": 12
  },
  "riskAssessment": {
    "waterloggingRisk": 2.1,
    "droughtStress": 1.5,
    "heatStress": 3.2,
    "coldStress": 0.8,
    "diseaseRisk": 2.7,
    "windDamage": 1.3,
    "overallRisk": 4.5
  },
  "alertLevel": "moderate",
  "recommendations": [
    "Monitor for disease symptoms",
    "Ensure adequate irrigation",
    "Watch weather forecast"
  ]
}
```

---

## 🏦 Insurance Integration

### Policy Management Features

- Create insurance policies linked to properties
- Track premium amounts and coverage
- Store policy documents
- Manage policy start/end dates
- View all active policies in dashboard

### Future Enhancements

- Automatic claim filing based on risk scores
- Integration with insurance company APIs
- Premium calculation based on crop type and risk
- Policy renewal reminders
- Claim status tracking

---

## 🧪 Testing

### Backend API Tests
```bash
# Test health endpoint
curl http://localhost:5000/

# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Farmer",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "test123"
  }'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'

# Test protected route (replace TOKEN)
curl http://localhost:5000/api/property \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Frontend Testing
1. Open `http://localhost:5173`
2. Sign up with test credentials
3. Create a property with sample data
4. Upload test documents
5. Check weather and trigger ML prediction
6. Create insurance policy

---

## 📁 Project Structure

```
SSPU-HACK/
├── farmview-frontend/
│   ├── client/                    # React Frontend (Vite)
│   │   ├── src/
│   │   │   ├── components/       # Reusable UI components
│   │   │   ├── pages/            # Page components
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── Property.jsx  # Map + property creation
│   │   │   │   ├── Weather.jsx   # Weather display
│   │   │   │   ├── Insurance.jsx
│   │   │   │   └── Documents.jsx
│   │   │   ├── utils/
│   │   │   │   └── api.js        # Axios instance with JWT
│   │   │   ├── App.jsx
│   │   │   └── main.jsx
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── server/                    # Express.js Backend
│       ├── models/               # MongoDB schemas
│       │   ├── Farmer.model.js
│       │   ├── Property.model.js
│       │   ├── Insurance.model.js
│       │   └── Alert.model.js
│       ├── routes/               # API routes
│       │   ├── auth.routes.js
│       │   ├── property.routes.js
│       │   ├── weather.routes.js
│       │   ├── document.routes.js
│       │   ├── insurance.routes.js
│       │   └── alert.routes.js
│       ├── middleware/
│       │   └── auth.middleware.js  # JWT verification
│       ├── services/
│       │   ├── cropPrediction.js   # ML risk calculation
│       │   └── weatherAlertService.js  # Cron job
│       ├── config/
│       │   └── db.js              # MongoDB connection
│       ├── .env                   # Environment variables
│       ├── server.js              # Entry point
│       └── package.json
│
├── README.md                      # This file
└── .gitignore
```

---

## 🔐 Security

- **JWT Authentication**: Secure token-based auth with expiry
- **Password Hashing**: Bcrypt with salt rounds
- **Protected Routes**: Middleware verification on all farmer endpoints
- **CORS Configuration**: Restricted origins in production
- **Environment Variables**: Sensitive data in `.env` (not committed)
- **Input Validation**: Mongoose schema validation
- **File Upload Limits**: 10MB max file size for documents
- **GridFS Storage**: Secure file storage in MongoDB

---

## 📈 Performance

- **Response Time**: < 500ms for most API calls
- **Weather Fetch**: 1-2 seconds (depends on OpenWeatherMap API)
- **ML Prediction**: < 100ms (in-memory calculation)
- **Document Upload**: Supports up to 10MB files
- **Map Rendering**: Optimized Leaflet with tile caching
- **Database**: MongoDB with indexes on farmerId and propertyId
- **Concurrent Users**: Express.js async/await pattern
- **Cron Jobs**: Non-blocking background tasks every 6 hours

---

## 🐛 Troubleshooting

### Common Issues

**1. Backend won't start**
```
Error: Cannot find module 'express'
```
**Solution**: Run `npm install` in server directory

**2. Frontend build error**
```
Error: Cannot find module 'leaflet'
```
**Solution**: Run `npm install` in client directory

**3. MongoDB Connection Error**
```
Error: connect ECONNREFUSED
```
**Solution**: 
- Check MongoDB URI in `.env`
- Verify IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for testing)
- Ensure MongoDB service is running (if local)

**4. JWT Authentication Failed**
```
Error: 401 Unauthorized
```
**Solution**: 
- Check if token is in localStorage
- Verify JWT_SECRET in `.env`
- Re-login to get fresh token

**5. Weather API Error**
```
Error: 401 Unauthorized from OpenWeatherMap
```
**Solution**: Check WEATHER_API_KEY in `.env` and verify API key is active

**6. Map not loading**
```
Leaflet error: Map container not found
```
**Solution**: Check if DOM element with id exists before initializing map

**7. File Upload Error**
```
Error: GridFS bucket not initialized
```
**Solution**: Restart backend server to reinitialize GridFS connection

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Guidelines

- Follow existing code structure
- Add comments for complex logic
- Test all API endpoints before committing
- Update README if adding new features
- Keep dependencies up to date

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Team

Developed for **SSPU HACKATHON 2025**

**Tech Stack:**
- Frontend: React 18.2 + Vite 5.4
- Backend: Node.js 20.19 + Express 4.21
- Database: MongoDB Atlas
- Maps: Leaflet 1.9.4 + Leaflet Draw 1.0.4
- Authentication: JWT + Bcrypt
- Weather: OpenWeatherMap API

---

## 🙏 Acknowledgments

- **OpenWeatherMap** for weather data API
- **Leaflet.js** for interactive mapping
- **MongoDB** for flexible document storage
- **Nominatim** for geocoding services
- **Esri ArcGIS** for satellite imagery tiles

---

## 📞 Support

For issues and questions:
- Create an issue on [GitHub](https://github.com/mebishnusahu0595/SSPU-HACK/issues)
- Email: mebishnusahu0595@gmail.com

---

## 🚀 Future Enhancements

- [ ] Satellite imagery integration (Sentinel-2 NDVI analysis)
- [ ] SMS/Email alert notifications
- [ ] Mobile app (React Native)
- [ ] Multi-language support (Hindi, Marathi, etc.)
- [ ] Soil testing recommendations
- [ ] Crop yield prediction
- [ ] Market price integration
- [ ] Government scheme recommendations
- [ ] Community forum for farmers
- [ ] Voice-based input (for low-literacy users)

---

<div align="center">

**Made with ❤️ for Farmers of India**

🌾 FarmView AI - Empowering Agriculture with Technology 🛰️

</div>
