let intervalId = null
let initialPoint
let finalPoint

// Пуск/Стоп игры
function startStopGame () {
	if (gameStatus === null) {
		startGame()
		gameStatus = 1
		startButton.textContent = 'pause'		
	} else if (gameStatus === 1) {
		cancelAnimationFrame(requestId)
		gameStatus = 0
		startButton.textContent = 'resume'
	} else if (gameStatus === 0) {
		tick()
		gameStatus = 1
		startButton.textContent = 'pause'
	}
}

// Определяем новую позицию
function setBlockPosition (coord, value) {
	const blockCopy = block.getCopy()
	blockCopy[coord] += value
	if (canBlockExist(blockCopy)) {
		block = blockCopy
	}
}

// Управление фигурой
const moveLeft = () => setBlockPosition('x', -1)
const moveRight = () => setBlockPosition('x', 1)
const moveDown = () => setBlockPosition('y', 1)
const rotate = () => canBlockExist(block.getNextBlock()) ? block = block.getNextBlock() : null

document.body.addEventListener ('keydown', (e) => {
	if (e.code === 'ArrowLeft') moveLeft()
	if (e.code === 'ArrowRight') moveRight()
	if (e.code === 'ArrowUp') rotate()
	if (e.code === 'ArrowDown') moveDown()
})

leftControl.addEventListener('touchstart', moveLeft)
rightControl.addEventListener('touchstart', moveRight)
// rotateControl.addEventListener('touchstart', rotate)
downControl.addEventListener('touchstart', (e) => {
	e.preventDefault()
	e.stopPropagation()
	intervalId = setInterval(moveDown, 50)
})
downControl.addEventListener('touchend', () => {
	clearInterval(intervalId)
})

startButton.addEventListener('click', startStopGame)
notification.addEventListener('click', startStopGame)

window.addEventListener('resize', () => setCanvasSize(canvas1))


rotateControl.addEventListener('touchstart', function(event) {
	event.preventDefault()
	event.stopPropagation()
	initialPoint=event.changedTouches[0]
}, false)

rotateControl.addEventListener('touchend', function(event) {
	event.preventDefault()
	event.stopPropagation()
	finalPoint=event.changedTouches[0]
	const xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX)
	const yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY)
	
	if (xAbs > 20 || yAbs > 20) {
		if (xAbs > yAbs) {
			if (finalPoint.pageX < initialPoint.pageX){
				/*СВАЙП ВЛЕВО*/
				moveLeft()
			} else {
			/*СВАЙП ВПРАВО*/
				moveRight()
			}
		} else {
			if (finalPoint.pageY < initialPoint.pageY){
			/*СВАЙП ВВЕРХ*/
			} else {
			/*СВАЙП ВНИЗ*/
			}
		}
	} else {
		rotate()
	}
}, false)