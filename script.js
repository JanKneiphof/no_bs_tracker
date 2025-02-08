if (window.localStorage.getItem('timer') == null) {
  window.localStorage.setItem('timer', '{"timer": []}')
}

const millisecondsInADay = 1000 * 60 * 60 * 24

function currentDate() {
	let currentDate = new Date()
	currentDate.setHours(0)
	currentDate.setMinutes(0)
	currentDate.setSeconds(0)
	currentDate.setMilliseconds(0)

	return currentDate;
}

function removeDomItems() {
	let toRemove = document.getElementsByClassName('todo-item')
	let max_index = toRemove.length - 1
	for (let index = max_index; index >= 0; index--) {
		toRemove[index].remove()
	}
}

function removeTodo(id) {
	let timerString = window.localStorage.getItem('timer');
	let timerJSON = JSON.parse(timerString)
	timerJSON.timer.splice(id, 1)
	window.localStorage.setItem('timer', JSON.stringify(timerJSON))
	removeDomItems()
	renderAllItems()
}

function updateTodo(id) {
	let timerString = window.localStorage.getItem('timer');
	let timerJSON = JSON.parse(timerString)
	timerJSON.timer[id].last = currentDate().toISOString()
	window.localStorage.setItem('timer', JSON.stringify(timerJSON))
	removeDomItems()
	renderAllItems()
}

function timerTemplate(assigns, id) {
return `<div class="todo-item" id='item-${id}'>
	      <div class="name">${assigns.name}</div>
	      <div class="todo-info">
	        <div class="todo-last">
	          &#x2705; ${((currentDate().getTime() - (new Date(assigns.last)).getTime()) / millisecondsInADay)}d
	        </div>
	        <div class="todo-next">
	          &#9200; ${assigns.period - ((currentDate().getTime() - (new Date(assigns.last)).getTime()) / millisecondsInADay)}d
	        </div>
	        <div class="todo-actions">
	          <div class="todo-edit" onclick='removeTodo(${id})'>Delete</div>
	          <div class="todo-done" onclick='updateTodo(${id})'>Done</div>
	        </div>
	       </div>
	    </div>`
}

function renderAllItems() {
	let timer = JSON.parse(window.localStorage.getItem('timer'))
	for (let index = 0; index < timer.timer.length; index++) {
		document.getElementById('todo-form').insertAdjacentHTML("beforebegin", timerTemplate(timer.timer[index], index))
	}
}
renderAllItems()

document.getElementById('add-todo-item').addEventListener('click', (evt) => {
	let name = document.getElementById('new-name').value
	let period = document.getElementById('new-period').value
	let timerString = window.localStorage.getItem('timer');
	let timerJSON = JSON.parse(timerString)
	let date = currentDate()
	timerJSON.timer = timerJSON.timer.concat([{ name: name, period: period, last: date }])
	window.localStorage.setItem('timer', JSON.stringify(timerJSON))
	document.getElementById('todo-form').insertAdjacentHTML("beforebegin", timerTemplate({ name: name, period: period, last: date.toISOString()}, timerJSON.timer.length - 1))
	document.getElementById('new-name').value = ""
	document.getElementById('new-period').value = ""
})

// Refresh the dates at least every minute
setInterval(() => {removeDomItems();renderAllItems()}, 60000);
