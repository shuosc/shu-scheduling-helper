import MobileDetect from 'mobile-detect';

const md = new MobileDetect(navigator.userAgent);
location.replace(md.phone() == null ? '/index.html' : '/mobile.html');
