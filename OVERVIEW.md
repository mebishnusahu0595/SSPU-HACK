# 🌾 FarmView AI - Project Overview

## 📋 Complete System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FARMVIEW AI PLATFORM                     │
│              Satellite-Based Crop Damage Assessment          │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  LAYER 1: USER INTERFACE (Frontend)                          │
├──────────────────────────────────────────────────────────────┤
│  • Interactive Web Dashboard (static/index.html)             │
│  • Leaflet.js for map drawing and visualization             │
│  • Bootstrap for responsive UI                               │
│  • Real-time polygon drawing and coordinate capture          │
└──────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST
┌──────────────────────────────────────────────────────────────┐
│  LAYER 2: API BACKEND (FastAPI)                              │
├──────────────────────────────────────────────────────────────┤
│  main.py - FastAPI application with endpoints:               │
│    • POST /api/register-field                                │
│    • POST /api/analyze-field                                 │
│    • GET  /api/field/{id}                                    │
│    • GET  /api/analyses/{id}                                 │
│    • GET  /reports/{filename}                                │
└──────────────────────────────────────────────────────────────┘
         ↓                  ↓                  ↓
┌─────────────────┬─────────────────┬─────────────────────────┐
│  LAYER 3: CORE PROCESSING MODULES                           │
├─────────────────┼─────────────────┼─────────────────────────┤
│ Sentinel API    │ NDVI Processor  │ Visualization Engine    │
│ (sentinel_api)  │ (ndvi_processor)│ (visualization.py)      │
│                 │                 │                         │
│ • Fetch imagery │ • Calculate NDVI│ • Damage heatmaps       │
│ • Current dates │ • Detect damage │ • Comparison charts     │
│ • Baseline dates│ • Threshold test│ • PDF reports           │
│ • Multi-spectral│ • Area stats    │ • Interactive maps      │
└─────────────────┴─────────────────┴─────────────────────────┘
         ↓                                          ↓
┌─────────────────┐                     ┌──────────────────────┐
│ Sentinel Hub API│                     │ FinTech Integration  │
│                 │                     │ (fintech_integration)│
│ • Satellite Data│                     │ • Claim estimation   │
│ • NIR & RED     │                     │ • Insurance webhooks │
│ • Sentinel-2    │                     │ • API connectors     │
└─────────────────┘                     └──────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  LAYER 4: DATA PERSISTENCE                                   │
├──────────────────────────────────────────────────────────────┤
│  MongoDB Atlas (database.py)                                 │
│    • Fields Collection - Farm boundaries and metadata        │
│    • Analyses Collection - NDVI results and damage reports   │
│    • Users Collection - Authentication and roles             │
└──────────────────────────────────────────────────────────────┘
```

---

## 📂 File Structure & Responsibilities

### **Core Application Files**

| File | Lines | Purpose |
|------|-------|---------|
| `main.py` | ~390 | FastAPI app, API endpoints, request orchestration |
| `config.py` | ~60 | Environment configuration, settings management |
| `requirements.txt` | ~40 | Python dependencies and versions |

### **Processing Modules**

| File | Lines | Purpose |
|------|-------|---------|
| `ndvi_processor.py` | ~270 | NDVI calculation, damage detection algorithms |
| `sentinel_api.py` | ~250 | Sentinel Hub API integration, image fetching |
| `visualization.py` | ~350 | Heatmaps, charts, PDF report generation |
| `fintech_integration.py` | ~180 | Insurance API, claim estimation |

### **Data & Auth**

| File | Lines | Purpose |
|------|-------|---------|
| `database.py` | ~190 | MongoDB models, CRUD operations |
| `auth.py` | ~120 | JWT authentication, user management |
| `utils.py` | ~170 | Utility functions, validators, formatters |

### **Frontend**

| File | Lines | Purpose |
|------|-------|---------|
| `static/index.html` | ~500 | Web dashboard, interactive map, forms |

### **Documentation**

| File | Purpose |
|------|---------|
| `README.md` | Comprehensive project documentation |
| `API_DOCUMENTATION.md` | API endpoint reference |
| `QUICK_SETUP.md` | 5-minute setup guide |
| `OVERVIEW.md` | This file - system architecture |

### **Scripts & Config**

| File | Purpose |
|------|---------|
| `start.sh` | Automated startup script |
| `test_api.py` | API testing suite |
| `.env.example` | Environment variable template |
| `.gitignore` | Git ignore patterns |

---

## 🔄 Complete Workflow (Technical)

### **Phase 1: User Input (Frontend → Backend)**

```javascript
1. User draws polygon on Leaflet map
2. JavaScript captures coordinates as [[lon, lat], ...]
3. User fills form: farmer_id, crop, date, insured_amount
4. Frontend sends POST to /api/analyze-field
5. JSON payload with coordinates + metadata
```

### **Phase 2: Satellite Data Acquisition**

```python
6. Backend receives request in main.py
7. Calls SentinelHubAPI.get_field_images()
8. Sentinel API:
   - Authenticates with OAuth token
   - Calculates bounding box from coordinates
   - Fetches current image (event_date ± 3 days)
   - Fetches baseline image (60-90 days before)
   - Returns multi-spectral GeoTIFF (NIR + RED bands)
