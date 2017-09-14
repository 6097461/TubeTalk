var socket = io.connect('http://192.168.0.23:3000');
var other = '';

function playAudio(src){
	var media = new Media(src, onPlaySuccess, onPlayError);	
	media.play();
}
function onPlaySuccess(){}
function onPlayError(error){}
socket.on('receive_me_message', function(name, msg, time){
	if ($('.switch-input-message').is(':checked')) {
		playAudio("/android_asset/www/sound/message.wav");
    }
	$('#chatlog').append('<li id = me>' + name + '</li>');
	$('#chatlog').append('<li id = mem>' + msg + '</li>');
	$('#chatlog').append('<li id = memtime>' + time + '</li>');
	$('#chatlog').scrollTop($('#chatlog')[0].scrollHeight);
});
socket.on('receive_other_message', function(name, msg, time){
    if ($('.switch-input-message').is(':checked')) {
		playAudio("/android_asset/www/sound/message.wav");
    }
	$('#chatlog').append('<li id = other>' + name + '</li>');
	$('#chatlog').append('<li id = otherm>' + msg + '</li>');
	$('#chatlog').append('<li id = othermtime>' + time + '</li>');
	$('#chatlog').scrollTop($('#chatlog')[0].scrollHeight);
});
socket.on('receive_me_wmessage', function(name, msg, time){
	if ($('.switch-input-whisper').is(':checked')) {
		playAudio("/android_asset/www/sound/message.wav");		
		navigator.notification.vibrate(100);
    }
	$('#chatlog').append('<li id = me>' + name + '</li>');
	$('#chatlog').append('<li id = mewm>' + msg + '</li>');
	$('#chatlog').append('<li id = memtime>' + time + '</li>');
	$('#chatlog').scrollTop($('#chatlog')[0].scrollHeight);
});
socket.on('receive_other_wmessage', function(name, msg, time){
	if ($('.switch-input-whisper').is(':checked')) {
		playAudio("/android_asset/www/sound/message.wav");		
		navigator.notification.vibrate(100);
    }
	$('#chatlog').append('<li id = other>' + name + '</li>');
	$('#chatlog').append('<li id = otherwm>' + msg + '</li>');
	$('#chatlog').append('<li id = othermtime>' + time + '</li>');
	$('#chatlog').scrollTop($('#chatlog')[0].scrollHeight);
});
socket.on('history_status', function(status){
        $('#chatlog').append('<li id=status>' + status + '</li>');
        $('#chatlog').scrollTop($('#chatlog')[0].scrollHeight);
});
socket.on('history_chat_m', function(name, msg,time){
        $('#chatlog').append('<li id = me>' + name + '</li>');
        $('#chatlog').append('<li id = mem>' + msg + '</li>');
        $('#chatlog').append('<li id = memtime>' + time + '</li>');
        $('#chatlog').scrollTop($('#chatlog')[0].scrollHeight);
});
socket.on('history_chat_o', function(name, msg, time){
        $('#chatlog').append('<li id = other>' + name + '</li>');
        $('#chatlog').append('<li id = otherm>' + msg + '</li>');
        $('#chatlog').append('<li id = othermtime>' + time + '</li>');
        $('#chatlog').scrollTop($('#chatlog')[0].scrollHeight);
});
socket.on('receive_me_image', function(name, msg, time){
	$('#chatlog').append('<li id = me>' + name + '</li>');
	$('#chatlog').append('<li id = memi><img id = mei src="' + msg + '"/></li>');
	$('#chatlog').append('<li id = memtime>' + time + '</li>');
	$('#chatlog').scrollTop($('#chatlog')[0].scrollHeight);
});
socket.on('receive_other_image', function(name, msg, time){
	if ($('.switch-input-message').is(':checked')) {
		playAudio("/android_asset/www/sound/message.wav");
    }
	$('#chatlog').append('<li id = other>' + name + '</li>');
	$('#chatlog').append('<li id = othermi><img id = otheri src="' + msg + '"/></li>');
	$('#chatlog').append('<li id = othermtime>' + time + '</li>');
	$('#chatlog').scrollTop($('#chatlog')[0].scrollHeight);
});
socket.on('receive_me_map', function(name, latitude, longitude, time){
	var l = "http://maps.googleapis.com/maps/api/staticmap?center=" + latitude  + "," + longitude + "&zoom=13&size=300x300&sensor=false";
	var msg = '위도 : ' + latitude + '° <br/> 경도 : ' + longitude + '°';
	$('#chatlog').append('<li id = me>' + name + '</li>');
	$('#chatlog').append('<li id = memi><img id = mei src="' + l + '"/></li>');
	$('#chatlog').append('<li id = mem>' + msg + '</li>');
	$('#chatlog').append('<li id = memtime>' + time + '</li>');
	$('#chatlog').scrollTop($('#chatlog')[0].scrollHeight);	
});
socket.on('receive_other_map', function(name, latitude, longitude, time){
	if ($('.switch-input-message').is(':checked')) {
		playAudio("/android_asset/www/sound/message.wav");
    }
	var l = "http://maps.googleapis.com/maps/api/staticmap?center=" + latitude  + "," + longitude + "&zoom=13&size=300x300&sensor=false";
	var msg = '위도 : ' + latitude + '° <br/> 경도 : ' + longitude + '°';
	$('#chatlog').append('<li id = other>' + name + '</li>');
	$('#chatlog').append('<li id = othermi><img id = otheri src="' + l + '"/></li>');
	$('#chatlog').append('<li id = otherm>' + msg + '</li>');
	$('#chatlog').append('<li id = othermtime>' + time + '</li>');
	$('#chatlog').scrollTop($('#chatlog')[0].scrollHeight);
});

