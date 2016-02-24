﻿(function(){var lastSound=0;var iconCreated;var destroyed;var currentSound;function onPageShow(){if(!browserInfo.mobile){if(getHolidayTheme()=='off'){return;}
var page=this;Dashboard.importCss('themes/holiday/style.css');if(!page.classList.contains('itemDetailPage')){setBackdrop(page);}
playThemeMusic();addSnowflakes();addIcon();setBodyClass();}}
function playThemeMusic(){if(getHolidayTheme()=='off'){return;}
if(lastSound==0){playSound('https://github.com/MediaBrowser/Emby.Resources/raw/master/themes/holiday/christmas.wav',.1);}else if((new Date().getTime()-lastSound)>30000){playSound('https://github.com/MediaBrowser/Emby.Resources/raw/master/themes/holiday/sleighbells.wav',.25);}}
function destroyTheme(){document.documentElement.classList.remove('christmas');stopSnowflakes();if(currentSound){currentSound.stop();}
var holidayInfoButton=document.querySelector('.holidayInfoButton');if(holidayInfoButton){holidayInfoButton.parentNode.removeChild(holidayInfoButton);}
Dashboard.removeStylesheet('themes/holiday/style.css');Backdrops.clear();}
var snowFlakesInitialized;function addSnowflakes(){if(!snowFlakesInitialized){snowFlakesInitialized=true;$(document.body).append('<div id="snowflakeContainer"><p class="snowflake">*</p></div>');generateSnowflakes();Events.on(MediaController,'beforeplaybackstart',onPlaybackStart);}}
function onPlaybackStart(){if(currentSound){currentSound.stop();}
stopSnowflakes();}
function setBackdrop(page){if(!page.classList.contains('itemDetailPage')){if(getHolidayTheme()=='christmas'){Backdrops.setBackdropUrl(page,'https://raw.githubusercontent.com/MediaBrowser/Emby.Resources/master/themes/holiday/bgc.jpg');}else{Backdrops.setBackdropUrl(page,'https://raw.githubusercontent.com/MediaBrowser/Emby.Resources/master/themes/holiday/bg.jpg');}}}
var holidayThemeKey='holidaytheme5';function getHolidayTheme(){return appStorage.getItem(holidayThemeKey);}
function setHolidayTheme(value){appStorage.setItem(holidayThemeKey,value);setBodyClass();playThemeMusic();}
function setBodyClass(){if(getHolidayTheme()=='christmas'){document.documentElement.classList.add('christmas');}else{document.documentElement.classList.remove('christmas');}}
function onIconClick(e){var items=[];var current=getHolidayTheme();items.push({name:'None',id:'none',ironIcon:current=='off'?'check':null});items.push({name:'Joy!',id:'joy',ironIcon:current!='off'&&current!='christmas'?'check':null});items.push({name:'Christmas',id:'christmas',ironIcon:current=='christmas'?'check':null});require(['actionsheet'],function(actionsheet){actionsheet.show({title:'Happy holidays from the Emby team! Select your holiday theme:',items:items,callback:function(id){switch(id){case'none':setHolidayTheme('off');destroyTheme();break;case'joy':setHolidayTheme('');setBackdrop($($.mobile.activePage)[0]);break;case'christmas':setHolidayTheme('christmas');setBackdrop($($.mobile.activePage)[0]);break;default:break;}}});});}
function addIcon(){if(iconCreated){return;}
iconCreated=true;var elem=document.createElement('paper-icon-button');elem.icon='info';elem.classList.add('holidayInfoButton');elem.addEventListener('click',onIconClick);var viewMenuSecondary=document.querySelector('.viewMenuSecondary');if(viewMenuSecondary){viewMenuSecondary.insertBefore(elem,viewMenuSecondary.childNodes[0]);}}
pageClassOn('pageshow',"libraryPage",onPageShow);function playSound(path,volume){require(['howler'],function(howler){var sound=new Howl({urls:[path],volume:volume||.3});sound.play();currentSound=sound;lastSound=new Date().getTime();});}})();(function(){var requestAnimationFrame=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;var transforms=["transform","msTransform","webkitTransform","mozTransform","oTransform"];var transformProperty=getSupportedPropertyName(transforms);var snowflakes=[];var browserWidth;var browserHeight;var numberOfSnowflakes=50;var resetPosition=false;function setup(){window.addEventListener("resize",setResetFlag,false);}
setup();function getSupportedPropertyName(properties){for(var i=0;i<properties.length;i++){if(typeof document.body.style[properties[i]]!="undefined"){return properties[i];}}
return null;}
function Snowflake(element,radius,speed,xPos,yPos){this.element=element;this.radius=radius;this.speed=speed;this.xPos=xPos;this.yPos=yPos;this.counter=0;this.sign=Math.random()<0.5?1:-1;this.element.style.opacity=.1+Math.random();this.element.style.fontSize=12+Math.random()*50+"px";}
Snowflake.prototype.update=function(){this.counter+=this.speed/5000;this.xPos+=this.sign*this.speed*Math.cos(this.counter)/40;this.yPos+=Math.sin(this.counter)/40+this.speed/30;setTranslate3DTransform(this.element,Math.round(this.xPos),Math.round(this.yPos));if(this.yPos>browserHeight){this.yPos=-50;}}
function setTranslate3DTransform(element,xPosition,yPosition){var val="translate3d("+xPosition+"px, "+yPosition+"px"+", 0)";element.style[transformProperty]=val;}
function generateSnowflakes(){var originalSnowflake=document.querySelector(".snowflake");var snowflakeContainer=originalSnowflake.parentNode;browserWidth=document.documentElement.clientWidth;browserHeight=document.documentElement.clientHeight;for(var i=0;i<numberOfSnowflakes;i++){var snowflakeCopy=originalSnowflake.cloneNode(true);snowflakeContainer.appendChild(snowflakeCopy);var initialXPos=getPosition(50,browserWidth);var initialYPos=getPosition(50,browserHeight);var speed=5+Math.random()*40;var radius=4+Math.random()*10;var snowflakeObject=new Snowflake(snowflakeCopy,radius,speed,initialXPos,initialYPos);snowflakes.push(snowflakeObject);}
snowflakeContainer.removeChild(originalSnowflake);moveSnowflakes();}
var stopped=false;window.generateSnowflakes=generateSnowflakes;window.stopSnowflakes=function(){stopped=true;$('.snowflake').remove();};function moveSnowflakes(){if(stopped){return;}
for(var i=0;i<snowflakes.length;i++){var snowflake=snowflakes[i];snowflake.update();}
if(resetPosition){browserWidth=document.documentElement.clientWidth;browserHeight=document.documentElement.clientHeight;for(var i=0;i<snowflakes.length;i++){var snowflake=snowflakes[i];snowflake.xPos=getPosition(50,browserWidth);snowflake.yPos=getPosition(50,browserHeight);}
resetPosition=false;}
requestAnimationFrame(moveSnowflakes);}
function getPosition(offset,size){return Math.round(-1*offset+Math.random()*(size+2*offset));}
function setResetFlag(e){resetPosition=true;}})();