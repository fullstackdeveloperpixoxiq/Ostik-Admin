import {Outlet, Navigate, useLocation} from "react-router"

const ProtectedRoute= ()=>{
    const location= useLocation();

    const token= localStorage.getItem("adminToken");

    if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet/>

}

export default ProtectedRoute