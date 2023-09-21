import { NavLink, Outlet } from 'react-router-dom';

// css that is applied to each navlink when active
const activeStyle = {
  fontWeight: 'bold',
  color: '#59006e'
};
  
// css that is applied to each navlink when inactive
const inactiveStyle = {
  fontWeight: 'normal',
  color: 'gray'
}

// this function will comprise the navigation menu for the application
// only have 2 main routes (Home and Planning), as the other app pages require user action to pass parameters and navigate to other related pages
function Root() {
  return (
    <div className='page-container'>
      <ul>
        <li>
          <NavLink to='/' style={({isActive}) => (isActive ? activeStyle : inactiveStyle)}
          >Home</NavLink>
        </li>
        <li>
          <NavLink to='/planning' style={({isActive}) => (isActive ? activeStyle : inactiveStyle)}
          >Planning</NavLink>
        </li>
      </ul>
      <Outlet />
    </div>
  );
}

export default Root;