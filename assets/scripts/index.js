async function getEvents() {
    const spreadsheetId = '1VF6uC8Cqy47H6jLwlqoFNc0edbyCi1UZNeVV_9RiL50'
    const apiKey = 'AIzaSyA8JbdPVI3SzPGpPdyLAbXWlAypOuOgbN4';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/?key=${apiKey}&includeGridData=true`;
    const result = await fetch(url)
    const { sheets } = await result.json();
    const eventSheet = sheets[0];
    const data = eventSheet.data[0].rowData
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
        `<article class="flex flex-col sm:flex-row rounded-lg border-2 overflow-hidden">
            <img src="${event.imageUrl}" alt="${event.title}" class="w-full sm:w-52">
            <div class="p-4">
                <h3 class="font-bold text-lg leading-6">${event.title}</h3>
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

function mediumItemTemplate(article) {
    return (
        `<a href="${article.link}" class="border-2 rounded-lg overflow-hidden flex flex-col hover:border-blue-500 focus:border-blue-500">
            <img src="${article.thumbnail}" alt="${article.title}">
            <div class="py-3 px-4 flex-1 flex flex-col justify-between">
                <h3 class="font-bold leading-5">${article.title}</h3>
                <p class="mt-2 text-xs text-gray-600">${article.author}</p>
            </div>
        </a>`
    )
}

async function getMediumStories() {
    const mediumRssFeed = "https://medium.com/feed/google-developer-student-club-universitas-islam";
    const url = new URL("https://api.rss2json.com/v1/api.json");
    url.search = new URLSearchParams({
        rss_url: mediumRssFeed,
    })
    const result = await fetch(url);
    const data = await result.json();
    return data;
}

async function renderMediumStories() {
    const mediumDOM = document.getElementById('medium');
    try {
        const { items } = await getMediumStories();
        mediumDOM.innerHTML = items.map(article => mediumItemTemplate(article)).join('');
    } catch (error) {
        mediumDOM.innerHTML = error
    }
}

function memberTemplate(member) {
    return (`
        <li class="rounded-lg border-2 p-4 flex">
            <div>
            <img
                src="${member.avatar_url ? member.avatar_url : `https://www.gravatar.com/avatar/${member.nama}?d=retro&f=y`}"
                alt="${member.nama}"
                class="w-10 h-10 object-cover rounded-full"
            >
            </div>
            <div class="flex-1 ml-4">
            <h3 class="font-bold">
                ${member.nama}
            </h3>
            <p class="text-sm text-gray-500">
                ${member.jurusan}, ${member.angkatan}
            </p>
            <div class="mt-1">
                <a href="${member.github_url}" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-github fa-lg text-black"></i>
                </a>
                <a href="${member.linkedin_url}" target="_blank" rel="noopener noreferrer">
                    <i class="ml-1 fab fa-linkedin fa-lg text-blue-500"></i>
                </a>
            </div>
            </div>
        </li>
    `)
}

async function getMembers() {
    const res = await fetch('https://gdscuii.github.io/members/members.json');
    const { members } = await res.json()
    return members;
}

async function renderMembers() {
    const membersDOM = document.getElementById('members-list');
    try {
        const members = await getMembers();
        membersDOM.innerHTML = members.map(member => memberTemplate(member)).join('');
    } catch (error) {
        membersDOM.innerHTML = error
    }
}

function renderHTML() {
    renderEvents();
    renderMediumStories();
    renderMembers();
}

renderHTML();