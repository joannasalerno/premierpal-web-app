import '../App.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { GiSoccerBall } from 'react-icons/gi';
import { IoInformationSharp } from 'react-icons/io5';
import { fetchConfig } from '../utils/fetchConfig';

function Home() {
  // set state for count, to be updated when fetching page counter
  const [count, setCount] = useState(null);

  // fetch page counter from server
  const fetchCounter = async() => {
    try {
      // call fetchConfig() to get backend API URL
      const backendURL = await fetchConfig();

      // fetch counter object from server
      const response = await fetch(`${backendURL}/counter`);
      const counterFile = await response.json();
      return counterFile.count; // just return the page view count
    } catch {
      console.log('Error fetching page counter');
    }
  };

  // call fetchPageCounter() and set count variable
  useEffect(() => {
    fetchCounter()
      .then(res => {return res;}) // return the response before doing anything with it 
      .then(counter => setCount(counter)) // set count variable
      .catch((e) => console.error(e.message))
  }, []);
  
  // set states for standings and players data, including loading and errors
  const [sLoading, setSLoading] = useState(true);
  const [sError, setSError] = useState(null);
  const [sRowData, setSRowData] = useState([]);

  const [pLoading, setPLoading] = useState(true);
  const [pError, setPError] = useState(null);
  const [pRowData, setPRowData] = useState([]);

  // allow navigation between application pages
  let navigate = useNavigate();

  // function to handle row click --> navigate user to new page and pass relevant parameter of selected team name
  const handleRowClick = (event) => {
    navigate(`/news/${event.data.team}`);
  };

  // define options for standings grid
  const sGridOptions = {
    columnDefs: [
      { headerName: 'Rank', field: 'rank', sortable: true, headerClass: 'column-header' },
      { headerName: 'Team', field: 'team', filter: true, floatingFilter: true, headerClass: 'column-header' },
      { headerName: 'Points', field: 'points', sortable: true, headerClass: 'column-header' },
      { headerName: 'Goal Differential', field: 'goalDiff', sortable: true, headerClass: 'column-header' },
      { headerName: 'Games Played', field: 'played', headerClass: 'column-header' },
      { headerName: 'Games Won', field: 'won', headerClass: 'column-header' },
      { headerName: 'Total Goals Scored', field: 'goals', headerClass: 'column-header' }
    ],
    pagination: true,
    paginationPageSize: 10, // only display 10 teams per table page
    rowSelection: 'single'
  };
  
  // define options for top scorers (players) grid
  const pGridOptions = {
    columnDefs: [
      { headerName: 'First Name', field: 'fName', filter: true, floatingFilter: true, headerClass: 'column-header' },
      { headerName: 'Last Name', field: 'lName', filter: true, floatingFilter: true, headerClass: 'column-header' },
      { headerName: 'Team', field: 'teamName', filter: true, floatingFilter: true, headerClass: 'column-header' },
      { headerName: 'Goals', field: 'goals', sortable: true, headerClass: 'column-header' },
      { headerName: 'Assists', field: 'assists', sortable: true, headerClass: 'column-header' },
      { headerName: 'Yellow Cards', field: 'yellows', headerClass: 'column-header' },
      { headerName: 'Red Cards', field: 'reds', headerClass: 'column-header' },
    ],
    pagination: true,
    paginationPageSize: 10, // only display 10 players per table page
    rowSelection: 'single'
  };

  // fetch standings data
  const fetchStandings = async() => {
    try {
      // call fetchConfig() to get backend API URL
      const backendURL = await fetchConfig();

      // fetch standings data from server
      const response = await fetch(`${backendURL}/api/standings`);
      const data = await response.json();
      return data.response; // just return the response (the data)
    } catch {
      console.error('Error fetching standings');
    }
  };

  // call fetchStandings() and set standings grid row data
  useEffect(() => {
    fetchStandings()
      .then(res => {console.log(res); return res;}) // log and return the response before mapping it
      .then(res => 
        res[0].league.standings[0].map(team => { // map all teams to extract the desired stats for each individual team 
          return {
            rank: team.rank,
            team: team.team.name,
            points: team.points,
            goalDiff: team.goalsDiff,
            played: team.all.played,
            won: team.all.win,
            goals: team.all.goals.for
          };
        })
      )
      .catch((e) => setSError(e.message))
      .finally(() => setSLoading(false))
    .then(standings => setSRowData(standings)); // set standings row data to the above mapped data
  }, []);

  // fetch players data
  const fetchPlayers = async() => {
    try {
      // call fetchConfig() to get backend API URL
      const backendURL = await fetchConfig();

      // fetch player data from server
      const response = await fetch(`${backendURL}/api/topscorers`);
      const data = await response.json();
      return data.response; // just return the response (the data)
    } catch {
      console.error('Error fetching top scorers');
    }
  };

  // call fetchPlayers() and set players grid row data
  useEffect(() => {
    fetchPlayers()
      .then(res => {console.log(res); return res;}) // log and return the response before mapping it 
      .then(res => 
        res.map(player => { // map all players to extract the desired stats for each individual player
          return {
            fName: player.player.firstname,
            lName: player.player.lastname,
            teamName: player.statistics[0].team.name,
            shots: player.statistics[0].shots.on,
            goals: player.statistics[0].goals.total,
            assists: player.statistics[0].goals.assists,
            yellows: player.statistics[0].cards.yellow,
            reds: player.statistics[0].cards.red,
          };
        })
      )
      .catch((e) => setPError(e.message))
      .finally(() => setPLoading(false))
    .then(players => setPRowData(players)); // set player row data to the above mapped data
  }, []);

  // display appropriate messages on the page when any data are loading or when there are errors
  if (sLoading) { // display message when loading standings data
    return<p>Loading standings data...</p>;
  };

  if (sError) { // display message when error in fetching standings data
    return<p>Something went wrong: {sError}</p>;
  };

  if (pLoading) { // display message when loading players data
    return<p>Loading player data...</p>;
  };

  if (pError) { // display message when error in fetching players data
    return<p>Something went wrong: {pError}</p>;
  };

  return (
    <div>
      <div className='header-container'>
        <h1>
          Welcome to&nbsp;
          <GiSoccerBall color='#432060' size={45}/>
          <IoInformationSharp color='#01baff' size={25} style={{marginLeft: '-10px', verticalAlign: 'bottom'}}/>
          <span style={{color: '#432060'}}><b>PremierPal</b></span>
        </h1>
        <p style={{fontSize: 'larger'}}>your information and planning app for the English Premier League</p>
      </div>
      <h4>Page visits: {count}</h4>
      <hr />
      <h2>Current Standings</h2>
      <p>
        Below, you'll find a table of the current standings in the league. 
        Click on a team to read about them in the news.
      </p>
      <div className='ag-theme-alpine' style={{height: '550px', width: '1400px'}}>
        <AgGridReact
          gridOptions={sGridOptions}
          rowData={sRowData}
          onRowClicked={handleRowClick}
        />
      </div>
      <br/>
      <h2>Top Scorers</h2>
      <p>Below, you'll find a table of the current top scorers in the league.</p>
      <div className='ag-theme-alpine' style={{height: '550px', width: '1400px'}}>
        <AgGridReact
          gridOptions={pGridOptions}
          rowData={pRowData}
        />
      </div>
    </div>
  );
  }
  
export default Home;