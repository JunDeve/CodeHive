const express = require('express');
const cors = require('cors');
const app = express();
const googleTrends = require('google-trends-api');
const port = process.env.PORT || 5000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('백엔드 시작화면');
});

// 트렌드 중 실시간 인기(24시간 올카테고리)
app.get('/trending', (req, res) => {
  const apiKey = 'AIzaSyDlCtE421Jns3qDxRM5U6kLrRwvxNIXL7U';
  googleTrends.apiKey = apiKey;

  googleTrends.realTimeTrends({
    geo: 'US' , category: 'all'
  }, function(err, results) {
    if (err) {
      console.log(err);
    } else {
      console.log('실시간 트렌드 : ', results);
      // res.json(results);
      res.json(JSON.parse(results));
    }
  })
});

app.listen(port, () => {
  console.log(`>>>> 서버 실행중 : http://localhost:${port}/ <<<<`);
});
