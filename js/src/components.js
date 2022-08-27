var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import { _Point, _Spherical, _Line, _Edge, _Lens } from './classes.js';

function Eyepieces(_ref) {
	var _ref$pos = _ref.pos,
	    phi = _ref$pos.phi,
	    theta = _ref$pos.theta,
	    focus = _ref.focus,
	    source = _ref.source;

	/*  目镜 */
	var x = (phi < Math.PI ? phi : 2 * Math.PI - phi) / 0.1,
	    y = theta / 0.1,
	    lenses = ['line', 'cross', 'line'];
	return React.createElement(
		'div',
		{ className: 'Eyepieces' },
		Math.abs(x) < 1 && Math.abs(y) < 1 && React.createElement('img', {
			style: { transform: 'scale(0.5) translate(' + Math.round(Math.asin(x) * 1E2) + '%, ' + Math.round(Math.asin(y) * 1E2) + '%)' },
			className: 'Eyepieces',
			src: 'img/' + lenses[source] + '.png' })
	);
}

function Scale(_ref2) {
	var angle = _ref2.angle;

	return React.createElement(
		'div',
		{ id: 'Scale' },
		React.createElement('img', { src: 'img/protractor_inside.png' }),
		React.createElement('img', { style: { transform: 'rotate(' + (angle + 6) + 'deg)' }, src: 'img/protractor_outside.png' })
	);
}

