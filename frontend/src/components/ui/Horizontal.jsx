import React, { useEffect, useState } from "react"

const SideAd = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0)
  const [allFailed, setAllFailed] = useState(false)

  // Your 4 ad units
  const adUnits = [
    "9980651939", // First ad unit
    "4571013785", // Second ad unit  
    "2413153108", // Third ad unit
    "1356341862"  // Fourth ad unit
  ]

  useEffect(() => {
    const tryNextAd = (index) => {
      if (index >= adUnits.length) {
        console.log('All ad units failed')
        setAllFailed(true)
        return
      }

      setCurrentAdIndex(index)
      console.log(`Trying ad unit ${index + 1}/${adUnits.length}`)

      // Wait a bit for the ad to load, then check if it's filled
      setTimeout(() => {
        const adElement = document.querySelector('.adsbygoogle')
        const adStatus = adElement?.getAttribute('data-ad-status')
        
        console.log(`Ad unit ${index + 1} status:`, adStatus)
        
        if (adStatus === 'unfilled') {
          console.log(`Ad unit ${index + 1} unfilled, trying next...`)
          // Clear the current ad and try the next one
          if (adElement) {
            adElement.innerHTML = ''
            adElement.removeAttribute('data-ad-status')
          }
          setTimeout(() => tryNextAd(index + 1), 1000)
        } else if (adStatus === 'filled') {
          console.log(`Ad unit ${index + 1} loaded successfully`)
        } else {
          // If status is not set yet, wait a bit more
          setTimeout(() => {
            const newStatus = adElement?.getAttribute('data-ad-status')
            if (newStatus === 'unfilled') {
              tryNextAd(index + 1)
            } else if (newStatus === 'filled') {
              console.log(`Ad unit ${index + 1} loaded successfully`)
            } else {
              // If still no status after waiting, try next ad
              console.log(`Ad unit ${index + 1} timeout, trying next...`)
              tryNextAd(index + 1)
            }
          }, 2000)
        }
      }, 3000) // Wait 3 seconds for ad to load
    }

    const initializeAds = () => {
      if (window.adsbygoogle) {
        try {
          window.adsbygoogle.push({})
          tryNextAd(0)
        } catch (e) {
          console.error('AdSense error:', e)
        }
      }
    }

    // Wait for AdSense to load
    let interval = setInterval(() => {
      if (window.adsbygoogle) {
        initializeAds()
        clearInterval(interval)
      }
    }, 300)

    // Cleanup after 30 seconds
    setTimeout(() => {
      clearInterval(interval)
    }, 30000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  // Don't render anything if all ads failed
  if (allFailed) {
    return null
  }

  return (
    <ins className="adsbygoogle"
         style={{ display: "block" }}
         data-ad-client="ca-pub-8779876482236769"
         data-ad-slot={adUnits[currentAdIndex]}
         data-ad-format="auto"
         data-full-width-responsive="true">
    </ins>
  )
}

export default SideAd
