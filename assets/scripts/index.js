async function getEvents() {
    const spreadsheetId = '1VF6uC8Cqy47H6jLwlqoFNc0edbyCi1UZNeVV_9RiL50'
    const apiKey = 'AIzaSyA8JbdPVI3SzPGpPdyLAbXWlAypOuOgbN4';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/?key=${apiKey}&includeGridData=true`;
    const result = await fetch(url)
    const { sheets } = await result.json();
    const firstSheet = sheets[0];
    const data = firstSheet.data[0].rowData
        .filter((_, index) => index !== 0) // Mulai dari index 1 (menghindari nama kolom)
        .map(row => {
            const { values } = row;
            return {
                title: values[0].formattedValue,
                datetime: values[1].formattedValue,
                registrationLink: values[2].formattedValue,
                imageUrl: values[3].formattedValue
            }
        })
    return data;
}

function eventItemTemplate(event) {
    return (
        `<article class="mt-4 flex flex-col sm:flex-row rounded-lg border-2 overflow-hidden">
            <img src="${event.imageUrl}" alt="${event.title}" class="w-full sm:w-52">
            <div class="p-4">
                <h1 class="font-bold text-xl leading-6">${event.title}</h1>
                <p class="mt-2 text-gray-600">${event.datetime}</p>
                <p class="mt-2">
                    <a href="http://${event.registrationLink}" target="_blank" rel="noopener noreferrer" class="font-bold text-blue-800">${event.registrationLink}</a>
                </p>
            </div>
        </article>`)
}

function eventListTemplate(events) {
    return events.map(event => eventItemTemplate(event)).join('')
}

async function renderEvents() {
    const eventsDOM = document.getElementById('events');
    try {
        const events = await getEvents();
        eventsDOM.innerHTML = eventListTemplate(events);
    } catch (error) {
        eventsDOM.innerHTML = error
    }
}

function renderHTML() {
    renderEvents();
}

renderHTML();