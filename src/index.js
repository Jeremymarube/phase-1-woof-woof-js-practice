// DOM elements
const dogBar = document.getElementById('dog-bar')
const dogInfo = document.getElementById('dog-info')
const filterButton = document.getElementById('filter-button')

let filterOn = false
let allPups = []

// Fetch all pups from server
function fetchPups() {
  fetch('http://localhost:3000/pups')
    .then(res => res.json())
    .then(pups => {
      allPups = pups
      renderDogBar()
    })
}

// Render dog bar with (filtered) pups
function renderDogBar() {
  dogBar.innerHTML = ''

  // Filter pups if filter is on
  const pupsToShow = filterOn ? allPups.filter(pup => pup.isGoodDog) : allPups

  pupsToShow.forEach(pup => {
    const span = document.createElement('span')
    span.textContent = pup.name
    span.addEventListener('click', () => showPupInfo(pup))
    dogBar.appendChild(span)
  })
}

// Show detailed info about a pup
function showPupInfo(pup) {
  dogInfo.innerHTML = '' // Clear previous info

  const img = document.createElement('img')
  img.src = pup.image

  const h2 = document.createElement('h2')
  h2.textContent = pup.name

  const button = document.createElement('button')
  button.textContent = pup.isGoodDog ? "Good Dog!" : "Bad Dog!"
  button.addEventListener('click', () => toggleGoodDog(pup, button))

  dogInfo.append(img, h2, button)
}

// Toggle good dog status and update server
function toggleGoodDog(pup, button) {
  const newStatus = !pup.isGoodDog

  fetch(`http://localhost:3000/pups/${pup.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isGoodDog: newStatus })
  })
  .then(res => res.json())
  .then(updatedPup => {
    pup.isGoodDog = updatedPup.isGoodDog
    button.textContent = updatedPup.isGoodDog ? "Good Dog!" : "Bad Dog!"
    // Re-render dog bar if filter is on, to update displayed pups
    if (filterOn) renderDogBar()
  })
}

// Setup filter button click event
filterButton.addEventListener('click', () => {
  filterOn = !filterOn
  filterButton.textContent = `Filter good dogs: ${filterOn ? 'ON' : 'OFF'}`
  renderDogBar()
})

// Initial fetch and render
fetchPups()
