import "./App.css";
import axios from "axios";
import React, { useEffect, useState } from 'react';

function App() {
  const [trends, setTrends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [daytrends, setDayTrends]=  useState([]);
  const keyword = 'abc';

  // 구글 서치 데이터
  useEffect(() => {
    axios.get(`http://localhost:5000/search?q=${keyword}`)
      .then(response => {
        const searchData = response.data;
        console.log("백엔드에서 받은 검색 결과:", searchData);
        const firstTenResults = searchData.organic_results.slice(0, 5);
        setSearchResults(firstTenResults);
      })
      .catch(error => {
        console.error("요청 중 오류 발생:", error);
      });
  }, [keyword]);

  // 구글 트랜드 데이터
  useEffect(() => {
    axios
      .get("http://localhost:5000/trending")
      .then(response => {
        const trendData = response.data;
        console.log("백엔드에서 받은 트렌드 데이터:", trendData);

        const topTrendingStories = trendData.storySummaries.trendingStories.slice(0, 5);
        setTrends(topTrendingStories);
      })
      .catch((error) => {
        console.error("요청 중 오류 발생:", error);
      });

      axios
      .get("http://localhost:5000/daytrending")
      .then(response => {
        const daytrendData = response.data;
        console.log("백엔드에서 받은 일일 트렌드 데이터:", daytrendData);

        // 여기를 고쳐야합니다. 일일 트렌드 데이터 경로는 default 안에 있는 trendingSearchesDays 배열 안에 있는 trendingSearches 배열안에 있는 title 과 formattedTraffic 을 가져오면 됩니다.
        // const DayTrendingStories  = daytrendData.default.trendingSearchesDays.trendingSearches.slice(0,5);
        // setDayTrends(DayTrendingStories);
      })
      .catch((error) => {
        console.error("요청 중 오류 발생:", error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>서치확인</p>
        <ul>
          {searchResults.map((result, index) => (
            <ul key={index}>{result.title} <hr/> {result.link}</ul>
          ))}
        </ul>
        <p>실시간 인기 검색어</p>
        <ul>
          {trends.map((story, index) => (
            <li key={index}>{story.title}</li>
          ))}
        </ul>
        <p>일별 인기 급상승 검색어</p>
        <ul>
          {daytrends.map((daystory, index) => (
            <li key={index}>{daystory.title}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;
