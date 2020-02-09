// const
let CANVAS_WIDTH = 300
let CANVAS_HEIGHT = 600
const CANVAS_BACKGROUND = '#ffffff'

const ROWS_NUMBER = 20
const COLS_NUMBER = 10
const PADDING = 1

const START_BLOCKS = [1, 3, 6, 7, 10, 13, 19]
const BLOCK_COLORS = ['#f44336', '#9C27B0', '#3F51B5', '#03A9F4', '#009688', '#8BC34A', '#FF9800', '#795548', '#607D8B' ]

let map
let block
let nextBlock
let score = 0
let level = 1
let showHelpBlock = true

function setCanvasSize () {
	const screenHeight = document.documentElement.clientHeight
	CANVAS_HEIGHT = screenHeight - screenHeight % 100 - 140
	CANVAS_WIDTH = CANVAS_HEIGHT / 2
}

setCanvasSize()

// Элементы
const notification =  document.querySelector('#notification')
const startButton =  document.querySelector('#start')
const leftControl =  document.querySelector('#left')
const rightControl =  document.querySelector('#right')
const rotateControl =  document.querySelector('#rotate')

const fieldWidth = CANVAS_WIDTH / COLS_NUMBER
const fieldHeight = CANVAS_HEIGHT / ROWS_NUMBER

const canvas1 = document.querySelector("#canvas1")
canvas1.width = CANVAS_WIDTH
canvas1.height = CANVAS_HEIGHT
const context = canvas1.getContext('2d')

const canvas2 = document.querySelector("#canvas2")
canvas2.width = 40
canvas2.height = 40
const context2 = canvas2.getContext('2d')

let durationTime = getDurationTime()

// Расчитываем вермя падения в зависимости от уровня
function getDurationTime () {
	return 100 + 900 / level 
}

// Отрисовывыем подсказку
function drawHelpBlock () {
	context2.clearRect(0, 0, canvas2.width, canvas2.height)

	const nextBlockCopy = nextBlock.getCopy()
	nextBlockCopy.x = 1
	nextBlockCopy.y = 1
	for (const part of nextBlockCopy.getIncludedParts()) {
		context2.fillStyle = nextBlockCopy.color
		context2.fillRect(part.x * canvas2.width / 4 + PADDING , part.y * canvas2.height / 4 + PADDING, canvas2.width / 4 - PADDING, canvas2.height / 4 - PADDING)
	}
}

// Обновляем информацию
function updateState () {
	const infoElement = document.querySelector('#info')
	infoElement.querySelector('[data-role="score"]').textContent = score
	infoElement.querySelector('[data-role="level"]').textContent = level
}

// Очищаем поле
function clearCanvas1 () {
	// context.fillStyle = CANVAS_BACKGROUND
	// context.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)	
	// context.fill()
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
}

// Рисуем фрагмент поля (часть фигуры)
function drawField (x, y, color) {
	context.fillStyle = color
	context.fillRect(x * fieldWidth + PADDING , y * fieldHeight + PADDING, fieldWidth - 2 * PADDING, fieldHeight - 2 * PADDING)
}

// Рисуем всю карту
function drawState () {
	for ( let y = 0; y < ROWS_NUMBER; y++) {
		for ( let x = 0; x < COLS_NUMBER; x++) {
			const field = map[y][x]
			if (field) {
				drawField (x, y, field)
			}
		}
	}
}

// Создаем карту всего игрового поля
function createMap () {
	let map = []

	for ( let y = 0; y < ROWS_NUMBER; y++) {
		let row = []
		for ( let x = 0; x < COLS_NUMBER; x++) {
			row.push(null)
		}
		map.push(row)
	}

	return map
}

// Рисуем фигуру
function drawBlock () {
	for (const part of block.getIncludedParts()) {
		drawField(part.x, part.y, block.color)
	}
}

// Инициализация / Запуск
function start () {
	
	notification.classList.remove('notification--show')
	score = 0
	level = 1
	updateState()

	map = createMap() // Задаем карту поля (все полотно)

	// Задаем начальную и следующую фигуры
	block = getBlock(getRandomFrom(START_BLOCKS), getRandomFrom(BLOCK_COLORS))
	nextBlock = getBlock(getRandomFrom(START_BLOCKS), getRandomFrom(BLOCK_COLORS))

	// Показываем подсказку
	if (showHelpBlock) {
		drawHelpBlock() 	
	}

	requestAnimationFrame(tick)
}

// Обновляем экран
function tick (timestamp) {
	if (timestamp >= durationTime) {
		const blockCopy = block.getCopy()
		blockCopy.y ++
		
		if (canBlockExist(blockCopy)) {
			block = blockCopy
		} else {
			saveBlock()
			const linesCount = clearLines()
		
			score = score + 100 * linesCount
			level = 1 + parseInt(score / 300)

			block = nextBlock
			nextBlock = getBlock(getRandomFrom(START_BLOCKS), getRandomFrom(BLOCK_COLORS))

			updateState() // обновляем инфу
			
			// Показываем подсказку (следующий блок)
			if (showHelpBlock) {
				drawHelpBlock() 	
			}
			
			// Проверяем есть ли место и заканчиваем игру
			if (!canBlockExist(block)) {
				showNotification('Game over')
				return
			}
		}	
		
		durationTime = timestamp + getDurationTime()
	}

	clearCanvas1() // очищаем игровое поле
	drawBlock() // отрисовываем фигуру
	drawState() // отрисовываем всю карту
	
	requestAnimationFrame(tick)
}

// Убираем полностью заполненные ряды
function clearLines () {
	let linesCount = 0
	
	for (let y = ROWS_NUMBER - 1; y >= 0; y--) {
		if (map[y].every(field => field != null)) {
			for (let i = y; i >= 1; i--) {
				for (let x = 0; x < COLS_NUMBER; x++) {
					map[i][x] = map[i - 1][x]
					map[i - 1][x] = null
				}	
			}
			y = y + 1
			linesCount++
		}
	}
	return linesCount 
}

// Сохраняем фигуру в общую карту
function saveBlock () {
	for (const part of block.getIncludedParts()) {
		setField(part, block.color)
	}
}

// Можем ли поставить фигуру в данном месте
function canBlockExist (block) {
	for (const part of block.getIncludedParts()) {
		if (getField(part)) {
			return false
		}
	}
	return true
}

// Проверяем есть ли место для части фигуры и что находится в пределах поля
function getField ({ x, y }) {
	return map[y] === undefined || map[y][x] === undefined || map[y][x]
}

function setField ({ x, y }, value) {
	return map[y] === undefined || map[y][x] === undefined || (map[y][x] = value)
}

// Получаем случайный элемент массива
function getRandomFrom (array) {
	const random = Math.floor(Math.random() * (array.length))
	return array[random]
}

// Показ уведомления
function showNotification(text) {
	notification.textContent = text
	notification.classList.add('notification--show')
}

// Определяем новую позицию
function setBlockPosition (coord, value) {
	const blockCopy = block.getCopy()
	blockCopy[coord] += value
	if (canBlockExist(blockCopy)) {
		block = blockCopy
	}
}

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
canvas1.addEventListener('click', moveDown)

startButton.addEventListener('click', start)
