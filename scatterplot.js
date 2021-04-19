//$("#scatter_chart").html("gogogogogo");

var margin = {top: 50, right: 50, bottom: 60, left: 70},
    width = 1050 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;


var svg=d3.select("#scatter_chart")
    .append("svg")
    .attr("width",1050)
    .attr("height",700)

var g_body = svg.append("g").attr("transform","translate("+ margin.left+","+margin.top+")");

//title of chart
var g_title= svg.append("g")
    .attr("transform","translate("+ 400+","+25+")")
    .append("text")
    .attr("font-size", 30)
    .attr("fill","#1f375a")
    //.text(chart_title);

//title of x_axis
var g_x_axis_title = svg.append("g")
    .attr("transform","translate("+490+","+680+")")
    .append("text")
    .attr("font-size", 19)
    .attr("fill","#1f375a")
   // .text(x_axis_title)

//title of y_axis
var g_y_axis_title = svg.append("g")
    .attr("transform","translate("+30+","+400+")")
    .append("text")
    .attr("font-size", 19)
    .attr("transform", "rotate(-90)")
    .attr("fill","#1f375a")
  //  .text(y_axis_title)

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var chart_title="Scatterplot Chart";
var x_axis_title="";
var y_axis_title="";
var variables="";
var legend_var = [];

var x_array=[],y_array=[];
var jsonList_copy={};
var jsonArray_all=[];
var jsonList_temp={};

var dot_set=[];
var dot_point={};

// load data
d3.csv("https://gist.githubusercontent.com/chuikokching/b0d0a6f6737e99beaf307281519c0197/raw/01bbd9c13d3fb67ab71e9fc4adc50e7cb4d6adb6/student_GPA_2.csv").then(function(data) {
    //console.log(data.columns[0]+ " "+data.columns[1]+ " "+data.columns[2]);

    jsonList_copy=data;

    //console.log(jsonList_copy);

    //set title of x and y axis
    variables = data.columns[0];
    x_axis_title = data.columns[1];
    y_axis_title = data.columns[2];

    g_title.text(chart_title);
    g_x_axis_title.text(x_axis_title);
    g_y_axis_title.text(y_axis_title);


    // setup x - use +d to change string (from CSV) into number format
    var xValue = function(d) { return +d[x_axis_title];}, // data -> value
        x=d3.scaleLinear().range([0,width]);     // value -> display, length of x-axis
        //xMap = function(d) { return x(xValue(d));}; // data -> display

    // setup y - use +d to change string into number format
    var yValue = function(d) { return +d[y_axis_title];}, // data -> value
        y = d3.scaleLinear().range([height, 0]);    // value -> display, length of y-axis
        //yMap = function(d) { return y(yValue(d));}; // data -> display

    // don't want dots overlapping axis, so add in buffer to data domain
    x.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    y.domain([0, d3.max(data, yValue)+1]);

    // Add x-axis.
    g_body.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")") // move axis to bottom of chart
        .call(d3.axisBottom(x));
    // Add y-axis.
    g_body.append("g")
        .attr("class", "axis y-axis")
        .call(d3.axisLeft(y));


    //create color scale
    var cValue = function(d) {
    
        legend_var.push(d[variables]);
        return d[variables];},
        colors = d3.scaleOrdinal(d3.schemeCategory10);   

    // draw dots
    g_body.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 5)
        .attr("cx", function(d) { 
            //console.log(x(xValue(d)) + " : X " + xValue(d) );
            dot_point['var']=d[variables];
            dot_point['x']=xValue(d);
            dot_point['cx']=x(xValue(d));
            dot_point['y']=yValue(d);
            dot_point['cy']=y(yValue(d));
            dot_set.push(dot_point);
            dot_point={};
            return x(xValue(d));
        })
        .attr("cy", function(d) {
            //console.log(y(yValue(d)) + " : Y " +yValue(d) );
            return y(yValue(d));
        })
        .style("fill", function(d) {
            //console.log(d[x_axis_title] + " text in dots !!!");
            return colors(cValue(d)); 
        })

        // tooltip
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)         // ms delay before appearing
                .style("opacity", .8); // tooltip appears on mouseover
            tooltip.html(d[variables] + " " + "<br/>(" + xValue(d)+ ", " + yValue(d) + ")")
                .style("left", (d3.event.pageX + 10) + "px")  // specify x location
                .style("top", (d3.event.pageY - 28) + "px");  // specify y location
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0); // disappear on mouseout
        });

    console.log(dot_set);
    
    // draw legend
    var legend = svg.selectAll(".legend")
        .data(colors.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(10," + (i+1) * 15 + ")"; });

    // draw legend colored rectangles
    legend.append("rect")
        .attr("x", width )
        .attr("width", 13)
        .attr("height", 12)
        .style("fill", colors);

    // draw legend text
    legend.append("text")
        .attr("x", width - 10)
        .attr("y", 9)
        .attr("dy", ".15em")
        .style("text-anchor", "end")
        .text(function(d,i) { return d;})

});

//remove repeatable values in array
function unique(arr) {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return
    }
    var array = [];
    for (var i = 0; i < arr.length; i++) {
        if (array.indexOf(arr[i]) === -1) {
            array.push(arr[i])
        }
    }
    return array;
}

var var_linear=[];
var var_non_linear=[];
var var_strong=[];
var var_moderate=[];
var var_weak=[];
var var_correlation={}
var line=[];

function s(a,b){return a-b;}

