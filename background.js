/* globals chrome, console */
'use strict';

var peekingEnabled = false;
chrome.browserAction.onClicked.addListener(updateIcon);
chrome.browserAction.onClicked.addListener(function(tab) {
    enablePeeking(tab.id);    
});

// chrome.tabs.onActivated.addListener(function(activeInfo) {
//     console.log(activeInfo.tabId);
//     enablePeeking(activeInfo.id); 
// });

// chrome.tabs.onUpdated.addListener(function(activeInfo) {
//     console.log(activeInfo.tabId);
//     enablePeeking(activeInfo.id); 
// });

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
// window.open("popup.html", "extension_popup", "width=300, height=400, status=no, scrollbars=yes, resizable=yes");

// chrome.windows.create({
//     url: chrome.runtime.getURL("popup.html"),
//     type: "popup",
//     left: 200,
//     top: 200,
//     width: 400,
//     height: 550
// });

// $("body").append('Test');

chrome.notifications.onClicked.addListener(function(notificationId) {
    chrome.notifications.clear(notificationId);
});
