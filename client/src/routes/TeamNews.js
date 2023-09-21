import '../App.css';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from 'reactstrap';
import { HiOutlineNewspaper } from 'react-icons/hi';
import { fetchConfig } from '../utils/fetchConfig';

function TeamNews() {
  // grab team data from passed parameters (this is the team's name)
  const { team } = useParams();

  // set states for news articles data, including loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [articles, setArticles] = useState([]);

  // fetch news articles on the selected team
  const fetchTeamNews = async() => {
    try {
      // call fetchConfig() to get backend API URL
      const backendURL = await fetchConfig();

      // fetch team news data from server, passing parameter of team name
      const response = await fetch(`${backendURL}/api/news/${team}`);
      const data = await response.json();
      return data.articles; // just return the articles
    } catch {
      console.error('Error fetching team news');
    }
  };
    
  // call fetchTeamNews() and set news articles data
  useEffect(() => {
    fetchTeamNews()
      .then((res) => setArticles(res)) // set articles
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, []);
    
  // display appropriate messages on the page when data are loading or when there are errors
  if (loading) { // display message when loading team news
    return<p>Loading team news...</p>;
  };
    
  if (error) { // display meesage when error in fetching team news
    return<p>Something went wrong: {error}</p>;
  };

  return (
    <div>
      <h1><span style={{color: '#a22aff'}}>{team}</span> News</h1>
      <p>Browse the articles below to read about what people are saying about {team}.</p>
      <hr />
      {articles.map((article) => (
        <div>
          <h3>
            <HiOutlineNewspaper size={40} style={{color: '#432060'}} />&ensp;
            {article.content.substring(0,120) + ' ...'}
          </h3>
          <h5>
            <Badge color='success'>Published: {article.publishedAt.substring(0,10)}</Badge>&emsp;
            <Badge color='info'>Source: {article.source.name}</Badge>&emsp;
            <a href={article.url} target='_blank' rel='noreferrer'>Link to article</a>
          </h5>
          <p>{article.description}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default TeamNews;