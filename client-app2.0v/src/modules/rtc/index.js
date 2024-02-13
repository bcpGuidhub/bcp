// hd=true	Use HD camera resolution constraints, i.e. minWidth: 1280, minHeight: 720
// stereo=true&audio=echoCancellation=false	Turn on stereo audio
// debug=loopback	Connect to yourself, e.g. to test firewalls
// ts=[turnserver]	Set TURN server different from the default
// apikey=[apikey]	Turn server API key
// audio=true&video=false	Audio only
// audio=false	Video only
// audio=echoCancellation=false	Disable all audio processing
// audio=googEchoCancellation=false	Disable echo cancellation
// audio=googAutoGainControl=false	Disable gain control
// audio=googNoiseSuppression=false	Disable noise suppression
// asc=ISAC/16000	Set preferred audio send codec to be ISAC at 16kHz (use on Android)
// arc=opus/48000	Set preferred audio receive codec Opus at 48kHz
// vsc=VP8	Set preferred video send codec to VP8
// vrc=H264	Set preferred video receive codec to H264
// dscp=true	Enable DSCP
// ipv6=true	Enable IPv6
// arbr=[bitrate]	Set audio receive bitrate, kbps
// asbr=[bitrate]	Set audio send bitrate
// vrbr=[bitrate]	Set video receive bitrate
// vsbr=[bitrate]	Set video send bitrate
// videofec=false	Turn off video FEC
// opusfec=false	Turn off Opus FEC
// opusdtx=true	Turn on Opus DTX
// opusmaxpbr=8000	Set the maximum sample rate that the receiver can operate, for optimal Opus encoding performance
import { PeerConnectionClient } from './peerConnectionClient';
import { SignalingChannel } from './signalingChannel';

const RTC_DEFAULT = {
  ice_transports: null,
  ice_server_transports: null,
  ice_server_base_url: process.env.REACT_APP_ICE_SERVER_BASE_URL,
  audio: null,
  video: null,
  dtls: null,
  dscp: null,
  ipv6: null,
  api_key: null,
  ice_server_url: {
    username: process.env.REACT_APP_ICE_SERVER_USER,
    credential: process.env.REACT_APP_ICE_SERVER_PASSWORD,
    urls: [
      `turn:${process.env.REACT_APP_ICE_SERVER_BASE_URL}:3478?transport=udp`,
      `stun:${process.env.REACT_APP_ICE_SERVER_BASE_URL}:3478`
    ]
  },
  pc_config: null,
  pc_constraints: null,
  offer_options: {},
  // The media constraints object describes what sort of stream we want
  // to request from the local A/V hardware (typically a webcam and
  // microphone). Here, we specify only that we want both audio and
  // video; however, you can be more specific. It's possible to state
  // that you would prefer (or require) specific resolutions of video,
  // whether to prefer the user-facing or rear-facing camera (if available),
  // and so on.
  //
  // See also:
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints
  // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
  //
  media_constraints: {
    audio: true,
    video: true
  },
  signaling_channel: null
};

const errorMesssages = {
  missingPeers: '#peers required'
};

const MessageTypeConversationMessage = 'boardRoomConversationMessage';

