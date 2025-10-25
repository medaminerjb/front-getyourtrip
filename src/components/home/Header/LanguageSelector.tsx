import React, { useState,useRef,useEffect } from "react";
import "./LanguageSelector.css";

interface Language {
  code: string;
  name: string;
  flag: string; // path to flag image
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "/img/flags/en.webp" },
  { code: "fr", name: "Français", flag: "/img/flags/fr.webp" },
  { code: "ar", name: "Portugais", flag: "/img/flags/pt.webp" },
  // add more languages if needed
];

const LanguageSelector: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Language>(languages[0]);
  const [open, setOpen] = useState(false);
   const dropdownRef = useRef<HTMLLIElement>(null);
    // Close dropdown when clicking outside
   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleSelect = (lang: Language) => {
    setCurrentLang(lang);
    setOpen(false);
    // You can trigger language change here (e.g. i18n.changeLanguage(lang.code))
  };

  return (
    <li className="language-selector d-lg-flex d-none position-relative" ref={dropdownRef}>
      <button
        type="button"
        className="language-btn d-flex align-items-center"
        onClick={() => setOpen(!open)}
      >
        <img
          src={currentLang.flag}
          alt={`Flag of ${currentLang.name}`}
          width="24"
          height="24"
          className="me-2"
        />
      </button>

      {open && (
        <ul className="sub-menu-language" id="language-list" >
          {languages.map((lang) => (
            <li key={lang.code}>
              <a
                type="button"
                onClick={() => handleSelect(lang)}
                className="language-option d-flex align-items-center"
              >
                <img
                  src={lang.flag}
                  alt={`Flag of ${lang.name}`}
                  width="24"
                  height="24"
                  className="me-2"
                />
                {lang.name}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default LanguageSelector;
