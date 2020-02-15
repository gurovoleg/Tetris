const showNotification = notify()

// Функция поочередного noказа уведомлений
// animationDelay - задержка для анимации CSS transition
function notify (animationDelay = 300) {
	let isBusy = false
	return function show (text, hideTimeout = 0) {
		if (!isBusy) {
			isBusy = true
			notification.textContent = text
			notification.classList.add('notification--show')
			if (hideTimeout) {
				setTimeout(() => {
					notification.classList.remove('notification--show')
					setTimeout(() => isBusy = false, animationDelay)
				}, hideTimeout)
			}	else {
				isBusy = false
			}
		} else {
			setTimeout(() => show(text, hideTimeout), hideTimeout)	
		}
	}
}