class SignalingChannel {
  constructor(boardRoomId, clientId, signalingApi) {
    this.boardRoomId = boardRoomId;
    this.clientId = clientId;
    this.websocket_ = null;
    this.hasSeat = false;
    this.messages_ = null;
    this.endPoint = signalingApi;
    this.host = new URL(process.env.REACT_APP_APP_SERVER).host;
    // Public callbacks. Keep it sorted.
    this.onerror = null;
    this.onstatus = null;
    this.onmessage = null;
    this.onsessionid = null;
    this.onpeerjoined = null;
    this.onpeerleftboardroom = null;
    this.sessionUUID = null;
    this.onboardRoomConversationMessage = null;
  }

  openSignalingChannel() {
    return new Promise((resolve, reject) => {
      if (this.websocket_ && (this.websocket_.readyState === 0 || this.websocket_.readyState === 1)) {
        resolve();
      }
      if (process.env.NODE_ENV === 'production') {
        this.websocket_ = new WebSocket(`wss://${this.host}/v1/${this.endPoint}`);
      } else {
        this.websocket_ = new WebSocket(`ws://${this.host}/v1/${this.endPoint}`);
      }

      this.websocket_.onopen = () => {
        this.websocket_.onerror = () => {};
        this.websocket_.onclose = (event) => {
          // TODO reconnect to WSS.
          this.websocket_ = null;
          this.hasSeat = false;
          this.sessionUUID = null;
        };
        resolve();
      };

      this.websocket_.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (typeof this[data.type] === 'function') {
          this[data.type](data);
        } else {
          const { message, conversation } = data.board_room_message;
          if (message) {
            const msg = JSON.parse(message);
            if (msg.type === 'peer_joined_board_room') {
              this.joinBoardRoom(JSON.parse(msg.seats));
            } else if (msg.type === 'peer_leave_board_room_seat') {
              this.leaveBoardRoom(data.board_room_message.client_id);
            } else {
              this.onmessage(data);
            }
          } else if (conversation) {
            this.boardRoomConversationMessage(data.board_room_message);
          } else {
            console.log('unknown message');
          }
        }
      };

      this.websocket_.onerror = function (event) {
        reject(event);
      };
    });
  }

  boardRoomConversationMessage(message) {
    this.messages_ = [...(this.messages_ || []), message];
    this.onboardRoomConversationMessage(this.messages_);
  }

  ready(data) {
    this.sessionUUID = data.ready.sessionUUID;
    this.join();
    this.onsessionid(this.sessionUUID);
  }

  error(data) {
    this.onerror(data);
  }

  peerJoinedBoardRoom(data) {
    this.onpeerjoined(data);
  }

  joinBoardRoom(data) {
    if (this.boardRoomId === data.boardRoomId && this.sessionUUID === data.sessionUUID) {
      this.hasSeat = data.hasSeat;
      this.onstatus(data.status);
      this.peerJoinedBoardRoom(data.seats);
    }
  }

  leaveBoardRoom(clientId) {
    this.onpeerleftboardroom(clientId);
  }

  boardRoomMessages(data) {
    if (
      this.boardRoomId === data.on_board_room_messages.boardRoomId &&
      this.clientId === data.on_board_room_messages.clientId
    ) {
      this.messages_ = data.on_board_room_messages.messages;

      this.onboardRoomConversationMessage(this.messages_);
    }
  }

  join() {
    if (this.hasSeat) {
      return;
    }

    if (!this.websocket_ || this.websocket_.readyState !== WebSocket.OPEN) {
      return;
    }

    const joinMessage = {
      cmd: 'joinBoardRoom',
      board_room_id: this.boardRoomId,
      client_id: this.clientId,
      ssuid: this.sessionUUID
    };
    this.websocket_.send(JSON.stringify(joinMessage));
  }

  loadBoardRoomMessages() {
    if (!this.websocket_ || this.websocket_.readyState !== WebSocket.OPEN) {
      return;
    }

    const boardRoomMessages = {
      cmd: 'boardRoomMessages',
      board_room_id: this.boardRoomId,
      client_id: this.clientId,
      ssuid: this.sessionUUID
    };
    this.websocket_.send(JSON.stringify(boardRoomMessages));
  }

  close() {
    if (this.websocket_ && this.websocket_.OPEN) {
      this.websocket_.close();
      this.websocket_ = null;
    }
  }

  send(wssMessage) {
    if (!this.boardRoomId || !this.clientId) {
      return;
    }

    const msgString = JSON.stringify(wssMessage);

    if (this.websocket_ && this.websocket_.readyState === WebSocket.OPEN) {
      this.websocket_.send(msgString);
    }
  }
}

export { SignalingChannel };
