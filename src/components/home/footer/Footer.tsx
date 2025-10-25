import React from "react";
import { Link } from "react-router-dom";

interface Menu {
    Name : string;
    Url : string;
}
const menu: Menu[] = [
  { Name: "Home", Url: "/home" },
  { Name: "Trip", Url: "/trip" },
  { Name: "Transfer", Url: "/transfer" },
  { Name: "Tour's Guide", Url: "/tours-guide" },
  { Name: "Contact Us", Url: "/contact" },
];
const Footer:React.FC = () => {
    return(
         <footer className="footer-section">
        <div className="container">
            <div className="footer-top">
                <div className="row g-lg-4 gy-5 justify-content-center">
                    <div className="col-lg-3 col-md-6 col-sm-6">
                        <div className="footer-widget">
                            <div className="footer-logo">
                                <a href="index.html"><img src="assets/img/logo2.svg" alt=""/></a>
                            </div>
                            <h3>Want <span>to Take </span> Tour Packages<span>?</span></h3>
                            <a href="package-grid.html" className="primary-btn1">Book A Tour</a>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6 d-flex justify-content-lg-center justify-content-sm-start">
                        <div className="footer-widget">
                            <div className="widget-title">
                                <h5>Quick Link</h5>
                            </div>
                            <ul className="widget-list">
                                   {menu.map((item, index) => {
                                              return (
                                                <li key={index}>
                                                  <Link
                                                    className={`nav-link active`}
                                                    to={item.Url}
                                                  >
                                                    {item.Name}
                                                  </Link>
                                                </li>
                                              );
                                            })}
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6 d-flex justify-content-lg-center justify-content-md-start">
                        <div className="footer-widget">
                            <div className="widget-title">
                                <h5>Destination</h5>
                            </div>
                            <ul className="widget-list">
                                <li><a href="destination1.html">Egypt Tour </a></li>
                                <li><a href="destination1.html">New York Tour</a></li>
                                <li><a href="destination1.html">Indonesia Tour</a></li>
                                <li><a href="destination1.html">Nepal Tour</a></li>
                                <li><a href="destination1.html">Saudi Arab Tour</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6 col-sm-6 d-flex justify-content-lg-end justify-content-sm-end">
                        <div className="footer-widget">
                            <div className="single-contact mb-40">
                                <div className="widget-title">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                        <g clip-path="url(#clip0_1137_183)">
                                            <path
                                                d="M14.3281 3.08241C13.2357 1.19719 11.2954 0.0454395 9.13767 0.00142383C9.04556 -0.000474609 8.95285 -0.000474609 8.86071 0.00142383C6.70303 0.0454395 4.76268 1.19719 3.67024 3.08241C2.5536 5.0094 2.52305 7.32408 3.5885 9.27424L8.05204 17.4441C8.05405 17.4477 8.05605 17.4513 8.05812 17.4549C8.25451 17.7963 8.60632 18 8.99926 18C9.39216 18 9.74397 17.7962 9.94032 17.4549C9.94239 17.4513 9.9444 17.4477 9.9464 17.4441L14.4099 9.27424C15.4753 7.32408 15.4448 5.0094 14.3281 3.08241ZM8.99919 8.15627C7.60345 8.15627 6.46794 7.02076 6.46794 5.62502C6.46794 4.22928 7.60345 3.09377 8.99919 3.09377C10.3949 3.09377 11.5304 4.22928 11.5304 5.62502C11.5304 7.02076 10.395 8.15627 8.99919 8.15627Z"/>
                                        </g>
                                    </svg>
                                    <h5>Address</h5>
                                </div>
                                <a href="https://www.google.com/maps/place/Egens+Lab/@23.8340712,90.3631117,17z/data=!3m1!4b1!4m6!3m5!1s0x3755c14c8682a473:0xa6c74743d52adb88!8m2!3d23.8340663!4d90.3656866!16s%2Fg%2F11rs9vlwsk?entry=ttu">House 168/170, Avenue 01, Mirpur DOHS, Dhaka Bangladesh</a>
                            </div>
                            <div className="payment-partner">
                                <div className="widget-title">
                                    <h5>Payment Partner</h5>
                                </div>
                                <div className="icons">
                                    <ul>
                                        <li><img src="assets/img/home1/icon/visa-logo.svg" alt=""/></li>
                                        <li><img src="assets/img/home1/icon/stripe-logo.svg" alt=""/></li>
                                        <li><img src="assets/img/home1/icon/paypal-logo.svg" alt=""/></li>
                                        <li><img src="assets/img/home1/icon/woo-logo.svg" alt=""/></li>
                                        <li><img src="assets/img/home1/icon/skrill-logo.svg" alt=""/></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="row">
                    <div className="col-lg-12 d-flex flex-md-row flex-column align-items-center justify-content-md-between justify-content-center flex-wrap gap-3">
                        <ul className="social-list">
                            <li>
                                <a href="https://www.facebook.com/"><i className="bx bxl-facebook"></i></a>
                            </li>
                            <li>
                                <a href="https://twitter.com/"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/>
                                  </svg></a>
                            </li>
                            <li>
                                <a href="https://www.pinterest.com/"><i className="bx bxl-pinterest-alt"></i></a>
                            </li>
                            <li>
                                <a href="https://www.instagram.com/"><i className="bx bxl-instagram"></i></a>
                            </li>
                        </ul>
                        <p>©Copyright 2024 TripRex | Design By <a href="https://www.egenslab.com/">Egens Lab</a></p> 
                        <div className="footer-right">
                            <ul>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms & Condition</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    );
}
export default Footer;