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

function wtsapsharehandle(){
	console.log("inside wtsapsharehandle");
	const message = "Hello! Welcome to 1guntha.com please share our site link with your contacts. https://www.ekguntha.com";
const encodedMessage = encodeURIComponent(message);
const whatsappUrl = "https://wa.me/?text=" + encodeURIComponent(message);;
window.open(whatsappUrl, '_blank');
}
