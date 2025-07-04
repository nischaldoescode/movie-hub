import React, { useEffect, useRef, useState } from "react"

const SideAd = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [allFailed, setAllFailed] = useState(false)
  const adRef = useRef(null)
  const adUnits = [
    "9980651939",
    "4571013785",
    "2413153108",
    "1356341862"
  ]

  useEffect(() => {
    let retryTimeout
    let loadTimeout

    const tryNextAd = (index) => {
      if (index >= adUnits.length) {
        console.log("All ad units failed")
        setAllFailed(true)
        return
      }

      setCurrentAdIndex(index)

      // Delay slightly before checking ad status
      loadTimeout = setTimeout(() => {
        const adElement = adRef.current
        const adStatus = adElement?.getAttribute("data-ad-status")

        console.log(`Ad unit ${index + 1} status:`, adStatus)

        if (adStatus === "filled") {
          console.log(`Ad unit ${index + 1} loaded successfully`)
        } else if (adStatus === "unfilled") {
          console.log(`Ad unit ${index + 1} unfilled, trying next...`)
          setTimeout(() => tryNextAd(index + 1), 1000)
        } else {
          // Retry in case of delayed load or no status yet
          retryTimeout = setTimeout(() => {
            const newStatus = adRef.current?.getAttribute("data-ad-status")
            if (newStatus === "filled") {
              console.log(`Ad unit ${index + 1} finally loaded`)
            } else {
              console.log(`Ad unit ${index + 1} failed after timeout`)
              tryNextAd(index + 1)
            }
          }, 2000)
        }
      }, 3000)
    }

    const initializeAds = () => {
      tryNextAd(0)
    }

    const checkAdSenseReady = () => {
      if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
        initializeAds()
        return true
      }
      return false
    }

    const interval = setInterval(() => {
      if (checkAdSenseReady()) {
        clearInterval(interval)
      }
    }, 300)

    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, 30000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
      clearTimeout(loadTimeout)
      clearTimeout(retryTimeout)
    }
  }, [])

  // Push adsbygoogle every time ad index changes
  useEffect(() => {
    if (!allFailed && window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
      try {
        window.adsbygoogle.push({})
      } catch (e) {
        console.error("Adsbygoogle push error:", e)
      }
    }
  }, [currentAdIndex, allFailed])

  if (allFailed) return null

  return (
    <ins
      className="adsbygoogle"
      ref={adRef}
      style={{ display: "block" }}
      data-ad-client="ca-pub-8779876482236769"
      data-ad-slot={adUnits[currentAdIndex]}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}

export default SideAd
