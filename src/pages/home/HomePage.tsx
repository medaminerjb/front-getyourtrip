import React from "react";
import HomeBanner from "components/home/banner/Banner";
import TrendyTravelLocations from "components/home/trip/Travel";
import AboutSection from "components/home/About.tsx";



// data/tripsHome.ts
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


const HomePage: React.FC = () => {

  return (
    <>
      <HomeBanner />
        <TrendyTravelLocations trips_home={tripsHome}/>
        <AboutSection />
    

    </>
  );
};

export default HomePage;
