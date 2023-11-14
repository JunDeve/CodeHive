const googleTrends = require("google-trends-api");

exports.handler = async (event) => {
    const apiKey = 'AIzaSyDlCtE421Jns3qDxRM5U6kLrRwvxNIXL7U';
    googleTrends.apiKey = apiKey;

    const keyword = event.queryStringParameters.keyword;

    try {
        const [relatedQueriesResult, relatedTopicsResult] = await Promise.all([
            googleTrends.relatedQueries({
                keyword: keyword,
                geo: 'KR',
                hl: 'KR',
            }),
            googleTrends.relatedTopics({
                keyword: keyword,
                startTime: new Date('2010-01-01'),
                endTime: new Date(),
                hl: 'ko',
            })
        ]);

        // 관련 검색어 결과 파싱
        const parsedQueriesResults = JSON.parse(relatedQueriesResult);
        const topRankedKeywords = parsedQueriesResults.default.rankedList[0].rankedKeyword.slice(0, 5);

        // 관련 주제 결과 파싱
        const relatedTopicsRu = JSON.parse(relatedTopicsResult);
        const TopRankedTopics = relatedTopicsRu.default.rankedList[0].rankedKeyword.slice(0, 5);

        // 두 결과를 결합하여 반환
        return {
            statusCode: 200,
            body: JSON.stringify({ relatedQueries: topRankedKeywords, relatedTopics: TopRankedTopics }),
        };
    } catch (error) {
        console.error("에러 발생: ", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};
