var zxState=function(){"use strict";return(t,e)=>{var r=!1;const n=t=>{var s={};return{set:t=>{s=Object.assign({},s,t),r||(r=!r,setTimeout(t=>{r=!r,e()}))},with:(t=>e=>"function"==typeof e?t(e):Object.keys(e).reduce((r,n)=>(r[n]=t(e[n]),r),{}))(t=>(...e)=>t(s,...e)),sync:(t,...e)=>t(n(),...e)}};return t(n())}}();
//# sourceMappingURL=zx-state.umd.js.map
