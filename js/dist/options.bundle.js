(()=>{"use strict";class e{constructor(e,t,a){"object"==typeof e&&({value:[[e],[t],[a]]}=e),this.x=e,this.y=t,this.z=a}toArray(){return[this.x,this.y,this.z]}toMatrix(){return new Matrix.matrix([[this.x],[this.y],[this.z]])}disTo({x:e,y:t,z:a}){return Math.sqrt((this.x-e)**2+(this.y-t)**2+(this.z-a)**2)}getAngle(){const{x:e,y:a,z:n}=this,r=Math.sqrt(e**2+a**2+n**2),i=Math.acos(n/r);let s=Math.acos(e/(r*Math.sin(i)));return a<-1e-9&&(s=2*Math.PI-s),new t(i,s)}subtract({x:t,y:a,z:n}){return new e(this.x-t,this.y-a,this.z-n)}toString(){return`Point(${1e-4*Math.round(1e4*this.x)}, ${1e-4*Math.round(1e4*this.y)}, ${1e-4*Math.round(1e4*this.z)})`}toVectorMatrix(){return new Matrix.matrix([[0,-this.z,this.y],[this.z,0,-this.x],[-this.y,this.x,0]])}isEqual({x:e,y:t,z:a}){return Math.abs(e+t+a-this.x-this.y-this.z)<1e-9}}class t{constructor(e,t){this.theta=e,this.phi=t}toCartesian(t=1){const{sin:a,cos:n}=Math,{theta:r,phi:i}=this;return new e(a(r)*n(i)*t,a(r)*a(i)*t,n(r)*t)}rotateFromZ(){const e=Math.sin(this.theta),t=Math.cos(this.theta),a=Math.sin(this.phi),n=Math.cos(this.phi);return new Matrix.matrix([[t*n,-a,e*n],[t*a,n,e*a],[-e,0,t]])}rotateToZ(){return this.rotateFromZ().T()}toString(){return`Angle(theta: ${1e-4*Math.round(this.theta/Math.PI*1e4)}π, phi: ${1e-4*Math.round(this.phi/Math.PI*1e4)}π)`}}class a{constructor(e,t){this.start=e,this.end=null,this.angle=t}endAt(t){const a=this.start;return this.end=t,this.length=a.disTo(t),this.center=new e(t.toMatrix().add(a.toMatrix()).x(.5)),this.angle=t.subtract(a).getAngle(),this}endTo(t){this.length=Math.abs(t);const a=this.start.toMatrix();return this.end=this.angle.toCartesian().toMatrix().x(t).add(a),this.center=new e(this.end.add(a).x(.5)),this.end=new e(this.end),this}}class n{constructor({point:e,angle:t,n21:a,valid:n}){this.center=e,this.angle=t,this.n21=a,this.valid=n}effect({end:t,angle:n}){if(1===this.n21)return new a(t,n).endTo(600);let r=n.toCartesian().toMatrix(),i=this.angle.rotateToZ(),s=i.x(r);if(this.n21<1)s.value[2][0]*=-1;else{const e=s.value[2][0]>1e-9;s.value[0][0]*=e?1/this.n21:this.n21,s.value[1][0]*=e?1/this.n21:this.n21,s.value[2][0]=(e?1:-1)*Math.sqrt(1-Math.min(s.value[0][0]**2+s.value[1][0]**2,1))}return s=new e(i.T().x(s)),new a(t,s.getAngle()).endTo(600)}}class r{constructor(e,t){this.edge=e.map((e=>new n(e))),this.result=e.map((e=>new n(e))),this.keyPoints=t,this.resultPoints=t,this.rotateMatrix=new Matrix.I(3)}rotate(t){this.resultPoints=this.keyPoints.map((a=>new e(t.x(a.toMatrix())))),this.edge.forEach(((a,n)=>{this.result[n].center=new e(t.x(a.center.toMatrix())),this.result[n].angle=new e(t.x(a.angle.toCartesian().toMatrix())).getAngle()})),this.rotateMatrix=t}effect(t){const a=Math.abs,n=t.angle.toCartesian().toVectorMatrix(),r=t.start.toMatrix();[n.value[1][2],n.value[2][0],n.value[0][1]].reduce(((e,t,r)=>e||a(t)<1e-9?e:(n.value.shift(r),n.value[2]=[0,0,0],!0)),!1);let i,s=Matrix.zero(3),{i:o,end:l}=this.result.map((e=>{s.value[2]=e.angle.toCartesian().toArray(),i=e.center.toMatrix();let t=n.add(s).inv();return t?t.x(n.x(r).add(s.x(i))):null})).reduce(((a,n,r)=>{if(null===n)return a;let i=new e(n),s=i.disTo(t.start);return Math.abs(s-a.len)<1e-9||s<1e-9||!i.subtract(t.start).isEqual(t.angle.toCartesian(s))?a:(s<a.len||null===a.len)&&this.result[r].valid(this,i)?{i:r,end:i,len:s}:a}),{i:null,end:null,len:null});if(null===o)return[];t.endAt(l);let c=[this.result[o].effect(t)];return c.concat(this.effect(c[0]))}}window.Shape={polygon:function(e){return function(t,a){const n=e.length,r=e.map((e=>t.resultPoints[e].subtract(a))),i=r[n-1].toVectorMatrix().x(r[0].toMatrix()).value.map((e=>e>1e-9?1:e<-1e-9?-1:0));for(let e=1;e<n;e++)if(!r[e-1].toVectorMatrix().x(r[e].toMatrix()).value.reduce(((e,t,a)=>e&&i[a]*t>=0),!0))return!1;return!0}}};var i=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var a=[],n=!0,r=!1,i=void 0;try{for(var s,o=e[Symbol.iterator]();!(n=(s=o.next()).done)&&(a.push(s.value),!t||a.length!==t);n=!0);}catch(e){r=!0,i=e}finally{try{!n&&o.return&&o.return()}finally{if(r)throw i}}return a}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")};function s(e){var t=e.pos,a=t.phi,n=t.theta,r=(e.focus,e.source),i=(a<Math.PI?a:2*Math.PI-a)/.1,s=n/.1;return React.createElement("div",{className:"Eyepieces"},Math.abs(i)<1&&Math.abs(s)<1&&React.createElement("img",{style:{transform:"scale(0.5) translate("+Math.round(100*Math.asin(i))+"%, "+Math.round(100*Math.asin(s))+"%)"},className:"Eyepieces",src:"img/"+["line","cross","line"][r]+".png"}))}function o(e){var t=e.angle;return React.createElement("div",{id:"Scale"},React.createElement("img",{src:"img/protractor_inside.png"}),React.createElement("img",{style:{transform:"rotate("+(t+6)+"deg)"},src:"img/protractor_outside.png"}))}function l(e){var t=null;return React.useEffect((function(){function e(e,t){t?a.lineTo(e.value[1][0],-e.value[2][0]):a.moveTo(e.value[1][0],-e.value[2][0])}var a=t.getContext("2d"),n=Lenses[0].rotateMatrix;a.resetTransform(),a.clearRect(0,0,500,300),a.translate(250,150),a.textAlign="center",a.textBaseline="top",a.font="15px sans-serif",a.beginPath(),a.moveTo(-200,0),a.lineTo(200,0),a.moveTo(0,-125),a.lineTo(0,125),a.setLineDash([25,25]),a.lineWidth=1,a.strokeStyle="rgba(0,0,0,0.57)",a.stroke(),a.beginPath();for(var r=0;r<2;r+=.1){var i=n.x(new Matrix.matrix([[200*Math.cos(r*Math.PI)],[200*Math.sin(r*Math.PI)],[0]]));e(i.x((i.value[0][0]+500)/500),r)}a.closePath(),a.fillStyle="rgba(0,0,0,0.37)",a.fill(),a.fillStyle="#000",a.strokeStyle="#000",a.lineWidth=10,a.setLineDash([]),a.beginPath(),[[0,-200],[-173,100],[173,100]].forEach((function(t,r){var i=n.x(new Matrix.matrix([[t[0]],[t[1]],[0]])),s=n.x(new Matrix.matrix([[t[0]],[t[1]],[-20]]));i=i.x((i.value[0][0]+1e3)/1e3),s=s.x((s.value[0][0]+1e3)/1e3),e(i,!1),e(s,!0),r&&a.fillText("调平螺丝"+r,s.value[1][0],-s.value[2][0])})),a.stroke()}),[e]),React.createElement("canvas",{ref:function(e){return t=e},id:"Platform",width:"500px",height:"300px"})}function c(e){var t=e.LineInput,a=e.LineOutput,n=e.type,r=null;return React.useEffect((function(){var e=r.getContext("2d");e.resetTransform(),e.clearRect(0,0,500,500),e.translate(250,250),e.lineWidth=2,e.beginPath(),e.moveTo(t.start.x,-t.start.y),e.lineTo(t.end.x,-t.end.y),a.forEach((function(t){e.moveTo(t.start.x,-t.start.y),e.lineTo(t.end.x,-t.end.y)})),e.stroke(),e.beginPath(),e.fillStyle="rgba(187,222,251,0.37)";for(var i=0,s=Lenses[n].resultPoints,o=s.length/2;i<o;i++)(i?e.lineTo.bind(e):e.moveTo.bind(e))((s[i].x+s[i+o].x)/2,-(s[i].y+s[i+o].y)/2);e.closePath(),e.stroke(),e.fill()})),React.createElement("canvas",{ref:function(e){return r=e},id:"lightPath",width:"500px",height:"500px"})}function h(e){var t=e.desc,a=e.onChange,n=e.type,r=e.name,i=e.children,s=e.def;return React.createElement("div",{className:"list"},t,React.createElement("form",{className:"listVal",onChange:a},i.map((function(e,t){return React.createElement("label",{key:e.desc},React.createElement("input",{type:n,className:s===t?"default":"",name:r,value:e.val}),React.createElement("span",null,e.desc))}))))}function u(e){var t=e.parts,a=e.setParts,n=e.setLensType,r=e.lensRotation,s=e.eyeRotation,o=e.setlensRotation,l=e.setEyeRotation;function c(e){var r=e.target,i=r.name,s=r.value,o=r.checked;"lens"===i?n(Number(s)):(t.set(s,o),a(new Map([].concat(function(e){if(Array.isArray(e)){for(var t=0,a=Array(e.length);t<e.length;t++)a[t]=e[t];return a}return Array.from(e)}(t)))))}function u(e){var t=e*M,a=Math.min,n=Math.max;if("eyepieces"!==p){var i=r.s1,c=r.s2,h=r.phi;switch(p){case"screw01":i=a(1,n(-1,i+t));break;case"screw02":c=a(1,n(-1,c+t));break;case"platform":h=(h+t)%360}var u=new Matrix.I(3),d=new Matrix.I(3),g=new Matrix.I(3);u.value[1][1]=u.value[2][2]=Math.sqrt(1-Math.pow(u.value[1][2]=-(u.value[2][1]=(i+c)/34.64),2)),d.value[0][0]=d.value[2][2]=Math.sqrt(1-Math.pow(d.value[2][0]=-(d.value[0][2]=(i-c)/20),2)),g.value[0][0]=g.value[1][1]=Math.cos(h/180*Math.PI),g.value[0][1]=-(g.value[1][0]=Math.sin(h/180*Math.PI));var f=g.x(u).x(d);window.Lenses.forEach((function(e){return e.rotate(f)})),o({s1:i,s2:c,phi:h})}else l(a(154,n(-154,s+t)))}var d=React.useState("platform"),g=i(d,2),p=g[0],f=g[1],m=React.useState(1),v=i(m,2),M=v[0],x=v[1];return React.useEffect((function(){return document.querySelectorAll(".default").forEach((function(e){return e.checked=!0}))}),[]),React.createElement("div",{id:"Option"},React.createElement("img",{id:"addBtn",src:"img/plus.png",onClick:function(){return u(1)},onWheel:function(e){u(e.deltaY>0?.2:5)}}),React.createElement("img",{id:"subBtn",src:"img/minus.png",onClick:function(){return u(-1)},onWheel:function(e){u(e.deltaY>0?-.2:-5)}}),React.createElement("img",{id:"floatBtn",src:"img/options.png"}),React.createElement("div",{id:"menu"},React.createElement(h,{desc:"组件显示",onChange:c,type:"checkbox",def:-1,name:""},[{val:"eyepieces",desc:"望远镜目镜,"},{val:"path",desc:"简化光路,"},{val:"scale",desc:"分光计刻度,"},{val:"platform",desc:"载物平台"}]),React.createElement(h,{desc:"透镜",onChange:c,type:"radio",def:0,name:"lens"},[{val:"0",desc:"无透镜"},{val:"1",desc:"平面镜"},{val:"2",desc:"三棱镜"}]),React.createElement(h,{desc:"控制对象",onChange:function(e){return f(e.target.value)},type:"radio",def:1,name:"target"},[{val:"eyepieces",desc:"望远镜旋转"},{val:"platform",desc:"载物台旋转"},{val:"screw01",desc:"载物平台调平螺丝-1"},{val:"screw02",desc:"载物平台调平螺丝-2"}]),React.createElement(h,{desc:"控制幅度/°",onChange:function(e){return x(Number(e.target.value))},type:"radio",def:1,name:"step"},[{val:"0.1",desc:"0.1"},{val:"1",desc:"1"},{val:"10",desc:"10"},{val:"180",desc:"180"}])))}const d=function(){var e,n=React.useState(0),r=i(n,2),h=r[0],d=r[1],g=React.useState({s1:0,s2:0,phi:0}),p=i(g,2),f=p[0],m=p[1],v=React.useState(0),M=i(v,2),x=M[0],w=M[1],y=React.useState(new Map([["eyepieces",!1],["platform",!1],["scale",!1],["path",!1]])),b=i(y,2),E=b[0],R=b[1],P=window.Lenses[h],I=void 0;return I=new t(Math.PI/2,1===h?(x/180+1)*Math.PI:0),I=new a(I.toCartesian(-600),I).endTo(800),e=P.effect(I),React.useEffect((function(){Model3D.drawLines(I,e),Model3D.gltf.platform.rotation.z=Math.asin((f.s1+f.s2)/34.64),Model3D.gltf.platform.rotation.x=Math.asin((f.s1-f.s2)/20),Model3D.gltf.Platform.rotation.y=f.phi/180*Math.PI,Model3D.gltf.lenses.forEach((function(e,t){return e&&(e.position.y=t===h?0:-1.5)})),Model3D.gltf.Protractor.rotation.y=x/180*Math.PI}),[f,x,h]),React.createElement("div",null,E.get("eyepieces")&&React.createElement(s,{focus:0,pos:{phi:(e[e.length-1]||I).angle.phi-x/180*Math.PI,theta:(e[e.length-1]||I).angle.theta-Math.PI/2},source:h}),E.get("path")&&React.createElement(c,{LineOutput:e,LineInput:I,type:h,eyeRotation:x/180*Math.PI}),E.get("platform")&&React.createElement(l,{rotation:f}),E.get("scale")&&React.createElement(o,{angle:f.phi-x}),React.createElement(u,{parts:E,setParts:R,setLensType:d,lensRotation:f,eyeRotation:x,setlensRotation:m,setEyeRotation:w}))},g=class{static isWebGLAvailable(){try{const e=document.createElement("canvas");return!(!window.WebGLRenderingContext||!e.getContext("webgl")&&!e.getContext("experimental-webgl"))}catch(e){return!1}}static isWebGL2Available(){try{const e=document.createElement("canvas");return!(!window.WebGL2RenderingContext||!e.getContext("webgl2"))}catch(e){return!1}}static getWebGLErrorMessage(){return this.getErrorMessage(1)}static getWebGL2ErrorMessage(){return this.getErrorMessage(2)}static getErrorMessage(e){const t={1:window.WebGLRenderingContext,2:window.WebGL2RenderingContext};let a='Your $0 does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">$1</a>';const n=document.createElement("div");return n.id="webglmessage",n.style.fontFamily="monospace",n.style.fontSize="13px",n.style.fontWeight="normal",n.style.textAlign="center",n.style.background="#fff",n.style.color="#000",n.style.padding="1.5em",n.style.width="400px",n.style.margin="5em auto 0",a=t[e]?a.replace("$0","graphics card"):a.replace("$0","browser"),a=a.replace("$1",{1:"WebGL",2:"WebGL 2"}[e]),n.innerHTML=a,n}};window.Lenses=[new r([{point:new e(0,0,0),angle:new t(Math.PI/2,0),n21:1,valid:()=>!0}],[]),new r([{point:new e(-10,0,0),angle:new t(Math.PI/2,0),n21:0,valid:Shape.polygon([0,1,5,4])},{point:new e(0,-50,0),angle:new t(Math.PI/2,Math.PI/2),n21:0,valid:Shape.polygon([1,2,6,5])},{point:new e(10,0,0),angle:new t(Math.PI/2,Math.PI),n21:0,valid:Shape.polygon([2,3,7,6])},{point:new e(0,50,0),angle:new t(Math.PI/2,-Math.PI/2),n21:0,valid:Shape.polygon([3,0,4,7])}],[new e(-10,50,-100),new e(-10,-50,-100),new e(10,-50,-100),new e(10,50,-100),new e(-10,50,100),new e(-10,-50,100),new e(10,-50,100),new e(10,50,100)]),new r([{point:new e(-50,28.8,0),angle:new t(Math.PI/2,11*Math.PI/6),n21:1.5,valid:Shape.polygon([0,1,4,3])},{point:new e(50,28.8,0),angle:new t(Math.PI/2,7*Math.PI/6),n21:1.5,valid:Shape.polygon([2,0,3,5])},{point:new e(0,-57.7,0),angle:new t(Math.PI/2,Math.PI/2),n21:1.5,valid:Shape.polygon([1,2,5,4])}],[new e(0,115.47,-100),new e(-100,-57.735,-100),new e(100,-57.735,-100),new e(0,115.47,100),new e(-100,-57.735,100),new e(100,-57.735,100)])],window.onload=function(){g.isWebGLAvailable()?Model3D.init().then((()=>{document.body.removeChild(document.getElementById("loading")),ReactDOM.render(React.createElement(d),document.getElementById("ReactRoot"))})).catch(console.error):document.body.appendChild(g.getWebGLErrorMessage())}})();