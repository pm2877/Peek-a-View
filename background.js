/* globals chrome, console */
'use strict';

chrome.browserAction.onClicked.addListener(updateIcon);
chrome.browserAction.onClicked.addListener(function(tab) {
    enablePeeking(tab.id);    
});
  
function updateIcon() {
    chrome.browserAction.setIcon({path: 'images/inactive_16.png'});
};

function enablePeeking(tabId) {
    chrome.tabs.executeScript(tabId, {
        file: 'peek.js',
        allFrames: true
    }, function(result) {
        if (chrome.runtime.lastError) {
            console.error('executeScript failed:' + chrome.runtime.lastError.message);
            chrome.notifications.create('informative-message', {
                type: 'basic',
                iconUrl: chrome.runtime.getURL('images/active_128.png'),
                title: 'Peek-a-View Extension failed',
                message: 'Something went wrong. Try another website.',
            });
            return;
        }
        if (!result || result.indexOf(true) === -1) {
            return;
        }
    });
}

// chrome.runtime.onInstalled.addListener();
// chrome.runtime.onStartup.addListener();
chrome.notifications.onClicked.addListener(function(notificationId) {
    chrome.notifications.clear(notificationId);
});