//traverse array
function print_correlation()
{
    var min,min_pos,max,max_pos;
    var text="";
    var arr_all_y=[],arr_all_x=[];
    var temp_line={};
    var regression_copy=[];
    var x_temp_array;

    for(var i=0;i<jsonArray_all.length;i++)
    {
        if(correlation_coefficient_linear(jsonArray_all[i].x_array,jsonArray_all[i].y_array)=="linear")
        {
            var_correlation["var"]=jsonArray_all[i].var;
            var_correlation["value_correlation"]=correlation_coefficient(jsonArray_all[i].x_array,jsonArray_all[i].y_array);
            var_correlation["association"]=correlation_coefficient_association(jsonArray_all[i].x_array,jsonArray_all[i].y_array);
            var_correlation["strength"]=correlation_coefficient_strength(jsonArray_all[i].x_array,jsonArray_all[i].y_array);
            var_correlation["x_array"]=jsonArray_all[i].x_array;
            var_correlation["y_array"]=jsonArray_all[i].y_array;
            var_linear.push(var_correlation);
            if(correlation_coefficient_strength(jsonArray_all[i].x_array,jsonArray_all[i].y_array)=="strong")
                var_strong.push(jsonArray_all[i].var);
            if(correlation_coefficient_strength(jsonArray_all[i].x_array,jsonArray_all[i].y_array)=="weak")
                var_weak.push(jsonArray_all[i].var);
            if(correlation_coefficient_strength(jsonArray_all[i].x_array,jsonArray_all[i].y_array)=="moderate")
                var_moderate.push(jsonArray_all[i].var);

            var_correlation={};
        } 
        else
        {
            var_non_linear.push(jsonArray_all[i].var);
        }
    }


    for(var p=0;p<jsonArray_all.length;p++)
    {
        for(var h=0;h<jsonArray_all[p].x_array.length;h++)
        {
            arr_all_x.push(parseFloat(jsonArray_all[p].x_array[h]));
            arr_all_y.push(parseFloat(jsonArray_all[p].y_array[h]));
        }
    }

    if((correlation_coefficient_linear(arr_all_x,arr_all_y)=="linear"))
    {
        if(var_linear.length==1)
        {
            text=text +"We observed that <span class=\"line_regression\"><b>"+variables+ " "+var_linear[0].var + "</b></span> has a ";
                
            if(var_linear[0].value_correlation>=0)
            {
                if((0.3<=var_linear[0].value_correlation&&var_linear[0].value_correlation<0.5))
                    text= text+"<b>weak ";
                if((0.5<=var_linear[0].value_correlation&&var_linear[0].value_correlation<0.7))
                    text= text+"<b>moderate ";
                if((var_linear[0].value_correlation>=0.7))
                    text= text+"<b>strong ";
            }
            else{
                if((var_linear[0].value_correlation<=-0.3&&var_linear[0].value_correlation>-0.5))
                    text= text+"<b>weak ";
                if((var_linear[0].value_correlation<=-0.5&&var_linear[0].value_correlation>-0.7))
                    text= text+"<b>moderate ";
                if((var_linear[0].value_correlation<=-0.7))
                    text= text+"<b>strong ";
            }   
            text = text + var_linear[0].association+"</b> linear correlation (<b>"+Math.abs(var_linear[0].value_correlation)+"</b>) between <b>"+ x_axis_title + "</b> and <b>"+ y_axis_title+ "</b>. </br>";

            arr_all_y=[];
            regression_copy=Outliers_regression_analysis(var_linear[0].x_array,var_linear[0].y_array);
            temp_line['var']=var_linear[0].var;
            temp_line['value']=parseFloat(var_linear[0].value_correlation);
            x_temp_array=var_linear[0].x_array;
            x_temp_array= unique(x_temp_array);
            x_temp_array.sort(s);

            for(let e=0;e<x_temp_array.length;e++)
            {
                arr_all_y.push((parseFloat(x_temp_array[e])*regression_copy[0]+regression_copy[1]).toFixed(3));
            }
            temp_line['ry']=arr_all_y;
            temp_line['x_temp']=x_temp_array;
            line.push(temp_line);
            temp_line={};
        }
        else
        {
            text = text +"We observed that there is a "+correlation_coefficient_association(arr_all_x,arr_all_y)+" "+correlation_coefficient_strength(arr_all_x,arr_all_y)+" linear correlation between <b>"+ x_axis_title + "</b> and <b>"+ y_axis_title+ "</b> for overall data. </br>";
        }
    }
    else
    {
        text = text +"We observed that there is no linear correlation between <b>"+ x_axis_title + "</b> and <b>"+ y_axis_title+ "</b> for overall data. </br>";
    }


    //console.log(var_strong + " strong");
    //console.log(var_moderate+ " moderate");
    //console.log(var_weak+ " weak");
    //console.log(var_non_linear + " var_non_linear");

    //console.log(var_linear);

    if(var_linear.length!=0&&var_linear.length>1)
    {     
        //text=text +" We observed that there is a linear correlation between <b>"+ x_axis_title + "</b> and <b>"+ y_axis_title+ "</b>.</br>";
        min_pos=0;
        min=Math.abs(parseFloat(var_linear[0].value_correlation));
        max_pos=0;
        max=Math.abs(parseFloat(var_linear[0].value_correlation));
        for(let k=1;k<var_linear.length;k++)
        {
            if(Math.abs(parseFloat(var_linear[k].value_correlation))>max)
            {
                max_pos=k;
                max=Math.abs(parseFloat(var_linear[k].value_correlation));                    
            }

            if(Math.abs(parseFloat(var_linear[k].value_correlation))<min)
            {
                min_pos=k;
                min=Math.abs(parseFloat(var_linear[k].value_correlation));
            }  
                
        }
        //console.log(min_pos + " : " + max_pos + " min and max");
        text = text + "<span class=\"line_regression\"><b>"+variables+ " "+var_linear[max_pos].var + "</b></span> has a <b>"+var_linear[max_pos].strength+" "+var_linear[max_pos].association+"</b> (<b>"+max+"</b>) linear correlation. </br>";
        text = text + "<span class=\"line_regression\"><b>"+variables+ " "+var_linear[min_pos].var + "</b></span> has a <b>"+var_linear[min_pos].strength+" "+var_linear[min_pos].association+"</b> (<b>"+min+"</b>) linear correlation. </br>";


        arr_all_y=[];
        regression_copy=Outliers_regression_analysis(var_linear[max_pos].x_array,var_linear[max_pos].y_array);
        temp_line['var']=var_linear[max_pos].var;
        temp_line['value']=parseFloat(var_linear[max_pos].value_correlation);
        x_temp_array=var_linear[max_pos].x_array;
        x_temp_array= unique(x_temp_array);
        x_temp_array.sort(s);
        //console.log(x_temp_array);
        for(let e=0;e<x_temp_array.length;e++)
        {
            arr_all_y.push((parseFloat(x_temp_array[e])*regression_copy[0]+regression_copy[1]).toFixed(3));
        }
        temp_line['ry']=arr_all_y;
        temp_line['x_temp']=x_temp_array;
        //temp_line['x']=var_linear[max_pos].x_array;
        //temp_line['y']=var_linear[max_pos].y_array;
        line.push(temp_line);
        temp_line={};

        arr_all_y=[];
        regression_copy=Outliers_regression_analysis(var_linear[min_pos].x_array,var_linear[min_pos].y_array);
        temp_line['var']=var_linear[min_pos].var;
        temp_line['value']=parseFloat(var_linear[min_pos].value_correlation);
        x_temp_array=var_linear[min_pos].x_array;
        x_temp_array= unique(x_temp_array);
        x_temp_array.sort(s);
        for(let e=0;e<x_temp_array.length;e++)
        {
            arr_all_y.push((parseFloat(x_temp_array[e])*regression_copy[0]+regression_copy[1]).toFixed(3));
        }
        temp_line['ry']=arr_all_y;
        temp_line['x_temp']=x_temp_array;
        //temp_line['x']=var_linear[min_pos].x_array;
        //temp_line['y']=var_linear[min_pos].y_array;
        line.push(temp_line);
        temp_line={};

        console.log(line);

        if(var_non_linear.length!=0)
        {
            text=text + "In addition, there are <b>" + var_non_linear.length+ " "+variables+ "</b> where there is no linear correlation.</br>";
        }
    }
    if(var_linear.length==0&&var_non_linear.length!=0)
    {
        text = "There is <b>no linear correlation</b> between <b>"+ x_axis_title + "</b> and <b>"+ y_axis_title+ "</b> for <b>"+var_non_linear+" "+variables+"</b>. </br></br>";
    }
 
    return text;
}

