$(document).ready(function(){
    	/* $("#loancalcid").click(function(){
		 // alert("The paragraph was clicked.");
		 $("popup").toggleClass('visibleok');
		}); */	
		 /* $("popup").toggleClass('visibleok');
		});	 */
		
				
		$( "#loancalcid" ).on( "click", function() {
				$( "#popupid1" ).show();
			});
			
		// $( "#closeiconid" ).on( "click", function() {
		// 		$( "#popupid1" ).hide();
		// 	});

			
		// $( "#closeiconid1" ).on( "click", function() {
		// 		$( "#popupid1" ).hide();
		// 	});
			
			
			console.log("in app .js");
			
});
function calcval(){
			console.log("calcval was clicked.");
			var amt = parseFloat($("#initamtid").val());
			var roiid = parseFloat($("#roiid").val());
			var tenureid = parseFloat($("#tenureid").val());
			
			console.log("amt.",amt);
			console.log("roiid.",roiid);
			console.log("tenureid.",tenureid);
			var finalamt = amt+parseFloat(amt*roiid*tenureid/100); 
			console.log("finalamt.",finalamt);
			$("#finalamtid").val(finalamt);
		}
	
	function showpopup(){
	console.log("popup shown");
	$( "#popupid" ).show();
}
function hidepopup(){
	console.log("popup shown");
	$( "#popupid" ).hide();
}

function showpopup1(){
	console.log("popup shown");
	$( "#popupid1" ).show();
}
function hidepopup1(){
	console.log("popup shown");
	$( "#popupid1" ).hide();
}

function send_handle() {
	const name = document.getElementById("name").value;
	const email = document.getElementById("email").value;
	const num = document.getElementById("number").value;
	const msg = document.getElementById("comment").value;
  

    var url = "https://wa.me/9067667688?text=" 
    + "Name: " + name + "%0a"
    + "Email: " + email + "%0a"
    + "num: " + num  + "%0a"
    + "comment: " + msg; 

    window.open(url, '_blank');
}


window.onload = function () {

var options = {
	animationEnabled: true,
	theme: "light2",
	title:{
		text: "Growth Rates"
	},
	axisX:{
		valueFormatString: "DD MMM YYYY"
	},
	axisY: {
		title: "Number of Sales",
		suffix: "Lakhs",
		minimum: 30
	},
	toolTip:{
		shared:true
	},  
	legend:{
		cursor:"pointer",
		verticalAlign: "bottom",
		horizontalAlign: "left",
		dockInsidePlotArea: true,
		itemclick: toogleDataSeries
	},
	data: [{																																																																										
		type: "line",
		showInLegend: true,
		name: "Actual Sales",
		markerType: "square",
		xValueFormatString: "DD MMM, YYYY",
		color: "#F08080",
		yValueFormatString: "#,##0Lakh",
		dataPoints: [
			{ x: new Date(2026, 1, 1), y: 78 },
			{ x: new Date(2020, 3, 2), y: 75 },
			{ x: new Date(2015, 5, 3), y: 72 },
			{ x: new Date(2010, 7, 4), y: 70 },
			{ x: new Date(2005, 10, 5), y: 68 }
		]
	},
	{
		type: "line",
		showInLegend: true,
		name: "Projected Sales",
		lineDashType: "dash",
		yValueFormatString: "#,##0Lakh",
		dataPoints: [
			{ x: new Date(2026, 1, 1), y: 60 },
			{ x: new Date(2020, 3, 2), y: 57 },
			{ x: new Date(2015, 5, 3), y: 55 },
			{ x: new Date(2010, 7, 4), y: 51 },
			{ x: new Date(2005, 10, 5), y: 48 }
		]
	}]
};
$("#chartContainer").CanvasJSChart(options);

function toogleDataSeries(e){
	if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
		e.dataSeries.visible = false;
	} else{
		e.dataSeries.visible = true;
	}
	e.chart.render();
}

}