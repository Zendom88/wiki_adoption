
var nav_canvas =	d3.csv("data/wiki4HE_decoded.csv", function(error, data) {
                    var keyList = d3.keys(data[0]);
                    var headerNames = [];
                    for (i =0; i<keyList.length; i++) {
                      if (keyList[i].indexOf("-")<0){
                        headerNames.push(keyList[i]);
                      }
                    }
                    datasource = data;
                    // Create the shape selectors
                    var form = d3.select("#profileDim").append("list")
                    .attr("style","padding-top:10px; float:left; padding-left:140px;");
                    labels = form.selectAll("ul")
                      .data(headerNames)
                      .enter()
                      .append("div")
                      .attr("class","unselected")
                      .attr("style","padding-top:10px; float:left; padding:10px;width-min:80px")
                      .text(function(d) {return d;})
                      .on("click",function() {
                          var varName = d3.select(this).text();
                          var idx = selectedVar.indexOf(varName);
                          //console.log("Before:"+selectedVar);

                            if (idx <0) {
                              if (selectedVar.length + 1 <= 4) {
                                selectedVar.push(varName);
                                d3.select(this).attr("class","selected");
                              } else {
                                var strAleart;
                                strAleart = "Only accept max 4 variables.";
                                strAleart = strAleart + "4 Selected variables are:\n\n";
                                strAleart = strAleart + selectedVar.join("\n");
                                window.alert(strAleart);
                              }
                            } else {
                              selectedVar.splice(idx,1);
                              d3.select(this).attr("class","unselected");
                            }
                            //console.log("After:"+selectedVar);
                            updateData();
                        })


                      ;

                  });
