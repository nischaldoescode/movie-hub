import React, { useEffect, useState } from "react"

const SideAd = () => {
  const [adStatus, setAdStatus] = useState('Loading...')

  useEffect(() => {
    const pushAd = () => {
      try {
        const adsbygoogle = window.adsbygoogle
        console.log('AdSense object:', adsbygoogle)
        
        if (adsbygoogle && adsbygoogle.loaded) {
          adsbygoogle.push({})
          setAdStatus('Ad pushed successfully')
        } else {
          setAdStatus('AdSense not loaded')
        }
      } catch (e) {
        console.error('AdSense error:', e)
        setAdStatus(`Error: ${e.message}`)
      }
    }

    let interval = setInterval(() => {
      if (window.adsbygoogle) {
        pushAd()
        clearInterval(interval)
      }
    }, 300)

    setTimeout(() => {
      clearInterval(interval)
      if (adStatus === 'Loading...') {
        setAdStatus('Timeout - AdSense not loaded')
      }
    }, 10000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return (
    <div>
      <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        Ad Status: {adStatus}
      </div>
      <ins className="adsbygoogle"
           style={{ display: "block" }}
           data-ad-client="ca-pub-8779876482236769"
           data-ad-slot="9980651939"
           data-ad-format="auto"
           data-full-width-responsive="true">
      </ins>
    </div>
  )
}

export default SideAd
