import React, { useState, useEffect, useRef } from 'react';
import { searchLocations, reverseGeocode } from '../services/api';
import '../styles/LocationInput.css';

const LocationInput = ({ value, onChange, placeholder = "e.g. Delhi, India", className = "" }) => {
    const [query, setQuery] = useState(value || '');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [geoLoading, setGeoLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const timeoutRef = useRef(null);

    // Sync external value
    useEffect(() => {
        if (value !== query) {
            setQuery(value || '');
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSuggestions = async (searchStr) => {
        if (!searchStr.trim()) {
            setSuggestions([]);
            return;
        }
        setLoading(true);
        try {
            const results = await searchLocations(searchStr);
            setSuggestions(results || []);
            setIsOpen(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const val = e.target.value;
        setQuery(val);
        onChange(val); // pass it up even if it's not a suggestion yet
        
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        
        timeoutRef.current = setTimeout(() => {
            fetchSuggestions(val);
        }, 300); // 300ms debounce
    };

    const handleSelect = (displayName) => {
        setQuery(displayName);
        onChange(displayName);
        setIsOpen(false);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const handleCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const result = await reverseGeocode(latitude, longitude);
                if (result && result.displayName) {
                    setQuery(result.displayName);
                    onChange(result.displayName);
                }
            } catch (err) {
                console.error(err);
                alert('Failed to detect location. Please type it manually.');
            } finally {
                setGeoLoading(false);
                setIsOpen(false);
            }
        }, () => {
            setGeoLoading(false);
            alert('Please allow location access to use this feature.');
        });
    };

    return (
        <div className={`location-input-wrapper ${className}`} ref={dropdownRef}>
            <input
                type="text"
                className={`location-input-field ${geoLoading ? 'loading' : ''}`}
                value={query}
                onChange={handleInputChange}
                onFocus={() => {
                    if (query.trim() && suggestions.length > 0) setIsOpen(true);
                    else if (!query.trim()) setIsOpen(true); // Open for "Use Current Location" option
                }}
                placeholder={geoLoading ? 'Detecting location...' : placeholder}
                disabled={geoLoading}
            />
            {loading && <span className="location-spinner">↻</span>}

            {isOpen && (
                <div className="location-dropdown">
                    {!query.trim() && (
                        <button 
                            type="button" 
                            className="current-location-btn"
                            onClick={handleCurrentLocation}
                        >
                            📍 Use Current Location
                        </button>
                    )}
                    
                    {suggestions.map((item, idx) => (
                        <div 
                            key={item.id || idx} 
                            className="location-suggestion"
                            onClick={() => handleSelect(item.displayName)}
                        >
                            <span className="location-icon">📍</span>
                            <span>{item.displayName}</span>
                        </div>
                    ))}
                    
                    {query.trim() && suggestions.length === 0 && !loading && (
                        <div className="location-no-results">No locations found. Keep typing or select current location.</div>
                    )}
                    
                    {query.trim() && (
                        <div className="location-dropdown-footer">
                            <button 
                                type="button" 
                                className="current-location-footer-btn"
                                onClick={handleCurrentLocation}
                            >
                                📍 Detect Location
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LocationInput;
