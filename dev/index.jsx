console.log("Script started");

import React from "react";
import ReactDOM from "react-dom";
import Highcharts from "highcharts/highstock";
import addFunnel from "highcharts/modules/funnel";

class App extends React.Component{
    constructor(props) {
    super(props);
    this.state = {
        series: [0],
        loaded: false,
        input: 'ddd',
        submit: ''
        };
    }
    
    componentDidMount() {
        
        fetch('/retrievedata/AAPL', {method: 'get'}).then(function(data) {
            return data.json();
        }).then((j) =>{
        var newArray = [];
                    var id = j.pop();
            		j.forEach(function(item) {
					var val = [(new Date(item.date)).getTime(),item.open];
					newArray.push(val);
					});
		newArray = newArray.sort(function(a, b) {
        return a[0] - b[0]; });
		console.log(newArray);
		
		this.setState({
		    series: [{
		        name: id,
		        data: newArray,
		        color: 'red'
		        }],
		    loaded: true
		});
		
        });
        
    }
    
    handleInput = (event) => {
        console.log('handleInput');
        this.setState({
            input: event.target.value
        });
    }
    
    handleSubmit = (event) => {
        console.log('handleSubmit');
        this.setState({
            submit: this.state.input,
            input: ''
        }, this.getNewLine);
    }
    
    getNewLine = () => {
        this.setState({
            loaded: false
        }, function(){
            fetch('/retrievedata/'+this.state.submit, {method: 'get'}).then(function(data) {
            return data.json();
        }).then((j) =>{
        var newArray = [];
                    var id = j.pop();
            		j.forEach(function(item) {
					var val = [(new Date(item.date)).getTime(),item.open];
					newArray.push(val);
					});
		newArray = newArray.sort(function(a, b) {
        return a[0] - b[0]; });
		console.log(newArray);

		var newSeries = {
		        name: id,
		        data: newArray,
		        color: 'blue'
		        };
		        
		this.setState({
		    series: this.state.series.concat(newSeries),
		    loaded: true
		});
		
        });
        });
        
    }
    
   render(){
       var divStyle = {
					margin:'auto',
					padding:0,
					width: '100%',
					height: 400,
					borderColor: 'black',
					borderWidth: 1,
					borderStyle: 'solid',
					textAlign: 'center'
					};
		var divLoadingStyle = {
					margin:'auto',
					padding:0,
					width: '95%',
					height: 500,
					textAlign: 'center'
					};
		var loadingStyle = {
		    fontSize: 40,
		    paddingTop:100
		};
					
		var option = {
  chart: {
            type: 'line'
        },
        rangeSelector: {
            		selected: 3
        		},
        title: {
            text: 'Stock Price'
        },
        yAxis: {
            title: {
                text: 'US Dollars'
            }
        },
        series: this.state.series
        };
        
        if(this.state.loaded){
            return (
           <div>
            <div style={divStyle}>
          <SampleChart container="chart" options={
              {
  chart: {
            type: 'line'
        },
        rangeSelector: {
            		selected: 3
        		},
        title: {
            text: 'Stock Price'
        },
        yAxis: {
            title: {
                text: 'US Dollars'
            }
        },
        series: this.state.series
        }
          }/>
            </div>
          <InputSection input={this.state.input} handleInput={this.handleInput} handleSubmit={this.handleSubmit}/>
          </div>
          ); 
        }
        else{
            return (
           <div>
            <div style={divStyle}>
            <h1 style={loadingStyle}>Loading</h1>
            </div>
            <InputSection input={this.state.input} handleInput={this.handleInput} handleSubmit={this.handleSubmit}/>
          </div>
          ); 
        }
					
   }
      
   
}

class InputSection extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <h1>Input Stock Id</h1>
                <input type='text' value={this.props.input} onChange={this.props.handleInput}/>
                <button type='submit' onClick={this.props.handleSubmit}>Submit</button>
            </div>
            );
    }
}

class SampleChart extends React.Component{

   componentDidMount() {
        // Extend Highcharts with modules
        if (this.props.modules) {
            this.props.modules.forEach(function (module) {
                module(Highcharts);
            });
        }
        // Set container which the chart should render to.
        this.chart = new Highcharts.stockChart(this.props.container,
            this.props.options
        );
    }
    //Destroy chart before unmount.
    componentWillUnmount() {
        this.chart.destroy();
    }
    //Create the div which the chart will be rendered to.
    render() {
        return (
            <div id={this.props.container}></div>
            );
    }
      
   
}


ReactDOM.render(
        <App/>,
    document.querySelector("#container")
    );
    
console.log("script ended");