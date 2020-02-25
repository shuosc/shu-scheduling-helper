import MobileDetect from 'mobile-detect';

const md = new MobileDetect(navigator.userAgent);
location.replace(md.mobile() === null ? '/index.html' : '/m.html');
