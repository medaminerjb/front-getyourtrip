import React from "react";
import { Link } from "react-router-dom";
// import images from public folder or assets

const AboutSection: React.FC = () => {
  return (
    <div className="home2-about-section pt-120 mb-120">
      <div className="container">
        <div className="row mb-90">
          <div className="col-lg-6">
            <div className="about-content">
              <div className="section-title2 mb-30">
                <div className="eg-section-tag">
                  <span>About Us</span>
                </div>
                <h2>Discover Unforgettable Travel Experiences</h2>
                <p>
                  At GetYourTrip, we specialize in curating exceptional travel
                  experiences, ensuring every journey is seamless, exciting, and
                  tailored to your preferences. Whether you're looking for
                  guided tours, adventure-packed itineraries, or relaxing
                  getaways, we provide top-notch tour facilities, expert
                  recommendations, and personalized support.
                  <br />
                  With a commitment to quality, safety, and customer
                  satisfaction, we make travel stress-free and memorable. Explore
                  the world with confidence—your next great adventure starts
                  here!
                </p>
              </div>

              <div className="row g-4 mb-50">
                <div className="col-md-6">
                  <div className="facility-card">
                    <div className="icon">
                      <img src="/img/home2/icon/facility-card-icon1.svg" alt="Safety first" width={26} height={26} />
                    </div>
                    <div className="content">
                      <h6>
                        Safety first
                        <br />
                        always
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="facility-card two">
                    <div className="icon">
                      <img src="/img/home2/icon/facility-card-icon2.svg" alt="Trusted travel guide" width={26} height={26} />
                    </div>
                    <div className="content">
                      <h6>
                        Trusted travel
                        <br />
                        guide
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="facility-card two">
                    <div className="icon">
                      <img src="/img/home2/icon/facility-card-icon3.svg" alt="Expertise and Experience" width={26} height={26} />
                    </div>
                    <div className="content">
                      <h6>
                        Expertise and
                        <br />
                        Experience
                      </h6>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="facility-card">
                    <div className="icon">
                      <img src="/img/home2/icon/facility-card-icon3.svg" alt="Expertise and Experience" width={26} height={26} />
                    </div>
                    <div className="content">
                      <h6>
                        Expertise and
                        <br />
                        Experience
                      </h6>
                    </div>
                  </div>
                </div>
              </div>

              <div className="content-bottom-area">
                <Link to="/trips" className="primary-btn3">
                  Find Out More
                </Link>
                <a
                  data-fancybox="popup-video"
                  href="https://www.youtube.com/watch?v=MLpWrANjFbI"
                  className="video-area"
                >
                  <div className="icon">
                    <svg
                      className="video-circle"
                      xmlns="http://www.w3.org/2000/svg"
                      width="51px"
                      viewBox="0 0 206 206"
                       enableBackground="new 0 0 206 206" 
                    >
                      <circle className="circle" cx="103" cy="103" r="100"></circle>
                      <path
                        className="circle-half top-half"
                        d="M16.4,53C44,5.2,105.2-11.2,153,16.4s64.2,88.8,36.6,136.6"
                      ></path>
                      <path
                        className="circle-half bottom-half"
                        d="M189.6,153C162,200.8,100.8,217.2,53,189.6S-11.2,100.8,16.4,53"
                      ></path>
                    </svg>
                    <i className="bi bi-play"></i>
                  </div>
                  <h6>Watch Tour</h6>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-6 d-flex align-items-center">
            <div className="about-img-wrap">
              <div className="about-img">
                <img src="/img/home2/home2-about-img1.png" alt="about logo" width={450} height={450} />
              </div>
              <div className="experience">
                <h3>05</h3>
                <p>Years of experience</p>
              </div>
              <img src={"/img/home2/vector/plane-vector.svg"} alt="plane" className="vector" width={409} height={500} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
