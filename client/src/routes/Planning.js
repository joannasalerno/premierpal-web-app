import '../App.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { fetchConfig } from '../utils/fetchConfig';

function Planning() {
  // set states for team venues data, including loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [venuesRowData, setVenuesRowData] = useState([]);

  // allow navigation between application pages
  let navigate = useNavigate();

  // function to handle row click --> navigate user to new page and pass relevant parameters
  const handleRowClick = (event) => {
    navigate(`/locations/${event.data.venue}/${event.data.address}/${event.data.city}`);
  };

  // define options for team venues grid
  const gridOptions = {
    columnDefs: [
      { headerName: 'Team', field: 'team', sortable: true, filter: true, floatingFilter: true, headerClass: 'column-header' },
      { headerName: 'Venue', field: 'venue', sortable: true, headerClass: 'column-header' },
      { headerName: 'Address', field: 'address', headerClass: 'column-header' },
      { headerName: 'City', field: 'city', sortable: true, filter: true, floatingFilter: true, headerClass: 'column-header' }
    ],
    pagination: true,
    paginationPageSize: 10, // only display 10 team venues per table page
    rowSelection: 'single'
  };

  // fetch team venues
  const fetchTeamVenues = async() => {
    try {
      // call fetchConfig() to get backend API URL
      const backendURL = await fetchConfig();
      
      // fetch team venues data from server
      const response = await fetch(`${backendURL}/api/teams`);
      const data = await response.json();
      return data.response; // just return the response (the data)
    } catch {
      console.error('Error fetching team venues');
    }
  };

  // call fetchTeamVenues() and set venues grid row data
  useEffect(() => {
    fetchTeamVenues()
      .then(res => {return res;}) // return the response before mapping it 
      .then(res => 
        res.map(team => { // map all teams to extract the desired venue info for each individual team 
          return {
            team: team.team.name,
            venue: team.venue.name,
            address: team.venue.address,
            city: team.venue.city
          };
        })
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
    .then(teams => setVenuesRowData(teams)); // set team venues row data to the above mapped data
  }, []);

  // display appropriate messages on the page when data are loading or when there are errors
  if (loading) { // display message when loading team venues data
    return<p>Loading team venues...</p>;
  };

  if (error) { // display message when error in fetching team venues data
    return<p>Something went wrong: {error}</p>;
  };

  return (
    <div>
      <h1><span style={{color: '#432060'}}><b>PremierPal</b></span> Planning</h1>
      <p>
        Plan your trips to livestream upcoming games in an environment close to the match venue.<br/>
        Click on your favourite team to view a list of bars and pubs near that team's home venue.
      </p>
      <hr />
      <h2>Team Venues</h2>
      <div className='ag-theme-alpine' style={{height: '550px', width: '800px'}}>
        <AgGridReact
          gridOptions={gridOptions}
          rowData={venuesRowData}
          onRowClicked={handleRowClick}
        />
      </div>
    </div>
  );
}
  
export default Planning;