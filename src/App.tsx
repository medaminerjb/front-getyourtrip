//import node module libraries
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//import routes files
import ProtectedRoute from "components/ProtectedRoute";
import TripListingPage from "pages/trip/TripListing";
import FrontLayout from "layouts/FrontLayout";
import HomePage from "pages/home/HomePage";

// import bootstrap components


const App = () => {
  const router = createBrowserRouter([
    {
      id: "home",
      path: "/" ,
       Component:() => (
       <ProtectedRoute>
        <FrontLayout />
      </ProtectedRoute>
    ) ,
      children: [
        {path:"home",
          Component:HomePage
        
        },
        {
          path:"trip",
          Component:TripListingPage
        }
      
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
