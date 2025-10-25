import React, { useEffect, useRef, useState } from "react";

interface Location {
  id: string | number;
  City: string;
  Name: string;
  Count: number;
}
interface Airport {
  id: string | number;
  City: string;
  Name: string;
  Count: number;
}
interface LocationsProps {
  onSelect?: (option: Location) => void;
}

const locations = [
  { id: 1, City: "Tunisie", Name: "tunis", Count: 50 },
  { id: 2, City: "Tunisie", Name: "tunis1", Count: 50 },
  { id: 3, City: "Tunisie", Name: "tunis2", Count: 50 },
  { id: 4, City: "Tunisie", Name: "tunis3", Count: 50 },
  { id: 5, City: "Tunisie", Name: "tunis4", Count: 50 },
];

const SearchLocation: React.FC<LocationsProps> = ({ onSelect }) => {
  const [activeTab, setActiveTab] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Location | Airport>();
  
  // Filter locations based on search
  const filteredOptions = locations.filter((loc) =>
    loc.Name.toLowerCase().includes(search.toLowerCase())
);

const dropdownRef = useRef<HTMLDivElement>(null);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveTab(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setActiveTab((prev) => !prev);
    setSearch("");
  };

  const handleSelect = (option: Location) => {
    setSelected(option);
    setActiveTab(false);
    setSearch("");
    onSelect?.(option);
  };

  return (
     <div className="single-search-box">
                                                        <div className="icon">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27"
                                                                viewBox="0 0 27 27">
                                                                <path
                                                                    d="M18.0075 17.8392C20.8807 13.3308 20.5195 13.8933 20.6023 13.7757C21.6483 12.3003 22.2012 10.5639 22.2012 8.75391C22.2012 3.95402 18.3062 0 13.5 0C8.7095 0 4.79883 3.94622 4.79883 8.75391C4.79883 10.5627 5.3633 12.3446 6.44361 13.8399L8.99237 17.8393C6.26732 18.2581 1.63477 19.506 1.63477 22.2539C1.63477 23.2556 2.28857 24.6831 5.40327 25.7955C7.57814 26.5722 10.4536 27 13.5 27C19.1966 27 25.3652 25.3931 25.3652 22.2539C25.3652 19.5055 20.7381 18.2589 18.0075 17.8392ZM7.76508 12.9698C7.75639 12.9562 7.7473 12.9428 7.73782 12.9298C6.83886 11.6931 6.38086 10.2274 6.38086 8.75391C6.38086 4.79788 9.56633 1.58203 13.5 1.58203C17.4255 1.58203 20.6191 4.7993 20.6191 8.75391C20.6191 10.2297 20.1698 11.6457 19.3195 12.8498C19.2432 12.9503 19.6408 12.3327 13.5 21.9686L7.76508 12.9698ZM13.5 25.418C7.27766 25.418 3.2168 23.589 3.2168 22.2539C3.2168 21.3566 5.30339 19.8811 9.92714 19.306L12.8329 23.8656C12.9044 23.9777 13.0029 24.0701 13.1195 24.134C13.2361 24.198 13.367 24.2315 13.4999 24.2315C13.6329 24.2315 13.7638 24.198 13.8804 24.134C13.9969 24.0701 14.0955 23.9777 14.167 23.8656L17.0727 19.306C21.6966 19.8811 23.7832 21.3566 23.7832 22.2539C23.7832 23.5776 19.7589 25.418 13.5 25.418Z" />
                                                                <path
                                                                    d="M13.5 4.79883C11.3192 4.79883 9.54492 6.57308 9.54492 8.75391C9.54492 10.9347 11.3192 12.709 13.5 12.709C15.6808 12.709 17.4551 10.9347 17.4551 8.75391C17.4551 6.57308 15.6808 4.79883 13.5 4.79883ZM13.5 11.127C12.1915 11.127 11.127 10.0624 11.127 8.75391C11.127 7.44541 12.1915 6.38086 13.5 6.38086C14.8085 6.38086 15.873 7.44541 15.873 8.75391C15.873 10.0624 14.8085 11.127 13.5 11.127Z" />
                                                            </svg>
                                                        </div>
    <div className={`searchbox-input ${activeTab ? "active" : ""}`} ref={dropdownRef}>
      <label>Destination</label>
      <div className="custom-select-dropdown style-2">
        <div className="select-input" onClick={toggleDropdown}>
          <input type="text" readOnly value={selected?.Name || "All"} />
          <i className="bi bi-chevron-down"></i>
        </div>

        <div className={`custom-select-wrap ${activeTab ? "active" : ""}`}>
          <div className="custom-select-search-area">
            <i className="bx bx-search"></i>
            <input
              type="text"
              value={search}
              placeholder="Type Your Destination"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <ul className="option-list">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li key={opt.id} onClick={() => handleSelect(opt)}>
                  <div className="destination">
                    <h6>{opt.City}</h6>
                    <p>{opt.Name}</p>
                  </div>
                  <div className="tour">
                    <span>
                      {opt.Count} <br /> Tour
                    </span>
                  </div>
                </li>
              ))
            ) : (
              <li>
                <div className="destination">
                  <h6>No Name Found</h6>
                </div>
                <div className="tour"></div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
      </div>
  );
};

export default SearchLocation;
