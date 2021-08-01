chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({skippingMode: 'auto'});
  console.log('Default skipping mode set to: Automatic');
});
