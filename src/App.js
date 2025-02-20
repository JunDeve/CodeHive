import React, { useState, useEffect } from 'react';
import Main from '../src/MainPage/Main';
import HomePage from '../src/ProjectHome/Home';
import Search from '../src/Search/Main/Searchmain';
import TextPage from './TextPage/TextPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';

function App() {
  const itemList = ["운동", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7"];
  const sevaitemList = ["운동", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8"];

  const [searchResults, setSearchResults] = useState([]);
  const [daytrends, setDayTrends] = useState([]);
  const [yesterdaytrends, setYesterDayTrends] = useState([]);
  const [relatedQueries, setRelatedQueries] = useState([]);
  const [relatedTopics_, setRelatedTopics_] = useState([]);
  const [wikisearchResults, setWikisearchResults] = useState([]);
  const [YoutubesearchResults, setYoutubeSearchRusults] = useState([]);
  const [interestedDataResults, setinterestedDataResults] = useState([]);
  const [keyword, setKeyword] = useState('');

  const apiKey = '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';
  const endpoint = 'https://api.openai.com/v1/chat/completions';

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchSearchData(keyword);
        await fetchDayTrendData();
        await fetchYesterDayTrendData();
        // await fetchRelatedQueries(keyword);
        // await fetchRelatedTopics(keyword);
        // await fetchinterestedTime(keyword);
        // await fetchWikisearchData(keyword);
        await fetchYoutubeSearchData(keyword);
        await fetchChatGPTData(keyword);
      } catch (error) {
        console.error('에러 발생:', error);
      }
    };

    if (keyword !== '') {
      fetchData();
    }
  }, [keyword]);

  const fetchSearchData = async (keyword) => {
    try {
      const response = await axios.get(`http://localhost:5000/search?q=${keyword}`);
      const searchData = response.data;
      console.log('백엔드에서 받은 검색 결과:', searchData);
      setSearchResults(searchData);
    } catch (error) {
      console.error('이미지 검색 에러:', error.message);
    }
  };

  const fetchDayTrendData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/daytrending");
      const daytrendData = response.data;
      console.log('백엔드에서 받은 일일 트렌드 데이터:', daytrendData);

      const DayTrendingStories = daytrendData.default.trendingSearchesDays[0];
      const DayTrendingStories_2 = DayTrendingStories.trendingSearches.slice(0, 5);

      setDayTrends(DayTrendingStories_2);
    } catch (error) {
      console.error('요청 중 오류 발생:', error);
    }
  };

  const fetchYesterDayTrendData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/yesterdaytrending");
      const daytrendData = response.data;
      console.log('백엔드에서 받은 어제 트렌드 데이터:', daytrendData);

      const YesterdayDayTrendingStories = daytrendData.default.trendingSearchesDays[1];
      const YesterdayDayTrendingStories_2 = YesterdayDayTrendingStories.trendingSearches.slice(0, 5);

      setYesterDayTrends(YesterdayDayTrendingStories_2);
    } catch (error) {
      console.error('요청 중 오류 발생:', error);
    }
  };

  const fetchRelatedQueries = async (newKeyword) => {
    try {
      const response = await axios.get(
        `https://asia-northeast3-powerful-anchor-405101.cloudfunctions.net/relatedQueries?keyword=${newKeyword}`,
        { withCredentials: true, headers: { 'Access-Control-Allow-Origin': '*' } }
      );

      const relatedQueriesData = response.data;
      console.log('백엔드에서 받은 관련 검색어:', relatedQueriesData);
      setRelatedQueries(relatedQueriesData);
    } catch (error) {
      console.error('요청 중 오류 발생:', error);
    }
  };

  const fetchRelatedTopics = async (newKeyword) => {
    try {
      const response = await axios.get(`https://us-central1-powerful-anchor-405101.cloudfunctions.net/relatedTopics?keyword=${newKeyword}`);
      const relatedTopicsData = response.data;
      console.log('백엔드에서 받은 관련 주제:', relatedTopicsData);
      const relatedTopics_1 = relatedTopicsData;
      setRelatedTopics_(relatedTopics_1);
    } catch (error) {
      console.error('요청 중 오류 발생:', error);
    }
  };

  const fetchChatGPTData = async (query) => {
    try {
      const response = await axios.post(
        endpoint,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: query },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const chatGPTData = response.data.choices[0].message.content;
      console.log('OpenAI 채팅 결과:', chatGPTData);
      // 이후 chatGPTData를 활용한 작업을 진행할 수 있습니다.
    } catch (error) {
      console.error('OpenAI 채팅 요청 중 에러:', error);
    }
  };

  const fetchWikisearchData = async (keyword) => {
    try {
      const response = await axios.get(`http://localhost:5000/wikisearch?q=${keyword}`);
      const wikisearchData = response.data;
      const updatedResults = [
        ...wikisearchResults,
        {
          title: wikisearchData.title,
          extract: wikisearchData.extract,
          image: wikisearchData.originalimage.source,
        },
      ];

      console.log('백엔드에서 받은 위키 서치 데이터:', updatedResults);
      setWikisearchResults(updatedResults);
    } catch (error) {
      console.error('요청 중 오류 발생:', error);
    }
  };

  const fetchYoutubeSearchData = async (keyword) => {
    try {
      const response = await axios.get(`http://localhost:5000/youtubeSearch?q=${keyword}`);
      const youtubeSearchData = response.data;
      console.log('백엔드에서 받은 유튜브 서치 데이터:', youtubeSearchData);
      setYoutubeSearchRusults(youtubeSearchData);
    } catch (error) {
      console.error('요청 중 오류 발생:', error);
    }
  };

  const fetchinterestedTime = async (newKeyword) => {
    try {
      const response = await axios.get(`http://localhost:5000/interestedTime?keyword=${newKeyword}`);
      const interestedData = response.data;
      console.log('백엔드에서 받은 관심도 변화:', interestedData);

      setinterestedDataResults(interestedData.default.timelineData);
    } catch (error) {
      console.error('요청 중 오류 발생:', error);
    }
  };

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/Search" element={<Search items={itemList} sevaitemList={sevaitemList} />} />
          <Route path="/TextPage" element={<TextPage />} />
        </Routes>
      </Router>

      <div className="App">
        <header className="App-header">
          <p>서치확인</p>
          <hr />
          <input
            type="button"
            value="자전거"
            onClick={() => setKeyword('자전거')}
          />
          <br />
          <p>일별 인기 급상승 검색어(오늘)</p>
          <hr />
          <ul>
            {daytrends.map((daystory, index) => (
              <li key={index}>{daystory.title.query}, {daystory.formattedTraffic}</li>
            ))}
          </ul>
          <br />
          <p>일별 인기 급상승 검색어(어제)</p>
          <hr />
          <ul>
            {yesterdaytrends.map((daystory2, index) => (
              <li key={index}>{daystory2.title.query}, {daystory2.formattedTraffic}</li>
            ))}
          </ul>
          <br />
          <p>관련 검색어</p>
          <hr />
          <ul>
            {relatedQueries.map((query, index) => (
              <li key={index}>{query.query}</li>
            ))}
          </ul>
          <br />
          <p>관련 주제</p>
          <hr />
          <ul>
            {relatedTopics_.map((topic, index) => (
              <li key={index}>{topic.topic.title}</li>
            ))}
          </ul>
          <br />
          <p>위키 서치 데이터</p>
          <hr />
          <ul>
            {wikisearchResults.map((wiki, index) => (
              <li key={index}>
                <div>
                  <p>제목 : {wiki.title}</p>
                  <p>요약 : {wiki.extract}</p>
                  <p>이미지: <img src={wiki.image} alt={wiki.title} style={{ maxWidth: '100%', height: 'auto' }} /></p>
                </div>
              </li>
            ))}
          </ul>
          <br />
          <p>유튜브 서치 데이터</p>
          <hr />
          <ul>
            {YoutubesearchResults.map((youtubeSearchRusults, index) => (
              <li key={index}>
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${youtubeSearchRusults.videoId}?controls=0&rel=0&showinfo=0&modestbranding=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </li>
            ))}
          </ul>
          <br />
          <p>시간 흐름에 따른 관심도 변화(지난 30일)</p>
          <hr />
          <ul>
            {interestedDataResults.map((interest, index) => (
              <React.Fragment key={index}>
                <li>날짜 : {interest.formattedAxisTime}</li>
                <li>값 : {interest.value}</li>
              </React.Fragment>
            ))}
          </ul>
        </header>
      </div>
    </>
  );
}

export default App;
