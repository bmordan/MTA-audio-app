let interval;
onmessage = function (msg) {
    if(msg.data === "start") {
        interval = setInterval(() => {
            postMessage("tick")
        }, 300)
    }
    if(msg.data === "stop") {
        clearInterval(interval)
    }
}