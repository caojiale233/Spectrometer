import { _Point, _Spherical, _Line, _Edge, _Lens } from './classes.js'

function Eyepieces({pos: {phi,theta}, focus, source}){
/*  目镜 */
	function powFix(base,times){return (base<0?-1:1)*Math.pow((base<0?-1:1)*base,times)}
	const x=(phi<Math.PI?phi:phi-2*Math.PI)/0.1, y=theta/0.1;
	return (<div id='Eyepieces'>
		{Math.abs(x)<1 && Math.abs(y)<1 && <svg 
			style={{transform:`scale(0.5) translate(${(powFix(x,0.5)*1E2).toFixed(3)}%, ${(powFix(y,0.5)*1E2).toFixed(3)}%)`}} 
			viewBox="0 0 128 128" >{source}</svg>}
	</div>);
}

function Scale({angle}){
	return(<div id="Scale">
		<img src="img/protractor_inside.png" />
		<img style={{transform: `rotate(${angle+6}deg)`}} src="img/protractor_outside.png" />
	</div>);
}

function Platform(lensRotation){
	let elem=null;
	function draw(){
		function lines(m,i){
			if(i)ctx.lineTo(m.value[0][0],-m.value[2][0]);
			else ctx.moveTo(m.value[0][0],-m.value[2][0]);
		}
		const ctx=elem.getContext('2d'),rm=Lenses[0].rotateMatrix;
		ctx.resetTransform();
		ctx.clearRect(0,0,500,300);
		ctx.translate(250,150);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = '15px sans-serif';
		/*坐标轴 */
		ctx.beginPath();
		ctx.moveTo(-200,0);
		ctx.lineTo(200,0);
		ctx.moveTo(0,-125);
		ctx.lineTo(0,125);
		ctx.setLineDash([25, 25]);
		ctx.lineWidth = 1;
		ctx.strokeStyle="rgba(0,0,0,0.57)";
		ctx.stroke();
		/* 圆盘 */
		ctx.beginPath();
		for(let i=0;i<2;i+=0.1){
			let vetor=rm.x(new Matrix.matrix([[220*Math.cos(i*Math.PI)],[220*Math.sin(i*Math.PI)],[0]]));
			lines(vetor.x((-vetor.value[1][0]+500)/500),i);
		}
		ctx.closePath();
		ctx.fillStyle = "rgba(0,0,0,0.37)";
		ctx.fill();
		/* 螺丝 */
		ctx.fillStyle = "#000";
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 10;
		ctx.setLineDash([]);
		ctx.beginPath();
		[[-200,0],[100,-173,],[100,173]].forEach((v,i)=>{
			let vetor1=rm.x(new Matrix.matrix([[v[0]],[v[1]],[0]])),
				vetor2=rm.x(new Matrix.matrix([[v[0]],[v[1]],[-20]]));
			vetor1=vetor1.x((-vetor1.value[1][0]+500)/500);
			vetor2=vetor2.x((-vetor2.value[1][0]+500)/500);
			lines(vetor1,false);lines(vetor2,true);
			i && ctx.fillText(`调平螺丝${i}`,vetor2.value[0][0],-vetor2.value[2][0]);
		});
		ctx.stroke();
	}
	React.useEffect(draw,[lensRotation]);
	return(<canvas 
		ref={(el)=>elem=el} 
		id='Platform' 
		width='500px' 
		height='300px' />);
}

function Path({LineInput,LineOutput,type}){
/* 光路 */
	let elem=null;
	function draw(){
		const ctx=elem.getContext('2d');
		ctx.resetTransform();
		ctx.clearRect(0,0,500,500);
		ctx.translate(250,250);
		ctx.lineWidth = 2;
		/* 光路 */
		ctx.beginPath();
		ctx.moveTo(LineInput.start.x,-LineInput.start.y);
		ctx.lineTo(LineInput.end.x,-LineInput.end.y);
		LineOutput.forEach(v=>{
			ctx.moveTo(v.start.x,-v.start.y);
			ctx.lineTo(v.end.x,-v.end.y);
		});
		ctx.stroke();
		/* 透镜 */
		ctx.beginPath();
		ctx.fillStyle = "rgba(187,222,251,0.37)";
		for(let i=0,p=Lenses[type].resultPoints,l=p.length/2;i<l;i++)
			(i?ctx.lineTo.bind(ctx):ctx.moveTo.bind(ctx))((p[i].x+p[i+l].x)/2,-(p[i].y+p[i+l].y)/2);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}
	React.useEffect(draw);
	return(<canvas 
		ref={(el)=>elem=el} 
		id='lightPath' 
		width='500px' 
		height='500px' />);
}

