import{d as n,j as e}from"./main-F7ziLQoi.js";/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]],p=n("arrow-left",g);/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],j=n("arrow-right",f);/**
 * @license lucide-react v0.503.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],w=n("circle-alert",v),u=({currentPage:s,totalPages:m,onPageChange:i})=>{const r=Math.min(m,500),y=()=>{s>=r?i(1):i(s+1)},b=()=>{s<=1?i(r):i(s-1)},h=()=>{const t=[],o=Math.floor(2.5);let l=Math.max(1,s-o),c=Math.min(r,l+5-1);c-l+1<5&&(l=Math.max(1,c-5+1));for(let x=l;x<=c;x++)t.push(x);return t},a=({page:t,isActive:d,onClick:o})=>e.jsx("button",{onClick:()=>o(t),className:`relative inline-flex items-center px-4 py-2 border ${d?"z-10 bg-blue-600 border-blue-500 text-white":"border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700"}`,children:t});return e.jsx("div",{className:"flex justify-center mt-8 mb-4",children:e.jsxs("div",{className:"flex items-center rounded-md shadow-sm",children:[e.jsxs("button",{onClick:b,className:"relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 border border-gray-700 bg-gray-800 hover:bg-gray-700",children:[e.jsx(p,{className:"h-4 w-4 mr-1"}),"Previous"]}),s>3&&e.jsxs(e.Fragment,{children:[e.jsx(a,{page:1,isActive:s===1,onClick:i}),s>4&&e.jsx("span",{className:"relative inline-flex items-center px-2 py-2 border border-gray-700 bg-gray-800 text-gray-300",children:"..."})]}),h().map(t=>e.jsx(a,{page:t,isActive:s===t,onClick:i},t)),s<r-2&&e.jsxs(e.Fragment,{children:[s<r-3&&e.jsx("span",{className:"relative inline-flex items-center px-2 py-2 border border-gray-700 bg-gray-800 text-gray-300",children:"..."}),e.jsx(a,{page:r,isActive:s===r,onClick:i})]}),e.jsxs("button",{onClick:y,className:"relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 border border-gray-700 bg-gray-800 hover:bg-gray-700",children:["Next",e.jsx(j,{className:"h-4 w-4 ml-1"})]})]})})};export{w as C,u as P};
