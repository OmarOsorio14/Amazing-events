const cardsHtml = document.querySelector(".cards");
const title = document.querySelector(".title-text");
const categoriesHtml = document.querySelector(".categories");
var cards;
var detailPath;
var checkboxSelected = [];
var checkbox;

var textSearch = "";
async function getData(){
	let Fetchevents;
	let FetchcurrentDate;
	await fetch("https://amazing-events.herokuapp.com/api/events")
		.then(response => response.json())
		.then(json =>{
			Fetchevents = json.events;
			FetchcurrentDate = json.currentDate;
			switch (title.textContent) {
			case "Home": {
				cards = Fetchevents;
				detailPath = "./views/detail.html";
			}
				break;
			case "Upcoming Events":{
				cards = Fetchevents.filter(event => event.date > FetchcurrentDate);
				detailPath = "./detail.html";
			}
                        
				break;
			case "Past events":{
				cards = Fetchevents.filter(event => event.date < FetchcurrentDate);
				detailPath = "./detail.html";
			}
				break;
			default:
				break;
			}
			showCards(cards,detailPath);
			showCategories(cards);
			checkbox = document.querySelectorAll("input[type=checkbox]");
			checkbox.forEach(check => check.addEventListener("click", (event)=> {
				var checked = event.target.checked;
				if (checked) { 
					checkboxSelected.push(event.target.value);
					filterCards();
				} else {
					checkboxSelected = checkboxSelected.filter(uncheck => uncheck !== event.target.value);
					filterCards();
				}
			}));
		} );
	
}
getData();

function showCards(events, ruta){
	cardsHtml.innerHTML = "";
	for (const card of events){
		cardsHtml.innerHTML += 
        `<div class="card col-lg-3 col-md-4 col-xs-6">
            <img src="${card.image}">
            <div class="card-body">
                <h5 class="card-title">${card.name}</h5>
                <p class="card-text">${card.description}</p>
                <p class="card-text">${card.date}</p>
                <div class="d-flex justify-content-around align-items-center">
                    <strong>price $${card.price}</strong>
                    <a href="${ruta}?id=${card._id}" class="see-more btn btn-primary">See more</a>
                </div>
            </div>
        </div>`; 
	}
}

function showCategories(events) {
	let categories = events.map(e => e.category);
	categories = categories.filter((category,index) => categories.indexOf(category) === index);
	categories.forEach(category => {
		categoriesHtml.innerHTML += `
		<div class=" mx-3 form-check">
			<input class="form-check-input" type="checkbox" value="${category}" id="${category}">
			<label class="form-check-label" for="${category}">${category}</label>
		</div>
		`;
	});
}

function cleanFilters(){
	textSearch = "";
	inputSearch.value = "";
	checkboxSelected = [];
	try {
		checkbox.forEach( element => element.checked = false);
		showCards(cards,detailPath);
	}catch{
		console.log("waiting for data...");
	}
	
}

function filterCards() {

	let data = [];
	if (checkboxSelected.length > 0 && textSearch !== "") {
		checkboxSelected.map(category => {
			data.push(...cards.filter(event => event.name.toLowerCase().includes(textSearch.trim().toLowerCase())  &&
                event.category == category));
		});
	}
	else if (checkboxSelected.length > 0 && textSearch === "") {
		checkboxSelected.map(categoty => data.push(...cards.filter(event => event.category == categoty)));
	}
	else if (checkboxSelected.length == 0 && textSearch !== "") {
		data.push(...cards.filter(event => event.name.toLowerCase().includes(textSearch.trim().toLowerCase())));
	}
	else data.push(...cards);

	showCards(data,detailPath);
	if(data.length == 0){
		cardsHtml.innerHTML = `<div class="alert alert-danger" role="alert">
								Event not found
							</div>`;
	}
}

var inputSearch = document.getElementById("search");
inputSearch.addEventListener("keyup", (event) => {
	textSearch = event.target.value;
	filterCards();
});

var clean = document.querySelector(".clean");
clean.addEventListener("click", ()=> {
	cleanFilters();
});

window.onload = function() {
	cleanFilters();
};




