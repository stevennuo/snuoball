const xueqiu = global.config.xueqiu;
const request = require('co-request');

const search = function* (query) {
    const res = yield request({
        uri: xueqiu.search,
        qs: query, // {market:us,code:xxx}
        headers: {
            'Cookie': global.cookie
        }
    });
    const stocks = JSON.parse(res.body).stocks;
    if (stocks.length < 1) {
        yield Promise.reject(new Error(`search failed:\n${res.body}`));
    }
    return stocks;
    // res.body:
    // {"stocks":[{"code":"UWTI","name":"VelocityShares 3x Long Crude Oil ETN","enName":null,"hasexist":null,"flag":1,
    // "type":null,"current":29.11,"chg":0.45,"percent":1.57,"stock_id":1007979,"ind_id":100419,"ind_name":"金融及保险",
    // "ind_color":"#5594e7"}]}
}

module.exports = {
    search,
};
