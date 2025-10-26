# 🌾 FarmView AI - Satellite-Based Crop Damage Assessment

<div align="center">

![FarmView AI Logo](https://img.shields.io/badge/FarmView-AI-2ecc71?style=for-the-badge&logo=satellite&logoColor=white)

**Automated crop damage assessment using satellite imagery and NDVI analysis**

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Sentinel Hub](https://img.shields.io/badge/Sentinel-Hub-0072C6?style=flat&logo=satellite&logoColor=white)](https://www.sentinel-hub.com/)

</div>

---

## 🎯 Overview

**FarmView AI** is a cutting-edge geospatial platform that enables farmers and insurance companies to assess crop damage automatically using satellite imagery. The system leverages **Normalized Difference Vegetation Index (NDVI)** analysis to detect crop health changes and generate comprehensive damage reports within seconds.

### Key Features

- 🛰️ **Automated Satellite Imagery**: Fetches multi-spectral data from Sentinel Hub
- 📊 **NDVI Analysis**: Calculates vegetation health using NIR and RED bands
- 🗺️ **Interactive Mapping**: Draw farm boundaries using Leaflet.js
- 📄 **PDF Reports**: Auto-generated professional damage assessment reports
- 💰 **Claim Estimation**: Instant insurance claim amount calculation
- 🔗 **FinTech Integration**: Webhook support for insurance APIs
- 📈 **Damage Heatmaps**: Visual representation of crop damage severity

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Frontend      │  Leaflet.js + Bootstrap
│   Dashboard     │  (Interactive Map Drawing)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   FastAPI       │  Python Backend
│   Backend       │  (REST API)
└────────┬────────┘
         │
    ┌────┴────┬──────────┬─────────────┐
    ▼         ▼          ▼             ▼
┌────────┐ ┌─────┐  ┌──────┐    ┌──────────┐
│Sentinel│ │NDVI │  │Viz   │    │Insurance │
│Hub API │ │Proc │  │Engine│    │API       │
└────────┘ └─────┘  └──────┘    └──────────┘
    │         │          │             │
    └─────────┴──────────┴─────────────┘
                   │
                   ▼
            ┌──────────┐
            │ MongoDB  │
            │ Atlas    │
            └──────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- MongoDB Atlas account (or local MongoDB)
- Sentinel Hub API credentials ([Sign up here](https://www.sentinel-hub.com/))
- Git

### Installation

1. **Clone the repository**
   ```bash
   cd /home/bishnups/Documents/SSPU-HACK
   git init
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   nano .env  # Edit with your credentials
   ```

   Required configurations:
   - `SENTINEL_CLIENT_ID`: Your Sentinel Hub OAuth client ID
   - `SENTINEL_CLIENT_SECRET`: Your Sentinel Hub OAuth client secret
   - `MONGODB_URI`: MongoDB connection string
   - `JWT_SECRET_KEY`: Secret key for JWT authentication

5. **Create necessary directories**
   ```bash
   mkdir -p temp reports static
   ```

6. **Run the application**
   ```bash
   python main.py
   ```

   The API will be available at: `http://localhost:8000`
   
   Frontend dashboard: `http://localhost:8000/static/index.html`

---

## 📖 Usage Guide

### Step-by-Step Workflow

#### 1️⃣ Open Dashboard
Navigate to `http://localhost:8000/static/index.html`

#### 2️⃣ Mark Farm Boundary
- Click the **polygon tool** (▢) on the map
- Click points to mark your farm boundary
- Double-click to complete the polygon

#### 3️⃣ Fill Field Details
- **Farmer ID**: Unique identifier (e.g., FARM001)
- **Crop Type**: Select from dropdown (Rice, Wheat, etc.)
- **Event Date**: Date of damage event (optional)
- **Insured Amount**: For claim estimation (optional)

#### 4️⃣ Analyze Field
Click **"🛰️ Analyze Field & Generate Report"**

The system will:
1. Fetch current and historical satellite imagery
2. Calculate NDVI for both periods
3. Detect damage using threshold analysis
4. Generate damage heatmaps
5. Create PDF report
6. Send to insurance API (if configured)

#### 5️⃣ View Results
- **Damage Percentage**: % of crop damaged
- **Risk Score**: 0-10 scale severity rating
- **Area Statistics**: Total and damaged area in hectares
- **Estimated Claim**: Insurance claim amount (if insured)
- **Download Report**: PDF with full analysis
- **Interactive Map**: Folium-based visualization

---

## 🛠️ API Documentation

### Endpoints

#### `POST /api/register-field`
Register a new field for monitoring.

**Request Body:**
```json
{
  "farmer_id": "FARM001",
  "crop": "Rice",
  "coordinates": [
    [81.6542, 21.2234],
    [81.6555, 21.2241],
    [81.6571, 21.2237],
    [81.6560, 21.2229]
  ],
  "insured_amount": 500000
}
```

**Response:**
```json
{
  "message": "Field registered successfully",
  "field_id": "507f1f77bcf86cd799439011",
  "area_hectares": "2.73"
}
```

---

#### `POST /api/analyze-field`
Perform complete NDVI analysis and damage assessment.

**Request Body:** (Same as register-field)

**Response:**
```json
{
  "analysis_id": "507f1f77bcf86cd799439012",
  "farmer_id": "FARM001",
  "damage_percent": 74.3,
  "risk_score": 8.5,
  "area_hectares": 2.73,
  "damaged_area_hectares": 2.03,
  "timestamp": "2025-10-26T10:30:00Z",
  "report_url": "/reports/report_FARM001_1698321000.pdf",
  "map_url": "/static/map_FARM001_1698321000.html",
  "estimated_claim": 371500
}
```

---

#### `GET /api/field/{farmer_id}`
Get field information by farmer ID.

---

#### `GET /api/analyses/{farmer_id}`
Get all analyses for a specific field.

---

#### `GET /reports/{filename}`
Download generated PDF report.

---

#### `GET /api/dashboard-stats`
Get overall dashboard statistics.

---

## 🧮 NDVI Calculation

### Formula
```
NDVI = (NIR - RED) / (NIR + RED)
```

Where:
- **NIR**: Near-Infrared band (Band 8 in Sentinel-2)
- **RED**: Red band (Band 4 in Sentinel-2)

### Interpretation
| NDVI Range | Interpretation |
|------------|----------------|
| 0.6 - 1.0  | Healthy, dense vegetation |
| 0.3 - 0.6  | Moderate vegetation |
| 0.1 - 0.3  | Sparse vegetation |
| -0.1 - 0.1 | Bare soil, water |
| < -0.1     | Non-vegetated surfaces |

### Damage Detection
```
NDVI_Change = Current_NDVI - Baseline_NDVI

If NDVI_Change < -0.2:  # Damaged
    pixel = DAMAGED
    
If NDVI_Change < -0.4:  # Severe damage
    pixel = SEVERE_DAMAGE
```

---

## 🔧 Configuration

### Sentinel Hub Setup

1. Create account at [Sentinel Hub](https://www.sentinel-hub.com/)
2. Create OAuth client in dashboard
3. Copy Client ID and Client Secret to `.env`

### MongoDB Setup

**Option 1: MongoDB Atlas (Recommended)**
1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Whitelist your IP address
3. Create database user
4. Copy connection string to `.env`

**Option 2: Local MongoDB**
```bash
# Install MongoDB
sudo apt-get install mongodb

# Start service
sudo systemctl start mongodb

# Use local connection string
MONGODB_URI=mongodb://localhost:27017/farmview_ai
```

---

## 📊 Sample Output

### Damage Heatmap
![Damage Heatmap Example](https://via.placeholder.com/800x600/e74c3c/ffffff?text=Damage+Heatmap)

### PDF Report Structure
```
1. Executive Summary
   - Total Area: 2.73 ha
   - Damage: 74.3%
   - Risk Score: 8.5/10
   
2. Damage Assessment Visualization
   - Color-coded heatmap
   - NDVI comparison chart
   
3. Detailed Analysis
   - Mean NDVI change
   - Pixel statistics
   - Area breakdown
   
4. Recommendations
   - Action items based on severity
```

---

## 🏦 Insurance Integration

### Webhook Configuration

Set up automatic claim submission:

```python
# .env
INSURANCE_WEBHOOK_URL=https://insurance-api.example.com/webhook
INSURANCE_API_KEY=your_api_key_here
```

### Payload Format
```json
{
  "farmer_id": "FARM001",
  "analysis_id": "507f1f77bcf86cd799439012",
  "damage_assessment": {
    "damage_percent": 74.3,
    "risk_score": 8.5
  },
  "claim_estimate": 371500,
  "report_url": "/reports/report_FARM001_1698321000.pdf",
  "timestamp": "2025-10-26T10:30:00Z"
}
```

---

## 🧪 Testing

### Run API Tests
```bash
# Install pytest
pip install pytest pytest-asyncio httpx

# Run tests
pytest tests/
```

### Manual Testing
```bash
# Health check
curl http://localhost:8000/

# Test field registration
curl -X POST http://localhost:8000/api/register-field \
  -H "Content-Type: application/json" \
  -d '{
    "farmer_id": "TEST001",
    "crop": "Rice",
    "coordinates": [[81.6542, 21.2234], [81.6555, 21.2241], [81.6571, 21.2237], [81.6560, 21.2229]]
  }'
```

---

## 📁 Project Structure

```
SSPU-HACK/
├── main.py                 # FastAPI application
├── config.py               # Configuration settings
├── database.py             # MongoDB models
├── ndvi_processor.py       # NDVI calculation engine
├── sentinel_api.py         # Sentinel Hub integration
├── visualization.py        # Charts and PDF generation
├── fintech_integration.py  # Insurance API integration
├── auth.py                 # JWT authentication
├── requirements.txt        # Python dependencies
├── .env.example           # Environment template
├── README.md              # This file
├── static/
│   └── index.html         # Frontend dashboard
├── temp/                  # Temporary files
├── reports/               # Generated PDF reports
└── tests/                 # Unit tests
```

---

## 🔐 Security

- **JWT Authentication**: Secure API access
- **Password Hashing**: Bcrypt for user passwords
- **CORS Protection**: Configurable origins
- **Environment Variables**: Sensitive data in `.env`
- **Input Validation**: Pydantic models

---

## 📈 Performance

- **Analysis Time**: 30-60 seconds per field
- **Image Resolution**: 512x512 pixels (configurable)
- **Database**: MongoDB with async operations
- **Concurrent Requests**: Supported via FastAPI

---

## 🐛 Troubleshooting

### Common Issues

**1. Sentinel Hub API Error**
```
Error: Unable to fetch satellite images
```
**Solution**: Check API credentials and ensure account has sufficient quota

**2. MongoDB Connection Error**
```
Error: Failed to connect to MongoDB
```
**Solution**: Verify MongoDB URI and whitelist IP address (Atlas)

**3. No Satellite Data Available**
```
Error: No images found for date range
```
**Solution**: Adjust date range or check if area has cloud coverage < 30%

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Team

Developed for **SSPU HACKATHON 2025**

---

## 🙏 Acknowledgments

- **Sentinel Hub** for satellite imagery API
- **ESA Copernicus** for Sentinel-2 data
- **Leaflet.js** for interactive mapping
- **FastAPI** for modern Python web framework

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Email: support@farmview-ai.example.com

---

<div align="center">

**Made with ❤️ for Farmers of India**

🌾 FarmView AI - Empowering Agriculture with Technology 🛰️

</div>