function Select({desc,onChange,type,name,children,def,value}){
	return(<div className='list'>{desc}
		<form className='listVal' onChange={onChange}>
			{children.map((v,i)=>(<label key={v.desc} ><input 
				type={type} 
				className={def===i?'default':null} 
				checked={value?(value===v.val):null}
				name={name} 
				value={v.val} /><span>{v.desc}</span></label>))}
		</form></div>);
}

function Option({parts,setParts,setLensType,lensRotation,eyeRotation,setlensRotation,setEyeRotation}){
	function showComponent({target:{name:name,value:value,checked:checked}}){
		if(name==='lens'){
			setLensType(Number(value));
		}
		else{
			parts.set(value,checked);
			setParts(new Map([...parts]));
		}
	}
	function change(v){
		const delta=v*step,
			{min,max}=Math;
		if(target==='Protractor'){
			setEyeRotation(min(154,max(-154,eyeRotation+delta)));
			return;
		}
		let{s1, s2, phi}=lensRotation;
		switch(target){
			case 'screws08' :
				s1=min(6,max(-6,s1+delta));
				break;
			case 'screws07' :
				s2=min(6,max(-6,s2+delta));
				break;
			case 'Platform' :
				phi=(phi+delta)%360;
				break;
		}
		const mx=new Matrix.I(3), my=new Matrix.I(3), mz=new Matrix.I(3);
		mx.value[1][1]=mx.value[2][2]=Math.sqrt(1-Math.pow((mx.value[1][2]=-(mx.value[2][1]=(s2-s1)/200)),2));
		my.value[0][0]=my.value[2][2]=Math.sqrt(1-Math.pow((my.value[2][0]=-(my.value[0][2]=(s1+s2)/-346.4)),2));
		mz.value[0][0]=mz.value[1][1]=Math.cos(phi/180*Math.PI),mz.value[0][1]=-(mz.value[1][0]=Math.sin(phi/180*Math.PI));
		const rm=mz.x(my).x(mx);
		window.Lenses.forEach(v=>v.rotate(rm));
		setlensRotation({s1, s2, phi});
	}
	let [target,setTar]=React.useState('Platform'),
		[step,setStep]=React.useState(1);
		Model3D.clickList.set('Protractor',setTar);
		Model3D.clickList.set('Platform',setTar);
		Model3D.clickList.set('screws07',setTar);
		Model3D.clickList.set('screws08',setTar);
	React.useEffect(()=>{
		document.querySelectorAll('.default').forEach(v=>v.checked=true);
		change(0);
	},[]);
	React.useEffect(()=>{Model3D.focus=[Model3D.scene.getObjectByName(target)]},[target]);
	return (<div id='Option'>
		<img id='addBtn' 
			src='img/plus.png'
			onClick={()=>change(1)} 
			onWheel={(e)=>{change(e.deltaY>0?0.2:5)}} />
		<img id='subBtn' 
			src='img/minus.png'
			onClick={()=>change(-1)} 
			onWheel={(e)=>{change(e.deltaY>0?-0.2:-5)}} />
		<img id='floatBtn' src='img/options.png' />
		<div id='menu'>
			<Select 
				desc='组件显示'
				onChange={showComponent}
				type='checkbox' 
				def={-1}
				name=''>
			{[{val:'eyepieces',desc:'望远镜目镜,'},{val:'path',desc:'简化光路,'},{val:'scale',desc:'分光计刻度,'},{val:'platform',desc:'载物平台'}]}
			</Select>
			<Select 
				desc='透镜'
				onChange={showComponent}
				type='radio' 
				def={0}
				name='lens'>
			{[{val:'0',desc:'无透镜'},{val:'1',desc:'平面镜'},{val:'2',desc:'三棱镜'}]}
			</Select>
			<Select 
				desc='控制对象'
				onChange={e=>setTar(e.target.value)}
				type='radio' 
				def={1}
				name='target'
				value={target}>
			{[{val:'Protractor',desc:'望远镜旋转'},{val:'Platform',desc:'载物台旋转'},{val:'screws08',desc:'载物平台调平螺丝-1'},{val:'screws07',desc:'载物平台调平螺丝-2'}]}
			</Select>
			<Select 
				desc='控制幅度/°'
				onChange={e=>setStep(Number(e.target.value))}
				type='radio' 
				def={1}
				name='step'>
			{[{val:'0.1',desc:'0.1'},{val:'1',desc:'1'},{val:'10',desc:'10'},{val:'180',desc:'180'}]}
			</Select>
		</div>
	</div>);
}
		
