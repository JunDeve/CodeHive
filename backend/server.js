const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const googleTrends = require("google-trends-api");
const port = process.env.PORT || 5000;
const serp = require('serp');
const wiki = require('wikipedia');
const { google } = require('googleapis');

app.use(cors());

app.get("/", (req, res) => {
  res.send("백엔드 시작화면");
});

// 트렌드 중 일일별 인기(오늘)
app.get("/daytrending", (req, res) => {
  const apiKey = "AIzaSyDlCtE421Jns3qDxRM5U6kLrRwvxNIXL7U";
  googleTrends.apiKey = apiKey;

  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  googleTrends.dailyTrends({
    trendDate: formattedDate,
    geo: 'KR',
  }, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      console.log("오늘 트렌드 : ", results);
      res.json(JSON.parse(results));
    }
  });
});

// 트렌드 중 일일별 인기(어제)
app.get("/yesterdaytrending", (req, res) => {
  const apiKey = "AIzaSyDlCtE421Jns3qDxRM5U6kLrRwvxNIXL7U";
  googleTrends.apiKey = apiKey;

  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;

  googleTrends.dailyTrends({
    trendDate: formattedDate,
    geo: 'KR',
  }, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      console.log("오늘 트렌드 : ", results);
      res.json(JSON.parse(results));
    }
  });
});

// 관련 검색어
app.get("/relatedQueries", (req, res) => {
  const apiKey = "AIzaSyDlCtE421Jns3qDxRM5U6kLrRwvxNIXL7U";
  googleTrends.apiKey = apiKey;

  const keyword = req.query.keyword;

  googleTrends.relatedQueries({
    keyword: keyword,
    geo: 'KR',
    hl: 'KR',
  }, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      const parsedResults = JSON.parse(results);
      topRankedKeywords = parsedResults.default.rankedList[0].rankedKeyword.slice(0, 5);
      console.log("관련 검색어 : ", topRankedKeywords);
<<<<<<< Updated upstream
      // res.json(topRankedKeywords);
      console.log(topRankedKeywords);
=======
      res.json(topRankedKeywords);
>>>>>>> Stashed changes
    }
  }
)});

// 관련 주제
app.get("/relatedTopics", (req, res) => {
  const apiKey = "AIzaSyDlCtE421Jns3qDxRM5U6kLrRwvxNIXL7U";
  googleTrends.apiKey = apiKey;

  const keyword = req.query.keyword;

  const endTime = new Date();
  endTime.setSeconds(endTime.getSeconds() - 1);

  googleTrends.relatedTopics({
    keyword: keyword,
    startTime: new Date('2010-01-01'),
    endTime: endTime,
    hl: 'ko',
  }, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      relatedTopicsRu = JSON.parse(results);
      TopRankedTopics = relatedTopicsRu.default.rankedList[0].rankedKeyword.slice(0, 5);
      console.log("관련 주제 : ", TopRankedTopics);
      res.json(TopRankedTopics);
    }
  });
});

// 검색 기능
app.get("/search", async (req, res) => {
  const KEY = '069d85c726af4bcb8f5ab1bc9fc539aaa86f54e11441f36735f044f87d9f6e53';
  const keyword = req.query.q;
  const options = {
    qs: {
      q: keyword,
      engine: "google",
      location: "South Korea",
      gl: "kr",
      hl: "ko",
      google_domain: "google.co.kr",
      num: 10,
      start: 0,
      safe: "active",
    },
  };

  try {
    const searchResults = await serp.search(options);

    res.json(searchResults);
  } catch (error) {
    console.error("검색 요청 중 에러 : ", error);
  }
});

// 위키 검색 기능
app.get("/wikisearch", async (req, res) => {
  const keyword = req.query.q;
  try {
    await wiki.setLang('ko');

    const page = await wiki.page(keyword);
    console.log("위키 검색 결과", page);

    const summary = await page.summary();
    console.log("검색 결과 요약 : ", summary);

    res.json(summary);
  } catch (error) {
    console.error("검색 요청 중 에러 : ", error);
  }
});

// 유튜브 검색 기능
app.get("/youtubeSearch", async (req, res) => {
  const apiKey = "AIzaSyDlCtE421Jns3qDxRM5U6kLrRwvxNIXL7U";
  const keyword = req.query.q;
  const youtube = google.youtube('v3');

  youtube.search.list({
    key: apiKey,
    q: keyword,
    part: 'snippet',
    type: 'video',
    maxResults: 1,
    videoDuration: 'short', //4분 이하만 받아와짐
    order: 'relevance',
  }, (err, response) => {
    if (err) {
      console.error('YouTube Data API 요청 중 오류 발생:', err);
      res.status(500).json({ error: 'An error occurred while fetching search results' });
    } else {
      const searchResults = response.data.items;
      const videoResults = [];
      for (const item of searchResults) {
        const videoItem = {
          title: item.snippet.title,
          videoId: item.id.videoId,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.default.url
        };
        videoResults.push(videoItem);
      }
      console.log(videoResults);
      res.json(videoResults);
    }
  });
});

// 관심도 변화
app.get("/interestedTime", (req, res) => {
  const apiKey = "AIzaSyDlCtE421Jns3qDxRM5U6kLrRwvxNIXL7U";
  googleTrends.apiKey = apiKey;

  const keyword = req.query.keyword;
  console.log("관심도 변화 키워드 : ", keyword);
  googleTrends.interestOverTime({
    keyword: keyword,
    startTime: new  Date ( Date . now ( )  -  ( 720 * 60 * 60 * 1000 ) ),
    geo: 'KR',
    hl: 'ko',
  }, function (err, results) {
    if (err) {
      console.log(err);
    } else {
      console.log("관심도 변화 : ", results);
      InterestedData = JSON.parse(results);
      res.json(InterestedData);
    }
  });
});


app.listen(port, () => {
  console.log(`>>>> 서버 실행중 : http://localhost:${port}/ <<<<`);
});
