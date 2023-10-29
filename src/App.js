import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function App() {
  const [trends, setTrends] = useState([]);

  useEffect(() => {

    axios.get('http://localhost:5000/trending')
      .then(response => {
        const data = response.data;
        console.log('백엔드에서 받은 데이터:', data);

        const topTrendingStories = data.storySummaries.trendingStories.slice(0, 5);
        setTrends(topTrendingStories);
      })
      .catch(error => {
        console.error('요청 중 오류 발생:', error);
      });

  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>codehive : 실시간 인기 검색어</p>
        <ul>
          {trends.map((story, index) => (
            <li key={index}>{story.title}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
