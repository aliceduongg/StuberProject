import React, { useState } from "react";

const RADAR_API_KEY = "prj_test_pk_6436e86c8ca5f1cd5f64adc3c6a8dc281209db29"; // Test Publishable key

export const fetchSuggestions = async (input: string): Promise<any[]> => {
  if (input.length < 3) {
    return []; // Clear results for short input
  }

  try {
    const response = await fetch(
      `https://api.radar.io/v1/search/autocomplete?query=${input}`,
      {
        method: "GET",
        headers: {
          Authorization: RADAR_API_KEY,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      return data.addresses || [];
    } else {
      console.error("Error fetching suggestions:", response.statusText);
      return [];
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
};

interface AutocompleteProps {
  onSelect?: (destination: string) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ onSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleInputChange = async (text: string) => {
    setQuery(text);
    const suggestions = await fetchSuggestions(text);
    setResults(suggestions);
  };

  const handleSelect = (item: any) => {
    const selectedDestination = item.formattedAddress;
    setQuery(selectedDestination);
    setResults([]);

    // If an onSelect prop is provided (from parent component), call it
    if (onSelect) {
      onSelect(selectedDestination);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        className="w-full border border-gray-300 rounded-full p-2 mb-2 z-10 relative bg-white text-black"
        placeholder="Search for a place..."
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
      />
      {results.length > 0 && (
        <ul className="absolute top-full left-0 w-full border border-gray-300 rounded-md max-h-60 overflow-y-auto bg-white shadow-lg z-20">
          {results.map((item) => (
            <li
              key={`${item.formattedAddress}-${item.latitude}-${item.longitude}`}
              className="p-2 hover:bg-neutral-100 cursor-pointer border-b last:border-b-0 border-gray-200 text-black bg-white"
              onClick={() => handleSelect(item)}
            >
              {item.formattedAddress}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
