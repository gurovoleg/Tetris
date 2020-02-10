let intervalId = null

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

// Задаем новую позицию фигуры
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

window.addEventListener('resize', () => setCanvasSize(canvas1))

startButton.addEventListener('click', startStopGame)
notification.addEventListener('click', startStopGame)

// Обработчик клавиатры
document.body.addEventListener ('keydown', (e) => {
	if (gameStatus === 1) {
		if (e.code === 'ArrowLeft') moveLeft()
		if (e.code === 'ArrowRight') moveRight()
		if (e.code === 'ArrowUp') rotate()
		if (e.code === 'ArrowDown') moveDown()
	}
	if (e.code === 'Enter') startStopGame()
})

// Обработчики touchscreen
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

// Функция обработки нажатий для середины экрана
onSwipeHandler({ 
	element: rotateControl,
	left: moveLeft,
	right: moveRight,
	noswipe: rotate
})

