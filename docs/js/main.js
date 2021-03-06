// const
const CANVAS_BACKGROUND = '#ffffff'
const ROWS_NUMBER = 20
const COLS_NUMBER = 10
const PADDING = 1

const START_BLOCKS = [1, 3, 6, 7, 10, 13, 19]
const BLOCK_COLORS = ['#f44336', '#9C27B0', '#3F51B5', '#03A9F4', '#009688', '#8BC34A', '#FF9800', '#795548', '#607D8B' ]

let map // карта игрового поля
let block // текущая фигура
let nextBlock // следующая фигура (для подсказки)
let score = 0 // счет
let level = 1 // уровень
let showHelpBlock = true // индикатор подсказки
let showControlsLayout = true // индикатор вспомогательных линии областей управления 
let requestId = null // для отмены анимации
let gameStatus = null // 0 - paused, 1 - active
let fieldWidth // ширина блока игрового поля
let fieldHeight // высота блока игрового поля
const levelUpdateValue = 300 // Количество очков для смены уровня


// Элементы
const notification =  document.querySelector('#notification')
const startButton =  document.querySelector('#start')
const mobileControls =  document.querySelector('#mobileControls')
const mobileControlsDescription =  document.querySelector('#mobileControlsDescription')
const middleControl =  document.querySelector('#middle')
const leftControl =  document.querySelector('#left')
const rightControl =  document.querySelector('#right')
const rotateControl =  document.querySelector('#rotate')
const downControl =  document.querySelector('#down')
const scoreElement = document.querySelector('[data-role="score"]')
const levelElement = document.querySelector('[data-role="level"]')
const volumeControl = document.querySelector('#settingsVolume')
const helpControl = document.querySelector('#settingsHelpBlock')
const layoutControl = document.querySelector('#settingsLayout')

// Классы
const showControl = 'd-block'

// Canvas1
const canvas1 = document.querySelector("#canvas1")
const context = canvas1.getContext('2d')

// Canvas2
const canvas2 = document.querySelector("#canvas2")
canvas2.width = 40
canvas2.height = 40
const context2 = canvas2.getContext('2d')

let durationTime = getDurationTime()

// Расчитываем время падения (в зависимости от уровня)
function getDurationTime () {
	return 100 + 900 / level 
}

// Инициализация
function init () {
	setCanvasSize(canvas1)	
	// Задаем размеры блока игрового поля
	fieldWidth = canvas1.width / COLS_NUMBER
	fieldHeight = canvas1.height / ROWS_NUMBER
	setControlsSize()
}

// Задаем размер игрового поля
function setCanvasSize (element, offset = 20) {
	const screenHeight = document.documentElement.clientHeight
	const coords = element.getBoundingClientRect()
	element.height = screenHeight - coords.top - offset
	element.width = parseInt(element.height / 2)
}

// Задаем размеры элементов управления
function setControlsSize () {
	const screenWidth = document.documentElement.clientWidth

	middleControlWidth = canvas1.width * 0.7
	middleControl.style.width = middleControlWidth + 'px'
	leftControl.style.width = rightControl.style.width = (screenWidth - middleControlWidth) / 2 + 'px' 
}

// Отрисовывыем блок с подсказкой
function drawHelpBlock () {
	context2.clearRect(0, 0, canvas2.width, canvas2.height)
	
	if (showHelpBlock && gameStatus) {
		const nextBlockCopy = nextBlock.getCopy()
		nextBlockCopy.x = 1
		nextBlockCopy.y = 1
		for (const part of nextBlockCopy.getIncludedParts()) {
			context2.fillStyle = nextBlockCopy.color
			context2.fillRect(part.x * canvas2.width / 4 + PADDING , part.y * canvas2.height / 4 + PADDING, canvas2.width / 4 - PADDING, canvas2.height / 4 - PADDING)
		}
	}
}

