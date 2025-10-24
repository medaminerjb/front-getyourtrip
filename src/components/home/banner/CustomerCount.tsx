import "react-datepicker/dist/react-datepicker.css";
import "./test.css"; // custom styling (below)
import React, { useEffect, useRef, useState } from "react";
interface CountGuest {
    adultCount:number;
    childCount:number;
}
interface GuestBoxProps{
    onCount?: (option: CountGuest) => void;
}
const SearchGuestBox: React.FC<GuestBoxProps> = ({ onCount }) => {

const [activeTab, setActiveTab] = useState(false);
 const dropdownRef = useRef<HTMLDivElement>(null);
   const [adultCount, setAdultCount] = useState<number>(1);
  const [childCount, setChildCount] = useState<number>(0);
const handleIncrement = (type: "adult" | "child") => {
  if (type === "adult") {
    setAdultCount((prev) => {
      const newAdult = prev + 1;
      onCount?.({ adultCount: newAdult, childCount });
      return newAdult;
    });
  } else {
    setChildCount((prev) => {
      const newChild = prev + 1;
      onCount?.({ adultCount, childCount: newChild });
      return newChild;
    });
  }
};

const handleDecrement = (type: "adult" | "child") => {
  if (type === "adult") {
    setAdultCount((prev) => {
      const newAdult = Math.max(0, prev - 1);
      onCount?.({ adultCount: newAdult, childCount });
      return newAdult;
    });
  } else {
    setChildCount((prev) => {
      const newChild = Math.max(0, prev - 1);
      onCount?.({ adultCount, childCount: newChild });
      return newChild;
    });
  }
};

 useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveTab(false);
      }
    };
    

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
    const toggleDropdown = () => {
    setActiveTab((prev) => !prev);
  };

  return (
       <div className="single-search-box">
                                                        <div className="icon">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27">
                                                                <g clip-path="url(#clip0_273_1754)">
                                                                    <path
                                                                        d="M13.3207 14.07C13.4615 14.163 13.6265 14.2126 13.7952 14.2127C14.0765 14.2127 14.3521 14.0761 14.5173 13.8238C14.7799 13.4251 14.6699 12.8893 14.2712 12.6268C12.4344 11.4175 11.4549 10.0781 11.189 8.413C11.0664 7.63051 11.2293 6.44276 11.8788 5.68373C12.3 5.19189 12.8555 4.95227 13.5776 4.95227C14.9937 4.95227 15.5731 5.95799 15.7926 6.55698C16.3228 8.00211 15.8852 9.80108 14.7761 10.7403C14.4116 11.0492 14.3666 11.5944 14.6745 11.958C14.9834 12.323 15.5281 12.3679 15.8922 12.0596C17.5541 10.6528 18.1943 8.0887 17.415 5.96263C16.787 4.2484 15.3522 3.22491 13.5775 3.22491C12.3552 3.22491 11.3134 3.6868 10.5651 4.56052C9.4864 5.82268 9.30716 7.56876 9.48218 8.68299C9.93995 11.5476 11.8924 13.1293 13.3207 14.07Z"/>
                                                                    <path
                                                                        d="M20.1255 22.0477H7.78708C7.81845 18.178 8.05759 17.0286 8.16475 16.7076C8.40062 16.0014 9.36979 15.275 10.2183 14.8006C10.9848 16.008 12.2021 16.7277 13.555 16.7277H13.5555C14.893 16.7272 16.0999 16.008 16.8628 14.801C17.7112 15.2756 18.679 16.0019 18.9144 16.7072C19.2186 17.6211 19.2013 18.9062 19.1873 19.9386C19.1845 20.1506 19.1816 20.3528 19.1816 20.5404C19.1816 21.0178 19.5682 21.4044 20.0455 21.4044C20.5229 21.4044 20.9095 21.0178 20.9095 20.5404C20.9095 20.3603 20.9123 20.166 20.915 19.962C20.9314 18.7991 20.9515 17.3521 20.5538 16.1601C19.9014 14.2048 17.1333 12.9862 16.8197 12.8538C16.714 12.8088 16.6003 12.7854 16.4853 12.7851C16.3704 12.7848 16.2565 12.8075 16.1505 12.8519C16.0445 12.8962 15.9485 12.9613 15.8679 13.0431C15.7873 13.125 15.7238 13.2221 15.6811 13.3287C15.2628 14.3747 14.4681 14.9995 13.5555 14.9995H13.5551C12.6378 14.9995 11.8123 14.3592 11.3995 13.3287C11.3568 13.2221 11.2933 13.125 11.2128 13.0431C11.1322 12.9613 11.0361 12.8963 10.9301 12.8519C10.8241 12.8076 10.7103 12.7849 10.5953 12.7853C10.4804 12.7856 10.3667 12.8089 10.2609 12.8538C9.94784 12.9862 7.17923 14.2044 6.52593 16.1606C6.21422 17.0965 6.05655 19.3681 6.05655 22.9113C6.05655 23.3886 6.44313 23.7752 6.92047 23.7752H20.1261C20.603 23.7752 20.9896 23.3891 20.9896 22.9118C20.9895 22.4343 20.6029 22.0477 20.1255 22.0477ZM5.3695 13.815C4.171 13.815 3.19618 12.5608 3.19618 11.0197C3.19618 9.48001 4.171 8.22724 5.3695 8.22724C5.98304 8.22724 6.59094 8.58197 6.95596 9.15243C7.22315 9.57034 7.58495 10.459 7.00463 11.7166C6.80478 12.1499 6.99387 12.6628 7.42723 12.8631C7.86106 13.0625 8.37352 12.8739 8.57332 12.4405C9.24909 10.9762 9.18966 9.43888 8.41048 8.22118C7.72069 7.14343 6.58393 6.49993 5.36903 6.49993C3.21817 6.49993 1.46835 8.52724 1.46835 11.0197C1.46835 13.5136 3.21817 15.5423 5.36903 15.5423C5.84636 15.5423 6.23342 15.1562 6.23342 14.6789C6.23337 14.2015 5.84684 13.815 5.3695 13.815ZM4.27767 21.2255H1.75991C1.7983 20.3701 1.87597 19.0981 2.01682 18.3503C2.19933 17.374 2.72444 16.8232 3.13296 16.533C3.52281 16.2569 3.61404 15.7178 3.33745 15.3289C3.06135 14.939 2.52268 14.8473 2.13331 15.1244C1.58578 15.5128 0.621729 16.4076 0.318939 18.0315C0.0680901 19.3639 0.00307088 21.9584 0.000223323 22.0679C-0.00239217 22.1831 0.0179889 22.2976 0.060174 22.4048C0.102359 22.512 0.165501 22.6097 0.245904 22.6922C0.326391 22.7746 0.422553 22.8401 0.528728 22.8848C0.634904 22.9294 0.748946 22.9524 0.86414 22.9524H4.27762C4.75496 22.9524 5.14154 22.5667 5.14154 22.0894C5.14159 21.6121 4.75501 21.2255 4.27767 21.2255ZM25.5327 11.0187C25.5327 8.52623 23.7829 6.49893 21.632 6.49893C20.4166 6.49893 19.2794 7.14195 18.5892 8.2197C17.81 9.43692 17.7501 10.9747 18.4249 12.439C18.6248 12.8719 19.1381 13.0619 19.571 12.8621C20.0039 12.6623 20.1939 12.1494 19.9941 11.716C19.4138 10.4581 19.7764 9.56986 20.0437 9.15191C20.4092 8.58144 21.0171 8.22671 21.6316 8.22671C22.8301 8.22671 23.8049 9.47953 23.8049 11.0192C23.8049 12.5602 22.8301 13.8145 21.6316 13.8145C21.1542 13.8145 20.7677 14.201 20.7677 14.6784C20.7677 15.1557 21.1542 15.5423 21.6316 15.5423C23.7819 15.5423 25.5322 13.5136 25.5327 11.0187ZM26.6811 18.0334C26.39 16.4624 25.4746 15.5769 24.9552 15.1894C24.5728 14.9049 24.0313 14.9825 23.7459 15.3649C23.4609 15.7473 23.5395 16.2892 23.9214 16.5742C24.3093 16.8634 24.8078 17.4053 24.9828 18.3511C25.1236 19.098 25.2013 20.3695 25.2397 21.2245H22.7215C22.2441 21.2245 21.8575 21.6111 21.8575 22.0885C21.8575 22.5658 22.2441 22.9524 22.7215 22.9524H26.1359C26.3685 22.9524 26.5912 22.8588 26.7545 22.6917C26.8349 22.6092 26.8979 22.5115 26.94 22.4043C26.9821 22.2971 27.0024 22.1826 26.9997 22.0674C26.997 21.9579 26.9324 19.3629 26.6811 18.0334Z"/>
                                                                </g>
                                                            </svg>
                                                        </div>
                                                        <div className={`searchbox-input ${activeTab ? "active" : ""}`} ref={dropdownRef}>
                                                            <label>Guest</label>
                                                            <div className="custom-select-dropdown style-2">
                                                                <div className="select-input two"  onClick={toggleDropdown}>
                                                                    <h6><span id="adult-qty">{adultCount}</span> Adults, <span id="child-qty">{childCount}</span> Child</h6>
                                                                    <i className="bi bi-chevron-down"></i>
                                                                </div>
                                                                <div className={`custom-select-wrap two no-scroll ${activeTab ? "active" : ""}`}>
                                                                    <ul className="guest-count">
                                                                        <li className="single-item">
                                                                            <div className="title">
                                                                                <h6>Adult</h6>
                                                                                <span>17 years+</span>
                                                                            </div>
                                                                            <div className="quantity-counter">
                                                                                <a type="button" data-type="adult" className="guest-quantity__minus"   onClick={() => handleDecrement("adult")}><i className="bi bi-dash"></i></a>
                                                                                <input name="adult_quantity" type="text" className="quantity__input"
                                                                                    value={adultCount}/>
                                                                                <a type="button" data-type="adult" className="guest-quantity__plus"   onClick={() => handleIncrement("adult")}><i className="bi bi-plus"></i></a>
                                                                            </div>
                                                                        </li>
                                                                        <li className="single-item">
                                                                            <div className="title">
                                                                                <h6>Children</h6>
                                                                                <span>0-17 years</span>
                                                                            </div>
                                                                            <div className="quantity-counter">
                                                                                <a type="button" data-type="child" className="guest-quantity__minus"   onClick={() => handleDecrement("child")}><i className="bi bi-dash"></i></a>
                                                                                <input name="child_quantity" type="text" className="quantity__input"
                                                                                    value={childCount}/>
                                                                                <a type="button" data-type="child" className="guest-quantity__plus"   onClick={() => handleIncrement("child")}><i className="bi bi-plus"></i></a>
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
  );
}


export default SearchGuestBox;