$(document).ready(function(){
	$('.main_head').css("display", "none");
	$('.main').css("display", "none");
	$('.joinbody').css("display", "none");
	$('.set').css("display", "none");
	$('.setbar').css("display", "none");
        socket.on('connected', function(status, name){
			playAudio("/android_asset/www/sound/inout.wav");
            $('#chatlog').append('<li id=status>' + status + '</li>');
			var t = device.model;
			var x = device.version;
			var string = t + ' ' + x;
			$('.explain_device').text(string);
        });
        $('#chatbtn').prop('disabled', true);
        $('#now').css("display", "none");
        $('#chatlog').css('height', $(window).height() -90);
		$('#message').css('width', $(window).width() - 50 - $(window).width()/100*20);
        $(window).resize(function(){
                $('#chatlog').css('height', $(window).height() -90);
                $('#chatlog').css('width', $(window).width());
				$('#message').css('width', $(window).width() - 50 - $(window).width()/100*20);
        });
        $(".history").click(function() {
                socket.emit('history', $('#name').val());
                $('#chatlog').empty();
        });
	$('#pluspopup').css("display", "none");
    $('#plusbtn').click(function(){
        $('#pluspopup, #mask').css("display", "");
            $('#close').prop('disabled', true);
    });
    $('.plusclose').click(function(){
        $('#pluspopup, #mask').css("display", "none");
            $('#close').prop('disabled', true);
    });
});
socket.on('discon', function(status){
	playAudio("/android_asset/www/sound/inout.wav");
	$('#chatlog').append('<li id=status>' + status + '</li>');
});
socket.on('update', function(username, count){
        username = JSON.parse(username);
        $('#online').empty();
        $('#online').append('<ul>접속자<div id="setbtn"></div></ul>');
		$('#online').on('click', '#setbtn', function(){
			$('.main_head').css("display", "none");
			$('.main').css("display", "none");
			$('.setbar').css("display", "");
			$('.set').css("display", "");
		});
        for(var i=0 ; i< username.length ; i++)
                if($('#nickname').val == username[i])
                        $('#online').append('<li =onlineuserm>' + username[i] + '</li>');
                else
                        $('#online').append('<li id=onlineuser>' + username[i] + '</li>');
});
$('#message').keyup(function(){
        if($(this).val() != ''){
                $('#chatbtn').prop('disabled', false);
                if(other == ''){
                        socket.emit('now', $('#name').val());
                        return false;
                }         
        }
        if($(this).val() == ''){
                $('#chatbtn').prop('disabled', true);
                socket.emit('finish');
        }
});
$('#message').keypress(function(e){
        if((e.keyCode || e.which) == 13 && $(this).val() != ''){
                e.preventDefault();
                if(other == ''){
                        var time = getTimeStamp();
                        socket.emit('send message', $('#name').val(), $('#message').val(), time);
                        $('#message').val('');
                        $('#chatbtn').prop('disabled', true);
                        socket.emit('finish');
                        return false;
                }
                else {
                        var time = getTimeStamp();
                        socket.emit('whisper', $('#name').val(), $('#message').val(), other, time);
                        other = '';
                        $('#message').val('');
                        $('#chatbtn').prop('disabled', true);
                        socket.emit('finish');
                        return false;
                }             
        }
});
$('#chatbtn').click(function(){
	if($('#message').val() == '')
			$('#chatbtn').prop('disabled', true);
	if($('#message').val() != ''){
			$('#chatbtn').prop('disabled', false);
			if(other == ''){
				var time = getTimeStamp();
				socket.emit('send message', $('#name').val(), $('#message').val(), time);
				$('#message').val('');
				$('#chatbtn').prop('disabled', true);
				socket.emit('finish');
				return false;
			}
			else{
					var time = getTimeStamp();
					socket.emit('whisper', $('#name').val(), $('#message').val(), other, time);
					other = '';
					$('#message').val('');
					$('#chatbtn').prop('disabled', true);
					socket.emit('finish');
					return false;
			}
	}
});
$(".btn").click(function() {
        $("#online,.page_cover,html, #setbtn").addClass("open");
        window.location.hash = "#open";
        $('#online li').click(function(){
                other = $(this).text();
                        $("#online,.page_cover,html,#setbtn").removeClass("open");
        });
});
$('#call').click(function(){
	$('#pluspopup, #mask').css("display", "none");
	window.open('tel:', '_system');
	function placeCall(num) {
		if (window.cordova) {
			cordova.InAppBrowser.open('tel:' + num.replace(/\s/g,''), '_system');
		}
	}  	
});
function onSuccess(result){
  console.log("Success:"+result);
}
function onError(result) {
  console.log("Error:"+result);
}

