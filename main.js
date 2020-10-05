class MyAppAudio {
	static context = undefined;
	static setContext = () => {
	  this.context = new AudioContext()
	}
  }

class Note extends MyAppAudio {
	constructor(freq) {
		super()
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
	highlight() {
		this.el.addClass("highlight")
		setTimeout(() => {
			this.el.removeClass("highlight")
		}, 300)
		return this
	}
	play() {
		if (!this.constructor.context) this.constructor.setContext()
		const o = this.constructor.context.createOscillator()
		o.frequency.value = this.freq
		o.connect(this.constructor.context.destination)
		o.start()
		o.stop(this.constructor.context.currentTime + .3)
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

	_play() {
		this.grid
			.map(row => row[this.bar])
			.flat()
			.map(note => note.highlight())
			.filter(note => note)
			.forEach(note => note.play())
	}
}
