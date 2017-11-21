var zxState=function(){"use strict";return(t,e)=>{var r=!1;const n=t=>e=>"function"==typeof e?t(e):Object.keys(e).reduce((r,n)=>(r[n]=t(e[n]),r),{}),s=t=>{var c={};return{set:t=>{c=Object.assign({},c,t),r||(r=!r,setTimeout(t=>{r=!r,e()}))},with:n(t=>(...e)=>t(c,...e)),sync:n(t=>t(s()))}};return t(s())}}();
//# sourceMappingURL=zx-state.umd.js.map
