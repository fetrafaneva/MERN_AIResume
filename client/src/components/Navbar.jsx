import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../app/features/authSlice";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();

  const hidePremiumButton =
    location.pathname === "/app/pricing" ||
    location.pathname === "/app/premium";

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
        <div className=" flex items-center gap-2 sm:gap-4 text-sm">
          <p className=" max-sm:hidden">Hi, {user?.name}</p>

          {user?.plan === "premium" ? (
            <span className="flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-700 font-medium text-xs">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0"
              >
                <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" />
              </svg>
              <span className="hidden sm:inline">Premium</span>
            </span>
          ) : (
            !hidePremiumButton && (
              <Link
                to="/app/pricing"
                className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white px-3 sm:px-5 py-1.5 rounded-full active:scale-95 transition-all shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="shrink-0"
                >
                  <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7Z" />
                </svg>
                <span className="hidden sm:inline">Passer Premium</span>
              </Link>
            )
          )}

          {user?.role === "admin" && (
            <Link
              to="/app/admin/payments"
              className="text-xs text-slate-500 hover:text-slate-700 underline underline-offset-2"
            >
              Admin
            </Link>
          )}

          <button
            onClick={logoutUser}
            className="bg-white hover:bg-slate-50 border border-gray-300 px-4 sm:px-7 py-1.5 rounded-full active:scale-95 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
