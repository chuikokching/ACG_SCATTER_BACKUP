//$("#scatter_chart").html("gogogogogo");

var margin = {top: 50, right: 50, bottom: 60, left: 70},
    width = 1050 - margin.left - margin.right,
    height = 780 - margin.top - margin.bottom;


var svg=d3.select("#scatter_chart")
    .append("svg")
    .attr("width",1050)
    .attr("height",800)

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
    .attr("transform","translate("+490+","+780+")")
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
var z_axis_title="";
var variables="";
var legend_var = [];

var x_array=[],y_array=[];
var jsonList_copy={};
var jsonArray_all=[];
var jsonList_temp={};

var dot_set=[];
var dot_point={};

// load data
d3.csv("https://gist.githubusercontent.com/chuikokching/73772b5eda16720151f4f1b8c1ace8c1/raw/a2e9378b6690440d3a5412893ad724a38190a43f/student_GPA_1.csv").then(function(data) {
    //console.log(data.columns[0]+ " "+data.columns[1]+ " "+data.columns[2]);

    jsonList_copy=data;

    //console.log(jsonList_copy);

    //set title of x and y axis
    variables = data.columns[0];
    x_axis_title = data.columns[1];
    y_axis_title = data.columns[2];
    z_axis_title = data.columns[3];

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
    y.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

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
        .attr("class", function(d){
            return "dot_"+d[variables];
        })
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
            if(z_axis_title!=null)
            {
                tooltip.transition()
                .duration(200)         // ms delay before appearing
                .style("opacity", .8); // tooltip appears on mouseover
            tooltip.html(d[variables] + " " + "<br/>(" + xValue(d)+ ", " + yValue(d) + ")<br/>"+d[z_axis_title])
                .style("left", (d3.event.pageX + 10) + "px")  // specify x location
                .style("top", (d3.event.pageY - 28) + "px");  // specify y location
            }
            else{
                            tooltip.transition()
                .duration(200)         // ms delay before appearing
                .style("opacity", .8); // tooltip appears on mouseover
            tooltip.html(d[variables] + " " + "<br/>(" + xValue(d)+ ", " + yValue(d) + ")<br/>")
                .style("left", (d3.event.pageX + 10) + "px")  // specify x location
                .style("top", (d3.event.pageY - 28) + "px");  // specify y location
            }

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
        .on("click",function(d,i){
        // Determine if current line is visible
        var plot_individual=d;
        // Hide or show the elements
        var plot_class = ".dot_"+plot_individual;
        //console.log(d3.selectAll(plot_class).style("display"));
        if(d3.selectAll(plot_class).style("display")=="inline")
        {
            d3.selectAll(plot_class).style("display", 'none');
        }
        else
        {
            d3.selectAll(plot_class).style("display", 'inline');
        }
        })
        .text(function(d,i) { 
            return d;
        })
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


function print_individual(){
    var text ="There are <b>"+legend_var.length +" "+variables+"</b> in this dataset, they are as follows: </br>";
    for(let i=0;i<legend_var.length;i++)
    {
        text+="<span class=\"individual\"><b>"+legend_var[i]+"</b></span> ";
    }
    return text+"</br></br>";
}


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
            text = text + var_linear[0].association+"</b> linear correlation (<b>"+Math.abs(var_linear[0].value_correlation)+"</b>) between <b>"+ x_axis_title + "</b> and <b>"+ y_axis_title+ "</b>. ";

            if(var_linear[0].value_correlation>0)
            {
                text = text +"That means in terms of overall data, as <b>"+x_axis_title+"</b> increases, so does <b>"+y_axis_title+"</b>. </br>";
            }
            else
            {
                text = text +"That means in terms of overall data, as <b>"+x_axis_title+"</b> decreases, so does <b>"+y_axis_title+"</b>. </br>";
            }
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
            text = text +"We observed that there is a "+correlation_coefficient_association(arr_all_x,arr_all_y)+" "+correlation_coefficient_strength(arr_all_x,arr_all_y)+" linear correlation between <b>"+ x_axis_title + "</b> and <b>"+ y_axis_title+ "</b> for overall data. ";
            if(correlation_coefficient(arr_all_x,arr_all_y)>0)
            {
                text = text +"That means in terms of overall data, as <b>"+x_axis_title+"</b> increases, so does <b>"+y_axis_title+"</b>. </br>";
            }
            else
            {
                text = text +"That means in terms of overall data, as <b>"+x_axis_title+"</b> decreases, so does <b>"+y_axis_title+"</b>. </br>";
            }
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
        text = text + "<span class=\"line_regression\"><b>"+variables+ " "+var_linear[max_pos].var + "</b></span> has a <b>"+var_linear[max_pos].strength+" "+var_linear[max_pos].association+"</b> (<b>"+max+"</b>) linear correlation. (max)</br>";
        text = text + "<span class=\"line_regression\"><b>"+variables+ " "+var_linear[min_pos].var + "</b></span> has a <b>"+var_linear[min_pos].strength+" "+var_linear[min_pos].association+"</b> (<b>"+min+"</b>) linear correlation. (min)</br>";


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

        text = text + "In conslution , there are <b>"+ var_linear.length + " " + variables +" </b> where there is a linear correlation between "+x_axis_title+" and "+ y_axis_title +".</br>"

        if(var_non_linear.length!=0)
        {
            text=text + "In addition, there are <b>" + var_non_linear.length+ " "+variables+" </b> where there is no linear correlation between "+x_axis_title+" and "+ y_axis_title +".</br>";
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
                    outliers_array_copy= jsonArray_all[b].x_array;
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
                    console.log(outliers_x_axis + " x-axis no linear relationship ZScore!!!!!!!!!!!");
                    /*outliers_x_axis= Outliers_IQR(jsonArray_all[b].x_array);
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
                    console.log(outliers_y_axis + " y-axis no linear relationship ZScore!!!!!!!!!!!");
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
        let individual_outlier=[];

        text = text + " There are "+outliers_array.length + " outliers detected, they are as follows: </br>";

        for(let h=0;h<outliers_array.length;h++)
        {
            individual_outlier.push(outliers_array[h].var);
        }

        individual_outlier= unique(individual_outlier);
        //console.log(individual_outlier);

        for(let k=0;k<individual_outlier.length;k++)
        {
            text = text +"<b>"+individual_outlier[k] +"</b>:</br>";
            for(let h=0;h<outliers_array.length;h++)
            {
                if(individual_outlier[k]==outliers_array[h].var)
                {
                    text = text + "[<span class=\"point_outliers\"><b>"+ outliers_array[h].var +":"+ outliers_array[h].x+ ","+outliers_array[h].y + "</span></b>]. ";
                }
            }
            text = text +"</br></br>";            
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

var result_clustering_overall=[];
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

    let sse=[];
    console.log(cluster_data);
    let sum_sse=0;


    if(cluster_data.length==1)
    {
        if(cluster_data[0].data.length<=1)
        {
            text += "No clusters were found or detected in the dataset.";
        }
        else
        {
            //optimal k
            for(let f=1;f<=10;f++)
            {
                result_clustering=kmeans(cluster_data[0].data,f)
                //result_clustering['var']=cluster_data[0].individual;
                
                for(let t=0;t<result_clustering.clusters.length;t++)
                {
                    for(let l=0;l<result_clustering.clusters[t].points.length;l++)
                    {
                        sum_sse+=(Math.pow((result_clustering.clusters[t].points[l][0]-result_clustering.clusters[t].centroid[0].toFixed(3)),2))+(Math.pow((result_clustering.clusters[t].points[l][1]-result_clustering.clusters[t].centroid[1].toFixed(3)),2));
                    }

                }
                //result_clustering_all.push(result_clustering);  
                sse.push(Math.log(sum_sse.toFixed(3)).toFixed(3)); 
                sum_sse=0;
            }
            console.log(sse);

            
            result_clustering = kmeans(cluster_data[0].data,optimal_k(sse))
            result_clustering['var']=cluster_data[0].individual;
            result_clustering_all.push(result_clustering);
            text=text+"We observed that there are <b>"+result_clustering.centroids.length+ " clusters</b> " + "for <b>"+cluster_data[0].individual + "</b>, their details are as follows: </br></br> "
            
            for(let q=0;q<result_clustering.centroids.length;q++)
            {
                text=text+"Cluster center [<span class=\"point_cluster\"><b>"+cluster_data[0].individual +":"+ result_clustering.clusters[q].centroid[0].toFixed(3)+","+result_clustering.clusters[q].centroid[1].toFixed(3)+ "</b></span>] with [<b>"+result_clustering.clusters[q].points.length + "</b>] data points. </br>";
            }
            text=text+"</br>";

            sse=[];            
        }
    }
    else
    {
        let sum_arr=[];
        //Optimal K Value
        for(let b=0;b<cluster_data.length;b++)
        {
            for(var i in cluster_data[b].data)
            sum_arr.push(cluster_data[b].data[i]);
        }
        //console.log(sum_arr);

        //optimal k
        for(let f=1;f<=10;f++)
        {
            result_clustering=kmeans(sum_arr,f)
            //result_clustering['var']="overall_data";
            
            for(let t=0;t<result_clustering.clusters.length;t++)
            {
                for(let l=0;l<result_clustering.clusters[t].points.length;l++)
                {
                    sum_sse+=(Math.pow((result_clustering.clusters[t].points[l][0]-result_clustering.clusters[t].centroid[0].toFixed(3)),2))+(Math.pow((result_clustering.clusters[t].points[l][1]-result_clustering.clusters[t].centroid[1].toFixed(3)),2));
                }

            }
            //result_clustering_all.push(result_clustering);  
            sse.push(Math.log(sum_sse.toFixed(3)).toFixed(3)); 
            sum_sse=0;
        }
        //console.log(sse);
        //console.log(optimal_k(sse));

        if(optimal_k(sse)>1)
        {
            result_clustering=kmeans(sum_arr,optimal_k(sse));
            result_clustering['var']="overall_data";
            result_clustering_overall.push(result_clustering);
            text=text+"We observed that there are <b>"+result_clustering.centroids.length+ " clusters</b> for overall data in this dataset, their details are as follows: </br></br> "
            
            for(let q=0;q<result_clustering_overall[0].clusters.length;q++)
            {
                text=text+"Cluster center [<span class=\"point_cluster_overall_data\"><b>"+result_clustering_overall[0].var +":"+ result_clustering_overall[0].clusters[q].centroid[0].toFixed(3)+","+result_clustering_overall[0].clusters[q].centroid[1].toFixed(3)+ "</b></span>] with [<b>"+result_clustering_overall[0].clusters[q].points.length + "</b>] data points. </br>";
            }
            text=text+"</br>";

            sse=[];
        }
        else
        {
            text += "No clusters were found or detected in the dataset for overall data. </br>";
            sse=[];
        }
        
        //!!!!!
        for(let o=0;o<cluster_data.length;o++)
        {
            //optimal k
            for(let f=1;f<=6;f++)
            {
                result_clustering=kmeans(cluster_data[o].data,f)
                //result_clustering['var']="overall_data";
                
                for(let t=0;t<result_clustering.clusters.length;t++)
                {
                    for(let l=0;l<result_clustering.clusters[t].points.length;l++)
                    {
                        sum_sse+=(Math.pow((result_clustering.clusters[t].points[l][0]-result_clustering.clusters[t].centroid[0].toFixed(3)),2))+(Math.pow((result_clustering.clusters[t].points[l][1]-result_clustering.clusters[t].centroid[1].toFixed(3)),2));
                    }

                }
                //result_clustering_all.push(result_clustering);  
                sse.push(Math.log(sum_sse.toFixed(3)).toFixed(3)); 
                sum_sse=0;
            }

            //console.log(optimal_k(sse));
            if(optimal_k(sse)>1)
            {
                console.log(cluster_data[o].data);
                result_clustering=kmeans(cluster_data[o].data,optimal_k(sse))
                result_clustering['var']=cluster_data[o].individual;
                result_clustering_all.push(result_clustering);
                text=text+"We observed that there are <b>"+result_clustering.centroids.length+ " clusters</b> " + "for <b>"+cluster_data[o].individual + "</b>, their details are as follows: </br></br> "
                
                for(let q=0;q<result_clustering.centroids.length;q++)
                {
                    text=text+"Cluster center [<span class=\"point_cluster\"><b>"+cluster_data[o].individual +":"+ result_clustering.clusters[q].centroid[0].toFixed(3)+","+result_clustering.clusters[q].centroid[1].toFixed(3)+ "</b></span>] with [<b>"+result_clustering.clusters[q].points.length + "</b>] data points. </br>";
                }
                text=text+"</br>";                
            }
            sse=[];
      
        }
    }

    console.log(result_clustering_all);
    console.log(result_clustering_overall);
    
    return text;
}

function optimal_k(arr)
{
    let index=0,gap=0;
    for(let i=1;i<arr.length;i++)
    {
        if(Math.abs(arr[i]-arr[i-1])>gap){
            gap=Math.abs(arr[i]-arr[i-1]).toFixed(3);
            index=i;
        }        
    }
    return index>=1? (index+1):0;
}

function rate_weak(y,value)
{
    if(y!=0 && value!=0)
    {
    if(y>=value)
    {
        if(y/value > 1.79 )
        return "outlier";
        else
            return "not_outlier"
    }
    else{
        if(value/y > 1.79 )
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
        if(y/value > 1.7 )
        return "outlier";
        else
            return "not_outlier"
    }
    else{
        if(value/y > 1.7 )
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
    const upper_bounds = q3 + iqr * 1.5;
    const lower_bounds = q1 - iqr * 1.5;

    var result=sortedCollection.filter((x)=>{
        return (x>upper_bounds)||(x<lower_bounds);
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

function kmeans(dataset, k) {
    //console.log(dataset.length + " "+ dataset[0].length + " "+ k);
  if (dataset.length && dataset[0].length && dataset.length > k) {
    // Initialize book keeping variables
    let iterations = 0;
    let oldCentroids, labels, centroids;

    // Initialize centroids randomly
   centroids = getRandomCentroids(dataset, k);
    //console.log(centroids);


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
        var r=0,sum=0,sum_x=0,sum_y=0;
        var arr_x_aver=average(arr_x);
        var arr_y_aver=average(arr_y);

        for(var i=0;i<arr_x.length;i++)
        {
            sum+=(arr_x[i]-arr_x_aver)*(arr_y[i]-arr_y_aver)
        }
        for(var i=0;i<arr_x.length;i++)
        {
            sum_x+=(arr_x[i]-arr_x_aver)*(arr_x[i]-arr_x_aver)
        }

        for(var k=0;k<arr_y.length;k++)
        {
            sum_y+=(arr_y[k]-arr_y_aver)*(arr_y[k]-arr_y_aver)
        }        
        r=(sum/Math.sqrt(sum_x*sum_y)).toFixed(3);
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
Swal.fire({
  title: 'Analysis Tool Instructions',
  width: 700,
  padding: '2em',
  showConfirmButton: false,
  html:'<span style=\"font-size:23px"><b>Text Structure as follows:</b></span></br>'+'<b>1. Individuals: how many individuals this dataset has.</b></br>'+'<b>2. Overview: rough description of the dataset.</b></br>'+'<b>3. Correlation: linear correlation between variables x and y.</b></br>'+'<b>4. Outliers detection for each individual.</b></br>'+'<b>5. Clustering group of dataset for overall data and each individual.</b></br>'
  });
});

//Upload function
$("#upload").on("click",function(){
Swal.fire({
  inputLabel: 'URL address',
  input: 'text',
}).then((result) => 
{
  if (result.value) {
    //const answers = JSON.stringify(result.value)
    /*Swal.fire({
      title: 'All done!',
      html: `Your url:<pre><code>${answers}</code></pre>`,
    })*/

    console.log(result.value);

  }
})


});


