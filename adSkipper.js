// Denotes skipping mode, could be auto, manual, or off. Auto means automatic skipping, manual makes skip ad button appear instantly
// off means the extension will not alter the browsing experience at all.
let skippingMode = 'auto';

// Ad module is where the image and video ads are played. The ad module will be listened for
// added children nodes (these are how ads are played), and the required logic to skip ads can be executed.
let adModule = document.getElementsByClassName("video-ads ytp-ad-module")[0];

// The mutation observer will execute required logic to skip ads, depending on their type and the skipping mode chosen by user.
var mutationObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            let added = mutation.addedNodes;
            if (added.length > 0) {
                let firstAddedChild = added[0];
                if (firstAddedChild.className === 'ytp-ad-player-overlay') {
                    if (skippingMode === 'auto') {
                        let adSkipButton = document.getElementsByClassName("ytp-ad-skip-button ytp-button")[0];
                        adSkipButton.click();
                    } else if (skippingMode === 'manual') {
                        let adSkipButton = document.getElementsByClassName("ytp-ad-skip-button-slot")[0];
                        adSkipButton.removeAttribute("style");
                        adSkipButton.children[0].removeAttribute("style");
                        let adPreviewSlot = document.getElementsByClassName("ytp-ad-preview-slot")[0];
                        adPreviewSlot.parentNode.removeChild(y);
                    }
                } else if (firstAddedChild.className === 'ytp-ad-overlay-ad-info-dialog-container') {
                    if (skippingMode === 'auto' || skippingMode === 'manual') {
                        let closeButton = document.getElementsByClassName('ytp-ad-overlay-close-button')[0];
                        closeButton.click();
                    }
                }
            } else {
                console.log('Skipped');
            }
        } 
    });
});

// This options object specificies which mutations the observer should listen to (in this case, added children).
let options = {
    subtree = false,
    childList = true,
    attributes = false,
    attributeOldValue = false,
    characterData = false,
    characterDataOldValue = false
}
mutationObserver.observe(adModule, options);