import React from 'react';
import './SearchBar.css';

// REUSABLE COMPONENT: SearchBar
// Used in: Landing Page Hero + Property Details Header

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search by city, area, or project name…',
}) => {
  return (
    <form className="search-bar" onSubmit={onSubmit}>
      {/* Input placeholder: "Search by city, area, project…" */}
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      
      {/* Search button */}
      <button type="submit" className="search-bar-button">
        🔍 Search
      </button>
    </form>
  );
};

export default SearchBar;
