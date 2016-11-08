
var PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
var IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
var SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
var pc; // PeerConnection
// Step 1. getUserMedia
navigator.getUserMedia(
  { audio: true, video: true }, 
  gotStream, 
  function(error) { console.log(error) }
);
function gotStream(stream) {
document.getElementById("callButton").style.display = 'inline-block';
document.getElementById("localVideo").src = URL.createObjectURL(stream);

 /* var pc_config = {"iceServers": [{"url": "turn:numb.viagenie.ca:19305", "username": 'malukh_e-a@mail.ru', "credential": "PLACE_HERE_YOUR_PASSWORD"}, {"url": "stun:stun.l.google.com:19302"},{url:'stun:stun01.sipphone.com'},
{url:'stun:stun.ekiga.net'},
{url:'stun:stun.fwdnet.net'},
{url:'stun:stun.ideasip.com'},
{url:'stun:stun.iptel.org'},
{url:'stun:stun.rixtelecom.se'},
{url:'stun:stun.schlund.de'},
{url:'stun:stun.l.google.com:19302'},
{url:'stun:stun1.l.google.com:19302'},
{url:'stun:stun2.l.google.com:19302'},
{url:'stun:stun3.l.google.com:19302'},
{url:'stun:stun4.l.google.com:19302'},
{url:'stun:stunserver.org'},
{url:'stun:stun.softjoys.com'},
{url:'stun:stun.voiparound.com'},
{url:'stun:stun.voipbuster.com'},
{url:'stun:stun.voipstunt.com'},
{url:'stun:stun.voxgratia.org'},
{url:'stun:stun.xten.com'}]};*/
var peerConnectionConfig = { 
iceServers:[ 
{urls: ["turn:173.194.72.127:19305?transport=udp", 
"turn:[2404:6800:4008:C01::7F]:19305?transport=udp", 
"turn:173.194.72.127:443?transport=tcp", 
"turn:[2404:6800:4008:C01::7F]:443?transport=tcp" 
], 
username:"CKjCuLwFEgahxNRjuTAYzc/s6OMT", 
credential:"u1SQDR/SQsPQIxXNWQT7czc/G4c=" 
}, 
{urls:["stun:stun.l.google.com:19302"]}, 
{"urls":["turn:35.160.139.209"],"username":"username1","credential":"key1"}]};

pc = new PeerConnection(peerConnectionConfig);
  pc.addStream(stream);
  pc.onicecandidate = gotIceCandidate;
  pc.onaddstream = gotRemoteStream;
}
// Step 2. createOffer
function createOffer() {
  pc.createOffer(
    gotLocalDescription, 
    function(error) { console.log(error) }, 
    { 'mandatory': { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true } }
  );
}
// Step 3. createAnswer
function createAnswer() {
  pc.createAnswer(
    gotLocalDescription,
    function(error) { console.log(error) }, 
    { 'mandatory': { 'OfferToReceiveAudio': true, 'OfferToReceiveVideo': true } }
  );
}
function gotLocalDescription(description){
  pc.setLocalDescription(description);
  sendMessage(description);
}

function gotIceCandidate(event){
  if (event.candidate) {
    sendMessage({
      type: 'candidate',
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate
    });
  }
}

function gotRemoteStream(event){
  document.getElementById("remoteVideo").src = URL.createObjectURL(event.stream);
}


var socket = io.connect('//ec2-35-160-139-209.us-west-2.compute.amazonaws.com:1234');

function sendMessage(message){
  socket.emit('message', message);
}

socket.on('message', function (message){
  if (message.type === 'offer') {
    pc.setRemoteDescription(new SessionDescription(message));
    createAnswer();
    //alert("OFFER");
  } 
  else if (message.type === 'answer') {
    pc.setRemoteDescription(new SessionDescription(message));
    //alert("ANSWER");
  } 
  else if (message.type === 'candidate') {
    var candidate = new IceCandidate({sdpMLineIndex: message.label, candidate: message.candidate});
    pc.addIceCandidate(candidate);
    //alert("CANDIDATE");//hhh
  }
});