class RTC {
  constructor(
    peerLeft,
    peerJoined,
    sessionMessageCallback,
    statusMessageCallback,
    errorMessageCallback,
    boardRoomId,
    clientId,
    signalingApi,
    onlocalstream,
    onpeercreated,
    onboardRoomConversationMessage
  ) {
    this.rtcConfiguration = RTC_DEFAULT;
    this.boardRoomId = boardRoomId;
    this.clientId = clientId;
    this.signalingApi = signalingApi;
    this.localStream = null;
    this.peers = null;
    this.peerConnectionClients_ = {};
    this.config = { iceServers: [this.rtcConfiguration.ice_server_url] };
    this.errorMessageCallback = errorMessageCallback;
    this.statusMessageCallback = statusMessageCallback;
    this.sessionIdCallback = sessionMessageCallback;
    this.peerJoined = peerJoined;
    this.peerLeft = peerLeft;
    this.onboardRoomConversationMessage = onboardRoomConversationMessage;
    this.channel_ = new SignalingChannel(this.boardRoomId, this.clientId, this.signalingApi);
    this.channel_.onmessage = this.onRecvSignalingChannelMessage_.bind(this);
    this.channel_.onerror = this.errorMessageCallback;
    this.channel_.onstatus = this.statusMessageCallback;
    this.channel_.onsessionid = this.sessionIdCallback;
    this.channel_.onpeerjoined = this.peerJoined;
    this.channel_.onpeerleftboardroom = this.peerLeft;
    this.channel_.onboardRoomConversationMessage = this.onboardRoomConversationMessage;
    this.onlocalStream = onlocalstream;
    this.onpeercreated = onpeercreated;
    this.call_ = false;
    window.self.rtc = this;
  }

  async openSignalingChannel() {
    try {
      await this.channel_.openSignalingChannel();
    } catch (error) {
      console.log('error');
      RTC.handleError(error);
    }
  }

  loadBoardRroomMessage() {
    this.channel_.loadBoardRoomMessages();
  }

  static handleError(error) {
    console.log(error);
    window.location.reload(false);
    // window.alert(error);
  }

  createRtcPeers(sessionId) {
    try {
      const peerConnections = this.peers.reduce((acc, peer) => {
        if (!this.peerConnectionClients_[peer] || typeof this.peerConnectionClients_[peer] === 'undefined') {
          const pcClient_ = this.createPeerConnection(peer, sessionId);
          pcClient_.createLocalPeerConnection();
          pcClient_.addStream(this.localStream);
          const viewNode = this.onpeercreated(peer);
          pcClient_.setViewNode(viewNode);
          acc[peer] = pcClient_;
        }
        return acc;
      }, this.peerConnectionClients_);
      this.peerConnectionClients_ = peerConnections;
      this.call_ = true;
    } catch (error) {
      RTC.handleError(error);
    }
  }

  setLocalStream(stream) {
    this.localStream = stream;
  }

  getLocalMediaStream() {
    console.log('getLocalMediaStream = ', { ...this.rtcConfiguration.media_constraints });
    return navigator.mediaDevices.getUserMedia({ ...this.rtcConfiguration.media_constraints });
  }

  stopMediaStream() {
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    this.localStream = null;
  }

  createPeerConnection(peerId, sessionId) {
    return new PeerConnectionClient(
      this.config.iceServers,
      this.channel_,
      this.boardRoomId,
      this.clientId,
      peerId,
      sessionId
    );
  }

  sendBoardRoomConversationMessage(message, session) {
    const msg = this.conversationMessage(message, session);

    this.channel_.send(msg);
  }

  conversationMessage(message, session) {
    switch (message.contentType) {
      case 'text':
        return this.textMessagePayload(message, session);
      case 'audio':
        return this.audioMessagePayload(message, session);
      case 'image':
        return this.imageMessagePayload(message, session);
      case 'multi-file':
        return this.multiFileMessagePayload(message, session);
      default:
        return {};
    }
  }

  audioMessagePayload(message, session) {
    return {
      cmd: MessageTypeConversationMessage,
      board_room_id: this.boardRoomId,
      ssuid: session,
      client_id: this.clientId,
      conversation: {
        message: {
          content_type: message.contentType
        },
        attachments: message.attachments
      }
    };
  }

  textMessagePayload(message, session) {
    return {
      cmd: MessageTypeConversationMessage,
      board_room_id: this.boardRoomId,
      ssuid: session,
      client_id: this.clientId,
      conversation: {
        message: {
          body: message.message,
          content_type: message.contentType
        }
      }
    };
  }

