import React, { useState, useRef, useEffect } from "react";

interface Option {
  id: string | number;
  label: string;
}

interface DropdownProps {
  options: Option[];
  placeholder?: string;
  onSelect?: (option: Option) => void;
}

const BootstrapDropdown: React.FC<DropdownProps> = ({
  options,
  placeholder = "Select destination...",
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    setSelected(option);
    setIsOpen(false);
    if (onSelect) onSelect(option);
  };

  return (
    <div ref={dropdownRef} className="position-relative w-100" style={{ maxWidth: 300 }}>
      <div
        className="form-control d-flex justify-content-between align-items-center"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer" }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <i className="bi bi-caret-down-fill text-muted"></i>
      </div>

      {isOpen && (
        <div
          className="dropdown-menu show w-100 p-2 border mt-1 shadow-sm"
          style={{ maxHeight: 250, overflowY: "auto" }}
        >
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <button
                key={opt.id}
                className="dropdown-item text-start"
                type="button"
                onClick={() => handleSelect(opt)}
              >
                {opt.label}
              </button>
            ))
          ) : (
            <div className="dropdown-item text-muted">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default BootstrapDropdown;
