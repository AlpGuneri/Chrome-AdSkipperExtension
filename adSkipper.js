// Denotes skipping mode, could be auto, manual, or off. Auto means automatic skipping, manual makes skip ad button appear instantly
// off means the extension will not alter the browsing experience at all.
let skipMode;
chrome.storage.sync.get("skippingMode", (data) => {
    skipMode = data.skippingMode;
});

// This code contains the logic to skip ads

let injectCode = function() {
    // Ad module is where the image and video ads are played. The ad module will be listened for
    // added children nodes (these are how ads are played), and the required logic to skip ads can be executed.
    let adModule = document.getElementsByClassName("video-ads ytp-ad-module")[0];

    let autoSkip = function() {
        let adSkipButton = document.getElementsByClassName("ytp-ad-skip-button ytp-button")[0];
        if (adSkipButton) {
            adSkipButton.click();
            console.log('Auto skipped ad');
        } else {
            let x = document.getElementsByClassName("ytp-ad-button ytp-ad-feedback-dialog-close-button ytp-ad-button-link")[0];
            x.click();
        }
    }

    let manualSkip = function() {
        let adSkipButton = document.getElementsByClassName("ytp-ad-skip-button-slot")[0];
        if (adSkipButton) {
            adSkipButton.removeAttribute("style");
            adSkipButton.children[0].removeAttribute("style");
            let adPreviewSlot = document.getElementsByClassName("ytp-ad-preview-slot")[0];
            adPreviewSlot.parentNode.removeChild(y);
            console.log('Manual skipped ad');
        }    
    }

    let closePopUp = function() {
        if (skipMode === 'auto' || skipMode === 'manual') {
            let closeButton = document.getElementsByClassName('ytp-ad-overlay-close-button')[0];
            if (closeButton) {
                closeButton.click();
                console.log('Closed pop-up');
            }
        }
    }

    if(adModule.childElementCount > 0) {
        if (skipMode !== 'off') {
            if (skipMode === 'auto') {
                autoSkip();
            } else {
                manualSkip();
            }    
            closePopUp();
        }
    }
    
    // This mutation observer will execute required logic to skip ads, depending on their type and the skipping mode chosen by user.
    let adModuleMutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                let added = mutation.addedNodes;
                if (added.length > 0) {
                    let firstAddedChild = added[0];
                    if (firstAddedChild.className === 'ytp-ad-player-overlay') {
                        if (skipMode === 'auto') {
                            autoSkip();
                        } else if (skipMode === 'manual') {
                            manualSkip();
                        }
                    } else if (firstAddedChild.className === 'ytp-ad-overlay-ad-info-dialog-container') {
                        closePopUp();
                    }
                } 
            } 
        });
    });

    // This lets us observe the adModule for added and removed children nodes, and deal with the mutations with the logic above.

    adModuleMutationObserver.observe(adModule, {childList: true});
}


// Since youtube uses ajax instead of redirects, the script will be tried to be injected not onto the home page, and not onto
// the videos that are clicked, since a new document is not fetched, the original document and url are just altered.
// This will cause failure, since the ads module is not present at home page. Thus, a mutation listener must be added
// to this DOM element to detect if the user is at home page or watching a video, and thus inject the script.
// An interval is set to check if html5 video player is rendered, so that it is not null.

let checkPlayer = function() {
    let videoPlayer = document.querySelector('.html5-video-player');
    if (videoPlayer !== null) {
        clearInterval(videoPlayerTimer);
        main(videoPlayer);
    }
}

let videoPlayerTimer = setInterval(checkPlayer, 100);

// This piece of code detects if we are at homepage or at a video. If we are at a video, the script can be injected.
// If we are at homepage, the script has to wait until a video is opened to be injected, since the ad element isn't present at homepage.
// All of this logic is put in a function since it must be fired after the window is loaded, or the html5-video-player will
// be perceived as null by the script. That's not what we want.

let main = function(videoPlayer) {

    // Function for checking if the user is on home page.
    let atHomePage = function() {
        let url = window.location.toString();
        if (url === 'http://www.youtube.com/' || url === 'https://www.youtube.com/') {
            return true;
        } else {
            return false;
        }
    }

    if (!atHomePage()) {
        injectCode();
        console.log('injecting code');
    } else {
        let pageObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    let added = mutation.addedNodes;
                    if (added.length > 0) {
                        for (let i = 0; i < added.length; i++) {
                            if (added[i].className === 'video-ads ytp-ad-module') {
                                injectCode();
                                console.log('injecting code');
                                pageObserver.disconnect();
                            }
                        }
                    }
                }       
            });
        });
        pageObserver.observe(videoPlayer, {childList: true})
    }
}    