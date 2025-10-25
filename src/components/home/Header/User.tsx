import React, { useState,useRef,useEffect } from "react";
import "./UserPanel.css";

interface UserPanelProps {
  OpenModelSignIn?: () => void;
}

const UserPanel: React.FC<UserPanelProps> = ({OpenModelSignIn}) => {
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
  const OpenSignin =()=>{
    OpenModelSignIn?.()
    setOpen(false);
  }

  return (
    <li ref={dropdownRef} className="user-panel d-lg-flex d-none position-relative">
      <button
        type="button"
        className="user-btn d-flex align-items-center"
        onClick={() => setOpen(!open)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                            <path
                                d="M26 13.5C26 20.4036 20.4035 26 13.5 26C6.59632 26 1 20.4036 1 13.5C1 6.59632 6.59632 1 13.5 1C20.4035 1 26 6.59632 26 13.5Z"
                                stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                                d="M18.5001 11.8333C18.5001 14.5947 16.2616 16.8333 13.5001 16.8333C10.7384 16.8333 8.5 14.5947 8.5 11.8333C8.5 9.07189 10.7384 6.8333 13.5001 6.8333C16.2616 6.8333 18.5001 9.07189 18.5001 11.8333Z"
                                stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                                d="M6.04297 23.5324C6.44287 19.7667 9.62917 16.8333 13.5008 16.8333C17.3725 16.8333 20.5588 19.7669 20.9585 23.5325"
                                stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
      </button>

      {open && (
          <ul className="user-dropdown shadow">
          <li  >
            <span className="profile-div">Profil</span>
          </li>
        {true &&(
            <>
          <li className="item">
            <a className="dropdown-item" onClick={()=>OpenSignin()}>
              <i className="bi bi-person"></i> Log in or sign up
            </a>
          </li>
          <hr/>
             <li className="item">
            <a href="/profile" className="dropdown-item">
              <i className="bi bi-person"></i> My Profile
            </a>
          </li>
          </>
          )}
          {false && (
          <>
          <li className="item">
            <a href="/profile" className="dropdown-item">
              <i className="bi bi-person"></i> My Profile
            </a>
          </li>
          <li className="item">
            <a href="/bookings" className="dropdown-item">
              <i className="bi bi-calendar-check"></i> My Bookings
            </a>
          </li>
          <li className="item">
            <a href="/favorites" className="dropdown-item">
              <i className="bi bi-heart"></i> Favorites
            </a>
          </li>
          <li className="item"> 
            <a href="/settings" className="dropdown-item">
              <i className="bi bi-gear"></i> Settings
            </a>
          </li>
        </>
    )}
    </ul>
        
      )}
    </li>
  );
};

export default UserPanel;