//Line regression
$("div").on("mouseover",".line_regression",function(){
    let coordinate = $(this).text().split(' ');

    let x1,y1,x2,y2;
    let rate_regression=(Math.abs(dot_set[0].cy-dot_set[1].cy)/Math.abs(dot_set[0].y-dot_set[1].y)).toFixed(2);

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
                if(line[i].var==legend_var[6])
                    return "rgb(247, 129, 230)";
                if(line[i].var==legend_var[7])
                    return "rgb(138, 131, 137)";
                if(line[i].var==legend_var[8])
                    return "rgb(148, 181, 71)";
                if(line[i].var==legend_var[9])
                    return "rgb(41, 167, 171)";                 
                return "black";                
            })
            .attr("stroke-width", "5px");
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
        if(d['var']==legend_var[6])
            return "rgb(247, 129, 230)";
        if(d['var']==legend_var[7])
            return "rgb(138, 131, 137)";
        if(d['var']==legend_var[8])
            return "rgb(148, 181, 71)";
        if(d['var']==legend_var[9])
            return "rgb(41, 167, 171)";    
        return "black";
    })

});


//Point outliers_mouseover
$("div").on("mouseout",".point_outliers",function(){
    g_body.selectAll(".dot_outliers").remove();
    temp_dot_outliers=[];
});


