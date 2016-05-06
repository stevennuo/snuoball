const _ = require('lodash');
const cookie = require('cookie');
const request = require('co-request');
const crypto = require('crypto');
const fsp = require('fs-promise');
const STATUS = require('http-status');

const config = global.config.user;
const xueqiu = global.config.xueqiu;

const get = function* () {
    const user = require(config.json);
    if (!user.password) yield Promise.reject(new Error('password cant be empty'));
    if (user.password.length != 32) user.password = crypto.createHash('md5').update(user.password).digest("hex");
    const success = yield test(user);
    //if(success) return user;
    //else return yield login(user);
};

const getCookieString = (cookie) => {
    
};

const test = function* (user) {
    const res = yield request({
        uri: xueqiu.show,
        headers: {
            'Cookie': cookie.serialize(user.cookie)
        }
    });

    console.log(cookie.serialize(user.cookie))
    console.log(res.statusCode);
    console.log(res.body);

    if(res.statusCode === STATUS.OK){

    } else {

    }
    return user;
};

const login = function* (user) {
    const res = yield request({
        uri: xueqiu.login,
        form: _.pick(user, ['areacode', 'password', 'telephone']),
        method: 'POST'
    });

    //{
    //    'header': {
    //        'set-cookie': [
    //            's=xxxxxxxxxx; domain=.xueqiu.com; path=/; expires=Thu, 04 May 2017 14:30:35 GMT; httpOnly',
    //            'xq_a_token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx; domain=.xueqiu.com; path=/; httpOnly',
    //            'xqat=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx; domain=.xueqiu.com; path=/; httpOnly',
    //            'xq_r_token=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx; domain=.xueqiu.com; path=/; httpOnly',
    //            'xq_is_login=1; domain=xueqiu.com; path=/; expires=Invalid Date',
    //            'u=xxxxxxxxxx; domain=.xueqiu.com; path=/; httpOnly'],
    //    }
    //}
    const cookies = res.headers['set-cookie'];
    const obj = _.chain(cookies)
        .map(cookie.parse)
        .reduce(_.extend)
        .pick(config.token)
        .value();
    if(Object.keys(obj).length == config.token.length){
        // success = no key missing
        user.cookie = obj;
        yield fsp.writeFile(config.json, JSON.stringify(user, null, 4));
    } else { // failed
        yield Promise.reject(new Error(`login failed:\n${cookies}`));
    }

    console.log(user);
    return user;
};

module.exports = {
    get
};

