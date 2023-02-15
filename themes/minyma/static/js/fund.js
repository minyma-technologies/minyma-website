$(document).ready(function () {
	// Functions

	function addData(chart, label, data) {
		chart.data.labels.push(label);
		chart.data.datasets.forEach((dataset) => {
			dataset.data.push(data);
		});
		chart.update();
	}

	function removeData(chart) {
		chart.data.labels.pop();
		chart.data.datasets.forEach((dataset) => {
			dataset.data.pop();
		});
		chart.update();
	}

	// Functions end

	var jsonFile = {};
	jsonFile.customization = [];

	$.getJSON("/json/balance.json", function (data) {
		jsonFile.performance = data;
		var performanceLabels = jsonFile.performance.map(function (e) {
			return e.Date;
		});
		var performanceData = jsonFile.performance.map(function (e) {
			return e.Balance;
		});

		var chartColors = {
			simulated: "#60A5FA",
			notSimulated: "#2563EB",
		};

		var performanceCtx = $(".performance-chart");

		Chart.Tooltip.positioners.cursor = function (chartElements, coordinates) {
			return coordinates;
		};

		var changeDateIndex = 1;

		for (var i = 1; i < data.length; i++) {
			if (data[i].Simulated != data[i - 1].Simulated) {
				changeDateIndex = i;
			}
		}

		place_holder = new Array(changeDateIndex - 1);

		var config = {
			type: "line",
			data: {
				labels: performanceLabels,
				datasets: [
					{
						label: "Balance",
						data: performanceData.slice(0, changeDateIndex),
						borderColor: ["#60A5FA"],
						borderWidth: 3,
						lineWidth: 2,
						backgroundColor: ["#60A5FA"],
						radius: 0,
					},
					{
						label: "Balance",
						data: place_holder.concat(performanceData.slice(changeDateIndex - 1, performanceData.length)),
						borderColor: ["#2563EB"],
						borderWidth: 3,
						lineWidth: 2,
						backgroundColor: ["#2563EB"],
						radius: 0,
					},
				],
			},
			options: {
				maintainAspectRatio: false,
				animation: false,
				plugins: {
					tooltip: {
						intersect: false,
						mode: "index",
						animation: false,
						position: "average",
						// position: 'cursor',
						backgroundColor: "#000",
						usePointStyle: true,
						bodyFont: {
							family: "Space Grotesk Variable",
							size: 14,
						},
					},
					legend: {
						display: false,
						labels: {
							font: {
								family: "Space Grotesk Variable",
								size: 14,
							},
						},
					},
				},
			},
		};

		var performanceChart = new Chart(performanceCtx, config);

		performanceChart.update();
	});

	$.getJSON("/json/allocation_pie.json", (data) => {
		jsonFile.allocation = data;
		// Allocation chart

		var allocationLabels = jsonFile.allocation.map(function (e) {
			return e.Name;
		});
		var allocationData = jsonFile.allocation.map(function (e) {
			return e.Size;
		});

		var allocationCtx = $(".allocation-chart");

		var allocationConfig = {
			type: "doughnut",
			data: {
				labels: allocationLabels,
				datasets: [
					{
						label: "Allocation",
						data: allocationData,
						backgroundColor: ["#3B82F6", "#10B981", "#EF4444", "#FCD34D", "#8B5CF6", "#EC4899"],
					},
				],
			},
			options: {
				animation: false,
				responsive: true,
				plugins: {
					tooltip: {
						mode: "index",
						animation: false,
						position: "average",
						// position: 'cursor',
						backgroundColor: "#000",
						usePointStyle: true,
						bodyFont: {
							family: "Space Grotesk Variable",
							size: 14,
						},
					},
					legend: {
						labels: {
							font: {
								family: "Space Grotesk Variable",
								size: 14,
							},
						},
					},
				},
			},
		};

		var allocationChart = new Chart(allocationCtx, allocationConfig);
	});

	var profileUrls = ["/json/profile1.json", "/json/profile2.json", "/json/profile3.json", "/json/profile4.json", "/json/profile5.json"];

	for (var i = 0; i < profileUrls.length; i++) {
		$.ajax({
			dataType: "json",
			url: profileUrls[i],
			async: false,
			data: {},
			success: (r) => {
				jsonFile.customization.push(r);
			},
		});
	}

	// loaded all profiles, can display chart

	labelsArray = [];
	dataArray = [];

	for (i = 0; i < jsonFile.customization.length; i++) {
		labelsArray.push(
			jsonFile.customization[i].map(function (e) {
				return e.Date;
			})
		);
	}

	for (i = 0; i < jsonFile.customization.length; i++) {
		dataArray.push(
			jsonFile.customization[i].map(function (e) {
				return e.Balance;
			})
		);
	}

	var customizationCtx = $(".customization-chart");

	Chart.Tooltip.positioners.cursor = function (chartElements, coordinates) {
		return coordinates;
	};

	var customizationConfig = {
		type: "line",
		data: {
			labels: labelsArray[0],
			datasets: [
				{
					label: "Balance",
					data: dataArray[0],
					borderColor: ["#60A5FA"],
					borderWidth: 3,
					lineWidth: 2,
					radius: 0,
					backgroundColor: ["#60A5FA"],
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			animation: false,
			plugins: {
				tooltip: {
					intersect: false,
					mode: "index",
					animation: false,
					position: "average",
					// position: 'cursor',
					backgroundColor: "#000",
					usePointStyle: true,
					bodyFont: {
						family: "Space Grotesk Variable",
						size: 14,
					},
				},
				legend: {
					labels: {
						font: {
							family: "Space Grotesk Variable",
							size: 14,
						},
					},
				},
			},
		},
	};

	var customizationChart = new Chart(customizationCtx, customizationConfig);

	// slider

	$(".customization-slider")
		.slider({
			value: 1,
			min: 1,
			max: 5,
			step: 1,
			slide: function (event, ui) {
				// $("#amount").val(ui.value);
				var changeTo = ui.value - 1; // due to index
				customizationChart.data.datasets.pop(); // Remove all data
				const newDataset = {
					label: "Balance",
					backgroundColor: "#60A5FA",
					borderColor: "#60A5FA",
					borderWidth: 3,
					radius: 0,
					data: dataArray[changeTo],
				};
				customizationChart.data.datasets.push(newDataset); // Add new data
				customizationChart.update(); // Update
			},
		})
		.slider("pips");
	// $("#amount").val($(".customization-slider").slider("value"));

	// TABLE

	$(".technical-details-table").Grid({
		columns: [
			"Performance Indicator",
			{
				name: "Minyma Fund",
				attributes: (cell) => {
					return {
						style: "text-align: right",
					};
				},
			},
			{
				name: "Benchmark",
				attributes: (cell) => {
					return {
						style: "text-align: right",
					};
				},
			},
		],
		data: [
			["Total Return (%)", "15.85%", "-1.06%"],
			["Profit Factor", "1.26", "-"],
			["Win Ratio (%)", "40.13", "-"],
			["Max. Drawdown (%)", "-13.31", "20.83"],
			["Longest Drawdown", "~2 mo.", "~2 mo."],
			["Sharpe Ratio", "2.09", "0.93"],
			["Sortino Ratio (25%)", "8.58", "0.0796"],
			["Standard Deviation", "128.90", "15.02"],
			["Percentage Change Std. (%)", "0.64", "0.55"],
			["Risk of 10% Drawdown (%)", "14.56", "-"],
			["Risk of 30% Drawdown (%)", "3.10", "-"],
			["Correlation (with S&P)", "0.86", "1.0"],
			["Correlation (daily change)", "-0.057191", "1.0"],
		],
	});

	$(".fees-table").Grid({
		data: [
			["Total Return", "5", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"],
			["Dynamic Fee", "0.2", "0.6", "1.4", "2.5", "3.9", "5.6", "7.6", "9.2", "11.8", "14.7", "17.9"],
		],
	});
});
