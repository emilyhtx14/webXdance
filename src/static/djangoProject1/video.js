'use strict';

// voice recognition
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
// speechRecognitionList.addFromString(grammar, 1);
// recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('index1.html');
var hints = document.querySelector('.hints');

var colorHTML= '';

const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');
const hangupButton = document.getElementById('hangupButton');
callButton.disabled = true;
hangupButton.disabled = true;
startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;
/*
const video1 = document.querySelector('video#video1');
const video2 = document.querySelector('video#video2');
const video3 = document.querySelector('video#video3');
const video4 = document.querySelector('video#video4');
*/
const video1 = document.getElementById('video1');
const video2 = document.getElementById('video2');
const video3 = document.getElementById('video3');
const video4 = document.getElementById('video4');

let pc1Local;
let pc1Remote;
let pc2Local;
let pc2Remote;
let pc3Local;
let pc3Remote;

const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};

function gotStream(stream) {
  console.log('Received local stream');
  video1.srcObject = stream;
  window.localStream = stream;
  callButton.disabled = false;
}

function start() {
  console.log('Requesting local stream');
  startButton.disabled = true;
  navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true
      })
      .then(gotStream)
      .catch(e => console.log('getUserMedia() error: ', e));
}

function call() {
  callButton.disabled = true;
  voice();
  hangupButton.disabled = false;
  //console.log('Starting calls');
  const audioTracks = window.localStream.getAudioTracks()[0].enabled = false;
  const videoTracks = window.localStream.getVideoTracks();
  if (audioTracks.length > 0) {
    //console.log(`Using audio device: ${audioTracks[0].label}`);
  }
  if (videoTracks.length > 0) {
    //console.log(`Using video device: ${videoTracks[0].label}`);
  }
  // Create an RTCPeerConnection via the polyfill.
  const servers = null;
  pc1Local = new RTCPeerConnection(servers);
  pc1Remote = new RTCPeerConnection(servers);
  pc1Remote.ontrack = gotRemoteStream1;
  pc1Local.onicecandidate = iceCallback1Local;
  pc1Remote.onicecandidate = iceCallback1Remote;
  //console.log('pc1: created local and remote peer connection objects');

  pc2Local = new RTCPeerConnection(servers);
  pc2Remote = new RTCPeerConnection(servers);
  pc2Remote.ontrack = gotRemoteStream2;
  pc2Local.onicecandidate = iceCallback2Local;
  pc2Remote.onicecandidate = iceCallback2Remote;
  //console.log('pc2: created local and remote peer connection objects');

  pc3Local = new RTCPeerConnection(servers);
  pc3Remote = new RTCPeerConnection(servers);
  pc3Remote.ontrack = gotRemoteStream3;
  pc3Local.onicecandidate = iceCallback3Local;
  pc3Remote.onicecandidate = iceCallback3Remote;
  //console.log('pc3: created local and remote peer connection objects');

  window.localStream.getTracks().forEach(track => pc1Local.addTrack(track, window.localStream));
  //console.log('Adding local stream to pc1Local');
  pc1Local
      .createOffer(offerOptions)
      .then(gotDescription1Local, onCreateSessionDescriptionError);

  window.localStream.getTracks().forEach(track => pc2Local.addTrack(track, window.localStream));
  //console.log('Adding local stream to pc2Local');
  pc2Local.createOffer(offerOptions)
      .then(gotDescription2Local, onCreateSessionDescriptionError);

  window.localStream.getTracks().forEach(track => pc3Local.addTrack(track, window.localStream));
  //console.log('Adding local stream to pc3Local');
  pc3Local.createOffer(offerOptions)
      .then(gotDescription3Local, onCreateSessionDescriptionError);
}

function onCreateSessionDescriptionError(error) {
  //console.log(`Failed to create session description: ${error.toString()}`);
}

function gotDescription1Local(desc) {
  pc1Local.setLocalDescription(desc);
  //console.log(`Offer from pc1Local\n${desc.sdp}`);
  pc1Remote.setRemoteDescription(desc);
  // Since the 'remote' side has no media stream we need
  // to pass in the right constraints in order for it to
  // accept the incoming offer of audio and video.
  pc1Remote.createAnswer().then(gotDescription1Remote, onCreateSessionDescriptionError);
}

function gotDescription1Remote(desc) {
  pc1Remote.setLocalDescription(desc);
  //console.log(`Answer from pc1Remote\n${desc.sdp}`);
  pc1Local.setRemoteDescription(desc);
}

function gotDescription2Local(desc) {
  pc2Local.setLocalDescription(desc);
  //console.log(`Offer from pc2Local\n${desc.sdp}`);
  pc2Remote.setRemoteDescription(desc);
  // Since the 'remote' side has no media stream we need
  // to pass in the right constraints in order for it to
  // accept the incoming offer of audio and video.
  pc2Remote.createAnswer().then(gotDescription2Remote, onCreateSessionDescriptionError);
}

function gotDescription2Remote(desc) {
  pc2Remote.setLocalDescription(desc);
  //console.log(`Answer from pc2Remote\n${desc.sdp}`);
  pc2Local.setRemoteDescription(desc);
}

