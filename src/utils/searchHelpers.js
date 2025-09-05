import { useState, useRef, useEffect } from "react";
import airportsData from "../data/allAirports.json";
import airlinesData from "../data/airlines.json";

// --- Helper Function to Filter Airports ---
export const filterAirports = (input) => {
  if (!input.trim()) return airportsData.airports.slice(0, 10);
  const lowerInput = input.toLowerCase();
  const scoredAirports = airportsData.airports.map((airport) => {
    let score = 0;
    if (airport.code.toLowerCase() === lowerInput) score += 1000;
    else if (airport.code.toLowerCase().startsWith(lowerInput)) score += 500;
    if (airport.city.toLowerCase().startsWith(lowerInput)) score += 150;
    airport.searchTerms.forEach((term) => {
      if (term.toLowerCase().startsWith(lowerInput)) score += 100;
    });
    return { ...airport, score };
  });
  return scoredAirports.filter((a) => a.score > 0).sort((a, b) => b.score - a.score).slice(0, 8);
};

// --- Helper Function to Filter Airlines ---
export const filterAirlines = (input) => {
  if (!input.trim()) return airlinesData.airlines.slice(0, 10);
  const lowerInput = input.toLowerCase();
  const scoredAirlines = airlinesData.airlines.map((airline) => {
    let score = 0;
    if (airline.code.toLowerCase() === lowerInput) score += 1000;
    else if (airline.code.toLowerCase().startsWith(lowerInput)) score += 500;
    if (airline.name.toLowerCase().startsWith(lowerInput)) score += 150;
    airline.searchTerms.forEach((term) => {
      if (term.toLowerCase().startsWith(lowerInput)) score += 100;
    });
    return { ...airline, score };
  });
  return scoredAirlines.filter((a) => a.score > 0).sort((a, b) => b.score - a.score).slice(0, 8);
};

// --- Custom Hook for Autocomplete Logic ---
export const useAutocomplete = (filterFunction, onSelect) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setSuggestions(filterFunction(value));
    setShowDropdown(true);
    setFocusedIndex(-1);
  };

  const handleSelectSuggestion = (suggestion) => {
    onSelect(suggestion); // Call the provided onSelect function
    setShowDropdown(false);
    setSuggestions([]);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && focusedIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[focusedIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setFocusedIndex(-1);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return {
    input,
    setInput,
    suggestions,
    showDropdown,
    setShowDropdown,
    focusedIndex,
    dropdownRef,
    handleInputChange,
    handleSelectSuggestion,
    handleKeyDown,
  };
};

// --- Helper Function to Map Cabin Class ---
export const mapCabinClassToCode = (cabinClass) => {
  const mapping = {
    "Economy/Coach": "E",
    "Business Class": "B",
    "First Class": "F",
    "Premium": "P",
    "All Class Cabin": "E",
  };
  return mapping[cabinClass] || "E";
};