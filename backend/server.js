const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const googleTrends = require("google-trends-api");
const port = process.env.PORT || 5000;
const serp = require('serp');
const wiki = require('wikipedia');
// const youtubesearchapi = require("youtube-search-api");
const { google } = require('googleapis');

app.use(cors());

app.get("/", (req, res) => {
  res.send("백엔드 시작화면");
});

// 트렌드 중 실시간 인기(24시간 올카테고리)
app.get("/trending", (req, res) => {
  const apiKey = "AIzaSyDlCtE421Jns3qDxRM5U6kLrRwvxNIXL7U";
  googleTrends.apiKey = apiKey;

  googleTrends.realTimeTrends(
    {
      geo: 'US',
      hl: 'ko',
      category: 'all',
    },
    function (err, results) {
      if (err) {
        console.log(err);
      } else {
        console.log("실시간 트렌드 : ", results);
        // res.json(results);
        res.json(JSON.parse(results));
      }
    }
  );
});

// 트렌드 중 일일별 인기
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
      console.log("일일 트렌드 : ", results);
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
      console.log("관련 검색어 : ", results);
      res.json(JSON.parse(results));
    }
  });
});

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

      console.log("관련 주제 : ", results);
      res.json(JSON.parse(results));
    }
  });
});

// 검색 기능
app.get("/search", async (req, res) => {
  const KEY = '400cee3fddff018623f67a238776b71999f8345693a1353b190ced2c7700deb2';
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

// // 유튜브 검색 기능
// app.get("/youtubeSearch", async (req, res) => {
//   const keyword = req.query.q;
//   console.log("유튜브 키워드 : ", keyword);
//   youtubesearchapi.GetListByKeyword(keyword, true, 1, [{ 
//     type: "video",
//     isLive: "false",
//    }])
//     .then((searchResults) => {
//       console.log("유튜브 검색 결과 : ", searchResults);
//       res.json({ results: searchResults });
//     })
//     .catch((error) => {
//       res.status(500).json({ error: "An error occurred while fetching search results" });
//     });
// });

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


app.listen(port, () => {
  console.log(`>>>> 서버 실행중 : http://localhost:${port}/ <<<<`);
});
