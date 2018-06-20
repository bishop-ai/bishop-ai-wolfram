var Wolfram = function (config, axios) {

    this.axios = axios;
    var self = this;

    this.intent = [
        {value: "Ask Wolfram [Alpha] *query", trigger: "wolfram.query"}
    ];

    this.triggers = {
        query: function (dfd, expression, utils, data) {

            var appId = config.appId || utils.getMemory('appId');

            var query = data.namedValues.query || "";

            self.query(appId, query, function (error, result) {
                if (error) {
                    console.log("Wolfram: error while querying: " + error);
                    dfd.resolve("Sorry, something went wrong. Please make sure your Wolfram Alpha plugin is set up correctly.");
                } else if (result) {
                    dfd.resolve(result);
                } else {
                    dfd.resolve("I (was unable to|could not|couldn't) find (the|an) answer. [Try (asking|saying) your question (another|a different) way.]");
                }
            });
        }
    };

    if (!config || !config.appId) {
        this.options = {
            appId: {name: "AppID", description: "Your WolframAlpha AppID found at https://developer.wolframalpha.com/portal/myapps/"}
        };
    }
};

Wolfram.prototype.query = function (appId, query, cb) {
    if (!appId) {
        return cb("Application key not set", null);
    }

    var url = 'http://api.wolframalpha.com/v1/spoken?i=' + encodeURIComponent(query) + '&appid=' + appId;
    this.axios({
        method: "get",
        url: url,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }).then(function (response) {
        return cb(null, response.data);
    }).catch(function (error) {
        return cb(error, null);
    });
};

module.exports = {
    namespace: 'wolfram',
    description: 'Interact with Wolfram Alpha',
    examples: [
        "Ask Wolfram how big the earth is"
    ],
    register: function (config, nlp, axios) {
        return new Wolfram(config, axios);
    }
};