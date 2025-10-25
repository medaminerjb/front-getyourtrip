import React, { useState } from "react";
import { Range } from "react-range";
import { Button } from "react-bootstrap";

interface DestinationGroup {
  destination: string;
  total: number;
}

interface DurationGroup {
  days_count?: number;
  hours_count?: number;
}

const TripFiltersSidebar: React.FC = () => {
  // 🔹 Mocked data (you can later fetch from API)
  const destinations: DestinationGroup[] = [
    { destination: "Djerba", total: 12 },
    { destination: "Tunis", total: 8 },
    { destination: "Sousse", total: 5 },
  ];
 const handleApply = () => {
    console.log("Price range:", values);
  };
  const durations: DurationGroup[] = [
    { days_count: 3 },
    { days_count: 7 },
    { hours_count: 6 },
  ];
 const MIN = 0;
  const MAX = 1000;

  const [values, setValues] = useState<number[]>([100, 700]);
  // 🔹 Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 1000]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [selectedDurations, setSelectedDurations] = useState<string[]>([]);

  const handleDestinationChange = (value: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleDurationChange = (value: string) => {
    setSelectedDurations((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleApplyFilters = () => {
    console.log("Filters applied:", {
      priceRange,
      selectedDestinations,
      selectedDurations,
    });
  };

  return (
    <div className="col-lg-4">
         <style>
        {`
          

          .trip_filterd_checked:checked {
            background-color: green;
          }
        `}
      </style>
      <div className="sidebar-area">
        {/* 💰 Price Filter */}
        <div className="single-widget mb-4">
          <h5 className="shop-widget-title">Price Filter</h5>
             <div className="range-wrap">
        <Range
          step={10}
          min={MIN}
          max={MAX}
        
          values={values}
          onChange={(vals) => setValues(vals)}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "6px",
                width: "100%",
                color:"green",
                background: `linear-gradient(to right, #ddd ${((values[0] - MIN) / (MAX - MIN)) * 100}%, green ${((values[0] - MIN) / (MAX - MIN)) * 100}%, green ${((values[1] - MIN) / (MAX - MIN)) * 100}%, #ddd ${((values[1] - MIN) / (MAX - MIN)) * 100}%)`,
                borderRadius: "3px",
              }}
            >
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: "18px",
                width: "18px",
                color:"green",
                backgroundColor: "green",
                borderRadius: "50%",
              }}
            />
          )}
        />

        <div className="d-flex justify-content-between mt-2">
          <span>${values[0]}</span>
          <span>${values[1]}</span>
        </div>

        <div className="text-center mt-3">
          <Button variant="primary" style={{ backgroundColor: "green", borderColor: "green" }} className="filterprice" color="green" size="sm" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </div>
        </div>

        {/* 📍 Destination Filter */}
        <div className="single-widget mb-4">
          <h5 className="widget-title">Destination</h5>
          <ul className="list-unstyled">
            {destinations.map((trip) => (
              <li key={trip.destination} className="form-check">
                <input
                  className="form-check-input trip_filterd_checked"
                  type="checkbox"
                  id={`dest-${trip.destination}`}
                  value={trip.destination}
                   style={{
    accentColor: "green", // ✅ makes checkbox green when checked
  }}
                  checked={selectedDestinations.includes(trip.destination)}
                  onChange={() => handleDestinationChange(trip.destination)}
                />
                <label
                  htmlFor={`dest-${trip.destination}`}
                  className="form-check-label d-flex justify-content-between w-100"
                >
                  <span>{trip.destination}</span>
                  <span>({trip.total})</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* ⏱ Duration Filter */}
        <div className="single-widget mb-4">
          <h5 className="widget-title">Durations</h5>
          <ul className="list-unstyled">
            {durations.map((trip, index) => {
              const label = trip.days_count
                ? `${trip.days_count} Days Tour`
                : `${trip.hours_count} Hours Tour`;
              const value = trip.days_count
                ? `${trip.days_count}-days`
                : `${trip.hours_count}-hours`;
              return (
                <li key={index} className="form-check">
                  <input
                    className="form-check-input trip_filterd_checked"
                    type="checkbox"
                    id={`dur-${index}`}
                    value={value}
                    checked={selectedDurations.includes(value)}
                    onChange={() => handleDurationChange(value)}
                  />
                  <label htmlFor={`dur-${index}`} className="form-check-label">
                    {label}
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TripFiltersSidebar;