function App(){/* Number(Math.random().toFixed(2))*8-4 *//* Number(Math.random().toFixed(2))*8-4 */
	const [lensType,setLensType]=React.useState(0),
		[lensRotation,setlensRotation]=React.useState({s1:0,s2:0,phi:0}),
		[eyeRotation,setEyeRotation]=React.useState(0),
		[parts,setParts]=React.useState(new Map([['eyepieces',false],['platform',false],['scale',false],['path',false]])),
		Lens=window.Lenses[lensType];
	let LI,LO; 
	LI=lensType===1?new _Spherical(Math.PI/2, (eyeRotation/180+1)*Math.PI):new _Spherical(Math.PI/2, 0);
	LI=new _Line(LI.toCartesian(-600), LI).endTo(800);
	LO=Lens.effect(LI);
	React.useEffect(()=>{
		Model3D.drawLines(LI,LO);
		Model3D.gltf.platform.rotation.z=Math.asin((lensRotation.s1+lensRotation.s2)/346.4);
		Model3D.gltf.platform.rotation.x=Math.asin((lensRotation.s2-lensRotation.s1)/200);
		new _Point(
			1.65*(lensRotation.s1+lensRotation.s2)/346.4*Math.cos(Model3D.gltf.platform.rotation.x),
			-1.65+1.65*Math.cos(Model3D.gltf.platform.rotation.x)*Math.cos(Model3D.gltf.platform.rotation.z),
			-1.65*(lensRotation.s2-lensRotation.s1)/200
		).cloneTo(Model3D.gltf.platform.position);
		Model3D.gltf.Platform.rotation.y=lensRotation.phi/180*Math.PI;
		Model3D.gltf.lenses.forEach((v,i)=>(v && (v.position.y=(i===lensType?0:-1.5))));
		Model3D.gltf.Protractor.rotation.y=eyeRotation/180*Math.PI;
	},[lensRotation,eyeRotation,lensType]);
	return (<div>
		{parts.get('eyepieces') && <Eyepieces 
			focus={0.0} 
			pos={{phi:(LO[LO.length-1] || LI).angle.phi-eyeRotation/180*Math.PI, theta:(LO[LO.length-1] || LI).angle.theta-Math.PI/2}}
			source={Lens.svg}/>}
		{parts.get('path') && <Path LineOutput={LO} LineInput={LI} type={lensType} eyeRotation={eyeRotation/180*Math.PI} />}
		{parts.get('platform') && <Platform rotation={lensRotation} />}
		{parts.get('scale') && <Scale angle={lensRotation.phi-eyeRotation} />}
		<Option 
			parts={parts} 
			setParts={setParts} 
			setLensType={setLensType}
			lensRotation={lensRotation} 
			eyeRotation={eyeRotation} 
			setlensRotation={setlensRotation} 
			setEyeRotation={setEyeRotation} />
	</div>)
}

export default App
