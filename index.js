var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
		var size = 15;
		var count = 0;
		var chatlog = document.getElementById("chatlog");
		var pluspopup = document.getElementById("pluspopup");
		var mask = document.getElementById("mask");
		var btn = document.getElementById("btn");
		var set = document.getElementById("set");
		var setbar = document.getElementById("setbar");
		var main = document.getElementById("main");
		var mainhead = document.getElementById("main_head");
		
		document.addEventListener("volumeupbutton", volumeup, false);
		document.addEventListener("volumedownbutton", volumedown, false);
		document.addEventListener('backbutton', function (evt) {
			count++;
			if(pluspopup.style.display == ''){
				pluspopup.style.display = 'none';
				mask.style.display = 'none';
				count = 0;
			}
			else if(location.hash == "#open"){
				history.pushState('', document.title, window.location.pathname);
				$("#online,.page_cover,html,#setbtn").removeClass("open");
				count = 0;
			}
			else if(count == 1 && pluspopup.style.display == 'none'){
				alert("한번 더 버튼을 누르면 종료됩니다.");
			}
			else if(count == 2 && pluspopup.style.display == 'none'){
				navigator.app.exitApp();
			}	
		}, false);
		document.addEventListener('menubutton', function() {
			alert("menu button");
			pluspopup.style.display = '';
			mask.style.display = '';
		}, false);
		
		window.addEventListener('batterystatus', function(status){
			if(status.isPlugged == true){
				chatlog.style.backgroundImage = "url('image/plugged.png')";
				chatlog.style.backgroundRepeat = "no-repeat";
				chatlog.style.backgroundPosition = "center";
				chatlog.style.backgroundSize = "cover";
			}
			else{
				if(status.level >= 80){
					chatlog.style.backgroundImage = "url('image/80-100.png')";
					chatlog.style.backgroundRepeat = "no-repeat";
					chatlog.style.backgroundPosition = "center";
					chatlog.style.backgroundSize = "cover";
				}
				else if(status.level >= 50 && status.level < 80){
					chatlog.style.backgroundImage = "url('image/50-80.png')";
					chatlog.style.backgroundRepeat = "no-repeat";
					chatlog.style.backgroundPosition = "center";
					chatlog.style.backgroundSize = "cover";
				}
				else if(status.level >= 30 && status.level < 50){
					chatlog.style.backgroundImage = "url('image/30-50.png')";
					chatlog.style.backgroundRepeat = "no-repeat";
					chatlog.style.backgroundPosition = "center";
					chatlog.style.backgroundSize = "cover";
				}
				else if(status.level >= 15 && status.level < 30){
					chatlog.style.backgroundImage = "url('image/15-30.png')";
					chatlog.style.backgroundRepeat = "no-repeat";
					chatlog.style.backgroundPosition = "center";
					chatlog.style.backgroundSize = "cover";
				}
				else if(status.level >= 0 && status.level < 15){
					chatlog.style.backgroundImage = "url('image/0-15.png')";
					chatlog.style.backgroundRepeat = "no-repeat";
					chatlog.style.backgroundPosition = "center";
					chatlog.style.backgroundSize = "cover";
				}
			}			
		},false);
		$('.switch').click(function(){
			if($('.switch-input-back').prop('checked')) {
				if(status.isPlugged == true){
					chatlog.style.backgroundImage = "url('image/80-100.png')";
					chatlog.style.backgroundRepeat = "no-repeat";
					chatlog.style.backgroundPosition = "center";
					chatlog.style.backgroundSize = "cover";
				}
				else{
					if(status.level >= 80){
						chatlog.style.backgroundImage = "url('image/80-100.png')";
						chatlog.style.backgroundRepeat = "no-repeat";
						chatlog.style.backgroundPosition = "center";
						chatlog.style.backgroundSize = "cover";					}
					else if(status.level >= 50 && status.level < 80){
						chatlog.style.background = "url('image/50-80.png')";
						chatlog.style.backgroundRepeat = "no-repeat";
						chatlog.style.backgroundPosition = "center";
						chatlog.style.backgroundSize = "cover";					}
					else if(status.level >= 30 && status.level < 50){
						chatlog.style.backgroundImage = "url('image/30-50.png')";
						chatlog.style.backgroundRepeat = "no-repeat";
						chatlog.style.backgroundPosition = "center";
						chatlog.style.backgroundSize = "cover";					}
					else if(status.level >= 15 && status.level < 30){
						chatlog.style.backgroundImage = "url('image/15-30.png')";
						chatlog.style.backgroundRepeat = "no-repeat";
						chatlog.style.backgroundPosition = "center";
						chatlog.style.backgroundSize = "cover";					}
					else if(status.level >= 0 && status.level < 15){
						chatlog.style.backgroundImage = "url('image/0-15.png')";
						chatlog.style.backgroundRepeat = "no-repeat";
						chatlog.style.backgroundPosition = "center";
						chatlog.style.backgroundSize = "cover";					
					}
				}
			}
			else{
				chatlog.style.backgroundImage = "url('image/img.png')";
				chatlog.style.backgroundRepeat = "no-repeat";
				chatlog.style.backgroundPosition = "center";
				chatlog.style.backgroundSize = "cover";
			}
			if($('.switch-input-font').prop('checked')) {
				document.addEventListener("volumeupbutton", volumeup, false);
				document.addEventListener("volumedownbutton", volumedown, false);
			}
			else{
				document.removeEventListener("volumeupbutton", volumeup, false);
				document.removeEventListener("volumedownbutton", volumedown, false);
			}
		});
		function volumeup(evt){
			size = size + 3;
			if(size > 24){
				size = 24;
			}
			var t = size + 'px';
			chatlog.style.fontSize = t;
		}
		function volumedown(evt){
			size = size - 2;
			if(size < 10){
				size = 10;
			}
			var t = size + 'px';
			chatlog.style.fontSize = t;
		}	
    },
    receivedEvent: function(id) {
       //navigator.notification.beep(1);
    }
};

app.initialize();