import React, { useEffect } from "react";

const HorizontalAd = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <ins className="adsbygoogle"
         style={{ display: "block" }}
         data-ad-client="ca-pub-8779876482236769"
         data-ad-slot="9980651939"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
  );
};

export default HorizontalAd;
