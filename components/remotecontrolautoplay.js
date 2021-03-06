﻿(function(){function transferPlayback(oldPlayer){oldPlayer.getPlayerState().then(function(state){var item=state.NowPlayingItem;if(!item){return;}
var playState=state.PlayState||{};oldPlayer.stop();var itemId=item.Id;var resumePositionTicks=playState.PositionTicks||0;MediaController.play({ids:[itemId],startPositionTicks:resumePositionTicks});});}
Events.on(MediaController,'playerchange',function(e,newPlayer,newTarget,oldPlayer){if(!oldPlayer){console.log('Skipping remote control autoplay because oldPlayer is null');return;}
if(!oldPlayer.isLocalPlayer){console.log('Skipping remote control autoplay because oldPlayer is not a local player');return;}
if(newPlayer.isLocalPlayer){console.log('Skipping remote control autoplay because newPlayer is a local player');return;}
if(oldPlayer.isPlaying()){transferPlayback(oldPlayer);}});})();