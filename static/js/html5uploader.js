/*
*	Upload files to the server using HTML 5 Drag and drop the folders on your local computer
*
*	Tested on:
*	Mozilla Firefox 3.6.12
*	Google Chrome 7.0.517.41
*	Safari 5.0.2
*	WebKit r70732
*
*	The current version does not work on:
*	Opera 10.63 
*	Opera 11 alpha
*	IE 6+
*/

function uploader(place, status, targetPHP, show) {
	
	// Upload image files
	upload = function(file) {
	
		// Firefox 3.6, Chrome 6, WebKit
		if(window.FileReader) { 
				
			// Once the process of reading file
			this.loadEnd = function() {
				bin = reader.result;				
				xhr = new XMLHttpRequest();
				var success = "<br><div class=\"alert alert-success\"> <a class=\"close\" data-dismiss=\"alert\">×</a>File successfully Loaded</div>"
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
					document.getElementById(place).style.display="none";
					$("#filename").val(file.name);

				}
			}
				
			// Loading errors
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
			
			this.errorHandler= function(error){
				
				return  "<br><div class=\"alert alert-success\"> <a class=\"close\" data-dismiss=\"alert\">×</a>" +error+ "</div>"
			}
		
			// Reading Progress
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
		
		
		// The function that starts reading the file as a binary string
     	reader.readAsBinaryString(file);
	 
		
  		// Safari 5 does not support FileReader
		} else {
			xhr = new XMLHttpRequest();
			xhr.open('POST', targetPHP+'?up=true', true);
			xhr.setRequestHeader('UP-FILENAME', file.name);
			xhr.setRequestHeader('UP-SIZE', file.size);
			xhr.setRequestHeader('UP-TYPE', file.type);
			xhr.send(file); 
			
			if (status) {
				document.getElementById(status).innerHTML = 'Loaded : 100%';
			}
			if (show) {
				var newFile  = document.createElement('div');
				newFile.innerHTML = 'Loaded : '+file.name+' size '+file.size+' B';
				document.getElementById(show).appendChild(newFile);
			}	
		}				
	}

	// Function drop file
	this.drop = function(event) {
		event.preventDefault();
	 	var dt = event.dataTransfer;
	 	var files = dt.files;
	 	for (var i = 0; i<files.length; i++) {
			var file = files[i];
			upload(file);
	 	}
		
	}

	this.filedraghover =function(e) {
		e.stopPropagation();
		e.preventDefault();
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}

	
	// The inclusion of the event listeners (DragOver and drop)

	this.uploadPlace =  document.getElementById(place);
	this.uploadPlace.addEventListener("dragover", this.filedraghover, true);
	this.uploadPlace.addEventListener("dragleave", this.filedraghover, true);
	this.uploadPlace.addEventListener("drop", this.drop, true); 
	this.uploadPlace.style.display = "block";

}

	