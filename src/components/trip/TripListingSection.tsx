import React from "react";
import TripFiltersSidebar from "./TripFilterSideBar";
interface Trip {
  trip_id: number;
  avatar: string;
  promotion_title?: string;
  in_wishlist: boolean;
  days_count?: number;
  hours_count?: number;
  destination: string;
  name: string;
  trip_type: string;
  departure: string;
  tenant: string;
  adultep: number;
  oldadultep?: number;
}

interface TripsListProps {
  trips: Trip[];
  current_range_start: number;
  current_range_end: number;
  total_results: number;
  currentPage:number;
  currencySymbol: string;
  onSortChange?: (sort: string) => void;
}

const TripsList: React.FC<TripsListProps> = ({
  trips,
  current_range_start,
  current_range_end,
  currentPage,
  total_results,
  currencySymbol,
  onSortChange,
}) => {
      const pages = Array.from({ length: total_results }, (_, i) => i + 1);
      const onPageChange = ()=>{

      }

  return (
    <div className="package-grid-with-sidebar-section pt-120 mb-120" id="header_of_page">
    <div className="container">
      <div className="row g-lg-4 gy-5">
        <div className="col-lg-8">
          {trips && trips.length > 0 ? (
            <>
              <div className="package-inner-title-section mb-40" id="datanumberss">
                <p>
                  Showing <span>{current_range_start}</span>–<span>{current_range_end}</span> of <span>{total_results}</span> results
                </p>
              </div>

              <div className="selector-and-grid">
                <div className="selector">
                  <select
                    className="selectpricefilter"
                    onChange={(e) => onSortChange?.(e.target.value)}
                  >
                    <option value="default">Default Sorting</option>
                    <option value="low-to-high">Price Low to High</option>
                    <option value="high-to-low">Price High to Low</option>
                  </select>
                </div>

                <ul className="grid-view">
                  <li className="grid active"> {/* Add SVG here */} </li>
                  <li className="lists"> {/* Add SVG here */} </li>
                </ul>
              </div>

              <div className="list-grid-product-wrap mb-70 ">
                <div className="row gy-4 grid-container">
                  {trips.map((trip) => (
                    <div className="col-md-6 col-lg-4 d-flex item" key={trip.trip_id}>
                      <div className="package-card">
                        <div className="package-card-img-wrap">
                          <a href={`/trip/${trip.trip_id}`} className="card-img">
                            <img src={trip.avatar} alt={`image banner for trip ${trip.name}`} />
                          </a>
                          {trip.promotion_title && (
                            <div className="ribbon ribbon-top-right">
                              <span>{trip.promotion_title}</span>
                            </div>
                          )}
                          <div className="vertical-activity-card__wishlist">
                            <div
                              className={`wishlist-icon ${trip.in_wishlist ? "selected" : ""}`}
                              data-trip-id={trip.trip_id}
                              role="button"
                              tabIndex={0}
                              aria-label="Wishlist"
                            ></div>
                          </div>
                          <div className="batch">
                            <span className="date">
                              {trip.days_count
                                ? `${trip.days_count} Days`
                                : `${trip.hours_count} Hours`}
                            </span>
                            <div className="location">
                              <ul className="location-list">
                                <li className="active">
                                  <a href="#">{trip.destination}</a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div className="package-card-content " style={{ bottom: "2%" }}>
                          <div className="card-content-top">
                            <h5>
                              <a href={`/trip/${trip.trip_id}`}>{trip.name}</a>
                            </h5>
                            <ul>
                              <li>Trips type: {trip.trip_type}</li>
                              <li>Departure: {trip.departure}</li>
                              <li>Destination: {trip.destination}</li>
                              <li>
                                Duration:{" "}
                                {trip.days_count ? `${trip.days_count} days` : `${trip.hours_count} hours`}
                              </li>
                              <li>Organized by: {trip.tenant}</li>
                            </ul>
                          </div>
                          <div className="card-content-bottom" style={{ paddingBottom: "2%" }}>
                            <div className="price-area">
                              <h6>Starting From:</h6>
                              <span>
                                {currencySymbol}
                                {trip.adultep}{" "}
                                {trip.oldadultep && <del>{currencySymbol}{trip.oldadultep}</del>}
                              </span>
                              <p>TAXES INCL/PERS</p>
                            </div>
                            <a href={`/trip/${trip.trip_id}`} className="primary-btn2">
                              View Details
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                		<div className="row">
      <div className="pagination_tours">
      <nav className="inner-pagination-area">
        <ul className="pagination-list">
          {/* Prev button */}
          <li  onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}>
          <a
            className={`shop-pagi-btn prev-btn ${currentPage === 1 ? "disabled" : ""}`}
            role="button"
          >
            <i className="bi bi-chevron-left"></i>
          </a>
          </li>

          {/* Page numbers */}
          {pages.map((page) => (
            <li>
            <a
              key={page}
              className={`mx-1 ${page === currentPage ? "active" : ""}`}
              onClick={() => onPageChange(page)}
              style={{ cursor: "pointer" }}
            >
              {page}
            </a>

            </li>
          ))}

          {/* Next button */}
          <li>
          <a
            className={`shop-pagi-btn next-btn ${currentPage === total_results ? "disabled" : ""}`}
            role="button"
            onClick={() => currentPage < total_results && onPageChange(currentPage + 1)}
          >
            <i className="bi bi-chevron-right"></i>
          </a>

          </li>
        </ul>
      </nav>
    </div>
                        </div>
        
              </div>
            </>
          ) : (
            <div className="error-area-wrapper text-center">
              <h3>Sorry!, Nothing Found!</h3>
              <p>Nothing matched your search terms. Please try again with different keywords.</p>
            </div>
          )}
        </div>
        <TripFiltersSidebar />
      </div>
    </div>
    </div>

  );
};

export default TripsList;
