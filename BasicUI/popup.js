let powerSwitch = document.getElementById('switch');
let checkBox = document.getElementById('toggle-switch');

let skipSwitch = document.getElementById('skip-switch');
let skipCheckBox = document.getElementById('toggle-skip-switch');

let switchInfo = document.querySelector('.switch-info');
let skipInfo = document.querySelector('.skip-info');
let debug = document.getElementById('debug');

chrome.storage.sync.get('skippingMode', (data) => {
    let skipMode = data.skippingMode;
    prepareDocument(skipMode);
});

let isTurnedOff = function(element) {
    let isChecked = element.getAttribute('checked');
    if (isChecked !== null) {
        return false;
    }
    return true;
}

let isDisabled = function(element) {
    let isDisabled = element.getAttribute('disabled');
    if (isDisabled !== null) {
        return true;
    }
    return false;
}

let prepareButtons = function(skipMode) {
    debug.textContent = 'Skip mode: ' + skipMode;
    switch(skipMode) {
        case 'off':
            switchInfo.textContent = 'AdSkipper is currently turned off.';
            skipInfo.textContent = '';
            if (!isTurnedOff(checkBox)) {
                // powerSwitch.click();
                checkBox.removeAttribute('checked');
            }
            if (!isTurnedOff(skipCheckBox)) {
                // skipSwitch.click();
                skipCheckBox.removeAttribute('checked');
            }
            if (!isDisabled(skipCheckBox)) {
                skipCheckBox.setAttribute('disabled', '');
                skipCheckBox.disabled = true;
            }
            break;
        case 'auto':
            switchInfo.textContent = 'AdSkipper is currently turned on.';
            skipInfo.textContent = 'Skipping mode set to: Automatic ';
            if (isTurnedOff(checkBox)) {
                // powerSwitch.click();
                checkBox.setAttribute('checked', '');
            }
            if (isTurnedOff(skipCheckBox)) {
                // skipSwitch.click();
                skipCheckBox.setAttribute('checked', '');
            }
            if (isDisabled(skipCheckBox)) {
                skipCheckBox.removeAttribute('disabled');
                skipCheckBox.disabled = false;
            }
            break;
        case 'manual':
            switchInfo.textContent = 'AdSkipper is currently turned on.';
            skipInfo.textContent = 'Skipping mode set to: Manual ';
            if (isTurnedOff(checkBox)) {
                // powerSwitch.click();
                checkBox.setAttribute('checked', '');
            }
            if (!isTurnedOff(skipCheckBox)) {
                // skipSwitch.click();
                skipCheckBox.removeAttribute('checked');
            }
            if (isDisabled(skipCheckBox)) {
                skipCheckBox.removeAttribute('disabled');
                skipCheckBox.disabled = false;
            }
            break;        
    }
}

let prepareDocument = function(skipMode) {
    prepareButtons(skipMode);
    let lastChoice = skipMode;

    powerSwitch.onclick = function() {
        debug.textContent = lastChoice;
        if (lastChoice !== 'off') {
            chrome.storage.sync.set({skippingMode: 'off'});
            switchInfo.textContent = 'AdSkipper is currently turned off.';
            skipInfo.textContent = '';
            checkBox.removeAttribute('checked');
            skipCheckBox.removeAttribute('checked');
            skipCheckBox.setAttribute('disabled', '');
            skipCheckBox.disabled = true;
            lastChoice = 'off';
        } else {
            chrome.storage.sync.set({skippingMode: 'auto'});
            switchInfo.textContent = 'AdSkipper is currently turned on.';
            skipInfo.textContent = 'Skipping mode set to: Automatic ';
            checkBox.setAttribute('checked', '');
            skipCheckBox.setAttribute('checked', '');
            skipCheckBox.removeAttribute('disabled');
            skipCheckBox.disabled = false;
            lastChoice = 'auto';
        }
    }

    skipSwitch.onclick = function() {
        debug.textContent = lastChoice;
        if (lastChoice !== 'manual') {
            chrome.storage.sync.set({skippingMode: 'manual'});
            switchInfo.textContent = 'AdSkipper is currently turned on.';
            skipInfo.textContent = 'Skipping mode set to: Manual ';
            checkBox.setAttribute('checked', '');
            skipCheckBox.removeAttribute('checked');
            skipCheckBox.removeAttribute('disabled');
            skipCheckBox.disabled = false;
            lastChoice = 'manual';
        } else {
            chrome.storage.sync.set({skippingMode: 'auto'});
            switchInfo.textContent = 'AdSkipper is currently turned on.';
            skipInfo.textContent = 'Skipping mode set to: Automatic ';
            checkBox.setAttribute('checked', '');
            skipCheckBox.setAttribute('checked', '');
            skipCheckBox.removeAttribute('disabled');
            skipCheckBox.disabled = false;
            lastChoice = 'auto';
        }
    }
}