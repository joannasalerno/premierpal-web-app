import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import  { HiBuildingStorefront } from 'react-icons/hi2';
import { IoLocationSharp } from 'react-icons/io5';
import { IoMdBeer } from 'react-icons/io';
import { fetchConfig } from '../utils/fetchConfig';

function Locations() {
  // grab venue, address, and city data from passed parameters
  const { venue, address, city } = useParams();

  // set states for locations data, including loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [locations, setLocations] = useState([]);

  // fetch locations data
  const fetchLocations = async() => {
    try {
      // call fetchConfig() to get backend API URL
      const backendURL = await fetchConfig();

      const response = await fetch(`${backendURL}/api/locations/${venue}/${address}/${city}`);
      const data = await response.json();
      return data;
    } catch {
      console.error('Error fetching locations');
    }
  };
    
  // call fetchLocations() and set locations grid row data
  useEffect(() => {
    fetchLocations()
      .then((res) => {setLocations(res); return res;})
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, []);
    
  // display appropriate messages on the page when data are loading or when there are errors
  if (loading) { // loading locations data
    return<p>Loading locations...</p>;
  };
    
  if (error) { // error in fetching locations data
    return<p>Something went wrong: {error}</p>;
  };

  return (
    <div>
      <h1>Locations near <span style={{color: '#a22aff'}}>{venue}</span>&nbsp;</h1>
      <p>
        Listed below are the 10 closest bars and pubs to {venue}, so that you can watch a match in a lively atmosphere!<br/>
        You can use these results to help make your decision on where to go for match day.
      </p>
      <hr />
      {locations.map((loc) => (
        <div>
          <h3>
            <HiBuildingStorefront size={40} style={{color: '#432060'}} />&ensp;
            {loc.properties.address_line1}
          </h3>
          <h5><IoLocationSharp color='#a22aff' size={25}/>&nbsp;{loc.properties.formatted}</h5>
          <p><IoMdBeer color='#01baff'size={25}/>&nbsp;Type: {loc.properties.datasource.raw.amenity.charAt(0).toUpperCase()}{loc.properties.datasource.raw.amenity.slice(1)}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Locations;