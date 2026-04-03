// ============================================================
// GOOGLE PLACES ADDRESS AUTOCOMPLETE COMPONENT
// Magic City Services — Drop-in replacement for plain text input
// ============================================================
// 
// HOW IT WORKS:
// - Uses Google's AutocompleteService API (programmatic, NOT the widget)
// - Renders a custom dropdown with address suggestions
// - Uses an uncontrolled input (ref-based) to avoid React controlled input
//   conflict with Google's DOM manipulation on mobile Safari
// - Debounces API calls to stay within quota
//
// USAGE IN App.jsx:
//   Replace any address input like:
//     <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Service address" />
//   With:
//     <AddressAutocomplete value={address} onChange={setAddress} placeholder="Service address" style={yourStyle} />
//
// PREREQUISITES:
//   Add this script tag to index.html <head> (BEFORE the module script):
//     <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAMDTN_tRU_MIKTh29BHZvrWRdOaYHZc98&libraries=places" async defer></script>
//

import { useState, useRef, useEffect, useCallback } from "react";

export default function AddressAutocomplete({ value, onChange, placeholder, style, inputStyle }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");
  const inputRef = useRef(null);
  const serviceRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Initialize AutocompleteService
  useEffect(() => {
    const initService = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        serviceRef.current = new window.google.maps.places.AutocompleteService();
        sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
        return true;
      }
      return false;
    };

    if (!initService()) {
      // If Google Maps isn't loaded yet, poll for it
      const interval = setInterval(() => {
        if (initService()) clearInterval(interval);
      }, 500);
      return () => clearInterval(interval);
    }
  }, []);

  // Sync external value changes
  useEffect(() => {
    if (value !== undefined && value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const fetchSuggestions = useCallback((input) => {
    if (!serviceRef.current || !input || input.length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    serviceRef.current.getPlacePredictions(
      {
        input,
        sessionToken: sessionTokenRef.current,
        componentRestrictions: { country: "us" },
        types: ["address"],
        // Bias toward South Florida
        locationBias: {
          center: { lat: 25.9, lng: -80.2 },
          radius: 100000, // ~100km covers Miami-Dade, Broward, Palm Beach
        },
      },
      (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions.slice(0, 5));
          setShowDropdown(true);
        } else {
          setSuggestions([]);
          setShowDropdown(false);
        }
      }
    );
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);

    // Debounce API calls — 300ms
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 300);
  };

  const handleSelect = (prediction) => {
    const address = prediction.description;
    setInputValue(address);
    onChange(address);
    setSuggestions([]);
    setShowDropdown(false);

    // Reset session token after selection (per Google best practices)
    if (window.google && window.google.maps && window.google.maps.places) {
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <div ref={containerRef} style={{ position: "relative", ...style }}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => { if (suggestions.length > 0) setShowDropdown(true); }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || "Enter service address"}
        autoComplete="off"
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid rgba(148,163,184,0.2)",
          background: "rgba(11,17,32,0.8)",
          color: "#F8FAFC",
          fontSize: "14px",
          fontFamily: "'Outfit', 'Segoe UI', sans-serif",
          outline: "none",
          boxSizing: "border-box",
          ...inputStyle,
        }}
      />
      
      {showDropdown && suggestions.length > 0 && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          zIndex: 1000,
          marginTop: "4px",
          borderRadius: "10px",
          border: "1px solid rgba(244,114,182,0.2)",
          background: "#131B2E",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
          overflow: "hidden",
          maxHeight: "240px",
          overflowY: "auto",
        }}>
          {suggestions.map((prediction, i) => {
            // Split the description into main text and secondary text
            const main = prediction.structured_formatting?.main_text || "";
            const secondary = prediction.structured_formatting?.secondary_text || "";
            
            return (
              <button
                key={prediction.place_id}
                onClick={() => handleSelect(prediction)}
                onTouchEnd={(e) => { e.preventDefault(); handleSelect(prediction); }}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "none",
                  borderBottom: i < suggestions.length - 1 ? "1px solid rgba(148,163,184,0.08)" : "none",
                  background: "transparent",
                  color: "#F8FAFC",
                  fontSize: "13px",
                  fontFamily: "'Outfit', 'Segoe UI', sans-serif",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(244,114,182,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {/* Location pin icon */}
                <span style={{ color: "#F472B6", fontSize: "14px", marginTop: "1px", flexShrink: 0 }}>📍</span>
                <div>
                  <div style={{ fontWeight: 500, color: "#F8FAFC", lineHeight: 1.3 }}>{main}</div>
                  {secondary && (
                    <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>{secondary}</div>
                  )}
                </div>
              </button>
            );
          })}
          
          {/* Google attribution (required by TOS) */}
          <div style={{
            padding: "6px 14px",
            textAlign: "right",
            borderTop: "1px solid rgba(148,163,184,0.08)",
          }}>
            <img 
              src="https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-white3_hdpi.png" 
              alt="Powered by Google" 
              style={{ height: "12px", opacity: 0.4, filter: "invert(1)" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
