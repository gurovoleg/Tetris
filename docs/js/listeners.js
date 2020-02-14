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
		moveSound.play()
	}
}

// Управление фигурой
const moveLeft = () => setBlockPosition('x', -1)
const moveRight = () => setBlockPosition('x', 1)
const moveDown = () => setBlockPosition('y', 1)
const rotate = () => {
	if (canBlockExist(block.getNextBlock())) {
		block = block.getNextBlock() 
		rotateSound.play()
	}
}

window.addEventListener('resize', init)

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

document.body.addEventListener ('wheel', rotate)

// Обработчики touchscreen events
touchHandler(leftControl, moveLeft)
touchHandler(rightControl, moveRight)
touchHandler(downControl, moveDown)

// Обработчик нажатий с удержанием
function touchHandler (control, fn, duration = 50) {
	control.addEventListener('touchstart', (e) => {
		e.preventDefault()
		e.stopPropagation()
		const intervalId = setInterval(fn, duration)

		control.addEventListener('touchend', () => {
			clearInterval(intervalId)
		})
	})
}

// Бросаем до упора вниз (для свайпа)
function fallDown () {
	const intervalId = setInterval(() => {
		const blockCopy = block.getCopy()
		blockCopy['y'] += 2
		if (canBlockExist(blockCopy)) {
			block = blockCopy
		} else {
			clearInterval(intervalId)
		}
	}, 50)	
}

// Обработчик нажатий для середины экрана
onSwipeHandler({ 
	element: rotateControl,
	left: moveLeft,
	right: moveRight,
	noswipe: rotate,
	down: fallDown
})

