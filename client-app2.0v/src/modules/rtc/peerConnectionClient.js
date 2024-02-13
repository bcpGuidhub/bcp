class PeerConnectionClient {
  constructor(iceServers, signalingChannel, boadRoomId, clientId, peerId, sessionId) {
    this.iceServer = iceServers;
    this.pc_ = null;
    this.remotePcId = peerId;
    this.signaling = signalingChannel;
    this.startTime = new Date();
    this.boadRoomId = boadRoomId;
    this.clientId = clientId;
    this.status = null;
    this.remoteView = null;
    this.sessionId = sessionId;
    // Set up audio and video regardless of what devices are present.
    // Disable comfort noise for maximum audio quality.
    this.DEFAULT_SDP_OFFER_OPTIONS_ = {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1,
      voiceActivityDetection: false
    };
    this.hasRemoteSdp_ = false;
    this.messageQueue_ = [];
    this.started_ = false;
  }

  createLocalPeerConnection() {
    this.pc_ = new RTCPeerConnection(this.iceServer);
    // // Send any ice candidates to the other peer.
    this.pc_.onicecandidate = ({ candidate }) => {
      if (candidate) {
        const ICEcandidateMsg = {
          cmd: 'iceCandidate',
          msg: JSON.stringify(candidate),
          board_room_id: this.boadRoomId,
          ssuid: this.sessionId,
          client_id: this.clientId,
          peer_id: this.remotePcId
        };

        this.signaling.send(ICEcandidateMsg);
      }
    };

    // Let the "negotiationneeded" event trigger offer generation.
    this.pc_.onnegotiationneeded = async () => {
      try {
        await this.pc_.setLocalDescription(await this.pc_.createOffer());
        // Send the offer to the other peer.

        const peerOfferMsg = {
          cmd: 'peerOffer',
          msg: JSON.stringify(this.pc_.localDescription),
          board_room_id: this.boadRoomId,
          ssuid: this.sessionId,
          client_id: this.clientId,
          peer_id: this.remotePcId
        };

        this.signaling.send(peerOfferMsg);
      } catch (err) {
        console.error(err);
      }
    };

    // // Once remote track media arrives, show it in remote video element.
    this.pc_.ontrack = (event) => {
      // Don't set srcObject again if it is already set.
      if (this.remoteView.srcObject) return;
      [this.remoteView.srcObject] = event.streams;
    };

    this.pc_.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent.bind(this);
    this.pc_.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent.bind(this);
    this.pc_.onsignalingstatechange = this.handleSignalingStateChangeEvent.bind(this);
  }

  createLocalOnOfferPeerConnection() {
    this.pc_ = new RTCPeerConnection(this.iceServer);
    // // Send any ice candidates to the other peer.
    this.pc_.onicecandidate = ({ candidate }) => {
      if (candidate) {
        const ICEcandidateMsg = {
          cmd: 'iceCandidate',
          msg: JSON.stringify(candidate),
          board_room_id: this.boadRoomId,
          ssuid: this.sessionId,
          client_id: this.clientId,
          peer_id: this.remotePcId
        };

        this.signaling.send(ICEcandidateMsg);
      }
    };

    // // Once remote track media arrives, show it in remote video element.
    this.pc_.ontrack = (event) => {
      // Don't set srcObject again if it is already set.
      if (this.remoteView.srcObject) return;
      [this.remoteView.srcObject] = event.streams;
    };

    this.pc_.oniceconnectionstatechange = this.handleICEConnectionStateChangeEvent.bind(this);
    this.pc_.onicegatheringstatechange = this.handleICEGatheringStateChangeEvent.bind(this);
    this.pc_.onsignalingstatechange = this.handleSignalingStateChangeEvent.bind(this);
  }

  setViewNode(viewNode) {
    this.remoteView = viewNode;
  }
  // Handle |iceconnectionstatechange| events. This will detect
  // when the ICE connection is closed, failed, or disconnected.
  //
  // This is called when the state of the ICE agent changes.

  handleICEConnectionStateChangeEvent(event) {
    if (!this.pc_) {
      return;
    }

    if (this.pc_.iceConnectionState === 'completed') {
      console.log(this.pc_.iceConnectionState);
    }

    switch (this.pc_.iceConnectionState) {
      case 'closed':
      case 'failed':
      case 'disconnected':
        this.close();
        break;
      default:
    }
  }

  // Handle the |icegatheringstatechange| event. This lets us know what the
  // ICE engine is currently working on: "new" means no networking has happened
  // yet, "gathering" means the ICE engine is currently gathering candidates,
  // and "complete" means gathering is complete. Note that the engine can
  // alternate between "gathering" and "complete" repeatedly as needs and
  // circumstances change.
  //
  // We don't need to do anything when this happens, but we log it to the
  // console so you can see what's going on when playing with the sample.

  handleICEGatheringStateChangeEvent(event) {
    if (!this.pc_) {
      return;
    }
    console.log(event);
  }

  // Set up a |signalingstatechange| event handler. This will detect when
  // the signaling connection is closed.
  //
  // NOTE: This will actually move to the new RTCPeerConnectionState enum
  // returned in the property RTCPeerConnection.connectionState when
  // browsers catch up with the latest version of the specification!

  handleSignalingStateChangeEvent(event) {
    switch (this.pc_.signalingState) {
      case 'closed':
        this.close();
        break;
      default:
    }
  }

  addStream(stream) {
    if (!this.pc_) {
      return;
    }
    stream.getTracks().forEach((track) => this.pc_.addTrack(track, stream));
  }

  async receiveSignalingMessage(payload) {
    const boardRoomMessage = payload.board_room_message;
    const { message } = boardRoomMessage;
    const unmarshaledPayloadMessage = JSON.parse(message);
    const { type, candidate } = unmarshaledPayloadMessage;

    if (type) {
      if (type === 'offer' || type === 'answer') {
        this.hasRemoteSdp_ = true;
        this.messageQueue_.unshift(payload);
      } else {
        console.error('Unsupported SDP type.');
      }
    } else if (candidate) {
      this.messageQueue_.push(payload);
    } else {
      console.error('Unsupported SDP type.');
    }
    this.drainMessageQueue_();
  }

  drainMessageQueue_() {
    if (!this.pc_ || !this.hasRemoteSdp_) {
      return;
    }
    this.messageQueue_.forEach((msg) => this.processSignalingMessage_(msg));
    this.messageQueue_ = [];
  }

  async processSignalingMessage_(payload) {
    const boardRoomMessage = payload.board_room_message;
    const { message } = boardRoomMessage;
    const unmarshaledPayloadMessage = JSON.parse(message);
    const { type, candidate } = unmarshaledPayloadMessage;
    try {
      if (type) {
        if (type === 'offer') {
          if (this.pc_.signalingState !== 'stable') {
            console.error(`ERROR: remote offer received in unexpected state:   ${this.pc_.signalingState}`);
            return;
          }
          await this.pc_.setRemoteDescription(unmarshaledPayloadMessage);
          await this.pc_.setLocalDescription(await this.pc_.createAnswer());
          const peerAnswerMsg = {
            cmd: 'peerAnswer',
            msg: JSON.stringify(this.pc_.localDescription),
            board_room_id: this.boadRoomId,
            ssuid: this.sessionId,
            client_id: this.clientId,
            peer_id: this.remotePcId
          };
          this.signaling.send(peerAnswerMsg);
        } else if (type === 'answer') {
          if (this.pc_.signalingState !== 'have-local-offer') {
            console.error(`ERROR: remote answer received in unexpected state:    ${this.pc_.signalingState}`);
            return;
          }
          await this.pc_.setRemoteDescription(unmarshaledPayloadMessage);
        } else {
          console.error('Unsupported SDP type.');
        }
      } else if (candidate) {
        await this.pc_.addIceCandidate(unmarshaledPayloadMessage);
      } else {
        console.log('unknown case');
      }
    } catch (err) {
      console.error(err);
    }
  }

  close() {
    if (!this.pc_) {
      return;
    }
    this.pc_.close();
    this.pc_ = null;
  }
}

export { PeerConnectionClient };
