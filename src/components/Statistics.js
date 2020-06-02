import React, { Component } from 'react';
import TimeScale from './TimeScale.js';
import Visualization from './Visualization.js';
import Transition from './Transition.js';
import { TransitionGroup } from 'react-transition-group';
import '../App.css';

const styles = {
   transition: 'height .5s',
   overflow: 'hidden'
},
   initialState = {
      currentStock: '',
      extended: false,
      height: 250,
      color: 'rgb(134, 143, 158)',
      opacity: 1
   };

class Statistics extends Component {
   constructor(props) {
      super(props);
      this.state = initialState;
      this.toggleSummary = this.toggleSummary.bind(this);
   }

   componentWillReceiveProps(nextProps) {
      if (this.state.currentStock !== nextProps.snapshot.symbol) {
         this.setState(initialState);

      }
   }

   toggleSummary(event) {
      this.setState({
         extended: !this.state.extended,
         height: (this.state.extended ? 250 : document.getElementById('summary_zippy').clientHeight + 25)
      });
   };

   render() {
      const condensedSummary = () => {
         if (typeof this.props.summary.longBusinessSummary !== 'undefined') {
            return this.props.summary.longBusinessSummary.slice(0, 400).trim() + '...';
         }
      };

      const numberAbbreviated = (int) => {
         
         if (int === undefined) return;
         const str = int.toString()
         let exp = 0;
         for (let i = 0; i < str.length; i++) {
            if (i % 3 === 0) {
               exp = i;
            }
         }
         if (exp === 9) {
            return (int / (Math.pow(10, exp))).toFixed(2) + 'B';
         } else if (exp == 6) {
            return (int / (Math.pow(10, exp))).toFixed(2) + 'M';
         }
      }

      return (
         <div id="stats_card">
            <div className="stats-quant">
               <span>Statistics</span>
               <div className="custom-card">
                  <div className={`heading ${this.props.loading ? "loading" : ""}`}>
                     <span className="price">{typeof this.props.snapshot.regularMarketPrice != 'undefined' ? '$ ' + this.props.snapshot.regularMarketPrice : ''}</span>
                     <span>
                        <p className="symbol">{typeof this.props.snapshot.symbol != 'undefined' ? this.props.snapshot.symbol : ''}</p>
                        <p className="name">{typeof this.props.snapshot.longName != 'undefined' ? this.props.snapshot.longName : ''}</p>
                     </span>
                  </div>
                  <ul>
                     <li>Ask <span className={this.props.loading ? "loading" : ""}>{this.props.snapshot.regularMarketOpen}</span></li>
                     <li>Bid <span className={this.props.loading ? "loading" : ""}>{this.props.snapshot.regularMarketDayHigh}</span></li>
                  </ul>
               </div>
            </div>
         </div>
      )
   }
}

export default Statistics;