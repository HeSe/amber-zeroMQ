smalltalk.addPackage('ZMQ-Support-Example', {});
smalltalk.addClass('ZMQReqSubExample', smalltalk.Object, ['zmqBridge'], 'ZMQ-Support-Example');
smalltalk.addMethod(
"_createReqRepContextandSocket",
smalltalk.method({
selector: "createReqRepContextandSocket",
fn: function () {
    var self = this;
    var mContext;
    var mReqRepSocket;
    mContext = smalltalk.send(smalltalk.ZMQContext || ZMQContext, "_new_", ["ws://192.168.0.180/pharo"]);
    mReqRepSocket = smalltalk.send(mContext, "_createNewReqSocket", []);
    smalltalk.send(mReqRepSocket, "_connect_", ["tcp://33.33.33.10:80"]);
    smalltalk.send(mReqRepSocket, "_inspect", []);
    return self;
}
}),
smalltalk.ZMQReqSubExample);

smalltalk.addMethod(
"_initialize",
smalltalk.method({
selector: "initialize",
fn: function () {
    var self = this;
    smalltalk.send(self, "_createReqRepContextandSocket", []);
    return self;
}
}),
smalltalk.ZMQReqSubExample);

smalltalk.addMethod(
"_zmqBridge",
smalltalk.method({
selector: "zmqBridge",
fn: function () {
    var self = this;
    return self['@zmqBridge'];
}
}),
smalltalk.ZMQReqSubExample);


smalltalk.addMethod(
"_open",
smalltalk.method({
selector: "open",
fn: function () {
    var self = this;
    smalltalk.send(smalltalk.send(self, "_new", []), "_appendToJQuery_", [smalltalk.send("body", "_asJQuery", [])]);
    return self;
}
}),
smalltalk.ZMQReqSubExample.klass);


