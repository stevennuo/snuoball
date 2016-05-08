const _ = require('lodash');

const getCookieString = (cookie) => {
    return _.chain(cookie)
        .toPairs()
        .map((x) => `${x[0]}=${x[1]}`)
        .value()
        .join(';');
};

const cube = {
    mkt2flt: (o) => {
        return {
            name: o.name,
            exchange: `zh${o.market}`.toUpperCase()
        }
    },
    flt2mkt: (o) => {
        return {
            name: o.name,
            market: o.exchange.toLowerCase().replace('zh','')
        }
    }
}

module.exports = {
    getCookieString, cube
}
