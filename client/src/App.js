import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GiSoccerBall } from 'react-icons/gi';
import { IoInformationSharp } from 'react-icons/io5';

import Root from './routes/Root';
import Home from './routes/Home';
import TeamNews from './routes/TeamNews';
import Planning from './routes/Planning';
import Locations from './routes/Locations';

// routing for the various application pages
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/news/:team',
        element: <TeamNews />
      },
      {
        path: '/planning',
        element: <Planning />
      },
      {
        path: '/locations/:venue/:address/:city',
        element: <Locations />
      }
    ]
  }
]);

export default function App() {
  const date = new Date().getFullYear();

  return (
    <div>
      <div className='header'>
        <h1>
          <GiSoccerBall color='#432060' size={45}/>
          <IoInformationSharp color='#01baff' size={25} style={{marginLeft: '-10px', verticalAlign: 'bottom'}}/>
          <span style={{color: '#432060'}}><b>PremierPal</b></span>
        </h1>
      </div>
      <RouterProvider router={router} />
      <div className='footer'>
        <div>
          Powered by:&nbsp;
          <a href='https://www.api-football.com/' target='_blank' rel='noreferrer' style={{color: '#432060'}}>API-Football</a>
          &nbsp; | &nbsp;
          <a href='https://newsapi.org/' target='_blank' rel='noreferrer' style={{color: '#432060'}}>NewsAPI</a>
          &nbsp; | &nbsp;
          <a href='https://www.geoapify.com/' target='_blank' rel='noreferrer' style={{color: '#432060'}}>Geoapify</a>
        </div>
        <div>
          Joanna Salerno&nbsp;&#169;&nbsp;{`${date}`}
        </div>
      </div>
    </div>
  );
}