var temp_dot_cluster_overall=[];
//Point cluster_mouseover for overall data
$("div").on("mouseover",".point_cluster_overall_data",function(){
    let coordinate = $(this).text().split(/[,:]/);
    //console.log(coordinate);
    let dataset={};

    let temp_point={};

    for(let k =0;k<result_clustering_overall[0].clusters.length;k++)
    {
        if((result_clustering_overall[0].var==coordinate[0])&&
        (result_clustering_overall[0].clusters[k].centroid[0].toFixed(3)==parseFloat(coordinate[1]))&&
        (result_clustering_overall[0].clusters[k].centroid[1].toFixed(3)==parseFloat(coordinate[2])))
        {
            dataset['point'] = result_clustering_overall[0].clusters[k].points;
            dataset['var'] = coordinate[0];

            for(let i=0;i<dataset.point.length;i++)
            {
                for(let z=0;z<dot_set.length;z++)
                {
                    if((dataset.point[i][0]==dot_set[z].x) && (dataset.point[i][1]==dot_set[z].y))
                    {
                        temp_point['var']="overall";
                        temp_point['x']=dot_set[z].x;
                        temp_point['cx']=dot_set[z].cx;
                        temp_point['y']=dot_set[z].y;
                        temp_point['cy']=dot_set[z].cy;
                        temp_dot_cluster_overall.push(temp_point);
                        temp_point={};
                    }

                }
            }
        }
    }
    console.log(temp_dot_cluster_overall);
    // draw dots
    g_body.selectAll(".dot_cluster_overall")
        .data(temp_dot_cluster_overall)
        .enter()
        .append("circle")
        .attr("class", "dot_cluster_overall")
        .attr("r", 6)
        .attr("cx", function(d){
            //console.log(d['cx']);
            return d['cx'];
        })
        .attr("cy", function(d){
            //console.log(d['cy']);
            return d['cy'];
        })
        .style("fill", "black")  

});