  imageMessagePayload(message, session) {
    return {
      cmd: MessageTypeConversationMessage,
      board_room_id: this.boardRoomId,
      ssuid: session,
      client_id: this.clientId,
      conversation: {
        message: {
          content_type: message.contentType
        },
        attachments: message.attachments
      }
    };
  }

  multiFileMessagePayload(message, session) {
    return {
      cmd: MessageTypeConversationMessage,
      board_room_id: this.boardRoomId,
      ssuid: session,
      client_id: this.clientId,
      conversation: {
        message: {
          content_type: message.contentType
        },
        attachments: message.attachments
      }
    };
  }

  onRecvSignalingChannelMessage_(msg) {
    if (
      msg.board_room_message.peer_id === this.clientId &&
      msg.board_room_message.session === this.channel_.sessionUUID
    ) {
      if (!this.peers) {
        this.peers = [];
      }

      if (!this.peers.includes(msg.board_room_message.client_id)) {
        this.peers.push(msg.board_room_message.client_id);
      }
      this.createPcClientAsync_(msg)
        .then(() => {
          this.peerConnectionClients_[msg.board_room_message.client_id].receiveSignalingMessage(msg);
        })
        .catch((err) => {
          this.errorMessageCallback(err);
        });
    }
  }

  setPeers(peers) {
    this.peers = peers;
  }

  createPcClientAsync_(msg) {
    return new Promise((resolve, reject) => {
      if (this.peerConnectionClients_[msg.board_room_message.client_id]) {
        resolve();
        return;
      }
      const pcClient_ = this.createPeerConnection(msg.board_room_message.client_id, msg.board_room_message.session);
      this.peerConnectionClients_[msg.board_room_message.client_id] = pcClient_;
      this.getLocalMediaStream()
        .then((stream) => {
          this.call_ = true;
          this.onlocalStream(stream);
          this.setLocalStream(stream);
          this.peerConnectionClients_[msg.board_room_message.client_id].createLocalOnOfferPeerConnection();
          const viewNode = this.onpeercreated(msg.board_room_message.client_id);
          this.peerConnectionClients_[msg.board_room_message.client_id].setViewNode(viewNode);
          this.peerConnectionClients_[msg.board_room_message.client_id].addStream(stream);
          resolve();
        })
        .catch((err) => reject(err));
    });
  }

  toggleVideoMute() {
    const videoTracks = this.localStream.getVideoTracks();
    if (videoTracks.length === 0) {
      console.log('No local audio available.');
      return;
    }

    console.log('Toggling audio mute state.');
    videoTracks.forEach((track) => (track.enabled = !track.enabled));

    console.log(`Video    ${videoTracks[0].enabled ? 'unmuted.' : 'muted.'}`);
  }

  toggleAudioMute() {
    const audioTracks = this.localStream.getAudioTracks();
    if (audioTracks.length === 0) {
      console.log('No local audio available.');
      return;
    }

    console.log('Toggling audio mute state.');
    audioTracks.forEach((track) => (track.enabled = !track.enabled));

    console.log(`Audio   ${audioTracks[0].enabled ? 'unmuted.' : 'muted.'}`);
  }

  closePeerClient(sessionId) {
    Object.entries(this.peerConnectionClients_).map(([peerId, pcClient_]) => pcClient_.close());
    this.peerConnectionClients_ = {};

    const steps = [];
    steps.push({
      step: () =>
        this.channel_.send({
          cmd: 'leaveCall',
          board_room_id: this.boardRoomId,
          msg: JSON.stringify({
            type: 'peer_leave_board_room_seat'
          }),
          ssuid: sessionId,
          client_id: this.clientId
        }),
      errorString: 'Error sending leave:'
    });
    steps.push({
      step: () => this.channel_.close(),
      errorString: 'Error closing signaling channel:'
    });

    const executeStep = (executor, errorString) => {
      try {
        executor();
      } catch (ex) {
        this.errorMessageCallback(`${errorString}  ${ex}`);
      }
    };

    steps.forEach((obj) => executeStep(obj.step, obj.errorString));
  }
}

export { RTC };