function Platform(lensRotation) {
	var elem = null;
	function draw() {
		function lines(m, i) {
			if (i) ctx.lineTo(m.value[1][0], -m.value[2][0]);else ctx.moveTo(m.value[1][0], -m.value[2][0]);
		}
		var ctx = elem.getContext('2d'),
		    rm = Lenses[0].rotateMatrix;
		ctx.resetTransform();
		ctx.clearRect(0, 0, 500, 300);
		ctx.translate(250, 150);
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = '15px sans-serif';
		/*坐标轴 */
		ctx.beginPath();
		ctx.moveTo(-200, 0);
		ctx.lineTo(200, 0);
		ctx.moveTo(0, -125);
		ctx.lineTo(0, 125);
		ctx.setLineDash([25, 25]);
		ctx.lineWidth = 1;
		ctx.strokeStyle = "rgba(0,0,0,0.57)";
		ctx.stroke();
		/* 圆盘 */
		ctx.beginPath();
		for (var i = 0; i < 2; i += 0.1) {
			var vetor = rm.x(new Matrix.matrix([[200 * Math.cos(i * Math.PI)], [200 * Math.sin(i * Math.PI)], [0]]));
			lines(vetor.x((vetor.value[0][0] + 500) / 500), i);
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
		[[0, -200], [-173, 100], [173, 100]].forEach(function (v, i) {
			var vetor1 = rm.x(new Matrix.matrix([[v[0]], [v[1]], [0]])),
			    vetor2 = rm.x(new Matrix.matrix([[v[0]], [v[1]], [-20]]));
			vetor1 = vetor1.x((vetor1.value[0][0] + 1000) / 1000);
			vetor2 = vetor2.x((vetor2.value[0][0] + 1000) / 1000);
			lines(vetor1, false);lines(vetor2, true);
			i && ctx.fillText('\u8C03\u5E73\u87BA\u4E1D' + i, vetor2.value[1][0], -vetor2.value[2][0]);
		});
		ctx.stroke();
	}
	React.useEffect(draw, [lensRotation]);
	return React.createElement('canvas', {
		ref: function ref(el) {
			return elem = el;
		},
		id: 'Platform',
		width: '500px',
		height: '300px' });
}

function Path(_ref3) {
	var LineInput = _ref3.LineInput,
	    LineOutput = _ref3.LineOutput,
	    type = _ref3.type;

	/* 光路 */
	var elem = null;
	function draw() {
		var ctx = elem.getContext('2d');
		ctx.resetTransform();
		ctx.clearRect(0, 0, 500, 500);
		ctx.translate(250, 250);
		ctx.lineWidth = 2;
		/* 光路 */
		ctx.beginPath();
		ctx.moveTo(LineInput.start.x, -LineInput.start.y);
		ctx.lineTo(LineInput.end.x, -LineInput.end.y);
		LineOutput.forEach(function (v) {
			ctx.moveTo(v.start.x, -v.start.y);
			ctx.lineTo(v.end.x, -v.end.y);
		});
		ctx.stroke();
		/* 透镜 */
		ctx.beginPath();
		ctx.fillStyle = "rgba(187,222,251,0.37)";
		for (var i = 0, p = Lenses[type].resultPoints, l = p.length / 2; i < l; i++) {
			(i ? ctx.lineTo.bind(ctx) : ctx.moveTo.bind(ctx))((p[i].x + p[i + l].x) / 2, -(p[i].y + p[i + l].y) / 2);
		}ctx.closePath();
		ctx.stroke();
		ctx.fill();
	}
	React.useEffect(draw);
	return React.createElement('canvas', {
		ref: function ref(el) {
			return elem = el;
		},
		id: 'lightPath',
		width: '500px',
		height: '500px' });
}

function Ctrl(_ref4) {
	var state = _ref4.state,
	    setState = _ref4.setState;

	/* 底部控制面板 */
	function optionChange(e) {
		setTar(e.target.value);
	}
	function showComponent(_ref5) {
		var _ref5$target = _ref5.target,
		    name = _ref5$target.name,
		    value = _ref5$target.value,
		    checked = _ref5$target.checked;

		if (name === 'lens') {
			setState.setLensType(Number(value));
		} else {
			state.parts.set(value, checked);
			setState.setParts(new Map([].concat(_toConsumableArray(state.parts))));
		}
	}
	function change(e) {
		var delta = Number(e.target.value) * Number(stepEl.value),
		    min = Math.min,
		    max = Math.max;

		delta || (stepEl.value = 0);
		if (target === 'eyepieces') {
			setState.setEyeRotation(min(154, max(-154, state.eyeRotation + delta)));
			return;
		}
		var _state$lensRotation = state.lensRotation,
		    s1 = _state$lensRotation.s1,
		    s2 = _state$lensRotation.s2,
		    phi = _state$lensRotation.phi;

		switch (target) {
			case 'screw01':
				s1 = min(1, max(-1, s1 + delta));
				break;
			case 'screw02':
				s2 = min(1, max(-1, s2 + delta));
				break;
			case 'platform':
				phi = (phi + delta) % 360;
				break;
		}
		var mx = new Matrix.I(3),
		    my = new Matrix.I(3),
		    mz = new Matrix.I(3);
		mx.value[1][1] = mx.value[2][2] = Math.sqrt(1 - Math.pow(mx.value[1][2] = -(mx.value[2][1] = (s1 + s2) / 34.64), 2));
		my.value[0][0] = my.value[2][2] = Math.sqrt(1 - Math.pow(my.value[2][0] = -(my.value[0][2] = (s1 - s2) / 20), 2));
		mz.value[0][0] = mz.value[1][1] = Math.cos(phi / 180 * Math.PI), mz.value[0][1] = -(mz.value[1][0] = Math.sin(phi / 180 * Math.PI));
		var rm = mz.x(mx).x(my);
		window.Lenses.forEach(function (v) {
			return v.rotate(rm);
		});
		setState.setlensRotation({ s1: s1, s2: s2, phi: phi });
	}

	var _React$useState = React.useState(null),
	    _React$useState2 = _slicedToArray(_React$useState, 2),
	    target = _React$useState2[0],
	    setTar = _React$useState2[1],
	    stepEl = void 0;

	return React.createElement(
		'div',
		{ id: 'Ctrl' },
		React.createElement(
			'form',
			{ id: 'CtrlLeft', onChange: showComponent },
			React.createElement(
				'div',
				{ className: 'title' },
				'\u663E\u793A\u7EC4\u4EF6'
			),
			React.createElement(
				'label',
				null,
				React.createElement('input', { type: 'checkbox', name: 'display', value: 'eyepieces' }),
				'\u671B\u8FDC\u955C\u76EE\u955C'
			),
			React.createElement(
				'label',
				null,
				React.createElement('input', { type: 'checkbox', name: 'display', value: 'path' }),
				'\u7B80\u5316\u5149\u8DEF'
			),
			React.createElement('br', null),
			React.createElement(
				'label',
				null,
				React.createElement('input', { type: 'checkbox', name: 'display', value: 'scale' }),
				'\u5206\u5149\u8BA1\u523B\u5EA6'
			),
			React.createElement(
				'label',
				null,
				React.createElement('input', { type: 'checkbox', name: 'display', value: 'platform' }),
				'\u8F7D\u7269\u5E73\u53F0'
			),
			React.createElement('br', null),
			'\u900F\u955C\uFF1A',
			React.createElement(
				'select',
				{ name: 'lens' },
				React.createElement(
					'option',
					{ value: '0' },
					'\u65E0\u900F\u955C'
				),
				React.createElement(
					'option',
					{ value: '1' },
					'\u5E73\u9762\u955C'
				),
				React.createElement(
					'option',
					{ value: '2' },
					'\u4E09\u68F1\u955C'
				)
			)
		),
		React.createElement(
			'div',
			{ id: 'CtrlRight' },
			React.createElement(
				'div',
				{ className: 'title' },
				'\u63A7\u5236\u7EC4\u4EF6(\u5355\u4F4D\uFF1A\xB0/Click)',
				React.createElement(
					'span',
					{ id: 'ctrlTip' },
					'[?]'
				)
			),
			React.createElement(
				'div',
				{ id: 'tarCtrl' },
				React.createElement(
					'button',
					{
						style: { 'backgroundColor': '#2196f3', 'borderRadius': '0.5rem 0 0 0.5rem' },
						className: 'scrollBtn',
						onClick: change,
						onWheel: function onWheel(e) {
							change({ target: { value: e.deltaY > 0 ? -0.2 : -5 } });
						},
						value: '-1' },
					'--',
					React.createElement('br', null),
					'-'
				),
				React.createElement('input', { ref: function ref(el) {
						return stepEl = el;
					}, id: 'delta', placeholder: '\u6B65\u957F', type: 'number', step: '0.1', min: '0' }),
				React.createElement(
					'button',
					{
						style: { 'backgroundColor': '#f44336', 'borderRadius': '0 0.5rem 0.5rem 0' },
						className: 'scrollBtn',
						onClick: change,
						onWheel: function onWheel(e) {
							change({ target: { value: e.deltaY > 0 ? 0.2 : 5 } });
						},
						value: '1' },
					'++',
					React.createElement('br', null),
					'+'
				)
			),
			React.createElement(
				'form',
				{ onChange: optionChange },
				React.createElement(
					'label',
					null,
					React.createElement('input', { type: 'radio', name: 'target', value: 'screw01' }),
					'\u8F7D\u7269\u5E73\u53F0\u8C03\u5E73\u87BA\u4E1D-1'
				),
				React.createElement(
					'label',
					null,
					React.createElement('input', { type: 'radio', name: 'target', value: 'eyepieces' }),
					'\u671B\u8FDC\u955C\u65CB\u8F6C'
				),
				React.createElement('br', null),
				React.createElement(
					'label',
					null,
					React.createElement('input', { type: 'radio', name: 'target', value: 'screw02' }),
					'\u8F7D\u7269\u5E73\u53F0\u8C03\u5E73\u87BA\u4E1D-2'
				),
				React.createElement(
					'label',
					null,
					React.createElement('input', { type: 'radio', name: 'target', value: 'platform' }),
					'\u8F7D\u7269\u53F0\u65CB\u8F6C'
				)
			)
		)
	);
}

function Select(_ref6) {
	var desc = _ref6.desc,
	    onChange = _ref6.onChange,
	    type = _ref6.type,
	    name = _ref6.name,
	    children = _ref6.children,
	    def = _ref6.def;

	return React.createElement(
		'div',
		{ className: 'list' },
		desc,
		React.createElement(
			'form',
			{ className: 'listVal', onChange: onChange },
			children.map(function (v, i) {
				return React.createElement(
					'label',
					{ key: v.desc },
					React.createElement('input', {
						type: type,
						className: def === i ? 'default' : '',
						name: name,
						value: v.val }),
					React.createElement(
						'span',
						null,
						v.desc
					)
				);
			})
		)
	);
}

function Option(_ref7) {
	var parts = _ref7.parts,
	    setParts = _ref7.setParts,
	    setLensType = _ref7.setLensType,
	    lensRotation = _ref7.lensRotation,
	    eyeRotation = _ref7.eyeRotation,
	    setlensRotation = _ref7.setlensRotation,
	    setEyeRotation = _ref7.setEyeRotation;

	function showComponent(_ref8) {
		var _ref8$target = _ref8.target,
		    name = _ref8$target.name,
		    value = _ref8$target.value,
		    checked = _ref8$target.checked;

		if (name === 'lens') {
			setLensType(Number(value));
		} else {
			parts.set(value, checked);
			setParts(new Map([].concat(_toConsumableArray(parts))));
		}
	}
	function change(v) {
		var delta = v * step,
		    min = Math.min,
		    max = Math.max;

		if (target === 'eyepieces') {
			setEyeRotation(min(154, max(-154, eyeRotation + delta)));
			return;
		}
		var s1 = lensRotation.s1,
		    s2 = lensRotation.s2,
		    phi = lensRotation.phi;

		switch (target) {
			case 'screw01':
				s1 = min(1, max(-1, s1 + delta));
				break;
			case 'screw02':
				s2 = min(1, max(-1, s2 + delta));
				break;
			case 'platform':
				phi = (phi + delta) % 360;
				break;
		}
		var mx = new Matrix.I(3),
		    my = new Matrix.I(3),
		    mz = new Matrix.I(3);
		mx.value[1][1] = mx.value[2][2] = Math.sqrt(1 - Math.pow(mx.value[1][2] = -(mx.value[2][1] = (s1 + s2) / 34.64), 2));
		my.value[0][0] = my.value[2][2] = Math.sqrt(1 - Math.pow(my.value[2][0] = -(my.value[0][2] = (s1 - s2) / 20), 2));
		mz.value[0][0] = mz.value[1][1] = Math.cos(phi / 180 * Math.PI), mz.value[0][1] = -(mz.value[1][0] = Math.sin(phi / 180 * Math.PI));
		var rm = mz.x(mx).x(my);
		window.Lenses.forEach(function (v) {
			return v.rotate(rm);
		});
		setlensRotation({ s1: s1, s2: s2, phi: phi });
	}

	var _React$useState3 = React.useState('platform'),
	    _React$useState4 = _slicedToArray(_React$useState3, 2),
	    target = _React$useState4[0],
	    setTar = _React$useState4[1],
	    _React$useState5 = React.useState(1),
	    _React$useState6 = _slicedToArray(_React$useState5, 2),
	    step = _React$useState6[0],
	    setStep = _React$useState6[1];

	React.useEffect(function () {
		return document.querySelectorAll('.default').forEach(function (v) {
			return v.checked = true;
		});
	}, []);
	return React.createElement(
		'div',
		{ id: 'Option' },
		React.createElement('img', { id: 'addBtn',
			src: 'img/plus.png',
			onClick: function onClick() {
				return change(1);
			},
			onWheel: function onWheel(e) {
				change(e.deltaY > 0 ? 0.2 : 5);
			} }),
		React.createElement('img', { id: 'subBtn',
			src: 'img/minus.png',
			onClick: function onClick() {
				return change(-1);
			},
			onWheel: function onWheel(e) {
				change(e.deltaY > 0 ? -0.2 : -5);
			} }),
		React.createElement('img', { id: 'floatBtn', src: 'img/options.png' }),
		React.createElement(
			'div',
			{ id: 'menu' },
			React.createElement(
				Select,
				{
					desc: '\u7EC4\u4EF6\u663E\u793A',
					onChange: showComponent,
					type: 'checkbox',
					def: -1,
					name: '' },
				[{ val: 'eyepieces', desc: '望远镜目镜,' }, { val: 'path', desc: '简化光路,' }, { val: 'scale', desc: '分光计刻度,' }, { val: 'platform', desc: '载物平台' }]
			),
			React.createElement(
				Select,
				{
					desc: '\u900F\u955C',
					onChange: showComponent,
					type: 'radio',
					def: 0,
					name: 'lens' },
				[{ val: '0', desc: '无透镜' }, { val: '1', desc: '平面镜' }, { val: '2', desc: '三棱镜' }]
			),
			React.createElement(
				Select,
				{
					desc: '\u63A7\u5236\u5BF9\u8C61',
					onChange: function onChange(e) {
						return setTar(e.target.value);
					},
					type: 'radio',
					def: 1,
					name: 'target' },
				[{ val: 'eyepieces', desc: '望远镜旋转' }, { val: 'platform', desc: '载物台旋转' }, { val: 'screw01', desc: '载物平台调平螺丝-1' }, { val: 'screw02', desc: '载物平台调平螺丝-2' }]
			),
			React.createElement(
				Select,
				{
					desc: '\u63A7\u5236\u5E45\u5EA6/\xB0',
					onChange: function onChange(e) {
						return setStep(Number(e.target.value));
					},
					type: 'radio',
					def: 1,
					name: 'step' },
				[{ val: '0.1', desc: '0.1' }, { val: '1', desc: '1' }, { val: '10', desc: '10' }, { val: '180', desc: '180' }]
			)
		)
	);
}

function App() {
	var _React$useState7 = React.useState(0),
	    _React$useState8 = _slicedToArray(_React$useState7, 2),
	    lensType = _React$useState8[0],
	    setLensType = _React$useState8[1],
	    _React$useState9 = React.useState({ s1: 0, s2: 0, phi: 0 }),
	    _React$useState10 = _slicedToArray(_React$useState9, 2),
	    lensRotation = _React$useState10[0],
	    setlensRotation = _React$useState10[1],
	    _React$useState11 = React.useState(0),
	    _React$useState12 = _slicedToArray(_React$useState11, 2),
	    eyeRotation = _React$useState12[0],
	    setEyeRotation = _React$useState12[1],
	    _React$useState13 = React.useState(new Map([['eyepieces', false], ['platform', false], ['scale', false], ['path', false]])),
	    _React$useState14 = _slicedToArray(_React$useState13, 2),
	    parts = _React$useState14[0],
	    setParts = _React$useState14[1],
	    Lens = window.Lenses[lensType];

	var LI = void 0,
	    LO = void 0;
	LI = lensType === 1 ? new _Spherical(Math.PI / 2, (eyeRotation / 180 + 1) * Math.PI) : new _Spherical(Math.PI / 2, 0);
	LI = new _Line(LI.toCartesian(-600), LI).endTo(800);
	LO = Lens.effect(LI);
	React.useEffect(function () {
		Model3D.drawLines(LI, LO);
		Model3D.gltf.platform.rotation.z = Math.asin((lensRotation.s1 + lensRotation.s2) / 34.64);
		Model3D.gltf.platform.rotation.x = Math.asin((lensRotation.s1 - lensRotation.s2) / 20);
		Model3D.gltf.Platform.rotation.y = lensRotation.phi / 180 * Math.PI;
		Model3D.gltf.lenses.forEach(function (v, i) {
			return v && (v.position.y = i === lensType ? 0 : -1.5);
		});
		Model3D.gltf.Protractor.rotation.y = eyeRotation / 180 * Math.PI;
	}, [lensRotation, eyeRotation, lensType]);
	return React.createElement(
		'div',
		null,
		parts.get('eyepieces') && React.createElement(Eyepieces, {
			focus: 0.0,
			pos: { phi: (LO[LO.length - 1] || LI).angle.phi - eyeRotation / 180 * Math.PI, theta: (LO[LO.length - 1] || LI).angle.theta - Math.PI / 2 },
			source: lensType }),
		parts.get('path') && React.createElement(Path, { LineOutput: LO, LineInput: LI, type: lensType, eyeRotation: eyeRotation / 180 * Math.PI }),
		parts.get('platform') && React.createElement(Platform, { rotation: lensRotation }),
		parts.get('scale') && React.createElement(Scale, { angle: lensRotation.phi - eyeRotation }),
		React.createElement(Option, {
			parts: parts,
			setParts: setParts,
			setLensType: setLensType,
			lensRotation: lensRotation,
			eyeRotation: eyeRotation,
			setlensRotation: setlensRotation,
			setEyeRotation: setEyeRotation })
	);
}

export default App;