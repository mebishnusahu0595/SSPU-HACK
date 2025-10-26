# 🌾 FarmView AI - Getting Started

## 🎯 What You've Built

**FarmView AI** is a complete satellite-based crop damage assessment platform that:

✅ Allows farmers to draw their farm boundaries on an interactive map
✅ Automatically fetches satellite imagery from Sentinel Hub
✅ Calculates NDVI (vegetation health index) using AI algorithms
✅ Detects crop damage by comparing current vs historical satellite data
✅ Generates professional PDF reports with damage heatmaps
✅ Estimates insurance claims automatically
✅ Sends data to insurance company APIs
✅ Stores all data in MongoDB for historical tracking

---

## 📁 What's Inside

Your project contains **19 files** organized as follows:

### **📜 Documentation (4 files)**
- `README.md` - Complete project documentation
- `QUICK_SETUP.md` - 5-minute setup guide
- `API_DOCUMENTATION.md` - API reference
- `OVERVIEW.md` - Technical architecture

### **🐍 Backend Python Code (10 files)**
- `main.py` - FastAPI application with REST API endpoints
- `ndvi_processor.py` - NDVI calculation and damage detection
- `sentinel_api.py` - Satellite imagery fetching
- `visualization.py` - Charts, heatmaps, PDF generation
- `database.py` - MongoDB models and operations
- `fintech_integration.py` - Insurance API integration
- `auth.py` - JWT authentication
- `config.py` - Configuration management
- `utils.py` - Utility functions
- `test_api.py` - API testing suite

### **🌐 Frontend (1 file)**
- `static/index.html` - Interactive web dashboard

### **⚙️ Configuration (4 files)**
- `requirements.txt` - Python dependencies
- `.env.example` - Environment variables template
- `.gitignore` - Git ignore rules
- `start.sh` - Automated startup script

---

## 🚀 Running Your Application

### **Option 1: Quick Start (Recommended)**

```bash
cd /home/bishnups/Documents/SSPU-HACK
./start.sh
```

The script will:
1. Create virtual environment
2. Install all dependencies
3. Create necessary directories
4. Start the FastAPI server

### **Option 2: Manual Start**

```bash
# 1. Activate virtual environment
source venv/bin/activate

# 2. Install dependencies (if not installed)
pip install -r requirements.txt

# 3. Run the application
python main.py
```

### **Access Points**

Once running, open your browser:

| URL | Purpose |
|-----|---------|
| http://localhost:8000 | API Health Check |
| http://localhost:8000/static/index.html | **Main Dashboard** |
| http://localhost:8000/docs | Interactive API Documentation |
| http://localhost:8000/redoc | Alternative API Docs |

---

## 🎮 Using the Dashboard

### **Step 1: Open Dashboard**
Go to: http://localhost:8000/static/index.html

### **Step 2: Draw Farm Boundary**
1. Click the **polygon tool** (▢) in the top-left of the map
2. Click on the map to create corners of your farm
3. Click 4-5 points to outline your field
4. **Double-click** to complete the polygon

💡 **Tip**: Use satellite view for better accuracy!

### **Step 3: Fill Form**
- **Farmer ID**: Enter unique ID (e.g., `FARM001`)
- **Crop Type**: Select from dropdown (Rice, Wheat, etc.)
- **Event Date**: Date of damage (optional, defaults to today)
- **Insured Amount**: Amount in ₹ for claim calculation (optional)

### **Step 4: Analyze**
Click **"🛰️ Analyze Field & Generate Report"**

⏱️ **Processing time**: 30-60 seconds

### **Step 5: View Results**
After processing, you'll see:
- **Damage Percentage**: % of crop damaged
- **Risk Score**: 0-10 severity rating
- **Total Area**: In hectares
- **Estimated Claim**: Insurance amount (if insured_amount provided)
- **Download Report**: PDF with full analysis
- **View Map**: Interactive damage visualization

---

## 🔧 Before First Use

### **⚠️ Required Configuration**

You **MUST** configure these in `.env`:

```bash
# 1. Copy template
cp .env.example .env

# 2. Edit with your credentials
nano .env
```

