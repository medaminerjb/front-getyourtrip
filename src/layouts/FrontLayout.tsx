import NewsletterBanner from "components/home/newsletter";
import Header from "components/home/Header/Header";
import Footer from "components/home/footer/Footer";

import { Outlet } from "react-router";


const FrontLayout = () => {


  return (
<>
      <Header />

        <>
         <Outlet />
        </>
        <NewsletterBanner actionUrl="test" />
        <Footer />
    
</>
  );
};

export default FrontLayout;
