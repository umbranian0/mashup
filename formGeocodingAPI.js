
//google places api VAR
var service;
var infoWindow;

/* formGeocodingAPI.js */
var latitude= -2.4506291,longitude=-54.7009228;
var map;
var morada;
window.addEventListener('DOMContentLoaded', initApp );
//3 - vamos trazer a morada apartir do document, morada
var txtMorada ;

const APIKEY = '38QyfbsPQl76EVzRPO1vuRdVxGTejj3q';
var locationKey = '275484';

//var pesquisa;
// Inicializa a aplicação
function initApp()
{ 
	console.log( "Init App!! ");
	
	// Obter referência para o elemento <form> 
	var formCriarPedido = document.querySelector( 'form');
	
	// Definir a reacção ao evento 'submit' no formulário
	formCriarPedido.addEventListener('submit', realizarPedidoGeolocation);
	//3 - vamos trazer a morada apartir do document, morada
	txtMorada = document.getElementById('morada');
	}	


// Envia um pedido HTTP ao serviço de Geocoding, 
// com a morada introduzida pelo utilizador no formulário
function realizarPedidoGeolocation( evt )
{
	console.log("submeteste o formulario");

	//para a submissao automatica do formulario
	evt.preventDefault();
	
	//saber o valor da morada
	morada = txtMorada.value;
	
	console.log('morada' , morada);
	//4 - definir url ao pedido de geocoding 
	var urlGeocoding = "https://maps.googleapis.com/maps/api/geocode/json?address="+ morada;
	console.log('pedido',urlGeocoding );
	
	//class para construir objetos para fazer pedido ajax e vem em json
	//5 - criar e usar class xmlHttpRequest
	var xhr = new XMLHttpRequest();
	//6 - usar metodo de iniciar o pedido
	xhr.open('GET',urlGeocoding);
	// função executada quando a resposta chega
	xhr.addEventListener('load', tratarRespostaGeocoding);
	//para enviar e so mandar um send
	xhr.send();
	
	//pedirLocTempo();
	
}
function pedirLocTempo(){
	console.log('estas a pedir localizacao do TEmpo');
	var urlLoc ="http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey="
	+APIKEY+"&q="+latitude+","+longitude;

	var xhr = new XMLHttpRequest();
	xhr.open('GET',urlLoc);
	
	xhr.addEventListener('load',respostaLocationKey);
	xhr.send();

	
}

//vamos precisar da location key que vamos buscar ao
//http://dataservice.accuweather.com/locations/v1/cities/geoposition/search
function respostaLocationKey( ev ){
	console.log("estas a pedir a location key!!");
	var xhr = ev.target;
	var resposta = JSON.parse(xhr.responseText);
	//recebemos o objeto que contem a location key
	locationKey = resposta.Key;
	console.log(resposta);
	console.log(locationKey);
	
	pedirTempo();
}
//funcao para pedir o tempo 
function pedirTempo(  ){
	console.log("estas a pedir o tempo !!");
	
		//   http://dataservice.accuweather.com/currentconditions/v1/275484?apikey=APIKEY&metric=true&language=pt';
	var urlPedidoAccuWeather ="http://dataservice.accuweather.com/currentconditions/v1/" 
												+ locationKey + "?apikey=" + APIKEY + "&metric=true&language=pt";
												
	console.log( " pedido de tempo url : " + urlPedidoAccuWeather);
	//2º criar um pedido XMLHttpRequest para ter os daddos 
	var xhr = new XMLHttpRequest();
	//3º utilizar o xhr para para começar a tratar do tempo
	//utilizamos o metodo GET para trazer a informação necessaria
	//enviamos tambem o nosso URL Com O PEDIDO
	xhr.open('GET',urlPedidoAccuWeather);
	//4 º executamos quando a resposta chega
	xhr.addEventListener('load',mostrarTempo);
	//enviamos os dados
	xhr.send();
}
	