var outliers_array=[];
function print_outliers()
{
    var text = "</br></br>";

    text = text +"<b>Outliers:</b>" + "<br/>"+"<br/>"

    var outliers_array_copy=[];
    var outliers_x_axis=[];
    var outliers_y_axis=[];

    var regression_copy=[];
    var point={};


    if(var_strong.length!=0)
    {
        for(let k=0;k<var_strong.length;k++)
        {
            for(let b=0;b<jsonArray_all.length;b++)
            {
                if(var_strong[k]==jsonArray_all[b].var)
                {
                    regression_copy=Outliers_regression_analysis(jsonArray_all[b].x_array,jsonArray_all[b].y_array);
                    //console.log(regression_copy +  " regresion l and a ");
                    for(let a=0;a<jsonArray_all[b].x_array.length;a++)
                    {
                        value=jsonArray_all[b].x_array[a]*regression_copy[0]+regression_copy[1];
                        if(rate(jsonArray_all[b].y_array[a],value)=="outlier")
                        {
                            //console.log("outliers:  value "+ value + " y: "+ jsonArray_all[b].y_array[a] + " x: "+ jsonArray_all[b].x_array[a]);
                                point["var"]=jsonArray_all[b].var;
                                point["x"]=jsonArray_all[b].x_array[a];
                                point["y"]=jsonArray_all[b].y_array[a];
                                outliers_array.push(point);
                                point={};
                        }
                    }
                }
            }            
        }
    }

    if(var_moderate.length!=0)
    {
        let value=0;
        for(let k=0;k<var_moderate.length;k++)
        {
            for(let b=0;b<jsonArray_all.length;b++)
            {
                if(var_moderate[k]==jsonArray_all[b].var)
                {
                    regression_copy=Outliers_regression_analysis(jsonArray_all[b].x_array,jsonArray_all[b].y_array);
                    //console.log(regression_copy +  " regresion l and a ");
                    for(let a=0;a<jsonArray_all[b].x_array.length;a++)
                    {
                        value=jsonArray_all[b].x_array[a]*regression_copy[0]+regression_copy[1];
                        if(rate(jsonArray_all[b].y_array[a],value)=="outlier")
                        {
                                //console.log("outliers:  value "+ value + " y: "+ jsonArray_all[b].y_array[a] + " x: "+ jsonArray_all[b].x_array[a]);
                                point["var"]=jsonArray_all[b].var;
                                point["x"]=jsonArray_all[b].x_array[a];
                                point["y"]=jsonArray_all[b].y_array[a];
                                outliers_array.push(point);
                                point={};
                        }
                    }
                }
            }            
        }
    }


    if(var_weak.length!=0)
    {
        for(let k=0;k<var_weak.length;k++)
        {
            for(let b=0;b<jsonArray_all.length;b++)
            {
                if(var_weak[k]==jsonArray_all[b].var)
                {
                    regression_copy=Outliers_regression_analysis(jsonArray_all[b].x_array,jsonArray_all[b].y_array);
                    //console.log(regression_copy +  " regresion l and a ");
                    for(let a=0;a<jsonArray_all[b].x_array.length;a++)
                    {
                        value=jsonArray_all[b].x_array[a]*regression_copy[0]+regression_copy[1];
                        if(rate_weak(jsonArray_all[b].y_array[a],value)=="outlier")
                        {
                                //console.log("outliers:  value "+ value + " y: "+ jsonArray_all[b].y_array[a] + " x: "+ jsonArray_all[b].x_array[a]);
                                point["var"]=jsonArray_all[b].var;
                                point["x"]=jsonArray_all[b].x_array[a];
                                point["y"]=jsonArray_all[b].y_array[a];
                                outliers_array.push(point);
                                point={};
                        }
                    }
                }
            }                        
        }
    }

    var set=0;
    if(var_non_linear.length!=0)
    {//!!!!!!!!!!!**********************
        for(let k=0;k<var_non_linear.length;k++)
        {
            for(let b=0;b<jsonArray_all.length;b++)
            {
                if(var_non_linear[k]==jsonArray_all[b].var)
                {
                    /*outliers_array_copy= jsonArray_all[b].x_array;
                    outliers_x_axis= Outliers_ZScore(jsonArray_all[b].x_array);
                    if(outliers_x_axis.length!=0)
                    {
                        for(let f=0;f<outliers_x_axis.length;f++)
                        {
                            for(let a=0;a<outliers_array_copy.length;a++)
                            {
                                if(outliers_x_axis[f]==outliers_array_copy[a])
                                {
                                    point["var"]=jsonArray_all[b].var;
                                    point["x"]=jsonArray_all[b].x_array[a];
                                    point["y"]=jsonArray_all[b].y_array[a];
                                    outliers_array.push(point);
                                    point={};
                                }
                            }
                        }
                    }

                    outliers_x_axis= Outliers_IQR(jsonArray_all[b].x_array);
                    if(outliers_x_axis.length!=0)
                    {
                        for(let f=0;f<outliers_x_axis.length;f++)
                        {
                            for(let a=0;a<outliers_array_copy.length;a++)
                            {
                                if(outliers_x_axis[f]==outliers_array_copy[a])
                                {
                                    point["var"]=jsonArray_all[b].var;
                                    point["x"]=jsonArray_all[b].x_array[a];
                                    point["y"]=jsonArray_all[b].y_array[a];
                                    outliers_array.push(point);
                                    point={};
                                }
                            }
                        }
                    }
                    */
                    outliers_array_copy= jsonArray_all[b].y_array;
                    outliers_y_axis= Outliers_ZScore(jsonArray_all[b].y_array);
                    if(outliers_y_axis.length!=0)
                    {
                        for(let f=0;f<outliers_y_axis.length;f++)
                        {
                            for(let a=0;a<outliers_array_copy.length;a++)
                            {
                                if(outliers_y_axis[f]==outliers_array_copy[a])
                                {
                                    point["var"]=jsonArray_all[b].var;
                                    point["x"]=jsonArray_all[b].x_array[a];
                                    point["y"]=jsonArray_all[b].y_array[a];
                                    point["position"]=a;
                                    if(outliers_array.length==0)
                                    outliers_array.push(point);
                                    else
                                    {
                                        for(let z=0;z<outliers_array.length;z++)
                                        {
                                             //console.log(point.position+ " "+ point.var + " "+outliers_array[z].position + " " + outliers_array[z].var);
                                            if(point.position==outliers_array[z].position&&point.var==outliers_array[z].var)
                                            {

                                                  set = 1;
                                            }                                               
                                        }
                                        if(set ==0)
                                            outliers_array.push(point);                                      
                                    }
                                    point={};
                                    set = 0;
                                }
                            }
                        }
                    }
                    console.log(outliers_y_axis + " no linear relationship ZScore!!!!!!!!!!!");
                    outliers_y_axis= Outliers_IQR(jsonArray_all[b].y_array);
                    if(outliers_y_axis.length!=0)
                    {
                        for(let f=0;f<outliers_y_axis.length;f++)
                        {
                            for(let a=0;a<outliers_array_copy.length;a++)
                            {
                                if(outliers_y_axis[f]==outliers_array_copy[a])
                                {
                                    point["var"]=jsonArray_all[b].var;
                                    point["x"]=jsonArray_all[b].x_array[a];
                                    point["y"]=jsonArray_all[b].y_array[a];
                                    point["position"]=a;
                                    if(outliers_array.length==0)
                                    outliers_array.push(point);
                                    else
                                    {
                                        for(let z=0;z<outliers_array.length;z++)
                                        {
                                            //console.log(point.position+ " "+ point.var + " "+outliers_array[z].position + " " + outliers_array[z].var);
                                            if(point.position==outliers_array[z].position&&point.var==outliers_array[z].var)
                                                set = 1;
                                        }
                                        if(set ==0)
                                            outliers_array.push(point);

                                    }
                                    point={};
                                    set = 0;
                                }
                            }
                        }
                    }
                    console.log(outliers_y_axis + " no linear relationship IQR!!!!!!!!!!!!!");

                }
            }                      
        }         
    }
    if(outliers_array.length!=0)
    {
        text = text + " There are "+outliers_array.length + " outliers detected, they are as follows: </br>";

        for(let h=0;h<outliers_array.length;h++)
        {
            text = text + "[<span class=\"point_outliers\"><b>"+ outliers_array[h].var +":"+ outliers_array[h].x+ ","+outliers_array[h].y + "</span></b>]. ";
        }

        text = text +"</br>";
    }
    else
    {
        text= text + "No outliers were found or detected in the dataset. </br></br>"
    }
    console.log(outliers_array);
    return text;
}

