import App from './components.js'
import { _Point, _Spherical, _Line, _Edge, _Lens } from './classes.js'
import WebGL from './WebGL.js'

window.Lenses=[
			new _Lens([
				{point:new _Point(0,0,0), angle:new _Spherical(Math.PI/2,0), n21:1, valid:(()=>true)}
			],[]),
			new _Lens([
				{point:new _Point(-10,0,0), angle:new _Spherical(Math.PI/2,0), n21:0, valid:Shape.polygon([0,1,5,4])},
				{point:new _Point(0,-50,0), angle:new _Spherical(Math.PI/2,Math.PI/2), n21:0, valid:Shape.polygon([1,2,6,5])},
				{point:new _Point(10,0,0), angle:new _Spherical(Math.PI/2,Math.PI), n21:0, valid:Shape.polygon([2,3,7,6])},
				{point:new _Point(0,50,0), angle:new _Spherical(Math.PI/2,-Math.PI/2), n21:0, valid:Shape.polygon([3,0,4,7])},
			],[
				new _Point(-10,50,-100), new _Point(-10,-50,-100), new _Point(10,-50,-100), new _Point(10,50,-100), 
				new _Point(-10,50,100), new _Point(-10,-50,100), new _Point(10,-50,100), new _Point(10,50,100)
			]),
			new _Lens([
				{point:new _Point(-50,28.8,0), angle:new _Spherical(Math.PI/2,Math.PI*11/6), n21:1.5, valid:Shape.polygon([0,1,4,3])},
				{point:new _Point(50,28.8,0), angle:new _Spherical(Math.PI/2,Math.PI*7/6), n21:1.5, valid:Shape.polygon([2,0,3,5])},
				{point:new _Point(0,-57.7,0), angle:new _Spherical(Math.PI/2,Math.PI/2), n21:1.5, valid:Shape.polygon([1,2,5,4])},
			],[
				new _Point(0,115.47,-100), new _Point(-100,-57.735,-100), new _Point(100,-57.735,-100),
				new _Point(0,115.47,100), new _Point(-100,-57.735,100), new _Point(100,-57.735,100)
			])
		];
		window.onload=function(){
			if (WebGL.isWebGLAvailable())Model3D.init()
				.then(()=>{
					document.body.removeChild(document.getElementById('loading'));
					ReactDOM.render(React.createElement(App),document.getElementById('ReactRoot'));
				})
				.catch(console.error);
			else document.body.appendChild(WebGL.getWebGLErrorMessage());
		}