
$(document).ready(function() {
	
	
	$("#login").submit(function(e){

		e.preventDefault();
		var dis = $(this);
		$.post("login.php", $(this).serialize(), function(data){
			
			if($.trim(data) == "success") {
				location.reload();
			}
			else {
				$(".error").html(data);
			}
		});
	});

	$.get("get_bills.php", function(data){
		$("#all_bills").append(data);
		
		$(".show_pay_bill").on("click", function() {
			var obj = $(this);
			showPayBill(obj);
		});

		$(".pay_bill").submit(function(e){
			e.preventDefault();
			var obj = $(this).parent().find(".holder");
			obj.html("Processing...");
			showPayBill(obj.parent().find(".show_pay_bill"));
			$.post("make_payment.php", $(this).serialize(), function(){
				obj.html('Payment processed! Waiting confirmation...</div>')
			});
		});
		
		$(".hide_bill").on("click", function() {

			if(confirm("By doing this you will no longer see this bill. This does not remove the bill! This is an irreversible action! Are you sure you want to do this?")) {
							
				var dis = $(this);				
				$.post("hide_bill.php", {id: dis.attr('id')}, function(data){

					if($.trim(data) == "done") {
						hideBill(dis);		
					}
					else {
						$(".callout#" + dis.attr("id")).find(".hide_error").html("You can't hide a bill you haven't paid!");
					}
				})			
			 			
			} 
		});

		$(".remove_bill").on("click", function() {

			if(confirm("By doing this you will remove this bill! No other member would be able to see it after. Balance will be adjusted to not take this bill in consideration. This is an irreversible action! Are you sure you want to do this?")) {
							
				var dis = $(this);				
				$.post("hide_bill.php", {id: dis.attr('id')}, function(data){

					hideBill(dis);	
					
					$.get("get_balances.php", function(data){
						$("#balance").html(data);
					});		
				})			
			 			
			} 
		});
	});

	$.get("get_balances.php", function(data){
		$("#balance").html(data);
		
		$(".notify").on("click", function(){
			var dis = $(this);
			$("#notify_all").attr("disabled", true);
			dis.attr("disabled", true);
			
			$.post("notify.php", {id: dis.attr("id")}, function(){
				
				dis.parent().append('<div class="error holder">User notified!</div>');
			});
		});

		$("#notify_all").on("click", function(){
			var dis = $(this);
			var notify = $(".notify");
			dis.attr("disabled", true);
			notify.attr("disabled", true);

			$.post("notify.php", {id: "null"}, function(){
				
				notify.parent().append('<div class="error holder">User notified!</div>');
			});
		});
	});

	$.get("more_options.php",function(data){
		$("#more_options").append(data);
	});

	$("#form_add_bill").submit(function(e){
		e.preventDefault();
		var ok = true;
		var error = $("#error");
		emptyErrors();

		if($("#type").val() == "Other" && ($("#message") == "" || $("#message") == null)){
			$("#message_err").html("* This field cannot be empty!");
			ok = false;
		}
		
		if($("#date_due").val() === "" || $("#date_due").val() === null){
			$("#date_due_err").html("* This field cannot be empty!");
			ok = false;
		}

		if($("#amount").val() === "" || $("#amount").val() === null){
			$("#amount_err").html("* This field cannot be empty!");
			ok = false;
		}

		var total_nr = 0;
		var total_value = 0;
		var empty_nr = 0;
		var i;
		for(i = 1; i <= 10 && ok; i++) {
			var percent = $("#user" + i);
			
			if( percent.length == 0 ) continue;

			var hide = $("#user" + i + "_hide");

			total_nr++;

			if( percent.val() == "" || percent.val() === null) {
				empty_nr++;
			}
			else {
				total_value += parseFloat(percent.val()); 
			}

			if( percent.val() > 0 && hide.val() == "Yes") {
				ok = false;
				error.append("Cannot hide bill from paying user! ");
				$("#error" + i).html("*");
			}

		}

		if(ok) {
			if(total_value > 100) {
				ok = false;
				error.append("Sum of the values cannot be over 100! ");
			}
			else if(total_value != 100 && empty_nr == 0) {
				ok = false;
				error.append("Values don't add up to 100! ");
			}

			else
				for(i = 1; i <= 10 && ok; i++) {
					var percent = $("#user" + i);
					
					if( percent.length == 0 ) continue;

					var hide = $("#user" + i + "_hide");
					if(percent.val() == "" || percent.val() === null) {
						var value = (100 - total_value) / empty_nr;
						if(hide.val() == "Yes" && value > 0) {
							ok = false;
							error.append("Cannot hide bill from paying user! ");
							$("#error" + i).html("*");
						}
						else percent.val(value);
					}
				}
		}

		if(ok) {
			if(confirm("Are you sure you want to create this bill?")){
				$.post("create_bill.php", $(this).serialize(), location.reload());
			
			}
		}	
	});

	$("#show_bill").on("click", function() {
		$("#tutorial_index").hide();
		showAddBill();		
	});

	$("#show_more_options").on("click", function() {
		showMoreOptions();		
	});

	$("#show_all_bills").on("click", function() {
		$("#tutorial_index").hide();
		showAllBills();		
	});

	$("#show_balance").on("click", function() {
		$("#tutorial_index").hide();
		showBalance();		
	});

	
});

function hideBill(obj){
	var dis = $(".callout#" + obj.attr("id"));
		
	dis.slideUp("fast");
		
}

function showPayBill(obj){
	var all = $(".pay_bill");
	var dis = $("#form_" + obj.attr("id"));
		if(dis.css('display') == "none"){
			all.slideUp("fast");
			dis.slideDown("fast");
		}
		else {
			dis.slideUp("fast");
		}
}

function showMoreOptions() {
	var add = $("#more_options");
		if(add.css('display') == "none"){
			add.show();
		}
		else {
			add.hide();
		}
}

function showAddBill() {
	var add = $("#add_bill");
	var all_bills = $("#all_bills");
	var balance = $("#balance");
		if(add.css('display') == "none"){
			add.show();
			if(all_bills.css('display') != "none")
				all_bills.hide();
			if(balance.css('display') != "none")
				balance.hide();
		}
		else 
			add.hide();
}

function showAllBills() {
	var add = $("#add_bill");
	var all_bills = $("#all_bills") ;
	var balance = $("#balance");
		if(all_bills.css('display') == "none"){
			all_bills.show();
			if(add.css('display') != "none")
				add.hide();
			if(balance.css('display') != "none")
				balance.hide();
		}
		else 
			all_bills.hide();
}

function showBalance() {
	var add = $("#add_bill");
	var all_bills = $("#all_bills") ;
	var balance = $("#balance");
		if(balance.css('display') == "none"){
			balance.show();
			if(add.css('display') != "none")
				add.hide();
			if(all_bills.css('display') != "none")
				all_bills.hide();
		}
		else 
			balance.hide();
}

function emptyErrors(){
	$("#error").empty().append("* ");
	for(i = 1; i < 10; i++)
		$("#error" + i).empty();
	$("#message_err").empty();
	$("#amount_err").empty();
	$("#date_due_err").empty();
}

function hideAddBill() {
	$("#add_bill").fadeOut();
}


  	