var result_clustering_all=[];
var result_clustering;
function print_clustering()
{
    cluster_data=[];
    let data={};
    let pointList=[];
    let temp=[];
    text="";
    for(let f=0;f<jsonArray_all.length;f++)
    {
        data["individual"]=jsonArray_all[f].var;
        for(let p=0;p<jsonArray_all[f].x_array.length;p++)
        {
            temp.push(parseFloat(jsonArray_all[f].x_array[p]));
            temp.push(parseFloat(jsonArray_all[f].y_array[p]));
            pointList.push(temp);
            temp=[];
        }
        data["data"]=pointList;
        pointList=[];
        temp=[];
        cluster_data.push(data);
        data={};
    }

    console.log(cluster_data);
    
    for(let o=0;o<cluster_data.length;o++)
    {
        result_clustering=kmeans(cluster_data[o].data,3)
        //console.log(result.centroids);
        result_clustering['var']=cluster_data[o].individual;
        result_clustering_all.push(result_clustering);
        text=text+"We observed that there are <b>"+result_clustering.centroids.length+ " clusters</b> " + "for <b>"+cluster_data[o].individual + "</b>, their details are as follows: </br></br> "
        
        for(let q=0;q<result_clustering.centroids.length;q++)
        {
            text=text+"Cluster sizes of centroid [<span class=\"point_cluster\"><b>"+cluster_data[o].individual +":"+ result_clustering.clusters[q].centroid[0].toFixed(3)+","+result_clustering.clusters[q].centroid[1].toFixed(3)+ "</b></span>] is <b>"+result_clustering.clusters[q].points.length + "</b>. </br>";
        }
        text=text+"</br>";
  
    }

    //let result = kmeans(cluster_data[0].data,3);
    //console.log(result_clustering_all);
    //console.log(result_clustering.clusters);
    
    return text;
}


function rate_weak(y,value)
{
    if(y!=0 && value!=0)
    {
    if(y>=value)
    {
        if(y/value > 1.78 )
        return "outlier";
        else
            return "not_outlier"
    }
    else{
        if(value/y > 1.78 )
        return "outlier";
        else
         return "not_outlier"
    }
    }

}

function rate(y,value)
{
    if(y!=0 && value!=0)
    {
    if(y>=value)
    {
        if(y/value > 1.68 )
        return "outlier";
        else
            return "not_outlier"
    }
    else{
        if(value/y > 1.68 )
        return "outlier";
        else
         return "not_outlier"
    }
    }

}

//standard deviation
function stdDeviation(arr) {
    let sd,
        ave,
        sum = 0,
        sums=0,
        len = arr.length;
    for (let i = 0; i < len; i++) {
        sum += Number(arr[i]);
    }
    ave = sum / len;
    for(let i = 0; i < len; i++){
        sums+=(Number(arr[i])- ave)*(Number(arr[i])- ave)
    }
    sd=(Math.sqrt(sums/len)).toFixed(4);
    return sd;
}


