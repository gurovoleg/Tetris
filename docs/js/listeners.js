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

leftControl.addEventListener('click', moveLeft)
rightControl.addEventListener('click', moveRight)
rotateControl.addEventListener('click', rotate)
downControl.addEventListener('click', moveDown)

startButton.addEventListener('click', () => {
	if (gameStatus === null) {
		start()
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
})

window.addEventListener('resize', () => setCanvasSize(canvas1))