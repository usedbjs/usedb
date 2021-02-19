(window.webpackJsonp=window.webpackJsonp||[]).push([[34],{102:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return c})),n.d(t,"metadata",(function(){return a})),n.d(t,"toc",(function(){return b})),n.d(t,"default",(function(){return l}));var r=n(3),i=n(7),o=(n(0),n(113)),c={id:"using-the-runtime-binding",title:"Using the Runtime Binding",sidebar_label:"Using the Runtime Binding",slug:"/using-the-runtime-binding"},a={unversionedId:"using-the-runtime-binding",id:"using-the-runtime-binding",isDocsHomePage:!1,title:"Using the Runtime Binding",description:"Runtime Binding",source:"@site/docs/using-the-runtime-binding.md",slug:"/using-the-runtime-binding",permalink:"/usedb/docs/using-the-runtime-binding",editUrl:"https://github.com/facebook/docusaurus/edit/master/website/docs/using-the-runtime-binding.md",version:"current",sidebar_label:"Using the Runtime Binding"},b=[{value:"Runtime Binding",id:"runtime-binding",children:[]},{value:"Steps",id:"steps",children:[{value:"1. Define Models",id:"1-define-models",children:[]},{value:"2. Initialize cache",id:"2-initialize-cache",children:[]},{value:"3. Create Connection object",id:"3-create-connection-object",children:[]},{value:"4. Perform Queries",id:"4-perform-queries",children:[]}]}],u={toc:b};function l(e){var t=e.components,n=Object(i.a)(e,["components"]);return Object(o.b)("wrapper",Object(r.a)({},u,n,{components:t,mdxType:"MDXLayout"}),Object(o.b)("h2",{id:"runtime-binding"},"Runtime Binding"),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},"Runtime binding lets you perform queries without any backend resources.")),Object(o.b)("li",{parentName:"ul"},Object(o.b)("p",{parentName:"li"},"It stores data in-memory. See ",Object(o.b)("a",Object(r.a)({parentName:"p"},{href:"xyz"}),"LocalStorage Binding"),"."))),Object(o.b)("h2",{id:"steps"},"Steps"),Object(o.b)("h3",{id:"1-define-models"},"1. Define Models"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{}),'import { types } from "@usedb/core";\n\nconst Post = types.model({\n    id: types.identifierNumber,\n    title: types.string\n});\n')),Object(o.b)("ul",null,Object(o.b)("li",{parentName:"ul"},"For complete type references ",Object(o.b)("a",Object(r.a)({parentName:"li"},{href:"https://mobx-state-tree.js.org/overview/types"}),"refer."))),Object(o.b)("h3",{id:"2-initialize-cache"},"2. Initialize cache"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{}),'import { createModel } from "@usedb/core";\nimport { Post } from "./models";\n\nconst models = {\n    Post,\n}\n\nconst DBModel = createModel({\n  models\n});\n\nexport const db = DBModel.create();\n')),Object(o.b)("h3",{id:"3-create-connection-object"},"3. Create Connection object"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{className:"language-jsx"}),'import { Provider } from \'@usedb/react\';\nimport { RuntimeBinding, Connection } from "@usedb/core";\nimport { db } from "./db";\n\nconst connection = new Connection({ bind: new RuntimeBinding(), db });\n\nconst App = () => {\n  return (\n    <Provider connection={connection}>\n      \x3c!-- Your components --\x3e\n    </Provider>\n  );\n};\n')),Object(o.b)("h3",{id:"4-perform-queries"},"4. Perform Queries"),Object(o.b)("h5",{id:"create"},"Create"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{}),'const result = useDB(db.Post.create({ data: { title: "Hello world" } }));\n')),Object(o.b)("h5",{id:"read"},"Read"),Object(o.b)("p",null,"Single entity"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{}),"const result = useDB(db.Post.findOne({ where: { id: 1 }}))\n")),Object(o.b)("p",null,"Multiple entities with pagination"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{}),"const result = useDB(db.Post.findMany({ skip: 0, take: 5} ))\n")),Object(o.b)("h5",{id:"update"},"Update"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{}),'const result = useDB(db.Post.update({ where: { id: 1 }, data: { title: "Hello new world" } }))\n')),Object(o.b)("h5",{id:"delete"},"Delete"),Object(o.b)("pre",null,Object(o.b)("code",Object(r.a)({parentName:"pre"},{}),"const result = useDB(db.Post.delete({ where: { id: 1 }}))\n")))}l.isMDXComponent=!0},113:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return m}));var r=n(0),i=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function b(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var u=i.a.createContext({}),l=function(e){var t=i.a.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},d=function(e){var t=l(e.components);return i.a.createElement(u.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return i.a.createElement(i.a.Fragment,{},t)}},p=i.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,c=e.parentName,u=b(e,["components","mdxType","originalType","parentName"]),d=l(n),p=r,m=d["".concat(c,".").concat(p)]||d[p]||s[p]||o;return n?i.a.createElement(m,a(a({ref:t},u),{},{components:n})):i.a.createElement(m,a({ref:t},u))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,c=new Array(o);c[0]=p;var a={};for(var b in t)hasOwnProperty.call(t,b)&&(a[b]=t[b]);a.originalType=e,a.mdxType="string"==typeof e?e:r,c[1]=a;for(var u=2;u<o;u++)c[u]=n[u];return i.a.createElement.apply(null,c)}return i.a.createElement.apply(null,n)}p.displayName="MDXCreateElement"}}]);