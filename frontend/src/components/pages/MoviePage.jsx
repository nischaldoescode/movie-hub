import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useMovieContext } from "../context/MovieContext";
import MovieDetailHero from "../movie/MovieDetailHero";
import MovieCast from "../movie/MovieCast";
import Loader from "../ui/Loader";
import { Helmet, HelmetProvider } from "react-helmet-async";

import {
  Play,
  Server,
  Loader as LoaderIcon,
  Shield,
  X,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Chrome,
  Globe,
  ShieldCheck,
  Download,
  HelpCircle,
  CheckCircle,
  Film,
} from "lucide-react";

const MoviePage = () => {
  const { id } = useParams();
  const {
    getMovieDetails,
    getStreamingUrl,
    handlePlayerLoaded,
    playerLoading,
    setPlayerLoading,
    activeServer,
    switchServer,
  } = useMovieContext();

  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streamingUrl, setStreamingUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerProtected, setPlayerProtected] = useState(true);
  const [securityLevel, setSecurityLevel] = useState("high"); // "high", "medium", "low"
  const [blockedCount, setBlockedCount] = useState(0);
  const [adOverlayActive, setAdOverlayActive] = useState(false);
  const playerRef = useRef(null);
  const iframeRef = useRef(null);
  const playerContainerRef = useRef(null);
  const topRef = useRef(null);
  const overlayShieldRef = useRef(null);
  const blockedActionsRef = useRef(0);
  const scrollRestoreRef = useRef(null);
  const adTimeoutRef = useRef(null);
  const popupPatterns =
    /pop|click|redirect|offer|win|prize|free|bonus|ad|banner|track|survey|smart|clk|advert|campaign|campaign|x7130zp|IOarzRhPlPOverlay|modal|selectextShadowHos|shadow|znid|donto|popcash|display|osumpdfciiptn|muthwhcjuwela|qtdfxjlbnojnc|pl-d8e112f909ccf659971eeb2e95e5128c__wrap|pl-d8e112f909ccf659971eeb2e95e5128c__content|pl-d8e112f909ccf659971eeb2e95e5128c__btn-block|pl-d8e112f909ccf659971eeb2e95e5128c__bt|pl-d8e112f909ccf659971eeb2e95e5128c__link|pl-d8e112f909ccf659971eeb2e95e5128c__finlink|pl-d8e112f909ccf659971eeb2e95e5128c__content-block|pl-d8e112f909ccf659971eeb2e95e5128c__desc-wrap|pl-d8e112f909ccf659971eeb2e95e5128c__desc|bbmfcst|videoOverlay|selectextShadowHost/i;
  const blockedDomainsPattern =
    /doubleclick|adservice|adnxs|adsystem|adsrvr|taboola|outbrain|revcontent|zedo|adroll|rubiconproject|openx|invadedisheartentrail|criteo|pubmatic|smartadserver|adtechus|quantserve|mediamath|turn|intellipopup|popcash|custom|effectivemeasure|tjwsg|osumpdfciiptn|\.online|muthwhcjuwela|\.store|qtdfxjlbnojnc|raggedstriking|usrpubtrk|brightadnetwork|storageimagedisplay|recordedthereby|nannyirrationalacquainted/i;

  useEffect(() => {
    if (!streamingUrl || !playerProtected) return;

    let isMounted = true;
    let clickCount = 0;
    let lastClickTime = 0;
    let originalFunctions = {};
    // Enhanced script blocking function
    const blockScript = (script) => {
      const src = script.src || "";
      const content = script.textContent || "";

      // Check for suspicious domain in the adserverDomain property
      const hasAdServerDomain =
        content.includes("adserverDomain") ||
        content.includes("qqsfafvkgsyto.online") ||
        content.match(/\.online"/) ||
        content.match(
          /[a-zA-Z0-9]{20,}\.(?:online|com|net|xyz|top|site|club|info|biz|link)/
        );

      // Check for suspicious variable naming patterns (random looking strings)
      const hasRandomVarNames =
        content.match(/window\['[a-zA-Z0-9]{20,}'\]/) ||
        content.match(/var [a-zA-Z0-9]{15,}/) ||
        content.match(/let [a-zA-Z0-9]{15,}/) ||
        content.match(/const [a-zA-Z0-9]{15,}/);

      const hasBase64Redirection =
        content.includes("atob(") ||
        content.includes("decodeBase64") ||
        content.includes("loadExternalScripts") ||
        content.includes("decodeURIComponent") ||
        content.match(/aHR0cHM6Ly[^\s'"]+/) ||
        content.match(/[A-Za-z0-9+/]{20,}={0,2}/) || // Generic base64 pattern
        content.match(/window\.open\([^)]*atob/) ||
        content.match(/createElement.*script.*atob/) ||
        content.includes("raggedstriking.com") ||
        content.includes("rashcolonizeexpand.com");
  const hasAdvancedThreats = (
    content.includes("setCookie") && content.includes("getCookie") && content.includes("atob") ||
    content.includes("loadExternalScripts") ||
    content.includes("ad_4_handleClick") ||
    content.includes("decodeBase64") ||
    content.includes("raggedstriking.com") ||
    content.includes("rashcolonizeexpand.com") ||
    content.match(/function\s+[a-zA-Z_][a-zA-Z0-9_]*\s*\(\s*\)\s*{[\s\S]*atob/) ||
    content.match(/const\s+[a-zA-Z_][a-zA-Z0-9_]*\s*=\s*\[[\s\S]*aHR0cHM6Ly/)
  );
      return (
        blockedDomainsPattern.test(src) ||
        popupPatterns.test(src) ||
        src.includes("popcash") ||
        src.includes("intellipopup") ||
        src.includes("script-custom.js") ||
        src.includes(
          "https://vidlink.pro/_next/static/chunks/800-c28b1e953be540c7.js"
        ) ||
        src.includes("800-c28b1e953be540c7.js") ||
        content.includes("znid") ||
        content.includes("donto") ||
        content.includes("IOarzRhPlP") ||
        content.includes("popads-script") ||
        content.includes("videoOverlay") ||
        content.includes("script-custom.js") ||
        content.includes("video-layout_controls__rRx2z") ||
        content.includes("transition-all") ||
        content.includes("copywrite-button") ||
        content.includes("gradient-shadow") ||
        content.includes("overscroll-contain") ||
        content.includes("a") ||
        content.includes(
          "aHR0cHM6Ly9yYWdnZWRzdHJpa2luZy5jb20vZGN4a2txMnJ2cD9rZXk9MDZkODRkNDYwZDhhYTQ4NzNkNjI5ZTEzNWZhY2U2ZDY="
        ) ||
        content.includes(
          "aHR0cHM6Ly9yYWdnZWRzdHJpa2luZy5jb20vcmM4djdxd3NnZT9rZXk9OWI5ZmE4Y2JhYjI5NTg3MTczNzI4ZGM2NTMyYWRiYjA="
        ) ||
        content.includes(
          "Ly9yYWdnZWRzdHJpa2luZy5jb20vMjAvZWIvYmEvMjBlYmJhMGEyOGYyNDFhODgwOGUyYTU4OTBlODNlODQuanM="
        ) ||
        content.includes("sfp") ||
        content.includes("loadExternalScripts") ||
        // Add these new checks
        hasAdServerDomain ||
        hasAdvancedThreats ||
        hasRandomVarNames ||
        hasBase64Redirection ||
        content.includes("x4G9Tq2Kw6R7v1Dy3P0B5N8Lc9M2zF") || // Block this specific script
        content.match(
          /window\.open|popup|redirect|location\s*=|postMessage|_blank/i
        )
      );
    };

    // Function to store original functions
    const storeOriginalFunctions = () => {
      originalFunctions = {
        windowOpen: window.open,
        alert: window.alert,
        confirm: window.confirm,
        prompt: window.prompt,
        createElement: document.createElement,
        appendChild: Element.prototype.appendChild,
        insertBefore: Element.prototype.insertBefore,
        setAttribute: Element.prototype.setAttribute,
        postMessage: window.postMessage,
        setInterval: window.setInterval,
        setTimeout: window.setTimeout,
        requestAnimationFrame: window.requestAnimationFrame,
      };
    };

    // Store original functions
    storeOriginalFunctions();

    // Override window.open with robust URL analysis
    // Enhance the window.open override with stronger checks
    window.open = function (...args) {
      if (!args[0]) return null;

      const url = args[0].toString();

      // Always block _blank targets
      if (args[1] && args[1].includes("_blank")) {
        console.log("Blocked _blank target:", url);
        blockedActionsRef.current++;
        setBlockedCount((prev) => prev + 1);
        return null;
      }

      // Your existing checks remain
      const isBlocked =
        popupPatterns.test(url) ||
        blockedDomainsPattern.test(url) ||
        url.startsWith("javascript:") ||
        url.startsWith("data:") ||
        (document.referrer && popupPatterns.test(document.referrer));

      if (isBlocked) {
        console.log("Popup blocked:", url);
        blockedActionsRef.current++;
        setBlockedCount((prev) => prev + 1);
        return null;
      }

      // Block by default for streaming content (cautious approach)
      console.log("Popup blocked (default protection):", url);
      blockedActionsRef.current++;
      setBlockedCount((prev) => prev + 1);
      return null;
    };

    // Block all dialogs
    window.alert = function () {
      return null;
    };
    window.confirm = function () {
      return false;
    };
    window.prompt = function () {
      return null;
    };

    // Proxy setInterval and setTimeout to prevent fingerprinting and popups
    window.setInterval = function (callback, delay, ...args) {
      if (delay < 300) {
        // Fast timers are often used for tracking
        delay = 1000; // Slow them down
      }
      return originalFunctions.setInterval.call(
        window,
        callback,
        delay,
        ...args
      );
    };

    window.setTimeout = function (callback, delay, ...args) {
      const callbackStr = callback.toString().toLowerCase();

      // Block timeout functions that might be used for popups
      if (
        callbackStr.includes("window.open") ||
        callbackStr.includes("location") ||
        callbackStr.includes("popup") ||
        callbackStr.includes("adv")
      ) {
        console.log("Blocked suspicious timeout");
        blockedActionsRef.current++;
        setBlockedCount((prev) => prev + 1);
        return 0;
      }

      return originalFunctions.setTimeout.call(
        window,
        callback,
        delay,
        ...args
      );
    };

    // Intercept requestAnimationFrame to control execution rate
    window.requestAnimationFrame = function (callback) {
      // Add throttling to prevent aggressive scripts
      return originalFunctions.requestAnimationFrame.call(window, callback);
    };

    // Intercept createElement with enhanced detection
    const originalCreateElement = document.createElement;
    document.createElement = function (tagName) {
      const element = originalCreateElement.call(document, tagName);

      if (tagName.toLowerCase() === "iframe") {
        // Instead of sandbox, use other techniques to secure iframes
        setTimeout(() => {
          try {
            // These attributes are less likely to be detected as blocking
            element.setAttribute("referrerpolicy", "no-referrer");
            element.setAttribute("loading", "lazy");
            element.setAttribute("importance", "low");
            element.setAttribute("allowfullscreen", "false");
            element.setAttribute("allow", "fullscreen; camera *; microphone *");

            // Block common ad network sources
            const blockIframeLoad = () => {
              element.addEventListener("load", function () {
                try {
                  const src = element.src || "";
                  if (
                    blockedDomainsPattern.test(src) ||
                    popupPatterns.test(src)
                  ) {
                    console.log("Blocked suspicious iframe load:", src);
                    element.src = "about:blank";
                    blockedActionsRef.current++;
                    setBlockedCount((prev) => prev + 1);
                  }

                  // Apply protection to iframe content if accessible
                  try {
                    if (element.contentWindow) {
                      // Try to hijack the iframe's window.open
                      element.contentWindow.open = function () {
                        console.log("Iframe popup blocked");
                        blockedActionsRef.current++;
                        setBlockedCount((prev) => prev + 1);
                        return null;
                      };

                      // Block dialogs in the iframe
                      element.contentWindow.alert = function () {
                        return null;
                      };
                      element.contentWindow.confirm = function () {
                        return false;
                      };
                      element.contentWindow.prompt = function () {
                        return null;
                      };

                      // Block location changes
                      Object.defineProperty(element.contentWindow, "location", {
                        get: function () {
                          return window.location;
                        },
                        set: function (value) {
                          console.log(
                            "Blocked iframe location change to:",
                            value
                          );
                          blockedActionsRef.current++;
                          setBlockedCount((prev) => prev + 1);
                          return window.location;
                        },
                      });
                    }
                  } catch (e) {
                    // CORS might prevent this - that's fine
                  }
                } catch (e) {
                  console.log("Error in iframe load handler:", e);
                }
              });
            };

            blockIframeLoad();

            // Watch for src changes
            const originalSetAttribute = element.setAttribute;
            element.setAttribute = function (attr, value) {
              if (
                attr.toLowerCase() === "src" &&
                (blockedDomainsPattern.test(value) || popupPatterns.test(value))
              ) {
                console.log("Blocked suspicious iframe src:", value);
                blockedActionsRef.current++;
                setBlockedCount((prev) => prev + 1);
                return;
              }
              return originalSetAttribute.call(this, attr, value);
            };

            console.log("Enhanced iframe security applied");
          } catch (e) {
            console.log("Could not enhance iframe security");
          }
        }, 0);
      }

      if (tagName.toLowerCase() === "script") {
        // Monitor this script element for suspicious content
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function (name, value) {
          if (
            name.toLowerCase() === "src" &&
            (blockedDomainsPattern.test(value) || popupPatterns.test(value))
          ) {
            console.log("Blocked script src attribute:", value);
            blockedActionsRef.current++;
            setBlockedCount((prev) => prev + 1);
            return;
          }

          return originalSetAttribute.call(this, name, value);
        };

        // Create a setter trap for script content
        let scriptContent = "";
        Object.defineProperty(element, "textContent", {
          get: function () {
            return scriptContent;
          },
          set: function (value) {
            // Check if content is suspicious before allowing it
            if (
              value &&
              (value.includes("adserverDomain") ||
                value.includes("qqsfafvkgsyto.online") ||
                value.includes("x4G9Tq2Kw6R7v1Dy3P0B5N8Lc9M2zF") ||
                value.includes("brightadnetwork") ||
                value.includes("storageimagedisplay") ||
                value.includes("recordedthereby") ||
                value.includes("nannyirrationalacquainted") ||
                value.includes("a84fd18ad209c2830d95f3b2a49a6397") ||
                content.includes("loadExternalScripts") ||
                value.includes("sfp") ||
                value.match(/window\['[a-zA-Z0-9]{20,}'\]/))
            ) {
              console.log("Blocked suspicious script content");
              blockedActionsRef.current++;
              setBlockedCount((prev) => prev + 1);
              // Return silently without setting the content
              return;
            }
            scriptContent = value;
          },
        });

        // Same for innerHTML which could be used to set script content
        Object.defineProperty(element, "innerHTML", {
          set: function (value) {
            // Check if content is suspicious
            if (
              value &&
              (value.includes("adserverDomain") ||
                value.includes("qqsfafvkgsyto.online") ||
                value.includes("x4G9Tq2Kw6R7v1Dy3P0B5N8Lc9M2zF") ||
                value.includes("brightadnetwork") ||
                value.includes("storageimagedisplay") ||
                value.includes("recordedthereby") ||
                value.includes("nannyirrationalacquainted") ||
                value.includes("a84fd18ad209c2830d95f3b2a49a6397") ||
                content.includes("loadExternalScripts") ||
                value.includes("sfp") ||
                value.includes("atob(") ||
                value.match(/window\['[a-zA-Z0-9]{20,}'\]/))
            ) {
              console.log("Blocked suspicious script innerHTML");
              blockedActionsRef.current++;
              setBlockedCount((prev) => prev + 1);
              return;
            }
            // Use the native innerHTML setter
            HTMLScriptElement.prototype.innerHTML = value;
          },
        });
      }

      return element;
    };

    // Enhanced Element.prototype methods with deep inspection
    const originalAppendChild = Element.prototype.appendChild;
    Element.prototype.appendChild = function (child) {
      // Specifically check for iframes and scripts
      if (child.tagName === "IFRAME") {
        // Analyze the iframe before allowing
        const src = child.src || "";
        if (blockedDomainsPattern.test(src) || popupPatterns.test(src)) {
          console.log("Blocked suspicious iframe append:", src);
          blockedActionsRef.current++;
          setBlockedCount((prev) => prev + 1);
          return child; // Return child but don't actually append
        }
      }

      if (child.tagName === "SCRIPT") {
        // Analyze script content/src for suspicious patterns
        const scriptContent = child.textContent || "";
        const scriptSrc = child.src || "";

        if (
          scriptContent.match(
            /window\.open|popup|banner|redirect|location\s*=|postMessage|_blank|setCookie|getCookie|window.onload|loadExternalScripts|loadExternalScripts|ad_4_handleClick2|decodeBase64/i
          ) ||
          blockedDomainsPattern.test(scriptSrc)
        ) {
          console.log("Blocked suspicious script append");
          blockedActionsRef.current++;
          setBlockedCount((prev) => prev + 1);
          return child; // Return child but don't actually append
        }
      }

      return originalAppendChild.call(this, child);
    };

    // Override insertBefore similarly
    const originalInsertBefore = Element.prototype.insertBefore;
    Element.prototype.insertBefore = function (newNode, referenceNode) {
      if (newNode.tagName === "IFRAME" || newNode.tagName === "SCRIPT") {
        const src = newNode.src || "";
        if (blockedDomainsPattern.test(src) || popupPatterns.test(src)) {
          console.log("Blocked suspicious element insertion:", src);
          blockedActionsRef.current++;
          setBlockedCount((prev) => prev + 1);
          return newNode;
        }
      }

      return originalInsertBefore.call(this, newNode, referenceNode);
    };

    const detectSuspiciousOverlays = () => {
      try {
        if (!iframeRef.current?.contentDocument) return;

        const doc = iframeRef.current.contentDocument;

        // Detect elements with suspicious behavioral patterns
        const allElements = doc.querySelectorAll("div, a");

        allElements.forEach((el) => {
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();

          // Detect invisible overlay patterns
          const isSuspiciousOverlay =
            // Fixed/absolute positioning with high z-index
            (style.position === "fixed" || style.position === "absolute") &&
            parseInt(style.zIndex) > 1000000 &&
            // Covers significant area
            (rect.width > window.innerWidth * 0.7 ||
              rect.height > window.innerHeight * 0.7) &&
            // Very low opacity (nearly invisible)
            (parseFloat(style.opacity) < 0.1 || style.opacity === "0.01") &&
            // Has click handler or href
            (el.onclick || el.href || el.querySelector("a[href]"));

          // Detect random ID patterns
          const hasRandomId =
            el.id &&
            (/^[a-z0-9]{6,8}$/.test(el.id) || // Short random IDs like 'n298qfm'
              /^[a-zA-Z]{5,7}$/.test(el.id) || // Random letter IDs like 'lkvqm'
              /^[a-z]+\d+[a-z]+$/.test(el.id)); // Mixed patterns

          // Detect suspicious URLs
          const hasSuspiciousUrl =
            el.href &&
            (el.href.includes("rashcolonizeexpand.com") ||
              el.href.includes("raggedstriking.com") ||
              el.href.match(/[a-z]+colonize[a-z]+\.com/) ||
              el.href.match(/[a-z]+striking\.com/) ||
              el.href.includes("vi7scvnf") ||
              el.href.includes("dcxkkq2rvp") ||
              el.href.includes("rc8v7qwsge"));

          if (isSuspiciousOverlay || hasRandomId || hasSuspiciousUrl) {
            console.log(
              "Removing suspicious element:",
              el.id,
              el.className,
              el.href
            );
            el.remove();
            blockedActionsRef.current++;
            setBlockedCount((prev) => prev + 1);
          }
        });
      } catch (e) {
        console.log("Error detecting suspicious overlays:", e);
      }
    };
    // Proxy postMessage to prevent cross-origin issues
    window.postMessage = function (message, targetOrigin, transfer) {
      const messageStr =
        typeof message === "string" ? message : JSON.stringify(message);

      if (popupPatterns.test(messageStr)) {
        console.log("Blocked suspicious postMessage:", targetOrigin);
        blockedActionsRef.current++;
        setBlockedCount((prev) => prev + 1);
        return;
      }

      // Ensure targetOrigin is valid
      const safeTargetOrigin = targetOrigin || "*";

      return originalFunctions.postMessage.call(
        window,
        message,
        safeTargetOrigin,
        transfer
      );
    };

    // Create and setup the protective shield
    if (playerContainerRef.current) {
      const playerContainer = playerContainerRef.current;

      // Create primary shield element with stronger protection
      const shield = document.createElement("div");
      shield.className = "popup-shield";
      shield.style.position = "absolute";
      shield.style.top = "0";
      shield.style.left = "0";
      shield.style.width = "100%";
      shield.style.height = "100%";
      shield.style.zIndex = "9999";
      shield.style.background = "transparent";
      shield.style.cursor = "default";
      shield.style.display = "block";
      shield.style.pointerEvents = "auto";

      overlayShieldRef.current = shield;
      playerContainer.appendChild(shield);

      // Enhanced ad overlay blocker with better styling
      const adOverlay = document.createElement("div");
      adOverlay.className = "ad-overlay-blocker";
      adOverlay.style.position = "absolute";
      adOverlay.style.top = "0";
      adOverlay.style.left = "0";
      adOverlay.style.width = "100%";
      adOverlay.style.height = "100%";
      adOverlay.style.zIndex = "10000";
      adOverlay.style.background = "rgba(0,0,0,0.9)";
      adOverlay.style.display = "none";
      adOverlay.style.alignItems = "center";
      adOverlay.style.justifyContent = "center";
      adOverlay.style.flexDirection = "column";
      adOverlay.innerHTML = `
        <div style="display: flex; align-items: center; margin-bottom: 16px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #f59e0b; margin-right: 8px;">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <div style="color:white; font-size:16px; font-weight:500;">Popup/Ad Blocked</div>
        </div>
        <div style="color:#d1d5db; font-size:14px; margin-bottom:16px; max-width:80%; text-align:center;">
          Our system detected and blocked potentially harmful content from the video player
        </div>
        <button style="background:#3b82f6; color:white; border:none; padding:8px 20px; border-radius:4px; cursor:pointer; font-size:14px; font-weight:500; display:flex; align-items:center; justify-content:center;">
          <span style="margin-right:6px">Continue to Video</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </button>
      `;

      playerContainer.appendChild(adOverlay);

      // More aggressive ad overlay display with random delay to avoid detection
      const showAdOverlay = () => {
        if (!isMounted) return;
        adOverlay.style.display = "flex";
        setAdOverlayActive(true);

        // Random timeout to avoid pattern detection
        const randomDelay = 3000 + Math.random() * 2000;
        adTimeoutRef.current = setTimeout(() => {
          if (isMounted) {
            adOverlay.style.display = "none";
            setAdOverlayActive(false);
          }
        }, randomDelay);
      };

      const continueButton = adOverlay.querySelector("button");
      if (continueButton) {
        continueButton.addEventListener("click", () => {
          adOverlay.style.display = "none";
          setAdOverlayActive(false);
          clearTimeout(adTimeoutRef.current);
        });
      }

      // Advanced event handler with pattern detection and AI-like filtering
      const handleInteraction = (e) => {
        if (!playerProtected) return true;

        const now = Date.now();
        const legitimatePlayerControls = [
          "time-slider",
          "duration-150",
          "media-buffering",
          "-mt-0.5",
          "playButton",
        ];

        // Check if the clicked element or its parents are legitimate player controls
        let currentEl = e.target;
        let isLegitPlayerControl = false;
        for (let i = 0; i < 4; i++) {
          // Check up to 4 levels of parents
          if (!currentEl) break;

          const classNames = currentEl.className?.toString() || "";
          isLegitPlayerControl = legitimatePlayerControls.some((cls) =>
            classNames.includes(cls)
          );

          if (isLegitPlayerControl) {
            // It's a legitimate control, but we still need to prevent any redirects
            // Let the event continue but catch any navigation attempts

            // Save current location to detect navigation
            const currentHref = window.location.href;

            // Use a setTimeout to check if navigation occurred after event handling
            setTimeout(() => {
              if (window.location.href !== currentHref) {
                console.log("Blocked redirect from player control");
                window.history.back(); // Go back if navigation occurred
                blockedActionsRef.current++;
                setBlockedCount((prev) => prev + 1);
              }
            }, 100);

            return true; // Let the event continue
          }

          currentEl = currentEl.parentElement;
        }

        // Only apply filtering based on security level
        const shouldFilter =
          securityLevel === "high" ||
          (securityLevel === "medium" && e.type !== "mousemove");

        if (!shouldFilter) return true;

        // Block all rapid clicks with timing variation to avoid detection
        if (clickCount > 0 && now - lastClickTime < 500 + Math.random() * 300) {
          e.stopPropagation();
          e.preventDefault();
          showAdOverlay();
          blockedActionsRef.current++;
          setBlockedCount((prev) => prev + 1);
          clickCount = 0;
          return false;
        }

        if (e.type === "click" || e.type === "mousedown") {
          clickCount++;

          // Reset click count after a while
          setTimeout(() => {
            clickCount = 0;
          }, 2000);
        }

        lastClickTime = now;

        // Enhanced heuristic detection logic
        const isInteractive =
          e.target.tagName === "A" ||
          e.target.tagName === "BUTTON" ||
          e.target.tagName === "IMG" ||
          e.target.onclick ||
          e.target.hasAttribute("onclick") ||
          e.target.hasAttribute("href") ||
          e.target.hasAttribute("data-href") ||
          e.target.hasAttribute("data-link") ||
          e.isTrusted === false ||
          e.target.style.cursor === "pointer" ||
          e.target.getAttribute("role") === "button" ||
          e.target.className?.includes("btn") ||
          e.target.className?.includes("button") ||
          e.target.className?.includes("ad") ||
          e.target.className?.includes("video-layout_controls__rRx2z") ||
          e.target.className?.includes("selectextShadowHost") ||
          e.target.className?.includes("closeButton") ||
          e.target.className?.includes("IOarzRhPlPOverlay") ||
          e.target.className?.includes("absolute inset-0") ||
          e.target.className?.includes("gradient-shadow") ||
          e.target.className?.includes("overscroll-contain") ||
          e.target.id?.includes("dontfoid") ||
          e.target.id?.includes("ad") ||
          e.target.id?.includes("modal") ||
          e.target.id?.includes("closeButton") ||
          e.target.id?.includes("videoOverlay") ||
          e.target.parentElement?.className?.includes("ad") ||
          // Advanced detection for invisible overlay buttons
          (e.target.style.position === "absolute" &&
            (e.target.style.opacity === "0" ||
              parseFloat(e.target.style.opacity) < 0.1)) ||
          // Edge case detection
          e.clientX < 5 ||
          e.clientX > window.innerWidth - 5 ||
          e.clientY < 5 ||
          e.clientY > window.innerHeight - 5;

        // Content pattern detection
        const hasAdText = (el) => {
          const text = el.innerText || el.textContent || "";
          return popupPatterns.test(text);
        };

        // Check if the element or any parent has suspicious text
        const suspiciousText =
          hasAdText(e.target) ||
          hasAdText(e.target.parentElement) ||
          hasAdText(e.target.parentElement?.parentElement);

        if (isInteractive || suspiciousText) {
          e.stopPropagation();
          e.preventDefault();
          showAdOverlay();
          blockedActionsRef.current++;
          setBlockedCount((prev) => prev + 1);
          return false;
        }
      };

      // Add more event listeners for better coverage
      shield.addEventListener("click", handleInteraction, true);
      shield.addEventListener("mousedown", handleInteraction, true);
      shield.addEventListener("mouseup", handleInteraction, true);
      shield.addEventListener("dblclick", handleInteraction, true);
      shield.addEventListener("contextmenu", handleInteraction, true);
      shield.addEventListener("auxclick", handleInteraction, true); // Middle click
      shield.addEventListener("pointerdown", handleInteraction, true); // Touch & pen events
      // Add this event handler to your shield element to catch all clicks
      shield.addEventListener(
        "click",
        (e) => {
          const isLink = e.target.tagName === "A" || e.target.closest("a");
          if (isLink) {
            console.log("Blocked click on link in player area");
            e.preventDefault();
            e.stopPropagation();
            blockedActionsRef.current++;
            setBlockedCount((prev) => prev + 1);

            return false;
          }
          // Record the click location
          const clickX = e.clientX;
          const clickY = e.clientY;

          // After a short delay, check if location changed
          const currentUrl = window.location.href;
          setTimeout(() => {
            if (window.location.href !== currentUrl) {
              console.log("Detected redirect after click at", clickX, clickY);
              history.back();
              blockedActionsRef.current++;
              setBlockedCount((prev) => prev + 1);

              // Show the ad overlay
              showAdOverlay();
            }
          }, 100);
        },
        true
      );

      const observeDOM = () => {
        try {
          if (!iframeRef.current || !iframeRef.current.contentDocument) return;

          const doc = iframeRef.current.contentDocument;
          const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.addedNodes && mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                  // Check for specific problematic elements
                  if (node.nodeType === 1) {
                    // Immediate removal for known patterns
                    const shouldRemove =
                      // Hash-based classes
                      (node.className &&
                        /pl-[a-f0-9]{20,}__/.test(node.className)) ||
                      // Random IDs
                      (node.id && /^[a-z0-9]{6,8}$/.test(node.id)) ||
                      // Suspicious positioning
                      (node.style &&
                        node.style.position === "fixed" &&
                        parseInt(node.style.zIndex) > 1000000) ||
                      // Base64 content
                      (node.innerHTML &&
                        node.innerHTML.match(/[A-Za-z0-9+/]{20,}={0,2}/)) ||
                      // Suspicious domains
                      (node.href &&
                        (node.href.includes("rashcolonizeexpand.com") ||
                          node.href.includes("raggedstriking.com")));

                    if (shouldRemove) {
                      console.log(
                        "Immediately removing suspicious node:",
                        node
                      );
                      node.remove();
                      blockedActionsRef.current++;
                      setBlockedCount((prev) => prev + 1);
                    }
                    // Element node
                    // Check classes and IDs
                    if (
                      (node.className &&
                        typeof node.className === "string" &&
                        (node.className.includes("selectextShadowHost") ||
                          node.className.includes("IOarzRhPlPOverlay"))) ||
                      node.className.includes("absolute inset-0") ||
                      node.className.includes("dontfoid") ||
                      node.className.includes("video-layout_controls__rRx2z") ||
                      node.classname.includes(
                        "pl-d8e112f909ccf659971eeb2e95e5128c__btn"
                      ) ||
                      node.classname.includes(
                        "pl-d8e112f909ccf659971eeb2e95e5128c__finlink"
                      ) ||
                      node.classname.includes(
                        "pl-d8e112f909ccf659971eeb2e95e5128c_wrap"
                      ) ||
                      node.classname.includes(
                        "pl-d8e112f909ccf659971eeb2e95e5128c__desc"
                      ) ||
                      node.className.includes(
                        "pl-d8e112f909ccf659971eeb2e95e5128c__desc_wrap"
                      ) ||
                      node.className.includes("pl-") ||
                      node.className.includes(
                        "pl-d8e112f909ccf659971eeb2e95e5128c__content-block"
                      ) ||
                      (node.id &&
                        typeof node.id === "string" &&
                        node.id.includes("dontfoid")) ||
                      node.id.includes("videoOverlay") ||
                      node.id.includes("closeButton")
                    ) {
                      node.remove();
                      blockedActionsRef.current++;
                      setBlockedCount((prev) => prev + 1);
                    }

                    if (node.id === "videoOverlay") {
                      node.remove();
                      blockedActionsRef.current++;
                      setBlockedCount((prev) => prev + 1);
                    }

                    // Check for znid attribute
                    if (node.hasAttribute && node.hasAttribute("znid")) {
                      node.remove();
                      blockedActionsRef.current++;
                      setBlockedCount((prev) => prev + 1);
                    }

                    // Check for script elements with suspicious patterns
                    // Enhanced script scanning
                    if (node.tagName === "SCRIPT") {
                      const src = node.src || "";
                      const content = node.textContent || "";

                      // More aggressive script content scanning
                      if (
                        src.includes("intellipopup") ||
                        content.includes("popup-ads") ||
                        content.includes("window.open") ||
                        content.includes("_blank") ||
                        content.includes("target=") ||
                        content.includes("location.href") ||
                        src.includes("nannyirrationalacquainted") ||
                        src.includes("recordedthereby") ||
                        src.includes("storageimagedisplay") ||
                        src.includes("brightadnetwork") ||
                        src.includes("https://vidlink.pro") ||
                        src.includes("adserverDomain") ||
                        src.includes("qqsfafvkgsyto.online") ||
                        (node.id && node.id.includes("ads"))
                      ) {
                        node.remove();
                        blockedActionsRef.current++;
                        setBlockedCount((prev) => prev + 1);
                      }
                    }
                  }
                });
              }
            });
          });

          observer.observe(doc, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["class", "id", "style", "znid"],
          });

          return observer;
        } catch (e) {
          console.log("Error setting up DOM observer:", e);
          return null;
        }
      };

      // Deeper iframe protection strategies
      const enhanceIframe = () => {
        try {
          if (!iframeRef.current) return;

          // Track iframe loading attempts
          let frameLoadCounter = 0;

          // Apply CSP via meta tags when possible
          const addCSPToFrame = () => {
            try {
              if (!iframeRef.current.contentDocument) return;

              const meta = document.createElement("meta");
              meta.httpEquiv = "Content-Security-Policy";
              meta.content =
                "default-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data:; object-src 'none';";

              try {
                iframeRef.current.contentDocument.head.appendChild(meta);
              } catch (err) {
                console.log("Could not inject CSP");
              }

              // Try to inject a script to protect the frame from within
              const script = document.createElement("script");
              script.textContent = `
                (function() {
                  // Override window.open
                  window.open = function() { return null; };
                  
                  // Override dialog functions
                  window.alert = function() { return null; };
                  window.confirm = function() { return false; };
                  window.prompt = function() { return null; };
                  
                  // Prevent new windows
                  document.addEventListener('click', function(e) {
                    if (e.target.tagName === 'A' && e.target.target === '_blank') {
                      e.preventDefault();
                    }
                  }, true);
                  
                  // Monitor for dynamic iframe creation
                  const originalCreateElement = document.createElement;
                  document.createElement = function(tag) {
                    const el = originalCreateElement.call(document, tag);
                    if (tag.toLowerCase() === 'iframe') {
                      // Apply protection to new iframes
                      el.onload = function() {
                        try {
                          el.contentWindow.open = function() { return null; };
                        } catch(e) {}
                      };
                    }
                    return el;
                  };
                })();
              `;

              try {
                iframeRef.current.contentDocument.head.appendChild(script);
              } catch (err) {
                console.log("Could not inject protection script");
              }
            } catch (err) {
              console.log("Could not access iframe document");
            }
          };

          // Enhanced iframe protector
          iframeRef.current.addEventListener("load", () => {
            frameLoadCounter++;
            console.log(`Frame load attempt ${frameLoadCounter}`);

            try {
              // Apply advanced iframe protection
              const frameWindow = iframeRef.current.contentWindow;

              if (frameWindow) {
                // Try to override frame window.open
                // Use event listeners to intercept navigation attempts
                try {
                  frameWindow.addEventListener("beforeunload", function (e) {
                    blockedActionsRef.current++;
                    setBlockedCount((prev) => prev + 1);
                  });

                  frameWindow.addEventListener("hashchange", function (e) {
                    const newHash = frameWindow.location.hash;
                    if (popupPatterns.test(newHash)) {
                      console.log(
                        "Blocked suspicious hash navigation:",
                        newHash
                      );
                      blockedActionsRef.current++;
                      setBlockedCount((prev) => prev + 1);
                      e.preventDefault();
                    }
                  });

                  // Also try to intercept form submissions which can cause navigation
                  const originalSubmit = HTMLFormElement.prototype.submit;
                  HTMLFormElement.prototype.submit = function () {
                    console.log("Blocked form submission");
                    blockedActionsRef.current++;
                    setBlockedCount((prev) => prev + 1);
                    return false;
                  };

                  // Create a MutationObserver to watch for added forms and add submit event handlers
                  const formObserver = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                      if (mutation.addedNodes) {
                        mutation.addedNodes.forEach((node) => {
                          if (node.tagName === "FORM") {
                            node.addEventListener("submit", function (e) {
                              console.log("Blocked form submit event");
                              e.preventDefault();
                              blockedActionsRef.current++;
                              setBlockedCount((prev) => prev + 1);
                              return false;
                            });
                          }
                        });
                      }
                    });
                  });

                  // Start observing the document
                  formObserver.observe(frameWindow.document, {
                    childList: true,
                    subtree: true,
                  });
                } catch (e) {
                  console.log("Could not add navigation event listeners:", e);
                }

                // Try to override other potentially dangerous methods
                try {
                  frameWindow.alert = function () {
                    return null;
                  };
                  frameWindow.confirm = function () {
                    return false;
                  };
                  frameWindow.prompt = function () {
                    return null;
                  };
                } catch (e) {
                  console.log("Could not override frame dialogs");
                }

                // Try to detect and block popunder techniques
                try {
                  frameWindow.addEventListener("blur", function (e) {
                    console.log("Frame blur detected - potential popunder");
                    frameWindow.focus();
                    blockedActionsRef.current++;
                    setBlockedCount((prev) => prev + 1);
                  });
                } catch (e) {
                  console.log("Could not add blur listener");
                }
              }

              // Add CSP to the frame
              addCSPToFrame();
            } catch (err) {
              console.log("Protected frame access error:", err);
            }

            // Check for excessive reloads (popup technique)
            if (frameLoadCounter > 3) {
              console.log("Excessive frame reloads detected - freezing iframe");
              try {
                iframeRef.current.src = "about:blank";
              } catch (e) {}
            }
          });
          const observeSrcChanges = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.attributeName === "src") {
                // Handle src attribute changes here if needed
                console.log("iframe src changed");
              }
            });
          });
          // Dynamic pattern detection for hash-based class names
          const removeDynamicPatterns = () => {
            try {
              if (!iframeRef.current?.contentDocument) return;

              const doc = iframeRef.current.contentDocument;

              // Detect elements with hash-based class patterns
              const hashBasedElements = doc.querySelectorAll(
                '*[class*="pl-"][class*="__wrap"], *[class*="pl-"][class*="__content"], *[class*="pl-"][class*="__btn"], *[class*="pl-"][class*="__finlink"]'
              );

              hashBasedElements.forEach((el) => {
                // Check if class matches the pattern: pl-[hash]__[suffix]
                const classes = el.className.split(" ");
                const hasHashPattern = classes.some(
                  (cls) =>
                    /^pl-[a-f0-9]{32}__/.test(cls) ||
                    /^pl-[a-zA-Z0-9]{20,}__/.test(cls)
                );

                if (hasHashPattern) {
                  console.log("Removing hash-based ad element:", el.className);
                  el.remove();
                  blockedActionsRef.current++;
                  setBlockedCount((prev) => prev + 1);
                }
              });
            } catch (e) {
              console.log("Error removing dynamic patterns:", e);
            }
          };

          const removeKnownBadElements = () => {
            try {
              if (!iframeRef.current || !iframeRef.current.contentDocument)
                return;

              const doc = iframeRef.current.contentDocument;

              // Add more specific patterns and selectors
              const removeElementsByPattern = (pattern) => {
                // Try direct class lookup
                const elements1 = doc.getElementsByClassName(pattern);
                if (elements1 && elements1.length) {
                  for (let i = 0; i < elements1.length; i++) {
                    elements1[i].remove();
                    blockedActionsRef.current++;
                    setBlockedCount((prev) => prev + 1);
                  }
                }

                // Try with querySelector - more comprehensive selectors
                try {
                  const elements2 = doc.querySelectorAll(
                    `.${pattern}, #${pattern}, [class*="${pattern}"], [id*="${pattern}"], 
                     [class^="${pattern}"], [id^="${pattern}"], [class$="${pattern}"], [id$="${pattern}"],a[^="${pattern}"]`
                  );
                  if (elements2 && elements2.length) {
                    elements2.forEach((el) => {
                      el.remove();
                      blockedActionsRef.current++;
                      setBlockedCount((prev) => prev + 1);
                    });
                  }
                } catch (e) {
                  console.log(`Error with querySelector for ${pattern}:`, e);
                }
              };

              // More comprehensive element selection and removal
              try {
                // More comprehensive specific pattern targeting
                const znidElements = doc.querySelectorAll(
                  '[znid], [donto], [style*="z-index:"], [style*="position: absolute"][style*="z-index"], ' +
                    ".selectextShadowHost, .IOarzRhPlPOverlay, #videoOverlay, " +
                    '[class*="selectextShadowHost"], [class*="IOarzRhPlPOverlay"], ' +
                    '[id="videoOverlay"], [id*="videoOverlay"]'
                );

                if (znidElements && znidElements.length) {
                  znidElements.forEach((el) => {
                    el.remove();
                    blockedActionsRef.current++;
                    setBlockedCount((prev) => prev + 1);
                  });
                }

                // Target scripts more aggressively
                const suspiciousScripts = doc.querySelectorAll(
                  'script[src*="intellipopup"], script[src*="popup"], script[src*="ad"], ' +
                    'script[id*="ad"], script[class*="ad"], script[id*="popup-ads"], ' +
                    'script[type="text/javascript"][id*="ad"], script[src*="popcash"], script[src*="adserverDomain"], script[src*="qqsfafvkgsyto.online"], script[src*="nannyirrationalacquainted"], script[src*="recordedthereby"], script[src*="storageimagedisplay"], script[src*="brightadnetwork"], script[src*="https://vidlink.pro"]'
                );

                if (suspiciousScripts && suspiciousScripts.length) {
                  suspiciousScripts.forEach((el) => {
                    el.remove();
                    blockedActionsRef.current++;
                    setBlockedCount((prev) => prev + 1);
                  });
                }
              } catch (e) {
                console.log("Error removing znid elements:", e);
              }
              // Target these specific problematic elements
              removeElementsByPattern("IOarzRhPlPOverlay");
              removeElementsByPattern("selectextShadowHost");
              removeElementsByPattern("intellipopup");
              removeElementsByPattern("videoOverlay"); // Added for specific ID targeting
              removeElementsByPattern("dontfoid");
              removeElementsByPattern(
                "pl-d8e112f909ccf659971eeb2e95e5128c__wrap"
              );
              removeElementsByPattern(
                "pl-d8e112f909ccf659971eeb2e95e5128c__content-block"
              );
              removeElementsByPattern(
                "pl-d8e112f909ccf659971eeb2e95e5128c__btn"
              );
              removeElementsByPattern(
                "pl-d8e112f909ccf659971eeb2e95e5128c__finlink"
              );
              removeElementsByPattern(
                "pl-d8e112f909ccf659971eeb2e95e5128c__bt"
              );
              removeElementsByPattern(
                "container-d8e112f909ccf659971eeb2e95e5128c77821"
              );

              // Run a more frequent check on shadow DOM elements
              try {
                const allElements = doc.querySelectorAll("*");
                allElements.forEach((el) => {
                  // Check for shadow DOM
                  if (el.shadowRoot) {
                    // Find and remove elements in shadow DOM
                    const shadowElements = el.shadowRoot.querySelectorAll(
                      ".selectextShadowHost, .IOarzRhPlPOverlay, #videoOverlay, .pl-d8e112f909ccf659971eeb2e95e5128c__wrap, #dontfoid, .pl-d8e112f909ccf659971eeb2e95e5128c__content-block, .pl-d8e112f909ccf659971eeb2e95e5128c__btn, .pl-d8e112f909ccf659971eeb2e95e5128c__finlink, .pl-d8e112f909ccf659971eeb2e95e5128c__bt"
                    );
                    shadowElements.forEach((shadowEl) => {
                      shadowEl.remove();
                      blockedActionsRef.current++;
                      setBlockedCount((prev) => prev + 1);
                    });
                  }
                });
              } catch (e) {
                console.log("Shadow DOM cleaning error:", e);
              }
            } catch (e) {
              console.log("Error removing known bad elements:", e);
            }
          };
          const badElementsInterval = setInterval(() => {
            removeKnownBadElements();
            removeDynamicPatterns();
            detectSuspiciousOverlays();
          }, 100); // Faster detection
          clearInterval(badElementsInterval);
          // Monitor src attribute changes

          observeSrcChanges.observe(iframeRef.current, { attributes: true });

          // Add this to your code where the element detection is happening, inside the enhanceIframe function
          const removeInvisibleOverlays = () => {
            try {
              if (!iframeRef.current || !iframeRef.current.contentDocument)
                return;

              const doc = iframeRef.current.contentDocument;

              // Specifically target invisible overlay divs that span large portions of the page
              const overlaySelectors = [
                'div[style*="position:fixed"][style*="z-index:9999"]',
                'div[style*="position: fixed"][style*="z-index: 9999"]',
                'div[style*="position:absolute"][style*="z-index:9999"]',
                'div[style*="position: absolute"][style*="z-index: 9999"]',
                'div[style*="position:fixed"][style*="inset:"]',
                'div[style*="position: fixed"][style*="inset:"]',
                'div[style*="position:fixed"][style*="top:"][style*="left:"][style*="right:"][style*="bottom:"]',
                'div[style*="position: fixed"][style*="top:"][style*="left:"][style*="right:"][style*="bottom:"]',
                'div[style*="pointer-events:none"]',
                'div[style*="pointer-events: none"]',
                'div[style*="opacity:0"]',
                'div[style*="opacity: 0"]',
                'a[href="https://tylvixwbfkatd.site"]',
                'a[href="tlqjonbqwuwmp.online"]',
                'a[href="t"]',
                'a[href="https://brightadnetwork"]',
              ];

              const overlays = doc.querySelectorAll(overlaySelectors.join(","));

              if (overlays && overlays.length) {
                overlays.forEach((el) => {
                  console.log("Removing invisible overlay:", el);
                  el.remove();
                  blockedActionsRef.current++;
                  setBlockedCount((prev) => prev + 1);
                });
              }

              // Also block any element that takes up more than 50% of viewport and has fixed/absolute positioning
              const allDivs = doc.querySelectorAll("div");
              allDivs.forEach((div) => {
                const style = window.getComputedStyle(div);
                const position = style.position;

                if (position === "fixed" || position === "absolute") {
                  const rect = div.getBoundingClientRect();
                  const viewportWidth = window.innerWidth;
                  const viewportHeight = window.innerHeight;

                  // If the div takes up more than 50% of viewport in both dimensions
                  if (
                    rect.width > viewportWidth * 0.5 &&
                    rect.height > viewportHeight * 0.5
                  ) {
                    // Check if it has no visible content (often indicates overlay ad)
                    const hasVisibleContent =
                      div.innerText.trim().length > 0 ||
                      div.querySelectorAll("img, video, svg").length > 0;

                    if (!hasVisibleContent) {
                      console.log("Removing large overlay div:", div);
                      div.remove();
                      blockedActionsRef.current++;
                      setBlockedCount((prev) => prev + 1);
                    }
                  }
                }
              });
            } catch (e) {
              console.log("Error removing invisible overlays:", e);
            }
          };

          // Call this at regular intervals
          const overlayInterval = setInterval(removeInvisibleOverlays, 300);
          clearInterval(overlayInterval);
        } catch (err) {
          console.log("Could not enhance iframe:", err);
        }
      };

      // Add this function to your code to scan for and remove existing script tags
      const removeExistingScripts = () => {
        // Get all script tags in the document
        const scripts = document.querySelectorAll("script");

        scripts.forEach((script) => {
          if (blockScript(script)) {
            console.log(
              "Removing suspicious existing script:",
              script.src || "inline script"
            );
            script.remove();
            blockedActionsRef.current++;
            setBlockedCount((prev) => prev + 1);
          }
        });

        // Also check iframe documents if possible
        if (iframeRef.current && iframeRef.current.contentDocument) {
          try {
            const iframeScripts =
              iframeRef.current.contentDocument.querySelectorAll("script");
            iframeScripts.forEach((script) => {
              if (blockScript(script)) {
                console.log(
                  "Removing suspicious iframe script:",
                  script.src || "inline script"
                );
                script.remove();
                blockedActionsRef.current++;
                setBlockedCount((prev) => prev + 1);
              }
            });
          } catch (e) {
            console.log("Could not access iframe scripts:", e);
          }
        }
      };
      const scanForProblematicElements = () => {
        try {
          if (!iframeRef.current || !iframeRef.current.contentDocument) return;

          const doc = iframeRef.current.contentDocument;

          // Target all suspicious elements with comprehensive selectors
          const suspiciousSelectors = [
            '[class*="intellipopup"]',
            '[class*="IOarzRhPlPOverlay"]',
            '[class*="selectextShadowHos"]',
            '[class*="shadow"]',
            '[id*="videoOverlay"]',
            '[id*="dontfoid"]',
            '[id*="pl-d8e112f909ccf659971eeb2e95e5128c__wrap"]',
            '[id*="pl-d8e112f909ccf659971eeb2e95e5128c__content-block"]',
            '[id*="pl-d8e112f909ccf659971eeb2e95e5128c__btn"]',
            '[id*="pl-d8e112f909ccf659971eeb2e95e5128c__finlink"]',
            '[id*="pl-d8e112f909ccf659971eeb2e95e5128c__bt"]',
            '[class*="videoOverlay"]',
            '[class*="dontfoid"]',
            "[znid]",
            "[donto]",
            'div[style*="position: absolute"][style*="z-index"]',
            'iframe[style*="position: absolute"]',
            'script[src*="popcash"]',
            'script[src*="nannyirrationalacquainted"]',
            'script[src*="brightadnetwork"]',
            '[class*="container-d8e112f909ccf659971eeb2e95e5128c50290"]',
          ];

          const elements = doc.querySelectorAll(suspiciousSelectors.join(","));

          if (elements && elements.length) {
            elements.forEach((el) => {
              el.remove();
              blockedActionsRef.current++;
              setBlockedCount((prev) => prev + 1);
            });
          }
        } catch (e) {
          console.log("Error in scanForProblematicElements:", e);
        }
      };
      // Run this function frequently
      const scanInterval = setInterval(scanForProblematicElements, 200);

      // Apply iframe enhancement
      enhanceIframe();

      // MutationObserver to detect and remove ads or dangerous elements
      let observer = null;
      let domObserver = null;
      if (iframeRef.current) {
        iframeRef.current.addEventListener("load", () => {
          domObserver = observeDOM();
        });
      }

      const setupMutationObserver = () => {
        try {
          if (!iframeRef.current || !iframeRef.current.contentWindow) return;

          // Try to access iframe document directly
          let iframeDoc = null;
          try {
            iframeDoc =
              iframeRef.current.contentDocument ||
              iframeRef.current.contentWindow.document;
          } catch (e) {
            console.log("Cannot access iframe content directly");
          }

          if (iframeDoc) {
            observer = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                if (
                  mutation.type === "childList" &&
                  mutation.addedNodes.length
                ) {
                  mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                      // Advanced pattern detection for ads
                      const isAd =
                        node.id
                          ?.toLowerCase()
                          .match(
                            /ad|popup|overlay|banner|float|promo|sponsor|offer|selectextShadowHost|interstitial|closeButton|IOarzRhPlPOverlay|pl-d8e112f909ccf659971eeb2e95e5128c__wrap|dontfoid|container-d8e112f909ccf659971eeb2e95e5128c77821/i
                          ) ||
                        node.className
                          ?.toLowerCase()
                          .match(
                            /ad|popup|overlay|banner|float|promo|sponsor|offer|selectextShadowHost|closeButton|interstitial|IOarzRhPlPOverlay|pl-d8e112f909ccf659971eeb2e95e5128c__wrap|dontfoid}container-d8e112f909ccf659971eeb2e95e5128c50290/i
                          ) ||
                        node.style?.zIndex > 100 ||
                        node.style?.position === "fixed" ||
                        node.style?.position === "absolute" ||
                        (node.style?.width === "100%" &&
                          node.style?.height === "100%") ||
                        node.tagName === "IFRAME";

                      if (isAd) {
                        node.remove();
                        blockedActionsRef.current++;
                        setBlockedCount((prev) => prev + 1);
                      }

                      // Remove potentially dangerous scripts and links
                      if (node.tagName === "SCRIPT" && blockScript(node)) {
                        node.remove();
                        blockedActionsRef.current++;
                        setBlockedCount((prev) => prev + 1);
                      }

                      if (
                        node.tagName === "A" &&
                        (node.target === "_blank" ||
                          popupPatterns.test(node.href) ||
                          blockedDomainsPattern.test(node.href))
                      ) {
                        // Neutralize rather than remove
                        node.href = "javascript:void(0)";
                        node.target = "_self";
                        node.onclick = function (e) {
                          e.preventDefault();
                          return false;
                        };

                        blockedActionsRef.current++;
                        setBlockedCount((prev) => prev + 1);
                      }
                    }
                  });
                }

                // Check attribute changes for suspicious patterns
                if (
                  mutation.type === "attributes" &&
                  mutation.target.nodeType === 1
                ) {
                  const target = mutation.target;
                  const attrName = mutation.attributeName;

                  if (attrName === "href" || attrName === "src") {
                    const value = target.getAttribute(attrName) || "";

                    if (
                      popupPatterns.test(value) ||
                      blockedDomainsPattern.test(value)
                    ) {
                      console.log(`Blocked suspicious ${attrName}:`, value);
                      target.setAttribute(attrName, "javascript:void(0)");
                      blockedActionsRef.current++;
                      setBlockedCount((prev) => prev + 1);
                    }
                  }
                }
              });
            });

            observer.observe(iframeDoc.body, {
              childList: true,
              subtree: true,
              attributes: true,
              attributeFilter: [
                "style",
                "id",
                "class",
                "src",
                "href",
                "script",
                "type",
              ],
            });
          }
        } catch (err) {
          console.log("Cannot setup mutation observer:", err);
        }
      };

      if (iframeRef.current) {
        iframeRef.current.addEventListener("load", setupMutationObserver);
      }
      // Instead of directly overriding window.location methods, use this approach
      // Replace the protectPlayerControls function with this:

      const protectPlayerControls = () => {
        try {
          // Get all player elements and their children
          const playerElements = document.querySelectorAll(
            '.time-slider, .duration-150, .media-buffering\\:hidden, .-mt-0\\.5, [class*="controls"], [class*="container-d8e112f909ccf659971eeb2e95e5128c77821"], [class*="player"], video, audio',
            ".volume-slider",
            ".time-slider"
          );

          // Intercept navigation events rather than trying to override properties
          const navHandler = (e) => {
            console.log("Intercepted navigation attempt");
            e.preventDefault();
            e.stopPropagation();
            blockedActionsRef.current++;
            setBlockedCount((prev) => prev + 1);
            return false;
          };

          // Add event listeners for navigation events
          window.addEventListener("beforeunload", navHandler, true);
          window.addEventListener("unload", navHandler, true);

          // Monitor for clicks on the player controls
          const handleControlEvent = (e) => {
            // Check if this is a legitimate player action
            const isLegitimateAction = () => {
              if (
                e.target.tagName === "VIDEO" ||
                e.target.tagName === "AUDIO" ||
                e.target.className?.includes("play") ||
                e.target.className?.includes("pause") ||
                e.target.className?.includes("volume") ||
                e.target.className?.includes("fullscreen") ||
                e.target.className?.includes("time") ||
                e.target.className?.includes("progress") ||
                e.target.className?.includes("slider")
              ) {
                return true;
              }

              // Check for slider/progress controls
              const style = window.getComputedStyle(e.target);
              if (
                e.target.type === "range" ||
                (style.cursor === "pointer" &&
                  (e.target.className?.includes("slider") ||
                    e.target.parentElement?.className?.includes("slider") ||
                    e.target.parentElement?.parentElement?.className?.includes(
                      "slider"
                    )))
              ) {
                return true;
              }

              return false;
            };

            // If it's a legitimate player control, let it through but monitor for redirects
            if (isLegitimateAction()) {
              const beforeUrl = window.location.href;

              // Check after a short delay if navigation happened
              setTimeout(() => {
                if (window.location.href !== beforeUrl) {
                  console.log(
                    "Navigation detected after player action, reverting"
                  );
                  history.back();
                  blockedActionsRef.current++;
                  setBlockedCount((prev) => prev + 1);
                }
              }, 200);

              return true;
            }

            // For non-player controls, block suspicious elements
            const suspiciousAttrs =
              e.target.onclick ||
              e.target.getAttribute("onclick") ||
              e.target.href ||
              e.target.getAttribute("href") ||
              e.target.dataset.href;

            if (suspiciousAttrs) {
              console.log("Blocked suspicious click on player area element");
              e.stopPropagation();
              e.preventDefault();
              blockedActionsRef.current++;
              setBlockedCount((prev) => prev + 1);
              return false;
            }
          };

          // Apply event handlers to all player elements
          playerElements.forEach((el) => {
            el.addEventListener("click", handleControlEvent, true);
            el.addEventListener("mousedown", handleControlEvent, true);

            // Also apply to all children
            const children = el.querySelectorAll("*");
            children.forEach((child) => {
              child.addEventListener("click", handleControlEvent, true);
              child.addEventListener("mousedown", handleControlEvent, true);
            });
          });

          // Return cleanup function
          return {
            cleanup: () => {
              window.removeEventListener("beforeunload", navHandler, true);
              window.removeEventListener("unload", navHandler, true);

              playerElements.forEach((el) => {
                el.removeEventListener("click", handleControlEvent, true);
                el.removeEventListener("mousedown", handleControlEvent, true);

                const children = el.querySelectorAll("*");
                children.forEach((child) => {
                  child.removeEventListener("click", handleControlEvent, true);
                  child.removeEventListener(
                    "mousedown",
                    handleControlEvent,
                    true
                  );
                });
              });
            },
          };
        } catch (e) {
          console.log("Error in protectPlayerControls:", e);
          return { cleanup: () => {} };
        }
      };

      const playerControlsProtection = protectPlayerControls();
      // Clean up function
      return () => {
        isMounted = false;

        // Restore original functions
        window.open = originalFunctions.windowOpen;
        window.alert = originalFunctions.alert;
        window.confirm = originalFunctions.confirm;
        window.prompt = originalFunctions.prompt;
        window.setInterval = originalFunctions.setInterval;
        window.setTimeout = originalFunctions.setTimeout;
        window.requestAnimationFrame = originalFunctions.requestAnimationFrame;
        window.postMessage = originalFunctions.postMessage;
        document.createElement = originalFunctions.createElement;
        Element.prototype.appendChild = originalFunctions.appendChild;
        Element.prototype.insertBefore = originalFunctions.insertBefore;
        Element.prototype.setAttribute = originalFunctions.setAttribute;

        if (playerContainer) {
          shield.removeEventListener("click", handleInteraction, true);
          shield.removeEventListener("mousedown", handleInteraction, true);
          shield.removeEventListener("mouseup", handleInteraction, true);
          shield.removeEventListener("dblclick", handleInteraction, true);
          shield.removeEventListener("contextmenu", handleInteraction, true);
          shield.removeEventListener("auxclick", handleInteraction, true);
          shield.removeEventListener("pointerdown", handleInteraction, true);

          if (playerContainer.contains(shield)) {
            playerContainer.removeChild(shield);
          }

          if (playerContainer.contains(adOverlay)) {
            playerContainer.removeChild(adOverlay);
          }
        }

        if (observer) {
          observer.disconnect();
        }

        if (iframeRef.current) {
          iframeRef.current.removeEventListener("load", setupMutationObserver);
          iframeRef.current.removeEventListener("load", enhanceIframe);
        }

        clearTimeout(adTimeoutRef.current);
        clearInterval(scanInterval);
        if (playerControlsProtection && playerControlsProtection.cleanup) {
          playerControlsProtection.cleanup();
        }
      };
    }
  }, [streamingUrl, playerProtected, securityLevel]);

  // Enhanced location change prevention (continued)
  useEffect(() => {
    if (!playerProtected || !isPlaying) return;

    let originalLocation = window.location.href;
    let locationChangeAttempts = 0;
    const maxAllowedChanges = 3;

    // More robust URL/navigation blocking
    const blockNavigation = (url) => {
      // Advanced analysis of URL patterns
      const isEvil =
        popupPatterns.test(url) ||
        blockedDomainsPattern.test(url) ||
        url.indexOf("javascript:") === 0 ||
        url.indexOf("data:") === 0 ||
        url.indexOf("vbscript:") === 0 ||
        url.indexOf("about:") === 0 ||
        /\/\/(bit\.ly|goo\.gl|t\.co|tinyurl\.com)/.test(url);

      if (isEvil) {
        // console.log("Blocked navigation attempt:", url);
        blockedActionsRef.current++;
        setBlockedCount((prev) => prev + 1);
        return true;
      }

      return false;
    };

    const handleBeforeUnload = (event) => {
      const activeUrl = document.activeElement?.href || "";

      if (blockNavigation(activeUrl)) {
        // console.log("Blocked malicious navigation silently:", activeUrl);
        blockedActionsRef.current++;
        setBlockedCount((prev) => prev + 1);
        return; // Don't trigger browser prompt
      }

      if (locationChangeAttempts >= maxAllowedChanges && activeUrl) {
        // console.log("Blocked excessive navigation silently:", activeUrl);
        blockedActionsRef.current++;
        setBlockedCount((prev) => prev + 1);
        return;
      }

      // Allow all other cases including reload
    };

    // Use click event capture for deep interception
    const handleLinkClick = (event) => {
      // Find any link in the event path
      let currentElement = event.target;
      let url = "";

      // Traverse up to 5 levels looking for links
      for (let i = 0; i < 5; i++) {
        if (!currentElement) break;

        if (currentElement.tagName === "A") {
          url = currentElement.href || "";
          break;
        }

        // Check onclick handlers
        if (currentElement.getAttribute("onclick") || currentElement.onclick) {
          const onclickStr =
            currentElement.getAttribute("onclick") ||
            currentElement.onclick.toString();
          if (
            onclickStr.includes("window.open") ||
            onclickStr.includes("location")
          ) {
            url = "javascript:detected";
            break;
          }
        }

        currentElement = currentElement.parentElement;
      }
      const popupClassPatterns =
        /absolute inset-0|video-layout_controls__rRx2z|drawer|IOarzRhPlPOverlay|znid|selectextShadowHost/i;
      // Also check for other navigation techniques
      const isNavigationAttempt =
        event.target.tagName === "FORM" ||
        (event.target.getAttribute && event.target.getAttribute("data-href")) ||
        event.target.dataset?.url ||
        event.target.dataset?.target ||
        event.target.dataset?.link ||
        (event.target.className &&
          popupClassPatterns.test(event.target.className));

      if (url || isNavigationAttempt) {
        if (blockNavigation(url)) {
          locationChangeAttempts++;
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
        }
      }
    };

    // Handle history API abuse
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      const url = args[2]?.toString() || "";

      if (blockNavigation(url)) {
        return;
      }

      return originalPushState.apply(this, args);
    };

    history.replaceState = function (...args) {
      const url = args[2]?.toString() || "";

      if (blockNavigation(url)) {
        return;
      }

      return originalReplaceState.apply(this, args);
    };

    // Protection for location.href changes
    try {
      // Instead of trying to replace the method directly
      // Use Object.defineProperty on the location object itself
      const blockNavigation = (url) => {
        // Your URL blocking logic here
        return popupPatterns.test(url) || blockedDomainsPattern.test(url);
      };

      // Keep track of the original replace function
      const originalReplace = window.location.replace;

      // Define a proxy for the entire location object
      const locationProxy = new Proxy(window.location, {
        get: function (target, prop) {
          if (prop === "replace") {
            return function (url) {
              if (blockNavigation(url.toString())) {
                // console.log("Blocked location.replace to:", url);
                blockedActionsRef.current++;
                setBlockedCount((prev) => prev + 1);
                return;
              }
              locationChangeAttempts++;
              return originalReplace.call(target, url);
            };
          }
          return target[prop];
        },
      });

      // For iframe content window location
    } catch (e) {
      console.log("Could not override location methods:", e);
    }

    // Add the event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleLinkClick, true);
    document.addEventListener("auxclick", handleLinkClick, true); // Middle clicks
    document.addEventListener("mousedown", handleLinkClick, true); // Catch more events

    // Block popstate events which could trigger navigation
    window.addEventListener("popstate", (e) => {
      if (locationChangeAttempts >= maxAllowedChanges) {
        e.preventDefault();
        e.stopPropagation();
        history.pushState(null, "", originalLocation);
        // console.log("Blocked excessive navigation attempts");
        return false;
      }
    });

    // Detect multiple rapid navigations
    const checkExcessiveNavigation = setInterval(() => {
      if (locationChangeAttempts > 0) {
        locationChangeAttempts = Math.max(0, locationChangeAttempts - 1); // Slowly decay the counter
      }
    }, 5000);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleLinkClick, true);
      document.removeEventListener("auxclick", handleLinkClick, true);
      document.removeEventListener("mousedown", handleLinkClick, true);

      // Restore original history methods
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;

      // Restore location.replace
      try {
        window.location.replace = originalLocationReplace;
      } catch (e) {}

      // Explicitly set onbeforeunload to null again
      window.onbeforeunload = null;

      clearInterval(checkExcessiveNavigation);
    };
  }, [playerProtected, isPlaying]);

  // Add additional fingerprinting protection
  useEffect(() => {
    if (!playerProtected) return;

    const originalUserAgent = navigator.userAgent;
    const originalAppVersion = navigator.appVersion;
    const originalPlatform = navigator.platform;

    // Randomize client information slightly to break fingerprinting
    try {
      Object.defineProperty(navigator, "userAgent", {
        get: function () {
          return originalUserAgent.replace(
            /Chrome\/[\d\.]+/,
            "Chrome/" + (Math.floor(Math.random() * 5) + 90) + ".0.0.0"
          );
        },
      });

      Object.defineProperty(navigator, "appVersion", {
        get: function () {
          return originalAppVersion.replace(
            /[\d\.]+/,
            Math.floor(Math.random() * 5) + 90 + ".0.0.0"
          );
        },
      });

      // Other fingerprinting protections
      const originalGetParameter = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (
        contextType,
        contextAttributes
      ) {
        const context = originalGetParameter.call(
          this,
          contextType,
          contextAttributes
        );

        // Only add protection for 2d context used in fingerprinting
        if (contextType === "2d" && context) {
          const originalToDataURL = context.canvas.toDataURL;
          context.canvas.toDataURL = function (type) {
            // If called from a suspicious domain or in suspicious context, return slightly modified data
            if (
              document.referrer &&
              blockedDomainsPattern.test(document.referrer)
            ) {
              // Add random noise to the canvas to prevent stable fingerprinting
              const ctx = context;
              ctx.fillStyle = "rgba(255,255,255,0.001)";
              ctx.fillRect(0, 0, 1, 1);
            }

            return originalToDataURL.apply(this, arguments);
          };

          // Inject small amount of noise into text rendering for fingerprinting protection
          const originalFillText = context.fillText;
          context.fillText = function (text, x, y, maxWidth) {
            // Add a tiny, imperceptible offset to foil fingerprinting
            const offsetX = Math.random() * 0.001; // Extremely small value
            const offsetY = Math.random() * 0.001;

            return originalFillText.call(
              this,
              text,
              x + offsetX,
              y + offsetY,
              maxWidth
            );
          };
        }

        return context;
      };
    } catch (e) {
      // console.log("Could not apply fingerprinting protection");
    }

    return () => {
      try {
        Object.defineProperty(navigator, "userAgent", {
          get: () => originalUserAgent,
        });
        Object.defineProperty(navigator, "appVersion", {
          get: () => originalAppVersion,
        });
        Object.defineProperty(navigator, "platform", {
          get: () => originalPlatform,
        });
        HTMLCanvasElement.prototype.getContext = originalGetParameter;
      } catch (e) {}
    };
  }, [playerProtected]);

  // Add deep iframe inspection
  useEffect(() => {
    if (!playerProtected || !iframeRef.current) return;

    let isMounted = true;

    // Recursively scan and protect all iframes
    const scanForNestedIframes = () => {
      try {
        if (!iframeRef.current || !iframeRef.current.contentDocument) return;

        const processIframe = (iframe) => {
          // Get all nested iframes
          try {
            const iframeDoc =
              iframe.contentDocument || iframe.contentWindow?.document;

            if (!iframeDoc) return;

            // Find all iframes in this document
            const nestedFrames = iframeDoc.querySelectorAll("iframe");

            if (nestedFrames.length > 0) {
              // console.log(`Found ${nestedFrames.length} nested iframes`);

              // Apply protection to each nested iframe
              nestedFrames.forEach((nestedFrame) => {
                // Apply security attributes
                try {
                  nestedFrame.setAttribute("referrerpolicy", "no-referrer");

                  // Override window.open if we can
                  nestedFrame.addEventListener("load", () => {
                    try {
                      if (nestedFrame.contentWindow) {
                        nestedFrame.contentWindow.open = function () {
                          console.log("Nested iframe popup blocked");
                          blockedActionsRef.current++;
                          setBlockedCount((prev) => prev + 1);
                          return null;
                        };
                      }
                    } catch (e) {}

                    // Recursively process this iframe's content
                    processIframe(nestedFrame);
                  });
                } catch (e) {}

                // Check src for malicious patterns
                const src = nestedFrame.src || "";
                if (
                  blockedDomainsPattern.test(src) ||
                  popupPatterns.test(src)
                ) {
                  // console.log("Blocked suspicious nested iframe:", src);
                  nestedFrame.src = "about:blank";
                  blockedActionsRef.current++;
                  setBlockedCount((prev) => prev + 1);
                }
              });
            }
          } catch (e) {
            // CORS might prevent access
          }
        };

        // Start processing from the main iframe
        processIframe(iframeRef.current);
      } catch (e) {
        console.log("Error in iframe scanner:", e);
      }
    };

    // Initial scan
    scanForNestedIframes();

    // Set up interval to regularly scan for new iframes
    const scanInterval = setInterval(() => {
      if (isMounted) {
        scanForNestedIframes();
      }
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(scanInterval);
    };
  }, [playerProtected]);

  // Add advanced popup/tab tracking
  useEffect(() => {
    if (!playerProtected) return;

    let newWindowReferences = [];
    let hasFocus = true;

    // Track window focus state
    const handleVisibilityChange = () => {
      if (document.hidden) {
        hasFocus = false;

        // If we lost focus, check if a popup might have been opened
        setTimeout(() => {
          if (!hasFocus) {
            console.log("Focus lost - potential popup detected");
            // Force focus back
            window.focus();
          }
        }, 500);
      } else {
        hasFocus = true;
      }
    };

    // Popup and tab monitoring
    const monitorPopups = () => {
      // Try to keep track of any tabs that might have been opened
      for (let i = 0; i < newWindowReferences.length; i++) {
        try {
          // If we can still access it, close it
          if (!newWindowReferences[i].closed) {
            newWindowReferences[i].close();
            console.log("Closed detected popup window");
            blockedActionsRef.current++;
            setBlockedCount((prev) => prev + 1);
          }
        } catch (e) {
          // CORS might prevent access
        }
      }

      // Clear the array of closed windows
      newWindowReferences = newWindowReferences.filter((w) => {
        try {
          return !w.closed;
        } catch (e) {
          return false;
        }
      });
    };

    // Set up listener for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Set up interval to monitor popups
    const monitorInterval = setInterval(monitorPopups, 1000);

    // Advanced window.open override with reference tracking
    const originalWindowOpen = window.open;
    let openedWindows = [];

    window.open = function (...args) {
      const url = args[0]?.toString() || "";
      if (popupPatterns.test(url) || blockedDomainsPattern.test(url)) {
        // console.log("Blocked popup:", url);
        blockedActionsRef.current++;
        setBlockedCount((prev) => prev + 1);
        return null;
      }

      const newWindow = originalWindowOpen.apply(window, args);
      if (newWindow) {
        openedWindows.push(newWindow);
      }

      return newWindow;
    };

    // Periodically scan for opened windows
    setInterval(() => {
      openedWindows = openedWindows.filter((window) => !window.closed);
      openedWindows.forEach((win) => {
        try {
          if (win.closed) {
            return;
          }
          const winUrl = win.location.href;
          if (blockedDomainsPattern.test(winUrl)) {
            win.close();
            console.log("Closed malicious window:", winUrl);
            blockedActionsRef.current++;
            setBlockedCount((prev) => prev + 1);
          }
        } catch (e) {
          // Prevent cross-origin issues
        }
      });
    }, 1000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(monitorInterval);
      window.open = originalWindowOpen;
    };
  }, [playerProtected]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const details = await getMovieDetails(id, "movie");
        setMovie(details);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details");
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id, getMovieDetails]);

  useEffect(() => {
    // This will run once when the component mounts/loads
    window.onbeforeunload = null;
    // window.scrollTo(0, 0);
    return () => {
      // Clean up - ensure it's null when component unmounts
      window.onbeforeunload = null;
    };
  }, []);

  const handlePlayMovie = () => {
    const url = getStreamingUrl(id, "movie");
    setStreamingUrl(url);
    setIsPlaying(true);
    setBlockedCount(0); // Reset counter

    window.onbeforeunload = null;
    // Scroll to player with a smooth transition
    setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 400);
  };

  // Handle iframe events
  const handleIframeLoad = () => {
    window.onbeforeunload = null;

    handlePlayerLoaded();
    // Only block unloads for malicious URLs
    window.addEventListener("beforeunload", (event) => {
      // Allow normal page reloads
      if (event.currentTarget.location.href === window.location.href) {
        return undefined;
      }
    });
  };

  const handleServerChange = (server) => {
    const scrollPos = window.scrollY; // Step 1: Capture scroll

    switchServer(server);
    setBlockedCount(0);

    if (isPlaying) {
      setPlayerLoading(true);

      // Store scroll to restore later
      scrollRestoreRef.current = scrollPos;

      const url = getStreamingUrl(id, "movie", null, null, server);
      setStreamingUrl(url);
    }
  };

  const closeAdOverlay = () => {
    setAdOverlayActive(false);
    const adOverlay = playerContainerRef.current?.querySelector(
      ".ad-overlay-blocker"
    );
    if (adOverlay) {
      adOverlay.style.display = "none";
    }
    if (adTimeoutRef.current) {
      clearTimeout(adTimeoutRef.current);
    }
  };

  const handlePlayClick = () => {
    const watchSection = document.getElementById("Server2");
    if (watchSection) {
      // Add a small delay to ensure DOM is ready
      setTimeout(() => {
        // Scrolling to element with offset value
        const yOffset = -200;
        const y =
          watchSection.getBoundingClientRect().top +
          window.pageYOffset +
          yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }, 100);
    }
  };
  // Add timeout fallback for iframe loading
  useEffect(() => {
    if (playerLoading && streamingUrl) {
      const timeout = setTimeout(() => {
        console.log("Iframe load timeout - forcing player loaded");
        setPlayerLoading(false);
      }, 8000); // 8 second timeout

      return () => clearTimeout(timeout);
    }
  }, [playerLoading, streamingUrl]);
  // Return main component
  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white pt-24 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold text-red-500">{error}</h2>
          <p className="mt-2 text-gray-400">Unable to load movie information</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return null;
  }
  return (
    <>
    <HelmetProvider>
      <meta name="referrer" content="origin" />
      <script async="async" data-cfasync="false" src="//pl27292121.profitableratecpm.com/d462e4cf49daea77f391535f1e045eb0/invoke.js"></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-QKRDMZMXVJ');
        `}
      </script>
      </HelmetProvider>
      <div ref={topRef} className="min-h-screen bg-gray-900 text-white pb-16">
        <div id="container-d462e4cf49daea77f391535f1e045eb0"></div>
        {/* Hero Section */}
        <MovieDetailHero
          movie={movie}
          onPlayClick={handlePlayClick}
          // No need to pass streamingUrl here
        />
        <div id="container-d462e4cf49daea77f391535f1e045eb0"></div>
        
        {/* Movie Information */}
        <div className="container mx-auto px-4 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Video Player and Details */}
            <div className="lg:col-span-2">
              {/* Video Player (Only shown when play button is clicked) */}
              {streamingUrl && (
                <div
                  ref={playerRef}
                  className="mb-8 bg-gray-800 rounded-lg overflow-hidden shadow-xl"
                >
                  <div
                    ref={playerContainerRef}
                    className="relative w-full pt-0"
                    style={{
                      paddingBottom: "56.25%",
                      overflow: "hidden", // Prevent scrollbar flickering
                    }}
                  >
                    <iframe
                      ref={iframeRef}
                      src={streamingUrl}
                      className="absolute top-0 left-0 w-full h-full"
                      allowFullScreen
                      title={movie.title || movie.name}
                      onLoad={handleIframeLoad}
                      loading="eager"
                      importance="high"
                      referrerpolicy="origin"
                      allow="fullscreen"
                      style={{ border: "none" }}
                      key={`${streamingUrl}-${activeServer}`} // Add this to force re-render with new URL
                    ></iframe>

                    {playerLoading && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
                        <div className="text-center">
                          <LoaderIcon className="animate-spin h-10 w-10 text-blue-500 mx-auto" />
                          <p className="text-white mt-3">Loading player...</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-900 px-4 py-3">
                    <div className="flex flex-wrap justify-between items-center">
                      <div className="flex items-center">
                        <p className="text-sm text-gray-400">
                          Now Playing: {movie.title || movie.name}
                        </p>
                      </div>

                      <div className="flex items-center mt-2 sm:mt-0">
                        <p className="text-sm text-gray-400">
                          Server:{" "}
                          {activeServer === "server1" ? "Server 1" : "Server 2"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Server Selection - Smaller UI */}
              <div className="bg-gray-800 rounded-lg p-4 mb-6" id="Server2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-medium flex items-center">
                    <Server size={16} className="mr-2" />
                    Select Server
                  </h3>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleServerChange("server1")}
                      className={`py-1 px-3 text-center rounded-md text-sm transition-all ${
                        activeServer === "server1"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      Server 1
                    </button>

                    <button
                      onClick={() => handleServerChange("server2")}
                      className={`py-1 px-3 text-center rounded-md text-sm transition-all ${
                        activeServer === "server2"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      Server 2
                    </button>
                  </div>
                </div>

                {/* Watch Movie Button */}
                <button
                  onClick={handlePlayMovie}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center text-base font-medium transition-all"
                >
                  <Play size={18} className="mr-2" />
                  Watch Movie Now
                </button>
              </div>
<div id="container-d462e4cf49daea77f391535f1e045eb0"></div>
              {/* Movie Overview */}
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <h3 className="text-base font-medium mb-3">Overview</h3>
                <p className="text-gray-300 text-sm">
                  {movie.overview || "No overview available."}
                </p>
              </div>

              {/* Mobile-only Movie Information - Will show on mobile, hidden on desktop */}
              <div className="lg:hidden">
                {/* Movie Info */}
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                  <h3 className="text-base font-medium mb-3">
                    Movie Information
                  </h3>

                  <div className="space-y-2 text-sm">
                    {movie.release_date && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Release Date:</span>
                        <span>
                          {new Date(movie.release_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {movie.runtime && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Runtime:</span>
                        <span>
                          {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}
                          m
                        </span>
                      </div>
                    )}

                    {movie.vote_average && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rating:</span>
                        <span>{movie.vote_average.toFixed(1)}/10</span>
                      </div>
                    )}

                    {movie.budget > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Budget:</span>
                        <span>${movie.budget.toLocaleString()}</span>
                      </div>
                    )}

                    {movie.revenue > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Revenue:</span>
                        <span>${movie.revenue.toLocaleString()}</span>
                      </div>
                    )}

                    {movie.original_language && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Language:</span>
                        <span>{movie.original_language.toUpperCase()}</span>
                      </div>
                    )}

                    {movie.status && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span>{movie.status}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Genres - Mobile */}
                {movie.genres && movie.genres.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <h3 className="text-base font-medium mb-3">Genres</h3>

                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="px-3 py-1 bg-blue-800/50 text-blue-100 border border-blue-700 rounded-full text-xs"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Production Companies - Mobile */}
                {movie.production_companies &&
                  movie.production_companies.length > 0 && (
                    <div className="bg-gray-800 rounded-lg p-4 mb-6">
                      <h3 className="text-base font-medium mb-3">Production</h3>

                      <div className="space-y-2 text-sm">
                        {movie.production_companies.map((company) => (
                          <div
                            key={company.id}
                            className="flex items-center text-gray-300 py-1"
                          >
                            {company.logo_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                                alt={company.name}
                                className="h-5 mr-2 object-contain"
                              />
                            ) : (
                              <Film size={16} className="mr-2 text-gray-400" />
                            )}
                            <span className="ml-2">{company.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Movie Cast */}
              <MovieCast cast={movie.credits?.cast} />

              {/* Enhanced Security Info - Moved inside the Left Column */}
              <div className="bg-gray-800 rounded-lg overflow-hidden mb-6 mt-6">
                <div className="bg-blue-900/40 p-4 border-b border-blue-800">
                  <h2 className="text-lg font-bold text-blue-200 mb-2 flex items-center">
                    <ShieldCheck className="mr-2 text-blue-400" size={20} />
                    For PC/Laptop Users: Get a Seamless Viewing Experience
                  </h2>
                  <p className="text-blue-100">
                    Although we've tried our hardest to prevent or minimize
                    popup ads, our servers depend on some advertisements to
                    operate. For the best experience, we recommend installing
                    the uBlock Origin extension.
                  </p>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-4 text-blue-300 flex items-center">
                    <Download className="mr-2" size={20} />
                    Install uBlock Origin
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <a
                      href="https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm"
                      target="_blank"
                      rel="noopener"
                      className="flex items-center p-4 bg-blue-900/30 border border-blue-800/50 rounded-lg hover:bg-blue-900/50 transition"
                    >
                      <Chrome
                        className="text-blue-400 mr-3 flex-shrink-0"
                        size={24}
                      />
                      <div>
                        <h4 className="font-medium text-blue-200">
                          Chrome Web Store
                        </h4>
                        <p className="text-sm text-blue-300">
                          Chrome, Edge, Brave, etc.
                        </p>
                      </div>
                      <ExternalLink
                        size={16}
                        className="ml-auto text-blue-400"
                      />
                    </a>

                    <a
                      href="https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/"
                      target="_blank"
                      rel="noopener"
                      className="flex items-center p-4 bg-blue-900/30 border border-blue-800/50 rounded-lg hover:bg-blue-900/50 transition"
                    >
                      <Globe
                        className="text-blue-400 mr-3 flex-shrink-0"
                        size={24}
                      />
                      <div>
                        <h4 className="font-medium text-blue-200">
                          Firefox Add-ons
                        </h4>
                        <p className="text-sm text-blue-300">Firefox browser</p>
                      </div>
                      <ExternalLink
                        size={16}
                        className="ml-auto text-blue-400"
                      />
                    </a>
                  </div>

                  <div className="border border-blue-800/50 rounded-lg overflow-hidden bg-blue-900/20 mt-6">
                    <div className="p-4 bg-blue-800/30">
                      <h3 className="text-lg font-medium text-blue-200 flex items-center">
                        <HelpCircle size={18} className="mr-2" />
                        Installation Guides
                      </h3>
                    </div>

                    <div className="p-5">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-medium text-blue-300 mb-3">
                            Chrome / Edge Installation
                          </h4>
                          <ol className="list-decimal pl-5 space-y-2 text-blue-100">
                            <li>
                              Visit the{" "}
                              <a
                                href="https://chrome.google.com/webstore/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm"
                                target="_blank"
                                rel="noopener"
                                className="text-blue-400 underline"
                              >
                                Chrome Web Store
                              </a>
                            </li>
                            <li>Click "Add to Chrome"</li>
                            <li>
                              Confirm by clicking "Add extension" in the popup
                            </li>
                            <li>
                              You'll see the uBlock Origin icon appear in your
                              toolbar
                            </li>
                          </ol>
                        </div>

                        <div>
                          <h4 className="font-medium text-blue-300 mb-3">
                            Firefox Installation
                          </h4>
                          <ol className="list-decimal pl-5 space-y-2 text-blue-100">
                            <li>
                              Visit the{" "}
                              <a
                                href="https://addons.mozilla.org/en-US/firefox/addon/ublock-origin/"
                                target="_blank"
                                rel="noopener"
                                className="text-blue-400 underline"
                              >
                                Firefox Add-ons
                              </a>{" "}
                              page
                            </li>
                            <li>Click "Add to Firefox"</li>
                            <li>Click "Add" in the confirmation dialog</li>
                            <li>
                              The uBlock Origin icon will appear in your browser
                              toolbar
                            </li>
                          </ol>
                        </div>

                        <div>
                          <h4 className="font-medium text-blue-300 mb-3">
                            Manual Installation (Advanced)
                          </h4>
                          <ol className="list-decimal pl-5 space-y-2 text-blue-100">
                            <li>
                              Download the latest release from{" "}
                              <a
                                href="https://github.com/gorhill/uBlock/releases"
                                target="_blank"
                                rel="noopener"
                                className="text-blue-400 underline"
                              >
                                GitHub
                              </a>
                            </li>
                            <li>Extract the downloaded zip file to a folder</li>
                            <li>
                              In your browser, go to the extensions page (e.g.,{" "}
                              <code className="bg-blue-900/60 px-2 py-1 rounded">
                                chrome://extensions
                              </code>
                              )
                            </li>
                            <li>
                              Enable "Developer mode" using the toggle in the
                              top-right corner
                            </li>
                            <li>
                              Click "Load unpacked" and select the extracted
                              folder
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Additional Info - Hidden on mobile */}
            <div className="hidden lg:block">
              {/* Movie Info */}
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <h3 className="text-base font-medium mb-3">
                  Movie Information
                </h3>

                <div className="space-y-2 text-sm">
                  {movie.release_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Release Date:</span>
                      <span>
                        {new Date(movie.release_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {movie.runtime && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Runtime:</span>
                      <span>
                        {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                      </span>
                    </div>
                  )}

                  {movie.vote_average && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Rating:</span>
                      <span>{movie.vote_average.toFixed(1)}/10</span>
                    </div>
                  )}

                  {movie.budget > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Budget:</span>
                      <span>${movie.budget.toLocaleString()}</span>
                    </div>
                  )}

                  {movie.revenue > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Revenue:</span>
                      <span>${movie.revenue.toLocaleString()}</span>
                    </div>
                  )}

                  {movie.original_language && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Language:</span>
                      <span>{movie.original_language.toUpperCase()}</span>
                    </div>
                  )}

                  {movie.status && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span>{movie.status}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Production Companies - Moved right after Movie Info */}
              {movie.production_companies &&
                movie.production_companies.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <h3 className="text-base font-medium mb-3">Production</h3>

                    <div className="space-y-2 text-sm">
                      {movie.production_companies.map((company) => (
                        <div
                          key={company.id}
                          className="flex items-center text-gray-300 py-1"
                        >
                          {company.logo_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                              alt={company.name}
                              className="h-5 mr-2 object-contain"
                            />
                          ) : (
                            <Film size={16} className="mr-2 text-gray-400" />
                          )}
                          <span className="ml-2">{company.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                  <h3 className="text-base font-medium mb-3">Genres</h3>

                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-blue-800/50 text-blue-100 border border-blue-700 rounded-full text-xs"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Similar Movies - Outside grid layout, full width */}
          {movie.similar &&
            movie.similar.results &&
            movie.similar.results.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-4 mt-6">
                <h3 className="text-lg font-medium mb-4">Related Movies</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {movie.similar.results.slice(0, 10).map((similar) => (
                    <a
                      key={similar.id}
                      href={`/movie/${similar.id}`}
                      className="block bg-gray-700 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                    >
                      {similar.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300${similar.poster_path}`}
                          alt={similar.title}
                          className="w-full h-auto"
                          loading="lazy"
                        />
                      ) : (
                        <div className="bg-gray-600 w-full pt-[150%] flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            No Image
                          </span>
                        </div>
                      )}
                      <div className="p-3">
                        <h4 className="text-sm font-medium truncate">
                          {similar.title}
                        </h4>
                        {similar.release_date && (
                          <p className="text-gray-400 text-xs mt-1">
                            {similar.release_date.split("-")[0]}
                          </p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default MoviePage;
