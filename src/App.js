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
    state = { sliderValue: 150, barsNum: 2, isPlaying: false, beat: -1, lastTap: 0};
    audio = new Audio('sound.mp3');

    // Update state slider value
    updateSliderValue = (event) => {
        this.setState((prevState) => {
            return {
                sliderValue: event.target.value
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
        const now =  (new Date()).getTime()

        if(this.state.lastTap > 0){  
            console.log(now - this.state.lastTap);
        } 

        this.setState({lastTap: now});
    }

    addBar = () => {
        this.setState({barsNum: this.state.barsNum + 1});
    }

    removeBar = () => {
        this.setState({barsNum: this.state.barsNum - 1});
    }


	render() {
        return (
            <div className="con">
                <div><h1>Metronome</h1></div>
                <div className="row" ref={this.myRef}>
                    {this.renderBars()}
                </div>
                <h2>{this.state.sliderValue} BPM</h2>
                <Slider onChange={this.updateSliderValue} value={this.state.sliderValue}/>
                <Button onClick={this.tapTempo} name="Tap Tempo" />
                <Button onClick={this.metronome} name={this.state.isPlaying ? 'Stop' : 'Start'} />

                <div className="row"> 
                    <Button onClick={this.removeBar} name='- bar' disabled={this.state.barsNum === 1 ? true : false}/>
                    <Button onClick={this.addBar} name='+ bar' />
                </div>                 
            </div>
        );
    }
};

export default App;
