const axios = require('axios');

class SentinelHubService {
  constructor() {
    this.clientId = process.env.SENTINEL_CLIENT_ID;
    this.clientSecret = process.env.SENTINEL_CLIENT_SECRET;
    this.apiUrl = process.env.SENTINEL_API_URL || 'https://services.sentinel-hub.com';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Get OAuth access token from Sentinel Hub
   */
  async getAccessToken() {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        `${this.apiUrl}/oauth/token`,
        new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      // Token typically expires in 3600 seconds, refresh 5 minutes before
      this.tokenExpiry = Date.now() + (response.data.expires_in - 300) * 1000;

      console.log('✅ Sentinel Hub access token obtained');
      return this.accessToken;

    } catch (error) {
      console.error('❌ Failed to get Sentinel Hub token:', error.message);
      throw error;
    }
  }

  /**
   * Get satellite imagery for a property boundary
   * @param {Object} params - Image parameters
   * @returns {Promise<Object>} - Image data
   */
  async getSatelliteImage({
    bbox, // [minLon, minLat, maxLon, maxLat]
    fromDate,
    toDate,
    width = 512,
    height = 512,
    cloudCoverage = 30,
    format = 'image/jpeg'
  }) {
    try {
      const token = await this.getAccessToken();

      // Process API request for true color RGB image
      const evalscript = `
        //VERSION=3
        function setup() {
          return {
            input: ["B04", "B03", "B02"],
            output: { bands: 3 }
          };
        }
        function evaluatePixel(sample) {
          return [2.5 * sample.B04, 2.5 * sample.B03, 2.5 * sample.B02];
        }
      `;

      const response = await axios.post(
        `${this.apiUrl}/api/v1/process`,
        {
          input: {
            bounds: {
              bbox: bbox,
              properties: {
                crs: 'http://www.opengis.net/def/crs/EPSG/0/4326'
              }
            },
            data: [{
              type: 'S2L2A',
              dataFilter: {
                timeRange: {
                  from: fromDate,
                  to: toDate
                },
                maxCloudCoverage: cloudCoverage
              }
            }]
          },
          output: {
            width: width,
            height: height,
            responses: [{
              identifier: 'default',
              format: {
                type: format
              }
            }]
          },
          evalscript: evalscript
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      return {
        success: true,
        image: Buffer.from(response.data).toString('base64'),
        format: format,
        width: width,
        height: height
      };

    } catch (error) {
      console.error('❌ Sentinel Hub API error:', error.message);
      throw error;
    }
  }

  /**
   * Get NDVI (Normalized Difference Vegetation Index) for crop health
   */
  async getNDVI({
    bbox,
    fromDate,
    toDate,
    width = 512,
    height = 512
  }) {
    try {
      const token = await this.getAccessToken();

      // NDVI calculation: (NIR - RED) / (NIR + RED)
      const evalscript = `
        //VERSION=3
        function setup() {
          return {
            input: ["B08", "B04", "SCL"],
            output: { bands: 1 }
          };
        }
        function evaluatePixel(sample) {
          let ndvi = (sample.B08 - sample.B04) / (sample.B08 + sample.B04);
          return [ndvi];
        }
      `;

      const response = await axios.post(
        `${this.apiUrl}/api/v1/process`,
        {
          input: {
            bounds: {
              bbox: bbox,
              properties: {
                crs: 'http://www.opengis.net/def/crs/EPSG/0/4326'
              }
            },
            data: [{
              type: 'S2L2A',
              dataFilter: {
                timeRange: {
                  from: fromDate,
                  to: toDate
                }
              }
            }]
          },
          output: {
            width: width,
            height: height,
            responses: [{
              identifier: 'default',
              format: {
                type: 'image/tiff'
              }
            }]
          },
          evalscript: evalscript
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      return {
        success: true,
        ndviData: Buffer.from(response.data).toString('base64'),
        format: 'image/tiff',
        width: width,
        height: height
      };

    } catch (error) {
      console.error('❌ NDVI calculation error:', error.message);
      throw error;
    }
  }

  /**
   * Calculate property bounding box from GeoJSON coordinates
   */
  calculateBoundingBox(coordinates) {
    // coordinates is array of [longitude, latitude] pairs
    const lons = coordinates[0].map(coord => coord[0]);
    const lats = coordinates[0].map(coord => coord[1]);

    return [
      Math.min(...lons), // minLon
      Math.min(...lats), // minLat
      Math.max(...lons), // maxLon
      Math.max(...lats)  // maxLat
    ];
  }
}

module.exports = new SentinelHubService();
