const delay = require("mocker-api/utils/delay");

const proxy = {
    _proxy: {
        proxy: {
            "/gateway/*": "http://192.168.1.12:9001",
            "/boss/*": "http://192.168.1.12:2002",
            "/boss-server/*": "http://192.168.1.12:6005",
            "/ticket/*": "http://192.168.1.12:6014",
            "/chat/*": "http://192.168.1.12:8080"
        }
    }
};

module.exports = delay(proxy, 1500);
