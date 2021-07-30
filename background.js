let skippingMode = 'auto';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({skippingMode});
  console.log('Default skipping mode set to: Automatic');
});
