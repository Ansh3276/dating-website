const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/autocomplete', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);
        
        // OpenStreetMap Nominatim API proxy to avoid frontend CORS/keys
        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q,
                format: 'json',
                addressdetails: 1,
                limit: 5,
                featuretype: 'city'
            },
            headers: {
                'User-Agent': 'CrushlyApp/1.0'
            }
        });

        // Format suggestions safely
        const formatted = response.data.map(item => {
            const address = item.address || {};
            const city = address.city || address.town || address.village || address.state_district || item.name;
            const state = address.state;
            const country = address.country;
            
            const parts = [city, state, country].filter(Boolean);
            const displayName = Array.from(new Set(parts)).join(', ');
            
            return {
                id: item.place_id,
                displayName,
                lat: item.lat,
                lon: item.lon
            };
        });

        // Ensure unique names
        const unique = Array.from(new Map(formatted.map(item => [item.displayName, item])).values());
        
        res.json(unique);
    } catch (error) {
        console.error('Autocomplete error:', error.message);
        res.status(500).json({ message: 'Failed to fetch location suggestions' });
    }
});

router.get('/reverse', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) return res.status(400).json({ message: 'Missing coordinates' });
        
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
            params: {
                lat,
                lon,
                format: 'json',
                addressdetails: 1
            },
            headers: {
                'User-Agent': 'CrushlyApp/1.0'
            }
        });

        const address = response.data.address || {};
        const city = address.city || address.town || address.village || address.state_district || response.data.name;
        const state = address.state;
        const country = address.country;
        
        const parts = [city, state, country].filter(Boolean);
        const displayName = Array.from(new Set(parts)).join(', ');

        res.json({ displayName });
    } catch (error) {
        console.error('Reverse geocode error:', error.message);
        res.status(500).json({ message: 'Failed to reverse geocode' });
    }
});

module.exports = router;
