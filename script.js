const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

let peerConnection;
let dataChannel;

// 用于信令的WebSocket连接或其他机制应在此处设置
// 例如，使用WebSocket发送offer、answer和ICE候选等

async function start() {
  try {
    // 1. 获取本地媒体流
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideo.srcObject = stream;

    // 2. 创建RTCPeerConnection
    peerConnection = new RTCPeerConnection();

    // 3. 处理ICE候选
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // 发送ICE候选给远程对等点
        // 例如，使用WebSocket发送ICE候选
      }
    };

    // 4. 处理远程流
    peerConnection.ontrack = (event) => {
      remoteVideo.srcObject = event.streams[0];
    };

    // 添加本地流到连接
    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });

    // 创建数据通道（可选，但可用于信令或其他目的）
    dataChannel = peerConnection.createDataChannel('dataChannel');
    dataChannel.onmessage = (event) => {
      console.log('Received data channel message:', event.data);
    };

    // 发送offer给远程对等点
    // 这通常是在信令交换的一部分中完成的
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    // 使用WebSocket或其他机制发送offer给远程对等点
  } catch (error) {
    console.error('Error:', error);
  }
}

// 当接收到远程对等点的answer时调用此函数
async function setRemoteDescription(description) {
  try {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(description)
    );
  } catch (error) {
    console.error('Error setting remote description:', error);
  }
}

// 当接收到ICE候选时调用此函数
function addIceCandidate(candidate) {
  try {
    const iceCandidate = new RTCIceCandidate(candidate);
    peerConnection.addIceCandidate(iceCandidate);
  } catch (error) {
    console.error('Error adding ICE candidate:', error);
  }
}

// 启动流程
start();
