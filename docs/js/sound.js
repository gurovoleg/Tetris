let volumeEnabled = true

// const clearSound = new sound('sounds/cleared2.mp3')
// const levelSound = new sound('sounds/levelUp1.mp3')
// const moveSound = new sound('sounds/moved.wav')
// const rotateSound = new sound('sounds/rotate3.wav')
// const gameoverSound = new sound('sounds/welldone.ogg')
// const startSound = new sound('sounds/start1.ogg')


// function sound(src) {
//   this.sound = document.createElement("audio")
//   this.sound.src = src
//   this.sound.setAttribute("preload", "auto")
//   this.sound.setAttribute("controls", "none")
//   this.sound.style.display = "none"
//   document.body.appendChild(this.sound)
//   this.play = function(){
//     if (volumeEnabled) {
//       this.sound.play()  
//     }        
//   }
//   this.stop = function(){
//     this.sound.pause()
//   }    
// }

const sounds = {
  clear: 'sounds/cleared2.mp3',
  level: 'sounds/levelUp1.mp3',
  move: 'sounds/moved.wav',
  rotate: 'sounds/rotate3.wav',
  applause: 'sounds/welldone.ogg',
  start: 'sounds/start1.ogg',
}

const audioElement = document.querySelector("#audio")

window.AudioContext = window.AudioContext || window.webkitAudioContext

const audioContext = new window.AudioContext() // создаем аудио контекст
const source = audioContext.createMediaElementSource(audioElement) // подключаем источник звука (HTML-элемент audio)
source.connect(audioContext.destination) // подключаем узел вывода звука (получатель) 

function playSound (sound) {
  if (audioContext.state === 'suspended') {
    audioContext.resume() // делаем доступным, так как по умолчанию выключен (может быть включен ТОЛЬКО после взаимодействия с пользователем)
  }

  if (sounds[sound]) {
    console.log('playSound', sounds[sound])
    audioElement.src = sounds[sound]
    volumeEnabled ? audioElement.play() : null
  }
}