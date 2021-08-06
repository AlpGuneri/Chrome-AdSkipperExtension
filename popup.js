let firstSwitch = document.getElementById('switch');
let firstCheckBox = document.getElementById('toggle-switch');

let secondSwitch = document.getElementById('skip-switch');
let secondSwitchContainer = document.getElementsByClassName('skip-switch-container')[0];
let secondCheckBox = document.getElementById('toggle-skip-switch');

let switchInfo = document.querySelector('.switch-info');
let skipInfo = document.querySelector('.skip-info');
let debug = document.getElementById('debug');

let firstSwitchOn = false;
let secondSwitchOn = false;
let skipMode;

chrome.storage.sync.get('skippingMode', (data) => {
    skipMode = data.skippingMode;
    prepareDocument();
    addHandlers();
});

let prepareDocument = function() {
    switch (skipMode) {
        case 'auto':
            firstCheckBox.toggleAttribute('checked');
            firstSwitchOn = true;
            secondCheckBox.toggleAttribute('checked');
            secondSwitchOn = true;
            switchInfo.textContent = 'AdSkipper is currently turned on.';
            skipInfo.textContent = 'Skipping mode is set to: Automatic';
            break;
        case 'manual':
            firstCheckBox.toggleAttribute('checked');
            firstSwitchOn = true;
            switchInfo.textContent = 'AdSkipper is currently turned on.';
            skipInfo.textContent = 'Skipping mode is set to: Manual';
            break;
        case 'off':
            secondSwitchContainer.toggleAttribute('hidden');
            break;        
    }
}

let addHandlers = function() {
    firstCheckBox.onclick = function() {
        // If the first switch was on and the user turns it off.
        firstCheckBox.toggleAttribute('checked');
        if (firstSwitchOn) {
            secondSwitchContainer.toggleAttribute('hidden');
            firstSwitchOn = false;
            skipInfo.textContent = '';
            switchInfo.textContent = 'AdSkipper is currently turned off.';
            skipMode = 'off';
        } else {
            secondSwitchContainer.toggleAttribute('hidden');
            firstSwitchOn = true;
            switchInfo.textContent = 'AdSkipper is currently turned on.';
            if (secondSwitchOn) {
                skipInfo.textContent = 'Skipping mode is set to: Automatic';
                skipMode = 'auto';
            } else {
                skipInfo.textContent = 'Skipping mode is set to: Manual';
                skipMode = 'manual';
            }
        }
    }

    secondCheckBox.onclick = function() {
        // If the skipping mode was set to automatic
        secondCheckBox.toggleAttribute('checked');
        if (secondSwitchOn) {
            skipInfo.textContent = 'Skipping mode is set to: Manual';
            skipMode = 'manual';
            secondSwitchOn = false;
        } else {
            skipInfo.textContent = 'Skipping mode is set to: Automatic';
            skipMode = 'auto';
            secondSwitchOn = true;
        }
    }
}

// When the popup is closed, save the user's choice and sync the storage
chrome.windows.onFocusChanged.addListener(function() {
    chrome.storage.sync.set({skippingMode: skipMode});
});