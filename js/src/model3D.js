window.Model3D={
	renderer: new THREE.WebGLRenderer({alpha:true}),
	scene: new THREE.Scene(),
	camera: null,
	controls: null,
	gltf: null,
	geometry: null,
	init: function(){
		const scene=this.scene,renderer=this.renderer,loader = new THREE.GLTFLoader();

		scene.environment = new THREE.PMREMGenerator( renderer ).fromScene( new THREE.RoomEnvironment(), 0.04 ).texture;

		renderer.setClearAlpha(0.0);
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.outputEncoding = THREE.sRGBEncoding;
		document.body.appendChild( this.renderer.domElement );
		renderer.domElement.id='drawArea';

		this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
		this.camera.position.set( 5, 2, 8 );

		this.controls = new THREE.OrbitControls( this.camera, renderer.domElement );
		this.controls.update();
		this.controls.enablePan = false;
		this.controls.enableDamping = true;

		this.geometry=new THREE.BufferGeometry();
		this.geometry.setAttribute( 'position', new THREE.BufferAttribute( new Float32Array( 8 * 3 ), 3 ) );/*最大点数：8个*/
		this.geometry.setDrawRange( 0, 0 );
		this.scene.add( new THREE.Line(this.geometry, new THREE.LineBasicMaterial({color: 0xf44336, linewidth: 1})) );

		return new Promise((resolve,reject)=>{
			loader.load( './models/structure.glb', ( gltf )=> {
				this.gltf={
					Structure: gltf.scene,
					Protractor: gltf.scene.getObjectByName('Protractor'),
					Platform: gltf.scene.getObjectByName('Platform'),
					platform: gltf.scene.getObjectByName('platform01'),
					lenses: [null, ...gltf.scene.getObjectByName('platform01').children]
				}
				this.scene.add( gltf.scene );
				animate();
				resolve('Success');
			}, undefined, reject);
		});
	}
}
window.onresize = function () {
	Model3D.camera.aspect = window.innerWidth / window.innerHeight;
	Model3D.camera.updateProjectionMatrix();
	Model3D.renderer.setSize( window.innerWidth, window.innerHeight );
};

window.Model3D.drawLines=function(input,output){
	const points=Model3D.geometry.attributes.position.array,
		p=[input.start, input.end, ...output.map(v=>v.end)],
		l=p.length;
	for(let i=0;i<l;i++){
		points[3*i]=p[i].x/285;
		points[3*i+1]=p[i].z/285+2.35;
		points[3*i+2]=-p[i].y/285;
	}
	this.geometry.setDrawRange(0,l);
	this.geometry.attributes.position.needsUpdate=true;
}

function animate() {
	requestAnimationFrame( animate );
	Model3D.controls.update();
	Model3D.renderer.render( Model3D.scene, Model3D.camera );
}
