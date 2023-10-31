const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const googleTrends = require("google-trends-api");
const port = process.env.PORT || 5000;

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
      geo: "US",
      category: "all",
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
    endTime: endTime,
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

  try {
    const response = await axios.get(
      `https://serpapi.com/search.json?engine=google&q=Coffee`
      // `https://serpapi.com/search.json?engine=google&q=${keyword}&location=South Korea&hl=ko&gl=kr&google_domain=google.co.kr&num=10&start=10&safe=active&api_key=${KEY}`
    );
    const searchData = response.data;
    res.json(searchData);
  } catch (error) {
    console.error("요청 중 오류 발생:", error);
  }
});


app.listen(port, () => {
  console.log(`>>>> 서버 실행중 : http://localhost:${port}/ <<<<`);
});
