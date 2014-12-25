var url = require('url')
var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: 'hKgxd0lLBZ4ytTKKW1mCHmnLL',
    consumer_secret: 'ELVOqmJQ1AEMXs2WHZqB2oiE9nEmZzl2owQitnWvhnqC1OTtaJ',
    access_token_key: '2939314121-gJlJTracDFDhPeqcOKWQltuv89vY0TOAF2dUHqE',
    access_token_secret: '1nKPTx4kmq0XEwm1alO1z5LXxnxjLe0XVBPmmAsuqxeeH'
});


    var query = 'happy birthday'
    var status = 'just testing reply';
    var k = 0;


    var reply = function(statuses) {
        statuses.forEach(function(s, index) {
            var message = '@' + s.user.screen_name + ' ' + index + ') ' + status;

            client.post('/statuses/update.json', {
                    status: message,
                    in_reply_to_status_id: s.id_str
                },
                function(err, data) {
                    k += 1;
                    console.log(err);
                    console.log(message);
                    console.log('sent to: %d statuses ', k);
                });
        });
    };

    var search = function(params) {
        client.get('/search/tweets.json', params,
            function(err, data) {
                if (data.search_metadata.next_results != undefined) {
                    var parms = url.parse(data.search_metadata.next_results, true).query; // get params 
                    k += data.statuses.length;
                      reply(data.statuses);

                    setTimeout(search(params),60000);
                } else {
                    if (data.statuses.length > 0)
                        k += data.statuses.length;
                }
                console.log(k);
            });

    };


    search({
        q: query,
        count: 30
    });
