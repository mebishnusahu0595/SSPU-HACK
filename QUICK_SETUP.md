# 🚀 FarmView AI - Quick Setup Guide

## ⚡ 5-Minute Setup

### Step 1: Prerequisites Check
```bash
# Check Python version (need 3.9+)
python3 --version

# Check if pip is installed
pip3 --version

# Check if git is installed
git --version
```

### Step 2: Get Sentinel Hub Credentials

1. Go to [Sentinel Hub](https://www.sentinel-hub.com/)
2. Sign up for a free account
3. Go to Dashboard → User Settings
4. Create a new OAuth client
5. Copy Client ID and Client Secret

**Free Tier:** 1000 requests/month (sufficient for testing!)

### Step 3: Setup MongoDB

**Option A: MongoDB Atlas (Recommended - Free)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up and create a FREE cluster
3. Create database user
4. Whitelist IP: 0.0.0.0/0 (for testing)
5. Get connection string (looks like: `mongodb+srv://...`)

**Option B: Local MongoDB**
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
```

### Step 4: Configure Environment

```bash
# Navigate to project directory
cd /home/bishnups/Documents/SSPU-HACK

# Copy environment template
cp .env.example .env

# Edit the .env file
nano .env
```

**Required configurations:**
```env
# Sentinel Hub (REQUIRED)
SENTINEL_CLIENT_ID=your_client_id_here
SENTINEL_CLIENT_SECRET=your_client_secret_here

# MongoDB (REQUIRED)
MONGODB_URI=your_mongodb_connection_string_here

# JWT (Change for production)
JWT_SECRET_KEY=change-this-to-a-random-string-in-production
```

### Step 5: Install & Run

**Using the startup script (Recommended):**
```bash
chmod +x start.sh
./start.sh
```

**Or manually:**
```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python main.py
```

### Step 6: Access the Application

Open your browser and go to:

- **Dashboard:** http://localhost:8000/static/index.html
- **API Docs:** http://localhost:8000/docs
- **API Root:** http://localhost:8000/

---

## 🧪 Test the System

```bash
# Activate virtual environment
source venv/bin/activate

# Run test script
python test_api.py
```

---

## 🎯 Quick Test (Manual)

1. Open: http://localhost:8000/static/index.html

2. **Draw a polygon:**
   - Click the polygon tool (▢) on the map
   - Click 4-5 points to create a farm boundary
   - Double-click to complete

3. **Fill the form:**
   - Farmer ID: `TEST001`
   - Crop Type: `Rice`
   - Insured Amount: `500000`

4. **Click Analyze** and wait 30-60 seconds

5. **View Results:**
   - Damage percentage
   - Risk score
   - Download PDF report
   - View interactive map

---

## ⚠️ Troubleshooting

### Issue: "Import errors" when running
**Solution:**
```bash
# Make sure you're in virtual environment
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: "Failed to connect to MongoDB"
**Solution:**
- Check `MONGODB_URI` in `.env`
- For Atlas: Whitelist your IP address
- For local: Ensure MongoDB service is running

### Issue: "Unable to fetch satellite images"
**Solution:**
- Verify Sentinel Hub credentials in `.env`
- Check if you have remaining free tier quota
- Try a different date range

### Issue: "Module not found: gdal"
**Solution:**
```bash
# Ubuntu/Debian
sudo apt-get install gdal-bin libgdal-dev
pip install gdal==3.8.0

# macOS
brew install gdal
pip install gdal==3.8.0
```

---

## 📊 Expected Performance

- **Startup time:** 2-5 seconds
- **Field registration:** < 1 second
- **Analysis time:** 30-60 seconds
- **Report generation:** 5-10 seconds
- **Memory usage:** 200-500 MB
- **API response:** < 100ms (except analysis)

---

## 🔐 Security Checklist for Production

Before deploying to production:

- [ ] Change `JWT_SECRET_KEY` to a strong random string
- [ ] Set `DEBUG=False` in `.env`
- [ ] Use environment-specific MongoDB credentials
- [ ] Enable CORS for specific origins only
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Backup database regularly
- [ ] Restrict MongoDB network access
- [ ] Use strong passwords for all services

---

## 📱 Mobile Testing

The dashboard is mobile-responsive. Test on mobile:

```bash
# Find your local IP
ip addr show | grep inet

# Access from mobile on same network:
# http://YOUR_IP:8000/static/index.html
```

---

## 🎓 Next Steps

1. **Customize the frontend:** Edit `static/index.html`
2. **Add more crops:** Modify crop dropdown
3. **Adjust thresholds:** Edit `config.py` NDVI thresholds
4. **Add authentication:** Uncomment auth middleware in `main.py`
5. **Deploy to cloud:** Use Docker + AWS/GCP/Azure
6. **Scale up:** Add Redis caching, Celery for async tasks

---

## 🆘 Need Help?

- **Check logs:** Look at terminal output for errors
- **API docs:** Visit http://localhost:8000/docs
- **Test connectivity:** Run `python test_api.py`
- **Verify config:** Check `.env` file
- **Database status:** Test MongoDB connection

---

## 💡 Pro Tips

1. **Use satellite view:** Better for accurate polygon drawing
2. **Draw precise boundaries:** More accurate = better results
3. **Check cloud coverage:** Analysis works best with < 30% clouds
4. **Historical baseline:** System uses 60-90 days prior for comparison
5. **Event timing:** Best results within 7 days of damage event

---

## 🎉 You're All Set!

FarmView AI is now ready to analyze crop damage using satellite imagery!

**Start analyzing:** http://localhost:8000/static/index.html

---

**Made with ❤️ for SSPU Hackathon 2025**
