const domain = 'https://xueqiu.com';
const login = `${domain}/user/login`;
const show = `${domain}/user/show.json`;
const precreate = `${domain}/p/create`;
const create = `${domain}/cubes/create.json`;
const search = `${domain}/stock/p/search.json`;
const list = `${domain}/v4/stock/portfolio/stocks.json`;

global.config = {
    // cookie: will be set in index.js
    user: {
        json: './user.json',
        token: ['s', 'xq_a_token', 'xq_r_token']
    },
    xueqiu: {
        domain, login, show, precreate, create, search, list,
    },
    default: {
        cube: [
            {
                // 美股
                name: '界哀丝',
                market: 'us'
            },
            {
                // A股
                name: '诺德',
                market: 'cn'
            }
        ],
        onepercent:{
            us: 'spy',
            cn: '中国石油'
        }
    }
};

module.exports = global.config;