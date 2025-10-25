import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";

interface Trip {
  destination: string;
  avatar: string;
  total: number;
}

interface TrendyTravelLocationsProps {
  trips_home: Trip[];
}

const TrendyTravelLocations: React.FC<TrendyTravelLocationsProps> = ({ trips_home }) => {

  return (
    <div className="realdata">
      <div className="destination-card2-slider-section">
        <div className="container">
          <div className="row mb-50">
            <div className="col-lg-12">
              <div className="section-title2 text-center">
                <h2>Trendy Travel Locations</h2>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={4}
                navigation={{
                  nextEl: ".destination-card2-next",
                  prevEl: ".destination-card2-prev",
                }}
                breakpoints={{
                  320: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1200: { slidesPerView: 4 },
                }}
                className="destination-card2-slider mb-50"
              >
                {trips_home.map((trip, index) => (
                  <SwiperSlide key={index}>
                    <div className="destination-card2">
                      <Link
                        to={`/destinationtrip/${trip.destination}`}
                        className="destination-card-img"
                      >
                        <div className="image-container">
                          <img
                            loading="lazy"
                            src={trip.avatar}
                            alt={`tour image in ${trip.destination}`}
                            style={{ width: "100%", height: "auto", objectFit: "cover" }}
                          />
                        </div>
                      </Link>

                      <div className="batch">
                        <span>
                          {trip.total} Tour
                        </span>
                      </div>

                      <div className="destination-card2-content">
                        <span>"Travel To</span>
                        <h6 className="h4toh6">
                          <Link to={`/destinationtrip/${trip.destination}`} style={{color:"white"}}>
                            {trip.destination}
                          </Link>
                        </h6>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div className="slide-and-view-btn-grp">
                {trips_home.length > 4 && (
                  <div className="slider-btn-grp3 two">
                    <div
                      className="slider-btn destination-card2-prev"
                      role="button"
                      aria-label="Previous slide"
                    >
                      <i className="bi bi-arrow-left"></i>
                      <span>PREV</span>
                    </div>

                    <div
                      className="slider-btn destination-card2-next"
                      role="button"
                      aria-label="Next slide"
                    >
                      <span>NEXT</span>
                      <i className="bi bi-arrow-right"></i>
                    </div>
                  </div>
                )}

                <Link to="/trips" className="secondary-btn2">
                  View All Destination
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendyTravelLocations;
