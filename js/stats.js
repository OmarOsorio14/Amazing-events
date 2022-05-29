let attendenceTable = document.getElementById("attendence-table");
let upcomingEventsTable = document.getElementById("upcoming-events-statistics-table");
let pastEventsTable = document.getElementById("past-events-statistics-table");

const f = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	minimumFractionDigits:2
});
async function putDataTable(){
	let Fetchevents;
	let FetchcurrentDate;
	await fetch("https://amazing-events.herokuapp.com/api/events")
		.then(response => response.json())
		.then(json =>{
			Fetchevents = json.events;
			FetchcurrentDate = json.currentDate;
			let upcomingEvents = Fetchevents.filter(event => event.date > FetchcurrentDate);
			let pastEvents = Fetchevents.filter(event => event.date < FetchcurrentDate);
			let attendancePercentage = getSortAttendancePercentage(pastEvents);
			let LargerCapacities = getLargerCapacity(Fetchevents);
			for (let i = 0; i < 3; i++) {
				fillAttendenceTable(attendancePercentage[0+i],attendancePercentage[attendancePercentage.length - 1-i], LargerCapacities[i]);	
			}
			let categories = getCategories(Fetchevents);
	
			upcomingEventsTable.innerHTML += fillTableByCategory(upcomingEvents, categories);
			pastEventsTable.innerHTML += fillTableByCategory(pastEvents, categories);

		});
}
putDataTable();

function getSortAttendancePercentage(array){
	let attendancePercentage = array.map(event => {
		return {
			name:event.name,
			percentage: (event.assistance/event.capacity)*100 
		};
	});
	let organized = attendancePercentage.sort( (a, b) => a.percentage - b.percentage);
	return organized;
}
function getLargerCapacity(array){
	let capacities = array.map(event =>{ return{
		capacity:event.capacity,
		name:event.name
	};
	});
	let organized = capacities.sort( (a, b) => a.capacity - b.capacity);
	return [organized[organized.length-1],organized[organized.length-2],organized[organized.length-3]];
	// I return three because i want to show the 3 largest events by capacity
}
function fillAttendenceTable(min, max, larger){
	attendenceTable.innerHTML += `<tr>
									<td>${max.name} with ${max.percentage.toFixed(2)}%</td>
									<td>${min.name} with ${min.percentage.toFixed(2)}%</td>
									<td>${larger.name} with ${larger.capacity} of capacity</td>
								</tr>`;
}

function fillTableByCategory(array, categories){
	let templateHtml = "";
	categories.forEach( category => {
		let eventsByCategory = array.filter(event => event.category == category);
		let revenues = 0;
		let averageAssistance = 0;
		let cont = 0;
		if(eventsByCategory.length != 0){
			eventsByCategory.forEach( event =>{
				let capacities = 0;
				let attendence = 0;
				cont++;
				revenues += event.estimate ? event.price * event.estimate : event.price * event.assistance;
				attendence += event.estimate ? event.estimate : event.assistance;
				capacities += event.capacity;
				averageAssistance += (attendence/capacities)*100;
			});
			templateHtml += `<tr>
			<td>${category}</td>
			<td>${f.format(revenues/cont)}</td>
			<td>${parseInt((averageAssistance/cont) * 100, 10) / 100}%</td>
		</tr>
`;
		}
	
	});
	return templateHtml;
}

function getCategories(events) {
	let categories = events.map(e => e.category);
	return categories.filter((category,index) => categories.indexOf(category) === index);
}