**Required:**
```env
# Get from: https://www.sentinel-hub.com/
SENTINEL_CLIENT_ID=your_sentinel_client_id
SENTINEL_CLIENT_SECRET=your_sentinel_client_secret

# Get from: https://www.mongodb.com/cloud/atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/farmview
```

**Optional but recommended:**
```env
# Change this for production!
JWT_SECRET_KEY=your-random-secret-key-here
```

### **🛰️ Getting Sentinel Hub Credentials**

1. Go to https://www.sentinel-hub.com/
2. Sign up for **FREE account** (1000 requests/month)
3. Go to **User Settings** → **OAuth clients**
4. Click **"+ Create new"**
5. Copy **Client ID** and **Client Secret**
6. Paste into `.env` file

### **🗄️ Getting MongoDB**

**Option A: Free Cloud (Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up and create **FREE M0 cluster**
3. Create database user
4. Whitelist IP: `0.0.0.0/0` (for testing)
5. Click **"Connect"** → **"Connect your application"**
6. Copy connection string
7. Replace `<password>` with your database password
8. Paste into `.env`

**Option B: Local MongoDB**
```bash
# Install
sudo apt-get install mongodb

# Start
sudo systemctl start mongodb

# Use in .env
MONGODB_URI=mongodb://localhost:27017/farmview_ai
```

---

## 🧪 Testing

### **Automated Tests**

```bash
# Activate virtual environment
source venv/bin/activate

# Run test suite
python test_api.py
```

This will test:
- ✅ API health check
- ✅ Field registration
- ✅ Get field information
- ✅ Full analysis (optional, requires Sentinel Hub)
- ✅ Dashboard statistics

### **Manual Test**

1. Open: http://localhost:8000/static/index.html
2. Draw a small polygon on the map
3. Fill form with test data:
   - Farmer ID: `TEST001`
   - Crop: `Rice`
   - Insured Amount: `500000`
4. Click **Analyze**
5. Wait 30-60 seconds
6. View results and download PDF report

---

## 📊 Understanding Results

### **Damage Percentage**
```
0-10%    = Minimal damage (green)
10-30%   = Low damage (light green/yellow)
30-50%   = Moderate damage (yellow/orange)
50-70%   = High damage (orange/red)
70-100%  = Severe damage (red)
```

### **Risk Score**
```
0-3  = Low risk
4-6  = Medium risk
7-10 = High risk
```

### **NDVI Values**
```
0.6-1.0  = Healthy crops
0.3-0.6  = Moderate health
0.1-0.3  = Stressed crops
<0.1     = Damaged/dead crops
```

### **Claim Estimation**
```python
if damage < 10%:  no claim
elif damage < 30%: claim = damage × insured × 50%
elif damage < 50%: claim = damage × insured × 70%
elif damage < 70%: claim = damage × insured × 85%
else:             claim = damage × insured × 100%
```

---

## 🔥 Common Issues & Solutions

### **Issue 1: Import Errors**
```
❌ ModuleNotFoundError: No module named 'fastapi'
```
**Solution:**
```bash
source venv/bin/activate  # Activate venv first!
pip install -r requirements.txt
```

### **Issue 2: MongoDB Connection Failed**
```
❌ Failed to connect to MongoDB
```
**Solution:**
- Check `MONGODB_URI` in `.env`
- For Atlas: Whitelist IP `0.0.0.0/0`
- Test connection: `mongosh "your_mongodb_uri"`

### **Issue 3: Sentinel Hub Error**
```
❌ Unable to fetch satellite images
```
**Solution:**
- Verify credentials in `.env`
- Check free tier quota (1000 requests/month)
- Try different coordinates or date range

### **Issue 4: GDAL Installation Failed**
```
❌ ERROR: Failed building wheel for gdal
```
**Solution:**
```bash
# Ubuntu/Debian
sudo apt-get install gdal-bin libgdal-dev python3-gdal

# Then
pip install --no-cache-dir gdal==3.8.0
```

### **Issue 5: Port Already in Use**
```
❌ Error: Address already in use
```
**Solution:**
```bash
# Find process on port 8000
lsof -ti:8000

# Kill it
kill -9 $(lsof -ti:8000)

# Or use different port in config.py
APP_PORT=8001
```

---

## 🎨 Customization Ideas

### **1. Add More Crops**
Edit `static/index.html`:
```html
<select id="cropType">
    <option value="Rice">Rice</option>
    <option value="Wheat">Wheat</option>
    <option value="YourCrop">Your Crop</option>  <!-- Add here -->
</select>
```

### **2. Adjust Damage Thresholds**
Edit `config.py`:
```python
NDVI_DAMAGE_THRESHOLD = -0.2  # Change to -0.15 for more sensitive
```

### **3. Change Map Style**
Edit `static/index.html`:
```javascript
// Current: Satellite view
L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}')

// Change to: Street map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
```

### **4. Add Email Notifications**
Install: `pip install python-mailgun`

Add to `main.py`:
```python
from mailgun import Mailgun

def send_report_email(farmer_email, report_url):
    mg = Mailgun("your_api_key", "your_domain")
    mg.send_email(
        to=farmer_email,
        subject="Your Crop Damage Report",
        text=f"View report: {report_url}"
    )
```

---

## 🚀 Next Steps

### **For Development**
1. ✅ Test the basic workflow
2. ✅ Try with different farm locations
3. ✅ Review generated PDF reports
4. ✅ Check MongoDB data in Atlas
5. ✅ Customize UI colors/text

### **For Production**
1. 🔐 Set strong `JWT_SECRET_KEY`
2. 🌍 Set `DEBUG=False`
3. 🔒 Enable HTTPS
4. 📊 Add monitoring (Sentry, DataDog)
5. 🐳 Create Docker image
6. ☁️ Deploy to AWS/GCP/Azure
7. 📈 Set up rate limiting
8. 💾 Configure backups

### **For Hackathon Demo**
1. 🎥 Prepare demo video
2. 📊 Create presentation slides
3. 🗺️ Test with 2-3 sample farms
4. 📸 Take screenshots of results
5. 📝 Prepare to explain NDVI algorithm
6. 💡 Highlight unique features
7. 🏆 Show real-world impact

---

## 📞 Support & Resources

### **Documentation**
- **Full Docs**: `README.md`
- **API Reference**: `API_DOCUMENTATION.md`
- **Architecture**: `OVERVIEW.md`
- **Quick Setup**: `QUICK_SETUP.md`

### **API Testing**
- **Swagger UI**: http://localhost:8000/docs
- **Test Script**: `python test_api.py`

### **External Resources**
- Sentinel Hub: https://www.sentinel-hub.com/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- FastAPI Docs: https://fastapi.tiangolo.com/
- Leaflet.js: https://leafletjs.com/

### **Logs & Debugging**
```bash
# Check logs
tail -f terminal_output.log

# Test specific endpoint
curl http://localhost:8000/

# Check Python version
python --version

# Verify dependencies
pip list
```

---

## 🎉 You're Ready!

Your **FarmView AI** platform is complete and ready to use!

### **Quick Start Checklist**
- [ ] Configure `.env` with Sentinel Hub credentials
- [ ] Configure `.env` with MongoDB URI
- [ ] Run `./start.sh` or `python main.py`
- [ ] Open http://localhost:8000/static/index.html
- [ ] Draw a farm boundary on the map
- [ ] Fill in the form and click Analyze
- [ ] Wait 30-60 seconds for results
- [ ] Download PDF report and view interactive map

### **Demo-Ready Features**
✨ **Interactive map** with polygon drawing
✨ **Real satellite imagery** from Sentinel-2
✨ **AI-powered NDVI** analysis
✨ **Damage detection** with color-coded heatmaps
✨ **Professional PDF** reports
✨ **Automatic claim** estimation
✨ **Insurance API** integration
✨ **MongoDB** data persistence
✨ **REST API** with documentation
✨ **Responsive** mobile-friendly UI

---

**🏆 For SSPU Hackathon 2025**

**Made with ❤️ for Indian Farmers**

🌾 **FarmView AI** - Empowering Agriculture with Satellite Technology 🛰️

---

**Need Help?**
- Check `README.md` for detailed docs
- Run `python test_api.py` to verify setup
- Visit http://localhost:8000/docs for API reference
- Check terminal output for error messages

**Good luck with your demo! 🚀**
