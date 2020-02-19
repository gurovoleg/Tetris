function onSwipeHandler ({ element, left, right, up, down, rotate }) {
	let initialPoint
	let finalPoint
	const startFn = fn => typeof fn === 'function' ? fn() : null

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
					startFn(left) // СВАЙП ВЛЕВО
				} else {
					startFn(right) // СВАЙП ВПРАВО
				}
			} else {
				if (finalPoint.pageY < initialPoint.pageY){
					startFn(up) // СВАЙП ВВЕРХ
				} else {
					startFn(down) // СВАЙП ВНИЗ
				}
			}
		} else {
			startFn(rotate)
		}
	}, false)	
}
