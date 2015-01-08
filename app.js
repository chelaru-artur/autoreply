var url = require('url');
var fs = require('fs');
var Twitter = require('twitter');
// get and set current directory
//when starting in crone the current working directori is /user/home/
var CWD = process.argv[1].split('/').slice(0, -1).join('/');
process.chdir(CWD);


var client = new Twitter({
	consumer_key: 'e34EKG7g1ZEfq1yCaY7cY6N2H',
	consumer_secret: '6uNqFk6il8au7feW8rE87WdrzYuAqPqgZMbWQG6n4dUrSOcNlq',
	access_token_key: '2966488821-pO3NYNDldgWheNQrDnpTwyg2vP4yEChqFydbf0g',
	access_token_secret: 'xu9tyicy54LbZWP2etpw6E874ZjqWLtHl6KJwDVvxJCUS'
});
var CONFIG = 'config.json';
var config = getConfig();
var QUERY  = 'very sad'; // search querry

function reply(status, callback) {
	var message = '@' + status.user.screen_name + ' ' + randomMsg();
	client.post('/statuses/update.json', {
			status: message,
			in_reply_to_status_id: status.id_str
		},
		function(err, data) {
			if (err !== null) {
				callback(err);
				return;
			}
			addLog('sent message: ' + data.text);
			//			console.log(data);

		});
}


function getConfig() {

	fs.writeFileSync(CONFIG, '', {
		flag: 'a'
	}); // create config file if doesn't exist else  append nothing
	var config = fs.readFileSync(CONFIG, 'utf8'); // read config file;
	// check if valid json
	try {
		var cfg = JSON.parse(config);
	} catch (e) {
		return {};
	}
	return cfg;
}

function addLog(str) {
	var LOG = 'log.txt';
	var date = new Date();
	var msg = date + '  ' + str + '\n';
	fs.writeFileSync(LOG, msg, {
		flag: 'a'
	});
}


function randomMsg() {
	var messages = JSON.parse(fs.readFileSync('messages.json', 'utf8'));
	return messages[Math.floor(Math.random() * messages.length)];
}

var search = function() {
	var params = (config.params) ? config.params : {
		q: QUERY,
		count: 8
	};

	client.get('/search/tweets.json', params,
		function(err, data) {
			if (err) addLog(JSON.stringify(err));
			// reply statuses , if err then it will be saved to log.txt
			data.statuses.forEach(function(status) {
				reply(status, function(err) {
					if (err) {
						addLog(JSON.stringify(err.data));
						return;
					}
				});
			});
			// set params for next search and write them to config.json
			if (data.search_metadata.next_results) {
				config.params = url.parse(data.search_metadata.next_results, true).query;
			} else {
				addLog('no more data');
			}
			fs.writeFile(CONFIG, JSON.stringify(config), function(err) {
				if (err) throw err;
			});

		});
};


search();