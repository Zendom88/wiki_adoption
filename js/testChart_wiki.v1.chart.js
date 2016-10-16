
	var barChartSvg = [];
	d3.csv("wiki4HE_decoded.csv",function(data) { 
		var varList = ["CONTENT_COMPRESV","GENDER_D","DOMAIN_D"];
		//varList = ["GENDER_D"];
		
		var ndx = crossfilter(data);
		var varListLen = varList.length;
		for (var i = 0; i < varListLen; i++) {
			var varName = varList[i];
			var barChartId = "bar-chart-list-" + i;
			var varDim = ndx.dimension(function(d) { return d[varName];})
			var varDimGroup = varDim.group().reduceCount();
			var varDimGroupSize = varDimGroup.size();

			d3.selectAll("#bar-chart-list")
				.append("div")
				.attr("id",barChartId);
			d3.selectAll("#"+barChartId)
				.append("div")
				.text(varName)
				.style("text-align","center");	

			barChartSvg[i] = dc.rowChart("#"+barChartId)
					.width('300')
					.height('300')
					.dimension(varDim)
					.group(varDimGroup)
					.ordinalColors(["#e6550d"])
					.render();
					
		}
	
	});
	dc.renderAll();