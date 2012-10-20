Smalltalk current createPackage: 'ZMQ-Support-Core' properties: #{}!
Object subclass: #ZMQBridge
	instanceVariableNames: 'zmqContex zmqSockets'
	package: 'ZMQ-Support-Core'!

!ZMQBridge class methodsFor: 'not yet classified'!

generateUUID

	<var s = [];
    var hexDigits = "0123456789ABCDEF";
    for (var i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[12] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[16] = hexDigits.substr((s[16] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    
    var uuid = s.join("");
    return uuid;>
! !

Object subclass: #ZMQContext
	instanceVariableNames: 's zmqSockets connected sendBuffer'
	package: 'ZMQ-Support-Core'!

!ZMQContext methodsFor: 'not yet classified'!

connect: aSocket url: aZMQConnString auth: anAuth
	
    | mMsg mMsgObj |
    
    anAuth at: 'zmq_conn_string' put: aZMQConnString.
    anAuth at: 'socket_type' put: aSocket socketType.
    
    mMsg := JSON stringify: anAuth.
    mMsgObj :=  aSocket constructMessage: mMsg with: 'connect'.
    mMsg :=  JSON stringify: mMsgObj.
    
    self send: mMsg
!

connected

	^connected
!

connected: aBoolean

	connected := aBoolean
!

createNewRepSocket

   ^self registerNewSocket: ( ZMQRepSocket newOnContext: self )
!

createNewReqSocket

   ^self registerNewSocket: ( ZMQReqSocket newOnContext: self )
!

createNewSocket: aZMQSocketType

   aZMQSocketType = SUB
   		ifTrue:[ ^self registerNewSocket: ( ZMQSubSocket newOnContext: self )  ].
  
   aZMQSocketType = REQ
   		ifTrue:[ ^self registerNewSocket: ( ZMQReqSocket newOnContext: self )  ].
        
   aZMQSocketType = REP
   		ifTrue:[ ^self registerNewSocket:  ( ZMQRepSocket newOnContext: self ) ].
        
    ^self error: 'SocketType not yet supported'
!

createNewSubSocket

   ^self registerNewSocket: ( ZMQSubSocket newOnContext: self )
!

initialize

	zmqSockets := Dictionary new.
!

initializeOnURL: aWSConnectionURL

    self try: [s := <new WebSocket(aWSConnectionURL)>] 
    	  catch: [s := <new MozWebSocket(aWSConnectionURL)>].
    
    s at: 'onmessage' put: self onMessageWSOverrideBlock.
    s at: 'onopen' put: self onOpenWSOverrideBlock.
                         
    self connected: false.
    self sendBuffer: Array new.
!

map: aParam block: aFunction

	<$.map(aParam, aFunction);>
!

onMessageWSOverrideBlock

	^ [: msg |    | mMsgObj mSocket |
                      
                    mMsgObj := JSON parse: msg data .
    
	 				mSocket := (self sockets at: (mMsgObj at: 'identity')).
     
					mSocket connected
    						ifTrue:[  mSocket  primHandle: (mMsgObj at:'content')]
							ifFalse:[  ((mMsgObj at: 'msg_type' ) === 'connection_reply')
        												ifTrue:[ self onconnect: mSocket message: (mMsgObj at: 'content')] ].
                          
        ].
!

onOpenWSOverrideBlock

	^ [                     
          	 self connected: true.
             
			self map: self sendBuffer block: [:x  | self s send: x. ].
			   
			self sendBuffer: Array new.
                          
        ].
!

onconnect: aSocket message: aMessage 
	
    | mMsgObj |
    
  mMsgObj := JSON parse: aMessage. 
  
  ((mMsgObj at: 'status') === 'success')
  		ifTrue:[aSocket connected: true]
      	ifFalse:[aSocket connected: false]
!

registerNewSocket: aZMQSocket

	   ^self sockets at: aZMQSocket identity put: aZMQSocket
!

send: aMessage

	self connected 
    	ifTrue:[ s send: aMessage ]
        ifFalse:[ self sendBuffer push: aMessage ]
!

sendBuffer

	^sendBuffer
!

sendBuffer: anArray

	sendBuffer := anArray
!

zmqSockets

	^zmqSockets
! !

!ZMQContext class methodsFor: 'not yet classified'!

new

	self error: 'use new: instead'
!

new: aWSConnectionURL

	^super new initializeOnURL: aWSConnectionURL
! !

Object subclass: #ZMQNode
	instanceVariableNames: 'zmqSocket'
	package: 'ZMQ-Support-Core'!

!ZMQNode methodsFor: 'not yet classified'!

zmqSocket

	^zmqSocket
!

zmqSocket: aZMQSocket

	zmqSocket := aZMQSocket
! !

!ZMQNode class methodsFor: 'not yet classified'!

new

	self error: 'use newOnSocket: instead'
!

newOnSocket: aZMQSocket

	^super new zmqSocket: aZMQSocket
! !

ZMQNode subclass: #ZMQRPCClient
	instanceVariableNames: ''
	package: 'ZMQ-Support-Core'!

!ZMQRPCClient methodsFor: 'not yet classified'!

rpc: aFuncName args: anArgs kwargs: aKWArgs callback: aCallback

	| mMessage mWrappedCallback | 

 mMessage := Dictionary new
			    at: 'funcname'  put: aFuncName;
                            at: 'args'  put: anArgs;
                            at: 'kwargs'  put: aKWArgs;
							yourself.
                            
    mWrappedCallback := [:msg  |  |mMsgObj |
						mMsgObj := JSON parse: mMessage.
						self callback: ( mMsgObj at: 'returnval') ].
    
    self zmqSocket send: (JSON stringify: mMessage ) callback: mWrappedCallback.
! !

ZMQNode subclass: #ZMQRPCServer
	instanceVariableNames: ''
	package: 'ZMQ-Support-Core'!

!ZMQRPCServer methodsFor: 'not yet classified'!

handle: aMessage

	 | mMsgObj mFuncName mArgs mRetVal |

    mMsgObj := JSON parse: aMessage.
    mFuncName := mMsgObj at: 'funcname'.
    mArgs := mMsgObj at: 'args' ifAbsent: [Array new].
    
    self try: [ mRetVal :=  self basicPerform: mFuncName withArguments: mArgs] catch: [:err  |  mRetVal := err   ].
   
    self zmqSocket send: (JSON stringify:( Dictionary new at: 'returnval'  put: mRetVal ; yourself )).
!

overrideSocketOnMessage
    
    self zmqSocket notNil
    	ifTrue:[^self].
        
	self zmqSocket at: 'onmessage'  put: [:msg  | self handle: msg ].
! !

!ZMQRPCServer class methodsFor: 'not yet classified'!

newOnSocket: aSocket

   ^(super newOnSocket: aSocket) overrideSocketOnMessage
! !

ZMQRPCServer subclass: #ZMQPubRPCServer
	instanceVariableNames: ''
	package: 'ZMQ-Support-Core'!

!ZMQPubRPCServer methodsFor: 'not yet classified'!

handlePub: aMessage

	 | mMsgObj mFuncName mArgs |

    mMsgObj := JSON parse: aMessage.
    mFuncName := mMsgObj at: 'funcname'.
    mArgs := mMsgObj at: 'args' ifAbsent: [Array new].
    
    self basicPerform: mFuncName withArguments: mArgs.
!

overrideSocketOnMessage
    
    self zmqSocket notNil
    	ifTrue:[^self].
        
	self zmqSocket overrideSocketOnMessageWith: [:msg  | self handlePub: msg ].
! !

Object subclass: #ZMQSocket
	instanceVariableNames: 'zmqContext identity'
	package: 'ZMQ-Support-Core'!

!ZMQSocket methodsFor: 'not yet classified'!

connect: aZMQConnString auth: anAuth

  self zmqContext connect: self  url: aZMQConnString auth: anAuth
!

constructMessage: aMessage

	^self constructMessage: aMessage type: nil
!

constructMessage: aMessage type: aMessageType

	  | mMessageType mMessageStruct |

   aMessageType isNil
    	ifTrue:[ mMessageType = 'userlevel']
      	ifFalse:[mMessageType := aMessageType ].
        
      mMessageStruct := Dictionary new.
      
     mMessageStruct at: 'identity' put: self identity.
     mMessageStruct at: 'content' put: aMessage.
     mMessageStruct at: 'msg_type' put: mMessageType.
     
     ^mMessageStruct
!

identity

	^identity
!

initialize

	identity := ZMQBridge generateUUID
!

initializeOnContext: aZMQContext
    
     zmqContext := aZMQContext
!

overrideSocketOnMessageWith: aBlock

     self zmqContext at: 'onmessage'  put: aBlock
!

send: aMessage callback: aCallback type: aMessageType

	 |  mMsgObj |

    mMsgObj := self constructMessage: aMessage type: aMessageType.
    self primSend: (JSON stringify: mMsgObj) callback: aCallback
!

socketType

	self subclassResponsibility
!

zmqContext

	^zmqContext
! !

!ZMQSocket class methodsFor: 'not yet classified'!

new

	^self error: 'use newOnContext: instead'
!

newOnContext: aZMQContext

	^super new initializeOnContext: aZMQContext
! !

ZMQSocket subclass: #ZMQRepSocket
	instanceVariableNames: 'inBuffer'
	package: 'ZMQ-Support-Core'!

!ZMQRepSocket methodsFor: 'not yet classified'!

inBuffer

	^inBuffer
!

inBuffer: aBuffer

	inBuffer := aBuffer
!

primHandle: aMessage 

    self inBuffer push: aMessage.
    self primRecvBuffer
!

primRecvBuffer

	 | mMessage mMsgObj mContent | 

	(self busy) || (self inBuffer length = 0) 
   		ifTrue:[^self].
   
	mMessage = self inBuffer at: 0.
	self inBuffer: (self inBuffer slice:1).

	self busy: true.
    
	mMsgObj := JSON parse: mMessage.
	mContent := mMsgObj at: (mMsgObj length - 1).
    
	self address: (mMsgObj at: 0).
    
	self onmessage: mContent
!

send: aMessage

	 | mMessage mMsgObj | 

    mMessage := self address, '', aMessage.
    mMessage = JSON stringify: mMessage.
    mMsgObj := self constructMessage: mMessage.
    
    self zmqContext send: (JSON stringify: mMsgObj).
    
    self busy:  false.
  
    self primRecvBuffer
!

socketType

	"ZMQ::REP"

	^4
! !

ZMQSocket subclass: #ZMQReqSocket
	instanceVariableNames: 'reqrepBuffer busy'
	package: 'ZMQ-Support-Core'!

!ZMQReqSocket methodsFor: 'not yet classified'!

busy

	^busy
!

busy: aBool

	busy := aBool
!

primHandle: aMessage
	   
   | mCallback | 

    self busy: false.
    
    mCallback := (self reqrepBuffer at: 0 ) at: 1.
    
    self reqrepBuffer: (self reqrepBuffer slice:1).
    
    self callback: aMessage.
    
    self primSendBuffer
!

primSend: aMessage callback: aCallback 

	self reqrepBuffer push: [aMessage , aCallback].
   
   self busy
   		ifTrue:[^self].
    
	self primSendBuffer
!

primSendBuffer
	   
   (self busy) || (self reqrepBuffer length = 0) 
   		ifTrue:[^self].
    
    self busy: true
	self  zmqContext send: ( self reqrepBuffer: 0).
!

reqrepBuffer

	^reqrepBuffer
!

reqrepBuffer: aBuffer

	reqrepBuffer := aBuffer
!

socketType

	"ZMQ::REQ"

	^3
! !

ZMQSocket subclass: #ZMQSubSocket
	instanceVariableNames: ''
	package: 'ZMQ-Support-Core'!

!ZMQSubSocket methodsFor: 'not yet classified'!

primHandle: aMessage

	self onmessage: aMessage
!

socketType

	"ZMQ::SUB"

	^2
! !

