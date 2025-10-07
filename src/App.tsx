//import node module libraries
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "pages/auth/SignIn"

//import routes files
import AuthenticationLayout from "layouts/AuthenticationLayout";
import RootLayout from "layouts/RootLayout";
import ProtectedRoute from "components/ProtectedRoute";

// import bootstrap components


const App = () => {
  const router = createBrowserRouter([
    {
      id: "home",
      path: "/" ,
      children: [
        {path:"home",
          Component:HomePage
        
        }
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