//Regression analysis
function Outliers_regression_analysis(arr_x,arr_y)
{
    var regression=[];
    var l=0;
    var a=0;
    var mean_x = average(arr_x);
    var mean_y = average(arr_y);
    var sum_x=0;
    var sum_y=0;

    for(var i=0;i<arr_x.length;i++)
    {
        sum_x+=(arr_x[i]- mean_x)*(arr_x[i]-mean_x);
    }

    for(var k=0;k<arr_y.length;k++)
    {
        sum_y+=(arr_y[k]-mean_y)*(arr_y[k]-mean_y);
    }      

    //console.log(sum_x + " x ||"  + "  y: "+sum_y);


    l=correlation_coefficient(arr_x,arr_y)*Math.sqrt(sum_y/(arr_y.length-1))/Math.sqrt(sum_x/(arr_x.length-1));
    regression.push(l);

    a= mean_y-l*mean_x;
    regression.push(a);
    return regression;

}


//Outliers Z-score
function Outliers_ZScore(arr)
{   
    var threshold_1=3;
    var threshold_2=-3;
    var outliers=[];
    var mean = average(arr);
    var std= stdDeviation(arr);
    //console.log(std);
    let z=0;
    arr.forEach(function(x){
        z=(x-mean)/std;
        //console.log(z + " "+ x);
        if((z>threshold_1) || (z<threshold_2))
        {
            outliers.push(x);
        }
    });
    return outliers;
}

//Outliers Range_IQR
function Outliers_IQR(arr) {
    const size = arr.length;

    let q1, q3;

    if (size < 2) {
        return arr;
    }

    const sortedCollection = arr.slice().sort((a, b) => a - b);


    if ((size - 1) / 4 % 1 === 0 || size / 4 % 1 === 0) {
        q1 = 1 / 2 * (sortedCollection[Math.floor(size / 4) - 1] + sortedCollection[Math.floor(size / 4)]);
        q3 = 1 / 2 * (sortedCollection[Math.ceil(size * 3 / 4) - 1] + sortedCollection[Math.ceil(size * 3 / 4)]);
    } else {
        q1 = sortedCollection[Math.floor(size / 4)];
        q3 = sortedCollection[Math.floor(size * 3 / 4)];
    }

    const iqr = q3 - q1;
    const maxValue = q3 + iqr * 1.5;
    const minValue = q1 - iqr * 1.5;

    var result=sortedCollection.filter((x)=>{
        return (x>maxValue)||(x<minValue);
    });
    return result;
};



//k-means clustering
const MAX_ITERATIONS = 50;

function randomBetween(min, max) {
  return Math.floor(
    Math.random() * (max - min) + min
  );
}

function calcMeanCentroid(dataSet, start, end) {
  const features = dataSet[0].length;
  const n = end - start;
  let mean = [];
  for (let i = 0; i < features; i++) {
    mean.push(0);
  }
  for (let i = start; i < end; i++) {
    for (let j = 0; j < features; j++) {
      mean[j] = mean[j] + dataSet[i][j] / n;
    }
  }
  return mean;
}

function getRandomCentroidsNaiveSharding(dataset, k) {
  // implementation of a variation of naive sharding centroid initialization method
  // (not using sums or sorting, just dividing into k shards and calc mean)
  // https://www.kdnuggets.com/2017/03/naive-sharding-centroid-initialization-method.html
  const numSamples = dataset.length;
  // Divide dataset into k shards:
  const step = Math.floor(numSamples / k);
  const centroids = [];
  for (let i = 0; i < k; i++) {
    const start = step * i;
    let end = step * (i + 1);
    if (i + 1 === k) {
      end = numSamples;
    }
    centroids.push(calcMeanCentroid(dataset, start, end));
  }
  return centroids;
}

function getRandomCentroids(dataset, k) {
  // selects random points as centroids from the dataset
  const numSamples = dataset.length;
  const centroidsIndex = [];
  let index;
  while (centroidsIndex.length < k) {
    index = randomBetween(0, numSamples);
    if (centroidsIndex.indexOf(index) === -1) {
      centroidsIndex.push(index);
    }
  }
  const centroids = [];
  for (let i = 0; i < centroidsIndex.length; i++) {
    const centroid = [...dataset[centroidsIndex[i]]];
    centroids.push(centroid);
  }
  return centroids;
}

