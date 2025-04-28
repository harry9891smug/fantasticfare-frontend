import crypto from 'crypto';

const apiKey = '0dc990165b843cabaa316be96af0a2b2';
const secret = 'ddf671f589';

// Function to generate signature
function generateSignature(apiKey, secret) {
  const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
  return crypto.createHash('sha256')
             .update(apiKey + secret + timestamp)
             .digest('hex');
}

export default async function handler(req, res) {
  const { hotelCode } = req.query;
  
  if (!hotelCode) {
    return res.status(400).json({ error: 'Hotel code is required' });
  }

  try {
    // Generate the signature for the request
    const signature = generateSignature(apiKey, secret);
    
    // Fetch hotel details from the API
    const response = await fetch(`https://api.test.hotelbeds.com/hotel-content-api/1.0/hotels/${hotelCode}/details`, {
      headers: {
        'Api-key': apiKey,
        'X-Signature': signature,
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from the Hotelbeds API');
    }

    const data = await response.json();

    // Log the API response for debugging
    console.log("API Response:", data);

    // Check if the data contains images and return the first image URL
    if (data && data.hotel && data.hotel.images && data.hotel.images.length > 0) {
      const imageUrl = `https://photos.hotelbeds.com/giata/${data.hotel.images[0].path}`;
      return res.status(200).json({ imageUrl });
    } else {
      return res.status(404).json({ error: 'No image found for this hotel.' });
    }

  } catch (error) {
    console.error('Error fetching hotel image:', error);
    return res.status(500).json({ error: 'Error fetching hotel image' });
  }
}
