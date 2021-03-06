﻿(function(){var supportsTextTracks;var hlsPlayer;var requiresSettingStartTimeOnStart;var subtitleTrackIndexToSetOnPlaying;var currentTrackList;function htmlMediaRenderer(options){var mediaElement;var self=this;function onEnded(){destroyCustomTrack();Events.trigger(self,'ended');}
function onTimeUpdate(){Events.trigger(self,'timeupdate');}
function onVolumeChange(){Events.trigger(self,'volumechange');}
function onOneAudioPlaying(e){var elem=e.target;elem.removeEventListener('playing',onOneAudioPlaying);$('.mediaPlayerAudioContainer').hide();}
function onPlaying(){Events.trigger(self,'playing');}
function onPlay(){Events.trigger(self,'play');}
function onPause(){Events.trigger(self,'pause');}
function onClick(){Events.trigger(self,'click');}
function onDblClick(){Events.trigger(self,'dblclick');}
function onError(e){destroyCustomTrack();var elem=e.target;var errorCode=elem.error?elem.error.code:'';console.log('Media element error code: '+errorCode);Events.trigger(self,'error');}
function onLoadedMetadata(e){var elem=e.target;elem.removeEventListener('loadedmetadata',onLoadedMetadata);if(!hlsPlayer){elem.play();}}
function requireHlsPlayer(callback){require(['hlsjs'],function(hls){window.Hls=hls;callback();});}
function getStartTime(url){var src=url;var parts=src.split('#');if(parts.length>1){parts=parts[parts.length-1].split('=');if(parts.length==2){return parseFloat(parts[1]);}}
return 0;}
function onOneVideoPlaying(e){var element=e.target;element.removeEventListener('playing',onOneVideoPlaying);self.setCurrentTrackElement(subtitleTrackIndexToSetOnPlaying);var requiresNativeControls=!self.enableCustomVideoControls();if(requiresNativeControls){$(element).attr('controls','controls');}
if(requiresSettingStartTimeOnStart){var src=(self.currentSrc()||'').toLowerCase();var startPositionInSeekParam=getStartTime(src);if(startPositionInSeekParam&&src.indexOf('.m3u8')!=-1){var delay=browserInfo.safari?2500:0;if(delay){setTimeout(function(){element.currentTime=startPositionInSeekParam;},delay);}else{element.currentTime=startPositionInSeekParam;}}}}
function createAudioElement(){var elem=$('.mediaPlayerAudio');if(!elem.length){var html='';var requiresControls=!MediaPlayer.canAutoPlayAudio();if(requiresControls){html+='<div class="mediaPlayerAudioContainer" style="position: fixed;top: 40%;text-align: center;left: 0;right: 0;z-index:999999;"><div class="mediaPlayerAudioContainerInner">';;}else{html+='<div class="mediaPlayerAudioContainer" style="display:none;padding: 1em;background: #222;"><div class="mediaPlayerAudioContainerInner">';;}
html+='<audio class="mediaPlayerAudio" controls>';html+='</audio></div></div>';$(document.body).append(html);elem=$('.mediaPlayerAudio');}
elem=elem[0];elem.addEventListener('playing',onOneAudioPlaying);elem.addEventListener('timeupdate',onTimeUpdate);elem.addEventListener('ended',onEnded);elem.addEventListener('volumechange',onVolumeChange);elem.addEventListener('error',onError);elem.addEventListener('pause',onPause);elem.addEventListener('play',onPlay);elem.addEventListener('playing',onPlaying);return elem;}
function enableHlsPlayer(src){if(src){if(src.indexOf('.m3u8')==-1){return false;}}
return MediaPlayer.canPlayHls()&&!MediaPlayer.canPlayNativeHls();}
function getCrossOriginValue(mediaSource){return'anonymous';}
function createVideoElement(){var html='';var requiresNativeControls=!self.enableCustomVideoControls();var poster=!browserInfo.safari&&options.poster?(' poster="'+options.poster+'"'):'';if(requiresNativeControls&&AppInfo.isNativeApp&&browserInfo.android){html+='<video class="itemVideo" id="itemVideo" preload="metadata" autoplay="autoplay"'+poster+' webkit-playsinline>';}
else if(requiresNativeControls){html+='<video class="itemVideo" id="itemVideo" preload="metadata" autoplay="autoplay"'+poster+' controls="controls" webkit-playsinline>';}
else{html+='<video class="itemVideo" id="itemVideo" preload="metadata" autoplay="autoplay"'+poster+' webkit-playsinline>';}
html+='</video>';var elem=$('#videoElement','#videoPlayer').prepend(html);var itemVideo=$('.itemVideo',elem)[0];itemVideo.addEventListener('loadedmetadata',onLoadedMetadata);itemVideo.addEventListener('timeupdate',onTimeUpdate);itemVideo.addEventListener('ended',onEnded);itemVideo.addEventListener('volumechange',onVolumeChange);itemVideo.addEventListener('play',onPlay);itemVideo.addEventListener('pause',onPause);itemVideo.addEventListener('playing',onPlaying);itemVideo.addEventListener('click',onClick);itemVideo.addEventListener('dblclick',onDblClick);itemVideo.addEventListener('error',onError);return itemVideo;}
var _currentTime;self.currentTime=function(val){if(mediaElement){if(val!=null){mediaElement.currentTime=val/1000;return;}
if(_currentTime){return _currentTime*1000;}
return(mediaElement.currentTime||0)*1000;}};self.duration=function(val){if(mediaElement){return mediaElement.duration;}
return null;};self.stop=function(){destroyCustomTrack();if(mediaElement){mediaElement.pause();if(hlsPlayer){_currentTime=mediaElement.currentTime;try{hlsPlayer.destroy();}
catch(err){console.log(err);}
hlsPlayer=null;}}};self.pause=function(){if(mediaElement){mediaElement.pause();}};self.unpause=function(){if(mediaElement){mediaElement.play();}};self.volume=function(val){if(mediaElement){if(val!=null){mediaElement.volume=val;return;}
return mediaElement.volume;}};var currentSrc;self.setCurrentSrc=function(streamInfo,item,mediaSource,tracks){var elem=mediaElement;if(!elem){currentSrc=null;return;}
if(!streamInfo){currentSrc=null;elem.src=null;elem.src="";if(browserInfo.safari){elem.src='files/dummy.mp4';elem.play();}
return;}
elem.crossOrigin=getCrossOriginValue(mediaSource);var val=streamInfo.url;if(AppInfo.isNativeApp&&browserInfo.safari){val=val.replace('file://','');}
requiresSettingStartTimeOnStart=false;var startTime=getStartTime(val);var playNow=false;if(elem.tagName.toLowerCase()=='audio'){elem.src=val;playNow=true;}
else{elem.removeEventListener('playing',onOneVideoPlaying);elem.addEventListener('playing',onOneVideoPlaying);if(hlsPlayer){hlsPlayer.destroy();hlsPlayer=null;}
if(startTime){requiresSettingStartTimeOnStart=true;}
tracks=tracks||[];currentTrackList=tracks;var currentTrackIndex=-1;for(var i=0,length=tracks.length;i<length;i++){if(tracks[i].isDefault){currentTrackIndex=tracks[i].index;break;}}
subtitleTrackIndexToSetOnPlaying=currentTrackIndex;if(enableHlsPlayer(val)){setTracks(elem,tracks);var hls=new Hls();hls.loadSource(val);hls.attachMedia(elem);hls.on(Hls.Events.MANIFEST_PARSED,function(){elem.play();});hlsPlayer=hls;}else{elem.src=val;elem.autoplay=true;setTracks(elem,tracks);elem.addEventListener("loadedmetadata",onLoadedMetadata);playNow=true;}
currentSrc=val;self.setCurrentTrackElement(currentTrackIndex);}
currentSrc=val;if(playNow){elem.play();}};function setTracks(elem,tracks){var html=tracks.map(function(t){var defaultAttribute=t.isDefault?' default':'';var label=t.language||'und';return'<track id="textTrack'+t.index+'" label="'+label+'" kind="subtitles" src="'+t.url+'" srclang="'+t.language+'"'+defaultAttribute+'></track>';}).join('');elem.innerHTML=html;}
self.currentSrc=function(){if(mediaElement){return currentSrc;}};self.paused=function(){if(mediaElement){return mediaElement.paused;}
return false;};self.cleanup=function(destroyRenderer){self.setCurrentSrc(null);_currentTime=null;var elem=mediaElement;if(elem){if(elem.tagName=='AUDIO'){elem.removeEventListener('timeupdate',onTimeUpdate);elem.removeEventListener('ended',onEnded);elem.removeEventListener('volumechange',onVolumeChange);elem.removeEventListener('playing',onOneAudioPlaying);elem.removeEventListener('play',onPlay);elem.removeEventListener('pause',onPause);elem.removeEventListener('playing',onPlaying);elem.removeEventListener('error',onError);}else{elem.removeEventListener('loadedmetadata',onLoadedMetadata);elem.removeEventListener('playing',onOneVideoPlaying);elem.removeEventListener('timeupdate',onTimeUpdate);elem.removeEventListener('ended',onEnded);elem.removeEventListener('volumechange',onVolumeChange);elem.removeEventListener('play',onPlay);elem.removeEventListener('pause',onPause);elem.removeEventListener('playing',onPlaying);elem.removeEventListener('click',onClick);elem.removeEventListener('dblclick',onDblClick);elem.removeEventListener('error',onError);}
if(elem.tagName.toLowerCase()!='audio'){$(elem).remove();}}};self.supportsTextTracks=function(){if(supportsTextTracks==null){supportsTextTracks=document.createElement('video').textTracks!=null;}
return supportsTextTracks;};function enableNativeTrackSupport(track){if(browserInfo.safari){return false;}
if(browserInfo.firefox){if((currentSrc||'').toLowerCase().indexOf('.m3u8')!=-1){return false;}}
return true;}
function destroyCustomTrack(isPlaying){if(isPlaying){var allTracks=mediaElement.textTracks;for(var i=0;i<allTracks.length;i++){var currentTrack=allTracks[i];if(currentTrack.label.indexOf('manualTrack')!=-1){currentTrack.mode='disabled';}}}
customTrackIndex=-1;}
function fetchSubtitles(track){return ApiClient.ajax({url:track.url.replace('.vtt','.js'),type:'GET',dataType:'json'});}
var customTrackIndex=-1;function setTrackForCustomDisplay(track){if(!track){destroyCustomTrack(true);return;}
if(customTrackIndex==track.index){return;}
destroyCustomTrack(true);customTrackIndex=track.index;renderTracksEvents(track);}
function renderTracksEvents(track){var trackElement=null;var expectedId='manualTrack'+track.index;var allTracks=mediaElement.textTracks;for(var i=0;i<allTracks.length;i++){var currentTrack=allTracks[i];if(currentTrack.label==expectedId){trackElement=currentTrack;break;}else{currentTrack.mode='disabled';}}
if(!trackElement){trackElement=mediaElement.addTextTrack('subtitles','manualTrack'+track.index,track.language||'und');trackElement.label='manualTrack'+track.index;fetchSubtitles(track).then(function(data){console.log('downloaded '+data.TrackEvents.length+' track events');data.TrackEvents.forEach(function(trackEvent){trackElement.addCue(new VTTCue(trackEvent.StartPositionTicks/10000000,trackEvent.EndPositionTicks/10000000,trackEvent.Text.replace(/\\N/gi,'\n')));});trackElement.mode='showing';});}else{trackElement.mode='showing';}}
self.setCurrentTrackElement=function(streamIndex){console.log('Setting new text track index to: '+streamIndex);var track=streamIndex==-1?null:currentTrackList.filter(function(t){return t.index==streamIndex;})[0];if(enableNativeTrackSupport(track)){setTrackForCustomDisplay(null);}else{setTrackForCustomDisplay(track);streamIndex=-1;track=null;}
var expectedId='textTrack'+streamIndex;var trackIndex=streamIndex==-1||!track?-1:currentTrackList.indexOf(track);var modes=['disabled','showing','hidden'];var allTracks=mediaElement.textTracks;for(var i=0;i<allTracks.length;i++){var currentTrack=allTracks[i];console.log('currentTrack id: '+currentTrack.id);var mode;console.log('expectedId: '+expectedId+'--currentTrack.Id:'+currentTrack.id);if(browserInfo.msie){if(trackIndex==i){mode=1;}else{mode=0;}}else{if(currentTrack.label.indexOf('manualTrack')!=-1){continue;}
if(currentTrack.id==expectedId){mode=1;}else{mode=0;}}
console.log('Setting track '+i+' mode to: '+mode);var useNumericMode=false;if(!isNaN(currentTrack.mode)){}
if(useNumericMode){currentTrack.mode=mode;}else{currentTrack.mode=modes[mode];}}};self.updateTextStreamUrls=function(startPositionTicks){if(!self.supportsTextTracks()){return;}
var allTracks=mediaElement.textTracks;for(var i=0;i<allTracks.length;i++){var track=allTracks[i];try{while(track.cues.length){track.removeCue(track.cues[0]);}}catch(e){console.log('Error removing cue from textTrack');}}
$('track',mediaElement).each(function(){this.src=replaceQueryString(this.src,'startPositionTicks',startPositionTicks);});};self.enableCustomVideoControls=function(){if(AppInfo.isNativeApp&&browserInfo.safari){if(navigator.userAgent.toLowerCase().indexOf('iphone')!=-1){return true;}
return false;}
return self.canAutoPlayVideo();};self.canAutoPlayVideo=function(){if(AppInfo.isNativeApp){return true;}
if(browserInfo.mobile){return false;}
return true;};self.init=function(){return new Promise(function(resolve,reject){if(options.type=='video'&&enableHlsPlayer()){requireHlsPlayer(resolve);}else{resolve();}});};if(options.type=='audio'){mediaElement=createAudioElement();}
else{mediaElement=createVideoElement();}}
if(!window.AudioRenderer){window.AudioRenderer=function(options){options=options||{};options.type='audio';return new htmlMediaRenderer(options);};}
if(!window.VideoRenderer){window.VideoRenderer=function(options){options=options||{};options.type='video';return new htmlMediaRenderer(options);};}})();