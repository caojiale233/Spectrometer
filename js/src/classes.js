class _Point{
	//点或以O为原点的向量
	constructor(x,y,z){
		if(typeof x==='object')
		({value:[[x],[y],[z]]}=x);
		this.x=x;
		this.y=y;
		this.z=z;
	}
	toArray(){
		//转为数组
		return [this.x, this.y, this.z];
	}
	toMatrix(){
		//转为列向量(矩阵形式)
		return new Matrix.matrix([[this.x], [this.y], [this.z]]);
	}
	disTo({x:x,y:y,z:z}){
		//与点的距离
		return Math.sqrt((this.x-x)**2+(this.y-y)**2+(this.z-z)**2);
	}
	getAngle(){
		//获取点在球坐标系下的角度
		const {x:x,y:y,z:z}=this,
			length=Math.sqrt(x**2+y**2+z**2),
			theta=Math.acos(z/length);
		let phi=Math.acos(x/(length*Math.sin(theta)));
		if(y<-1E-9)phi=2*Math.PI-phi;
		return new _Spherical(theta, phi);
	}
	subtract({x:x,y:y,z:z}){
		//减去点
		return new _Point(this.x-x,this.y-y,this.z-z);
	}
	toString(){
		return `Point(${Math.round(this.x*1E4)*1E-4}, ${Math.round(this.y*1E4)*1E-4}, ${Math.round(this.z*1E4)*1E-4})`;
	}
	toVectorMatrix(){
		return new Matrix.matrix([
			[0, -this.z, this.y], 
			[this.z, 0, -this.x], 
			[-this.y, this.x, 0]
		]);
	}
	isEqual({x:x,y:y,z:z}){
		return Math.abs(x+y+z-this.x-this.y-this.z)<1E-9;
	}
}

class _Spherical{
	//球坐标系下的角度
	constructor(theta,phi){
		this.theta=theta;
		this.phi=phi;
	}
	toCartesian(length=1){
		//转指定长度直角坐标(笛卡尔坐标系)
		const {sin:sin,cos:cos}=Math,{theta:theta,phi:phi}=this;
		return new _Point(sin(theta)*cos(phi)*length,sin(theta)*sin(phi)*length,cos(theta)*length);
	}
	rotateFromZ(){
		//旋转z轴(0,0,1)至此方向
		const sinT=Math.sin(this.theta),
			cosT=Math.cos(this.theta),
			sinP=Math.sin(this.phi),
			cosP=Math.cos(this.phi);
		return new Matrix.matrix([[cosT*cosP,-sinP,sinT*cosP],[cosT*sinP,cosP,sinT*sinP],[-sinT,0,cosT]])
	}
	rotateToZ(){
		//旋转此方向至z轴(0,0,1)
		return this.rotateFromZ().T();
	}
	toString(){
		return `Angle(theta: ${Math.round(this.theta/Math.PI*1E4)*1E-4}π, phi: ${Math.round(this.phi/Math.PI*1E4)*1E-4}π)`;
	}
}

class _Line{
	//射线，给定起点与球坐标系角度
	constructor(point, angle){
		this.start=point;
		this.end=null;
		this.angle=angle;
	}
	endAt(point){
		//令射线结束于点point处
		const start=this.start;
		this.end=point;
		this.length=start.disTo(point);
		this.center=new _Point(point.toMatrix().add(start.toMatrix()).x(0.5));
		this.angle=point.subtract(start).getAngle();
		return this;
	}
	endTo(length){
		//令射线结束于长度length处
		this.length=Math.abs(length);
		const startM=this.start.toMatrix();
		this.end=this.angle.toCartesian().toMatrix().x(length).add(startM);
		this.center=new _Point(this.end.add(startM).x(0.5));
		this.end=new _Point(this.end);
		return this;
	}
}