// Обновляем панель информации и настройки
function updateState () {
	const newLevel = 1 + parseInt(score / levelUpdateValue) // каждые 300 очков увеличиваем уровень
	
	// Увеличение уровня сложности (анимация и звуковое соопровождения)
	if (newLevel > level) {
		levelElement.classList.add('info-level--scale')
		setTimeout(() => {
			levelSound.play()
			showNotification('уровень +1!', 800)
			levelElement.classList.remove('info-level--scale')	
		},500)
		level = newLevel
	}

	scoreElement.textContent = score
	levelElement.textContent = level

	// Индикаторы настроек (звук, подсказка, вспомогательные линии областей управления)
	updateControlView(volumeControl, showControl, volumeEnabled)
	updateControlView(helpControl, showControl, showHelpBlock)
	updateControlView(layoutControl, showControl, showControlsLayout)
	
	// Включить / выключить вспомогательные линии
	if (showControlsLayout) {
		mobileControls.classList.add('mobile-controls--show-lines')
		mobileControlsDescription.classList.add(showControl)
	} else {
		mobileControls.classList.remove('mobile-controls--show-lines')
		mobileControlsDescription.classList.remove(showControl)
	}
}

// Показываем / скрываем контролы в настройках
function updateControlView (control, className, value) {
	if (value) {
		control.firstElementChild.classList.add(className)
		control.lastElementChild.classList.remove(className)	
	} else {
		control.firstElementChild.classList.remove(className)
		control.lastElementChild.classList.add(className)	
	}
}

// Очищаем поле
function clearCanvas1 () {
	context.clearRect(0, 0, canvas1.width, canvas1.height)
}

// Рисуем фрагмент поля (часть фигуры)
function drawField (x, y, color) {
	// console.log(color)
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

// Запуск
function startGame () {
	startSound.play()
	mobileControls.classList.add('mobile-controls--above')
	notification.classList.remove('notification--show')
	score = 0
	level = 1
	updateState()

	map = createMap() // Задаем карту поля (все полотно)

	// Задаем начальную и следующую фигуры
	block = getBlock(getRandomFrom(START_BLOCKS), getRandomFrom(BLOCK_COLORS))
	nextBlock = getBlock(getRandomFrom(START_BLOCKS), getRandomFrom(BLOCK_COLORS))

	// Блок с подсказкой
	drawHelpBlock() 	

	requestAnimationFrame(tick)
}

// Обновляем экран
function tick (timestamp) {

	clearCanvas1() // очищаем игровое поле
	drawBlock() // отрисовываем фигуру
	drawState() // отрисовываем всю карту

	if (timestamp >= durationTime) {
		const blockCopy = block.getCopy()
		blockCopy.y ++
		
		if (canBlockExist(blockCopy)) {
			block = blockCopy
		} else {
			saveBlock() // сохраняем фигуру на игровом поле

			const linesCount = clearLines()
			if (linesCount > 0) {
		    vibrate(1, 300)
		    clearSound.play()
	    	if (linesCount > 2) {
	        showNotification(`${linesCount} строки! Круто!`, 800)
	        gameoverSound.play()
	    	} else if (linesCount > 1) {
	        showNotification(`${linesCount} строки! Отлично!`, 800)
	    	}
			}
					
			score = score + 100 * linesCount
			updateState() // обновляем инфо блок
			
			block = nextBlock
			nextBlock = getBlock(getRandomFrom(START_BLOCKS), getRandomFrom(BLOCK_COLORS))

			// Блок с подсказкой (следующий блок)
			drawHelpBlock() 	
			
			// Проверяем есть ли место и заканчиваем игру
			if (!canBlockExist(block)) {
				endGame()
				return
			}
		}	
		
		durationTime = timestamp + getDurationTime()

	}

	requestId = requestAnimationFrame(tick)
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

// Можем ли поставить фигуру в данном месте на поле
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

// Задаем блок в общем поле
function setField ({ x, y }, value) {
	return map[y] === undefined || map[y][x] === undefined || (map[y][x] = value)
}

// Получаем случайный элемент массива
function getRandomFrom (array) {
	const random = Math.floor(Math.random() * (array.length))
	return array[random]
}

// Вибрация
function vibrate(number = 1, value = 200) {
	if("vibrate" in window.navigator) {
		window.navigator.vibrate(value)
		if (number > 1) {
			let count = 0
			const timerId = setInterval(() => {
				count ++
				window.navigator.vibrate(value)
				if (count === number - 1) {
					clearInterval(timerId)
				}	
			}, value)	
		}
	}
}

// Конец игры
function endGame () {
  vibrate(2, 300)
  gameoverSound.play()
	showNotification('Game over')
	mobileControls.classList.remove('mobile-controls--above')
	gameStatus = null
	startButton.textContent = 'старт'
}

init ()

