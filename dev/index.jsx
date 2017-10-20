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
        loaded: false
        };
    }
    
    componentDidMount() {
        
        fetch('/retrievedata', {method: 'get'}).then(function(data) {
            return data.json();
        }).then((j) =>{
        var newArray = [];
            		j.forEach(function(item) {
					var val = [(new Date(item.date)).getTime(),item.open];
					newArray.push(val);
					});
		newArray = newArray.sort(function(a, b) {
        return a[0] - b[0]; });
		console.log(newArray);
		
		this.setState({
		    series: [{
		        name: "firstSeries",
		        data: newArray
		        }],
		    loaded: true
		});
		
        });
        
    }
    
   render(){
       var divStyle = {
					margin:'auto',
					padding:0,
					width: '95%',
					height: 500
					};
		var divLoadingStyle = {
					margin:'auto',
					padding:0,
					width: '95%',
					height: 500,
					textAlign: 'center'
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
        xAxis: {
            categories: ['Apples', 'Bananas', 'Oranges']
        },
        yAxis: {
            title: {
                text: 'Fruit eaten'
            }
        },
        series: this.state.series
        };
        
        if(this.state.loaded){
            return (
           <div>
          <div style={divStyle} id="container"><h1>Loading</h1></div>
          <SampleChart container="container" options={option}/>
          </div>
          ); 
        }
        else{
            return (
           <div>
            <div style={divLoadingStyle} id="container"><h1>Loading</h1></div>
          </div>
          ); 
        }
					
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
        this.chart = new Highcharts.stockChart('container',
            this.props.options
        );
    }
    //Destroy chart before unmount.
    componentWillUnmount() {
        this.chart.destroy();
    }
    //Create the div which the chart will be rendered to.
    render() {
        return React.createElement('div', { id: this.props.container });
    }
      
   
}

ReactDOM.render(
        <App/>,
    document.querySelector("#container")
    );
    
console.log("script ended");