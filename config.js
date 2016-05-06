const domain = 'https://xueqiu.com';
const login = `${domain}/user/login`;
const show = `${domain}/user/show.json`;

global.config = {
    xueqiu:{
        domain,login,show
    },
    user:{
        json: './user.json',
        token: ['s','xq_a_token','xq_r_token']
    }
};

module.exports = global.config;