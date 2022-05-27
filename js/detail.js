const detailCard = document.querySelector(".detail-card");
var id = location.search.split("?id=");
var selectedId = id[1];
async function showDetail(){
	await fetch(`https://amazing-events.herokuapp.com/api/events/${selectedId}`)
		.then(response => response.json())
		.then(json =>{
			let event = json.response;
			detailCard.innerHTML = ` <img src="${event.image}" alt="" class="detail-image">
                        <div class="detail-text p-2 shadow">
                            <h4>${event.name}</h4>
                            <p><strong>Date: </strong > ${event.date}</p>
                            <p><strong>Description: </strong > ${event.description}</p>
                            <p><strong>Category: </strong > ${event.category}</p>
                            <p><strong>Place: </strong > ${event.place}</p>
                            <p><strong>Capacity: </strong > ${event.capacity}</p>
                            <p><strong>Assistance or estimate: </strong>${event.assistance}</p>
                            <p><strong>price: </strong > ${event.price}</p>
                        </div>`;
		});
}
showDetail();


