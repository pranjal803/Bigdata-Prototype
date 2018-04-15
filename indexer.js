let db = require('./services/redis');
let axios = require('axios');

function startIndexer() {
    setInterval(async function() {
        try {

            let count = await db.listLength('searchQueue');

            for (var i = 0; i < count; i++) {

                let queObj = await db.rpoplpush('searchQueue', 'completedQueue');

                let popObj = JSON.parse(queObj);

                let resp = await axios({
                    url: 'http://localhost:9200/plan/' + popObj.plan.objectType +'/'+ popObj.plan.objectId,
                    method: popObj.method,
                    data: popObj.plan
                });                

            }

            return false;

        } catch (e) {
            console.log(e);
        }

    }, 5 * 1000);
}

module.exports = {
    startIndexer
}