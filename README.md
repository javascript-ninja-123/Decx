
# DECX 
## The Simplest React js state management library which coexists with Redux
### Decorator + Reducer

### ALERT
> You need to download babel plugin @babel/plugin-proposal-decorators

```javascript
//in webpack.config.js

//the order should be identical
 [ "@babel/plugin-proposal-decorators", {"legacy":true}],
 ["@babel/plugin-proposal-class-properties", { "loose": true }]

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env',"@babel/preset-react"],
                    plugins:["@babel/plugin-proposal-object-rest-spread",
                    [
                      "@babel/plugin-transform-runtime",
                      {
                        "helpers": true
                      }
                    ],
                    "babel-plugin-styled-components",
                    [ "@babel/plugin-proposal-decorators", {"legacy":true}],
                    ["@babel/plugin-proposal-class-properties", { "loose": true }],
                    "@babel/plugin-syntax-jsx",
                    "@babel/plugin-transform-classes"
                    ],
                  }
                }
            }
        ]
      }
```

```javascript
//in index.js
import {Store, DecxProvider,combinereducers} from "decx";

//custom reducers
const firstReducer = (state = 0, action) => {
    switch(action.type){
        case "INC":
        return state + payload;
        default:
        return state;
    }
}

const secondReducer = (state = "", action) => {
       switch(action.type){
        case "SCREAM":
        return `${state}!!!!`;
        default:
        return state;
    }
}

const reducers = combinereducers({
    number:firstReducer,
    text:secondReducer
})

const store = Store(reducers)

ReactDOM.render(
    <DecxProvider store={store}>
        <App/>
     </DecxProvider>
, document.getElementById('root'));

```


```javascript
//in App.jsx
import React, {Component} from 'react';
import {listen,event,connect} from 'decx';

@connect()
class AppContainer extends Component{
    //dispatch an action
    @event
    onClick = () => {
        //pass an object like redux action creator
        return {type:"INC",payload:5}
    }
    //listen a state change which happens in child component
    @listen
    renderText = (state) => {
      //if state is empty, render nothing
     if(Object.keys(state).length === 0) return   
     const {text} = state;
     return <p>{text}</p>
    }

    render(){
        return(
            <div>
                <button onClick={this.onClick}>Click to increase number</button>
                <AppChild/>
                {this.renderText()}
            </div>
        )
    }
}

```

```javascript
//in AppChild.jsx
import React, {Component} from 'react';
import {listen,event,connect} from 'decx';

@connect()
class AppContainer extends Component{
    //dispatch an action
    @event
    onClick = () => {
        //pass an object like redux action creator
        return {type:"SCREAM"}
    }
    //listen a state change which happens in parent component
    @listen
    rederNumber = (state) => {
      //if state is empty, render nothing
     if(Object.keys(state).length === 0) return   
     const {number} = state;
     return <p>{number}</p>
    }

    render(){
        return(
            <div>
                <button onClick={this.onClick}>Click to change text</button>
                {this.rederNumber()}
            </div>
        )
    }
}

```
