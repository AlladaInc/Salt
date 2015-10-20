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

        this.currentReq = request;
        this.currentResp = response;
        this.ip = this.getIP();
        this.ipVersion = this.getIPVersion();
        this.remotePort = this.getRemotePort();
        this.id = this.getGUID();
        this.log('Got connection, trying to route...');
        this.route();
    }
    close () {
        this.log('Connection closed');
        this.currentResp.end();
        this.currentResp = null;
        this.currentReq = null;
        this.done();
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
        var match = url.match(/^([^?]+)(?:\?(.*))?$/);
        var path, uri;
        if (!match) {
            path = '';
            uri = '';
        } else {
            path = match[1];
            uri = match[2];
        }
        path = path.split('/');
        //uri = 
    }
    
    static run (port) {
        this.listenPort = port;
        console.log('App initiating...');
        this.tryInit();
    }
    static initiate () {
        console.log('App Initiated...');
        console.log(`Server setting up port ${ this.listenPort } for listening...`);
        this.SERVER = HTTP.createServer(this.incomingRequest).listen(this.listenPort);
        console.log(`Server listening on port ${ this.listenPort } waiting connections...`);
    }
    static incomingRequest (request, response) {
        return new WEB_APP(request, response);
    }
}

WEB_APP.listenPort = null;

WEB_APP.registerTrigger('APP_INITIATED', () => {
    WEB_APP.initiate();
});


module.exports = WEB_APP;