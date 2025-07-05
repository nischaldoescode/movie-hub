import React, { useEffect } from "react"

const SideAd = () => {
  useEffect(() => {
    const pushAd = () => {
      try {
        const adsbygoogle = window.adsbygoogle
        console.log({ adsbygoogle })
        if (adsbygoogle && adsbygoogle.loaded) {
          adsbygoogle.push({})
        }
        
      } catch (e) {
        console.error('AdSense error:', e)
      }
    }

    let interval = setInterval(() => {
      if (window.adsbygoogle) {
        pushAd()
        clearInterval(interval)
      }
    }, 300)

    // Cleanup after 10 seconds if ad doesn't load
    setTimeout(() => {
      clearInterval(interval)
    }, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
<ins className="adsbygoogle"
     style={{ display: "block" }}
     data-ad-client="ca-pub-8779876482236769"
     data-ad-slot="4571013785"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
  )
}

export default SideAd
