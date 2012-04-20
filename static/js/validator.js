$(document).ready(function() {
var val = new validateElement();

 $("a[rel=popover]")
        .popover({
            offset: 10
        })
        .click(function(e) {
            e.preventDefault()
        })

});

function validateElement(){
	this.init();
};


validateElement.prototype.init =function(){
	var self = this;
	

	$('#button_submit').live("click", function(){
				self.validate();	 		
	});
		
};

validateElement.prototype.validate = function() {
	this.userName =$('#username');
	this.password =$('#password');
	this.url =$('#url');
	this.forumId=$('#forumId');
	this.error = [];
	this.alert = $('.alertTemp').clone();
	this.box = $('.hero-unit');


		if (this.userName.val() ===""){
			this.error.push("username is needed! <br>");
		}
		if (this.password.val() ===""){
			this.error.push("password is needed!<br>");
		}
		if (this.url.val() ===""){
			this.error.push("url is needed!<br>");
		}
		if (this.forumId.val() ===""){
			this.error.push("forumId is needed!<br>");
		}

		if (this.error.length > 0){

			for (var i = this.error.length - 1; i >= 0; i--) {
				this.alert.find('#errList').append(this.error[i])
			};
			
			this.box.append(this.alert);
			this.alert.removeClass('invisible alertTemp');


		}else
		{
			$("#progress").removeClass('invisible');
			$.post("main.php", 
				{ 
					username: this.userName.val(), 
					password: this.password.val(),
					url: this.url.val(),
					forumId: this.forumId.val()

				},

   			function(data) {
   				this.alert.addClass('invisible');
    			alert("Data Loaded: " + data);
   			});
			
		}

}
