smalltalk.addPackage('ZMQ-Support-Core', {});
smalltalk.addClass('ZMQBridge', smalltalk.Object, ['zmqContex', 'zmqSockets'], 'ZMQ-Support-Core');

smalltalk.addMethod(
"_generateUUID",
smalltalk.method({
selector: "generateUUID",
fn: function () {
    var self = this;
    var s = [];
    var hexDigits = "0123456789ABCDEF";
    for (var i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 16), 1);
    }
    s[12] = "4";
    s[16] = hexDigits.substr(s[16] & 3 | 8, 1);
    var uuid = s.join("");
    return uuid;
    return self;
}
}),
smalltalk.ZMQBridge.klass);


smalltalk.addClass('ZMQContext', smalltalk.Object, ['s', 'zmqSockets', 'connected', 'sendBuffer'], 'ZMQ-Support-Core');
smalltalk.addMethod(
"_connect_url_auth_",
smalltalk.method({
selector: "connect:url:auth:",
fn: function (aSocket, aZMQConnString, anAuth) {
    var self = this;
    var mMsg;
    var mMsgObj;
    smalltalk.send(anAuth, "_at_put_", ["zmq_conn_string", aZMQConnString]);
    smalltalk.send(anAuth, "_at_put_", ["socket_type", smalltalk.send(aSocket, "_socketType", [])]);
    mMsg = smalltalk.send(smalltalk.JSON || JSON, "_stringify_", [anAuth]);
    mMsgObj = smalltalk.send(aSocket, "_constructMessage_with_", [mMsg, "connect"]);
    mMsg = smalltalk.send(smalltalk.JSON || JSON, "_stringify_", [mMsgObj]);
    smalltalk.send(self, "_send_", [mMsg]);
    return self;
}
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_connected",
smalltalk.method({
selector: "connected",
fn: function () {
    var self = this;
    return self['@connected'];
}
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_connected_",
smalltalk.method({
selector: "connected:",
fn: function (aBoolean) {
    var self = this;
    self['@connected'] = aBoolean;
    return self;
}
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_createNewRepSocket",
smalltalk.method({
selector: "createNewRepSocket",
fn: function () {
    var self = this;
    var $1;
    $1 = smalltalk.send(self, "_registerNewSocket_", [smalltalk.send(smalltalk.ZMQRepSocket || ZMQRepSocket, "_newOnContext_", [self])]);
    return $1;
}
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_createNewReqSocket",
smalltalk.method({
selector: "createNewReqSocket",
fn: function () {
    var self = this;
    var $1;
    $1 = smalltalk.send(self, "_registerNewSocket_", [smalltalk.send(smalltalk.ZMQReqSocket || ZMQReqSocket, "_newOnContext_", [self])]);
    return $1;
}
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_createNewSocket_",
smalltalk.method({
selector: "createNewSocket:",
fn: function (aZMQSocketType) {
    var self = this;
    var $1, $2, $3, $4, $5, $6, $7;
    $1 = smalltalk.send(aZMQSocketType, "__eq", ["SUB"]);
    if (smalltalk.assert($1)) {
        $2 = smalltalk.send(self, "_registerNewSocket_", [smalltalk.send(smalltalk.ZMQSubSocket || ZMQSubSocket, "_newOnContext_", [self])]);
        return $2;
    }
    $3 = smalltalk.send(aZMQSocketType, "__eq", ["REQ"]);
    if (smalltalk.assert($3)) {
        $4 = smalltalk.send(self, "_registerNewSocket_", [smalltalk.send(smalltalk.ZMQReqSocket || ZMQReqSocket, "_newOnContext_", [self])]);
        return $4;
    }
    $5 = smalltalk.send(aZMQSocketType, "__eq", ["REP"]);
    if (smalltalk.assert($5)) {
        $6 = smalltalk.send(self, "_registerNewSocket_", [smalltalk.send(smalltalk.ZMQRepSocket || ZMQRepSocket, "_newOnContext_", [self])]);
        return $6;
    }
    $7 = smalltalk.send(self, "_error_", ["SocketType not yet supported"]);
    return $7;
}
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_createNewSubSocket",
smalltalk.method({
selector: "createNewSubSocket",
fn: function () {
    var self = this;
    var $1;
    $1 = smalltalk.send(self, "_registerNewSocket_", [smalltalk.send(smalltalk.ZMQSubSocket || ZMQSubSocket, "_newOnContext_", [self])]);
    return $1;
}
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_initialize",
smalltalk.method({
selector: "initialize",
fn: function () {
    var self = this;
    self['@zmqSockets'] = smalltalk.send(smalltalk.Array || Array, "_new", []);
    return self;
}
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_initializeOnURL_",
smalltalk.method({
selector: "initializeOnURL:",
fn: function (aWSConnectionURL) {
    var self = this;
    smalltalk.send(self, "_try_catch_", [function () {self['@s'] = new WebSocket(aWSConnectionURL);return self['@s'];}, function () {self['@s'] = new MozWebSocket(aWSConnectionURL);return self['@s'];}]);
    smalltalk.send(self['@s'], "_at_put_", ["onmessage", smalltalk.send(self, "_onMessageWSOverrideBlock", [])]);
    smalltalk.send(self['@s'], "_at_put_", ["onopen", smalltalk.send(self, "_onOpenWSOverrideBlock", [])]);
    smalltalk.send(self, "_connected_", [false]);
    smalltalk.send(self, "_sendBuffer_", [smalltalk.send(smalltalk.Array || Array, "_new", [])]);
    return self;
}
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_map_block_",
smalltalk.method({
selector: "map:block:",
fn: function (aParam, aFunction) {
    var self = this;
    $.map(aParam, aFunction);
    return self;
}
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_onMessageWSOverrideBlock",
smalltalk.method({
selector: "onMessageWSOverrideBlock",
fn: function () {
    var self = this;
    var $2, $3, $1;
    $1 = function (msg) {var mMsgObj;var mSocket;mMsgObj = smalltalk.send(smalltalk.JSON || JSON, "_parse_", [smalltalk.send(msg, "_data", [])]);mSocket = smalltalk.send(smalltalk.send(self, "_sockets", []), "_at_", [smalltalk.send(mMsgObj, "_at_", ["identity"])]);$2 = smalltalk.send(mSocket, "_connected", []);if (smalltalk.assert($2)) {return smalltalk.send(mSocket, "_handle_", [smalltalk.send(mMsgObj, "_at_", ["content"])]);} else {$3 = smalltalk.send(smalltalk.send(mMsgObj, "_at_", ["msg_type"]), "__eq_eq_eq", ["connection_reply"]);if (smalltalk.assert($3)) {return smalltalk.send(self, "_onconnect_message_", [mSocket, smalltalk.send(mMsgObj, "_at_", ["content"])]);}}};
    return $1;
}
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_onOpenWSOverrideBlock",
smalltalk.method({
selector: "onOpenWSOverrideBlock",
fn: function () {
    var self = this;
    var $1;
    $1 = function () {smalltalk.send(self, "_connected_", [true]);smalltalk.send(self, "_map_block_", [smalltalk.send(self, "_sendBuffer", []), function (x) {return smalltalk.send(smalltalk.send(self, "_s", []), "_send_", [x]);}]);return smalltalk.send(self, "_sendBuffer_", [smalltalk.send(smalltalk.Array || Array, "_new", [])]);};
    return $1;
}
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_onconnect_message_",
smalltalk.method({
selector: "onconnect:message:",
fn: function (aSocket, aMessage) {
    var self = this;
    var $1;
    var mMsgObj;
    mMsgObj = smalltalk.send(smalltalk.JSON || JSON, "_parse_", [aMessage]);
    $1 = smalltalk.send(smalltalk.send(mMsgObj, "_at_", ["status"]), "__eq_eq_eq", ["success"]);
    if (smalltalk.assert($1)) {
        smalltalk.send(aSocket, "_connected_", [true]);
    } else {
        smalltalk.send(aSocket, "_connected_", [false]);
    }
    return self;
}
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_registerNewSocket_",
smalltalk.method({
selector: "registerNewSocket:",
fn: function (aZMQSocket) {
    var self = this;
    var $1;
    $1 = smalltalk.send(smalltalk.send(self, "_sockets", []), "_at_put_", [smalltalk.send(aZMQSocket, "_identity", []), aZMQSocket]);
    return $1;
}
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_send_",
smalltalk.method({
selector: "send:",
fn: function (aMessage) {
    var self = this;
    var $1;
    $1 = smalltalk.send(self, "_connected", []);
    if (smalltalk.assert($1)) {
        smalltalk.send(self['@s'], "_send_", [aMessage]);
    } else {
        smalltalk.send(smalltalk.send(self, "_sendBuffer", []), "_push_", [aMessage]);
    }
    return self;
}
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_sendBuffer",
smalltalk.method({
selector: "sendBuffer",
fn: function () {
    var self = this;
    return self['@sendBuffer'];
}
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_sendBuffer_",
smalltalk.method({
selector: "sendBuffer:",
fn: function (anArray) {
    var self = this;
    self['@sendBuffer'] = anArray;
    return self;
}
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_zmqSockets",
smalltalk.method({
selector: "zmqSockets",
fn: function () {
    var self = this;
    return self['@zmqSockets'];
}
}),
smalltalk.ZMQContext);


smalltalk.addMethod(
"_new",
smalltalk.method({
selector: "new",
fn: function () {
    var self = this;
    smalltalk.send(self, "_error_", ["use new: instead"]);
    return self;
}
}),
smalltalk.ZMQContext.klass);

smalltalk.addMethod(
"_new_",
smalltalk.method({
selector: "new:",
fn: function (aWSConnectionURL) {
    var self = this;
    var $1;
    $1 = smalltalk.send(smalltalk.send(self, "_new", [], smalltalk.Object.klass), "_initializeOnURL_", [aWSConnectionURL]);
    return $1;
}
}),
smalltalk.ZMQContext.klass);


smalltalk.addClass('ZMQNode', smalltalk.Object, ['zmqSocket'], 'ZMQ-Support-Core');

smalltalk.addMethod(
"_new",
smalltalk.method({
selector: "new",
fn: function () {
    var self = this;
    smalltalk.send(self, "_error_", ["use newOnSocket: instead"]);
    return self;
}
}),
smalltalk.ZMQNode.klass);

smalltalk.addMethod(
"_newOnSocket_",
smalltalk.method({
selector: "newOnSocket:",
fn: function (aZMQSocket) {
    var self = this;
    var $1;
    $1 = smalltalk.send(smalltalk.send(self, "_new", [], smalltalk.Object.klass), "_zmqSocket_", [aZMQSocket]);
    return $1;
}
}),
smalltalk.ZMQNode.klass);


smalltalk.addClass('ZMQRPCClient', smalltalk.ZMQNode, [], 'ZMQ-Support-Core');
smalltalk.addMethod(
"_rpc_args_kwargs_callback_",
smalltalk.method({
selector: "rpc:args:kwargs:callback:",
fn: function (aFuncName, anArgs, aKWArgs, aCallback) {
    var self = this;
    var $1, $2;
    var mMessage;
    var mWrappedCallback;
    $1 = smalltalk.send(smalltalk.Dictionary || Dictionary, "_new", []);
    smalltalk.send($1, "_at_put_", ["funcname", aFuncName]);
    smalltalk.send($1, "_at_put_", ["args", anArgs]);
    smalltalk.send($1, "_at_put_", ["kwargs", aKWArgs]);
    $2 = smalltalk.send($1, "_yourself", []);
    mMessage = $2;
    mWrappedCallback = function (msg) {var mMsgObj;mMsgObj = smalltalk.send(smalltalk.JSON || JSON, "_parse_", [mMessage]);return smalltalk.send(self, "_callback_", [smalltalk.send(mMsgObj, "_at_", ["returnval"])]);};
    smalltalk.send(smalltalk.send(self, "_zmqSocket", []), "_send_callback_", [smalltalk.send(smalltalk.JSON || JSON, "_stringify_", [mMessage]), mWrappedCallback]);
    return self;
}
}),
smalltalk.ZMQRPCClient);



smalltalk.addClass('ZMQRPCServer', smalltalk.ZMQNode, [], 'ZMQ-Support-Core');
smalltalk.addMethod(
"_handle_",
smalltalk.method({
selector: "handle:",
fn: function (aMessage) {
    var self = this;
    var $1, $2;
    var mMsgObj;
    var mFuncName;
    var mArgs;
    var mRetVal;
    mMsgObj = smalltalk.send(smalltalk.JSON || JSON, "_parse_", [aMessage]);
    mFuncName = smalltalk.send(mMsgObj, "_at_", ["funcname"]);
    mArgs = smalltalk.send(mMsgObj, "_at_ifAbsent_", ["args", function () {return smalltalk.send(smalltalk.Array || Array, "_new", []);}]);
    smalltalk.send(self, "_try_catch_", [function () {mRetVal = smalltalk.send(self, "_basicPerfrom_withArguments_", [mFuncName, mArgs]);return mRetVal;}, function (err) {mRetVal = err;return mRetVal;}]);
    $1 = smalltalk.send(smalltalk.Dictionary || Dictionary, "_new", []);
    smalltalk.send($1, "_at_put_", ["returnval", mRetVal]);
    $2 = smalltalk.send($1, "_yourself", []);
    smalltalk.send(smalltalk.send(self, "_zmqSocket", []), "_send_", [smalltalk.send(smalltalk.JSON || JSON, "_stringify_", [$2])]);
    return self;
}
}),
smalltalk.ZMQRPCServer);

smalltalk.addMethod(
"_overrideSocketOnMessage",
smalltalk.method({
selector: "overrideSocketOnMessage",
fn: function () {
    var self = this;
    var $1;
    $1 = smalltalk.send(smalltalk.send(self, "_zmqSocket", []), "_notNil", []);
    if (smalltalk.assert($1)) {
        return self;
    }
    smalltalk.send(smalltalk.send(self, "_zmqSocket", []), "_at_put_", ["onmessage", function (msg) {return smalltalk.send(self, "_handle_", [msg]);}]);
    return self;
}
}),
smalltalk.ZMQRPCServer);


smalltalk.addMethod(
"_newOnSocket_",
smalltalk.method({
selector: "newOnSocket:",
fn: function (aSocket) {
    var self = this;
    var $1;
    $1 = smalltalk.send(smalltalk.send(self, "_newOnSocket_", [aSocket], smalltalk.Object.klass), "_overrideSocketOnMessage", []);
    return $1;
}
}),
smalltalk.ZMQRPCServer.klass);


smalltalk.addClass('ZMQPubRPCServer', smalltalk.ZMQRPCServer, [], 'ZMQ-Support-Core');
smalltalk.addMethod(
"_handlePub_",
smalltalk.method({
selector: "handlePub:",
fn: function (aMessage) {
    var self = this;
    var mMsgObj;
    var mFuncName;
    var mArgs;
    mMsgObj = smalltalk.send(smalltalk.JSON || JSON, "_parse_", [aMessage]);
    mFuncName = smalltalk.send(mMsgObj, "_at_", ["funcname"]);
    mArgs = smalltalk.send(mMsgObj, "_at_ifAbsent_", ["args", function () {return smalltalk.send(smalltalk.Array || Array, "_new", []);}]);
    smalltalk.send(self, "_basicPerfrom_withArguments_", [mFuncName, mArgs]);
    return self;
}
}),
smalltalk.ZMQPubRPCServer);

smalltalk.addMethod(
"_overrideSocketOnMessage",
smalltalk.method({
selector: "overrideSocketOnMessage",
fn: function () {
    var self = this;
    var $1;
    $1 = smalltalk.send(smalltalk.send(self, "_zmqSocket", []), "_notNil", []);
    if (smalltalk.assert($1)) {
        return self;
    }
    smalltalk.send(smalltalk.send(self, "_zmqSocket", []), "_at_put_", ["onmessage", function (msg) {return smalltalk.send(self, "_handlePub_", [msg]);}]);
    return self;
}
}),
smalltalk.ZMQPubRPCServer);



smalltalk.addClass('ZMQSocket', smalltalk.Object, ['zmqContext', 'identity'], 'ZMQ-Support-Core');
smalltalk.addMethod(
"_connect_auth_",
smalltalk.method({
selector: "connect:auth:",
fn: function (aZMQConnString, anAuth) {
    var self = this;
    smalltalk.send(smalltalk.send(self, "_zmqContext", []), "_connect_url_auth_", [self, aZMQConnString, anAuth]);
    return self;
}
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_constructMessage_",
smalltalk.method({
selector: "constructMessage:",
fn: function (aMessage) {
    var self = this;
    var $1;
    $1 = smalltalk.send(self, "_constructMessage_type_", [aMessage, nil]);
    return $1;
}
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_constructMessage_type_",
smalltalk.method({
selector: "constructMessage:type:",
fn: function (aMessage, aMessageType) {
    var self = this;
    var $1;
    var mMessageType;
    var mMessageStruct;
    $1 = smalltalk.send(aMessageType, "_isNil", []);
    if (smalltalk.assert($1)) {
        smalltalk.send(mMessageType, "__eq", ["userlevel"]);
    } else {
        mMessageType = aMessageType;
    }
    mMessageStruct = smalltalk.send(smalltalk.Array || Array, "_new", []);
    smalltalk.send(mMessageStruct, "_at_put_", ["identity", smalltalk.send(self, "_identity", [])]);
    smalltalk.send(mMessageStruct, "_at_put_", ["content", aMessage]);
    smalltalk.send(mMessageStruct, "_at_put_", ["msg_type", mMessageType]);
    return mMessageStruct;
}
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_identity",
smalltalk.method({
selector: "identity",
fn: function () {
    var self = this;
    return self['@identity'];
}
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_initialize",
smalltalk.method({
selector: "initialize",
fn: function () {
    var self = this;
    self['@identity'] = smalltalk.send(smalltalk.ZMQBridge || ZMQBridge, "_generateUUID", []);
    return self;
}
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_initializeOnContext_",
smalltalk.method({
selector: "initializeOnContext:",
fn: function (aZMQContext) {
    var self = this;
    self['@zmqContext'] = aZMQContext;
    return self;
}
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_primHandle_",
smalltalk.method({
selector: "primHandle:",
fn: function (aMessage) {
    var self = this;
    var mCallback;
    smalltalk.send(self, "_busy_", [false]);
    mCallback = smalltalk.send(smalltalk.send(smalltalk.send(self, "_reqrepBuffer", []), "_at_", [0]), "_at_", [1]);
    smalltalk.send(self, "_reqrepBuffer_", [smalltalk.send(smalltalk.send(self, "_reqrepBuffer", []), "_slice_", [1])]);
    smalltalk.send(self, "_callback_", [aMessage]);
    smalltalk.send(self, "_primSendBuffer", []);
    return self;
}
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_primSend_callback_",
smalltalk.method({
selector: "primSend:callback:",
fn: function (aMessage, aCallback) {
    var self = this;
    var $1;
    smalltalk.send(smalltalk.send(self, "_reqrepBuffer", []), "_push_", [function () {return smalltalk.send(aMessage, "__comma", [aCallback]);}]);
    $1 = smalltalk.send(self, "_busy", []);
    if (smalltalk.assert($1)) {
        return self;
    }
    smalltalk.send(self, "_primSendBuffer", []);
    return self;
}
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_primSendBuffer",
smalltalk.method({
selector: "primSendBuffer",
fn: function () {
    var self = this;
    var $1;
    $1 = smalltalk.send(smalltalk.send(self, "_busy", []), "_||", [smalltalk.send(smalltalk.send(smalltalk.send(self, "_reqrepBuffer", []), "_length", []), "__eq", [0])]);
    if (smalltalk.assert($1)) {
        return self;
    }
    smalltalk.send(self, "_busy_send_", [smalltalk.send(smalltalk.send(true, "_self", []), "_zmqContext", []), smalltalk.send(self, "_reqrepBuffer_", [0])]);
    return self;
}
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_send_callback_type_",
smalltalk.method({
selector: "send:callback:type:",
fn: function (aMessage, aCallback, aMessageType) {
    var self = this;
    var mMsgObj;
    mMsgObj = smalltalk.send(self, "_constructMessage_type_", [aMessage, aMessageType]);
    smalltalk.send(self, "_send_callback_", [smalltalk.send(smalltalk.JSON || JSON, "_stringify_", [mMsgObj]), aCallback]);
    return self;
}
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_socketType",
smalltalk.method({
selector: "socketType",
fn: function () {
    var self = this;
    smalltalk.send(self, "_subclassResponsibility", []);
    return self;
}
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_zmqContext",
smalltalk.method({
selector: "zmqContext",
fn: function () {
    var self = this;
    return self['@zmqContext'];
}
}),
smalltalk.ZMQSocket);


smalltalk.addMethod(
"_new",
smalltalk.method({
selector: "new",
fn: function () {
    var self = this;
    var $1;
    $1 = smalltalk.send(self, "_error_", ["use newOnContext: instead"]);
    return $1;
}
}),
smalltalk.ZMQSocket.klass);

smalltalk.addMethod(
"_newOnContext_",
smalltalk.method({
selector: "newOnContext:",
fn: function (aZMQContext) {
    var self = this;
    var $1;
    $1 = smalltalk.send(smalltalk.send(self, "_new", [], smalltalk.Object.klass), "_initializeOnContext_", [aZMQContext]);
    return $1;
}
}),
smalltalk.ZMQSocket.klass);


smalltalk.addClass('ZMQRepSocket', smalltalk.ZMQSocket, ['inBuffer'], 'ZMQ-Support-Core');
smalltalk.addMethod(
"_primHandle_",
smalltalk.method({
selector: "primHandle:",
fn: function (aMessage) {
    var self = this;
    smalltalk.send(smalltalk.send(self, "_inBuffer", []), "_push", []);
    smalltalk.send(self, "_primRecvBuffer", []);
    return self;
}
}),
smalltalk.ZMQRepSocket);

smalltalk.addMethod(
"_primRecvBuffer",
smalltalk.method({
selector: "primRecvBuffer",
fn: function () {
    var self = this;
    var $1;
    var mMessage;
    var mMsgObj;
    var mContent;
    $1 = smalltalk.send(smalltalk.send(self, "_busy", []), "_||", [smalltalk.send(smalltalk.send(smalltalk.send(self, "_inBuffer", []), "_length", []), "__eq", [0])]);
    if (smalltalk.assert($1)) {
        return self;
    }
    smalltalk.send(smalltalk.send(mMessage, "__eq", [smalltalk.send(self, "_inBuffer", [])]), "_at_", [0]);
    smalltalk.send(self, "_inBuffer_", [smalltalk.send(smalltalk.send(self, "_inBuffer", []), "_slice_", [1])]);
    smalltalk.send(self, "_busy_", [true]);
    mMsgObj = smalltalk.send(smalltalk.JSON || JSON, "_parse_", [mMessage]);
    mContent = smalltalk.send(mMsgObj, "_at_", [smalltalk.send(smalltalk.send(mMsgObj, "_length", []), "__minus", [1])]);
    smalltalk.send(self, "_address_", [smalltalk.send(mMsgObj, "_at_", [0])]);
    smalltalk.send(self, "_onmessage_", [mContent]);
    return self;
}
}),
smalltalk.ZMQRepSocket);

smalltalk.addMethod(
"_send_",
smalltalk.method({
selector: "send:",
fn: function (aMessage) {
    var self = this;
    var mMessage;
    var mMsgObj;
    mMessage = smalltalk.send(smalltalk.send(smalltalk.send(self, "_address", []), "__comma", [""]), "__comma", [aMessage]);
    smalltalk.send(smalltalk.send(mMessage, "__eq", [smalltalk.JSON || JSON]), "_stringify_", [mMessage]);
    mMsgObj = smalltalk.send(self, "_constructMessage_", [mMessage]);
    smalltalk.send(smalltalk.send(self, "_zmqContext", []), "_send_", [smalltalk.send(smalltalk.JSON || JSON, "_stringify_", [mMsgObj])]);
    smalltalk.send(self, "_busy_", [false]);
    smalltalk.send(self, "_primRecvBuffer", []);
    return self;
}
}),
smalltalk.ZMQRepSocket);

smalltalk.addMethod(
"_socketType",
smalltalk.method({
selector: "socketType",
fn: function () {
    var self = this;
    return 4;
}
}),
smalltalk.ZMQRepSocket);



smalltalk.addClass('ZMQReqSocket', smalltalk.ZMQSocket, ['reqrepBuffer', 'busy'], 'ZMQ-Support-Core');
smalltalk.addMethod(
"_socketType",
smalltalk.method({
selector: "socketType",
fn: function () {
    var self = this;
    return 3;
}
}),
smalltalk.ZMQReqSocket);



smalltalk.addClass('ZMQSubSocket', smalltalk.ZMQSocket, [], 'ZMQ-Support-Core');
smalltalk.addMethod(
"_primHandle_",
smalltalk.method({
selector: "primHandle:",
fn: function (aMessage) {
    var self = this;
    smalltalk.send(self, "_onmessage_", [aMessage]);
    return self;
}
}),
smalltalk.ZMQSubSocket);

smalltalk.addMethod(
"_socketType",
smalltalk.method({
selector: "socketType",
fn: function () {
    var self = this;
    return 2;
}
}),
smalltalk.ZMQSubSocket);



