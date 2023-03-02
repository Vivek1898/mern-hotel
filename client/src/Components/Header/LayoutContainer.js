import { Link } from "react-router-dom";

import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="/">
        Hotel Admin Panel
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavDropdown"
        aria-controls="navbarNavDropdown"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavDropdown">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <Link className="nav-link" to="/">
              Book Rooms <span className="sr-only">(current)</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/view">
              View Bookings
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/edit">
              Edit/Delete Bookings
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/add">
              Create Room
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
