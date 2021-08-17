import './App.css';
import React, { Component } from "react";
import Bar from './Components/Bar';
import Slider from './Components/Slider';
import Button from './Components/Button';

class App extends Component {
    constructor(props) {
        super(props);
        // Create Ref
        this.myRef = React.createRef();
    }

    // Initialize state and audio
    state = { sliderValue: 160, barsNum: 2, isPlaying: false, beat: -1, lastTap: 0, taps: []};
    audio = new Audio('sound.mp3');

    componentDidMount(){
        this.audio.load();
    }

    // Update state slider value
    updateSliderValue = (value) => {
        this.setState((prevState) => {
            return {
                sliderValue: value
            };
            // wait for state to be updated before creating new interval
        }, () => {
            if(this.state.isPlaying){
                clearInterval(this.interval);
                this.createInterval();
            }
        })
    }

    metronome = () => {
        // If its already playing stop and clear the interval
        if(this.state.isPlaying){
            this.setState({isPlaying: false, beat:-1})
            clearInterval(this.interval);

            // Remove all of the focus to reset
            const barList = this.myRef.current.children;
            for (var i = 0; i < barList.length; i++){
                    barList[i].classList.remove('focus');
            }
        } // Otherwise play initial tick and setup interval
        else {
            this.playSound();
            this.setState({isPlaying: true});
            this.createInterval();
        }
    }

    // Create interval
    createInterval () {
        const bpm = 60000 / this.state.sliderValue;
        this.interval = setInterval(() => {
            this.playSound();
        }, bpm);
    }


    // Play sound and keep track of the beat
    // Change the class of the bars according to the beat
    playSound () {
        this.audio.currentTime = 0;
        this.audio.play();

        this.setState((prevState) => {
            return {
                beat: (this.state.beat + 1) % this.state.barsNum
            };
            // wait for state to be updated before updating classlist accordingly
        }, () => {
            const barList = this.myRef.current.children;
            for (var i = 0; i < barList.length; i++){
                if(i === this.state.beat){
                    barList[i].classList.add('focus');
                }else{
                    barList[i].classList.remove('focus');
                }
            }
        }) 
    }  

    // Create the amount of bars needed
    renderBars() {
        const bars = []
        for(var i = 0; i < this.state.barsNum; i++){
            bars.push(<Bar key={i} />);
        }
        return bars;
    }

    tapTempo = () => {
        // Get current time and calculate the interval between now and last tap
        const now =  (new Date()).getTime()
        const tapInterval = now - this.state.lastTap;

        // add tap to the tabs array
        var tapsArr = this.state.taps;
        tapsArr.push(tapInterval);

        if (tapsArr.length > 1){
            // remember only last 4 taps so remove first item if the array holds more than 4
            if(tapsArr.length > 4){
                tapsArr.shift();
            }
    
            // Calculate average taps
            var total = 0;
            tapsArr.forEach( tap => {
                total = total + tap;
            })
            var averageTap = total / tapsArr.length;

            // Check that the tap tempo doesn't go lower or higher than the slider
            // 60000 / 300 = 200 and 60000 / 20 = 3000
            averageTap = averageTap > 3000 ? 3000 : averageTap;
            averageTap = averageTap < 200 ? 200 : averageTap;

            // Update slider value and with that update bpm
            this.updateSliderValue(Math.round( 60000 / averageTap));
        }

        // Set now as last tap
        this.setState({lastTap: now, taps: tapsArr});
    }

    // Add one bar
    addBar = () => {
        this.setState({barsNum: this.state.barsNum + 1});
    }

    // Remove one bar
    removeBar = () => {
        this.setState({barsNum: this.state.barsNum - 1});
    }


	render() {
        return (
            <div className="con">
                <div><h1>Metronome</h1></div>

                <h1>{this.state.beat !== -1 ? this.state.beat +1 : '-'}</h1>
                <div className="col">
                    <div className="row" ref={this.myRef}>
                        {this.renderBars()}
                    </div>
                    <div className="row"> 
                        <Button extraClass="round" onClick={this.removeBar} name='-' disabled={this.state.barsNum === 2 ? true : false}/>
                        <Button extraClass="round" onClick={this.addBar} name='+' />
                    </div> 
                </div>

                <h1>{this.state.sliderValue} BPM</h1>
                <Slider onChange={(event) => this.updateSliderValue(event.target.value)} value={this.state.sliderValue}/>

               <div className="row">
                    <Button onClick={this.tapTempo} name="Tap Tempo" disabled={this.state.isPlaying ? false : true}/>
                    <Button onClick={this.metronome} name={this.state.isPlaying ? 'Stop' : 'Start'} />
               </div>
                
            </div>
        );
    }
    
    // Stop timer
    componentWillUnmount() {
        clearInterval(this.timer);
    }
};

export default App;
