// SOCKET.IO EVENTS
socket.on('add', event => {
	ticker_markup(event.symbol);
	localData.splice(0, localData.length);      
	event.data.map(stock => {
		localData.push(stock);
	})

	symbol_current = event.symbol;

	const d = c3_helpers.mapData(localData, event.symbol);

	c3_chart.draw(d.dates, d.prices, event.range);
})


socket.on('timescale', event => {
	$('.js-time-period').removeClass('active');

	if (event.range < 12) {
		$(`#${event.range}-month`).addClass('active');
	} else {
		$(`#${event.range / 12}-year`).addClass('active');
	}
	localData.splice(0, localData.length);
      
	event.data.map(stock => {
		localData.push(stock);
	})

	const d = c3_helpers.mapData(localData, event.symbol);

	c3_chart.draw(d.dates, d.prices, event.range);
});


socket.on('delete', event => {
	$(`div#${event.symbol}`).parent().remove();
	$(`div#${event.symbol}`).remove();

	localData.splice(0, localData.length);
	event.data.map(stock => {
		localData.push(stock);
	})

	if (localData[0]) {
		symbol_current = localData[0][0].symbol;

		const d = c3_helpers.mapData(localData, localData[0][0].symbol);
		c3_chart.draw(d.dates, d.prices);
	} else {
		c3_chart.erase();
		symbol_current = '';
	}
})


socket.on('toggle', event => {
	const d = c3_helpers.mapData(localData, event.symbol);
	symbol_current = event.symbol;

	$('.js-toggle-ticker .card-title').removeClass('highlight');
	$(`#${event.symbol} .card-title`).addClass('highlight');

	if (event.symbol) {
		c3_chart.draw(d.dates, d.prices, timescale);
	}
})
