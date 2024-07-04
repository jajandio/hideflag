// ==UserScript==
// @name         Hide Tweets with Specific Emoji in Display Name
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Hide tweets from people with the "🇵🇸" emoji in their display names
// @author       Your Name
// @match        https://x.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide tweets based on display name emoji
    function hideTweets() {
        const tweets = document.querySelectorAll('article[role="article"]');
        tweets.forEach(tweet => {
            const displayNameContainer = tweet.querySelector('div[data-testid="User-Name"]');
            if (displayNameContainer) {
                const displayNameElements = displayNameContainer.querySelectorAll('span, img');
                let displayNameText = '';
                displayNameElements.forEach(el => {
                    if (el.tagName === 'IMG' && el.alt) {
                        displayNameText += el.alt;
                    } else {
                        displayNameText += el.textContent;
                    }
                });

                if (displayNameText.includes('🇵🇸')) {
                    tweet.style.display = 'none';
                }
            }
        });
    }

    // Function to initialize the script
    function init() {
        const targetNode = document.querySelector('div[data-testid="primaryColumn"]') || document.querySelector('main[role="main"]');
        if (targetNode) {
            hideTweets();
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length) {
                        hideTweets();
                    }
                });
            });
            observer.observe(targetNode, { childList: true, subtree: true });
        } else {
            setTimeout(init, 1000); // Retry after 1 second
        }
    }

    // Wait for the DOM to be fully loaded
    window.addEventListener('load', init);
})();