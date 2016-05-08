const _ = require('lodash');
const cheerio = require('cheerio');
const request = require('co-request');

const stock = require('./stock');
const util = require('./util');

const xueqiu = global.config.xueqiu;

const list = function* () {
    const res = yield request({
        uri: xueqiu.list,
        qs: {
            size: 1000,
            category: 1,
            type: 1
        },
        headers: {
            'Cookie': global.cookie
        }
    });
    const stocks = JSON.parse(res.body).stocks;
    if (!stocks) {
        yield Promise.reject(new Error(`cube list failed:\n${res.body}`));
    }
    return stocks;
    // res.body
    // {"stocks":[{"code":"ZH865235","comment":"","sellPrice":-1.0,"buyPrice":-1.0,"portfolioIds":"-1,",
    // "createAt":1462686563909,"targetPercent":-1.0,"isNotice":1,"stockName":"name777","exchange":"ZHUS"}]
};

const create = function* (mkt) {
    // precreate
    let res = yield request({
        uri: xueqiu.precreate,
        headers: {
            'Cookie': global.cookie,
        }
    });
    const $ = cheerio.load(res.body);
    const token = $('#cubeEdit').attr('data-crsftoken');
    if (!token) return yield Promise.reject(new Error(`precreate token parse failed:\n${res.body}`));

    const code = global.config.default.onepercent[mkt.market];
    res = yield stock.search({code,market: mkt.market});
    const constituent = res[0];

    //console.log(token)
    //console.log(constituent)

    //// create
    //const form = {
    //    name:mkt.name,
    //    cash:99,
    //    market:mkt.market,
    //    holdings:[{"code":"UWTI","name":"VelocityShares 3x Long Crude Oil ETN","enName":null,"hasexist":null,"flag":1,"type":null,"current":29.11,"chg":0.45,"percent":"1.57","stock_id":1007979,"ind_id":100419,"ind_name":"金融及保险","ind_color":"#5594e7","textname":"VelocityShares 3x Long Crude Oil ETN(UWTI)","segment_name":"金融及保险","weight":1,"url":"/S/UWTI","proactive":true,"price":"29.11"}]
    //    session_token:token
    //}
    //res = yield request({
    //    uri: xueqiu.create,
    //    method: 'POST',
    //    headers: {
    //        'Cookie': global.cookie,
    //        'Referer': 'https://xueqiu.com/p/create'
    //    },
    //    form
    //});
    //console.log(res.body)
    //const stocks = JSON.parse(res.body).stocks;
    //if (!stocks) {
    //    yield Promise.reject(new Error(`cube list failed:\n${res.body}`));
    //}
    //return stocks;
    // res.body
    // {"stocks":[{"code":"ZH865235","comment":"","sellPrice":-1.0,"buyPrice":-1.0,"portfolioIds":"-1,",
    // "createAt":1462686563909,"targetPercent":-1.0,"isNotice":1,"stockName":"name777","exchange":"ZHUS"}]
};

const init = function* () {
    const lst = yield list();
    const user = global.user.cube || [];
    for (cb of global.config.default.cube) {
        // 用户配置 or 默认配置
        cb = _.find(user, ['market', cb.market]) || cb;
        //console.log(cb);

        // 如果没有就创建
        const filter = util.cube.mkt2flt(cb);
        //if(!_.some(lst, filter)) create(filter);
    }
};


module.exports = {
    create, list, init
};