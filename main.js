const arr_a = [1,2,3,4]
const arr_b = [1,4,3,2]

function are_equal(arr_a, arr_b) {
    let start_slice = 0
    for (let i = 0; i < arr_b.length; i++) {
        if (arr_b[i] !== arr_a[i]) {
            start_slice = i;
            break;
        }
    }
    const part1 = arr_b.slice(0, start_slice)
    const part2 = arr_b.slice(start_slice, arr_b.length)
    
    part1.concat(part2.reverse()).toString() === arr_a.toString()
}
are_equal(arr_a, arr_b)

class Note {
	constructor(freq) {
		this.freq = freq
		this.selected = false
		this.el = $("<samp></samp>")
		this.el.on('click', this.toggle.bind(this))
		this.renderSelected()
	}
	toggle (evt) {
		this.selected = !this.selected
		this.renderSelected()
	}
	renderSelected () {
		this.el.removeClass(["selected", "unselected"])
		this.el.addClass(this.selected ? "selected" : "unselected")
	}
}

class Grid {
	constructor() {
		this.worker = new Worker("/worker.js")
		this.bar = 0
		this.grid = [
			[1047.0, 1175, 1319, 1397, 1480, 1568, 1760, 1976],
			[523.3, 587.3, 659.3, 698.5, 740, 784, 880, 987.8],
			[261.6, 293.7, 329.6, 349.2, 370, 392, 440, 493.9],
			[130.8, 146.8, 164.8, 174.6, 185, 196, 220, 246.9]
		].map(row => row.map(freq => new Note(freq)))
		this.worker.onmessage = this._tick.bind(this)
	}

	play() {
		this.worker.postMessage("start")
	}

	stop() {
		this.worker.postMessage("stop")
		this.grid.forEach(row => row.forEach(note => {
			note.selected = false
			note.renderSelected()
		}))
		this.bar = 0
	}

	_tick() {
		this._play()
		this.bar = this.bar === 7 ? 0 : this.bar + 1
	}
}

function AppAudio () {}
AppAudio.prototype.context = undefined
AppAudio.prototype.setContext = function() {
	this.context = new AudioContext()
}

const Note = function (freq) {
	if (!this.constructor.context) this.constructor.setContext()
	const o = this.constructor.context.createOscillator()
	o.frequency.value = freq
	o.connect(this.constructor.context.destination)
	o.start()
	o.stop(this.constructor.context.currentTime + 1)
}
Note.prototype = Object.create(new AppAudio())

function play (freq) {
	new Note(freq)
}