<template>
  <div>
    <div class="main">
      <video autoplay="autoplay" class="localVideo" id="localVideo"></video>
      <video autoplay="autoplay" class="remoteVideo" id="remoteVideo"></video>
    </div>
    <div class="footer" id="footer"></div>
  </div>
</template>
<script src="https://static.acgist.com/demo/video/channel.js"></script>
<script>
  export default {
    name: "video",
    data() {
      return {
        peer: {},
        socket: {},
        supportStream: false,
        localVideo: document.getElementById("localVideo"),
        localVideoStream,
        remoteVideo: document.getElementById("remoteVideo"),
        remoteVideoStream,
        initiator: false,
        started: false,
        channelReady: false,
        PeerConnection: window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
      }
    },
    methods: {
      initialize() {
        console.log("初始聊天");
        // 获取视频
        this.supportStream = "srcObject" in this.localVideo;
        // 显示状态
        if (this.initiator) {
          this.setNotice("开始连接");
        } else {
          this.setNotice("加入聊天：http://127.0.0.1:8080/demo/video/?oid=123456");
        }
        // 打开WebSocket
        this.openChannel();
        // 创建用户媒体
        this.buildUserMedia();
      },
      openChannel() {
        console.log("打开WebSocket");
        socket = new WebSocket("ws://39.107.125.161:8080/video/12");
        socket.onopen = this.channelOpened();
        socket.onmessage = this.channelMessage();
        socket.onclose = this.channelClosed();
        socket.onerror = this.channelError();
      },
      channelOpened() {
        console.log("打开WebSocket成功");
        this.channelReady = true;
      },
      channelMessage(message) {
        console.log("收到消息：" + message.data);
        let msg = JSON.parse(message.data);
        if (msg.type === "offer") { // 处理Offer消息
          if (!this.initiator && !this.started) {
            this.connectPeer();
          }
          this.peer.setRemoteDescription(new RTCSessionDescription(msg));
          this.peer.createAnswer().then(this.buildLocalDescription);
        } else if (msg.type === "answer" && this.started) { // 处理Answer消息
          this.peer.setRemoteDescription(new RTCSessionDescription(msg));
        } else if (msg.type === "candidate" && this.started) {
          let candidate = new RTCIceCandidate({
            sdpMLineIndex: msg.label,
            candidate: msg.candidate
          });
          this.peer.addIceCandidate(candidate);
        } else if (msg.type === "bye" && this.started) {
          this.onRemoteClose();
          this.setNotice("对方已断开！");
        } else if (msg.type === "nowaiting") {
          this.onRemoteClose();
          this.setNotice("对方已离开！");
        }
      },
      channelClosed() {
        console.log("关闭WebSocket");
        this.openChannel(); // 重新打开WebSocket
      },
      channelError(event) {
        console.log("WebSocket异常：" + event);
      },
      buildUserMedia() {
        console.log("获取用户媒体");
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({
            "audio": true,
            "video": true
          })
            .then(this.onUserMediaSuccess)
            .catch(this.onUserMediaError);
        } else {
          navigator.getUserMedia({
            "audio": true,
            "video": true
          }, onUserMediaSuccess, onUserMediaError);
        }
      },
      onUserMediaSuccess(stream) {
        this.localVideoStream = stream;
        if (this.supportStream) {
          this.localVideo.srcObject = this.localVideoStream;
        } else {
          this.localVideo.src = URL.createObjectURL(this.localVideoStream);
        }
        if (this.initiator) {
          this.connectPeer();
        }
      },
      onUserMediaError(error) {
        alert("请打开摄像头！");
      },
      connectPeer() {
        if (!this.started && this.localVideoStream && this.channelReady) {
          console.log("开始连接Peer");
          this.started = true;
          this.buildPeerConnection();
          this.peer.addStream(this.localVideoStream);
          if (this.initiator) {
            this.peer.createOffer().then(this.buildLocalDescription);
          }
        }
      },
      buildPeerConnection() {
        //var server = {"iceServers" : [{"url" : "stun:stun.l.google.com:19302"}]};
        let server = {"iceServers": [{"url": "stun:stun1.l.google.com:19302"}]};
        this.peer = new PeerConnection(server);
        this.peer.onicecandidate = this.peerIceCandidate;
        this.peer.onconnecting = this.peerConnecting;
        this.peer.onopen = this.peerOpened;
        this.peer.onaddstream = this.peerAddStream;
        this.peer.onremovestream = this.peerRemoveStream;
      },
      peerIceCandidate(event) {
        if (event.candidate) {
          this.sendMessage({
            type: "candidate",
            id: event.candidate.sdpMid,
            label: event.candidate.sdpMLineIndex,
            candidate: event.candidate.candidate
          });
        } else {
          console.log("不支持的candidate");
        }
      },
      peerConnecting(message) {
        console.log("Peer连接");
      },
      peerOpened(message) {
        console.log("Peer打开");
      },
      peerAddStream(event) {
        console.log("远程视频添加");
        this.remoteVideoStream = event.stream;
        if (this.supportStream) {
          this.remoteVideo.srcObject = this.remoteVideoStream;
        } else {
          this.remoteVideo.src = URL.createObjectURL(this.remoteVideoStream);
        }
        this.setNotice("连接成功");
        this.waitForRemoteVideo();
      },
      peerRemoveStream(event) {
        console.log("远程视频移除");
      },
      buildLocalDescription(description) {
        this.peer.setLocalDescription(description);
        this.sendMessage(description);
      },

      sendMessage(message) {
        let msgJson = JSON.stringify(message);
        socket.send(msgJson);
        console.log("发送信息：" + msgJson);
      },
      setNotice(msg) {
        document.getElementById("footer").innerHTML = msg;
      },
      onRemoteClose() {
        this.started = false;
        this.initiator = false;
        if (this.supportStream) {
          this.remoteVideo.srcObject = null;
        } else {
          this.remoteVideo.src = null;
        }
        this.peer.close();
      },
      waitForRemoteVideo() {
        if (this.remoteVideo.currentTime > 0) { // 判断远程视频长度
          this.setNotice("连接成功！");
        } else {
          setTimeout(this.waitForRemoteVideo, 100);
        }
      }
    },
    mounted() {
      window.onbeforeunload = function () {
        this.sendMessage({type: "bye"});
        if (this.peer) {
          this.peer.close();
        }
        socket.close();
      };
      if (!WebSocket) {
        alert("你的浏览器不支持WebSocket！");
      } else if (!this.PeerConnection) {
        alert("你的浏览器不支持RTCPeerConnection！");
      } else {
        setTimeout(initialize, 100); // 加载完成调用初始化方法
      }
      window.onbeforeunload = function () {
        socket.close();
      }
    }
  }
</script>

<style scoped>
  * {
    margin: 0;
    padding: 0;
    overflow-y: hidden;
  }

  body {
    background-color: rgb(34, 34, 34);
  }

  .main {
    margin: auto;
  }

  .localVideo {
    box-shadow: 0 0 20px #000;
    width: 15%;
    display: block;
    position: fixed;
    left: 25%;
  }

  .remoteVideo {
    box-shadow: 0 0 20px #000;
    width: 50%;
    display: block;
    position: fixed;
    left: 25%;
  }

  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: auto;
    background-color: #404040;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    line-height: 28px;
    text-align: center;
  }
</style>