function compareCentroids(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

function shouldStop(oldCentroids, centroids, iterations) {
  if (iterations > MAX_ITERATIONS) {
    return true;
  }
  if (!oldCentroids || !oldCentroids.length) {
    return false;
  }
  let sameCount = true;
  for (let i = 0; i < centroids.length; i++) {
    if (!compareCentroids(centroids[i], oldCentroids[i])) {
      sameCount = false;
    }
  }
  return sameCount;
}

// Calculate Squared Euclidean Distance
function getDistanceSQ(a, b) {
  const diffs = [];
  for (let i = 0; i < a.length; i++) {
    diffs.push(a[i] - b[i]);
  }
  return diffs.reduce((r, e) => (r + (e * e)), 0);
}

// Returns a label for each piece of data in the dataset. 
function getLabels(dataSet, centroids) {
  // prep data structure:
  const labels = {};
  for (let c = 0; c < centroids.length; c++) {
    labels[c] = {
      points: [],
      centroid: centroids[c],
    };
  }
  // For each element in the dataset, choose the closest centroid. 
  // Make that centroid the element's label.
  for (let i = 0; i < dataSet.length; i++) {
    const a = dataSet[i];
    let closestCentroid, closestCentroidIndex, prevDistance;
    for (let j = 0; j < centroids.length; j++) {
      let centroid = centroids[j];
      if (j === 0) {
        closestCentroid = centroid;
        closestCentroidIndex = j;
        prevDistance = getDistanceSQ(a, closestCentroid);
      } else {
        // get distance:
        const distance = getDistanceSQ(a, centroid);
        if (distance < prevDistance) {
          prevDistance = distance;
          closestCentroid = centroid;
          closestCentroidIndex = j;
        }
      }
    }
    // add point to centroid labels:
    labels[closestCentroidIndex].points.push(a);
  }
  return labels;
}

function getPointsMean(pointList) {
  const totalPoints = pointList.length;
  const means = [];
  for (let j = 0; j < pointList[0].length; j++) {
    means.push(0);
  }
  for (let i = 0; i < pointList.length; i++) {
    const point = pointList[i];
    for (let j = 0; j < point.length; j++) {
      const val = point[j];
      means[j] = means[j] + val / totalPoints;
    }
  }
  return means;
}

function recalculateCentroids(dataSet, labels, k) {
  // Each centroid is the geometric mean of the points that
  // have that centroid's label. Important: If a centroid is empty (no points have
  // that centroid's label) you should randomly re-initialize it.
  let newCentroid;
  const newCentroidList = [];
  for (const k in labels) {
    const centroidGroup = labels[k];
    if (centroidGroup.points.length > 0) {
      // find mean:
      newCentroid = getPointsMean(centroidGroup.points);
    } else {
      // get new random centroid
      newCentroid = getRandomCentroids(dataSet, 1)[0];
    }
    newCentroidList.push(newCentroid);
  }
  return newCentroidList;
}

function kmeans(dataset, k, useNaiveSharding = true) {
  if (dataset.length && dataset[0].length && dataset.length > k) {
    // Initialize book keeping variables
    let iterations = 0;
    let oldCentroids, labels, centroids;

    // Initialize centroids randomly
    if (useNaiveSharding) {
      centroids = getRandomCentroidsNaiveSharding(dataset, k);
    } else {
      centroids = getRandomCentroids(dataset, k);
    }

    // Run the main k-means algorithm
    while (!shouldStop(oldCentroids, centroids, iterations)) {
      // Save old centroids for convergence test.
      oldCentroids = [...centroids];
      iterations++;

      // Assign labels to each datapoint based on centroids
      labels = getLabels(dataset, centroids);
      centroids = recalculateCentroids(dataset, labels, k);
    }

    const clusters = [];
    for (let i = 0; i < k; i++) {
      clusters.push(labels[i]);
    }
    const results = {
      clusters: clusters,
      centroids: centroids,
      iterations: iterations,
      converged: iterations <= MAX_ITERATIONS,
    };
    return results;
  } else {
    throw new Error('Invalid dataset');
  }
}


//correlation value r
function correlation_coefficient_linear(arr_x,arr_y)
{
    if(arr_x.length!=arr_y.length)
        return "Error, length of array doesn't match!"
    else
    {
        var r=correlation_coefficient(arr_x,arr_y);
        //console.log(r);
        if(r>=0)
        {
            if(r<0.3)
                return "none relationship"; 
            else
                return "linear";
        }
        else{
            if(r>-0.3)
                return "none relationship";

            else
                return "linear";
        }  
    }
}

//correlation value r
function correlation_coefficient_association(arr_x,arr_y)
{
    if(arr_x.length!=arr_y.length)
        return "Error, length of array doesn't match!"
    else
    {
        var r=correlation_coefficient(arr_x,arr_y);

        if(r>0)
        {
            return "positive";
        }
        else{
            return "negative";
        }  
    }
}

//correlation value r
function correlation_coefficient_strength(arr_x,arr_y)
{
    if(arr_x.length!=arr_y.length)
        return "Error, length of array doesn't match!"
    else
    {
        var r=correlation_coefficient(arr_x,arr_y);

        if(r>=0)
        {
            if((0.3<=r&&r<0.5))
                return "weak";
            if((0.5<=r&&r<0.7))
                return "moderate";
            if((r>=0.7))
                return "strong";
        }
        else{
            if((r<=-0.3&&r>-0.5))
                return "weak";
            if((r<=-0.5&&r>-0.7))
                return "moderate";
            if((r<=-0.7))
                return "strong";
        }  
    }
}


//correlation value r
function correlation_coefficient(arr_x,arr_y)
{
    if(arr_x.length!=arr_y.length)
        return "Error, length of array doesn't match!"
    else
    {
        var r=0;
        var arr_x_aver=average(arr_x);
        var arr_y_aver=average(arr_y);
        var sum=0;
        var sum_x=0;
        var sum_y=0;
        //console.log(arr_x_aver+ " :::: "+ arr_y_aver);

        for(var i=0;i<arr_x.length;i++)
        {
            sum+=(arr_x[i]-arr_x_aver)*(arr_y[i]-arr_y_aver)
        }

        //console.log(sum);

        for(var i=0;i<arr_x.length;i++)
        {
            sum_x+=(arr_x[i]-arr_x_aver)*(arr_x[i]-arr_x_aver)
        }

        for(var k=0;k<arr_y.length;k++)
        {
            sum_y+=(arr_y[k]-arr_y_aver)*(arr_y[k]-arr_y_aver)
        }        

        //console.log(sum_x + " :::: "+ sum_y);

        r=(sum/Math.sqrt(sum_x*sum_y)).toFixed(3);
        //console.log(r + " value of r");
        return r;
    }
}

//average value
function average(arr){
    var sum=0;
    //console.log(arr.length);
    for(let c=0;c<arr.length;c++)
    {
        sum+=parseFloat(arr[c]);
    }
    return (sum/arr.length).toFixed(3);
}

//max_x value
function max_x(){
    var max=jsonList_copy[0][x_axis_title];
    for(let j=0;j<jsonList_copy.length;j++)
    {
        if(parseFloat(jsonList_copy[j][x_axis_title])>max)
        {
            max=parseFloat(jsonList_copy[j][x_axis_title]);
        }
    }
    return max;
}
//max_y value
function max_y(){
    var max=jsonList_copy[0][y_axis_title];
    for(let j=0;j<jsonList_copy.length;j++)
    {

        if(parseFloat(jsonList_copy[j][y_axis_title])>max)
        {
            max=parseFloat(jsonList_copy[j][y_axis_title]);
        }
    }
    return max;
}


//min_x value
function min_x(){
    var min = jsonList_copy[0][x_axis_title];
    for(let j=0;j<jsonList_copy.length;j++)
    {
        if(parseFloat(jsonList_copy[j][x_axis_title])<min)
        {
            min=parseFloat(jsonList_copy[j][x_axis_title]);
        }
    }
    return min;
}

//min_y value
function min_y(){
    var min = jsonList_copy[0][y_axis_title];
    for(let j=0;j<jsonList_copy.length;j++)
    {
        if(parseFloat(jsonList_copy[j][y_axis_title])<min)
        {
            min=parseFloat(jsonList_copy[j][y_axis_title]);
        }
    }
    return min;
}

//Info function
$("#infos").on("click",function(){
   Swal.fire(
      'A description of the association in a scatterplot should always include a description of the form, direction, ' +'and strength of the association, along with the presence of any outliers.',
       'Form: Is the association linear or nonlinear?\n' + '<br/>'+
       'Direction: Is the association positive or negative?\n' +
       'Strength: Does the association appear to be strong, moderately strong, or weak?\n' + '<br/>'+
       'Outliers: Do there appear to be any data points that are unusually far away from the general pattern?',
       'info'
   );
});

//Line regression
$("div").on("mouseover",".line_regression",function(){
    let coordinate = $(this).text().split(' ');
    console.log(line);
    console.log(dot_set);
    let x1,y1,x2,y2;
    let rate_regression=(Math.abs(dot_set[0].cy-dot_set[1].cy)/Math.abs(dot_set[0].y-dot_set[1].y)).toFixed(2);
    //console.log(rate_regression);
    for(let i=0;i<line.length;i++)
    {
        if(line[i].var==coordinate[1])
        {
            for(let k=0;k<dot_set.length;k++)
            {
                if(parseFloat(line[i].x_temp[0])==dot_set[k].x)
                x1=parseFloat(dot_set[k].cx);

                if(parseFloat(line[i].x_temp[line[i].x_temp.length-1])==dot_set[k].x)
                x2=parseFloat(dot_set[k].cx);
            }
            
            y1=parseFloat(line[i].ry[0]);
            //console.log(y1 + " :y1");

            y1=(dot_set[0].y-y1)*(rate_regression)+dot_set[0].cy;
            y2=parseFloat(line[i].ry[line[i].ry.length-1]);
            //console.log(y2 + " :y2");
            y2=(dot_set[0].y-y2)*(rate_regression)+dot_set[0].cy;

            //console.log(y1 + " :y1");
            //console.log(y2 + " :y2");
            g_body.append("line")
            .attr("x1", x1)
            .attr("y1", y1)
            .attr("x2", x2)
            .attr("y2", y2)
            .attr("stroke", function(){
                if(line[i].var==legend_var[0])
                    return "rgb(31, 119, 180)";
                if(line[i].var==legend_var[1])
                    return "rgb(255, 127, 14)";
                if(line[i].var==legend_var[2])
                    return "rgb(44, 160, 44)";
                if(line[i].var==legend_var[3])
                    return "rgb(214, 39, 40)";
                if(line[i].var==legend_var[4])
                    return "rgb(148, 103, 189)";
                if(line[i].var==legend_var[5])
                    return "rgb(140, 86, 75)";
                return "black";                
            })
            .attr("stroke-width", "2px");
        }
    }
})

$("div").on("mouseout",".line_regression",function(){
    g_body.selectAll("line").remove();

})

var temp_dot_outliers=[];
//Point outliers_mouseover
$("div").on("mouseover",".point_outliers",function(){
    let coordinate = $(this).text().split(/[,:]/);
    let temp_point={};
    //console.log(coordinate);
    for(let i=0;i<outliers_array.length;i++)
    {
        if((outliers_array[i].var==coordinate[0]) && (outliers_array[i].x==coordinate[1]) && (outliers_array[i].y==coordinate[2]))
        {
            for(let z=0;z<dot_set.length;z++)
            {
                if((outliers_array[i].var==dot_set[z].var) && (outliers_array[i].x==dot_set[z].x) && (outliers_array[i].y==dot_set[z].y))
                {
                    temp_point['var']=dot_set[z].var;
                    temp_point['x']=dot_set[z].x;
                    temp_point['cx']=dot_set[z].cx;
                    temp_point['y']=dot_set[z].y;
                    temp_point['cy']=dot_set[z].cy;
                    temp_dot_outliers.push(temp_point);
                    temp_point={};
                }
            } 
        }
    }
    console.log(temp_dot_outliers);

    g_body.selectAll(".dot_outliers")
    .data(temp_dot_outliers)
    .enter()
    .append("circle")
    .attr("class", "dot_outliers")
    .attr("r", 10)
    .attr("cx", function(d){
        //console.log(d['cx']);
        return d['cx'];
    })
    .attr("cy", function(d){
        //console.log(d['cy']);
        return d['cy'];
    })
    .style("fill", function(d) {
        if(d['var']==legend_var[0])
            return "rgb(31, 119, 180)";
        if(d['var']==legend_var[1])
            return "rgb(255, 127, 14)";
        if(d['var']==legend_var[2])
            return "rgb(44, 160, 44)";
        if(d['var']==legend_var[3])
            return "rgb(214, 39, 40)";
        if(d['var']==legend_var[4])
            return "rgb(148, 103, 189)";
        if(d['var']==legend_var[5])
            return "rgb(140, 86, 75)";
        return "black";
    })

});


//Point outliers_mouseover
$("div").on("mouseout",".point_outliers",function(){
    g_body.selectAll(".dot_outliers").remove();
    temp_dot_outliers=[];
          /*.data(temp_dot_outliers)
        .enter()
        .append("circle")
        .attr("class", "dot_outliers1")
        .attr("r", 5)
        .attr("cx", function(d){
            //console.log(d['cx']);
            return d['cx'];
        })
        .attr("cy", function(d){
            //console.log(d['cy']);
            return d['cy'];
        })
        .style("fill", function(d) {
        if(d['var']==legend_var[0])
            return "rgb(31, 119, 180)";
        if(d['var']==legend_var[1])
            return "rgb(255, 127, 14)";
        if(d['var']==legend_var[2])
            return "rgb(44, 160, 44)";
        if(d['var']==legend_var[3])
            return "rgb(214, 39, 40)";
        if(d['var']==legend_var[4])
            return "rgb(148, 103, 189)";
        if(d['var']==legend_var[5])
            return "rgb(140, 86, 75)";
        //return "black";
        })                
        // tooltip
        .on("mouseover", function(d) {
            tooltip.transition()
            .duration(200)         // ms delay before appearing
            .style("opacity", .8); // tooltip appears on mouseover
            tooltip.html(d['var'] + " " + "<br/>(" + d['x']+ ", " + d['y'] + ")")
            .style("left", (d3.event.pageX + 10) + "px")  // specify x location
            .style("top", (d3.event.pageY - 28) + "px");  // specify y location
        })
        .on("mouseout", function(d) {
            tooltip.transition()
            .duration(500)
            .style("opacity", 0); // disappear on mouseout
        });*/
});


var temp_dot_cluster=[];
//Point cluster_mouseover
$("div").on("mouseover",".point_cluster",function(){
   let coordinate = $(this).text().split(/[,:]/);
   //console.log(result_clustering_all);
    let dataset={};

    let temp_point={};
    
    for(let z=0;z<result_clustering_all.length;z++)
    {
        for(let k=0;k<result_clustering_all[z].clusters.length;k++)
        {
                    //console.log(k+ "  "+ result_clustering.clusters[k].centroid[0].toFixed(3)+" :  "+result_clustering.clusters[k].centroid[1].toFixed(3)+"        "+coordinate[0] +" : "+ coordinate[1] );
        if((result_clustering_all[z].var==coordinate[0])&&
            (result_clustering_all[z].clusters[k].centroid[0].toFixed(3)==parseFloat(coordinate[1]))&&
            (result_clustering_all[z].clusters[k].centroid[1].toFixed(3)==parseFloat(coordinate[2])))
        {
            dataset['point'] = result_clustering_all[z].clusters[k].points;
            dataset['var'] = coordinate[0];


            for(let i=0;i<dataset.point.length;i++)
            {
                for(let z=0;z<dot_set.length;z++)
                {
                    if((dataset.var ==dot_set[z].var)&&(dataset.point[i][0]==dot_set[z].x) && (dataset.point[i][1]==dot_set[z].y))
                    {
                        temp_point['var']=dot_set[z].var;
                        temp_point['x']=dot_set[z].x;
                        temp_point['cx']=dot_set[z].cx;
                        temp_point['y']=dot_set[z].y;
                        temp_point['cy']=dot_set[z].cy;
                        temp_dot_cluster.push(temp_point);
                        temp_point={};
                    }

                }
            }
         }
        }

    }

    console.log(temp_dot_cluster);
        // draw dots
    g_body.selectAll(".dot_cluster")
        .data(temp_dot_cluster)
        .enter()
        .append("circle")
        .attr("class", "dot_cluster")
        .attr("r", 5)
        .attr("cx", function(d){
            //console.log(d['cx']);
            return d['cx'];
        })
        .attr("cy", function(d){
            //console.log(d['cy']);
            return d['cy'];
        })
        .style("fill", function(d) {
            if(d['var']==legend_var[0])
                return "rgb(157, 209, 245)";
            if(d['var']==legend_var[1])
                return "rgb(250, 185, 127)";
            if(d['var']==legend_var[2])
                return "rgb(147, 245, 147)";
            if(d['var']==legend_var[3])
                return "rgb(245, 140, 140)";
            if(d['var']==legend_var[4])
                return "rbg(217, 180, 250)";
            if(d['var']==legend_var[5])
                return "rbg(250, 183, 170)";
            return "black"; 
        })
                
});

//Point cluster_mouseout
$("div").on("mouseout",".point_cluster",function(){
   //let coordinate = $(this).text().split(',');
    g_body.selectAll(".dot_cluster").remove();
    temp_dot_cluster=[];
          /*.data(temp_dot_cluster)
        .enter()
        .append("circle")
        .attr("class", "dot_cluster1")
        .attr("r", 5)
        .attr("cx", function(d){
            //console.log(d['cx']);
            return d['cx'];
        })
        .attr("cy", function(d){
            //console.log(d['cy']);
            return d['cy'];
        })
        .style("fill", function(d) {
            //console.log(" remove out over ");
            return "rgb(31, 119, 180)"; 
        })                
        // tooltip
        .on("mouseover", function(d) {
            tooltip.transition()
            .duration(200)         // ms delay before appearing
            .style("opacity", .8); // tooltip appears on mouseover
            tooltip.html(d['var'] + " " + "<br/>(" + d['x']+ ", " + d['y'] + ")")
            .style("left", (d3.event.pageX + 10) + "px")  // specify x location
            .style("top", (d3.event.pageY - 28) + "px");  // specify y location
        })
        .on("mouseout", function(d) {
            tooltip.transition()
            .duration(500)
            .style("opacity", 0); // disappear on mouseout
        });*/

});



//Submit function
$("#submit").on("click",function(){
    
    /*var jsonList={
        "chart_title":chart_title,
        "x_axis_title":x_axis_title,
        "y_axis_title":y_axis_title,
        "array":jsonList_copy
    };*/

        legend_var = unique(legend_var);
        
        var txt = legend_var[0];

        for(let i=1;i<=legend_var.length;i++)
        {
            
            for(let j=0;j<jsonList_copy.length;j++)
            {
                
                if(txt==jsonList_copy[j][variables])
                {
                    x_array.push(jsonList_copy[j][x_axis_title]);
                    y_array.push(jsonList_copy[j][y_axis_title]);
                }
            }
            jsonList_temp["var"]=txt;
            jsonList_temp["x_array"]=x_array;
            jsonList_temp["y_array"]=y_array;
            jsonArray_all.push(jsonList_temp);
            jsonList_temp={};
            txt=legend_var[i];
            x_array=[];
            y_array=[];
        }

        var a=[10,11,11,11,12,12,13,14,14,15,17,22];
        var b=[1, 2, 2, 2, 3, 1, 1, 15, 2, 2, 2, 3, 1, 1, 2];
        var c=[17,13,12,15,16,14,16,16,18,19];
        var d=[2,2,3,2,5,1,6];


        //var b=[94,73,59,80,93,85,66,79,77,91];
        console.log(jsonArray_all);
        //console.log(legend_var);
        //console.log(Outliers_IQR(d));
        //console.log(Outliers_ZScore(d));


        $(".description").html("Descriptions: "+"<br/>"+"<br/>"
            +
            "<b>Overview:</b>  </br> </br>"
            +
            "In this chart, the relationship between <b>"+ x_axis_title +"</b> and <b>"+ y_axis_title +"</b> for <b>"+ legend_var.length +" "+ variables + "</b> is being investigated. <b>"+ 
            x_axis_title + "</b> can range from <b>"+ min_x() + "</b> to <b>"+ max_x() +"</b> and <b>"+ y_axis_title + "</b> in this chart range from <b>"+ min_y() + "</b> to <b>"+ max_y() +"</b>. "+"<br/>"+"<br/>"
            +
            "<b>Correlation:</b> </br> </br>"
            +
            print_correlation()
            +
            print_outliers()+"<br/>"+"<br/>"
            +   
            "<b>Clustering:</b>" + "<br/>"+"<br/>"
            +
            print_clustering()
            + "<br/>"+"<br/>"
        );
    

    /*$.ajax({
      type :"POST",
      url  :"/ACG/Demo",
      contentType : "application/json",
      dataType :"json",    //response data type of server
      data :JSON.stringify(jsonList), //parameters to send
      success :function (data) {

        console.log(data);
        $(".description").html("Descriptions: "+"<br/>"+"<br/>"
            +
            "In this chart, the relationship between "+ data.x_axis_title+" and "+data.y_axis_title+" for three variables is being investigated."+"<br/>"+
            "Dataset: "+data.array);
           Swal.fire({
              icon: 'success',
              title: 'Submit',
              text: 'successfully!',
              })
      },
      error :function(xmlhttp,errorText)
      {
        console.log(xmlhttp);   //xmlhttp.status
        console.log(errorText);
          Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Something went wrong!',
          })
      }
    })*/

});

