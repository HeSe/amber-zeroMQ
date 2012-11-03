smalltalk.addPackage('ZMQ-Support-Example', {});
smalltalk.addClass('ZMQReqSubExample', smalltalk.Object, ['zmqBridge'], 'ZMQ-Support-Example');
smalltalk.addMethod(
"_createReqRepContextandSocket",
smalltalk.method({
selector: "createReqRepContextandSocket",
category: 'not yet classified',
fn: function () {
    var self = this;
    var mContext;
    var mReqRepSocket;
    mContext = smalltalk.send(smalltalk.ZMQContext || ZMQContext, "_new_", ["ws://192.168.0.180/pharo"]);
    mReqRepSocket = smalltalk.send(mContext, "_createNewReqSocket", []);
    smalltalk.send(mReqRepSocket, "_connect_", ["tcp://33.33.33.10:80"]);
    smalltalk.send(mReqRepSocket, "_inspect", []);
    return self;
},
args: [],
source: "createReqRepContextandSocket\x0a\x0a\x09| mContext mReqRepSocket |\x0a\x0a\x09mContext := ZMQContext new: 'ws://192.168.0.180/pharo'.\x0amReqRepSocket := mContext  createNewReqSocket.\x0a\x0a\x09mReqRepSocket connect:'tcp://33.33.33.10:80'.\x0a\x0a  mReqRepSocket inspect",
messageSends: ["new:", "createNewReqSocket", "connect:", "inspect"],
referencedClasses: ["ZMQContext"]
}),
smalltalk.ZMQReqSubExample);

smalltalk.addMethod(
"_initialize",
smalltalk.method({
selector: "initialize",
category: 'not yet classified',
fn: function () {
    var self = this;
    smalltalk.send(self, "_createReqRepContextandSocket", []);
    return self;
},
args: [],
source: "initialize \x0a\x0a\x09self createReqRepContextandSocket\x0a\x0a\x09",
messageSends: ["createReqRepContextandSocket"],
referencedClasses: []
}),
smalltalk.ZMQReqSubExample);

smalltalk.addMethod(
"_zmqBridge",
smalltalk.method({
selector: "zmqBridge",
category: 'not yet classified',
fn: function () {
    var self = this;
    return self['@zmqBridge'];
},
args: [],
source: "zmqBridge\x0a\x0a\x09^zmqBridge",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQReqSubExample);


smalltalk.addMethod(
"_open",
smalltalk.method({
selector: "open",
category: 'not yet classified',
fn: function () {
    var self = this;
    smalltalk.send(smalltalk.send(self, "_new", []), "_appendToJQuery_", [smalltalk.send("body", "_asJQuery", [])]);
    return self;
},
args: [],
source: "open\x0a\x0a\x09  self new appendToJQuery: 'body' asJQuery",
messageSends: ["appendToJQuery:", "asJQuery", "new"],
referencedClasses: []
}),
smalltalk.ZMQReqSubExample.klass);


