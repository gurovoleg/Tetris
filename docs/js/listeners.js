let intervalId = null

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

document.body.addEventListener ('keydown', (event) => {
	if (event.code === 'ArrowLeft') moveLeft()
	if (event.code === 'ArrowRight') moveRight()
	if (event.code === 'ArrowUp') rotate()
	if (event.code === 'ArrowDown') moveDown()
})

leftControl.addEventListener('touchstart', moveLeft)
rightControl.addEventListener('touchstart', moveRight)
rotateControl.addEventListener('touchstart', rotate)
downControl.addEventListener('touchstart', () => intervalId = setInterval(moveDown, 50))
downControl.addEventListener('touchend', () => clearInterval(intervalId))

startButton.addEventListener('click', startStopGame)
notification.addEventListener('click', startStopGame)

window.addEventListener('resize', () => setCanvasSize(canvas1))


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

