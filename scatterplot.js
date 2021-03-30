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
    .attr("transform","translate("+480+","+680+")")
    .append("text")
    .attr("font-size", 18)
    .attr("fill","#1f375a")
   // .text(x_axis_title)

//title of y_axis
var g_y_axis_title = svg.append("g")
    .attr("transform","translate("+30+","+400+")")
    .append("text")
    .attr("font-size", 18)
    .attr("transform", "rotate(-90)")
    .attr("fill","#1f375a")
  //  .text(y_axis_title)

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var chart_title="Title of Scatterplot Chart";
var x_axis_title="";
var y_axis_title="";
var variables="";
var legend_var = [];

var x_array=[],y_array=[];
var jsonList_copy={};
var jsonArray_all=[];
var jsonList_temp={};
// load data
d3.csv("https://gist.githubusercontent.com/chuikokching/69d365874ae985df3fc3161a3bf7e1b1/raw/004a22af207396ee4ce2c61334e5686e79201d2b/disaster.csv").then(function(data) {
    console.log(data.columns[0]+ " "+data.columns[1]+ " "+data.columns[2]);

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
        x=d3.scaleLinear().range([0,width]),     // value -> display, length of x-axis
        xMap = function(d) { return x(xValue(d));}; // data -> display

    // setup y - use +d to change string into number format
    var yValue = function(d) { return +d[y_axis_title];}, // data -> value
        y = d3.scaleLinear().range([height, 0]),    // value -> display, length of y-axis
        yMap = function(d) { return y(yValue(d));}; // data -> display

    // don't want dots overlapping axis, so add in buffer to data domain
    x.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
    y.domain([0, d3.max(data, yValue)+1]);

    // Add the x-axis.
    g_body.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")") // move axis to bottom of chart
        .call(d3.axisBottom(x));
    // Add the y-axis.
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
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function(d) {return colors(cValue(d)); })

        // tooltip
        .on("mouseover", function(d) {
            tooltip.transition()
                .duration(200)         // ms delay before appearing
                .style("opacity", .8); // tooltip appears on mouseover
            tooltip.html(x_axis_title + " " + y_axis_title + "<br/>(" + xValue(d)+ ", " + yValue(d) + ")")
                .style("left", (d3.event.pageX + 10) + "px")  // specify x location
                .style("top", (d3.event.pageY - 28) + "px");  // specify y location
        })
        .on("mouseout", function(d) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0); // disappear on mouseout
        });

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
        if (array .indexOf(arr[i]) === -1) {
            array .push(arr[i])
        }
    }
    return array;
}

//traverse array
function print()
{
    var var_linear=[];
    var var_non_linear=[];
    var var_positive=[];
    var var_negative=[];
    var text=" This chart compares <b>"+ legend_var+"</b> 's <b>"+ x_axis_title + "</b> and <b>"+ y_axis_title+ "</b>.";
    for(var i=0;i<jsonArray_all.length;i++)
    {
        if(correlation_coefficient_linear(jsonArray_all[i].x_array,jsonArray_all[i].y_array)=="linear")
        {
            var_linear.push(jsonArray_all[i].var);
            if(correlation_coefficient_association(jsonArray_all[i].x_array,jsonArray_all[i].y_array)=="positive")
                var_positive.push(jsonArray_all[i].var);
            else
                var_negative.push(jsonArray_all[i].var);
        } 
        else
        {
            var_non_linear.push(jsonArray_all[i].var);
        }
    }

    console.log(var_positive);
    console.log(var_negative);
    if(var_linear.length!=0)
    {     
        if(var_positive.length!=0)
        {
            text=text +" These two variables have a <b>linear positive</b> ";
            for(var k=0;k<var_positive.length;k++)
            {
                for(var z=0;z<jsonArray_all.length;z++)
                {
                    if(var_positive[k]==jsonArray_all[z].var)
                    {
                        text=text+"<b>" +correlation_coefficient_strength(jsonArray_all[z].x_array,jsonArray_all[z].y_array)+"</b>," 
                    }
                }
                
            } 
            text= text + " relationship, when the Individuals are <b>"+ var_positive + "</b>, because as <b>"+ x_axis_title +"</b> increases, so does <b>"+ y_axis_title+"</b>. "
        }
        if(var_negative.length!=0)
        {
            text=text +" These two variables have a <b>linear negative</b> ";
            for(var k=0;k<var_negative.length;k++)
            {
                for(var z=0;z<jsonArray_all.length;z++)
                {
                    if(var_negative[k]==jsonArray_all[z].var)
                    {
                        text=text+"<b>"+ correlation_coefficient_strength(jsonArray_all[z].x_array,jsonArray_all[z].y_array)+"</b>," 
                    }
                }
                
            } 
            text= text + " when the Individuals are <b>"+ var_negative + "</b>, because as <b>"+ x_axis_title +"</b> decreases, so does <b>"+ y_axis_title+"</b>. "
        }
        text=text+"This means that the points on the scatterplot closely resemble a straight line."+"<br/>"+"<br/>"
    }
 
    return text;
}


//k-means clustering
function k_means()
{

}

//correlation value r
function correlation_coefficient_linear(arr_x,arr_y)
{
    if(arr_x.length!=arr_y.length)
        return "Error, length of array doesn't match!"
    else
    {
        var r=correlation_coefficient(arr_x,arr_y);

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
    arr.forEach(function(e){
        sum+=parseFloat(e);
    })
    return (sum/arr.length).toFixed(3);
}

//max_x value
function max_x(){
    var max=jsonList_copy[0][x_axis_title];
    for(let j=0;j<jsonList_copy.length;j++)
    {
        if(parseFloat(jsonList_copy[j][x_axis_title])>max)
        {
            max=jsonList_copy[j][x_axis_title]
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
            max=jsonList_copy[j][y_axis_title]
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
            min=jsonList_copy[j][x_axis_title];
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
            min=jsonList_copy[j][y_axis_title];
        }
    }
    return min;
}


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

        //var a=[17,13,12,15,16,14,16,16,18,19];
        //var b=[94,73,59,80,93,85,66,79,77,91];
        console.log(jsonArray_all);

        $(".description").html("Descriptions: "+"<br/>"+"<br/>"
            +
            "In this chart, the relationship between <b>"+ x_axis_title +"</b> and <b>"+ y_axis_title +"</b> for <b>"+ legend_var + "</b> is being investigated. <b>"+ 
            x_axis_title + "</b> can range from <b>"+ min_x() + "</b> to <b>"+ max_x() +"</b> and <b>"+ y_axis_title + "</b> in this chart range from <b>"+ min_y() + "</b> to <b>"+ max_y() +"</b>. Individuals in this table were ordered based on their <b>"+x_axis_title + "</b>."+"<br/>"+"<br/>"
            +
            print()
            +
            "Outliers:" + "<br/>"+"<br/>"
            +   
            "Clustering:" + "<br/>"+"<br/>"
            +
            "Predictions:In general, the higher values of "+x_axis_title+", the larger the values of "+y_axis_title+ ", because the relationship between them is linear and positive."+ "<br/>"+"<br/>"
            +
            "<br/>"
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