9. Saves temporary .tif files
```

### **Phase 3: NDVI Analysis**

```python
10. NDVIProcessor.process_field_analysis() starts
11. Extract NIR (Band 8) and RED (Band 4) from both images
12. Calculate NDVI for current: (NIR - RED) / (NIR + RED)
13. Calculate NDVI for baseline: same formula
14. Compute difference: delta_NDVI = current - baseline
15. Apply thresholds:
    - If delta < -0.2: Mark pixel as DAMAGED
    - If delta < -0.4: Mark pixel as SEVERE_DAMAGE
16. Calculate statistics:
    - damage_percent = (damaged_pixels / total_pixels) × 100
    - risk_score = min(10, damage_percent / 10)
    - area_statistics in hectares
```

### **Phase 4: Visualization & Reporting**

```python
17. VisualizationEngine.create_damage_heatmap()
    - Color-code: Green (healthy), Yellow (damaged), Red (severe)
    - Save as PNG
18. Create comparison chart (baseline vs current NDVI)
19. Create interactive Folium map with polygon overlay
20. PDFReportGenerator.generate_report()
    - Executive summary table
    - Damage heatmap image
    - Comparison chart
    - Detailed analysis text
    - Recommendations based on severity
    - Save as PDF
```

### **Phase 5: Claim Processing**

```python
21. If insured_amount provided:
22. ClaimEstimator.calculate_claim()
    - Progressive scaling based on damage %
    - < 30%: 50% claim rate
    - 30-50%: 70% claim rate
    - 50-70%: 85% claim rate
    - > 70%: 100% claim rate
23. InsuranceIntegration.send_claim_report()
    - Format payload with damage stats
    - Send to insurance webhook
    - Return claim confirmation
```

### **Phase 6: Data Persistence**

```python
24. AnalysisModel.create_analysis()
    - Store complete results in MongoDB
    - Fields: farmer_id, damage_stats, area_stats, timestamps
25. Return analysis_id and all URLs to frontend
```

### **Phase 7: Response & Display**

```javascript
26. Frontend receives JSON response
27. Update UI:
    - Display damage percentage (color-coded)
    - Show risk score with severity indicator
    - Present area statistics
    - Show estimated claim (if applicable)
    - Provide download links for PDF report
    - Link to interactive map
28. User can download report or view map
```

---

## 🧮 NDVI Algorithm Details

### **Mathematical Formula**

```
NDVI = (NIR - RED) / (NIR + RED)

