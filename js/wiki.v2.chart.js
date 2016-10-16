//----- All Var Declarations
var firstTimeLoad = true;
var selectedVar = [];
var initSelectedVar = ["PU2-IMPRV_STUD_LEARN","GENDER","DOMAIN","Vis1-VIZ_IMPROV"];
var csvFile = "./data/wiki4HE_decoded.csv";
//----- End of Var Declarations

var rowChartSvg = [];
//Inititate Variables
var varList = [];//["PU2-IMPRV_STUD_LEARN","GENDER","DOMAIN","Vis1-VIZ_IMPROV"];

if (firstTimeLoad) {
	firstTimeLoad = false;
	varList = initSelectedVar;
	//return null;
} else {
	varList = selectedVar;
};
var varListLen = varList.length;
console.log(varListLen);

function createRowCharts(aVarList) {
	d3.selectAll("#row-chart-list").selectAll("div").remove();
	d3.csv(csvFile,function(data) {
		var surveyDataCf = crossfilter(data);
		//Row Charts: Loop all selected Variables to create row charts
			for (var i = 0; i < varListLen; i++) {
				var varName = aVarList[i];
				var barChartId = "row-chart-list-" + i;
				var varDim = surveyDataCf.dimension(function(d) { return d[varName];})
				var varDimGroup = varDim.group().reduceCount();
				var varDimGroupSize = varDimGroup.size();

				d3.selectAll("#row-chart-list")
					.append("div")
					.attr("id",barChartId);
				d3.selectAll("#"+barChartId)
					.append("div")
					.text(varName)
					.style("text-align","center");

				rowChartSvg[i] = dc.rowChart("#"+barChartId);
				rowChartSvg[i].width('300')
						.height('250')
						.dimension(varDim)
						.group(varDimGroup)
						.ordinalColors(["#e6550d"])
						.xAxis().ticks(5);

			}
			dc.renderAll();
	});
}

function createParaSetChart () {
	d3.csv(csvFile,function(data) {
		// Parallel set
			var parasetChart = d3.parsets();
			var partition = d3.layout.partition()
				.sort(null)
				.size([parasetChart.width(), parasetChart.height() * 5 / 4])
				.children(function(d) { return d.children ? d3.values(d.children) : null; })
				.value(function(d) { return d.count; });
			var selectedDim = varList;
			parasetChart = d3.parsets().dimensions(selectedDim);
			var vis = d3.select("#vis").append("svg")
				.attr("id","parallelset01")
				.attr("viewBox","0 0 "+parasetChart.width()+ " "+ parasetChart.height())
				.attr("preserveAspectRatio","xMidYMid meet")

			d3.select("#alt-words").remove();
			vis.datum(data).call(parasetChart);
	});
}

createParaSetChart();
createRowCharts(varList);


// Update Graph when dimension selection is changed
function updateData () {
	// Call as
	//csvFile = "./data/wiki4HE_decoded.csv";
	var selectedDim = []
		if (firstTimeLoad) {
			firstTimeLoad = false;
			selectedDim = initSelectedVar;
			return null;
		} else {
			if (selectedVar.length >=2) {
				selectedDim = selectedVar;
			} else {
				return null;
			}

		}

	chart = d3.parsets().dimensions(selectedDim);
	d3.select("#parallelset01").remove();
	var vis = d3.select("#vis").append("svg")
		.attr("id","parallelset01")
		.attr("viewBox","0 0 "+chart.width()+ " "+ chart.height())
		.attr("preserveAspectRatio","xMidYMid meet")
		//.attr("width", chart.width())
		//.attr("height", chart.height());

	d3.select("#alt-words").remove();
	vis.datum(datasource).call(chart);

	createRowCharts(selectedVar);
	dc.renderAll();
}
