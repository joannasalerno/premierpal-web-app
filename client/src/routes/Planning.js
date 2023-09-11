import '../App.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function Planning() {
  // set states for team venues data, including loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [venuesRowData, setVenuesRowData] = useState([]);

  // allow navigation between application pages
  let navigate = useNavigate();
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
    paginationPageSize: 10,
    rowSelection: 'single'
  };

  // fetch team venues
  const fetchTeamVenues = async() => {
    try {
      const response = await fetch(`http://localhost:3001/api/teams`);
      const data = await response.json();
      return data.response;
    } catch {
      console.error('Error fetching team venues');
    }
  };

  // call fetchTeamVenues() and set venues grid row data
  useEffect(() => {
    fetchTeamVenues()
      .then(res => {return res;})
      .then(res => 
        res.map(team => {
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
    .then(teams => setVenuesRowData(teams));
  }, []);

  // display appropriate messages on the page when data are loading or when there are errors
  if (loading) { // loading team venues data
    return<p>Loading team venues...</p>;
  };

  if (error) { // error in fetching team venues data
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