Where:
- NIR = Near-Infrared reflectance (Band 8, ~842 nm)
- RED = Red reflectance (Band 4, ~665 nm)
- Result range: -1.0 to +1.0
```

### **Vegetation Health Mapping**

```
NDVI Value   |  Vegetation State      |  Color Code
-------------|------------------------|-------------
0.8 - 1.0    |  Dense, healthy crops  |  Dark Green
0.6 - 0.8    |  Healthy vegetation    |  Green
0.4 - 0.6    |  Moderate vegetation   |  Light Green
0.2 - 0.4    |  Sparse vegetation     |  Yellow
0.0 - 0.2    |  Very sparse/stressed  |  Orange
-0.2 - 0.0   |  Bare soil/dead        |  Brown
< -0.2       |  Water/non-vegetated   |  Blue
```

### **Damage Detection Logic**

```python
# Step 1: Calculate change
ndvi_change = current_ndvi - baseline_ndvi

# Step 2: Apply thresholds
for each pixel:
    if ndvi_change < -0.4:
        pixel_status = SEVERE_DAMAGE
        color = RED
    elif ndvi_change < -0.2:
        pixel_status = DAMAGED
        color = YELLOW
    else:
        pixel_status = HEALTHY
        color = GREEN

# Step 3: Calculate statistics
damage_percent = (sum(damaged_pixels) / total_pixels) * 100
risk_score = min(10, damage_percent / 10)
```

### **Why NDVI Works**

1. **Chlorophyll Absorption**: Healthy plants absorb RED light for photosynthesis
2. **Cell Structure Reflection**: Healthy plants reflect NIR due to leaf structure
3. **Damage Response**: Damaged/stressed plants:
   - Absorb less RED (chlorophyll degradation)
   - Reflect less NIR (cell structure breakdown)
   - Result: Lower NDVI values

---

## 🎯 Key Features Implementation

### **1. Real-Time Polygon Drawing**

```javascript
// Leaflet.js + Leaflet Draw plugin
const map = L.map('map').setView([lat, lon], zoom);
const drawControl = new L.Control.Draw({
    draw: { polygon: true }
});
map.on(L.Draw.Event.CREATED, function(e) {
    coordinates = e.layer.getLatLngs();
});
```

### **2. Satellite Image Fetching**

```python
# Sentinel Hub Process API
def fetch_satellite_image(bbox, time_range):
    request = {
        "input": {
            "bounds": {"bbox": bbox},
            "data": [{
                "type": "sentinel-2-l2a",
                "dataFilter": {
                    "timeRange": time_range,
                    "maxCloudCoverage": 30
                }
            }]
        },
        "evalscript": get_bands_script()
    }
    return requests.post(SENTINEL_API_URL, json=request)
```

### **3. Async Database Operations**

```python
# Motor (async MongoDB driver)
async def create_analysis(data):
    collection = db["analyses"]
    result = await collection.insert_one(data)
    return str(result.inserted_id)
