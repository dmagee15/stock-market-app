
import React from "react";
import ReactDOM from "react-dom";
import Highcharts from "highcharts/highstock";
import addFunnel from "highcharts/modules/funnel";
import openSocket from 'socket.io-client';
{/*const socket = openSocket('https://whispering-caverns-54453.herokuapp.com/');*/}
var socket = io.connect('/');

class App extends React.Component{
    constructor(props) {
    super(props);
    this.state = {
        series: [],
        loaded: false,
        input: '',
        submit: '',
        deleteinput: '',
        deletesubmit: '',
        noData: false
        };
    }
    
    componentDidMount() {
        
        
        socket.on('update', (j) => {

        this.setState({
		    series: [],
		    loaded: false
		    }, () => {
		        
		        if(j!=null){
		            this.setState({
                    series: j,
                    loaded: true,
                    noData: (j.length==0)
                    });
		        }
		        else{
		            this.setState({
                    loaded: true,
                    noData: true
                    });
		        }
		        
		    });
        
            
        });
        
    }
    
    handleInput = (event) => {
        this.setState({
            input: event.target.value
        });
    }
    
    handleSubmit = (event) => {
        this.setState({
            submit: this.state.input,
            input: ''
        }, this.getNewLine);
    }
    
    handleDeleteInput = (event) => {
        this.setState({
            deleteinput: event.target.value
        });
    }
    
    handleDelete = (event) => {
        this.setState({
            deletesubmit: this.state.deleteinput,
            deleteinput: ''
        }, this.deleteStock);
    }
    
    handleButtonDelete = (data) => {

        this.setState({
            deletesubmit: data,
            deleteinput: ''
        }, this.deleteStock);
    }
    
    getNewLine = () => {
        this.setState({
            loaded: false
        }, function(){
            
            socket.emit('add', this.state.submit);
            
            
        {/*    fetch('/retrievedata/'+this.state.submit, {method: 'get'}).then(function(data) {
            return data.json();
        }).then((j) =>{
        
        var totalSeries = [];
        if(j==null){
            this.setState({
		    series: totalSeries,
		    loaded: false
		    });
        }
        else{
            
        var newArray;
        var colors = ['red','green','blue','orange','purple'];
        var colorCount = 0;
        console.log(j);
        
        for(var propName in j) {
            newArray = [];
        if(j.hasOwnProperty(propName)) {
            var propValue = j[propName];
            console.log(propName);
            console.log(propValue);
        propValue.forEach(function(item) {
            var val = [(new Date(item.date)).getTime(),item.open];
			newArray.push(val);
        });
        
        newArray = newArray.sort(function(a, b) {
        return a[0] - b[0]; });
        console.log(newArray);
        var newSeries = {
		        name: propName,
		        data: newArray,
		        color: colors[colorCount]
		        };
		 colorCount++;
		 totalSeries.push(newSeries);
		 console.log(totalSeries);
        // do something with each element here
         }
        }
        
        this.setState({
		    series: totalSeries,
		    loaded: true
		});
        
        }
        
		
        }); */}
        
        
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
		socket.emit('delete', stockName);
        });
    }
    
