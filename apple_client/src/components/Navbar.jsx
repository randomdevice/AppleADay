import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.brand}>
      <NavLink
          to="/"
          style={styles.link}
          className={({ isActive }) => (isActive ? 'active-link' : '')}
        >
          AppleADay
        </NavLink>
      </div>
      <div style={styles.links}>
        <NavLink
          to="/explore/habit"
          style={styles.link}
          className={({ isActive }) => (isActive ? 'active-link' : '')}
        >
          Habit Explorer
        </NavLink>
        <NavLink
          to="/explore/disease"
          style={styles.link}
          className={({ isActive }) => (isActive ? 'active-link' : '')}
        >
          Disease Explorer
        </NavLink>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#116466',
    padding: '15px 30px',
    color: 'white',
  },
  brand: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '25px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
  },
};

export default Navbar;
