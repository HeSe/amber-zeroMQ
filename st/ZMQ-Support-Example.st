Smalltalk current createPackage: 'ZMQ-Support-Example' properties: #{}!
Object subclass: #ZMQReqSubExample
	instanceVariableNames: 'zmqBridge'
	package: 'ZMQ-Support-Example'!

!ZMQReqSubExample methodsFor: 'not yet classified'!

createReqRepContextandSocket

	| mContext mReqRepSocket |

	mContext := ZMQContext new: 'ws://192.168.0.180/pharo'.
mReqRepSocket := mContext  createNewReqSocket.

	mReqRepSocket connect:'tcp://33.33.33.10:80'.

  mReqRepSocket inspect
!

initialize 

	self createReqRepContextandSocket
!

zmqBridge

	^zmqBridge
! !

!ZMQReqSubExample class methodsFor: 'not yet classified'!

open

	  self new appendToJQuery: 'body' asJQuery
! !

