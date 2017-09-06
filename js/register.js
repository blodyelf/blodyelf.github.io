$(document).ready(function() {
	

	$("#register").submit(function(e){
				
		e.preventDefault();

		$("input").siblings("span").html("");

		var error = false;
		//alert("YES!");

		// Check empty
		if(!$.trim($("#email").val()).length) {
			$("#email").siblings("span").html("* Mandatory field!");
			error = true;
		} 	
		
		if(!$.trim($("#password").val()).length) {
				$("#password").siblings("span").html("* Mandatory field!");
				error = true;
		} 
		if(!$.trim($("#retype_password").val()).length) {
				$("#retype_password").siblings("span").html("* Mandatory field!");
				error = true;
		} 
		
		// Check terms
		if (!$('#terms').is(":checked")) {
				$("#terms").siblings("span").html("* Please read the terms and conditions!");
				error = true;
		}

		// Check password
		if($("#retype_password").val() != $("#password").val()) {
				$("#retype_password").siblings("span").html("* Password not matching!");
				error = true;
		}  
		
		
		if(!error) { 
			
			$.post("../php/process_register.php", $(this).serialize(), function(data){
				
				console.log(data);
				var parsedData = jQuery.parseJSON(data);

				if(parsedData.success === 'yes') {
					//alert("Yes!");
				}
				else {
					//alert("No!");
					$("#email").siblings("span").html(parsedData.email);
					$("#first_name").siblings("span").html(parsedData.first_name);
					$("#last_name").siblings("span").html(parsedData.last_name);
					$("#password").siblings("span").html(parsedData.password);
					$("#retype_password").siblings("span").html(parsedData.retype_password);
					$("#terms").siblings("span").html(parsedData.terms);
				
				}
			});
		}
	});
});