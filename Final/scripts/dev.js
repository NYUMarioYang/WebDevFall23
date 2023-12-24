function sendHttpRequest(method, url, data) {
    const options = {
        method: method,
        headers: data ? { 'Content-Type': 'application/json' } : {}
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    return fetch(url, options).then(handleResponse);
}

function handleResponse(response) {
    if (response.status >= 400) {
        return response.json().then(errorData => {
            const error = new Error('Something went wrong!');
            error.data = errorData;
            throw error;
        });
    }
    return response.json();
}

function addItem() {
    const date = document.getElementById('addDate').value;
    const wentToBed = document.getElementById('addWentToBed').value;
    const sleepDuration = document.getElementById('addSleepDuration').value;
    const sleepAfter = document.getElementById('addSleepAfter').value;
    const snoreTimes = document.getElementById('addSnoreTimes').value;

    sendHttpRequest('POST', 'http://localhost:3004/dailySleepData', { date, wentToBed, sleepDuration, sleepAfter, snoreTimes })
        .then(updateUI)
        .catch(logError);
}

function displayItems(itemsData) {
    const itemsContainer = document.getElementById('items');
    itemsContainer.innerHTML = '';

    itemsData.forEach(item => {
        itemsContainer.innerHTML += `<p>ID: ${item.id}, Date: ${item.date}, Went to Bed: ${item.wentToBed}, Sleep Duration: ${item.sleepDuration}, Minutes to Fall Asleep: ${item.sleepAfter}, Snore Times: ${item.snoreTimes}</p>`;
    });
}

async function modifyItem() {
    const id = document.getElementById('modifyId').value;

    const currentItem = await sendHttpRequest('GET', `http://localhost:3004/dailySleepData/${id}`).catch(logError);
    if (!currentItem) {
        console.error('Item not found');
        return;
    }

    const date = document.getElementById('modifyDate').value || currentItem.date;
    const wentToBed = document.getElementById('modifyWentToBed').value || currentItem.wentToBed;
    const sleepDuration = document.getElementById('modifySleepDuration').value || currentItem.sleepDuration;
    const sleepAfter = document.getElementById('modifySleepAfter').value || currentItem.sleepAfter;
    const snoreTimes = document.getElementById('modifySnoreTimes').value || currentItem.snoreTimes;

    sendHttpRequest('PUT', `http://localhost:3004/dailySleepData/${id}`, { date, wentToBed, sleepDuration, sleepAfter, snoreTimes })
        .then(updateUI)
        .catch(logError);
}

function updateUI() {
    console.log('Operation successful');
    fetchItems();
}

function logError(error) {
    console.error(error);
}

function fetchItems() {
    sendHttpRequest('GET', 'http://localhost:3004/dailySleepData')
        .then(displayItems)
        .catch(logError);
}

function removeItem() {
    const id = document.getElementById('removeId').value;
    sendHttpRequest('DELETE', `http://localhost:3004/dailySleepData/${id}`)
        .then(updateUI)
        .catch(logError);
}

async function removeItemWithoutUpdateUI(id) {
    try {
        await sendHttpRequest('DELETE', `http://localhost:3004/dailySleepData/${id}`);
    } catch (error) {
        logError(error);
    }
}

async function removeAllItems() {
    try {
        const itemsData = await sendHttpRequest('GET', 'http://localhost:3004/dailySleepData');
        for (const item of itemsData) {
            await removeItemWithoutUpdateUI(item.id);
        }
        updateUI();
    } catch (error) {
        logError(error);
    }
}

// furniture:
function toggleFurniture(id) {
    const checkbox = document.getElementById(`furniture-${id}`);
    const enabled = checkbox.checked;

    sendHttpRequest('PATCH', `http://localhost:3004/furnitures/${id}`, { enabled })
        .then(updateUI)
        .catch(logError);
}

function fetchFurniture() {
    sendHttpRequest('GET', 'http://localhost:3004/furnitures')
        .then(displayFurniture)
        .catch(logError);
}

function displayFurniture(furnitureData) {
    const furnitureContainer = document.getElementById('furniture');
    furnitureContainer.innerHTML = '';

    // Open the first row
    let rowContent = '<div class="row">';

    furnitureData.forEach((furniture, index) => {
        rowContent += `
            <div class="col-md-6">
                <div class="form-group">
                    <div class="custom-control custom-switch">
                        <input type="checkbox" class="custom-control-input" id="furniture-${furniture.id}" ${furniture.enabled ? 'checked' : ''} onchange="toggleFurniture(${furniture.id})">
                        <label class="custom-control-label" for="furniture-${furniture.id}">${furniture.name}</label>
                    </div>
                    <input type="number" class="form-control mb-2" id="furniture-x-${furniture.id}" placeholder="X Position" value="${furniture.xPos || 0}">
                    <input type="number" class="form-control mb-2" id="furniture-y-${furniture.id}" placeholder="Y Position" value="${furniture.yPos || 0}">
                    <button class="btn btn-primary btn-sm mb-2" onclick="updateFurniturePosition(${furniture.id})">Update Position</button>
                </div>
            </div>`;

        // Close and open a new row every two items
        if ((index + 1) % 2 === 0) {
            rowContent += '</div><div class="row">';
        }
    });

    // Close the last row
    rowContent += '</div>';

    furnitureContainer.innerHTML = rowContent;
}


function updateFurniturePosition(id) {
    const x = document.getElementById(`furniture-x-${id}`).value;
    const y = document.getElementById(`furniture-y-${id}`).value;

    // convert to int
    const xPos = parseInt(x);
    const yPos = parseInt(y);

    sendHttpRequest('PATCH', `http://localhost:3004/furnitures/${id}`, { xPos, yPos })
        .then(updateUI)
        .catch(logError);
}


document.addEventListener('DOMContentLoaded', function() {
    fetchItems();
    fetchFurniture();
});