function gotDescription3Local(desc) {
  pc3Local.setLocalDescription(desc);
  //console.log(`Offer from pc3Local\n${desc.sdp}`);
  pc3Remote.setRemoteDescription(desc);
  // Since the 'remote' side has no media stream we need
  // to pass in the right constraints in order for it to
  // accept the incoming offer of audio and video.
  pc3Remote.createAnswer().then(gotDescription3Remote, onCreateSessionDescriptionError);
}

function gotDescription3Remote(desc) {
  pc3Remote.setLocalDescription(desc);
  //console.log(`Answer from pc3Remote\n${desc.sdp}`);
  pc3Local.setRemoteDescription(desc);
}

function hangup() {
  console.log('Ending calls');
  recognition.stop()
  pc1Local.close();
  pc1Remote.close();
  pc2Local.close();
  pc2Remote.close();
  pc3Local.close();
  pc3Remote.close();
  pc1Local = pc1Remote = null;
  pc2Local = pc2Remote = null;
  pc3Local = pc3Remote = null;
  video1.style.cssText = "border: 0px"
  video2.style.cssText = "border: 0px"
  video3.style.cssText = "border: 0px"
  video4.style.cssText = "border: 0px"
  hangupButton.disabled = true;
  callButton.disabled = false;
}

function gotRemoteStream1(e) {
  if (video2.srcObject !== e.streams[0]) {
    video2.srcObject = e.streams[0];
    //console.log('pc1: received remote stream');
  }
}

function gotRemoteStream2(e) {
  if (video3.srcObject !== e.streams[0]) {
    video3.srcObject = e.streams[0];
    //console.log('pc2: received remote stream');
  }
}

function gotRemoteStream3(e) {
  if (video4.srcObject !== e.streams[0]) {
    video4.srcObject = e.streams[0];
    //console.log('pc3: received remote stream');
  }
}

function iceCallback1Local(event) {
  handleCandidate(event.candidate, pc1Remote, 'pc1: ', 'local');
}

function iceCallback1Remote(event) {
  handleCandidate(event.candidate, pc1Local, 'pc1: ', 'remote');
}

function iceCallback2Local(event) {
  handleCandidate(event.candidate, pc2Remote, 'pc2: ', 'local');
}

function iceCallback2Remote(event) {
  handleCandidate(event.candidate, pc2Local, 'pc2: ', 'remote');
}


function iceCallback3Local(event) {
  handleCandidate(event.candidate, pc3Remote, 'pc3: ', 'local');
}

function iceCallback3Remote(event) {
  handleCandidate(event.candidate, pc3Local, 'pc3: ', 'remote');
}

function handleCandidate(candidate, dest, prefix, type) {
  dest.addIceCandidate(candidate)
      .then(onAddIceCandidateSuccess, onAddIceCandidateError);
  //console.log(`${prefix}New ${type} ICE candidate: ${candidate ? candidate.candidate : '(null)'}`);
}

function onAddIceCandidateSuccess() {
  //console.log('AddIceCandidate success.');
}

function onAddIceCandidateError(error) {
  //console.log(`Failed to add ICE candidate: ${error.toString()}`);
}

function voice() {
  recognition.start();
  console.log('Ready to receive a command.');
}

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  var color = event.results[0][0].transcript;
  // diagnostic.textContent = 'Result received: ' + color + '.';
  // bg.style.backgroundColor = color;


  // newly added code
  if (color == "pin1")
      focusWin1();
  if (color == "pin 2" || color == "pintu")
      focusWin2();
  if (color == "pin 3"|| color == "Pain Three")
      focusWin3();
  if (color == "pin 4"||  color == 'pin for')
      focusWin4();

  if (color == "mirror one")
      mirrorWin1();
  if (color == "mirror 2"|| color == "mirror to")
      mirrorWin2();
  if (color == "mirror 3")
      mirrorWin3();
  if (color == "mirror 4")
      mirrorWin4();

  console.log('The command:: -- ' + color);
  console.log('Confidence: ' + event.results[0][0].confidence);
}

recognition.onend = function() {
  console.log('onend: stop! ');
  recognition.start();
}

recognition.onnomatch = function(event) {
  console.log('Invalid Color ');
  //diagnostic.textContent = "I didn't recognise that color.";
}

recognition.onerror = function(event) {
  //diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}

function focusWin1() {
    console.log("Video1 successfully focused.")
    video1.style.cssText = "border:16px solid white"
    video2.style.cssText = "border: 0px"
    video3.style.cssText = "border: 0px"
    video4.style.cssText = "border: 0px"
}

function focusWin2() {
    video2.style.cssText = "border:16px solid white"
    video1.style.cssText = "border: 0px"
    video3.style.cssText = "border: 0px"
    video4.style.cssText = "border: 0px"
}

function focusWin3() {
    video3.style.cssText = "border:16px solid white"
    video1.style.cssText = "border: 0px"
    video2.style.cssText = "border: 0px"
    video4.style.cssText = "border: 0px"
}

function focusWin4() {
    video4.style.cssText = "border:16px solid white"
    video1.style.cssText = "border: 0px"
    video2.style.cssText = "border: 0px"
    video3.style.cssText = "border: 0px"
}

function mirrorWin1() {
    video1.style.transform = 'scale(-1,1)'

}

function mirrorWin2() {
    video2.style.transform = 'scale(-1,1)'
}

function mirrorWin3() {
    video3.style.transform = 'scale(-1,1)'
}

function mirrorWin4() {
    video4.style.transform = 'scale(-1,1)'
}