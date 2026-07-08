import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../app/features/authSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const isOnPricingPage = location.pathname === "/app/pricing";

  const logoutUser = () => {
    navigate("/");
    dispatch(logout());
  };

  return (
    <div className=" shadow bg-white">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all">
        <Link to="/">
          <img src="/logo.svg" alt="logo" className=" h-14 w-auto" />
        </Link>
        <div className=" flex items-center gap-4 text-sm">
          <p className=" max-sm:hidden">Hi, {user?.name}</p>

          {user?.plan === "premium" ? (
            <span className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 font-medium text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" />
              </svg>
              Premium
            </span>
          ) : (
            !isOnPricingPage && (
              <Link
                to="/app/pricing"
                className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-5 py-1.5 rounded-full active:scale-95 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" />
                </svg>
                Passer Premium
              </Link>
            )
          )}

          <button
            onClick={logoutUser}
            className="bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
