import { NavLink, Outlet } from 'react-router-dom';

// css that is applied to each navlink when active
const activeStyle = {
  fontWeight: 'bold',
  color: '#59006e'
};
  
// css that is applied to each navlink when not active
const inactiveStyle = {
  fontWeight: 'normal',
  color: 'gray'
}

// this function will comprise the navigation menu for the application
// only have 2 main routes, as the other app pages require user action to use data to call the relevant APIs on the server and navigate to other pages
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