```

### **4. PDF Report Generation**

```python
# ReportLab
doc = SimpleDocTemplate("report.pdf")
story = [
    Paragraph("Executive Summary", heading_style),
    Table(damage_data),
    Image("heatmap.png"),
    Spacer(1, 0.5*inch)
]
doc.build(story)
```

---

## 📊 Performance Metrics

### **Processing Times**

| Operation | Time | Bottleneck |
|-----------|------|------------|
| Field Registration | < 1s | Database write |
| Satellite Image Fetch | 10-20s | Network + Sentinel API |
| NDVI Calculation | 2-5s | CPU (NumPy operations) |
| Visualization | 3-5s | Image rendering |
| PDF Generation | 2-3s | ReportLab rendering |
| Insurance API Call | 1-2s | Network |
| **Total Analysis** | **30-60s** | **Satellite fetch** |

### **Resource Usage**

- **CPU**: 20-40% during analysis
- **RAM**: 200-500 MB
- **Disk**: ~10 MB per analysis (temp files)
- **Network**: ~5-10 MB per analysis (satellite data)

### **Scalability**

- **Concurrent analyses**: 5-10 (limited by Sentinel Hub quota)
- **Database**: Virtually unlimited (MongoDB Atlas)
- **Storage**: Scale with AWS S3/GCS for reports

---

## 🔧 Technology Stack

### **Backend**
- **Python 3.9+**: Core language
- **FastAPI**: Modern async web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation

### **Geospatial**
- **Rasterio**: GeoTIFF processing
- **GDAL**: Geospatial data abstraction
- **Shapely**: Geometric operations
- **PyProj**: Coordinate transformations

### **Data Science**
- **NumPy**: Array operations
- **OpenCV**: Image processing
- **Matplotlib**: Plotting
- **Seaborn**: Statistical visualization

### **Database**
- **MongoDB Atlas**: Cloud NoSQL database
- **Motor**: Async MongoDB driver
- **PyMongo**: Sync MongoDB driver

### **Satellite Data**
- **Sentinel Hub API**: ESA Copernicus data access
- **Sentinel-2**: Multi-spectral satellite imagery

### **Frontend**
- **Leaflet.js**: Interactive maps
- **Leaflet Draw**: Polygon drawing
- **Bootstrap 5**: UI framework
- **Vanilla JavaScript**: No heavy frameworks

### **Reporting**
- **ReportLab**: PDF generation
- **Folium**: Interactive web maps
- **Pillow**: Image manipulation

### **Integration**
- **httpx**: Async HTTP client
- **Requests**: Sync HTTP client

### **Security**
- **python-jose**: JWT tokens
- **passlib**: Password hashing
- **bcrypt**: Cryptographic hashing

---

## 🚀 Deployment Options

### **Option 1: Docker (Recommended)**

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

### **Option 2: Cloud Platform**

- **AWS Elastic Beanstalk**: Easy deployment
- **Google Cloud Run**: Serverless containers
- **Azure App Service**: Managed hosting
- **Heroku**: Quick deployment

### **Option 3: VPS**

- **DigitalOcean Droplet**
- **Linode**
- **AWS EC2**
- **Google Compute Engine**

---

## 🎓 Learning Resources

### **Understanding NDVI**
- [NASA Earth Observatory](https://earthobservatory.nasa.gov/features/MeasuringVegetation)
- [Sentinel Hub NDVI](https://custom-scripts.sentinel-hub.com/sentinel-2/ndvi/)

### **Sentinel-2 Satellite**
- [ESA Sentinel-2 Mission](https://sentinel.esa.int/web/sentinel/missions/sentinel-2)
- [Band Specifications](https://sentinels.copernicus.eu/web/sentinel/technical-guides/sentinel-2-msi/msi-instrument)

### **FastAPI**
- [Official Documentation](https://fastapi.tiangolo.com/)
- [Full Stack FastAPI Template](https://github.com/tiangolo/full-stack-fastapi-postgresql)

### **Leaflet.js**
- [Leaflet Tutorials](https://leafletjs.com/examples.html)
- [Leaflet Draw Plugin](https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html)

---

## 💰 Cost Estimates

### **Development/Testing**
- Sentinel Hub: **FREE** (1000 requests/month)
- MongoDB Atlas: **FREE** (512 MB)
- Total: **₹0/month**

### **Production (Small Scale)**
- Sentinel Hub: **$0.1/request** (after free tier)
- MongoDB Atlas: **₹5000/month** (Shared cluster)
- AWS S3: **₹500/month** (100 GB)
- Server: **₹2000/month** (VPS)
- Total: **₹7500/month** (~$90)

### **Production (Large Scale)**
- Sentinel Hub: **Custom pricing**
- MongoDB Atlas: **₹20000/month** (Dedicated)
- AWS: **₹50000/month** (ECS + S3)
- Total: **₹70000/month** (~$850)

---

## 🎉 Project Achievements

✅ **Complete end-to-end satellite analysis pipeline**
✅ **Interactive web-based interface**
✅ **Automated NDVI calculation and damage detection**
✅ **Professional PDF report generation**
✅ **Insurance API integration**
✅ **MongoDB database with async operations**
✅ **JWT authentication support**
✅ **Comprehensive documentation**
✅ **Testing suite**
✅ **Production-ready architecture**

---

**Total Project Size:**
- **Files:** 18
- **Lines of Code:** ~3,500
- **Dependencies:** 30+
- **Development Time:** Optimized for SSPU Hackathon

**Made with ❤️ for Indian Farmers**

🌾 FarmView AI - Empowering Agriculture with Satellite Technology 🛰️
