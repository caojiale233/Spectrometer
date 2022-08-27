(()=>{
	/*Utils*/
	function size(value){
		return !value?[0,0]:[value.length,value[0].length];
	}
	function invalid(){throw "Invalid matrix Rank";}
	function setValue(value){
		//设置值
		this.value=value;
		this.size=size(value);
	}
	function help(){
		console.log(`矩阵存在以下方法：
		m1.x(m2): 矩阵乘法，返回新矩阵m3=m1m2
		m1.add(m2): 矩阵加法，返回新矩阵m3=m1+m2
		m1.set(arr): 将矩阵m1的值设为二维数组arr
		m1.inv(): 对矩阵m1求逆矩阵，返回值为一个新矩阵
		m1.T(): 对矩阵m1求转置矩阵，返回值为一个新矩阵`);
	}

	/*classes*/
	class ezMatrix{
		constructor(value){
			this.type=ezMatrix;
			this.size=[0,0];
			this.value=value;
			this.x=multiply;
			this.add=add;
		}
	}
	class matrix{
		//实矩阵
		constructor(value){
			this.help=help;
			this.type=matrix;
			this.value=value;
			this.size=size(value);
			this.x=multiply;
			this.add=add;
			this.set=setValue;
			this.inv=inverse;
			this.T=transpose;
		}
		toString(){
			return `[${this.value.map(v=>v.join(',')).join(';')}]`;
		}
	}
	class complexMatrix{
		//复矩阵
		constructor(value){
			this.help=help;
			this.type=complexMatrix;
			this.value=value;
			this.size=size(value);
			this.set=setValue;
			//this.x=multiply;
			//this.add=add;
			//this.inv=inverse;
			this.T=transpose;
			this.conj=conjugate;
		}
		toString(){
			return `[${this.value.map(v=>v.join(',')).join(';')}]`;
		}
	}

	/*calculate*/
	function multiply(_m2){
		//乘_m2
		let m1=this.value;
		//this数乘_m2
		if(typeof _m2==="number")return new this.type(
			m1.map(
				row=>row.map(
					value=>value*_m2
				)
			)
		);
		//this矩阵乘_m2
		if(this.size[1]!==_m2.size[0])invalid();
		let m2=_m2.value;
		let product=m1.map(
			(row,i)=>m2[0].map(
				(col,j)=>row.reduce(
					(prev,cur,k)=>prev+cur*m2[k][j]
				,0)
			)
		);
		if(product.length+product[0].length===2)return product[0][0];
		return new this.type(product);
	}
	function add(_m2){
		//加_m2
		if(this.size[0]!==_m2.size[0]||this.size[1]!==_m2.size[1])invalid();
		let m1=this.value,m2=_m2.value;
		return new this.type(
			m1.map((row,i)=>row.map((value,j)=>value+m2[i][j]))
		);
	}
	function inverse(){
		//逆阵
		const size=this.size[0];
		if(Math.abs(determinant(this))<1E-9){/*console.error('行列式为0，逆矩阵不存在');*/return null;}
		let value=this.value.map(i=>i.slice());
		value.forEach((v,i)=>{for(let j=0;j<size;j++)value[i].push(0);value[i][i+size]=1;});
		for(let j=0;j<size;j++)
			for(let i=j+1;i<size;i++)
				value[i]=new ezMatrix([value[j]]).x(-value[i][j]/value[j][j]).add(new ezMatrix([value[i]])).value[0];
		for(let j=size-1;j>0;j--)
			for(let i=j-1;i>=0;i--)
				value[i]=new ezMatrix([value[j]]).x(-value[i][j]/value[j][j]).add(new ezMatrix([value[i]])).value[0];
		for(let i=0;i<size;i++)
			value[i]=new ezMatrix([value[i]]).x(1/value[i][i]).value[0];
		value=value.map(i=>i.slice(size));
		return new this.type(value);
	}
	function transpose(){
		//转置
		const m1=this.value;
		return new this.type(
			m1[0].map(
				(col,i)=>m1.map(
					(row,j)=>m1[j][i]
				)
			)
		);
	}
	function conjugate(){
		//共轭
		return;
	}


	/*Module: Matrix*/
	class Matrix{
		constructor(){
			this.matrix=matrix;
			this.complex=complexMatrix;
			this.tr=trace;
			this.I=identity;
			this.zero=zero;
			this.det=determinant;
		}
		help(){
			console.log(`Matrix存在以下方法：
			matrix(): 实矩阵对象，使用new关键字来新建
			complex(): 复矩阵对象，用new关键字来新建
			det(m): 矩阵工具，求矩阵m的行列式
			tr(m): 矩阵工具，求矩阵m的迹
			I(n): 创建一个n阶单位实矩阵I`);
		}
	}
	/*Matrix method*/
	function determinant({value:v,size:size}){
		//行列式
		if(size[1]!==size[0])invalid();
		if(size[0]===3)
			return v[0][0]*v[1][1]*v[2][2]+v[0][1]*v[1][2]*v[2][0]+v[0][2]*v[1][0]*v[2][1]-v[0][2]*v[1][1]*v[2][0]-v[0][1]*v[1][0]*v[2][2]-v[0][0]*v[1][2]*v[2][1];
		if(size[0]===2)
			return v[0][0]*v[1][1]-v[0][1]*v[1][0];
		return 0;
	}
	function trace({value:v,size:size}){
		//迹
		if(size[1]!==size[0])invalid();
		return v.reduce((prev,cur,i)=>prev+cur[i],0);
	}
	function eigenvalue(){
		//特征值
		return;
	}
	function equations(ma,mb){
		//解向量x=系数矩阵ma^-1*常向量mb
		return ma.inv().x(mb);
	}
	function identity(n){
		//单位矩阵I
		let value=new Array(n).fill(0).map(i=>new Array(n).fill(0));
		value.forEach((i,j)=>{value[j][j]=1});
		return new matrix(value);
	}
	function zero(n){
		//零矩阵O
		let value=new Array(n).fill(0).map(i=>new Array(n).fill(0));
		return new matrix(value);
	}

	/*Initialization*/
	if(window.Matrix===undefined)
	window.Matrix=new Matrix();
})();