var url = require('url')
var Twitter = require('twitter');
var CronJob = require('cron').CronJob;

var client = new Twitter({
    consumer_key: 'hKgxd0lLBZ4ytTKKW1mCHmnLL',
    consumer_secret: 'ELVOqmJQ1AEMXs2WHZqB2oiE9nEmZzl2owQitnWvhnqC1OTtaJ',
    access_token_key: '2939314121-gJlJTracDFDhPeqcOKWQltuv89vY0TOAF2dUHqE',
    access_token_secret: '1nKPTx4kmq0XEwm1alO1z5LXxnxjLe0XVBPmmAsuqxeeH'
});


var query = 'today was  bad day'
var status = 'Dont worry, be happy!';
var index = 0
var k = 0;


var reply = function(statuses) {

    for (var i = 0; i < statuses.length; i++) {
        var message = '@' + statuses[i].user.screen_name + ' ' + index + ') ' + status;
        index++;
        client.post('/statuses/update.json', {
                status: message,
                in_reply_to_status_id: statuses[i].id_str
            },
            function(err, data) {
                k++;
                console.log(err);
                console.log('sent to: %d statuses ', k);
            });
    };
};

var search = function(params) {
    client.get('/search/tweets.json', params,
        function(err, data) {
            if (data.search_metadata.next_results != undefined) {
                parms = url.parse(data.search_metadata.next_results, true).query; // get params 
                reply(data.statuses);
            } else {
                if (data.statuses.length > 0)
                    reply(data.statuses);
            }
        });
};

var params = {
    q: query,
    count: 20
}; ///initialize params q: search query, count: numer of returnet statuses

var CronJob = require('cron').CronJob;

var job = new CronJob({
    cronTime: '* 0,30 * * * *',
    onTick: function() {
        var date = new Date();
        var hour = date.getHours();
        var min = date.getMinutes();
        var sec = date.getSeconds();
        console.log(hour, ' : ', min, ' : ', sec);
        // runs every  minute
        search(params);
    },
    start: true
});
job.start();