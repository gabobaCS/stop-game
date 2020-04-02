const React = require('react')
const ms = require('pretty-ms')

class Timer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            time: 0,
            isOn: false,
            start: 0
        }
        this.startTimer = this.startTimer.bind(this);
        this.stopTimer = this.stopTimer.bind(this);
        this.resetTimer = this.resetTimer.bind(this);
    }

    startTimer() {
        console.log("start")
        this.setState({
            isOn: true,
            start: Date.now() - this.state.time
        })
        this.timer = setInterval(() => this.setState({
            time: Date.now() - this.state.start
        }), 1000)

    }

    stopTimer() {
        console.log("stop")
        this.setState({
            isOn: false,
            time: 0
        })
        clearInterval(this.timer);
    }

    resetTimer() {
        console.log("reset")
        this.setState({
            isOn: false,
            time: 0,
            start: 0
        })
    }

    render() {
        let start = (this.state.time == 0) ? <button onClick={this.startTimer}> start </button> : null;
        let stop = (this.state.isOn == true) ? <button onClick={this.stopTimer}> stop </button> : null;
        return (
            <div> <h3>timer is here: {ms(this.state.time)} </h3>
                {start}
                {stop}
            </div>
        )
    }
}

module.exports = Timer