//funcao para mostrar o tempo
function mostrarTempo( ev ){
	console.log('chegou resposta do Mostrar tempo ');
	//5º traz o xhr anterior
	var xhr = ev.target;
	
	//vamos buscar o que precisaos ao JSON de resposta 
	var jsonResposta = JSON.parse(xhr.responseText);
	
	//trazer o tempo do json
	var jsonTempo = jsonResposta[0].Temperature.Metric.Value;
	var jsonIcon = jsonResposta[0].WeatherIcon;
	var jsonDesc = jsonResposta[0].WeatherText;
	//trazer os elementos do tempo do html
	var tempo = document.getElementById('temperatura');
	var desc = document.getElementById('descricao');
	// buscar o icon do html
	var icon = document.getElementById('iconTempo');
	//define o tempo no  html
	tempo.textContent = jsonTempo;
	desc.textContent = jsonDesc;
	//set do icon
	icon.setAttribute("src","https://developer.accuweather.com/sites/default/files/0"+jsonIcon+"-s.png");
	console.log(jsonIcon);
}
	
	 
	
// Tratamos da resposta do serviço de Geocoding do Google
function tratarRespostaGeocoding(evt)
{
	console.log( "Chegou a resposta do serviço Google Geocoding !");
	//7 - traz o XHR trazido de cima
	var xhr = evt.target;
	
	//alert(xhr.responseText);
	//usar Classe JAVA script para convirter para um obj. 
	//Texto para objeto JS = JSON.parse();
	//Objeto para Json = Json.Stringify
	var objResp = JSON.parse(xhr.responseText);
	//8- criar os atributos para a latitude ,longitude e nome
	latitude = objResp.results[0].geometry.location.lat;
	longitude = objResp.results[0].geometry.location.lng;

	var enderecoFormatado = objResp.results[0].formatted_address;
	//pesquisa = objResp.results[0].adress_components[0].short_name;
	//9- tratar os preencher  os campos
	//9.1 - trazer os campos do HTML que contem a lang, long,nome
	var campoLat = document.getElementById('latitude');
	var campoLong = document.getElementById('longitude');
	var campoNome = document.getElementById('endereco');
	//9.2 - preencher os campos html com os nossos dados trazidos com Json
	campoLat.textContent = latitude;
	campoLong.textContent = longitude;
	campoNome.textContent = enderecoFormatado;
	// confirma os dados
	console.log('latitude',latitude,'longitude',longitude,'nome ',enderecoFormatado);
	
	map.setCenter({lat: latitude, lng: longitude});

	//vamos pedir a location key
	pedirLocTempo();

	procurarLugares();

}

// This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&l">
	  
	var autocomplete;
    function initMap() {

		console.log("estas a iniciar o mapa");
          map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: {lat: latitude, lng: longitude}
		});
		infoWindow = new google.maps.InfoWindow();

		procurarLugares();

		var txtMorada = document.getElementById('morada');
		autocomplete = new google.maps.places.Autocomplete(txtMorada);

		autocomplete.addListener('place_changed', function() {
			console.log( 'autocomplete');
			
          var place = autocomplete.getPlace();
          if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
		}
		});
  
}
	

//Google places ----------------------------------------

function procurarLugares() {
	var localizacao = new google.maps.LatLng(latitude,longitude);

	var request = {
	  location: localizacao,
	  radius: '5000',
	  type: ['restaurant','bar','supermarket']
	};
  
	service = new google.maps.places.PlacesService(map);
	service.nearbySearch(request, callback);

}
function callback(results, status) {
		console.log("places",status);
		if (status == google.maps.places.PlacesServiceStatus.OK) {
		  for (var i = 0; i < results.length; i++) {
			var place = results[i];
			addMarker(results[i]);
		  }
		}
	  
  }
  function addMarker(place) {
	var marker = new google.maps.Marker({
	  map: map,
	  position: place.geometry.location,
	  icon: {
		url: 'https://developers.google.com/maps/documentation/javascript/images/circle.png',
		anchor: new google.maps.Point(10, 10),
		scaledSize: new google.maps.Size(10, 17)
	  }
	});
	google.maps.event.addListener(marker, 'click', function() {
		service.getDetails(place, function(result, status) {
			
		  if (status !== google.maps.places.PlacesServiceStatus.OK) {
			console.error(status);
			return;
		  }
		  infoWindow.setContent(result.name);
		  
		  infoWindow.open(map, marker);
		});
	  });
	
} 



