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
                <div className="selector-and-grid"><div className="selector">
                    <div className="nice-select  open" >
                        <span className="current">Default Sorting</span>
                <ul className="list">
                    <li className="option" data-value="0">Price Low to Hig</li>
                    <li className="option" data-value="1">Price High to Low</li>
                    </ul>
                    </div>
                    </div>
                    <ul className="grid-view">
                        <li className="grid active">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                            <mask id="mask0_1631_19" maskUnits="userSpaceOnUse" x="0" y="0" width="14" height="14">
                                <rect width="14" height="14" fill="#D9D9D9"></rect></mask><g mask="url(#mask0_1631_19)"><path d="M5.47853 6.08726H0.608726C0.272536 6.08726 0 5.81472 0 5.47853V0.608726C0 0.272536 0.272536 0 0.608726 0H5.47853C5.81472 0 6.08726 0.272536 6.08726 0.608726V5.47853C6.08726 5.81472 5.81472 6.08726 5.47853 6.08726Z"></path><path d="M13.3911 6.08726H8.52132C8.18513 6.08726 7.9126 5.81472 7.9126 5.47853V0.608726C7.9126 0.272536 8.18513 0 8.52132 0H13.3911C13.7273 0 13.9999 0.272536 13.9999 0.608726V5.47853C13.9999 5.81472 13.7273 6.08726 13.3911 6.08726Z"></path><path d="M5.47853 14.0013H0.608726C0.272536 14.0013 0 13.7288 0 13.3926V8.52279C0 8.1866 0.272536 7.91406 0.608726 7.91406H5.47853C5.81472 7.91406 6.08726 8.1866 6.08726 8.52279V13.3926C6.08726 13.7288 5.81472 14.0013 5.47853 14.0013Z"></path><path d="M13.3916 14.0013H8.52181C8.18562 14.0013 7.91309 13.7288 7.91309 13.3926V8.52279C7.91309 8.1866 8.18562 7.91406 8.52181 7.91406H13.3916C13.7278 7.91406 14.0003 8.1866 14.0003 8.52279V13.3926C14.0003 13.7288 13.7278 14.0013 13.3916 14.0013Z"></path></g></svg></li><li className="lists"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><mask id="mask0_1631_3" maskUnits="userSpaceOnUse" x="0" y="0" width="14" height="14" ><rect width="14" height="14" fill="#D9D9D9"></rect></mask><g mask="url(#mask0_1631_3)"><path d="M1.21747 2C0.545203 2 0 2.55848 0 3.24765C0 3.93632 0.545203 4.49433 1.21747 4.49433C1.88974 4.49433 2.43494 3.93632 2.43494 3.24765C2.43494 2.55848 1.88974 2 1.21747 2Z"></path><path d="M1.21747 5.75195C0.545203 5.75195 0 6.30996 0 6.99913C0 7.68781 0.545203 8.24628 1.21747 8.24628C1.88974 8.24628 2.43494 7.68781 2.43494 6.99913C2.43494 6.30996 1.88974 5.75195 1.21747 5.75195Z"></path><path d="M1.21747 9.50586C0.545203 9.50586 0 10.0643 0 10.753C0 11.4417 0.545203 12.0002 1.21747 12.0002C1.88974 12.0002 2.43494 11.4417 2.43494 10.753C2.43494 10.0643 1.88974 9.50586 1.21747 9.50586Z"></path><path d="M13.0845 2.31055H4.42429C3.91874 2.31055 3.50879 2.7305 3.50879 3.24886C3.50879 3.76677 3.91871 4.1867 4.42429 4.1867H13.0845C13.59 4.1867 14 3.76677 14 3.24886C14 2.7305 13.59 2.31055 13.0845 2.31055Z"></path><path d="M13.0845 6.06055H4.42429C3.91874 6.06055 3.50879 6.48047 3.50879 6.99886C3.50879 7.51677 3.91871 7.9367 4.42429 7.9367H13.0845C13.59 7.9367 14 7.51677 14 6.99886C14 6.48047 13.59 6.06055 13.0845 6.06055Z"></path><path d="M13.0845 9.81348H4.42429C3.91874 9.81348 3.50879 10.2334 3.50879 10.7513C3.50879 11.2692 3.91871 11.6891 4.42429 11.6891H13.0845C13.59 11.6891 14 11.2692 14 10.7513C14 10.2334 13.59 9.81348 13.0845 9.81348Z"></path></g></svg></li></ul></div>
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
