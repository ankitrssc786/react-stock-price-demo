'use strict';

// YAHOO FINANCE API SERVICE
const yahooFinance = require('yahoo-finance');
const localData = [];

function deletelocalData() {
   localData.length = 0;
}

function getStocksBySymbol(symbols, range, period) {
   const today = new Date();
   const today_formatted = today.toISOString().substring(0, 10);

   if (!Array.isArray(symbols)) {
      throw new TypeError('only accepts an array type.');
   }

   if (!period) period = 'd'; 

   if (!range) {
      today.setMonth(today.getMonth() - 12);
   } else {
      today.setMonth(today.getMonth() - range);
   }

   if (range == 60) period = 'm';

   const date_range = today.toISOString().substring(0, 10);

   return yahooFinance.historical({
      symbols: symbols,
      from: date_range,
      to: today_formatted,
      period: period,  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
   }).then(data => {
      return checkNullValues(data);
   })
}

function getOneStockBySymbol(symbol, range, period) {
   const today = new Date();
   const today_formatted = today.toISOString().substring(0, 10);

   if (typeof symbol !== 'string') {
      throw new TypeError('only accepts a string.');
   }

   if (!period) period = 'd';

   if (!range) {
      today.setMonth(today.getMonth() - 3);
   } else {
      today.setMonth(today.getMonth() - range);
   }

   if (range == 60) period = 'w';

   const date_range = today.toISOString().substring(0, 10);

   return yahooFinance.historical({
      symbol: symbol,
      from: date_range,
      to: today_formatted,
      period: period,  // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
   }).then(data => {
      if (data.length) {
         return checkNullValues(data);
      } else {
         return false
      }
   })
}

function storeStocksLocally(data) {
   if (typeof data === 'undefined') {
      throw new Error('No paramters provided');
   }
   if (Array.isArray(data)) {
      localData.push(data);
   }
   else if (typeof data == 'object') {
      for (let company in data) {
         if (data.hasOwnProperty(company)) {
            localData.push(data[company]);
         }
      }
      return localData;
   }
}

function removeStock(symbol) {
   let index;
   for (let i = 0; i < localData.length; i++) {

      if (localData[i][0].symbol === symbol) {
         index = i;
      }
   }
   if (index !== -1) {
      localData.splice(index, 1);
   }
}


function getSavedStockNames() {
   return localData.map(stock => {
      return {
         'symbol': stock[0].symbol
      }
   })
}

function removeAll() {
   localData.splice(0, localData.length);
}


function checkNullValues(data) {
   if (Array.isArray(data)) {
      for (let i = data.length - 1; i >= 0; i--) {
         if (data[i].close === null) {
            data.splice(i, 1);
         } else
            if (data[i].date === null) {
               data.splice(i, 1);
            }
      }
      return data;
   } else {

      for (let company in data) {
         if (data.hasOwnProperty(company)) {
            for (let i = data[company].length - 1; i >= 0; i--) {
               if (data[company][i].close === null) {
                  data[company].splice(i, 1);
               } else
                  if (data[company][i].date === null) {
                     data[company].splice(i, 1);
                  }
            }
         }
      }

      for (let company in data) {
         if (data.hasOwnProperty(company)) {
            if (typeof data[company][0] === 'undefined') {
               delete data[company];
            }
         }
      }
      return data;
   }
}


function getStockSnapshot(symbol) {
   return yahooFinance.quote({
      symbol: symbol,
      modules: ['price', 'summaryProfile']
   }).then( quotes => {
      return quotes;
   }).catch(err => {
      console.warn(err);
   })
}


module.exports = {
   getStocksBySymbol,
   getOneStockBySymbol,
   storeStocksLocally,
   getSavedStockNames,
   checkNullValues,
   getStockSnapshot,
   localData,
   removeStock,
   removeAll
}