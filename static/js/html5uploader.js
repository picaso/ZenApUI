/*
*	The current version does not work on:
*	Opera 10.63 
*	Opera 11 alpha
*	IE 6+
*/

$(document).ready(function() {
listFiles();

});

function uploader(place, status, targetPHP, show) {
	
	upload = function(file) {
				var success = "<br><div class=\"alert alert-success\"> <a class=\"close\" data-dismiss=\"alert\">×</a>File successfully Loaded</div>"

	
		// Firefox 3.6, Chrome 6, WebKit
		if(window.FileReader) { 
				
			this.loadEnd = function() {
				bin = reader.result;				
				xhr = new XMLHttpRequest();
				xhr.open('POST', targetPHP+'?up=true', true);
				var boundary = 'xxxxxxxxx';
	 			var body = '--' + boundary + "\r\n";  
				body += "Content-Disposition: form-data; name='upload'; filename='" + file.name + "'\r\n";  
				body += "Content-Type: application/octet-stream\r\n\r\n";  
				body += bin + "\r\n";  
				body += '--' + boundary + '--';      
				xhr.setRequestHeader('content-type', 'multipart/form-data; boundary=' + boundary);
				// Firefox 3.6 provides a feature sendAsBinary ()
				if(xhr.sendAsBinary != null) { 
					xhr.sendAsBinary(body); 
				// Chrome 7 sends data but you must use the base64_decode on the PHP side
				} else { 
					xhr.open('POST', targetPHP+'?up=true&base64=true', true);
					xhr.setRequestHeader('UP-FILENAME', file.name);
					xhr.setRequestHeader('UP-SIZE', file.size);
					xhr.setRequestHeader('UP-TYPE', file.type);
					xhr.send(window.btoa(bin));
				}
				if (show) {
					var newFile  = document.createElement('div');
					newFile.innerHTML = "<div class=\"alert alert-info\">"+file.name+' size '+file.size+" bytes</div>"
					document.getElementById(show).appendChild(newFile);				
				}
				if (status) {
					document.getElementById(status).innerHTML = success;
					$("#filename").val(file.name);
					listFiles();

				}
			}
				
			this.loadError = function(event) {
				switch(event.target.error.code) {
					case event.target.error.NOT_FOUND_ERR:
						document.getElementById(status).innerHTML = errorHandler('File not found!');
					break;
					case event.target.error.NOT_READABLE_ERR:
						document.getElementById(status).innerHTML = errorHandler('File not readable!');
					break;
					case event.target.error.ABORT_ERR:
					break; 
					default:
						document.getElementById(status).innerHTML = errorHandler('Read error.');
				}	
			}

			this.loadProgress = function(event) {
				if (event.lengthComputable) {
					var percentage = Math.round((event.loaded * 100) / event.total);
					document.getElementById(status).innerHTML = 'Loaded : '+percentage+'%';
				}				
			}

		reader = new FileReader();
		// Firefox 3.6, WebKit
		if(reader.addEventListener) { 
			reader.addEventListener('loadend', this.loadEnd, false);
			if (status != null) 
			{
				reader.addEventListener('error', this.loadError, false);
				reader.addEventListener('progress', this.loadProgress, false);
			}
		
		// Chrome 7
		} else { 
			reader.onloadend = this.loadEnd;
			if (status != null) 
			{
				reader.onerror = this.loadError;
				reader.onprogress = this.loadProgress;
			}
		}
		
		
     	reader.readAsBinaryString(file);
	 
		
  		// Safari 5 does not support FileReader
		} else {
			xhr = new XMLHttpRequest();
			xhr.open('POST', targetPHP+'?up=true', true);
			xhr.setRequestHeader('UP-FILENAME', file.name);
			xhr.setRequestHeader('UP-SIZE', file.size);
			xhr.setRequestHeader('UP-TYPE', file.type);
			xhr.send(file); 
			
			if (show) {
					var newFile  = document.createElement('div');
					newFile.innerHTML = "<div class=\"alert alert-info\">"+file.name+' size '+file.size+" bytes</div>"
					document.getElementById(show).appendChild(newFile);				
				}
			if (status) {
					document.getElementById(status).innerHTML = success;
					//document.getElementById(place).style.display="none";
					$("#filename").val(file.name);
					listFiles();

				}
		}				
	}

	this.drop = function(event) {
		event.preventDefault();
	 	var dt = event.dataTransfer;
	 	var files = dt.files;
	 	for (var i = 0; i<files.length; i++) {
			var file = files[i];
			console.log(file.type)
			if (!file.type.match("text/csv")){
				document.getElementById(status).innerHTML = errorHandler('NOT a valid .csv file');
			} else{
			upload(file);
		}
	 	}
		
	}

	errorHandler= function(error){
				
				return  "<br><div class=\"alert alert-error\"> <a class=\"close\" data-dismiss=\"alert\">×</a>" +error+ "</div>"
			}

	this.filedraghover =function(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}

	this.uploadPlace =  document.getElementById(place);
	this.uploadPlace.addEventListener("dragover", this.filedraghover, true);
	this.uploadPlace.addEventListener("dragleave", this.filedraghover, true);
	this.uploadPlace.addEventListener("drop", this.drop, true); 
	this.uploadPlace.style.display = "block";

}

var listFiles = function(){
$('#availableFiles > ol').html('')
	$.getJSON('getFolderAsArrayOfNames.php',
 function(data) {
    getFolderDetails(data);
  }
	);

}

var getFolderDetails = function (data){
	var count = -1;
	 $.each(data, function(key, val) {
	 	if (val.split('.').pop()==="csv"){

	 		$('#availableFiles > ol').append('<li class="L' + count++ + '">' + val + '</li>');
	 	}

	 	
	 })

	 if (count < 0) {
	 		$('#availableFiles > ol').append('<li class="L' + 0 + '"> No files uploaded!</li>');

	 	}
};
	