class _Edge{
	//透镜边界，给定透镜上的点、法向量(球坐标系的方向，光疏->光密)、相对折射率(小于1表示反射面)、相交判定条件
	constructor({point,angle,n21,valid}){
		this.center=point;
		this.angle=angle;
		this.n21=n21;
		this.valid=valid;
	}
	//令线段作用在此界面上，线段终点需在边界面上，输出一条线段(默认长度150)
	effect({end:start,angle}){
		if(this.n21===1)return new _Line(start,angle).endTo(600);
		let mX=angle.toCartesian().toMatrix(),
			rotateM=this.angle.rotateToZ(),
			end=rotateM.x(mX);
		if(this.n21<1){
			end.value[2][0]*=-1;
		}
		else{
			const positive=end.value[2][0]>1E-9;
			end.value[0][0]*=(positive?1/this.n21:this.n21);
			end.value[1][0]*=(positive?1/this.n21:this.n21);
			end.value[2][0]=(positive?1:-1)*Math.sqrt(1-Math.min(end.value[0][0]**2+end.value[1][0]**2,1));
		}
		end=new _Point(rotateM.T().x(end));
		return new _Line(start,end.getAngle()).endTo(600);
	}
}

class _Lens{
	//透镜，输入透镜的多个边界面以构成一个透镜，第二个参数用于注册随透镜转动的点
	constructor(edge,keyPoints){
		this.edge=edge.map(v=>new _Edge(v));
		this.result=edge.map(v=>new _Edge(v));
		this.keyPoints=keyPoints;
		this.resultPoints=keyPoints;
		this.rotateMatrix=new Matrix.I(3);
	}
	rotate(rotateMatrix){
		//旋转透镜
		this.resultPoints=this.keyPoints.map(v=>new _Point(rotateMatrix.x(v.toMatrix())));
		this.edge.forEach((v,i)=>{
			this.result[i].center=new _Point(rotateMatrix.x(v.center.toMatrix()));
			this.result[i].angle=new _Point(rotateMatrix.x(v.angle.toCartesian().toMatrix())).getAngle();
		});
		this.rotateMatrix=rotateMatrix;
	}
	effect(l_tau){
		//输入射线，此方法将判断最先相交的界面，终止射线成线段后得到作用后的出射光线，出射光线将继续执行该方法直至不与任一界面相交(即从透镜出射)，返回值为途径光线组成的数组
		const abs=Math.abs,
			A=l_tau.angle.toCartesian().toVectorMatrix(),
			x_tau=l_tau.start.toMatrix();
			[A.value[1][2],A.value[2][0],A.value[0][1]].reduce(
				(record,v,i)=>{
					if(record || abs(v)<1E-9)return record;
					A.value.shift(i);
					A.value[2]=[0,0,0];
					return true;
				},false);
		let B=Matrix.zero(3),x_n,
		{i:index, end:end}=this.result.map(l_n=>{
			B.value[2]=l_n.angle.toCartesian().toArray();
			x_n=l_n.center.toMatrix();
			let A_B=A.add(B).inv();
			if(A_B)return A_B.x(A.x(x_tau).add(B.x(x_n)));
			return null;
		})
		.reduce((prev,cur,i)=>{
			if(cur===null)return prev;
			let p=new _Point(cur),len=p.disTo(l_tau.start);
			if(Math.abs(len-prev.len)<1E-9 || len<1E-9 || (!p.subtract(l_tau.start).isEqual(l_tau.angle.toCartesian(len))))return prev;
			if((len<prev.len || prev.len===null) && this.result[i].valid(this, p))
				return {i:i, end: p, len: len}
			else
				return prev;
		},{i:null, end: null, len: null});
		if(index===null) return[];
		l_tau.endAt(end);
		let result=[this.result[index].effect(l_tau)];
		return result.concat(this.effect(result[0]));
	}
}

window.Shape={
	polygon: function(points){
		return function(lens,point){
			const l=points.length,
				keys=points.map(v=>lens.resultPoints[v].subtract(point)),
				ref=keys[l-1].toVectorMatrix().x(keys[0].toMatrix()).value.map(v=>v>1E-9?1:v<-1E-9?-1:0);
			for(let i=1;i<l;i++){
				const res=keys[i-1].toVectorMatrix().x(keys[i].toMatrix())
				.value.reduce((state,v,i)=>(state && ref[i]*v>=0), true);
				if(!res)return false;
			}
			return true;
		}
	}
}

export { _Point, _Spherical, _Line, _Edge, _Lens }