let initialPoint
let finalPoint

function onSwipeHandler ({ element, left, right, up, down, noswipe }) {
	element.addEventListener('touchstart', function(event) {
		event.preventDefault()
		event.stopPropagation()
		initialPoint=event.changedTouches[0]
	}, false)

	element.addEventListener('touchend', function(event) {
		event.preventDefault()
		event.stopPropagation()
		finalPoint=event.changedTouches[0]
		const xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX)
		const yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY)
		
		if (xAbs > 20 || yAbs > 20) {
			if (xAbs > yAbs) {
				if (finalPoint.pageX < initialPoint.pageX){
					if (typeof left === 'function') left() // СВАЙП ВЛЕВО
				} else {
					if (typeof right === 'function') right() // СВАЙП ВПРАВО
				}
			} else {
				if (finalPoint.pageY < initialPoint.pageY){
					if (typeof up === 'function') up() // СВАЙП ВВЕРХ
				} else {
					if (typeof down === 'function') down() // СВАЙП ВНИЗ
				}
			}
		} else {
			if (typeof noswipe === 'function') noswipe()
		}
	}, false)	
}
