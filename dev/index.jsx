console.log("Script started");

import React from "react";
import ReactDOM from "react-dom";
import Highcharts from "highcharts/highstock";
import addFunnel from "highcharts/modules/funnel";
import openSocket from 'socket.io-client';
const socket = openSocket('https://stock-market-app-dmagee15.c9users.io/');

class App extends React.Component{
    constructor(props) {
    super(props);
    this.state = {
        series: [],
        loaded: false,
        input: '',
        submit: '',
        deleteinput: '',
        deletesubmit: ''
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
    
    handleDeleteInput = (event) => {
        console.log('handleDeleteInput');
        this.setState({
            deleteinput: event.target.value
        });
    }
    
    handleDelete = (event) => {
        console.log('handleDelete');
        this.setState({
            deletesubmit: this.state.deleteinput,
            deleteinput: ''
        }, this.deleteStock);
    }
    
    handleButtonDelete = (data) => {
        console.log('handleButtonDelete');
        console.log(data);
        this.setState({
            deletesubmit: data,
            deleteinput: ''
        }, this.deleteStock);
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
        var length = this.state.series.length;
        var color = (length==0)?'red':(length==1)?'blue':'green';
		var newSeries = {
		        name: id,
		        data: newArray,
		        color: color
		        };
		        
		this.setState({
		    series: this.state.series.concat(newSeries),
		    loaded: true
		});
		
        });
        });
        
    }
    
    deleteStock = () => {
        this.setState({
            loaded: false
        }, function(){
        var temp = this.state.series.slice();
        var result = [];
        var length = temp.length;
        var stockName = '';
        for(var x=0;x<length;x++){
            if(x!=Number(this.state.deletesubmit)){
                result.push(temp[x]);
            }
            else{
                stockName = temp[x].name;
            }
        }
        console.log(result);
        this.setState({
		    series: result,
		    loaded: true
		}, function(){
		    fetch('/deletedata', {
            method: 'POST',
            headers:{ "Content-Type": "application/json" },
            body: JSON.stringify({
                data: stockName
            })
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
		var divInputStyle = {
		    textAlign: 'center',
		    maxWidth: 1000,
		    minWidth: 800,
		    margin: 'auto'
		};
		var loadingStyle = {
		    fontSize: 100,
		    paddingTop:50
		};
		var headingStyle = {
		    textAlign:'center',
		    width: '100%'
		};
					
        
        if(this.state.loaded && this.state.series.length != 0){
            return (
           <div>
            <div style={headingStyle}>
            <h1>Chart the Stock Market</h1>
            </div>
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
            <div style={divInputStyle}>
          <InputSection input={this.state.input} handleInput={this.handleInput} handleSubmit={this.handleSubmit}/>
          <StockListSection stocks={this.state.series} handleButtonDelete={this.handleButtonDelete}/>
            </div>
          </div>
          ); 
        }
        else{
            return (
           <div>
            <div style={headingStyle}>
            <h1>Chart the Stock Market</h1>
            </div>
            <div style={divStyle}>
            <h1 style={loadingStyle}>Loading</h1>
            </div>
            <div style={divInputStyle}>
            <InputSection input={this.state.input} handleInput={this.handleInput} handleSubmit={this.handleSubmit}/>
            <StockListSection stocks={this.state.series} handleButtonDelete={this.handleButtonDelete}/>
            </div>
          </div>
          ); 
        }
					
   }
      
   
}

class StockListSection extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        var StockListSectionStyle = {
            maxWidth: 800,
            margin: 'auto',
            textAlign: 'left',
            display:'inline-block',
            minWidth: 600,
            float: 'right'
        };
        
        var array = this.props.stocks;
        console.log(array);
        var length = array.length;
        var result = [];
        for(var x=0;x<length;x++){
            var temp = this.props.stocks[x];
            result.push(<StockBox stockInfo={temp} key={x}/>);
        }
        
        return(
            <div style={StockListSectionStyle}>
                {this.props.stocks.map((stock, index) =>
                    <StockBox stockInfo={stock} index={index} key={index} handleButtonDelete={this.props.handleButtonDelete}/>
                )}
            </div>
            );
    }
}

class StockBox extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        var StockBoxStyle = {
            width: '40%',
            height: 70,
            borderBottomColor: 'black',
			borderBottomWidth: 1,
			borderBottomStyle: 'solid',
			display: 'inline-block',
			marginTop: 25,
			marginRight: '4%',
			marginLeft: '4%',
			marginBottom: 25,
			textAlign: 'center',
			position: 'relative'
        };
        var StockBoxTextStyle = {
            fontSize: 25,
            paddingTop: 10
        }
        var StockBoxExitStyle = {
            float: 'right'
        }
        return(
            <div style={StockBoxStyle}>
                <button style={StockBoxExitStyle} onClick={() => this.props.handleButtonDelete(this.props.index)}>X</button>
                <p style={StockBoxTextStyle}>{this.props.stockInfo.name}</p>
            </div>
            );
    }
}

class InputSection extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        var InputSectionStyle = {
            display:'inline-block',
            verticalAlign: 'top',
            marginRight: 100,
            float:'left'
        };
        return(
            <div style={InputSectionStyle}>
                <h1>Input Stock Id</h1>
                <input type='text' value={this.props.input} onChange={this.props.handleInput}/>
                <button type='submit' onClick={this.props.handleSubmit}>Submit</button>
            </div>
            );
    }
}

class DeleteSection extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <h1>Delete Stock Id</h1>
                <input type='text' value={this.props.input} onChange={this.props.handleDeleteInput}/>
                <button type='submit' onClick={this.props.handleDelete}>Delete</button>
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