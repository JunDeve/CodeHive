import React,{useState,useEffect} from 'react';
import Main from '../src/MainPage/Main';
import HomePage from '../src/ProjectHome/Home';
import Search from '../src/Search/Main/Searchmain';
import TextPage from './TextPage/TextPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from "axios";

function App() {
  const itemList = ["운동", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7"];
  const sevaitemList = ["운동", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8"];//searchText 의 값을 받아와야댐

  const [trends, setTrends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [daytrends, setDayTrends] = useState([]);
  const [relatedQueries, setRelatedQueries] = useState([]);
  const [relatedTopics_, setRelatedTopics_] = useState([]);
  const [wikisearchResults, setwikisearchResults] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    // 구글 서치 데이터
    const fetchSearchData = async (keyword) => {
      try {
        const response = await axios.get(`http://localhost:5000/search?q=${keyword}`);
        const searchData = response.data;
        console.log("백엔드에서 받은 검색 결과:", searchData);
        const firstTenResults = searchData.slice(0, 5);
        setSearchResults(firstTenResults);
      } catch (error) {
        console.error("요청 중 오류 발생:", error);
      }
    };

    // 구글 트렌드 데이터
    const fetchTrendData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/trending");
        const trendData = response.data;
        console.log("백엔드에서 받은 트렌드 데이터:", trendData);

        const topTrendingStories = trendData.storySummaries.trendingStories.slice(0, 5);
        setTrends(topTrendingStories);
      } catch (error) {
        console.error("요청 중 오류 발생:", error);
      }
    };

    // 일일 트렌드 데이터
    const fetchDayTrendData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/daytrending");
        const daytrendData = response.data;
        console.log("백엔드에서 받은 일일 트렌드 데이터:", daytrendData);

        const DayTrendingStories = daytrendData.default.trendingSearchesDays[0];
        const DayTrendingStories_2 = DayTrendingStories.trendingSearches.slice(0, 5);

        setDayTrends(DayTrendingStories_2);
      } catch (error) {
        console.error("요청 중 오류 발생:", error);
      }
    };

    // 관련 검색어
    const fetchRelatedQueries = async (newKeyword) => {
      try {
        const response = await axios.get(`http://localhost:5000/relatedQueries?keyword=${newKeyword}`);
        const relatedQueriesData = response.data;
        console.log("백엔드에서 받은 관련 검색어:", relatedQueriesData);
        setRelatedQueries(relatedQueriesData.default.rankedList[0].rankedKeyword.slice(0, 5));
      } catch (error) {
        console.error("요청 중 오류 발생:", error);
      }
    };

    // 관련 주제
    const fetchRelatedTopics = async (newKeyword) => {
      try {
        const response = await axios.get(`http://localhost:5000/relatedTopics?keyword=${newKeyword}`);
        const relatedTopicsData = response.data;
        console.log("백엔드에서 받은 관련 주제:", relatedTopicsData);
        const relatedTopics_1 = relatedTopicsData.default.rankedList[0].rankedKeyword.slice(0, 5);

        setRelatedTopics_(relatedTopics_1);
      } catch (error) {
        console.error("요청 중 오류 발생:", error);
      }
    };

    // 위키 서치 데이터
    const fetchwikiSearchData = async (keyword) => {
      try {
        const response = await axios.get(`http://localhost:5000/wikisearch?q=${keyword}`);
        const wikisearchData = response.data;
        console.log("백엔드에서 받은 위키 검색 결과:", wikisearchData);
        const wikifirstTenResults = wikisearchData.slice(0, 5);
        setwikisearchResults(wikifirstTenResults);
      } catch (error) {
        console.error("요청 중 오류 발생:", error);
      }
    };

    if (keyword !== '') {
      fetchSearchData(keyword)
        .then(() => fetchTrendData())
        .then(() => fetchDayTrendData())
        .then(() => fetchRelatedQueries(keyword))
        .then(() => fetchwikiSearchData(keyword))
        .then(() => fetchRelatedTopics(keyword));
    }
  }, [keyword]);

  // 버튼을 클릭했을 때
  const handleSearch = (newKeyword) => {
    setKeyword(newKeyword);
  };


  return (
    <> <Router>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/HomePage" element={<HomePage />} />
      <Route path="/Search" element={<Search items={itemList} sevaitemList={sevaitemList} />} />
      <Route path="/TextPage" element={<TextPage/>}/>
    </Routes>
  </Router>
  
  <div className="App">
      <header className="App-header">
        <p>서치확인</p>
        <input
          type="button"
          value="자전거"
          onClick={() => handleSearch('자전거')}
        />
        <ul>
          {searchResults.map((result, index) => (
            <li key={index}>
              <div>{result.title}</div>
              <div>{result.url}</div>
            </li>
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
            <li key={index}>{daystory.title.query}, {daystory.formattedTraffic}</li>
          ))}
        </ul>
        <p>관련 검색어</p>
        <ul>
          {relatedQueries.map((query, index) => (
            <li key={index}>{query.query}</li>
          ))}
        </ul>
        <p>관련 주제</p>
        <ul>
          {relatedTopics_.map((topic, index) => (
            <li key={index}>{topic.topic.title}</li>
          ))}
        </ul>
      </header>
    </div>
  
  
  </>
 



  );
}

export default App;