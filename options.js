let select = document.getElementById('mode');
let selection = document.getElementById('selection');

let skipMode;
chrome.storage.sync.get('skippingMode', (data) => {
    skipMode = data.skippingMode;
    giveInfo(skipMode);
    select.value = skipMode;
    select.onchange = function() {
        let selected = select.value;
        giveInfo(selected); 
        chrome.storage.sync.set({skippingMode: selected});
    }
});

let giveInfo = function(selected) {
    switch (selected) {
        case 'auto':
            selection.textContent = 'Currently skipping mode is set to: Automatic';
            break;
        case 'manual':
            selection.textContent = 'Currently skipping mode is set to: Manual';
            break;
        case 'off':
            selection.textContent = 'Currently skipping mode is set to: Off';
            break;
    }   
}