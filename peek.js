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
function generatePeekWindow(hyperLink, element) {
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

    document.addEventListener('click', function(event) {
        var isAnchor = false;
        event = event || window.event;
        var target = event.target || event.srcElement;
    
        while (target) {
            if (target instanceof HTMLAnchorElement) {
            console.log(target.getAttribute('href'));
            target.setAttribute('href', target.getAttribute('href').replace(/^http:/, 'https:'));
            const parentNode = target;
            const nextSibling = target.firstChild;
            const peekWindow = generatePeekWindow(target.href, target);

            // console.log("++++++ event +++++++ ", event);
            removePeekWindows();
            if (event.altKey && event.metaKey) {
                event.stopPropagation();
                event.preventDefault(); 
                showPeekWindow(parentNode, peekWindow, nextSibling);
            }

            document.addEventListener('click', removePeekWindows);
            isAnchor = true;
            break;
            }
            target = target.parentNode;
        }
        if (!isAnchor && event.altKey && event.metaKey) {
            var s = window.getSelection();
            var range = s.getRangeAt(0);
            var node = s.anchorNode;
            while (range.toString().indexOf(' ') != 0) {
                range.setStart(node, (range.startOffset - 1));
            }
            range.setStart(node, range.startOffset + 1);
            do {
                range.setEnd(node, range.endOffset + 1);
            } while (range.toString().indexOf(' ') == -1 && range.toString().trim() != '' && range.endOffset < node.length);
            var str = range.toString().trim();
            console.log('thesaurus search to be made for: ', str);
        }
    }, true);
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
        