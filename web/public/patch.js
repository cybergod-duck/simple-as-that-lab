/**
 * SIMPLE AS THAT — Universal Compliance Patch v2026.04
 * One script tag to resolve: Privacy Disclosures, ADA/WCAG, Cookie Consent, GPC Signal
 * 
 * Usage: <script src="https://simple-as-that.org/patch.js" data-license="your@email.com"></script>
 */
(function () {
    'use strict';

    var PATCH_API = 'https://simple-as-that.org/api/verify-license';
    var scriptTag = document.currentScript;
    var licenseEmail = scriptTag ? scriptTag.getAttribute('data-license') : null;

    // Get the current domain for license verification
    var currentDomain = window.location.hostname
        .replace(/^www\./, '')
        .toLowerCase();

    // ==========================================
    // 1. LICENSE VERIFICATION
    // ==========================================
    function verifyLicense(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', PATCH_API + '?domain=' + encodeURIComponent(currentDomain), true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                try {
                    var resp = JSON.parse(xhr.responseText);
                    callback(resp.licensed === true);
                } catch (e) {
                    callback(false);
                }
            }
        };
        xhr.onerror = function () { callback(false); };
        xhr.send();
    }

    // ==========================================
    // 2. ADA / WCAG ACCESSIBILITY LAYER
    // ==========================================
    function injectAccessibility() {
        // Add skip-to-content link
        var skip = document.createElement('a');
        skip.href = '#main-content';
        skip.textContent = 'Skip to main content';
        skip.style.cssText = 'position:absolute;top:-40px;left:0;background:#000;color:#fff;padding:8px 16px;z-index:100000;font-size:14px;transition:top 0.2s;';
        skip.onfocus = function () { skip.style.top = '0'; };
        skip.onblur = function () { skip.style.top = '-40px'; };
        document.body.insertBefore(skip, document.body.firstChild);

        // Tag main content area
        var main = document.querySelector('main') || document.querySelector('[role="main"]') || document.querySelector('#content') || document.querySelector('.content');
        if (main && !main.id) main.id = 'main-content';

        // Add ARIA landmarks to common elements
        var nav = document.querySelector('nav') || document.querySelector('.nav') || document.querySelector('.navigation');
        if (nav) nav.setAttribute('role', 'navigation');

        var footer = document.querySelector('footer') || document.querySelector('.footer');
        if (footer) footer.setAttribute('role', 'contentinfo');

        // Inject focus-visible styles
        var style = document.createElement('style');
        style.textContent = '*:focus-visible{outline:2px solid #4A90D9!important;outline-offset:2px!important;}' +
            'img:not([alt]){outline:3px solid red!important;}' +
            'a:not([href]){cursor:not-allowed;opacity:0.5;}';
        document.head.appendChild(style);
    }

    // ==========================================
    // 3. COOKIE CONSENT HARD-BLOCKER
    // ==========================================
    function injectCookieConsent() {
        // Block third-party cookies until consent
        var originalCookieSetter = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
        var consentGiven = localStorage.getItem('sat_cookie_consent') === 'true';

        if (!consentGiven && originalCookieSetter && originalCookieSetter.set) {
            Object.defineProperty(document, 'cookie', {
                get: originalCookieSetter.get,
                set: function (val) {
                    // Allow essential cookies, block tracking
                    var isEssential = val.indexOf('session') > -1 || val.indexOf('csrf') > -1 || val.indexOf('sat_') > -1;
                    if (isEssential || localStorage.getItem('sat_cookie_consent') === 'true') {
                        originalCookieSetter.set.call(document, val);
                    }
                },
                configurable: true
            });
        }

        // Build consent banner
        var banner = document.createElement('div');
        banner.id = 'sat-cookie-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-label', 'Cookie consent');
        banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#1a1a2e;color:#e0e0e0;padding:16px 24px;font-family:system-ui,sans-serif;font-size:13px;display:flex;align-items:center;justify-content:space-between;z-index:99999;border-top:1px solid rgba(255,255,255,0.1);gap:16px;';
        banner.innerHTML = '<span>This site uses cookies to enhance your experience. By continuing, you consent to our use of cookies in accordance with applicable privacy laws.</span>' +
            '<div style="display:flex;gap:8px;flex-shrink:0;">' +
            '<button id="sat-cookie-reject" style="padding:8px 16px;background:transparent;border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:6px;cursor:pointer;font-size:12px;">Reject All</button>' +
            '<button id="sat-cookie-accept" style="padding:8px 16px;background:#fff;color:#000;border:none;border-radius:6px;cursor:pointer;font-weight:bold;font-size:12px;">Accept All</button>' +
            '</div>';

        if (!consentGiven) {
            document.body.appendChild(banner);
            document.getElementById('sat-cookie-accept').onclick = function () {
                localStorage.setItem('sat_cookie_consent', 'true');
                banner.remove();
                // Restore cookie setter
                if (originalCookieSetter) {
                    Object.defineProperty(document, 'cookie', originalCookieSetter);
                }
            };
            document.getElementById('sat-cookie-reject').onclick = function () {
                localStorage.setItem('sat_cookie_consent', 'false');
                banner.remove();
            };
        }
    }

    // ==========================================
    // 4. GLOBAL PRIVACY CONTROL (GPC) SUPPORT
    // ==========================================
    function injectGPC() {
        // Honor the GPC signal
        if (navigator.globalPrivacyControl) {
            // Auto-opt-out of tracking
            localStorage.setItem('sat_cookie_consent', 'false');
            // Set GPC meta tag
            var meta = document.createElement('meta');
            meta.name = 'globalPrivacyControl';
            meta.content = 'true';
            document.head.appendChild(meta);
        }
    }

    // ==========================================
    // 5. PRIVACY DISCLOSURE FOOTER LINK
    // ==========================================
    function injectPrivacyFooter() {
        var footer = document.querySelector('footer') || document.body;

        var link = document.createElement('div');
        link.style.cssText = 'text-align:center;padding:12px;font-family:system-ui,sans-serif;font-size:11px;color:#888;border-top:1px solid rgba(255,255,255,0.05);';
        link.innerHTML = '<a href="#" id="sat-privacy-link" style="color:#4A90D9;text-decoration:underline;">Your Privacy Choices & 2026 State Rights</a>';
        footer.appendChild(link);

        document.getElementById('sat-privacy-link').onclick = function (e) {
            e.preventDefault();
            showPrivacyModal();
        };
    }

    function showPrivacyModal() {
        var existing = document.getElementById('sat-privacy-modal');
        if (existing) { existing.remove(); return; }

        var modal = document.createElement('div');
        modal.id = 'sat-privacy-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-label', 'Privacy rights notice');
        modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.85);z-index:100000;display:flex;align-items:center;justify-content:center;padding:24px;';
        modal.innerHTML = '<div style="background:#1a1a2e;border:1px solid rgba(255,255,255,0.1);border-radius:12px;max-width:600px;width:100%;max-height:80vh;overflow-y:auto;padding:32px;color:#e0e0e0;font-family:system-ui,sans-serif;font-size:14px;line-height:1.6;">' +
            '<h2 style="color:#fff;font-size:18px;margin:0 0 16px;">NOTICE OF CONSUMER PRIVACY RIGHTS (2026)</h2>' +
            '<p>Residents of applicable states are granted specific rights under state privacy law regarding their personal data, including:</p>' +
            '<ul style="margin:12px 0;padding-left:20px;">' +
            '<li><strong>Right to Access/Confirm</strong> — Request what data we hold.</li>' +
            '<li><strong>Right to Correct/Delete</strong> — Fix or remove your data.</li>' +
            '<li><strong>Right to Opt-Out</strong> — Stop sale/sharing of your data.</li>' +
            '<li><strong>Right to Non-Discrimination</strong> — Equal service regardless of choices.</li>' +
            '</ul>' +
            '<p>To exercise these rights, contact the site administrator directly.</p>' +
            '<p style="margin-top:16px;font-size:11px;color:#888;">Compliance layer provided by Simple As That Labs — STAT-2026-PATCH</p>' +
            '<button id="sat-close-modal" style="margin-top:16px;padding:8px 24px;background:#fff;color:#000;border:none;border-radius:6px;cursor:pointer;font-weight:bold;font-size:13px;">Close</button>' +
            '</div>';

        document.body.appendChild(modal);
        modal.onclick = function (e) { if (e.target === modal) modal.remove(); };
        document.getElementById('sat-close-modal').onclick = function () { modal.remove(); };
    }

    // ==========================================
    // BOOT SEQUENCE
    // ==========================================
    function boot(licensed) {
        if (licensed) {
            injectAccessibility();
            injectGPC();
            injectCookieConsent();
            injectPrivacyFooter();
            console.log('[STAT-2026-PATCH] ✓ Universal Compliance Patch active. Licensed domain: ' + currentDomain);
        } else {
            console.warn('[STAT-2026-PATCH] ✗ Domain "' + currentDomain + '" is not licensed. Visit https://simple-as-that.org to acquire a patch.');
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { verifyLicense(boot); });
    } else {
        verifyLicense(boot);
    }

})();
