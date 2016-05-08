const co = require('co');

// should be above all - modify global.config
const config = require('./config');

const user = require('./user');
const stock = require('./stock');
const cube = require('./cube');
const util = require('./util');

co(function* () {


    // user
    yield user.init();

    // cube
    //yield cube.init();
    yield cube.create({name:'hahahah',market:'us'});

}).catch(function (err) {
    console.error(err);
});
