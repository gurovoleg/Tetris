// const clearSound = new sound('sounds/laser1.mp3')
const clearSound = new sound('sounds/cleared2.mp3')
const levelSound = new sound('sounds/levelUp1.mp3')
const moveSound = new sound('sounds/moved.wav')
const rotateSound = new sound('sounds/rotate3.wav')
const gameoverSound = new sound('sounds/welldone.ogg')
const startSound = new sound('sounds/start1.ogg')


function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
      this.sound.play();
  }
  this.stop = function(){
      this.sound.pause();
  }    
}