$("div").on("mouseout",".point_cluster_overall_data",function(){
    g_body.selectAll(".dot_cluster_overall").remove();
    temp_dot_cluster_overall=[];
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
        .attr("r", 6)
        .attr("cx", function(d){
            //console.log(d['cx']);
            return d['cx'];
        })
        .attr("cy", function(d){
            //console.log(d['cy']);
            return d['cy'];
        })
        .style("fill", "black")  
});

//Point cluster_mouseout
$("div").on("mouseout",".point_cluster",function(){
   //let coordinate = $(this).text().split(',');
    g_body.selectAll(".dot_cluster").remove();
    temp_dot_cluster=[];
});


$("div").on("click",".individual",function(){
    let coordinate = $(this).text();
    //console.log(coordinate);
});


//Submit function
$("#submit").on("click",function(){
    
    /*var jsonList={
        "chart_title":chart_title,
        "x_axis_title":x_axis_title,
        "y_axis_title":y_axis_title,
        "array":jsonList_copy
    };*/
        //name of individuals
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

        console.log(jsonArray_all);
        //console.log(Outliers_regression_analysis(a,b));
        //console.log(Outliers_ZScore(d));

        $(".description").html(
            "<span style=\"font-size:30px\"><b><u><em>Descriptions:</em></u></b></span> "+"<br/>"+"<br/>"
            +
            "<b>Individuals:</b> </br></br>"
            +
            print_individual()
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

