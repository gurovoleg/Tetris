// Задаем фигуру (тип, цвет, координаты на карте, а так же дополнительные методы:
// 	getIncludedParts - получить все части фигуры
// 	getNextBlock - получить следующий возможный вариант фигуры (вращение фигуры)
// 	getCopy - получить копию фигуры

function getBlock (type, color = 'black', x = COLS_NUMBER / 2 - 1, y = 0) {
	const block = { type, color, x , y }

	const p = (dx, dy) => ({ x: block.x + dx, y: block.y + dy })
	
	// Получаем координаты всех частей фигуры
	block.getIncludedParts = () => {
		if (block.type === 1) return [p(0, 0), p(1, 0), p(0, 1), p(1, 1)]
		if (block.type === 2) return [p(0, 0), p(0, -1), p(-1, 0), p(1, 0)]
		if (block.type === 3) return [p(0, 0), p(0, 1), p(-1, 0), p(1, 0)]
		if (block.type === 4) return [p(0, 0), p(1, 0), p(0, 1), p(0, -1)]
		if (block.type === 5) return [p(0, 0), p(-1, 0), p(0, 1), p(0, -1)]
		if (block.type === 6) return [p(0, 0), p(-1, 1), p(0, 1), p(1, 0)]
		if (block.type === 7) return [p(0, 0), p(-1, 0), p(0, 1), p(1, 1)]
		if (block.type === 8) return [p(0, 0), p(-1, 0), p(-1, -1), p(0, 1)]
		if (block.type === 9) return [p(0, 0), p(-1, 0), p(-1, 1), p(0, -1)]
		if (block.type === 10) return [p(0, 0), p(-1, 0), p(1, 0), p(2, 0)]
		if (block.type === 11) return [p(0, 0), p(0, -1), p(0, 1), p(0, 2)]
		if (block.type === 12) return [p(0, 0), p(0, 1), p(0, -1), p(1, -1)]
		if (block.type === 13) return [p(0, 0), p(1, 1), p(-1, 0), p(1, 0)]
		if (block.type === 14) return [p(0, 0), p(-1, 1), p(0, -1), p(0, 1)]
		if (block.type === 15) return [p(0, 0), p(-1, -1), p(1, 0), p(-1, 0)]
		if (block.type === 16) return [p(0, 0), p(-1, -1), p(0, 1), p(0, -1)]
		if (block.type === 17) return [p(0, 0), p(1, -1), p(-1, 0), p(1, 0)]
		if (block.type === 18) return [p(0, 0), p(1, 1), p(0, -1), p(0, 1)]
		if (block.type === 19) return [p(0, 0), p(-1, 1), p(1, 0), p(-1, 0)]
	}

	block.getNextBlock = () => {
		const p = (n) => getBlock(n, block.color, block.x, block.y)

		if (block.type === 1) return p(1)
		if (block.type === 2) return p(4)
		if (block.type === 3) return p(5)
		if (block.type === 4) return p(3)
		if (block.type === 5) return p(2)
		if (block.type === 6) return p(8)
		if (block.type === 7) return p(9)
		if (block.type === 8) return p(6)
		if (block.type === 9) return p(7)
		if (block.type === 10) return p(11)
		if (block.type === 11) return p(10)
		if (block.type === 12) return p(13)
		if (block.type === 13) return p(14)
		if (block.type === 14) return p(15)
		if (block.type === 15) return p(12)
		if (block.type === 16) return p(17)
		if (block.type === 17) return p(18)
		if (block.type === 18) return p(19)
		if (block.type === 19) return p(16)
	}

	// Создаем копию фигуры
	block.getCopy = () => getBlock(block.type, block.color, block.x, block.y)

	return block
}