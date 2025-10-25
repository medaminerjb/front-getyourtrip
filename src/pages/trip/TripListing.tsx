import React , {useState} from "react";
import Header from "components/home/Header/Header";
import Footer from "components/home/footer/Footer";
import HomeBanner from "components/home/banner/Banner";
import TrendyTravelLocations from "components/home/trip/Travel";
import AboutSection from "components/home/About.tsx";
import NewsletterBanner from "components/home/newsletter";
import BreadCrumbSection from "components/home/banner/BreadCrumbSection";
import TripsList from "components/trip/TripListingSection";
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



export const tripsHome = [
  {
    destination: "Paris",
    avatar: "/img/home2/destination-card2-img1.jpg",
    total: 12,
  },
  {
    destination: "Rome",
    avatar: "/img/home2/destination-card2-img1.jpg",
    total: 8,
  },
  {
    destination: "Barcelona",
    avatar: "/img/home2/destination-card2-img1.jpg",
    total: 5,
  },
  {
    destination: "New York",
    avatar: "/img/home2/destination-card2-img1.jpg",
    total: 15,
  },
  {
    destination: "Tokyo",
    avatar: "/img/home2/destination-card2-img1.jpg",
    total: 10,
  },
  {
    destination: "Dubai",
    avatar: "/img/home2/destination-card2-img1.jpg",
    total: 7,
  },
  {
    destination: "London",
    avatar: "/img/home2/destination-card2-img1.jpg",
    total: 9,
  },
  {
    destination: "Istanbul",
    avatar: "/img/home2/destination-card2-img1.jpg",
    total: 6,
  },
];


const TripListingPage: React.FC = () => {
 const [trips, setTrips] = useState<Trip[]>([
    {
      trip_id: 1,
      name: "Desert Adventure Tour",
      avatar: "/static/images/trip1.jpg",
      promotion_title: "20% Off",
      in_wishlist: true,
      days_count: 3,
      destination: "Djerba",
      trip_type: "Adventure",
      departure: "Tunis",
      tenant: "Quad Tours",
      adultep: 150,
      oldadultep: 200,
    },
    {
      trip_id: 2,
      name: "Cultural Heritage Trip",
      avatar: "/static/images/trip2.jpg",
      in_wishlist: false,
      days_count: 1,
      destination: "Sousse",
      trip_type: "Cultural",
      departure: "Tunis",
      tenant: "MyBookingWay",
      adultep: 80,
      oldadultep: 100,
    },
    {
      trip_id: 3,
      name: "Beach Relaxation Getaway",
      avatar: "/static/images/trip3.jpg",
      promotion_title: "Early Bird",
      in_wishlist: false,
      hours_count: 8,
      destination: "Hammamet",
      trip_type: "Relax",
      departure: "Tunis",
      tenant: "Quad Tours",
      adultep: 50,
      oldadultep: 60,
    },
      {
      trip_id: 4,
      name: "Beach Relaxation Getaway",
      avatar: "/static/images/trip3.jpg",
      promotion_title: "Early Bird",
      in_wishlist: false,
      hours_count: 8,
      destination: "Hammamet",
      trip_type: "Relax",
      departure: "Tunis",
      tenant: "Quad Tours",
      adultep: 50,
      oldadultep: 60,
    },
  ]);
  return (
    <>
      <BreadCrumbSection
  backgroundUrl="/path/to/banner.jpg" 
  title="Our Tours"
>
  <p>Some subtitle or extra content here</p>
</BreadCrumbSection>
    <TripsList currentPage={1} total_results={3} trips={trips} currencySymbol="$" current_range_end={10} current_range_start={12}  />
    

    </>
  );
};

export default TripListingPage;
