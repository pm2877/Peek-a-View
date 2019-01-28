(function() {
/* jshint browser:true, maxlen:100 */
/* globals chrome */
'use strict';
var MIN_WIDTH = 800;

var iframe = document.createElement('iframe');

/**
 * @param {string} hyperLink is the link of the anchor element.
 * @param {Element} element - the anchor element for which the iframe will be displayed.
 * @returns {HTMLElement|null}
 */
function generatePeekWindows(hyperLink, element) {
    var iframeHolder = iframe.cloneNode();

    var currentStyle = getComputedStyle(element);
    if (!currentStyle) {
        return null;
    }
    iframeHolder.style.setProperty('position', 'absolute', 'important');
    iframeHolder.style.setProperty('height', '40vw', 'important');
    iframeHolder.style.setProperty('width', '40vw', 'important');
    iframeHolder.style.setProperty('z-index', '999', 'important');
    iframeHolder.style.setProperty('border', 'solid 1px rgb(0,0,0,0.3)', 'important');
    iframeHolder.style.setProperty('background', 'rgb(0,0,0,0.3)', 'important');
    iframeHolder.style.setProperty('box-shadow', '5px 5px 20px 5px rgb(0,0,0,0.4)', 'important');
    iframeHolder.style.setProperty('margin', '10px', 'important');
    iframeHolder.style.setProperty('border-radius', '10px', 'important');
    iframeHolder.style.setProperty('padding', '1px', 'important');
    iframeHolder.style.setProperty('transform', 'scale(0.9)', 'important');
    iframeHolder.setAttribute('id', 'peekAViewWindow');
    if (element.offsetLeft > MIN_WIDTH) {
        iframeHolder.style.setProperty('right', '0', 'important');
    } else {
        iframeHolder.style.setProperty('left', '0', 'important');
    }
    iframeHolder.src = hyperLink;
    return iframeHolder;
}

function removePeekWindows() {
    [].forEach.call(document.body.querySelectorAll('iframe[id=peekAViewWindow]'), function(element) {
        element.parentNode.removeChild(element);
    });
}

function showPeekWindowOnClick() {
    var hyperLinks = (document.body || document.documentElement).querySelectorAll('a[href]');
    var element;
    var length = hyperLinks.length;

    for (var i = 0; i < length; i++) {
        element = hyperLinks[i];
        // console.log('href: ', element.href);
        const parentNode = element;
        const nextSibling = element.firstChild;
        const peekWindow = generatePeekWindows(element.href, element);

        parentNode.addEventListener('click', function(event) {
            removePeekWindows();
            if (event.altKey && event.metaKey) {
                event.stopPropagation();
                event.preventDefault(); 
                showPeekWindow(parentNode, peekWindow, nextSibling);
            }
        });
        document.addEventListener('click', removePeekWindows);
    }
}

function showPeekWindow(parentNode, peekWindow, nextSibling) {
    // console.log('inside showPeekWindow: ', parentNode, anchor, nextSibling);
    parentNode.insertBefore(peekWindow, nextSibling);
}

// This is the entry-point to this script
removePeekWindows();
if (!window.hasShown) {
    showPeekWindowOnClick();
}
window.hasShown = !window.hasShown;

// Used to communicate to the background
if (window.hasrun) {
    return false;
} else {
    window.hasrun = true;
    return true;
}
})();
        