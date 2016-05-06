const co = require('co');

// should be above all - modify global.config
const config = require('./config.js');

const user = require('./user.js');

co(function* () {

    const u = yield user.get();

}).catch(function (err) {
    console.error(err);
});