   render(){
       var divStyle = {
					margin:0,
					padding:0,
					width: '100%',
					height: 400,
					textAlign: 'center',
					boxShadow: '0px 0px 4px 0px',
					overflow: 'hidden'
					};
		var divLoadingStyle = {
					margin:'auto',
					padding:0,
					width: '100%',
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
		    paddingTop:'0 0 0 0',
		    margin: '100px 0 0 0'
		};
		var headingStyle = {
		    textAlign:'center',
		    width: '100%'
		};
		var projectInfoStyle = {
		    display:'inline-block',
		    width: '100%',
		    padding: '50px 0 0 0',
		    margin: 0,
		    overflow: 'hidden',
		    verticalAlign:'bottom'
		};
		var headingTextStyle = {
		    fontFamily: 'Tahoma',
		    fontWeight: 900,
		    fontSize: 40
		}
        
        if(this.state.loaded && this.state.series.length != 0){
            return (
           <div style={{margin:0,padding:0,overflow:'hidden'}}>
            <div style={headingStyle}>
            <h1 style={headingTextStyle}>Chart the Stock Market</h1>
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
            <div style={projectInfoStyle}>
                <ProjectInfo />
            </div>
          </div>
          ); 
        }
        else if(this.state.noData && this.state.series.length==0 && this.state.loaded==true)
            {
            return (
           <div style={{margin:0,padding:0,overflow:'hidden'}}>
            <div style={headingStyle}>
            <h1 style={headingTextStyle}>Chart the Stock Market</h1>
            </div>
            <div style={divStyle}>
            <h1 style={loadingStyle}>No Data</h1>
            </div>
            <div style={divInputStyle}>
            <InputSection input={this.state.input} handleInput={this.handleInput} handleSubmit={this.handleSubmit}/>
            <StockListSection stocks={this.state.series} handleButtonDelete={this.handleButtonDelete}/>
            </div>
            <div style={projectInfoStyle}>
                <ProjectInfo />
            </div>
          </div>
          ); 
        }
        else    
            {
            return (
           <div style={{margin:0,padding:0,overflow:'hidden'}}>
            <div style={headingStyle}>
            <h1 style={headingTextStyle}>Chart the Stock Market</h1>
            </div>
            <div style={divStyle}>
            <h1 style={loadingStyle}>Loading</h1>
            </div>
            <div style={divInputStyle}>
            <InputSection input={this.state.input} handleInput={this.handleInput} handleSubmit={this.handleSubmit}/>
            <StockListSection stocks={this.state.series} handleButtonDelete={this.handleButtonDelete}/>
            </div>
            <div style={projectInfoStyle}>
                <ProjectInfo />
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
            margin: '50px auto 0 auto',
            textAlign: 'left',
            display:'inline-block',
            minWidth: 600,
            float: 'right',
            borderLeft: '2px solid #E8E8E8',
        };
        
        var array = this.props.stocks;
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
    this.state = {
        delete: false
        }
    }
    delete = () => {
        this.setState({delete:true}, this.props.handleButtonDelete(this.props.index));
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
            float: 'right',
            backgroundColor: 'black',
            border: '1px solid black',
            color: 'white'
        }
        var deleteText = {
            display: 'inline-block',
            color: 'darkred',
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        }
        return(
            <div style={StockBoxStyle}>
            {
                this.state.delete &&
                <p style={deleteText}>Deleting...</p>
            }
                <button style={StockBoxExitStyle} onClick={this.delete}>X</button>
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
            margin: '50px 100px 0 0',
            float:'left',
        };
        var inputStyle = {
            border: '1px solid black',
            borderBottomLeftRadius: 5,
            borderTopLeftRadius: 5,
            height: 25,
            width: 150
        };
        var buttonStyle = {
            border: 'none',
            backgroundColor: 'black',
            height: 29,
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
            verticalAlign: 'bottom',
            padding: '5px 5px 5px 5px',
            textAlign: 'center'
        }
        var buttonTextStyle = {
            fontSize: 20,
            color: 'white',
            fontWeight: 900,
            fontFamily: 'Tahoma',
            display:'inline-block',
            margin: '0 0 5px 0',
            padding: '0 0 0 0'
        }
        return(
            <div style={InputSectionStyle}>
                <h1>Input Stock Id</h1>
                <input style={inputStyle} type='text' value={this.props.input} onChange={this.props.handleInput}/>
                <button type='submit' onClick={this.props.handleSubmit} style={buttonStyle}><p style={buttonTextStyle}>Add</p></button>
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

class ProjectInfo extends React.Component{
    constructor(props) {
    super(props);
    }
    
   render(){
            var divStyle = {
                backgroundColor: 'gray',
                width:'100%',
                minHeight:300,
                textAlign:'center',
                overflow:'hidden',
                verticalAlign: 'bottom'
                };
            var infoBoxStyle = {
                width:300,
                display:'inline-block',
                margin: '50px 50px 0px 50px',
                verticalAlign: 'top',
                textAlign: 'left',
                padding: '0px 0px 50px 30px',
                borderLeft:'2px solid black'
            };
            var pStyle = {
                fontFamily: 'Arial',
                color: '#E0E0E0',
                margin:0
            };
            var hStyle = {
                color: 'white',
                marginBottom:0
            };
            return (
               <div style={divStyle}>
                    <div style={infoBoxStyle}>
                        <h1 style={hStyle}>Background</h1>
                        <br/>
                        <p style={pStyle}>This stock marking tracking app is a</p>
                        <br/>
                        <p style={pStyle}>FreeCodeCamp full-stack project</p>
                    </div>
                    <div style={infoBoxStyle}>
                        <h1 style={hStyle}>Technologies</h1>
                        <br/>
                        <p style={pStyle}>Front-end: React</p>
                        <br/>
                        <p style={pStyle}>Back-end: Express.js, Mongoose</p>
                    </div>
                    <div style={infoBoxStyle}>
                        <h1 style={hStyle}>Author</h1>
                        <br/>
                        <p style={pStyle}>David Magee is a web developer in</p>
                        <br/>
                        <p style={pStyle}>Houston, TX</p>
                    </div>
               </div>
          ); 
					
   }
      
   
}


ReactDOM.render(
        <App/>,
    document.querySelector("#container")
    );
    