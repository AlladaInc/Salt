var CONFIG = require('./../config/config');
var APP = require('./app');
var LANG = require('./lang');

var CRYPTO = require('crypto');
var OS = require('os');
var HTTP = require('http');

class WEB_APP extends APP {
    constructor (request, response) {
        super(request, response);

        request.on('close', () => {
            this.clientClosed();
        });
        
        this.closing = false;
        this.timers = new Set();

        this.currentReq = request;
        this.currentResp = response;
        this.ip = this.getIP();
        this.ipVersion = this.getIPVersion();
        this.remotePort = this.getRemotePort();
        this.id = this.getGUID();
        this.currentReq.connection.setNoDelay(true);
        this.setHeader('Transfer-Encoding', 'chunked');
        this.route();
    }
    done () {
        this.close();
    }
    forceClose () {
        this.closing = true;
        this.currentResp.end();
        this.currentResp = null;
        this.currentReq.socket.destroy();
        this.currentReq = null;
        this.log('App instance closed!');
        this.closed();
    }
    close (time_limit) {
        var was_closing = super.close(time_limit);
        if (was_closing) {
            return was_closing;
        }
        this.log('Trying to close app instance...');
        if (time_limit !== undefined) {
            this.setTimeout(() => {
                this.log('App instance forced closed due to timeout');
                this.forceClose();
            }, time_limit * 1000);
        }
        var waitFn = () => {
            if (this.canClose()) {
                this.currentResp.end(() => {
                    this.forceClose();
                });
            } else {
                this.setTimeout(() => {
                    waitFn();
                }, 100);
            }
        };
        waitFn();
    }
    clientClosed () {
        this.log('Client closed connection');
        this.close();
    }
    getGUID () {
        var hostShaSum = CRYPTO.createHash('sha1');
        hostShaSum.update(OS.hostname());

        var hostname = hostShaSum.digest('hex').substr(0, 8);
        var time = parseInt((new Date()).getTime() / 1000).toString(16); // in hex
        var random = parseInt(Math.random() * 0xFFFF).toString(16);
        var next_num = (this.getAppNum() % 0xFFFF);
        var ip = this.ip; // FFFFFFFF

        if (this.ipVersion === 4) {
            let a = ip.split('.');
            let buf = new Buffer(4);
            for(var i = 0; i < 4; i++){
                buf.writeUInt8(a[i], i);
            }
            ip = buf.readUInt32BE(0).toString(16);
        }
        if (this.ipVersion !== 4) {
            let shasum = CRYPTO.createHash('sha1');
            shasum.update(ip);
            ip = shasum.digest('hex').substr(0, 8);
        }
        return `${ ('00000000' + hostname).slice(-8) }-${ ('0000' + time.substr(0, 4)).slice(-4) }-${ ('0000' + time.substr(4)).slice(-4) }-${ ('0000' + next_num).slice(-4) }-${ ('000000' + ip).slice(-6) }${ ('000000' + random).slice(-6) }`;
        // example:
        // 21EC2020-3AEA-4069-A2DD-08002B30309D
    }
    getIP () {
        return this.currentReq.connection.remoteAddress;
    }
    getIPVersion () {
        return Number(this.currentReq.connection.remoteFamily.replace(/^IPv/, ''));
    }
    getRemotePort () {
        return this.currentReq.connection.remotePort;
    }
    log (msg) {
        console.log(`${ this.id } - ${ msg }`);
    }
    getRoutingString () {
        switch (this.currentReq.method) {
            case 'GET':
            case 'POST':
                break;
            default:
                this.securityError(LANG.ERROR_CANNOT_HANDLE_REQUEST_METHOD, this.currentReq.method);
        }
        
        var url = this.currentReq.url;
        if (url.substr(0, 1) === '/') {
            url = url.substr(1);
        }
        return url;
    }
    send (data) {
        return this.currentResp.write(data, 'utf8');
    }
    setHeader (name, value) {
        return this.currentResp.setHeader(name, value);
    }
    static run (port) {
        this.listenPort = port;
        console.log('App initiating...');
        this.tryInit();
    }
    static initiate () {
        console.log('App Initiated!');
        console.log(`Server setting up port ${ this.listenPort } for listening...`);
        this.SERVER = HTTP.createServer((...args) => {
            this.incomingRequest(...args);
        }).listen(this.listenPort);
        console.log(`Server listening on port ${ this.listenPort } waiting connections...`);
    }
    static terminate () {
        return new Promise((success) => {
            console.log('Trying to stop listening service...');
            this.SERVER.close(() => {
                console.log('Service no longer listening!');
                success();
            });

            super.terminate();
        });
    }
    static incomingRequest (request, response) {
        if (this.isExiting()) {
            request.socket.destroy();
            response.socket.destroy();
            console.log('Got request, but dropping because app is closing');
            // do nothing as it's exiting
            return;
        }
        return new WEB_APP(request, response);
    }
}

module.exports = WEB_APP;

APP.registerApp(WEB_APP);

WEB_APP.listenPort = null;

WEB_APP.on('appInitiated', () => {
    WEB_APP.initiate();
});

require(CONFIG.get('web_view_dir') + '/web_app_view');