$('#map').click(function(){

	$('#pluspopup, #mask').css("display", "none");
	getWeatherLocation();
});
function getWeatherLocation() {

    navigator.geolocation.getCurrentPosition
    (onWeatherSuccess, onWeatherError, { enableHighAccuracy: true });
	
	function onWeatherSuccess(position) {

    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;
    getWeather(Latitude, Longitude);
}
function onWeatherError(error) {
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}
function getWeather(latitude, longitude) {






 var RE = 6371.00877; // 지구 반경(km)
    var GRID = 5.0; // 격자 간격(km)
    var SLAT1 = 30.0; // 투영 위도1(degree)
    var SLAT2 = 60.0; // 투영 위도2(degree)
    var OLON = 126.0; // 기준점 경도(degree)
    var OLAT = 38.0; // 기준점 위도(degree)
    var XO = 43; // 기준점 X좌표(GRID)
    var YO = 136; // 기1준점 Y좌표(GRID)
    //
    // LCC DFS 좌표변환 ( code : "toXY"(위경도->좌표, v1:위도, v2:경도), "toLL"(좌표->위경도,v1:x, v2:y) )
    //
function dfs_xy_conv(code, v1, v2) {
    var DEGRAD = Math.PI / 180.0;
    var RADDEG = 180.0 / Math.PI;
 
    var re = RE / GRID;
    var slat1 = SLAT1 * DEGRAD;
    var slat2 = SLAT2 * DEGRAD;
    var olon = OLON * DEGRAD;
    var olat = OLAT * DEGRAD;
 
    var sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    var sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    var ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);
    var rs = {};
    if (code == "toXY") {
 
        rs['lat'] = v1;
        rs['lng'] = v2;
        var ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        var theta = v2 * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        rs['nx'] = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        rs['ny'] = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
    }
    else {
        rs['nx'] = v1;
        rs['ny'] = v2;
        var xn = v1 - XO;
        var yn = ro - v2 + YO;
        ra = Math.sqrt(xn * xn + yn * yn);
        if (sn < 0.0) - ra;
        var alat = Math.pow((re * sf / ra), (1.0 / sn));
        alat = 2.0 * Math.atan(alat) - Math.PI * 0.5;
 
        if (Math.abs(xn) <= 0.0) {
            theta = 0.0;
        }
        else {
            if (Math.abs(yn) <= 0.0) {
                theta = Math.PI * 0.5;
                if (xn < 0.0) - theta;
            }
            else theta = Math.atan2(xn, yn);
        }
        var alon = theta / sn + olon;
        rs['lat'] = alat * RADDEG;
        rs['lng'] = alon * RADDEG;
    }
    return rs;
}



function xml2jsonCurrentWth(nx, ny){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    console.log("time " + minutes)
 
    if(minutes < 30){
        // 30분보다 작으면 한시간 전 값
        hours = hours - 1;
        if(hours < 0){
            // 자정 이전은 전날로 계산
            today.setDate(today.getDate() - 1);
            dd = today.getDate();
            mm = today.getMonth()+1;
            yyyy = today.getFullYear();
            hours = 23;
        }
    }
    if(hours<10) {
        hours='0'+hours
    }
    if(mm<10) {
        mm='0'+mm
    }
    if(dd<10) {
        dd='0'+dd
    } 
    var _nx = nx,
    _ny = ny,
    apikey = "c2Upzg2FZyz%2F%2BB44%2BGYXG4BjpcHvJ%2FrOfnmfxxK4EmMlLRoVR22CLY%2F%2B6yGKkUoU6GdCNKZtBDyYwF0DOLdaeQ%3D%3D",
    today = yyyy+""+mm+""+dd,
    basetime = hours + "00",
    fileName = "http://newsky2.kma.go.kr/service/SecndSrtpdFrcstInfoService/ForecastGrib";
    fileName += "?ServiceKey=" + apikey;
    fileName += "&base_date=" + today;
    fileName += "&base_time=" + basetime;
    fileName += "&nx=" + _nx + "&ny=" + _ny;
    fileName += "&pageNo=1&numOfRows=6";
    fileName += "&_type=json";
 
    $.ajax({
        url: fileName,
        type: 'GET',
        cache: false,
        success: function(data) {
            var myXML = rplLine(data.responseText);
            var indexS = myXML.indexOf('"body":{"items":{'),
                indexE = myXML.indexOf("}]}"),
                result = myXML;
            var jsonObj = $.parseJSON('[' + result + ']'),
                rainsnow = jsonObj[0].response.body.items.item[0].obsrValue,
                sky = jsonObj[0].response.body.items.item[4].obsrValue,
                temp = jsonObj[0].response.body.items.item[5].obsrValue;
                var contentText = document.getElementById('content');
            contentText.innerHTML = "하늘 상태 : " + sky + " / 눈 비 상태 : " + rainsnow + " / 온도 : " + temp;
        },
        error:function(request,status,error){
            alert("다시 시도해주세요.\n" + "code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
        });
 
}

 
function rplLine(value){
    if (value != null && value != "") {
        return value.replace(/\n/g, "\\n");
    }else{
        return value;
    }



    // Get a free key at http://openweathermap.org/. Replace the "Your_Key_Here" string with that key.
    var OpenWeatherAppKey = "c2Upzg2FZyz%2F%2BB44%2BGYXG4BjpcHvJ%2FrOfnmfxxK4EmMlLRoVR22CLY%2F%2B6yGKkUoU6GdCNKZtBDyYwF0DOLdaeQ%3D%3D";

    var queryString =
      'http://api.openweathermap.org/data/2.5/weather?lat='
      + latitude + '&lon=' + longitude + '&appid=' + OpenWeatherAppKey + '&units=imperial';
    $.getJSON(queryString, function (results) {

        if (results.weather.length) {
alert('습도111');
            $.getJSON(queryString, function (results) {
alert('습도22222');
                if (results.weather.length) {


var obj=text(results.name);
obj=JSONtoString(obj);
alert(obj);
                    
                }

            });
        }
    }).fail(function () {
        console.log("error getting location");
    });
}
	

}




$('#camera').click(function(){
	$('#pluspopup, #mask').css("display", "none");
	takePicture();
});
$('#gallery').click(function(){
	$('#pluspopup, #mask').css("display", "none");
	getPicture();
});
function takePicture(){
	navigator.camera.getPicture(onCameraSuccess, onCameraFail, { 
		quality: 50,
		destinationType: Camera.DestinationType.DATA_URL,
		sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
		allowEdit: false,
		correctOrientation: true
	});
	function onCameraSuccess(imageData){
		imageData = "data:image/jpeg;base64," + imageData;
		var time = getTimeStamp();
		socket.emit('send image', $('#name').val(), imageData, time);
	}
	function onCameraFail(message){
		alert('Failed because: ' + message);
	}
}
function getPicture(){
	navigator.camera.getPicture(onCameraSuccess, onCameraFail, { 
		quality: 50,
		destinationType: Camera.DestinationType.DATA_URL,
		sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
		allowEdit: false,
		correctOrientation: true
	});
	function onCameraSuccess(imageData){
		imageData = "data:image/jpeg;base64," + imageData;
		var time = getTimeStamp();
		socket.emit('send image', $('#name').val(), imageData, time);
	}
	function onCameraFail(message){
		alert('Failed because: ' + message);
	}
}
window.onhashchange = function() {
	if(location.hash != "#open"){
		$("#online,.page_cover,html,#setbtn").removeClass("open");
		history.pushState('', document.title, window.location.pathname);
	}
};
socket.on('writing', function(name){
	var t = name + '님이 현재 내용을 입력중입니다.';
	$('#now').text(t);
	$('#now').css("display", "");
});
socket.on('finishm', function(){
    $('#now').css("display", "none");
});
socket.on('change name', function(name){
	$('#name').val(name);
	var e = $("#lemail").val();
	var n = $('#name').val();
	string = '이메일 : ' + e + '   닉네임 : ' + n;
	$('.explain_account').text(string);
	$("#lemail").empty();
	$("#lpass").empty();
});
function getTimeStamp() {
	var d = new Date();
	var s = leadingZeros(d.getHours(), 2) + ':' +
	leadingZeros(d.getMinutes(), 2);
	return s;
}
function leadingZeros(n, digits) {
	var zero = '';
	n = n.toString();
	if (n.length < digits) {
	for (i = 0; i < digits - n.length; i++)
		zero += '0';
	}
	return zero + n;
}
$('#login').click(function(){
	var email = $("#lemail").val();
	var password = $("#lpass").val();
	socket.emit('login', email, password);
});

$("#joinp").click(function(){
	$('.loginbody').css("display", "none");
	$('.joinbody').css("display", "");
});
$("#loginp").click(function(){
	$('.joinbody').css("display", "none");
	$('.loginbody').css("display", "");
});
$("#join").click(function(){
	var email = $('#jemail').val();
	var nickname = $('#jnickname').val();
	var pass = $('#jpass').val();
	var passcon = $('#jpasscon').val();
	$('#jemail').empty();
	$('#jnickname').empty();
	$('#jpass').empty();
	$('#jpasscon').empty();
	socket.emit('join', email, nickname, pass, passcon);
});
socket.on('sucjoin', function(){
	$('.joinbody').css("display", "none");
	$('.loginbody').css("display", "");
});
socket.on('suclogin', function(){
	socket.emit('ex');
	$('header').css("display", "none");
	$('.loginbody').css("display", "none");
	$('.main').css("display", "");
	$('.main_head').css("display", "");
});
socket.on('failloginjoin', function(){
	alert('먼저 회원가입을 하세요');
});
socket.on('failloginname', function(){
	alert('이메일 계정이 존재하지 않습니다');	
});
socket.on('failloginpass', function(){
	alert('비밀번호가 일치하지 않습니다');
});
socket.on('failjoinemail', function(){
	alert('이미 존재하는 이메일 계정입니다');
});
socket.on('failjoinname', function(){
	alert('이미 존재하는 닉네임입니다');
});
socket.on('failjoinpass', function(){
	alert('비밀번호가 다르게 입력되었습니다.');
});
$('.back').click(function(){
	$('.main_head').css("display", "");
	$('.main').css("display", "");
	$('.setbar').css("display", "none");
	$('.set').css("display", "none");
});
