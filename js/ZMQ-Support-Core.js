smalltalk.addPackage('ZMQ-Support-Core', {});
smalltalk.addClass('ZMQBridge', smalltalk.Object, ['zmqContex', 'zmqSockets'], 'ZMQ-Support-Core');

smalltalk.addMethod(
"_generateUUID",
smalltalk.method({
selector: "generateUUID",
category: 'not yet classified',
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
},
args: [],
source: "generateUUID\x0a\x0a\x09<var s = [];\x0a    var hexDigits = \x220123456789ABCDEF\x22;\x0a    for (var i = 0; i < 32; i++) {\x0a        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);\x0a    }\x0a    s[12] = \x224\x22;  // bits 12-15 of the time_hi_and_version field to 0010\x0a    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01\x0a    \x0a    var uuid = s.join(\x22\x22);\x0a    return uuid;>\x0a",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQBridge.klass);


smalltalk.addClass('ZMQContext', smalltalk.Object, ['s', 'zmqSockets', 'connected', 'sendBuffer'], 'ZMQ-Support-Core');
smalltalk.addMethod(
"_connect_url_auth_",
smalltalk.method({
selector: "connect:url:auth:",
category: 'not yet classified',
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
},
args: ["aSocket", "aZMQConnString", "anAuth"],
source: "connect: aSocket url: aZMQConnString auth: anAuth\x0a\x09\x0a    | mMsg mMsgObj |\x0a    \x0a    anAuth at: 'zmq_conn_string' put: aZMQConnString.\x0a    anAuth at: 'socket_type' put: aSocket socketType.\x0a    \x0a    mMsg := JSON stringify: anAuth.\x0a    mMsgObj :=  aSocket constructMessage: mMsg with: 'connect'.\x0a    mMsg :=  JSON stringify: mMsgObj.\x0a    \x0a    self send: mMsg",
messageSends: ["at:put:", "socketType", "stringify:", "constructMessage:with:", "send:"],
referencedClasses: ["JSON"]
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_connected",
smalltalk.method({
selector: "connected",
category: 'not yet classified',
fn: function () {
    var self = this;
    return self['@connected'];
},
args: [],
source: "connected\x0a\x0a\x09^connected",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_connected_",
smalltalk.method({
selector: "connected:",
category: 'not yet classified',
fn: function (aBoolean) {
    var self = this;
    self['@connected'] = aBoolean;
    return self;
},
args: ["aBoolean"],
source: "connected: aBoolean\x0a\x0a\x09connected := aBoolean",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_createNewRepSocket",
smalltalk.method({
selector: "createNewRepSocket",
category: 'not yet classified',
fn: function () {
    var self = this;
    var $1;
    $1 = smalltalk.send(self, "_registerNewSocket_", [smalltalk.send(smalltalk.ZMQRepSocket || ZMQRepSocket, "_newOnContext_", [self])]);
    return $1;
},
args: [],
source: "createNewRepSocket\x0a\x0a   ^self registerNewSocket: ( ZMQRepSocket newOnContext: self )",
messageSends: ["registerNewSocket:", "newOnContext:"],
referencedClasses: ["ZMQRepSocket"]
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_createNewReqSocket",
smalltalk.method({
selector: "createNewReqSocket",
category: 'not yet classified',
fn: function () {
    var self = this;
    var $1;
    $1 = smalltalk.send(self, "_registerNewSocket_", [smalltalk.send(smalltalk.ZMQReqSocket || ZMQReqSocket, "_newOnContext_", [self])]);
    return $1;
},
args: [],
source: "createNewReqSocket\x0a\x0a   ^self registerNewSocket: ( ZMQReqSocket newOnContext: self )",
messageSends: ["registerNewSocket:", "newOnContext:"],
referencedClasses: ["ZMQReqSocket"]
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_createNewSocket_",
smalltalk.method({
selector: "createNewSocket:",
category: 'not yet classified',
fn: function (aZMQSocketType) {
    var self = this;
    var $1, $2, $3, $4, $5, $6, $7;
    $1 = smalltalk.send(aZMQSocketType, "__eq", [smalltalk.SUB || SUB]);
    if (smalltalk.assert($1)) {
        $2 = smalltalk.send(self, "_registerNewSocket_", [smalltalk.send(smalltalk.ZMQSubSocket || ZMQSubSocket, "_newOnContext_", [self])]);
        return $2;
    }
    $3 = smalltalk.send(aZMQSocketType, "__eq", [smalltalk.REQ || REQ]);
    if (smalltalk.assert($3)) {
        $4 = smalltalk.send(self, "_registerNewSocket_", [smalltalk.send(smalltalk.ZMQReqSocket || ZMQReqSocket, "_newOnContext_", [self])]);
        return $4;
    }
    $5 = smalltalk.send(aZMQSocketType, "__eq", [smalltalk.REP || REP]);
    if (smalltalk.assert($5)) {
        $6 = smalltalk.send(self, "_registerNewSocket_", [smalltalk.send(smalltalk.ZMQRepSocket || ZMQRepSocket, "_newOnContext_", [self])]);
        return $6;
    }
    $7 = smalltalk.send(self, "_error_", ["SocketType not yet supported"]);
    return $7;
},
args: ["aZMQSocketType"],
source: "createNewSocket: aZMQSocketType\x0a\x0a   aZMQSocketType = SUB\x0a   \x09\x09ifTrue:[ ^self registerNewSocket: ( ZMQSubSocket newOnContext: self )  ].\x0a  \x0a   aZMQSocketType = REQ\x0a   \x09\x09ifTrue:[ ^self registerNewSocket: ( ZMQReqSocket newOnContext: self )  ].\x0a        \x0a   aZMQSocketType = REP\x0a   \x09\x09ifTrue:[ ^self registerNewSocket:  ( ZMQRepSocket newOnContext: self ) ].\x0a        \x0a    ^self error: 'SocketType not yet supported'\x0a   \x0a   \x0a",
messageSends: ["ifTrue:", "registerNewSocket:", "newOnContext:", "=", "error:"],
referencedClasses: ["ZMQSubSocket", "SUB", "ZMQReqSocket", "REQ", "ZMQRepSocket", "REP"]
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_createNewSubSocket",
smalltalk.method({
selector: "createNewSubSocket",
category: 'not yet classified',
fn: function () {
    var self = this;
    var $1;
    $1 = smalltalk.send(self, "_registerNewSocket_", [smalltalk.send(smalltalk.ZMQSubSocket || ZMQSubSocket, "_newOnContext_", [self])]);
    return $1;
},
args: [],
source: "createNewSubSocket\x0a\x0a   ^self registerNewSocket: ( ZMQSubSocket newOnContext: self )",
messageSends: ["registerNewSocket:", "newOnContext:"],
referencedClasses: ["ZMQSubSocket"]
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_initialize",
smalltalk.method({
selector: "initialize",
category: 'not yet classified',
fn: function () {
    var self = this;
    self['@zmqSockets'] = smalltalk.send(smalltalk.Dictionary || Dictionary, "_new", []);
    return self;
},
args: [],
source: "initialize\x0a\x0a\x09zmqSockets := Dictionary new.",
messageSends: ["new"],
referencedClasses: ["Dictionary"]
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_initializeOnURL_",
smalltalk.method({
selector: "initializeOnURL:",
category: 'not yet classified',
fn: function (aWSConnectionURL) {
    var self = this;
    smalltalk.send(self, "_try_catch_", [function () {self['@s'] = new WebSocket(aWSConnectionURL);return self['@s'];}, function () {self['@s'] = new MozWebSocket(aWSConnectionURL);return self['@s'];}]);
    smalltalk.send(self['@s'], "_at_put_", ["onmessage", smalltalk.send(self, "_onMessageWSOverrideBlock", [])]);
    smalltalk.send(self['@s'], "_at_put_", ["onopen", smalltalk.send(self, "_onOpenWSOverrideBlock", [])]);
    smalltalk.send(self, "_connected_", [false]);
    smalltalk.send(self, "_sendBuffer_", [smalltalk.send(smalltalk.Array || Array, "_new", [])]);
    return self;
},
args: ["aWSConnectionURL"],
source: "initializeOnURL: aWSConnectionURL\x0a\x0a    self try: [s := <new WebSocket(aWSConnectionURL)>] \x0a    \x09  catch: [s := <new MozWebSocket(aWSConnectionURL)>].\x0a    \x0a    s at: 'onmessage' put: self onMessageWSOverrideBlock.\x0a    s at: 'onopen' put: self onOpenWSOverrideBlock.\x0a                         \x0a    self connected: false.\x0a    self sendBuffer: Array new.",
messageSends: ["try:catch:", "at:put:", "onMessageWSOverrideBlock", "onOpenWSOverrideBlock", "connected:", "sendBuffer:", "new"],
referencedClasses: ["Array"]
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_map_block_",
smalltalk.method({
selector: "map:block:",
category: 'not yet classified',
fn: function (aParam, aFunction) {
    var self = this;
    $.map(aParam, aFunction);
    return self;
},
args: ["aParam", "aFunction"],
source: "map: aParam block: aFunction\x0a\x0a\x09<$.map(aParam, aFunction);>\x0a                         ",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_onMessageWSOverrideBlock",
smalltalk.method({
selector: "onMessageWSOverrideBlock",
category: 'not yet classified',
fn: function () {
    var self = this;
    var $2, $3, $1;
    $1 = function (msg) {var mMsgObj;var mSocket;mMsgObj = smalltalk.send(smalltalk.JSON || JSON, "_parse_", [smalltalk.send(msg, "_data", [])]);mSocket = smalltalk.send(smalltalk.send(self, "_sockets", []), "_at_", [smalltalk.send(mMsgObj, "_at_", ["identity"])]);$2 = smalltalk.send(mSocket, "_connected", []);if (smalltalk.assert($2)) {return smalltalk.send(mSocket, "_primHandle_", [smalltalk.send(mMsgObj, "_at_", ["content"])]);} else {$3 = smalltalk.send(smalltalk.send(mMsgObj, "_at_", ["msg_type"]), "__eq_eq_eq", ["connection_reply"]);if (smalltalk.assert($3)) {return smalltalk.send(self, "_onconnect_message_", [mSocket, smalltalk.send(mMsgObj, "_at_", ["content"])]);}}};
    return $1;
},
args: [],
source: "onMessageWSOverrideBlock\x0a\x0a\x09^ [: msg |    | mMsgObj mSocket |\x0a                      \x0a                    mMsgObj := JSON parse: msg data .\x0a    \x0a\x09 \x09\x09\x09\x09mSocket := (self sockets at: (mMsgObj at: 'identity')).\x0a     \x0a\x09\x09\x09\x09\x09mSocket connected\x0a    \x09\x09\x09\x09\x09\x09ifTrue:[  mSocket  primHandle: (mMsgObj at:'content')]\x0a\x09\x09\x09\x09\x09\x09\x09ifFalse:[  ((mMsgObj at: 'msg_type' ) === 'connection_reply')\x0a        \x09\x09\x09\x09\x09\x09\x09\x09\x09\x09\x09\x09ifTrue:[ self onconnect: mSocket message: (mMsgObj at: 'content')] ].\x0a                          \x0a        ].\x0a                         \x0a                         ",
messageSends: ["parse:", "data", "at:", "sockets", "ifTrue:ifFalse:", "primHandle:", "ifTrue:", "onconnect:message:", "===", "connected"],
referencedClasses: ["JSON"]
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_onOpenWSOverrideBlock",
smalltalk.method({
selector: "onOpenWSOverrideBlock",
category: 'not yet classified',
fn: function () {
    var self = this;
    var $1;
    $1 = function () {smalltalk.send(self, "_connected_", [true]);smalltalk.send(self, "_map_block_", [smalltalk.send(self, "_sendBuffer", []), function (x) {return smalltalk.send(smalltalk.send(self, "_s", []), "_send_", [x]);}]);return smalltalk.send(self, "_sendBuffer_", [smalltalk.send(smalltalk.Array || Array, "_new", [])]);};
    return $1;
},
args: [],
source: "onOpenWSOverrideBlock\x0a\x0a\x09^ [                     \x0a          \x09 self connected: true.\x0a             \x0a\x09\x09\x09self map: self sendBuffer block: [:x  | self s send: x. ].\x0a\x09\x09\x09   \x0a\x09\x09\x09self sendBuffer: Array new.\x0a                          \x0a        ].\x0a                         \x0a                         ",
messageSends: ["connected:", "map:block:", "sendBuffer", "send:", "s", "sendBuffer:", "new"],
referencedClasses: ["Array"]
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_onconnect_message_",
smalltalk.method({
selector: "onconnect:message:",
category: 'not yet classified',
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
},
args: ["aSocket", "aMessage"],
source: "onconnect: aSocket message: aMessage \x0a\x09\x0a    | mMsgObj |\x0a    \x0a  mMsgObj := JSON parse: aMessage. \x0a  \x0a  ((mMsgObj at: 'status') === 'success')\x0a  \x09\x09ifTrue:[aSocket connected: true]\x0a      \x09ifFalse:[aSocket connected: false]\x0a  \x09",
messageSends: ["parse:", "ifTrue:ifFalse:", "connected:", "===", "at:"],
referencedClasses: ["JSON"]
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_registerNewSocket_",
smalltalk.method({
selector: "registerNewSocket:",
category: 'not yet classified',
fn: function (aZMQSocket) {
    var self = this;
    var $1;
    $1 = smalltalk.send(smalltalk.send(self, "_sockets", []), "_at_put_", [smalltalk.send(aZMQSocket, "_identity", []), aZMQSocket]);
    return $1;
},
args: ["aZMQSocket"],
source: "registerNewSocket: aZMQSocket\x0a\x0a\x09   ^self sockets at: aZMQSocket identity put: aZMQSocket\x0a",
messageSends: ["at:put:", "identity", "sockets"],
referencedClasses: []
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_send_",
smalltalk.method({
selector: "send:",
category: 'not yet classified',
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
},
args: ["aMessage"],
source: "send: aMessage\x0a\x0a\x09self connected \x0a    \x09ifTrue:[ s send: aMessage ]\x0a        ifFalse:[ self sendBuffer push: aMessage ]\x0a    \x0a\x09",
messageSends: ["ifTrue:ifFalse:", "send:", "push:", "sendBuffer", "connected"],
referencedClasses: []
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_sendBuffer",
smalltalk.method({
selector: "sendBuffer",
category: 'not yet classified',
fn: function () {
    var self = this;
    return self['@sendBuffer'];
},
args: [],
source: "sendBuffer\x0a\x0a\x09^sendBuffer",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_sendBuffer_",
smalltalk.method({
selector: "sendBuffer:",
category: 'not yet classified',
fn: function (anArray) {
    var self = this;
    self['@sendBuffer'] = anArray;
    return self;
},
args: ["anArray"],
source: "sendBuffer: anArray\x0a\x0a\x09sendBuffer := anArray",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQContext);

smalltalk.addMethod(
"_zmqSockets",
smalltalk.method({
selector: "zmqSockets",
category: 'not yet classified',
fn: function () {
    var self = this;
    return self['@zmqSockets'];
},
args: [],
source: "zmqSockets\x0a\x0a\x09^zmqSockets",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQContext);


smalltalk.addMethod(
"_new",
smalltalk.method({
selector: "new",
category: 'not yet classified',
fn: function () {
    var self = this;
    smalltalk.send(self, "_error_", ["use new: instead"]);
    return self;
},
args: [],
source: "new\x0a\x0a\x09self error: 'use new: instead'",
messageSends: ["error:"],
referencedClasses: []
}),
smalltalk.ZMQContext.klass);

smalltalk.addMethod(
"_new_",
smalltalk.method({
selector: "new:",
category: 'not yet classified',
fn: function (aWSConnectionURL) {
    var self = this;
    var $1;
    $1 = smalltalk.send(smalltalk.send(self, "_new", [], smalltalk.Object.klass), "_initializeOnURL_", [aWSConnectionURL]);
    return $1;
},
args: ["aWSConnectionURL"],
source: "new: aWSConnectionURL\x0a\x0a\x09^super new initializeOnURL: aWSConnectionURL",
messageSends: ["initializeOnURL:", "new"],
referencedClasses: []
}),
smalltalk.ZMQContext.klass);


smalltalk.addClass('ZMQNode', smalltalk.Object, ['zmqSocket'], 'ZMQ-Support-Core');
smalltalk.addMethod(
"_zmqSocket",
smalltalk.method({
selector: "zmqSocket",
category: 'not yet classified',
fn: function () {
    var self = this;
    return self['@zmqSocket'];
},
args: [],
source: "zmqSocket\x0a\x0a\x09^zmqSocket",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQNode);

smalltalk.addMethod(
"_zmqSocket_",
smalltalk.method({
selector: "zmqSocket:",
category: 'not yet classified',
fn: function (aZMQSocket) {
    var self = this;
    self['@zmqSocket'] = aZMQSocket;
    return self;
},
args: ["aZMQSocket"],
source: "zmqSocket: aZMQSocket\x0a\x0a\x09zmqSocket := aZMQSocket",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQNode);


smalltalk.addMethod(
"_new",
smalltalk.method({
selector: "new",
category: 'not yet classified',
fn: function () {
    var self = this;
    smalltalk.send(self, "_error_", ["use newOnSocket: instead"]);
    return self;
},
args: [],
source: "new\x0a\x0a\x09self error: 'use newOnSocket: instead'",
messageSends: ["error:"],
referencedClasses: []
}),
smalltalk.ZMQNode.klass);

smalltalk.addMethod(
"_newOnSocket_",
smalltalk.method({
selector: "newOnSocket:",
category: 'not yet classified',
fn: function (aZMQSocket) {
    var self = this;
    var $1;
    $1 = smalltalk.send(smalltalk.send(self, "_new", [], smalltalk.Object.klass), "_zmqSocket_", [aZMQSocket]);
    return $1;
},
args: ["aZMQSocket"],
source: "newOnSocket: aZMQSocket\x0a\x0a\x09^super new zmqSocket: aZMQSocket",
messageSends: ["zmqSocket:", "new"],
referencedClasses: []
}),
smalltalk.ZMQNode.klass);


smalltalk.addClass('ZMQRPCClient', smalltalk.ZMQNode, [], 'ZMQ-Support-Core');
smalltalk.addMethod(
"_rpc_args_kwargs_callback_",
smalltalk.method({
selector: "rpc:args:kwargs:callback:",
category: 'not yet classified',
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
},
args: ["aFuncName", "anArgs", "aKWArgs", "aCallback"],
source: "rpc: aFuncName args: anArgs kwargs: aKWArgs callback: aCallback\x0a\x0a\x09| mMessage mWrappedCallback | \x0a\x0a mMessage := Dictionary new\x0a\x09\x09\x09    at: 'funcname'  put: aFuncName;\x0a                            at: 'args'  put: anArgs;\x0a                            at: 'kwargs'  put: aKWArgs;\x0a\x09\x09\x09\x09\x09\x09\x09yourself.\x0a                            \x0a    mWrappedCallback := [:msg  |  |mMsgObj |\x0a\x09\x09\x09\x09\x09\x09mMsgObj := JSON parse: mMessage.\x0a\x09\x09\x09\x09\x09\x09self callback: ( mMsgObj at: 'returnval') ].\x0a    \x0a    self zmqSocket send: (JSON stringify: mMessage ) callback: mWrappedCallback.",
messageSends: ["at:put:", "new", "yourself", "parse:", "callback:", "at:", "send:callback:", "stringify:", "zmqSocket"],
referencedClasses: ["Dictionary", "JSON"]
}),
smalltalk.ZMQRPCClient);



smalltalk.addClass('ZMQRPCServer', smalltalk.ZMQNode, [], 'ZMQ-Support-Core');
smalltalk.addMethod(
"_handle_",
smalltalk.method({
selector: "handle:",
category: 'not yet classified',
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
    smalltalk.send(self, "_try_catch_", [function () {mRetVal = smalltalk.send(self, "_basicPerform_withArguments_", [mFuncName, mArgs]);return mRetVal;}, function (err) {mRetVal = err;return mRetVal;}]);
    $1 = smalltalk.send(smalltalk.Dictionary || Dictionary, "_new", []);
    smalltalk.send($1, "_at_put_", ["returnval", mRetVal]);
    $2 = smalltalk.send($1, "_yourself", []);
    smalltalk.send(smalltalk.send(self, "_zmqSocket", []), "_send_", [smalltalk.send(smalltalk.JSON || JSON, "_stringify_", [$2])]);
    return self;
},
args: ["aMessage"],
source: "handle: aMessage\x0a\x0a\x09 | mMsgObj mFuncName mArgs mRetVal |\x0a\x0a    mMsgObj := JSON parse: aMessage.\x0a    mFuncName := mMsgObj at: 'funcname'.\x0a    mArgs := mMsgObj at: 'args' ifAbsent: [Array new].\x0a    \x0a    self try: [ mRetVal :=  self basicPerform: mFuncName withArguments: mArgs] catch: [:err  |  mRetVal := err   ].\x0a   \x0a    self zmqSocket send: (JSON stringify:( Dictionary new at: 'returnval'  put: mRetVal ; yourself )).\x0a\x0a",
messageSends: ["parse:", "at:", "at:ifAbsent:", "new", "try:catch:", "basicPerform:withArguments:", "send:", "stringify:", "at:put:", "yourself", "zmqSocket"],
referencedClasses: ["JSON", "Array", "Dictionary"]
}),
smalltalk.ZMQRPCServer);

smalltalk.addMethod(
"_overrideSocketOnMessage",
smalltalk.method({
selector: "overrideSocketOnMessage",
category: 'not yet classified',
fn: function () {
    var self = this;
    var $1;
    $1 = smalltalk.send(smalltalk.send(self, "_zmqSocket", []), "_notNil", []);
    if (smalltalk.assert($1)) {
        return self;
    }
    smalltalk.send(smalltalk.send(self, "_zmqSocket", []), "_at_put_", ["onmessage", function (msg) {return smalltalk.send(self, "_handle_", [msg]);}]);
    return self;
},
args: [],
source: "overrideSocketOnMessage\x0a    \x0a    self zmqSocket notNil\x0a    \x09ifTrue:[^self].\x0a        \x0a\x09self zmqSocket at: 'onmessage'  put: [:msg  | self handle: msg ].\x0a\x09 ",
messageSends: ["ifTrue:", "notNil", "zmqSocket", "at:put:", "handle:"],
referencedClasses: []
}),
smalltalk.ZMQRPCServer);


smalltalk.addMethod(
"_newOnSocket_",
smalltalk.method({
selector: "newOnSocket:",
category: 'not yet classified',
fn: function (aSocket) {
    var self = this;
    var $1;
    $1 = smalltalk.send(smalltalk.send(self, "_newOnSocket_", [aSocket], smalltalk.Object.klass), "_overrideSocketOnMessage", []);
    return $1;
},
args: ["aSocket"],
source: "newOnSocket: aSocket\x0a\x0a   ^(super newOnSocket: aSocket) overrideSocketOnMessage\x0a    ",
messageSends: ["overrideSocketOnMessage", "newOnSocket:"],
referencedClasses: []
}),
smalltalk.ZMQRPCServer.klass);


smalltalk.addClass('ZMQPubRPCServer', smalltalk.ZMQRPCServer, [], 'ZMQ-Support-Core');
smalltalk.addMethod(
"_handlePub_",
smalltalk.method({
selector: "handlePub:",
category: 'not yet classified',
fn: function (aMessage) {
    var self = this;
    var mMsgObj;
    var mFuncName;
    var mArgs;
    mMsgObj = smalltalk.send(smalltalk.JSON || JSON, "_parse_", [aMessage]);
    mFuncName = smalltalk.send(mMsgObj, "_at_", ["funcname"]);
    mArgs = smalltalk.send(mMsgObj, "_at_ifAbsent_", ["args", function () {return smalltalk.send(smalltalk.Array || Array, "_new", []);}]);
    smalltalk.send(self, "_basicPerform_withArguments_", [mFuncName, mArgs]);
    return self;
},
args: ["aMessage"],
source: "handlePub: aMessage\x0a\x0a\x09 | mMsgObj mFuncName mArgs |\x0a\x0a    mMsgObj := JSON parse: aMessage.\x0a    mFuncName := mMsgObj at: 'funcname'.\x0a    mArgs := mMsgObj at: 'args' ifAbsent: [Array new].\x0a    \x0a    self basicPerform: mFuncName withArguments: mArgs.\x0a   \x0a",
messageSends: ["parse:", "at:", "at:ifAbsent:", "new", "basicPerform:withArguments:"],
referencedClasses: ["JSON", "Array"]
}),
smalltalk.ZMQPubRPCServer);

smalltalk.addMethod(
"_overrideSocketOnMessage",
smalltalk.method({
selector: "overrideSocketOnMessage",
category: 'not yet classified',
fn: function () {
    var self = this;
    var $1;
    $1 = smalltalk.send(smalltalk.send(self, "_zmqSocket", []), "_notNil", []);
    if (smalltalk.assert($1)) {
        return self;
    }
    smalltalk.send(smalltalk.send(self, "_zmqSocket", []), "_overrideSocketOnMessageWith_", [function (msg) {return smalltalk.send(self, "_handlePub_", [msg]);}]);
    return self;
},
args: [],
source: "overrideSocketOnMessage\x0a    \x0a    self zmqSocket notNil\x0a    \x09ifTrue:[^self].\x0a        \x0a\x09self zmqSocket overrideSocketOnMessageWith: [:msg  | self handlePub: msg ].\x0a\x09 ",
messageSends: ["ifTrue:", "notNil", "zmqSocket", "overrideSocketOnMessageWith:", "handlePub:"],
referencedClasses: []
}),
smalltalk.ZMQPubRPCServer);



smalltalk.addClass('ZMQSocket', smalltalk.Object, ['zmqContext', 'identity'], 'ZMQ-Support-Core');
smalltalk.addMethod(
"_connect_auth_",
smalltalk.method({
selector: "connect:auth:",
category: 'not yet classified',
fn: function (aZMQConnString, anAuth) {
    var self = this;
    smalltalk.send(smalltalk.send(self, "_zmqContext", []), "_connect_url_auth_", [self, aZMQConnString, anAuth]);
    return self;
},
args: ["aZMQConnString", "anAuth"],
source: "connect: aZMQConnString auth: anAuth\x0a\x0a  self zmqContext connect: self  url: aZMQConnString auth: anAuth",
messageSends: ["connect:url:auth:", "zmqContext"],
referencedClasses: []
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_constructMessage_",
smalltalk.method({
selector: "constructMessage:",
category: 'not yet classified',
fn: function (aMessage) {
    var self = this;
    var $1;
    $1 = smalltalk.send(self, "_constructMessage_type_", [aMessage, nil]);
    return $1;
},
args: ["aMessage"],
source: "constructMessage: aMessage\x0a\x0a\x09^self constructMessage: aMessage type: nil\x0a\x0a\x09\x0a",
messageSends: ["constructMessage:type:"],
referencedClasses: []
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_constructMessage_type_",
smalltalk.method({
selector: "constructMessage:type:",
category: 'not yet classified',
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
    mMessageStruct = smalltalk.send(smalltalk.Dictionary || Dictionary, "_new", []);
    smalltalk.send(mMessageStruct, "_at_put_", ["identity", smalltalk.send(self, "_identity", [])]);
    smalltalk.send(mMessageStruct, "_at_put_", ["content", aMessage]);
    smalltalk.send(mMessageStruct, "_at_put_", ["msg_type", mMessageType]);
    return mMessageStruct;
},
args: ["aMessage", "aMessageType"],
source: "constructMessage: aMessage type: aMessageType\x0a\x0a\x09  | mMessageType mMessageStruct |\x0a\x0a   aMessageType isNil\x0a    \x09ifTrue:[ mMessageType = 'userlevel']\x0a      \x09ifFalse:[mMessageType := aMessageType ].\x0a        \x0a      mMessageStruct := Dictionary new.\x0a      \x0a     mMessageStruct at: 'identity' put: self identity.\x0a     mMessageStruct at: 'content' put: aMessage.\x0a     mMessageStruct at: 'msg_type' put: mMessageType.\x0a     \x0a     ^mMessageStruct\x0a     \x0a     \x0a",
messageSends: ["ifTrue:ifFalse:", "=", "isNil", "new", "at:put:", "identity"],
referencedClasses: ["Dictionary"]
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_identity",
smalltalk.method({
selector: "identity",
category: 'not yet classified',
fn: function () {
    var self = this;
    return self['@identity'];
},
args: [],
source: "identity\x0a\x0a\x09^identity",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_initialize",
smalltalk.method({
selector: "initialize",
category: 'not yet classified',
fn: function () {
    var self = this;
    self['@identity'] = smalltalk.send(smalltalk.ZMQBridge || ZMQBridge, "_generateUUID", []);
    return self;
},
args: [],
source: "initialize\x0a\x0a\x09identity := ZMQBridge generateUUID   ",
messageSends: ["generateUUID"],
referencedClasses: ["ZMQBridge"]
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_initializeOnContext_",
smalltalk.method({
selector: "initializeOnContext:",
category: 'not yet classified',
fn: function (aZMQContext) {
    var self = this;
    self['@zmqContext'] = aZMQContext;
    return self;
},
args: ["aZMQContext"],
source: " initializeOnContext: aZMQContext\x0a    \x0a     zmqContext := aZMQContext\x0a   ",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_overrideSocketOnMessageWith_",
smalltalk.method({
selector: "overrideSocketOnMessageWith:",
category: 'not yet classified',
fn: function (aBlock) {
    var self = this;
    smalltalk.send(smalltalk.send(self, "_zmqContext", []), "_at_put_", ["onmessage", aBlock]);
    return self;
},
args: ["aBlock"],
source: "overrideSocketOnMessageWith: aBlock\x0a\x0a     self zmqContext at: 'onmessage'  put: aBlock\x0a\x09 ",
messageSends: ["at:put:", "zmqContext"],
referencedClasses: []
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_send_callback_type_",
smalltalk.method({
selector: "send:callback:type:",
category: 'not yet classified',
fn: function (aMessage, aCallback, aMessageType) {
    var self = this;
    var mMsgObj;
    mMsgObj = smalltalk.send(self, "_constructMessage_type_", [aMessage, aMessageType]);
    smalltalk.send(self, "_primSend_callback_", [smalltalk.send(smalltalk.JSON || JSON, "_stringify_", [mMsgObj]), aCallback]);
    return self;
},
args: ["aMessage", "aCallback", "aMessageType"],
source: "send: aMessage callback: aCallback type: aMessageType\x0a\x0a\x09 |  mMsgObj |\x0a\x0a    mMsgObj := self constructMessage: aMessage type: aMessageType.\x0a    self primSend: (JSON stringify: mMsgObj) callback: aCallback\x0a",
messageSends: ["constructMessage:type:", "primSend:callback:", "stringify:"],
referencedClasses: ["JSON"]
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_socketType",
smalltalk.method({
selector: "socketType",
category: 'not yet classified',
fn: function () {
    var self = this;
    smalltalk.send(self, "_subclassResponsibility", []);
    return self;
},
args: [],
source: "socketType\x0a\x0a\x09self subclassResponsibility\x0a",
messageSends: ["subclassResponsibility"],
referencedClasses: []
}),
smalltalk.ZMQSocket);

smalltalk.addMethod(
"_zmqContext",
smalltalk.method({
selector: "zmqContext",
category: 'not yet classified',
fn: function () {
    var self = this;
    return self['@zmqContext'];
},
args: [],
source: "zmqContext\x0a\x0a\x09^zmqContext",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQSocket);


smalltalk.addMethod(
"_new",
smalltalk.method({
selector: "new",
category: 'not yet classified',
fn: function () {
    var self = this;
    var $1;
    $1 = smalltalk.send(self, "_error_", ["use newOnContext: instead"]);
    return $1;
},
args: [],
source: "new\x0a\x0a\x09^self error: 'use newOnContext: instead'\x0a\x0a\x09 ",
messageSends: ["error:"],
referencedClasses: []
}),
smalltalk.ZMQSocket.klass);

smalltalk.addMethod(
"_newOnContext_",
smalltalk.method({
selector: "newOnContext:",
category: 'not yet classified',
fn: function (aZMQContext) {
    var self = this;
    var $1;
    $1 = smalltalk.send(smalltalk.send(self, "_new", [], smalltalk.Object.klass), "_initializeOnContext_", [aZMQContext]);
    return $1;
},
args: ["aZMQContext"],
source: "newOnContext: aZMQContext\x0a\x0a\x09^super new initializeOnContext: aZMQContext\x0a\x0a\x09 ",
messageSends: ["initializeOnContext:", "new"],
referencedClasses: []
}),
smalltalk.ZMQSocket.klass);


smalltalk.addClass('ZMQRepSocket', smalltalk.ZMQSocket, ['inBuffer'], 'ZMQ-Support-Core');
smalltalk.addMethod(
"_inBuffer",
smalltalk.method({
selector: "inBuffer",
category: 'not yet classified',
fn: function () {
    var self = this;
    return self['@inBuffer'];
},
args: [],
source: "inBuffer\x0a\x0a\x09^inBuffer",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQRepSocket);

smalltalk.addMethod(
"_inBuffer_",
smalltalk.method({
selector: "inBuffer:",
category: 'not yet classified',
fn: function (aBuffer) {
    var self = this;
    self['@inBuffer'] = aBuffer;
    return self;
},
args: ["aBuffer"],
source: "inBuffer: aBuffer\x0a\x0a\x09inBuffer := aBuffer",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQRepSocket);

smalltalk.addMethod(
"_primHandle_",
smalltalk.method({
selector: "primHandle:",
category: 'not yet classified',
fn: function (aMessage) {
    var self = this;
    smalltalk.send(smalltalk.send(self, "_inBuffer", []), "_push_", [aMessage]);
    smalltalk.send(self, "_primRecvBuffer", []);
    return self;
},
args: ["aMessage"],
source: "primHandle: aMessage \x0a\x0a    self inBuffer push: aMessage.\x0a    self primRecvBuffer\x0a    ",
messageSends: ["push:", "inBuffer", "primRecvBuffer"],
referencedClasses: []
}),
smalltalk.ZMQRepSocket);

smalltalk.addMethod(
"_primRecvBuffer",
smalltalk.method({
selector: "primRecvBuffer",
category: 'not yet classified',
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
},
args: [],
source: "primRecvBuffer\x0a\x0a\x09 | mMessage mMsgObj mContent | \x0a\x0a\x09(self busy) || (self inBuffer length = 0) \x0a   \x09\x09ifTrue:[^self].\x0a   \x0a\x09mMessage = self inBuffer at: 0.\x0a\x09self inBuffer: (self inBuffer slice:1).\x0a\x0a\x09self busy: true.\x0a    \x0a\x09mMsgObj := JSON parse: mMessage.\x0a\x09mContent := mMsgObj at: (mMsgObj length - 1).\x0a    \x0a\x09self address: (mMsgObj at: 0).\x0a    \x0a\x09self onmessage: mContent",
messageSends: ["ifTrue:", "||", "=", "length", "inBuffer", "busy", "at:", "inBuffer:", "slice:", "busy:", "parse:", "-", "address:", "onmessage:"],
referencedClasses: ["JSON"]
}),
smalltalk.ZMQRepSocket);

smalltalk.addMethod(
"_send_",
smalltalk.method({
selector: "send:",
category: 'not yet classified',
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
},
args: ["aMessage"],
source: "send: aMessage\x0a\x0a\x09 | mMessage mMsgObj | \x0a\x0a    mMessage := self address, '', aMessage.\x0a    mMessage = JSON stringify: mMessage.\x0a    mMsgObj := self constructMessage: mMessage.\x0a    \x0a    self zmqContext send: (JSON stringify: mMsgObj).\x0a    \x0a    self busy:  false.\x0a  \x0a    self primRecvBuffer",
messageSends: [",", "address", "stringify:", "=", "constructMessage:", "send:", "zmqContext", "busy:", "primRecvBuffer"],
referencedClasses: ["JSON"]
}),
smalltalk.ZMQRepSocket);

smalltalk.addMethod(
"_socketType",
smalltalk.method({
selector: "socketType",
category: 'not yet classified',
fn: function () {
    var self = this;
    return 4;
},
args: [],
source: "socketType\x0a\x0a\x09\x22ZMQ::REP\x22\x0a\x0a\x09^4\x0a\x09",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQRepSocket);



smalltalk.addClass('ZMQReqSocket', smalltalk.ZMQSocket, ['reqrepBuffer', 'busy'], 'ZMQ-Support-Core');
smalltalk.addMethod(
"_busy",
smalltalk.method({
selector: "busy",
category: 'not yet classified',
fn: function () {
    var self = this;
    return self['@busy'];
},
args: [],
source: "busy\x0a\x0a\x09^busy",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQReqSocket);

smalltalk.addMethod(
"_busy_",
smalltalk.method({
selector: "busy:",
category: 'not yet classified',
fn: function (aBool) {
    var self = this;
    self['@busy'] = aBool;
    return self;
},
args: ["aBool"],
source: "busy: aBool\x0a\x0a\x09busy := aBool",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQReqSocket);

smalltalk.addMethod(
"_primHandle_",
smalltalk.method({
selector: "primHandle:",
category: 'not yet classified',
fn: function (aMessage) {
    var self = this;
    var mCallback;
    smalltalk.send(self, "_busy_", [false]);
    mCallback = smalltalk.send(smalltalk.send(smalltalk.send(self, "_reqrepBuffer", []), "_at_", [0]), "_at_", [1]);
    smalltalk.send(self, "_reqrepBuffer_", [smalltalk.send(smalltalk.send(self, "_reqrepBuffer", []), "_slice_", [1])]);
    smalltalk.send(self, "_callback_", [aMessage]);
    smalltalk.send(self, "_primSendBuffer", []);
    return self;
},
args: ["aMessage"],
source: "primHandle: aMessage\x0a\x09   \x0a   | mCallback | \x0a\x0a    self busy: false.\x0a    \x0a    mCallback := (self reqrepBuffer at: 0 ) at: 1.\x0a    \x0a    self reqrepBuffer: (self reqrepBuffer slice:1).\x0a    \x0a    self callback: aMessage.\x0a    \x0a    self primSendBuffer",
messageSends: ["busy:", "at:", "reqrepBuffer", "reqrepBuffer:", "slice:", "callback:", "primSendBuffer"],
referencedClasses: []
}),
smalltalk.ZMQReqSocket);

smalltalk.addMethod(
"_primSend_callback_",
smalltalk.method({
selector: "primSend:callback:",
category: 'not yet classified',
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
},
args: ["aMessage", "aCallback"],
source: "primSend: aMessage callback: aCallback \x0a\x0a\x09self reqrepBuffer push: [aMessage , aCallback].\x0a   \x0a   self busy\x0a   \x09\x09ifTrue:[^self].\x0a    \x0a\x09self primSendBuffer\x0a    ",
messageSends: ["push:", ",", "reqrepBuffer", "ifTrue:", "busy", "primSendBuffer"],
referencedClasses: []
}),
smalltalk.ZMQReqSocket);

smalltalk.addMethod(
"_primSendBuffer",
smalltalk.method({
selector: "primSendBuffer",
category: 'not yet classified',
fn: function () {
    var self = this;
    var $1;
    $1 = smalltalk.send(smalltalk.send(self, "_busy", []), "_||", [smalltalk.send(smalltalk.send(smalltalk.send(self, "_reqrepBuffer", []), "_length", []), "__eq", [0])]);
    if (smalltalk.assert($1)) {
        return self;
    }
    smalltalk.send(self, "_busy_send_", [smalltalk.send(smalltalk.send(true, "_self", []), "_zmqContext", []), smalltalk.send(self, "_reqrepBuffer_", [0])]);
    return self;
},
args: [],
source: "primSendBuffer\x0a\x09   \x0a   (self busy) || (self reqrepBuffer length = 0) \x0a   \x09\x09ifTrue:[^self].\x0a    \x0a    self busy: true\x0a\x09self  zmqContext send: ( self reqrepBuffer: 0).\x0a    ",
messageSends: ["ifTrue:", "||", "=", "length", "reqrepBuffer", "busy", "busy:send:", "zmqContext", "self", "reqrepBuffer:"],
referencedClasses: []
}),
smalltalk.ZMQReqSocket);

smalltalk.addMethod(
"_reqrepBuffer",
smalltalk.method({
selector: "reqrepBuffer",
category: 'not yet classified',
fn: function () {
    var self = this;
    return self['@reqrepBuffer'];
},
args: [],
source: "reqrepBuffer\x0a\x0a\x09^reqrepBuffer",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQReqSocket);

smalltalk.addMethod(
"_reqrepBuffer_",
smalltalk.method({
selector: "reqrepBuffer:",
category: 'not yet classified',
fn: function (aBuffer) {
    var self = this;
    self['@reqrepBuffer'] = aBuffer;
    return self;
},
args: ["aBuffer"],
source: "reqrepBuffer: aBuffer\x0a\x0a\x09reqrepBuffer := aBuffer",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQReqSocket);

smalltalk.addMethod(
"_socketType",
smalltalk.method({
selector: "socketType",
category: 'not yet classified',
fn: function () {
    var self = this;
    return 3;
},
args: [],
source: "socketType\x0a\x0a\x09\x22ZMQ::REQ\x22\x0a\x0a\x09^3\x0a\x09",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQReqSocket);



smalltalk.addClass('ZMQSubSocket', smalltalk.ZMQSocket, [], 'ZMQ-Support-Core');
smalltalk.addMethod(
"_primHandle_",
smalltalk.method({
selector: "primHandle:",
category: 'not yet classified',
fn: function (aMessage) {
    var self = this;
    smalltalk.send(self, "_onmessage_", [aMessage]);
    return self;
},
args: ["aMessage"],
source: "primHandle: aMessage\x0a\x0a\x09self onmessage: aMessage\x0a",
messageSends: ["onmessage:"],
referencedClasses: []
}),
smalltalk.ZMQSubSocket);

smalltalk.addMethod(
"_socketType",
smalltalk.method({
selector: "socketType",
category: 'not yet classified',
fn: function () {
    var self = this;
    return 2;
},
args: [],
source: "socketType\x0a\x0a\x09\x22ZMQ::SUB\x22\x0a\x0a\x09^2\x0a\x09",
messageSends: [],
referencedClasses: []
}),
smalltalk.ZMQSubSocket);



