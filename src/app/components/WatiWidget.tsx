"use client";
import { useEffect } from 'react';

const WatiWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://wati-integration-prod-service.clare.ai/v2/watiWidget.js?23547';
    script.async = true;

    script.onload = () => {
      const options = {
        enabled: true,
        chatButtonSetting: {
          backgroundColor: '#00e785',
          ctaText: 'We are here to help! ',
          borderRadius: '25',
          marginLeft: '0',
          marginRight: '20',
          marginBottom: '20',
          ctaIconWATI: false,
          position: 'right',
        },
        brandSetting: {
          brandName: 'Fantastic Fare',
          brandSubTitle: 'undefined',
          brandImg:
            'https://scontent.fdel25-4.fna.fbcdn.net/v/t39.30808-6/495689555_122130250604718861_64407029407543830_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=_uOXe8Qw3z4Q7kNvwEU0WRy&_nc_oc=Adk8bMIwpOBYOns9DaMi706rqiiQ1PJ5lm7o2A1zERNLS9NvyZiT6kbSAg62WcvGpnk&_nc_zt=23&_nc_ht=scontent.fdel25-4.fna&_nc_gid=-FUqvXuBKdliJygkGqwoIQ&oh=00_AfJeDGY_x81SMJGNkpkq0Vlvk_g1uP2UYum-NP-r1yPuXQ&oe=68256CAD',
          welcomeText: 'Planning your next trip? Let us assist!',
          messageText: 'Hello, I am planning my trip {{page_link}}, can you help me getter deals',
          backgroundColor: '#00e785',
          ctaText: 'We are here to help! ',
          borderRadius: '25',
          autoShow: false,
          phoneNumber: '18334227770',
        },
      };

      // @ts-ignore
      if (typeof CreateWhatsappChatWidget !== 'undefined') {
        // @ts-ignore
        CreateWhatsappChatWidget(options);
      }
    };

    document.body.appendChild(script);
  }, []);

  return null; // No visible component
};

export default WatiWidget;
