var dr = (function () {
	'use strict';

	/**
	 * 顺序循环
	 * @param agg
	 * @param fn
	 * @returns {*}
	 */
	function each (agg, fn) {
		if (agg && (typeof fn === 'function')) {
			var i, __agg = (typeof agg === 'string') ? agg.split('') : agg;

			if ('length' in __agg) {
				for (i = 0; i < __agg.length; i++) {
					if (fn(__agg[i], i) === false) break;
				}
			}
			else {
				var k, index = 0;
				for (k in __agg) {
					if (fn(__agg[k], k, index++) === false) break;
				}
			}
		}
	}

	function transform (agg, fn, res) {
		each(agg, function (val, key, index) {
			var _is = fn.call(null, res, val, key, index);
			return _is !== undefined ? _is : true
		});
		return res
	}

	function isString (str) {
		return typeof str === 'string';
	}

	function split (str, s) {
		if (!str || !isString(str)) return [];
		return str.split(s)
	}

	/**
	 * 防抖函数
	 * @param fn    源函数
	 * @param delay    延迟时间
	 * @returns {*}
	 */
	var debounce = (fn, delay)=> {
		let __present = true;
		let __arguments;

		return function () {
			__arguments = arguments;

			//在既定时间内只执行一次
			if (__present) {
				__present = false;
				setTimeout(function () {
					fn.apply(null, __arguments);
					__present = true;
				}, delay || 0);
			}
		}
	};

	function isObject (obj) {
		return obj ? typeof obj === 'object' && !('length' in obj) : false
	}

	function isArray (arr) {
		return typeof arr === 'object' && 'length' in arr
	}

	/**
	 * 查询a字符串中是否包含b字符串
	 * @param a
	 * @param b
	 * @return {boolean}
	 */
	function hasStr (a, b) {
		return a.indexOf(b) !== -1
	}

	function get (target, path) {
		if (!target) return target;
		var _t = target,
			_p = String(path).split('.');

		for (var i = 0; i < _p.length; i++) {
			_t = _t[_p[i]];
			if (_t === undefined) break;
		}

		return _t;
	}

	/**
	 * 是否是数字
	 * @param val    源函数
	 * @returns {*}
	 */
	function isNumeric (val) {
		var valType = typeof val;
		return valType === 'number' || (valType !== 'object' && valType !== 'boolean' && Number(val) >= 0);
	}

	function getEl (el, slt) {
		var __slt = slt ? slt : el;
		var __el = slt ? el : document;
		return __el.querySelector(__slt)
	}

	function setAttr (el, attrName, value) {
		el && el.setAttribute(attrName, value);
		return el
	}

	/**
	 * 处理calss属性
	 * 测试
	 * dom = utils.dom;
	 * aaa = dom.getEl('body');
	 * dom.addClass(aaa,'bbbb');
	 * dom.addClass(aaa,'cccc dddd ffff');
	 * dom.removeClass(aaa,'bbbb   cccc');
	 * dom.replaceClass(aaa,'dddd','bbbb');
	 *
	 * @param el 被处理的元素
	 * @param className 单个|空格多个|array
	 * @param type add|remove
	 * @returns {*}
	 */
	function _handleClass (el, className, type) {
		if (el && className) {
			if (typeof className === 'string' && className.indexOf(' ') > -1) {
				className = className.split(' ');
			}

			var handle = function (elm) {
				if (typeof className === 'string') {
					elm.classList[type](className);
				}
				else {
					var i, n;
					for (i = 0; i < className.length; i++) {
						n = (className[i] || '').replace(' ', '');
						if (n) elm.classList[type](n);
					}
				}
			};

			((typeof el === 'object') && ('length' in el)) ? el.forEach(handle) : handle(el);
		}

		return el;
	}

	/**
	 * 添加样式类名称
	 * 注意做兼容，当前只兼容到ie10
	 * 要更好兼容要用ele.className的方式
	 * @param el
	 * @param className
	 * @returns {*}
	 */
	function addClass (el, className) {
		return _handleClass(el, className, 'add');
	}

	function removeClass (el, className) {
		return _handleClass(el, className, 'remove');
	}

	/**
	 * 元素是否包含指定类
	 * aaa = createEl('div','6666',{class:'lihong mimi'});append(getEl('body'),aaa);
	 * @param el
	 * @param className
	 * @returns {number}
	 */
	function hasClass (el, className) {
		return (el.className || '').split(' ').indexOf(className) > -1;
	}

	/**
	 * 获取元素的父节点
	 * @param el
	 * @returns {*|Node}
	 */
	function getParent (el) {
		return el && el.parentNode
	}

	function toggleClass (el, className) {
		return _handleClass(el, className, 'toggle');
	}

	function getElAll (el, slt) {
		var __slt = slt ? slt : el;
		var __el = slt ? el : document;
		return __el.querySelectorAll(__slt)
	}

	function getAttr (el, attrName) {
		return el ? el.getAttribute(attrName) : el
	}

	/**
	 * 获取元素的内外宽px
	 * @param el    元素
	 * @param inner    是否为内尺寸
	 * @returns {number}
	 */
	function getWidth (el, inner) {
		return el ? (inner ? el.clientWidth : el.offsetWidth) : el
	}

	/**
	 * 获取元素的内外高px
	 * @param el    元素
	 * @param inner    是否为内尺寸
	 * @returns {number}
	 */
	function getHeight (el, inner) {
		return el ? (inner ? el.clientHeight : el.offsetHeight) : el
	}

	/**
	 * 枚举元素的父元素
	 * @param el    起始元素
	 * @param fn    枚举方法
	 * @returns {*}
	 */
	function mapParents (el, fn) {
		while (el && getParent(el) && fn) {
			el = getParent(el);
			var _a = fn(el);
			if (_a === false) break;
		}
	}

	/**
	 * 获取元素的所有父节点
	 * append(getEl('body'),createEl('div',{class:'mimi'},'456789',[createEl('div',{class:'mama'},789)]))
	 * @param el    目标元素
	 * @param slt    指定选择器的父节点
	 * @returns {Array}
	 */
	function getParents (el, slt) {
		var res = [];

		mapParents(el, function (p) {
			if (slt) {
				var _p = getParent(p);
				if (_p && getEl(_p, slt)) {
					res.push(p);
					return false
				}
			}
			else res.push(p);
		});

		return res;
	}

	/**
	 * 获取元素的所有兄弟节点
	 * @param el
	 * @returns {*|Node}
	 */
	function getSiblings (el) {
		var a = [];
		
		if (el) {
			var p = el.parentNode.children;
			for (var i = 0, pl = p.length; i < pl; i++) {
				if (p[i] !== el) a.push(p[i]);
			}
		}

		return a;
	}

	var isMobile$1 = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);

	function getTarget (event) {  //返回事件的实际目标
		return event.target || event.srcElement;
	}

	/**
	 * 添加事件
	 * @param element    事件元素
	 * @param type    事件类型
	 * @param sltorOrHandler    代理选择器
	 * @param handler    事件函数
	 */
	function addHandler (element, type, sltorOrHandler, handler) {
		var __sltor = handler ? sltorOrHandler : null;
		var __handler = handler || sltorOrHandler;
		var __wrapper = __sltor && typeof __sltor === 'string' ? getParent(getEl(element, __sltor)) : null;

		//事件委托
		function eventFn(e) {
			var stop = null;
			var target = getTarget(e);
			var execute = target === element;
			var t = null;

			if (__sltor) {
				//字符串则查找
				if (typeof __sltor === 'string') {
					//一次循环都没有的 直接就可以获取到目标的 说明在目标外层了 不算
					if (!getEl(target, __sltor)) {
						//目标和事件触发元素一致的情况也去掉 因为已经在上文做判断，这里避免浪费循环计算资源
						if (target !== element) {
							var include = function (children, el) {
								var _include = false;

								for (var i = 0; i < children.length; i++) {
									if (children[i] === el) {
										_include = true;
										break;
									}
								}

								return _include
							};

							mapParents(target, function (ele) {
								//查询已经到达绑定的最外层，则停止
								if (__wrapper === ele) return false;

								//如果当前被点击的目标在代理元素内(从其父元素使用选择器查找目标，如果能查找到，并且当前元素也在查找到的元素集合之内，则认为是被代理的元素)，则执行
								var _p = getParent(ele);
								var _children = _p && getElAll(_p, __sltor);
								if (_children && include(_children, ele)) {
									execute = true;
									t = ele;
									return false
								}
							});
						}
					}
				} else {
					//函数 或 节点对象
					if (typeof __sltor === 'function') execute = __sltor(e);
					else execute = e.target === __sltor;
				}
			}

			//根据是否有代理的情况来决定是否执行
			if (__sltor ? execute : true) stop = __handler.call(this, e, t || target);

			//如果事件函数有返回false，则禁止事件默认行为
			if (stop === false) return false;
		}

		if (element.addEventListener) {
			element.addEventListener(type, eventFn, false);  //使用DOM2级方法添加事件
		} else if (element.attachEvent) {                    //使用IE方法添加事件
			element.attachEvent("on" + type, eventFn);
		} else {
			element["on" + type] = eventFn;          //使用DOM0级方法添加事件
		}
	}

	function stopPropagation(event) {
		//立即停止事件在DOM中的传播
		//避免触发注册在document.body上面的事件处理程序
		if (event.stopPropagation) {
			event.stopPropagation();
		} else {
			event.cancelBubble = true;
		}
	}

	let events$1 = {};

	function getEvent$1(name) {
		return events$1[name] = events$1[name] || []
	}

	//type offFilter配合offEvent使用，用来过滤
	function _on(type, target, fn, onceEvent, offEvent, offFilter) {
		if (!fn) return 'Bus event function is none!';

		//如果有定义销毁事件 有传递offFilter则返回true的时候才销毁
		if (offEvent) {
			if(offFilter){
				let fn2 = function () {
					if(offFilter.apply(null, arguments)){
						off(type, fn);
						off(offEvent, fn2);
					}
				};
				on$1(offEvent, fn2);
			}
			else {
				once(offEvent, ()=> {
					off(type, fn);
				});
			}
		}

		//防止重复绑定同一事件函数
		let evs = events$1[type] || [];
		for (let index = evs.length - 1; index > -1; index--) {
			let e = evs[index];
			if (fn === e) evs.splice(index, 1);
		}

		//注册事件
		fn.$target = target;
		fn.$once = !!onceEvent;
		getEvent$1(type).push(fn);
	}

	function on$1(type, fn, offEvent, offFilter) {
		_on(type, false, fn, false, offEvent, offFilter);
	}

	function once(type, fn, offEvent, offFilter) {
		_on(type, false, fn, true, offEvent, offFilter);
	}

	function emit$1(type, n) {
		let evs = events$1[type] || [];
		for (let index = evs.length - 1; index > -1; index--) {
			let e = evs[index];
			let $t = e.$target;
			if ($t ? (typeof $t === 'function' ? $t(n) : $t === n) : true) {
				e(n);
				if (e.$once) evs.splice(index, 1);
			}
		}
	}

	//参数2不存在则删除全部监听 否则删除对应事件函数或函数名的函数
	function off(type, fnOrName) {
		let evs = events$1[type] || [];
		if (!fnOrName) delete events$1[type];
		else for (let index = evs.length - 1; index > -1; index--) {
			let e = evs[index];
			if (fnOrName === e || e.name === fnOrName) {
				evs.splice(index, 1);
			}
		}
	}

	var index = {
		on: on$1,
		once,
		emit: emit$1,
		events: events$1,
		off,
		_on
	};

	var emptyFun = new Function;

	/**
	 * 当前页面所有元素pms对象的挂载
	 * 要使用的私有pms必须要先定义，否则会读写父级pms或者根目录的值
	 * 使用el.pmsid来标识
	 * 处理逻辑
	 * setPms        存pms，index,value设置自己的，prop不能设置值，其余取pms对象(如果自己pms不存在这个key，则往上查找包含这个key的父对象，通过原型链方式)。
	 * getPms        取pms，index,prop,value都是找自己的，其余取pms对象(如果自己pms不存在这个key，则往上查找包含这个key的父对象，通过原型链方式)。
	 * resolvePms    为元素获取一个pms对象，如果自己有dr-pms则自己生成一个，没有则找父级，最后返回一个可用对象给get/set。
	 *
	 * 这种方式符合一般的开发习惯，dr-pms可以看成是当前元素的逻辑交互的参数依赖表，让后期维护更有序可循。
	 *
	 * 对程序来说，getPms，setPms才是操作api
	 */

	var pms = window['__DR_PMS__'] = {
		idx: 1,
		pageTrans: null,//是否使用页面跳转过渡 会显示loading 格式{}或true
		scrollTarget: 'window',//滚动元素 window | body
		pageLoadingHtml: 'Loading',//pageLoading元素
		loadingHtml: 'Loading',//loading元素
		loadingClass: '',//loading元素容器样式
		loadingShade: 'rgba(255,255,255,1)',//loading遮罩色
		fill: emptyFun,//动态获取数据并填充 未实现
		cache: false,//是否缓存动态获取的数据 未实现
		elms: {},//元素上面的pms对象
		tips: {},//tip钩子 如 (msg,closeTime)=>{...}
		root: {
			__isPms__: 1,
			__isRoot__: 1
		},//根对象，当元素自己和父级都没有定义dr-pms的时候则使用这个
		//1: {}//key是元素的eid
	};

	//滚动目标是window
	var isWindowScroll = () => pms.scrollTarget === 'window';

	let bodyEl = null;

	var bodyEl$1 = () => bodyEl = bodyEl || getEl('body');

	var windowEventHandler = (type, handler, options) => {
		type === 'scroll' && !isWindowScroll() ? addHandler(bodyEl$1(), 'scroll', handler) : window.addEventListener(type, handler, options);
	};

	/**
	 * 去除所有空白符
	 * 包括空格 换行符 tab
	 * @param str
	 * @returns {string|XML|void|*}
	 */
	var clearSpace = str => str ? str.replace(/(\r|\n|\s*|&nbsp;)/g, '') : str;

	var resolveClassLut = lut => {
		if (!lut) return null;

		let classLut = [], tasks = [];

		//拆解class表达式 要兼容有下标选择器{0,1}的表达式
		let _lut_arr = split(clearSpace(lut), ',');
		for (let cur, i = _lut_arr.length - 1; i >= 0; i--) {
			cur = _lut_arr[i];

			//合并下一个值并且跳过下一个
			if (isNumeric(cur[0])) classLut.push(_lut_arr[i -= 1] + ',' + cur);
			else classLut.push(cur);
		}

		each(classLut, v => {
			let targetLut, target, classTasks = [], classExp;
			targetLut = split(v, '|');

			//省缺target情况下 设置默认为self
			target = targetLut[1] ? targetLut[0] : 'self';

			//兼容省缺target情况
			classExp = targetLut[1] || targetLut[0];

			//如果有定义类名
			if (classExp) {
				let name, type, methods = ['add', 'remove', 'toggle'];
				each(split(classExp, '&'), l => {
					name = split(l, '.');

					if (methods.includes(name[0])) {
						type = name[0];
						name.splice(0, 1);
					}
					else type = 'toggle';

					classTasks.push({name, type});
				});
			}

			tasks.push({
				class: classTasks,
				target: target
			});
		});

		return tasks
	};

	var isBool = str=> /^(null|true|false|NaN)$/.test(str);

	var isStrFlag = w => w === '"' || w === "'";

	//判断单个字符是否为数字
	let isNumOne$1 = str => !!Number(str);

	//分析字符方式切分表达式，避免被字符串或数值参数污染，支持符号，不要用字母或数字这些可以用于变量名的字符串
	// 测试语句
	// if(fnPms==="'disabled,li{0}|active-li.disabled-li.my'") debugger;
	var expSplit = (exp, flag) => {
		let isStr = false, spt = null;
		let isNum = false;
		let word = '';
		let exs = [];
		let __exp = clearSpace(exp);

		each(__exp, w => {
			let w_isNum = isNumOne$1(w);

			//打数字串标记 数字和点 都是数值的组成部分
			if (w_isNum) isNum = true;
			if (!w_isNum && w !== '.') isNum = false;

			//打字符串标记 字符串总是用引号成对来表示 只要在第二次引号出现时反向即可 （要记录spt是因为需要兼容'"dd"'的情况）
			if (isStrFlag(w)) {
				//如果还没有打标记，则打上标记，否则如果已经打标则判断是否为上次的符号，是则取消标记并赋空
				if (!isStr) {
					isStr = true;
					spt = w;
				} else if (spt === w) {
					isStr = false;
					spt = null;
				}
			}

			//到达flag 如果不是字符串标记生效中，就写入
			if (w === flag && !isStr && !isNum) {
				exs.push(word);
				word = '';
			} else word += w;
		});

		//没有以flag结束的情况
		if (word) exs.push(word);

		return exs
	};

	/**
	 * handler表达式的拆解
	 * @param exp
	 * @param ext 额外的任务
	 */
	var resolveHandlerExp = (exp, ext)=> {
		if (!exp) return [];
		//前置处理器为支持异步，并且支持防抖，需要组装为集合格式 如{exp:'delay(2000,"mouseleave")',ctx:{}}后面ctx部分可以用来存储promise实例等
		//利用js数组引用的特性，在handler内部就可以总是替换成下一次的promise实例
		let handler_arr = expSplit(exp, '.');
		let handlers = transform(handler_arr, (res, val) => {
			//避免不正确的格式被压入
			if (val[0] !== '(' && val[val.length - 1] === ')') {
				res.push({exp: val, ctx: {}});
			}
		}, []);

		if (ext) handlers.push({exp: ext, ctx: {}});

		return handlers
	};

	/**
	 * 挂载事件元素自身的pms定义和scope的pms定义
	 * @param name
	 * @param el
	 * @returns {Array}
	 */
	var getDrEl = (name, el) => {
		let __slt = '[dr-' + name + ']';
		return el ? getElAll(el, __slt) : getElAll(__slt)
	};

	/**
	 * 发送dr事件
	 * @param eventName
	 * @param target
	 * @param prop
	 * @param scopeEl
	 * @param orgEvent 原始事件 如click等dom原生事件
	 */
	var drEmit = (eventName, target, prop, scopeEl, orgEvent) => {
		//广播当前事件的：触发元素，接收到的参数，所在作用域(可选)
		index.emit(eventName, {
			isDr: true,
			type: eventName,
			target: target,
			prop: prop,
			scopeEl: scopeEl,
			orgEvent,
		});
	};

	var elIndexOf = (elms, elm) => {
		let index = -1;

		each(elms, (c, i) => {
			if (c === elm) {
				index = i;
				return false
			}
		});

		return index
	};

	var getScroll = () => {
		let body = document.documentElement || document.body || {};
		return {t: body.scrollTop, l: body.scrollLeft, w: body.scrollWidth, h: body.scrollHeight}
	};

	var getBoxClient = el => el && el.getBoundingClientRect();

	var getClientSize = () => {
		let dom = document;
		return {
			h: dom.documentElement.clientHeight || dom.body.clientHeight,
			w: dom.documentElement.clientWidth || dom.body.clientWidth,
		}
	};

	/**
	 * 判断元素中是否包含某个子元素
	 * 参考2011.9.24 by 司徒正美 https://www.jb51.net/article/26158.htm
	 * @param root
	 * @param el
	 * @returns {*}
	 */
	var contains = (root, el) => {
		if (root.compareDocumentPosition)
			return root === el || !!(root.compareDocumentPosition(el) & 16);
		if (root.contains && el.nodeType === 1) {
			return root.contains(el) && root !== el;
		}
		while ((el = el.parentNode)) {
			if (el === root) return true;
		}
		return false;
	};

	/**
	 * 当前页面所有事件的挂载
	 * eid是dr渲染时注册到元素的全局唯一id，一个元素只有一个eid，注意，它不是事件记录的唯一eid，而是指元素element_id
	 */

	var events = window['__DR_EVENTS__'] = {
		idx: 1,
		// 'click': [
		// 	{
		// 		id: 1,//任务id
		// 		el: null,//该任务的接受元素
		// 		before: '',//事件前置任务 返回决断结果或者任务上下文元素
		// 		tasks: [
		// 			{
		// 				class: [{name: 'active', type: 'add'}],//type: toggle|add|remove
		// 				target: '.bz-tab-cell'//要处理样式的target
		// 			}
		// 		]
		// 	}
		// ]
	};

	var runClass = (tasks, selfEl) => {
		each(tasks, task => {
			let target = task.target;
			let isLimit = hasStr(target, '{');
			let limit_index_lst = split(get((/\{(.*)\}/).exec(target), 1), ',');
			let targetSlt = isLimit ? split(target, '{')[0] : target;
			let targetEls = targetSlt === 'self' ? (('length' in selfEl) ? selfEl : [selfEl]) : getElAll(targetSlt);

			//开始为元素转载样式类
			each(task.class, item => {
				let type = item.type;
				let name = item.name;

				let ship_className = targetEl => {
					//切换类操作，则根据查询逐项查询做remove / add归类
					if (type === 'toggle') {
						each(name, n => hasClass(targetEl, n) ? removeClass(targetEl, n) : addClass(targetEl, n));
					}
					else if (type === 'add') {
						addClass(targetEl, name);
						drEmit('onAdd', targetEl, name, targetEl);
					}
					else if (type === 'remove') {
						removeClass(targetEl, name);
						drEmit('onRemove', targetEl, name, targetEl);
					}

					drEmit('onChange', targetEl, {type: type, className: name}, targetEl);
				};

				//给选中的所有元素添加样式
				if (targetEls) {
					if (limit_index_lst.length) each(limit_index_lst, val => (val || val === 0) && ship_className(targetEls[val]));
					else each(targetEls, ship_className);
				}
			});
		});
	};

	var isFormEl = el => el.type;

	var makeValue = str => (new Function('return ' + str))();

	var isFunction = ogg => typeof ogg === 'function';

	var noUndefined = v => v !== undefined;

	//判断单个字符是否为数字
	let isNumOne = str => !!Number(str);

	//句柄词法分析 (var1,...)(var1...) => [[var1,...],[var2,...]]
	var parseExp = exp => {
		let isStr = false, spt = null;
		let isContinue = false;
		let isNum = false;
		let word = '';
		let exs = [[]], exsIndex = 0;
		let __exp = clearSpace(exp);

		each(__exp, (w, i) => {
			//跳出本次
			if (isContinue) {
				isContinue = false;
				return true;
			}

			//解析开始和结束
			if (i < 1 && w === '(') return true;
			if (w === ')' && !noUndefined(__exp[i + 1])) return false;

			//如果当前到达‘)(’，则跳出本次循环，并创建一个新的数组，指针移到新数组
			if (!isStr && !isNum && w === ')' && __exp[i + 1] === '(') {
				//将当前word写入结果
				if (word) exs[exsIndex].push(word);

				//清空状态跳入下一组
				word = '';
				exs.push([]);
				exsIndex += 1;
				isContinue = true;
				return true;
			}

			///// ======== 开始正常解析 / 该部分的逻辑和 expSplit.js 一致

			//当前字符是数字
			let w_isNum = isNumOne(w);

			//打数字串标记 数字和点 都是数值的组成部分
			if (w_isNum) isNum = true;
			if (!w_isNum && w !== '.') isNum = false;

			//打字符串标记 字符串总是用引号成对来表示 只要在第二次引号出现时反向即可 （要记录spt是因为需要兼容'"dd"'的情况）
			if (isStrFlag(w)) {
				//如果还没有打标记，则打上标记，否则如果已经打标则判断是否为上次的符号，是则取消标记并赋空
				if (!isStr) {
					isStr = true;
					spt = w;
				} else if (spt === w) {
					isStr = false;
					spt = null;
				}
			}

			//到达变量分隔符 如果不是字符串标记生效中，就写入并重置word，否则正常累积攒词汇
			if (w === ',' && !isStr && !isNum) {
				exs[exsIndex].push(word);
				word = '';
			} else word += w;
		});

		//没有以变量分隔符结束的情况
		if (word) exs[exsIndex].push(word);

		return exs
	};

	/**
	 * 编译函数表达式，并执行
	 * 例如：emit('titleClick',index,null,'li','index') 或 skate('left')('s1')
	 * 参数解析：index会从dr-pms中或全局取值，而null则被原样输出
	 * 传递的参数类型：字符串，数值，布尔值，变量名（没有引号的字符串）
	 * !!!不支持js表达式，如函数、三元运算符及其他各种运算符，确实需要可以写在dr-pms中，保持on表达式的干净（纯调用变量）
	 *
	 * @param exp 表达式
	 * @param el 执行该表达式的节点对象 没有传递参数则选填
	 * @param e 触发执行该表达式的事件对象 被执行的方法没有事件对象依赖则选填
	 * @param ctx 指令实例全生命周期的上下文
	 * @param handlerState 指令实例全生命周期的上下文
	 * @param pipe function 针对本次任务的管道（上下文）
	 * @param next function 回调函数
	 * @param widget 组件名称 用来获取私有属性
	 * @param handle function 针对本次任务的操作句柄
	 * @returns {*}
	 */
	var script = (exp, el, e, next, pipe, ctx, handlerState, widget, handle) => {
		if (!exp || !isString(exp)) return;
		let __exp = clearSpace(exp);

		//函数名
		let fnName = split(__exp, '(')[0];

		if (fnName) {
			//表达式去掉函数名 解析得到 ('tabClick','name')('s1') => [[var1,...],[var2,...]]
			let parseParams = parseExp(__exp.slice(fnName.length));

			//解析参数 分析字符串，提取参数 支持4种类型：pms变量名、布尔值、字符串、数值
			let argsCollection = [], args;
			each(parseParams, fnPms => {
				args = [];

				each(fnPms, word => {
					let __pm = word;
					let __pmNum = Number(word);

					//布尔量 null true false undefined NaN
					if (isBool(word)) __pm = makeValue(word);
					//数值
					else if (__pmNum === 0 || __pmNum) __pm = __pmNum;
					//字符串 或 变量名
					else {
						//字符串 则删除头尾字符串
						if (isStrFlag(word[0])) __pm = word.substring(1, word.length - 1);
						//变量名 从pms取
						else __pm = getPms(el, word, e, next, pipe, ctx, handlerState, widget);
					}

					args.push(__pm);
				});

				argsCollection.push(args);
			});

			//优先使用组件私有处理器
			let pro = draftHandler.pro[widget],
				__draftHandler = pro && pro[fnName] ? pro : draftHandler;

			//兼容全局环境常量 2023.2.14 去掉return window[fnName]，避免被全局状态污染都不知道，让人无法追查bug，只允许在pms中显式定义
			if (fnName === window) return window;
			if (!__draftHandler[fnName]) return;//return window[fnName];

			// => (function(d,el){return d.emit(el)})(draftHandler, el).apply(null,args)  如果存在二级函数并且被调用（参数解析有第二个数组），则将结果继续.apply(null,args2)
			let res = (new Function('d,n,el,e,p,c,s,h', 'return d.' + fnName + '(n,el,e,p,c,s,h)'))(__draftHandler, next || emptyFun, el, e, pipe || emptyFun, ctx || {}, handlerState || {}, handle).apply(__draftHandler, argsCollection[0]);
			return (isFunction(res) && argsCollection[1]) ? res.apply(null, argsCollection[1]) : res;
		}
	};

	/**
	 * 指令执行
	 * 主要处理参数兼容和propAs简写语法 nextTask用于传递剩余的任务循环
	 * todo:这里将来考虑缓存指令编译后的函数式，script只负责编译，不再负责执行，runHandler负责对函数式传入上下文
	 * @param handler
	 * @param nextTask
	 * @param el
	 * @param e
	 * @param pipeFn
	 * @param ctx
	 * @param widget
	 * @param handleFn
	 * @return {*}
	 */
	let runHandler = (handler, nextTask, el, e, pipeFn, ctx, widget, handleFn) => {
		let handlerExp = handler.exp;
		let handlerExp_split = split(handlerExp, '(');
		let handler_name = handlerExp_split[0];

		//修正无圆括号的表达式
		let __exp_script = handlerExp_split[1] ? handlerExp : (handlerExp + '()');
		return script(__exp_script, el, e, nextTask, pipeFn(handler_name), ctx, handler.ctx, widget, handleFn);
	};

	/**
	 * 执行事件触发之后的任务
	 * 含事件前置处理器、css类操作任务
	 * 事件处理器每次执行，都会生成针对事件本次执行过程的上下文pipe作为handler的第四参数传入handler
	 * @param handlers 处理器队列
	 * @param el 任务对象执行的上下文节点对象
	 * @param e 事件对象
	 * @param complete 前置处理器完成后的回调
	 * @param pipeFn 管道对象构造器
	 * @param ctx 整个任务队列的上下文
	 * @param widget
	 * @param handleFn 任务句柄构建器
	 * @param startIndex 处理器起始下标
	 */
	var runHandlers = (handlers, el, e, complete, pipeFn, ctx, widget, handleFn, startIndex) => {
		try {
			//递归执行任务
			let __startIndex = startIndex || 0,
				curTask = handlers[__startIndex],
				eventUnbind = ctx.eventUnbind,
				unbindLen;

			// 执行当前任务 并且传递后续任务的执行函数
			// ！！！注意回调的封装，nextTask是整个后续任务的封装，所以nextTaskComplete是整个后续任务完成后的回调，每次都要合并上一次的，这样就可以为每个handler提供回调的机会
			// ctx.destroy()表示在next(false)的时候，主动把后续任务注册的事件都注销掉，避免内存泄露，其他一律继续递归执行本函数
			if (curTask) {
				let nextTask = (sonElm, nextTaskComplete) => {
					if (sonElm === false) ctx.destroy(startIndex);
					else {
						//为事件注销函数对齐下标 如果处理器执行完，内部没有添加注销事件函数，则主动添加一个空函数
						unbindLen = eventUnbind.length;
						runHandlers(handlers, sonElm || el, e, el => (nextTaskComplete && nextTaskComplete(), complete && complete(el)), pipeFn, ctx, widget, handleFn, __startIndex + 1);
						if (unbindLen === eventUnbind.length) ctx.unbind(emptyFun);
					}
				};
				runHandler(curTask, nextTask, el, e, pipeFn, ctx, widget, handleFn);
			}
			// 当前任务不存在，则表示任务已经执行完毕，执行回调 执行返回不为false 则赋空
			else {
				ctx.end && ctx.end() !== false && (ctx.end = null);
				complete && complete(el);
			}
		} catch (err) {
			console.warn(err);
		}
	};

	var setWritable = (obj, key, value) => Object.defineProperty(obj, key, {writable: false, value});

	var valOk = (val, assert) => assert ? !assert.includes(val) : noUndefined(val);

	//pipe构造器 传递key 则定义一个固定key的pipe 不传递则返回key对应的值 不传递任何参数则返回整个pipe对象
	let pipeFn = pipe => handlerName => (key, state) => {
		if (valOk(state)) {
			let sta = pipe[handlerName] = pipe[handlerName] || [];

			if (key) pipe[key] = state;
			else sta.push(state);

			return state
		}
		//只传递key则返回对应的值
		else if (key) return pipe[key];
		//否则返回整个pipe对象
		else return pipe
	};

	//handle构造器 只需传递一个句柄对象 ！！！为了配合apply调用，最后一个函数不能是箭头函数
	let handleFn = handles => source => function (name) {
		handles[name] = source;
		//也写到全局上
		window.__DR_HANDLES = window.__DR_HANDLES || {};
		window.__DR_HANDLES[name] = source;
	};


	/**
	 * 执行事件触发之后的所有任务
	 * 含事件前置处理器、css类操作任务
	 * 事件处理器每次执行，都会生成针对事件本次执行过程的上下文pipe作为handler的第四参数传入handler
	 * ！！！不需要整个dr表达式的上下文，因为这个上下文el本身就是
	 * @param e 事件对象
	 * @param el 任务对象执行的上下文节点对象
	 * @param task 任务对象
	 * @param pipeIn 任务开始可以传递一个管道对象，以携带本次任务可能要给过程使用的一些依赖 外部不传递则在任务执行的时候主动传递一个空的pipe
	 */
	var runTask = (e, el, task, pipeIn) => {
		//写入eIndex
		if (e && task) e.eIndex = task.eIndex;

		//向全局广播一个事件
		index.emit('taskReset', el);

		let handlers = task.handlers || [],
			pipe = pipeIn || task.pipe || {},
			eventUnbind = [],
			handles = el.__DR_HANDLES = el.__DR_HANDLES || {};

		//先解析一次pms
		let __pms = resolvePms(el);

		//为整个表达式定义一个固定的上下文 并预置事件注销方法 这是“事件合并”的关键步骤
		let ctx = {
			pms: __pms,
			scope: task.scope,
			handles,
			unbind(fn){
				eventUnbind.push(fn);
			},
			destroy(index){
				//从index开始后面的所有指令状态都清理掉
				eventUnbind.forEach((fn, i) => i > index ? fn() : '');
			},
			destroyAll(){
				eventUnbind.forEach(fn => fn());
			}
		};
		setWritable(ctx, 'eventUnbind', eventUnbind);
		setWritable(ctx, 'el', el);
		setWritable(ctx, 'pipe', pipe);
		setWritable(ctx, 'calc', {});

		runHandlers(handlers, el, e, null, pipeFn(pipe), ctx, task.widget, handleFn(handles));

		// 统一将样式操作也封装为一个handler 保留参考
		// var handlers_arr = [];
		// each(handlers,h=>handlers_arr.push(h));
		// handlers_arr.push((el) => runClass(event_tasks, el));
	};

	//可传入断言assert
	var valEq = (v1, v2, assert) => {
		let res = (v1 === v2) || (isNumeric(v1) && isNumeric(v2) && (Number(v1) === Number(v2)));
		return valOk(assert) ? assert === res : res;
	};

	/**
	 * 计算属性表达式拆解 并缓存在元素上
	 * speed:inc(100).plus(result)?once => { speed: { once:true, list:['inc(1)','plus(result)'] } }
	 * @param el
	 * @param expIn
	 * @return {{}|*}
	 */
	var resolveCalcExp = (el, expIn) => {
		let expList = el.__DR_CALC_EXP__;

		if (!expList) {
			expList = el.__DR_CALC_EXP__ = {};

			let __one, __once, __fnExpList, __key, __exp = expSplit(expIn || getAttr(el, 'dr-calc'), ';');
			each(__exp, one => {
				//拆分 speed:inc(100).plus(result)?once
				__one = expSplit(one, '?');
				__once = __one[1] === 'once';

				//获取?号之前的实体 speed:inc(100).plus(result) 并按:拆分，得到key和表达式实体
				__one = expSplit(__one[0], ':');
				__key = __one[0];
				__fnExpList = expSplit(__one[1], '.');

				//定义结构体
				expList[__key] = expList[__key] || {once: __once, list: []};

				//装入指令函数
				each(__fnExpList, fnExp => {
					expList[__key].list.push(fnExp);
				});
			});
		}

		return expList
	};

	/**
	 * 获取一个计算属性
	 * 作为on表达式的一个复用片段。
	 * 有两个硬性限制：
	 *     不允许使用js表达式，需要新的算法，需要拓展指令
	 *     计算属性不允许调用计算属性自身，防止死循环
	 * 计算结果：
	 *     不会在过程中缓存结果，所以会反复计算
	 *     如果需要固化结果，只计算一次，则使用?once添加修饰词
	 * 例子：d1:ease(100,1)?once;d2:ease(200,3)
	 * @param pm
	 * @param el
	 * @param e
	 * @param next
	 * @param pipe
	 * @param ctx
	 * @param handlerState
	 * @param widget
	 * @return {*}
	 */
	var getCalcValue = (pm, el, e, next, pipe, ctx, handlerState, widget) => {
		if (!ctx || !ctx.calc) return null;

		let res = ctx.calc[pm];
		if (noUndefined(res)) return res;

		//ctx.el 是为了强制获取表达式所在容器的参数 避免在son中获取不到表达式，在script时才使用当前上下文el来计算
		let expList = resolveCalcExp(ctx.el);

		//循环计算多个表达式得到结果
		let value, exp = expList[pm] || {};
		//先清空之前的计算结果
		pipe('result', null);
		each(exp.list, fnExp => {
			value = script(fnExp, el, e, next, pipe, ctx, handlerState, widget);
			pipe('result', value);
		});

		//缓存结果
		if (exp.once) ctx.calc[pm] = value;

		return value
	};

	var isElPm = pm => (['index', 'value', 'prop']).includes(pm);

	var isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) || (getClientSize().w < 768);

	/**
	 * 代理获取获取dr-pms上的参数值、calc的参数值
	 * 优先获取pms
	 * 在script中使用则只传递：e, next, pipe
	 * pipe函数的状态实体是ctx.pipe，ctx挂载着on表达式的全部状态
	 * @param el
	 * @param pm
	 * @param e
	 * @param next
	 * @param pipe
	 * @param ctx
	 * @param handlerState
	 * @param widget
	 * @return {*}
	 */
	var getPms = (el, pm, e, next, pipe, ctx, handlerState, widget) => {
		// 注意pm=pms时，只读取dr-pms对象，而不读取pipe、props等对象
		if (!el) return;
		if (pm === 'pms') pm = false;
		if (pm === 'window') return window;
		if (pm === 'isMobile') return isMobile;
		if (pm === 'el') return el;

		////// 开始从元素中查找
		let __pmVal, __el = isString(el) ? getEl(el) : el;

		//读取pipe
		__pmVal = pm ? pipe && pipe(pm) : undefined;

		//读取组件props
		if (pm && !valOk(__pmVal)) {
			__pmVal = (el.__DR_WIDGET_PROPS || {})[pm];
		}

		//从dr-pms中获取
		let pms_get = __pms => {
			if (!__pms) return;
			if (!pm) return __pms;
			let __pmVal__ = __pms[pm];

			//如果还是无法获取到参数 则访问元素自身的 2023.2.13不再支持同名免参的handler，因为pms的表达式可以解决了
			if (!valOk(__pmVal__) && isElPm(pm)) {
				__pmVal__ = draftHandler[pm](next || emptyFun, __el, e, pipe)();
			}

			return __pmVal__
		};

		//再读取pms 如果是function中则再次执行 传入pipe()作为js表达式的ctx !!!并且将this强制指向到当前元素的pms
		if (!valOk(__pmVal)) {
			//先执行一次解析
			let __pms = resolvePms(__el),
				__pmVal__ = pms_get(__pms);

			//如果该key存在值，则查询是否为函数
			if (valOk(__pmVal__)) {
				if (isFunction(__pmVal__)) {
					//传入上下文，挂入pipe、pms、prop、index四个属性
					let __ctx = {pipe: ctx.pipe, pms: __pms};
					//prop、index挂载函数，即时计算得到
					__ctx.prop = draftHandler.prop(next, __el, e);
					__ctx.index = draftHandler.index(next, __el, e, pipe);
					__ctx.get = get;
					__pmVal = __pmVal__(__ctx, __el, e);
				} else __pmVal = __pmVal__;
			}
		}

		//计算参数，这里有一个问题 如果发生循环回调可能回导致死循环，未来要通过传递执行名称的记录来避免
		if (pm && !valOk(__pmVal)) __pmVal = getCalcValue(pm, el, e, next, pipe, ctx, handlerState, widget);

		//如果都没有则从顶级对象获取
		return valOk(__pmVal) ? __pmVal : pms_get(pms.root);
	};

	//查找自己和原型上的属性是否存在
	var hasOwnKey = (obj, name) => obj.hasOwnProperty(name);

	//合并参数值到元素的pms属性上 name输入对象时，则表示多个合并 如果不存在
	var setPms = (el, name, val, e, pipe, ctx) => {
		let __el = isString(el) ? getEl(el) : el;
		let __pms = resolvePms(__el);

		//prop
		if (name === 'prop') return;

		//访问元素自身的
		if (isElPm(name)) draftHandler[name](emptyFun, __el, e)(val);

		//其他
		if (!valEq(getPms(el, name, e, null, pipe, ctx), val)) {
			let __ok = false;

			//当前元素自己的pms存在这个值，则写在对象自己的pms
			if (__pms) {
				if (hasOwnKey(__pms, name)) {
					__pms[name] = val;
					__ok = true;
				}
				//否则在父级查找，可能最终会写在pms.root上
				else {
					let next = __pms.__proto__;
					do {
						if (next && (hasOwnKey(next, name) || get(next, '__isRoot__'))) {
							next[name] = val;
							__ok = true;
							break;
						}
						else next = next.__proto__;
					}
					while (next);
				}
			}

			//如果都没有则射到顶级对象
			if (!__ok) {
				__pms = pms.root;
				__pms[name] = val;
				__ok = true;
			}

			//写值完成 发送事件
			__ok && index.emit('pmsChange', {el: el, by: __pms, key: name, value: val});
		}
	};

	var hasAttrName = (el, name) => !!el.attributes[name];

	//追加pms属性到元素
	var addPmsAttr = elm => {
		if (!hasAttrName(elm, 'dr-pms')) setAttr(elm, 'dr-pms', '');
		return elm
	};

	//为input做空值判断的值清单
	var emptyVal = [undefined, null, '', false, NaN];

	var getChildren = elem => {
		let res = [];

		for (let i = 0, e; e = elem.childNodes[i++];) {
			if (e.nodeType === 1) res.push(e);
		}

		return res;
	};

	/**
	 * 查找scope元素
	 * 由触发元素向外查找到有就是一个元素，查找不到就向全局查找，则返回数组此时所有的同名scope都会响应
	 * @param scope
	 * @param el
	 * @return {*|null}
	 */
	var getScopeEls = (scope, el) => {
		let scopeEl = scope;

		if (isString(scope)) {
			let __scopeEl, isScope = elm => getAttr(elm, 'dr') === scope;

			//当前元素就是scope元素 否则mapParents获取到离el最近指定名称的scopeEl
			if (isScope(el)) __scopeEl = el;
			else mapParents(el, p => {
				if (p && p.nodeType === 1 && isScope(p)) {
					__scopeEl = p;
					return false
				}
			});

			//如果没有获取到目标元素，则全局范围查找，并且将查找到的元素合并为一个数组
			scopeEl = __scopeEl || getElAll('[dr=' + scope + ']');
		}

		return scopeEl || null
	};

	var clientWidth = () => document.documentElement.clientWidth || document.body.clientWidth;

	var clientHeight = () => document.documentElement.clientHeight || document.body.clientHeight;

	/**
	 * 删除DOM事件绑定
	 * 第三参数，表示在冒泡阶段删除
	 * @param el
	 * @param type
	 * @param handler
	 */
	var removeHandler = (el, type, handler) => el.removeEventListener(type, handler, false);

	var checkScope = (eName, curEl, task_scope, e_scopeEl, e_target) => {
		//优先使用事件传递的作用域
		let __DR_WIDGET_EVENTS,
			allow = true,
			__scopeEl = e_scopeEl,
			__scope = task_scope;

		//由事件发起方计算 比如绑定按键事件需判断激活元素是否是表单元素自身
		if (typeof e_target === 'function') return e_target(curEl, task_scope);

		//如果本次事件有主动传递作用域对象 则检查是否在作用域内
		if (__scopeEl) {
			//事件元素就是作用域元素也予以通过 有些事件有指定自己的作用域，则对比它自己指定的作用域，比如when系列的no事件
			allow = __scopeEl === curEl || e_scopeEl === e_target || contains(__scopeEl, curEl);

			//否则检查是否在作用域元素范围内(多个作用域节点就是向上找不到作用域，向下找到的其他组件同名作用域，所以要循环逐个处理，这里保险起见要判断是Array)
			if (!allow && __scopeEl.length) {
				each(__scopeEl, one => {
					if (contains(one, curEl)) {
						allow = true;
						//如果是组件，则继续过滤，要在放行的事件列表中才执行
						__DR_WIDGET_EVENTS = one.__DR_WIDGET_EVENTS;
						if (__DR_WIDGET_EVENTS) allow = __DR_WIDGET_EVENTS.includes(eName);
						return false
					}
				});
			}
		}
		//否则如果当前任务有限定作用域 则判断当前事件元素是否在作用域范围内
		else if (__scope) {
			allow = __scope === e_target || contains(__scope, e_target);
		}

		return allow
	};

	var isElmNode = el => el && el.nodeType === 1;

	/**
	 * 遍历所有装载目标元素
	 * @param shipFn
	 * @param name
	 * @param elms
	 */
	var draElMap = (shipFn, name, elms) => {
		let elements = elms || getDrEl(name);
		each(elements, el => {
			if (isElmNode(el)) {
				//如果是dr-pms，当前元素不存在pms 则装载，因为所有dr元素都需要，所以pms对所有表达式都要查漏补缺
				if (name === 'pms' || !pms[el.pmsid]) resolvePms(el);
				if (name !== 'pms') shipFn(getAttr(el, 'dr-' + name), el);
			}
		});
	};

	//挂载组件
	var widgets = {};

	/**
	 * 组件参数绑定到pms
	 * @param name 组件名
	 * @param paramStr 参数串
	 * @param scopeEl
	 * @param props
	 * @param events
	 */
	var setWidgetPms = (name, paramStr, scopeEl, props, events) => {
		//分解表达式 要去掉圆括号 "{name:'lihong'})" => "{name:'lihong'}"
		let __pms = (paramStr || ')').replace(')', '');

		//合并参数
		let pms = {}, __pms__ = __pms ? (new Function('return ' + __pms))() : {};
		each(props, (val, key) => {
			pms[key] = noUndefined(__pms__[key]) ? __pms__[key] : val;
		});

		//查询子元素中所有dr-on元素，挂入props属性
		each(getElAll(scopeEl, '[dr-on]'), elm => {
			elm.__DR_WIDGET_PROPS = pms;
			elm.__DR_WIDGET_EVENTS = events;
		});

		//写入作用域标记 dr，并挂入参数对象到元素
		scopeEl.__DR_WIDGET_PROPS = pms;
		scopeEl.__DR_WIDGET_EVENTS = events;
		setAttr(scopeEl, 'dr', name);
	};

	function join(arr, joinStr) {
		return (arr || []).join(joinStr)
	}

	/**
	 * name是dr  如果传递的那么有括号，则将name挂作__DR_PROPS
	 * @param task
	 * @param name
	 * @param scopeEl
	 * @param widgetName
	 * @private
	 */
	function __ship(task, name, scopeEl, widgetName) {
		//name：字符串则是dr，数组则是elms
		let elms = name;
		if (isString(name)) {
			//有传递组件el，首先检查是否是作用域元素自己，否则只在widget范围内查找元素
			if (scopeEl) elms = name === '__root' ? [scopeEl] : (getElAll(scopeEl, '[dr=' + name + ']') || getElAll(scopeEl, name));
			else elms = getElAll('[dr=' + name + ']') || getElAll(name);
		}

		//task：字符串/数组则是on，对象则是options
		let __task = isString(task) || isArray(task) ? {on: task} : (isObject(task) ? task : null);

		if (__task) {
			let on = __task.on;
			let scope = __task.sc;
			let pms = __task.pm;
			let calc = __task.ca;

			/**
			 * 分别绑定 on handler pms scope
			 * scope因为利用元素嵌套来记录层级信息，所以在事件执行过程中才解析，直接写到元素dr上。
			 * calc也是执行时才计算（要使用ctx.el），也直接写到元素属性上。
			 * pms则可以根据pmsid单独存储，因为它可以被多个事件同时使用，也写在元素dr-pms上来被dr编译器识别。
			 * on则被转译成事件对象events
			 */
			each(elms, elm => {
				//共享组件props
				elm.__DR_WIDGET_PROPS = scopeEl.__DR_WIDGET_PROPS;

				//先绑定作用域、计算属性参数表，再分发任务，因为执行任务马上就会用到
				scope && setAttr(elm, 'dr', scope);
				calc && setAttr(elm, 'dr-calc', calc);
				if (pms) {
					let __pms = getAttr(elm, 'dr-pms');
					setAttr(elm, 'dr-pms', (__pms ? (__pms + ';') : '') + (isString(pms) ? pms : join(pms, ';')));
				}

				//立即分发任务
				on && dispatch(isString(on) ? on : join(on, ';'), elm, scopeEl, widgetName);
			});
		}
	}

	/**
	 *
	 *使用js传递 为元素绑定表达式
	 * name可以使用字符串、数组、对象，它表示了三种不同的使用方案：
	 * 字符串：则必须结合dr属性使用，在实现组件化时，推荐使用该方式，并且按功能作用来命名，这样可以把name当成操作句柄来使用
	 * 数组：数组元素则为html元素，该方式以兼容普通选择器模式，比如dr.ship(getElAll('li'),{...})
	 * 对象：则是同时给多个元素绑定表达式，task则用来传递信号塔数组（事件协调）
	 *
	 * task可以使用字符串、数组、对象
	 * 字符串：表示on，比如dr.ship('nav-li','click.emit("navLiClick")')
	 * 数组：只在name为对象的情况下生效，用作传递信号塔数组（事件协调），如：dr.ship({'nav-li':'','nav-li-index':''},[...])
	 * 对象：则是普通的options对象，{on:'',sc:'',pm:'',}
	 *
	 * scopeEl传递时会对所有元素添加scope，并且元素的查找范围也被限定在这个元素之内
	 *
	 * 注意，如果name传递了多个元素，或者传递的选择器能选中多个元素，则会给所有元素都绑定同一个tasks
	 *
	 * @param name
	 * @param task
	 * @param scopeEl
	 * @param widgetName
	 */
	function ship(name, task, scopeEl, widgetName) {
		if (isObject(name)) {
			each(name, (t, n) => __ship(t, n, scopeEl, widgetName));

			//如果是数组则分发为信号塔，信号塔用来协调全局，这里不传入作用域
			//if (task && isArray(task)) dispatches(task);
		}
		else __ship(task, name, scopeEl, widgetName);
	}

	/**
	 * 解析dr组件
	 * 会给所有事件添加scope，并且所有dr也只在这个模块中生效
	 * @param el
	 * @param attr
	 */
	var widget = (attr, el) => {
		let widgetAttr = (getAttr(el, 'dr-widget') || attr);
		if (!widgetAttr) return;

		let widgetArr = widgetAttr.split('('),
			name = widgetArr[0],
			options = widgets[name],
			props = options.props,//决定当前组件接受哪些属性
			events = options.events,//决定当前组件响应哪些事件
			setup = options.setup,
			__setup_is_function = isFunction(setup);

		//挂载私有指令
		draftHandler.pro[name] = options.handlers || {};

		//合并表达式 用__root来表示rootExp 合并到一起丢给__ship
		let rootTask = setup.root,
			sonTask = setup.children || {};
		if (rootTask) sonTask.__root = rootTask;

		//装载props到pms
		setWidgetPms(name, widgetArr[1], el, props, events);

		//如果是函数，则直接执行(在最后一个参数传入获取dr元素的方法，setup(props, el, getDrElm){...})，否则逐个装载表达式任务
		if (__setup_is_function) options.setup(el.__DR_WIDGET_PROPS, el, name => getEl(el, '[dr=' + name + ']'));
		else ship(sonTask, null, el, name);
	};

	/**
	 * 安全的做数组合并操作
	 * @param arr1
	 * @param arr2
	 */
	var concat = (arr1, arr2) => transform(arr2, (res, item) => {
		res.push(item);
	}, arr1);

	/**
	 * 装载指定元素的表达式
	 * 会查找域内所有dr元素
	 * 如果不传递el则装载当前页面所有的元素，
	 * @param el
	 */
	var setup = el => {
		//有传递元素则从指定元素装载（用于更新节点），否则装载全局（用于初始化）
		if (el) {
			//只装载html元素节点
			if (isElmNode(el)) {
				let __org = [el];

				draElMap(dispatch, 'on', concat(__org, getDrEl('on', el) || []));
				draElMap(widget, 'widget', concat(__org, getDrEl('widget', el) || []));
			}
		}
		else {
			draElMap(dispatch, 'on');
			draElMap(widget, 'widget');
		}
	};

	var append = (wrapper, el) => wrapper.appendChild(el);

	//向前插入元素
	var insertBefore = (el, son, inner) => {
		if (el && son) {
			let _children = el.firstChild;
			let _el = inner ? _children : el;
			if (!_children) append(el, son);
			else _el.parentNode.insertBefore(son, _el);
		}
	};

	//向后插入元素
	var insertAfter = (el, son, inner) => {
		if (el && son) {
			if (inner) append(el, son);
			else el.parentNode.insertBefore(son, el.nextSibling);
		}

		return el;
	};

	/**
	 * 组装DOM元素，返回append函数，默认append到body
	 * @param tagName 标签名
	 * @param attrs 属性列表
	 * @param children 支持数组和字符串
	 * @param wrapper 支持数组和字符串
	 * @return {Element}
	 */
	var createEl = (tagName, attrs, children, wrapper) => {
		let el = document.createElement(tagName);

		each(attrs, (value, key) => {
			setAttr(el, key, value);
		});

		if (isString(children)) el.textContent = children;
		else each(children, node => {
			append(el, node);
		});

		if (wrapper) append(isString(wrapper) ? getEl(wrapper) : wrapper, el);

		return el
	};

	var removeEl = el => el ? (el.remove ? el.remove() : (el && el.parentNode && el.parentNode.removeChild(el))) : null;

	/**
	 * 提示框
	 * @param msg
	 * @param closeTimeOrEvent 数字则为自动关闭时间，字符串则为事件名称
	 * @param hook 选填，从config中读取对应的hook，hook需要返回关闭方法
	 * @return {function} 返回关闭方法
	 */
	var tip = (msg, closeTimeOrEvent, hook) => {
		if (hook) {
			return window['__DR_PMS__'].tips[hook](msg, closeTimeOrEvent)
		}
		else {
			let __wrapper = createEl('div', {'style': 'display:flex;align-items:center;justify-content:center;position:fixed;right:0;left:0;top:0;bottom:0;width:100%;height:100%;z-index:1000'}),
				__box = createEl('div', {'style': 'display:block;margin:auto;padding:1.5em;color:#fff;text-align:center;border-radius:0.5em;background:rgba(0,0,0,.8)'});

			__box.innerHTML = msg;

			append(__wrapper, __box);
			append(bodyEl$1(), __wrapper);

			let __remove = () => removeEl(__wrapper);

			if (closeTimeOrEvent) {
				if (isNumeric(closeTimeOrEvent)) setTimeout(__remove, closeTimeOrEvent);
				else index.once(closeTimeOrEvent, e => __remove);
			}

			return __remove
		}
	};

	/**
	 * xhr对象方式请求后台
	 * 不能跨域，不能设置拦截，不能上传文件
	 * 仅简单请求用于传输pms对象，用于
	 * @param type
	 * @param url
	 * @param data
	 * @param callback
	 * @param stateChangeCallback
	 */
	var ajax = (type, url, data, callback, stateChangeCallback) => {
		//ie9以上 都兼容这个对象
		let xhr = new XMLHttpRequest(),
			isPOST = type.toLocaleUpperCase() === 'POST';

		//创建请求 参数1是请求方式'GET/POST' 参数2是请求的地址  参数3是同步或者异步
		xhr.open(type, url, false);

		//如果是post请求则必须要写请求头 上传文件则零设置header，暂不支持上传文件
		if (isPOST) {
			// xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");//表单方式提交 会转化为键值对格式 key=value
			xhr.setRequestHeader("Content-type", "application/json");//这里参考axios的设置
		}

		//监听事件
		xhr.onreadystatechange = () => {
			stateChangeCallback && stateChangeCallback(xhr.readyState, xhr);

			//0请求未初始化,刚刚实例化XMLHttpRequest 1客户端与服务器建立链接调用open方法 2请求已经被接收 3请求正在处理中 4请求成功
			if (valEq(xhr.readyState, 4)) {
				//console.log(xhr);
				callback && callback({
					success: valEq(xhr.status, 200),
					data: isPOST ? JSON.parse(xhr.responseText) : xhr.responseText,
					code: xhr.status
				});
			}
		};

		//发送请求 不需要参数
		xhr.send(data ? JSON.stringify(data) : null);
	};

	var init = {
		inited: false,
		//文档加载完毕要执行的回调集合
		onload: []
	};

	/**
	 * 基于元素对象的微型单例事件绑定器（只有一个真实事件被绑定）
	 * 用于提升DOM事件的兼容性
	 * @param eventName
	 */

	const getEName = eventName => '__DR_EVENT_' + eventName;

	function run(removeHandler, handlers, e) {
		let i, cur;
		for (i = handlers.length - 1; i >= 0; i--) {
			cur = handlers[i];
			!removeHandler && cur(e);
			if (cur.once || cur === removeHandler) {
				handlers.splice(i, 1);
			}
		}
	}

	function addEvent(el, eventName, handler, once) {
		let eName = getEName(eventName);
		if (!el[eName]) {
			el[eName] = [];
			addHandler(el, eventName, e => run('', el[eName], e));
		}
		//打上一次性标签
		handler.once = once;
		el[eName].push(handler);
	}

	//传递handler则删除单个，不传递则删除所有
	function removeEvent(el, eventName, handler) {
		let eName = getEName(eventName);
		if (!handler) el[eName].splice(0, el[eName].length);
		else run(handler, el[eName]);
	}

	//url对象
	let url = new URL(location);

	//查询pid是否是curPid的父级pms的pid
	let isParentPms = (curPid, pid) => {
		var res = false;

		var parent = get(pms[curPid], '__proto__');
		while (parent) {
			if (parent.__pmsid__ === pid) {
				res = true;
				break;
			} else parent = parent.__proto__;
		}

		return res
	};

	//兼容选择器选择元素
	let getElBy = (slt, parent, all) => isString(slt) ? (parent ? getEl(parent, slt) : getEl(slt)) : slt;

	//为多个事件名绑定同一个事件函数 evs用半角逗号分割
	let shipEvents = (evs, fn) => each(split(evs, '|'), eventName => eventName && index.on(eventName, fn));

	//将|分隔的多个样式变成空格分隔
	let trimClassName = className => split(className || '', '|').join(' ');

	//获取最近的作用域对象 父节点或是兄弟和兄弟子孙节点
	let getScopeNear = (el, slt) => {
		let __ScopeEl = el, p;

		if (slt) {
			mapParents(el, elm => {
				p = getParent(elm);
				if (p && isElmNode(p) && getEl(p, slt)) {
					__ScopeEl = elm;
					return false
				}
			});
		}

		return __ScopeEl
	};

	//断言为假 则发送事件（作用域仅当前元素） !!!注意，ok不需要，因为通过是可以继续后面流程的，需要发事件用emit即可
	let assertFn = (assert, next, no, el, prop, e) => {
		if (assert) next();
		else no && drEmit(no, curEl => curEl === el, prop, el, __getOrgEvent(e));//指定元素自己作为自己的作用域
	};

	//注销事件
	let unbind = (ctx, el, type, fn) => ctx.unbind(() => removeHandler(el, type, fn));

	//有动画监听的样式类装载
	let addAnimateClassName = (el, animateClassName, cb) => {
		addClass(el, animateClassName);
		addEvent(el, 'animationend', () => {
			removeClass(el, animateClassName);
			cb && cb();
		}, 1);
	};

	//获取子元素 slt为null则直接子元素
	let getSon = (el, slt) => {
		el.son = el.son || {};

		//缓存son 同样的选择器不会执行第二次获取动作
		let son_key = slt || 'default', son = el.son[son_key];
		if (!son) {
			son = slt ? getElAll(el, slt) : el.children;
			el.son[son_key] = son;
		}

		return son
	};

	//跳转页面
	let toPage = (url, paramKeyOrLst, paramValue) => location.href = url + (paramValue ? ('?' + paramKeyOrLst + '=' + paramValue) : paramKeyOrLst);

	//全局loading
	let pageLoading = (next, ctx) => mode => {
		if (window.__DR_LOADING__) {
			next();
			return;
		}

		let body = bodyEl$1(), div = window.__DR_LOADING__ = document.createElement('div'), style = div.style;
		div.innerHTML = pms.pageLoadingHtml;
		body.appendChild(div);

		style.display = 'flex';
		style.justifyContent = 'center';
		style.alignItems = 'center';
		style.background = pms.loadingShade;
		style.position = 'fixed';
		style.left = 0;
		style.right = 0;
		style.top = 0;
		style.bottom = 0;
		style.zIndex = 1000;

		//注册unloading事件
		let __unloading = e => {
			window.__DR_LOADING__ = null;
			body.removeChild(div);
			index.off('unloading', __unloading);
		};
		index.on('unloading', __unloading);
		ctx && ctx.unbind(() => index.off(__unloading));

		next();
	};

	//cache存取
	function cache(next, el, name, value) {
		el.__DR_CACHE = el.__DR_CACHE || {};
		if (noUndefined(value)) {
			el.__DR_CACHE[name] = value;
			next && next();
		} else return el.__DR_CACHE[name]
	}

	//装载style	动画从头到尾的速度是相同的。	测试
	let easingLut = ['linear', 'ease', 'easeIn', 'easeOut'];

	////////// 会被多次引用的指令

	//交替事件 只在域元素有d指令时生效
	let toggleEvent = (el, eventName) => {
		let __toggle = get(el, '__DR_PMS__._EVENT_TOGGLE') || {fns: {}, sta: {}};
		//当前事件存在交替事件声明
		if (__toggle.fns[eventName]) {
			//如果指定的事件已经执行过，则不允许再次执行，等待交替事件发生时重置状态后才能再次执行当前事件
			if (__toggle.prev === eventName) return false;

			//执行状态重写
			__toggle.fns[eventName]();
		}
	};

	//获取原始事件 从上次事件对象获取
	let __getOrgEvent = e => e ? e.orgEvent || null : null;

	let __emit = (next, el, e) => (eventName, prop, scope, repeat/*忽略交替事件声明而强制重复执行*/) => {
		//交替事件判断
		if (!repeat) {
			if (toggleEvent(el, eventName) === false) {
				return;
			}
		}

		//作用域不在emit阶段完成，因为作用域的语义就是说事件传播的范围，不是不让事件传播，而是限制传播的范围
		//但是要告诉事件监听器，让它知道本次事件的作用域，让不在作用域的事件不响应（不执行task）即可
		drEmit(eventName, el, prop, getScopeEls(scope, el), __getOrgEvent(e));
		next();
	};

	let __toggleClass = (next, el, e) => (className1, className2) => {
		let __className = trimClassName(className1);

		//className2是选填参数 填写时，则表示会自动互换两个className
		if (className2) {
			let __add = hasClass(el, className1) ? className2 : className1;
			let __remove = __add === className1 ? className2 : className1;
			removeClass(el, __remove);
			addClass(el, __add);
		} else toggleClass(el, __className);

		next();
	};

	let __removeClass = (next, el) => className => {
		removeClass(el, trimClassName(className));
		next();
	};

	let __addClass = (next, el) => className => {
		addClass(el, trimClassName(className));
		next();
	};


	//监听全局的loading
	index.on('loading', e => pageLoading(emptyFun)(e.prop));

	let draftHandler = {
		//流程控制及元素属性操作
		_: (next, el) => exp => (runClass(resolveClassLut(exp), el), next()),//执行样式类表达式 例：btn1Click._('add.active.fadeIn&remove.hide')
		emit: __emit,//往上查找最近的dr标识=scope的元素 作为本次事件的作用域
		e: __emit,
		d: (next, el, e, pipe, ctx) => (eName1, eName2) => {
			//假如不存在pms对象，则立即创建一个（系统在每次task被执行前都会动态生成，如果没有则说明元素上没有定义pms属性）
			if (!el.__DR_PMS__) {
				el.__DR_PMS__ = {};
				el.__DR_PMS__.__proto__ = pms.root;
			}

			let __toggle = el.__DR_PMS__._EVENT_TOGGLE = el.__DR_PMS__._EVENT_TOGGLE || {prev: null, fns: {}, sta: {}};
			__toggle.sta[eName1] = 0;
			__toggle.sta[eName2] = 1;

			__toggle.fns[eName1] = () => {
				__toggle.prev = eName1;
				__toggle.sta[eName1] = 1;
				__toggle.sta[eName2] = 0;
			};
			__toggle.fns[eName2] = () => {
				//checkScope(eName1, el, ctx.scope, e.scopeEl, e.target)//不用判断域 因为无论是来自哪里的事件，只要是标记中的事件都应该同等处理
				__toggle.prev = eName2;
				__toggle.sta[eName1] = 0;
				__toggle.sta[eName2] = 1;
			};

			next();
		},//向当前域写一个交替事件标记 由域内的事件发射器主动调用
		emitNear: (next, el, e) => (slt, eventName, prop, repeat) => {
			//交替事件判断
			if (!repeat) {
				if (toggleEvent(el, eventName) === false) {
					return;
				}
			}

			drEmit(eventName, el, prop, getScopeNear(el, slt), __getOrgEvent(e));
			next();
		},//将事件发送给最近的元素 传递作用域元素的选择器 slt=null则是当前元素
		toggleEmit: (next, el, e) => (eventName, prop, scope/*near为true时，scope为元素选择器*/, near/*发送给附近的元素*/) => {
			let __eventNames = split(eventName, ',');

			//必须要存在两个事件才发送事件
			if (__eventNames.length > 1) {
				let __one = __eventNames[0], __two = __eventNames[1],
					__toggle = get(el, '__DR_PMS__._EVENT_TOGGLE') || {fns: {}, sta: {}},
					__scope = near ? getScopeNear(el, scope) : getScopeEls(scope, el);

				//上次事件为1时 则执行第二个 否则执行第二个
				if (__toggle.prev === __one) {
					if (!__toggle.sta[__two]) {
						e.eIndex = 0;
						__toggle.fns[__two]();
						drEmit(__two, el, prop, __scope, __getOrgEvent(e));
						next();
					}
				}
				else {
					if (!__toggle.sta[__one]) {
						e.eIndex = 1;
						__toggle.fns[__one]();
						drEmit(__one, el, prop, __scope, __getOrgEvent(e));
						next();
					}
				}
			} else console.warn(el, 'Handler "toggleEmit" param1 error!');
		},//交替发送事件 事件1未发送才执行事件2 反之同理 例如：click.toggleEmit('openModal,closeModal')
		after: (next, el, e, pipe, ctx) => (eventName, prop, scope) => {
			if (!ctx.end) ctx.end = () => drEmit(eventName, el, prop, getScopeEls(scope, el), __getOrgEvent(e));
			next();
		},//整个表达式执行完毕后的回调 放在事件之后，只会执行一次 使用方式和emit完全一样 不确保所有元素的动画执行完毕(见bk文件)，因为脱离语义，同时徒增项目复杂度，在队列情况下本身也能确保动画结束
		log(next) {
			return function () {
				each(arguments, v => {
					console.log(v);
				});

				next();
			}
		},
		focus: (next, el, e) => assert => (el.focus(), next()),
		blur: (next, el, e) => assert => (el.blur(), next()),
		hover: (next, el) => (className, slt) => {
			let __className = trimClassName(className);
			let __els = slt ? getElAll(el, slt) : [el];
			addHandler(el, 'mouseover', () => each(__els, _el => addClass(_el, __className)));
			addHandler(el, 'mouseleave', () => each(__els, _el => removeClass(_el, __className)));
			next();
		},//模拟hover效果
		scrollTo: (next, el, e) => (topOffset, slt) => {
			let target = slt ? getEl(slt) : el;
			let run = () => {
				window.scrollTo({
					top: target.offsetTop - topOffset,
					//left: 100,
					behavior: 'smooth'
				});
			};
			if (target) {
				if (!init.inited) init.onload.push(run);
				else run();
			}

			next();
		},//两个参数都可不填 滚动目标slt元素位置(默认为当前元素) topOffset偏移量
		point: (next, el) => id => {
			let __id = id;

			//未传递id则添加一个
			if (!id && !getAttr(el, 'id')) {
				__id = 'point' + pms.idx++;
				setAttr(el, 'id', __id);
			}

			location.hash = '#' + __id;
			next();
		},//跳转到指定的hash位置 一般用在标题菜单  id不填则跳转到当前元素
		windowResize: (next, el, e, pipe) => () => {
			let onresize = window.onresize || emptyFun;
			window.onresize = () => {
				onresize.apply(window);
				pipe('clientWidth', clientWidth());
				pipe('clientHeight', clientHeight());
				pipe('availWidth', screen.availWidth);
				pipe('availHeight', screen.availHeight);
				next();
			};
		},//屏幕切换 可以配合greater/less使用，pipe:clientWidth,clientHeight,availWidth,availHeight，返回像素值  比如大于1000px则执行任务：windowResize().greater(clientWidth,1000).log('被触发了')
		load: (next, el, e) => () => {
			if (el.tagName === 'IMG') el.onload = () => next();
			else windowEventHandler('load', () => next());
		},//元素加载完毕后执行，比如img元素加载完成后对图片尺寸做外容器自适应调整
		loadImgAll: (next, el) => slt => {
			let imgNodes = getElAll(el, slt || 'img');
			Promise.all(
				each(imgNodes, node => {
					new Promise(resolve => {
						node.addEventListener('load', () => resolve(node));
					});
				})
			).then(() => next());
		},//等待所有图片完成后执行
		loading: (next, el, e, pipe, ctx) => (unloadingEventName/*接受一个loading删除事件*/, wrapperWidth, wrapperHeight) => {
			let pEl = getParent(el), div = document.createElement('div'), style = div.style;
			pEl.style.position = 'relative';
			div.innerHTML = pms.loadingHtml;
			pms.loadingClass && addHandler(div, pms.loadingClass);
			el.appendChild(div);

			style.display = 'flex';
			style.justifyContent = 'center';
			style.alignItems = 'center';
			style.width = (wrapperWidth || getWidth(pEl, true)) + 'px';
			style.height = (wrapperHeight || getHeight(pEl, true)) + 'px';
			style.background = pms.loadingShade;

			style.position = 'absolute';
			style.left = 0;
			style.right = 0;
			style.top = 0;
			style.bottom = 0;

			//注册unloading事件
			let __unloading = e => {
				if (checkScope(unloadingEventName, el, null, e.scopeEl, e.target)) {
					el.removeChild(div);
					index.off(unloadingEventName, __unloading);
				}
			};
			index.on(unloadingEventName, __unloading);
			ctx.unbind(() => index.off(__unloading));

			next();
		},//对元素覆盖一个loading元素 遮罩方式 emitNear
		pageLoading,//对窗口覆盖一个页面loading元素 单例 支持两种style：progressbar shade  接受全局事件unloading来关闭
		back: (next, el) => assert => setTimeout(() => history.back()),//页面返回 包在setTimeout里面是因为页面可能还有其他事件函数会继续触发，但是页面跳转，会导致对象丢失，所以考虑让当前的同步任务先执行完毕，将返回任务推后
		forward: (next, el) => assert => setTimeout(() => history.forward()),//页面前进
		post: (next, el, e, pipe) => (data, api, okEvent, ErrorEvent, scope) => {
			ajax('post', api, data, res => {
				let res_data = res.data,
					eName = 'postRes',
					isOk = 'success' in res_data ? res_data.success : res.success;
				drEmit(isOk ? (okEvent || eName) : (ErrorEvent || eName), el, res, scope);
				next();
			});
		},//向后台提交数据
		html: (next, el) => str => {
			el.innerHTML = str;
			next();
		},//向元素填充html
		tip: next => (msg, closeTimeOrEvent, style/*对应config.tips*/) => {
			tip(msg, closeTimeOrEvent, style);
			next();
		},//弹框提示

		//滚动事件代理，鼠标事件代理，计时器，监听器等等，自身不接受样式类，由后续任务决定行为，如：emit、add、remove、animate等
		at: (next, el, e, pipe, ctx) => (baseSlt, by, debounceTime) => {
			/**
			 * 设一个元素作为标定元素，事件监听元素为事件元素。
			 * 当事件元素完全居于标定元素上方时，则发出事件top，居于下方则发出事件bottom，任何一部分在容器中，发出事件inner。
			 * 例，在事件元素中：living(window,'top','navWrapperTopOut')，在目标元素完全进入window顶端的时候，发送事件navWrapperTopOut
			 *
			 * 设计说明：
			 * 1.原理
			 *   两个元素的相对关系只有这三种，所以不会出现语义冲突。
			 *   如果需要基线事件，则使用pole，可以根据实际需要自定义基线。
			 * 2.词义
			 *   为什么不使用into，因为into表示进入到某个范围，但是不表示完全进入，而living的词义是居住于，那么就很符合语义。
			 * 3.废弃
			 *   废弃原基线用法，因为会导致语义冲突，比如目标上边缘到达了容器的上边缘，但是下边缘也同时在容器下边缘，如果刷新页面，将无法判定应该执行哪个事件。
			 *
			 * 算法：
			 * 随滚动条动态计算两个元素的相对位置，只要事件元素的底部脱离标定元素的上边缘，则响应top事件，反之inner，以此类推bottom事件。
			 *
			 *
			 * baseSlt 标定对象选择器 必填
			 * by 响应的区域 选填 不填则只要位置改变就发送事件 可填top|inner|bottom
			 */
			let isWindow = baseSlt === window;
			let baseEl = isWindow ? baseSlt : getEl(baseSlt);
			if (baseEl) {
				//计算事件元素相对标定元素的位置 top | inner | bottom
				let computeLiving = () => {
					let box1 = getBoxClient(el);
					let box2 = isWindow ? {top: 0, bottom: getClientSize().h} : getBoxClient(baseEl);

					//计算位置 元素的位置总是对应左上角坐标，所以只要对比两个元素的上下边缘的差值
					return (box1.bottom <= box2.top) ? 'top' : (box1.top >= box2.bottom ? 'bottom' : 'inner');
				};

				//响应区域 做防抖
				let run = debounce(() => {
					//计算当前的元素位置
					let living = computeLiving();

					//区域发生变化，记录变化后的区域，并且响应事件
					if (el.__DR_prevLiving !== living) {
						el.__DR_prevLiving = living;

						//声明的响应区域或者未填写 则发送当前
						if (by === living || !by) {
							pipe('atValue', living);
							next();
						}
						else next(false);
					}
				}, debounceTime || 0);

				run();

				//响应滚动事件
				windowEventHandler("scroll", run, true);
				isWindowScroll() && unbind(ctx, window, "scroll", run);

				if (!init.inited) init.onload.push(run);
			}
		},//监听load和滚动事件 计算元素的相对目标位置 会计算atValue baseSlt标定元素选择器，传window对象，则是浏览器窗口，by进入标定元素什么位置，可用来实现吸顶、楼层提示等等
		aline: (next, el, e, pipe, ctx) => (y, type, repeat) => {
			/**
			 * 设置一个屏幕Y轴极点触发事件
			 * 当元素与极点坐标接触和离开的时候发出对应事件
			 * 解决：元素进入中间时和离开中间时的事件需求
			 * y      顶点屏幕y轴坐标值
			 * type   类型 in out 默认为全部类型
			 * repeat 是否重复广播同一类型的事件 默认为不重复
			 */
			if (y) {
				//不填写则为全部类型
				if (type) {
					let clientSize = getClientSize(),
						h = clientSize.h,
						yVal = /%/.test(y) ? h * parseFloat(y) / 100 : h,
						run = () => {
							let box = getBoxClient(el),
								inAline = box.top < yVal && box.bottom > yVal,
								typeAllow = {in: inAline, out: !inAline};

							if (typeAllow[type] && (repeat ? true : el.pole_type !== type)) {
								next();
								el.pole_type = type;
							}
						};

					run();

					windowEventHandler("scroll", run, true);
					isWindowScroll() && unbind(ctx, window, "scroll", run);

					if (!init.inited) init.onload.push(run);
				} else {
					let aline = draftHandler.aline(el);
					aline(y, 'in', repeat);
					aline(y, 'out', repeat);
				}
			}
		},//监听load和滚动事件 产生屏幕基线事件
		inner: (next, el, e, pipe, ctx) => (drElName, all) => {
			let targetEl = getDrEl(drElName),
				options = {
					root: targetEl,
					//rootMargin: "10px 10px 10px 10px",
					threshold: 1.0
				},
				intersectionObserver = new IntersectionObserver(entries => {
					let intersectionRatio = entries[0].intersectionRatio;
					// console.log('inner', intersectionRatio, el);
					//重合的比例大于0的时候，说明是inner
					if (all ? intersectionRatio >= 1 : intersectionRatio >= 0) next();
					else drEmit('outer', el, null, el, __getOrgEvent(e));
				}, options);

			// 开始监听
			intersectionObserver.observe(el);

			//注销
			ctx.unbind(() => {
				intersectionObserver.disconnect();
			});
		},//非滚动监听，而是监听元素的重合事件，在目标元素内则执行队列，否则发送outer事件
		drag: (next, el, e, pipe, ctx) => (position, vwh, endEventName, prop, scope) => {
			let d1 = 0, start = 0, stop = false;

			let touchmove = e => {
					if (!stop) {
						let touch = e.touches[0];
						if (!start) start = touch.pageY - 1;
						d1 = Math.abs(touch.pageY - start);

						//小于零也为结束
						if (vwh > d1) {
							pipe('dragValue', d1);
							next();
						}
						else {
							stop = true;
							drEmit(endEventName, el, prop, getScopeEls(scope, el), __getOrgEvent(e));
						}
					}
				},
				touchend = e => {
					stop = false;
					start = 0;
					drEmit(endEventName, el, prop, getScopeEls(scope, el), __getOrgEvent(e));
				};

			//开始拖拽 / 松开拖拽
			addHandler(el, 'touchmove', touchmove);
			addHandler(el, 'touchend', touchend);
			ctx.unbind(() => {
				removeHandler(el, touchmove, touchmove);
				removeHandler(el, touchend, touchend);
			});
		},//手机版拖拽增强事件 vwh表示允许拖拽的距离 表示在屏幕四个角落的到底后的对当前元素的拉扯，拖拽过程中会反复调用next，并向pipe传递参数dragValue， todo:position：top、bottom、left、right
		mouse: (next, el, e, pipe, ctx) => (type, eventName, prop, scope) => {
			let pluginEventClassName = (['in', 'out', 'top-in', 'top-out', 'bottom-in', 'bottom-out', 'left-in', 'left-out', 'right-in', 'right-out']).map(v => 'mouse-' + v);
			let isDOMEvent = ('on' + type) in el;
			let runNext = typeName => {
				eventName && drEmit(eventName, el, prop, getScopeEls(scope, el), __getOrgEvent(e));
				//加上默认样式名 并自动切换
				if (!isDOMEvent) {
					removeClass(el, pluginEventClassName);
					addClass(el, 'mouse-' + typeName);
				}

				next();

				//取消事件的默认行为 如a标签的事件等等 只对原生事件有效
				return false
			};

			//如果是DOM自带的则直接别名
			if (isDOMEvent) {
				addHandler(el, type, () => runNext());
				return;
			}

			//拓展事件开始
			let prevX, prevY, prevInner, allow = true, axis, tickRun;
			let box, inner, dT, dR, dB, dL, inOut, nearX, nearY, __type, __inited = false/*在鼠标进入box后才开始触发各种事件*/;
			let run = e => {
				//计算方向
				allow = !allow;
				if (allow) {
					//注释部分暂不需要 此保留参考 计算滑动方向上0下1左2右3 只求一个方向(查找位差大的为轴向，如x轴位移大于y轴位移，则为x轴，相等则取x轴)
					//dx = e.clientX - prevX;
					//dy = e.clientY - prevY;
					//axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
					//direction = axis === 'y' ? (dy < 0 ? 0 : 1) : (dx < 0 ? 2 : 3);
					//根据两个轴的位差计算到当前移动的主方向（只算一个方向，以便和后面的box位差算出触发的边）
					axis = Math.abs(e.clientX - prevX) > Math.abs(e.clientY - prevY) ? 'x' : 'y';
					prevX = e.clientX;
					prevY = e.clientY;

					//计算是否在元素内 并根据鼠标滑动的方向算出事件类型 如 1+inner=top-out  2+inner=bottom-out  反之则是in
					box = getBoxClient(el);
					dT = box.top - e.clientY;
					dB = box.bottom - e.clientY;
					dL = box.left - e.clientX;
					dR = box.right - e.clientX;
					inner = dT < 0 && dB > 0 && dL < 0 && dR > 0;

					//求得在靠近box的哪一边 按位差; 然后按轴来获得最终的边
					inOut = inner ? 'in' : 'out';
					nearX = Math.abs(dL) < Math.abs(dR) ? 'left' : 'right';
					nearY = Math.abs(dT) < Math.abs(dB) ? 'top' : 'bottom';
					__type = (type === 'in' || type === 'out') ? inOut : ((axis === 'y' ? nearY : nearX) + '-' + inOut);
					__inited = __inited || inOut === 'in';

					tickRun = prevInner !== inner;
					prevInner = inner;

					//进出变化时 完成初始化 并且 type符合时则执行任务
					if (tickRun && __inited && (!type || type === __type)) runNext(__type);
				}
			};

			//对整个文档监听，不能只监听元素
			addHandler(document, 'mousemove', run);
			unbind(ctx, el, 'mousemove', run);
		},//拓展鼠标事件 type有10个 in、out、top-in、top-out...left-in、left-out，其他鼠标事件则直接别名，默认会主动加上事件作为类名 如：mouse-in、mouse-top-out
		delay: (next, el, e, pipe, ctx) => (time, stopEvent, stopMode) => {
			// 防抖处理：
			// - 如果已经存在计时器，则取消掉，创建新的计时器来延迟执行下一次
			// - ctx的生命周期跟随处理器实例，所以这里的防抖原理是一个处理器实例只能有一个后续执行回调
			if (el.__DR_DELAY_TIMER) clearTimeout(el.__DR_DELAY_TIMER);

			//注册一个一次性事件（只在本次起作用），让stopEvent事件发生时，中断当前正在执行的延迟方法
			if (stopEvent && !el.__DR_DELAY_STOP_EVENT) {
				el.__DR_DELAY_STOP_EVENT = 1;

				//如果是dom事件则使用dom方式绑定
				let is_DOM_Event = ('on' + stopEvent) in el;

				//监听事件
				let run = e => {
					if (checkScope(stopEvent, el, null, e.scopeEl, e.target)) {
						//需要中断时立即执行 并且当前处理器实例的回调尚未执行时
						if (Number(stopMode) === 1 && el.__DR_DELAY_NEXT) {
							//console.log(222222,'中断延迟操作并且立即执行');
							el.__DR_DELAY_NEXT && el.__DR_DELAY_NEXT();
							el.__DR_DELAY_NEXT = null;
						} else clearTimeout(el.__DR_DELAY_TIMER);

						//执行完则将事件注销掉
						is_DOM_Event ? removeHandler(el, stopEvent, run) : index.off(stopEvent, run);
					}
				};
				if (is_DOM_Event) {
					addHandler(el, stopEvent, run);
					ctx.unbind(() => removeHandler(el, stopEvent, run));
				}
				else {
					index.on(stopEvent, run);
					ctx.unbind(() => index.off(stopEvent, run));
				}
			}

			//存储本次的任务回调 为stopMode=1的情况准备（在中断时立即当前尚未执行的任务）
			el.__DR_DELAY_NEXT = next;
			el.__DR_DELAY_TIMER = setTimeout(() => {
				//总是挂载最新的任务回调 比如菜单显示 则总是显示最后一次事件触发的
				//console.log('delay', '时间内多次执行，只会执行一次', time);
				next();
				el.__DR_DELAY_NEXT = null;
			}, time);
		},//延迟执行后续任务，配合stopEvent做防抖处理：mouseup.delay(200,'mouseleave').log(123)，表示鼠标放上去则延时200模式执行，当鼠标离开时则中断；time可以配合cms输出，把计算好的曲线加速延时填进去，就会有组元素差速效果；支持配置：pipe('delayRedouble',200) => 让延迟时间加倍，可实现按照元素的index做渐显效果
		loop: (next, el, e, pipe) => (stepTime, max, stopEvent) => {
			//通过在el中做标记，可以让元素只有一个计时器在工作，参考delay
			let __max = 0, __timer = setInterval(() => {
				(!max || (max > 0 && max < __max)) ? next() : clearInterval(__timer);
			}, stepTime);

			//收到中断事件后则停止
			shipEvents(stopEvent, () => clearInterval(__timer));
		},//循环执行器 一直按照stepTime的步长重复执行后续任务 max表示为最大执行次数
		watch: (next, el, e, pipe, ctx) => (name, stopEvent/*取消信号事件,多个则用“|”分隔符*/) => {
			//如果监听的是表单元素的value 并且没有设置过监听则设置监听 则自动监听change/不监听input事件，需要监听input的input事件则用使用表达式手动监听
			if (name === 'value' && el.DR_INPUT_WATCH !== 1 && isFormEl(el)) {
				el.DR_INPUT_WATCH = 1;
				addHandler(el, 'change', () => {
					setPms(el, name, 'checked' in el ? el.checked : el.value, e);
				});
			}

			let allow = true;
			stopEvent && shipEvents(stopEvent, n => allow = false);

			//监听参数对象变化
			let run = n => {
				//必须是元素自己的pms值 或者是自己的父级pms 才触发
				if (allow && n.key === name && (el.pmsid === n.__pmsid__ || isParentPms(el.pmsid, n.__pmsid__))) {
					next(el);
					pipe('prop', n.value);
				}
			};

			index.on('pmsChange', run);
			ctx.unbind(() => index.off('pmsChange', run));
		},//监听元素上的pms参数或者是父级pms的变化
		wait: (next, el, e, pipe, ctx) => (eventName/*等待的事件名*/, stopEvent/*取消信号事件,多个则用“|”分隔符*/) => {
			let run = () => next(),
				stopFn = () => index.off(eventName, run);

			//终止执行
			stopEvent && shipEvents(stopEvent, stopFn);

			//响应事件执行
			index.on(eventName, run);
			ctx.unbind(stopFn);
		},//注册一个一次性事件，一般用于串联事件，注意串联事件时必须传递取消信号，否则可能收到其他的同名事件信号干扰，导致意外执行

		//样式操作 元素操作 显示/隐藏/克隆等
		trans: (next, el, e, pipe) => (name, timeOrValue, time, easing) => {
			if (time) {
				if (time) el.style.transitionDuration = time + 'ms';
				if (easingLut[easing]) el.style.animationTimingFunction = easingLut[easing];

				addEvent(el, 'transitionend', () => next(), 1);

				//装载style
				let __value_arr = isString(timeOrValue) ? split(timeOrValue, '|') : [timeOrValue];
				each(split(name, '|'), (v, i) => {
					el.style[v] = __value_arr[i];
				});
			}
			else {
				if (timeOrValue) el.style.transitionDuration = timeOrValue + 'ms';
				addEvent(el, 'transitionend', () => next(), 1);
				addClass(el, name);
			}
		},//绑定一个有变换效果的样式类或style属性，并在变换结束后才执行接下来的任务
		animate: (next, el, e, pipe) => (className, time, once, sync/*不等待动画完成*/) => {
			// console.log('animate', time);
			if (time) el.style.animationDuration = time + 'ms';
			//if (delay) el.style.animationDelay = time + 'ms';//使用delay指令代替 此忽略

			//需要重复执行 则删除
			if (!once) {
				addEvent(el, 'animationend', () => (removeClass(el, className), sync ? null : next()), 1);
			}

			//添加动画样式
			addClass(el, className);
			sync && next();
		},//绑定一个动画样式类，并在执行完毕后删除掉（once不为true时） 监听元素的动画结束 动画结束后才执行后续任务; transTime是修改样式类的执行时间，可不填
		has: (next, el) => className => hasClass(el, className) && next(),//样式存在则继续 区别于whenHasClass 该指令没有子表达式事件
		not: (next, el) => className => !hasClass(el, className) && next(),//样式不存在则继续 区别于whenHasClass 该指令没有子表达式事件
		toggle: __toggleClass,//传递className2时，表示两边互换
		remove: __removeClass,//param1, param2是选填参数 填写时，则表示根据是否相等来执行removeClass
		add: __addClass,//param1, param2是选填参数 填写时，则表示根据是否相等来执行addClass
		onOff: (next, el) => fadeMode/*渐显渐隐方案*/ => {
			//缓存display原本的计算值
			if (el.style.display !== 'none') {
				el.DR_STYLE_DISPLAY = getComputedStyle(el).display;
			}

			//切换显示
			if (fadeMode) el.style.display === 'none' ? draftHandler.fadeIn(next, el)() : draftHandler.fadeOut(next, el)();
			else {
				el.style.display = el.style.display === 'none' ? el.DR_STYLE_DISPLAY : 'none';
				next();
			}
		},//元素切换显示
		show: (next, el) => () => {
			if (!el.DR_STYLE_DISPLAY) {
				el.DR_STYLE_DISPLAY = getComputedStyle(el).display;
				if (el.DR_STYLE_DISPLAY === 'none') el.DR_STYLE_DISPLAY = null;
			}
			el.style.display = el.DR_STYLE_DISPLAY || null;
			next();
		},//显示 display选填
		hide: (next, el) => () => {
			el.style.display = 'none';
			next();
		},//隐藏 传递参数则对比为真才执行
		visible: (next, el) => () => {
			el.style.visibility = 'visible';
			next();
		},//显示 传递参数则对比为真才执行
		hidden: (next, el) => () => {
			el.style.visibility = 'hidden';
			next();
		},//隐藏 传递参数则对比为真才执行
		fadeIn: (next, el) => () => {
			if (!el.DR_STYLE_DISPLAY) {
				el.DR_STYLE_DISPLAY = getComputedStyle(el).display;
				if (el.DR_STYLE_DISPLAY === 'none') el.DR_STYLE_DISPLAY = null;
			}
			el.style.display = el.DR_STYLE_DISPLAY || null;
			el.style.opacity = 0;
			el.style.transition = 'opacity 0.25s ease-in';
			setTimeout(() => {
				el.style.opacity = 1;
				setTimeout(next, 300);
			});
		},//250ms渐显 传递参数则对比为真才执行 todo:监听 TransitionEvent事件实现对transition的支持
		fadeOut: (next, el) => () => {
			el.style.opacity = 1;
			el.style.transition = 'opacity 0.25s ease-out';
			setTimeout(() => {
				el.style.opacity = 0;
				setTimeout(() => {
					el.style.display = 'none';
					next();
				}, 300);
			});
		},//250ms渐隐 传递参数则对比为真才执行 todo:监听 TransitionEvent事件实现对transition的支持
		clone: (next, el) => slt => {
			let __elm = isString(slt) ? getEl(slt) : slt;
			el.appendChild(__elm.cloneNode(true));

			next();
		},//克隆节点
		transfer: (next, el) => (slt/*选择器或节点对象*/, before/*插到前面*/) => {
			let __elm = isString(slt) ? getEl(slt) : slt;

			if (before) insertAfter(__elm, el);
			else append(__elm, el);

			next();
		},//转移节点 推荐使用id选择器，浏览器渲染时会缓存id列表，根本不用查找

		//特异化指令
		as: (next, el, e, pipe, ctx) => (className, animateByAdd/*添加时动画样式*/, animateByRemove/*删除时动画样式*/) => {
			if (e.eIndex === 0) {
				addClass(el, trimClassName(className));
				if (animateByAdd) {
					addClass(el, trimClassName(animateByAdd));
					addEvent(el, 'animationend', () => {
						removeClass(el, trimClassName(animateByAdd));
						next();
					}, 1);
				} else next();
			}
			else if (e.eIndex === 1) {
				if (animateByRemove) {
					addClass(el, trimClassName(animateByRemove));
					addEvent(el, 'animationend', () => {
						removeClass(el, trimClassName(animateByRemove));
						removeClass(el, trimClassName(className));
						next();
					}, 1);
				}
				else {
					removeClass(el, trimClassName(className));
					next();
				}
			}
		},//组合事件响应，事件1生效则add，事件2生效则remove，动画逻辑：传递动画时add则先add再执行动画，而remove则先动画再remove，需要反转，则直接互换事件然后对应动画样式即可  例如：[openNav|closeNav].as('show','slideUpIn','slideDownOut')

		//批量元素操作 near、son会处理缓存，是批量元素操作的推荐方案 inv表示只选中在屏幕中没有出界的元素
		near: (next, el, e, pipe) => (slt, index/*传递则摘取指定下标的元素*/, queueMode/*队列模式*/) => {
			//必须有传递选择器才执行
			if (slt) {
				//查找子元素
				let __elms = get(el.__DR_NEAR, slt) || getElAll(el, slt), p;

				//子元素不存在则执行冒泡查询
				if (__elms || !__elms.length) {
					mapParents(el, elm => {
						p = getParent(elm);
						if (p && p.nodeType === 1) {
							__elms = getElAll(p, slt);
							if (__elms.length) return false
						}
					});
				}

				//有查询到目标则逐个执行
				if (__elms && __elms.length) {
					el.__DR_NEAR = el.__DR_NEAR || {};
					el.__DR_NEAR[slt] = __elms;

					//有指定下标或者是id选择器，则只执行目标 传入的index下标无效
					let idSlt = slt[0] === '#';
					if (noUndefined(index) || idSlt) next(__elms[idSlt ? 0 : index]);
					else {
						let __next = cb => (elm, index) => {
							pipe('near_current_el', elm);
							pipe('near_current_index', index);
							pipe('loopIndex', index + 1);
							next(elm, cb);
						};

						//队列模式 等待当前任务队列结束后，再执行一次，即递归执行
						if (queueMode) {
							let run = index => {
								__next(() => {
									//如果存在下一个子元素 则再执行一次
									let nextIndex = index += 1;
									__elms[nextIndex] && run(nextIndex);
								})(__elms[index], index);
							};
							run(0);
						}
						else each(__elms, __next());
					}
				}
			} else console.warn('The "near" param 0 is a require!');
		},//获取附近的目标元素（子元素、兄弟及兄弟子孙元素） 缓存在元素上下文中
		son: (next, el, e, pipe, ctx) => (slt/*null则直接子元素*/, queueMode/*逐个顺序执行*/, inv/*只取屏幕完整可见的元素*/) => {
			let pipe_son = pipe('son');
			if (typeof slt === 'number') {
				next(pipe_son ? pipe_son[slt] : getChildren(el)[slt]);
				return;
			}

			let son = pipe_son || getSon(el, slt);
			if (!son) return;

			//获取到son后 先写到上下文 给next后面的流程调用
			let __son = [];

			if (inv) {
				let __curEl;
				each(son, (elm, index) => {
					__curEl = getBoxClient(elm);
					//只要有部分在屏幕都算，则：__curEl.top > 0 || __curEl.bottom > 0 || __curEl.left > 0 || __curEl.left > 0;
					if (__curEl.top > 0 && __curEl.bottom > 0 && __curEl.left > 0 && __curEl.left > 0) {
						__son.push(index);
					}
				});
			}
			else __son = son;

			pipe('son', __son);
			pipe('son_len', __son.length);
			pipe('son_parent', el);

			//为了兼容pipe能读取到pms 对没有dr-pms的追加该参数
			each(__son, elm => {
				elm.__DR_WIDGET_PROPS = elm.__DR_WIDGET_PROPS || el.__DR_WIDGET_PROPS;
				addPmsAttr(elm);
			});

			//封装一个next执行函数 cb用来给queueMode做递归 loopIndex表示本次循环 todo:暂时不考虑嵌套，嵌套循环时只能记录在元素上才行，否则会被覆盖，以后元素要挂一个专用对象，存放各种元素相关的上下文
			let __next = cb => (elm, index) => {
				pipe('son_current_el', elm);
				pipe('son_current_index', index);
				pipe('loopIndex', index + 1);
				//console.log(pipe('loopIndex'));
				next(elm, cb);
			};

			//队列模式 等待当前任务队列结束后，再执行一次，即递归执行
			if (queueMode) {
				let run = index => {
					__next(() => {
						//如果存在下一个子元素 则再执行一次
						let nextIndex = index += 1;
						__son[nextIndex] && run(nextIndex);
					})(__son[index], index);
				};
				run(0);
			}
			else each(__son, __next());
		},//slt选填 在一个表达式内重复执行son()，只要选择器一致 则不会重复获取，填写则执行元素过滤 queueMode表示使用队列模式执行 比如在动画场景则需要队列逐个执行 会暴露上下文pipe.son_current_index
		hit: (next, el, e, pipe) => (index, targetSlt, hitClassName, unHitClassName, toggleAnimateClassName) => {
			let son = pipe('son') || {};
			let isHit = index || index === 0 ? String(index) === String(e.prop) : son[e.prop] === el;
			let __hitClassName = trimClassName(hitClassName),
				__unHitClassName = trimClassName(unHitClassName);

			let targetEl = targetSlt ? getEl(el, targetSlt) : el;
			if (isHit) {
				addClass(targetEl, __hitClassName);
				removeClass(targetEl, __unHitClassName);

				//切换动画只在击中的元素中执行
				if (toggleAnimateClassName) addAnimateClassName(el, toggleAnimateClassName);
			}
			else {
				addClass(targetEl, __unHitClassName);
				removeClass(targetEl, __hitClassName);
			}

			next();
		},//判断是否被prop传递的index击中，击中则装载hitClassName、卸载nuHitClassName，否则卸载hitClassName、装载nuHitClassName；例如：toggle('li').hit(prop,null,'n-show')则会给击中的元素装载n-show，toggle('li').hit(prop,null,null,'n-hide')则会给未击中的元素装载n-hide，

		//断言 为真则执行next 为假并发送事件（作用域仅限于当前元素） 该事件只能在本元素表达式中捕捉到（避免发生混乱做的一个强制性规则）
		isSelf: (next, el, e) => () => e.target === el && next(),//事件元素是当前元素自身 而不是子元素
		isMobile: (next, el, e) => (no, prop) => assertFn(isMobile, next, no, el, prop, e),//该方案是在宽度小于768时也会被判为手机端 如果有精确要求请不要使用
		hasClass: (next, el, e) => (className, no, prop) => assertFn(hasClass(el, className), next, no, el, prop, e),//样式存在则继续
		notClass: (next, el, e) => (className, no, prop) => assertFn(!hasClass(el, className), next, no, el, prop),//样式不存在则继续
		hasUrlParam: (next, el, e) => (key, no, prop) => assertFn(url.searchParams.has(key), next, no, el, prop, e),//判断是否url存在指定参数 URL对象在ie之外的所有现代浏览器都兼容
		isEq: (next, el, e) => (param1, param2, no, prop) => assertFn(valEq(param1, param2), next, no, el, prop, e),//参数相等则继续
		isNon: (next, el, e) => (param1, param2, no, prop) => assertFn(!valEq(param1, param2), next, no, el, prop, e),//参数不相等则继续
		isGreater: (next, el, e) => (param1, param2, no, prop) => assertFn(param1 > param2, next, no, el, prop, e),//参数1大于参数2则继续
		isLess: (next, el, e) => (param1, param2, no, prop) => assertFn(param1 < param2, next, no, el, prop, e),//参数1小于参数2则继续
		isPass: (next, el, e) => (param1, sign, param2, no, prop) => assertFn((new Function('return ' + param1 + sign + param2))(), next, no, el, prop, e),//支持6种比较运算 == >< =><= !=
		isCache: (next, el, e) => (name, value, no, prop) => assertFn(valEq(cache(next, el, name), value), next, no, el, prop, e),
		isPms: (next, el, e, pipe, ctx) => (name, value, no, prop) => assertFn(valEq(getPms(el, name, e, next, pipe, ctx), value), next, no, el, prop, e),
		isNum: (next, el, e, pipe, ctx) => (value, no, prop) => assertFn(isNumeric(value), next, no, el, prop, e),//是数字
		isEmail: (next, el, e, pipe, ctx) => (value, no, prop) => assertFn((/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(value), next, no, el, prop, e),//是邮件地址
		isMP: (next, el, e, pipe, ctx) => (value, no, prop) => assertFn((/^[1][3-9][\d]{9}/).test(value), next, no, el, prop, e),//是手机号码
		isLimit: (next, el, e, pipe, ctx) => (value, max, min, no, prop) => {
			let len = value ? String(value).length : 0;
			assertFn(min ? ((len > min || len === min) && (len && len <= max)) : (len && len <= max), next, no, el, prop, e);
		},//字符长度符合 min不填则是只限制最大值
		isEmpty: (next, el, e, pipe, ctx) => (value, no, prop) => assertFn(!value, next, no, el, prop, e),//空判断
		is: (next, el, e, pipe) => (assert, no, prop) => assertFn(assert, next, no, el, prop, e),//基本分支指令，支持从上下文中（包括window、calc表达式）查找断言 比如页面注入了window.is_admin=true 则when('is_admin')，使用window全局函数来做断言，如input框：when(value,'lili','notMobile',1,'card')，表示断言value='lili'时执行后续，为false时则发送事件，触发其他表达式

		//calc使用 不执行next 更多的数学方法 可以用math来替代
		href: (next, el) => () => getAttr(el, 'href') || null,//a标签专用
		index: (next, el, e, pipe) => (parent, targetSlt, siblingSlt) => {
			//不传参的时候，则从上下文中求等当前元素的index
			if (!parent && !targetSlt && !siblingSlt) {
				let son = pipe('son'),
					son_current_index = pipe('son_current_index');
				return son_current_index || son_current_index === 0 ? son_current_index : elIndexOf(son, el);
			}

			let __p = getEl(parent);
			return elIndexOf(siblingSlt ? getElAll(__p, siblingSlt) : get(__p, 'children'), getEl(__p, targetSlt))
		},//不填写则是返回当前执行的子元素的下标 填写就是求其他容器中子元素的下标 可以用来同步两个元素的状态时作为计算因子用
		prop: (next, el, e) => () => get(e, 'prop'),
		scope: (next, el, e) => () => get(e, 'scopeEl') || null,

		//属性读写 传递value则是写
		value: (next, el, e) => value => {
			// 当元素有设置dr-pms的时候，调用程序会优先操作pms属性
			let __isFormEl = isFormEl(el);
			let __valOk = valOk(value);
			if (__isFormEl) {
				//写
				if (__valOk) {
					if (valOk(value, emptyVal)) {
						//checkbox 要回写到元素的value
						if (__isFormEl === 'checkbox' || __isFormEl === 'radio') {
							el.checked = value !== 0 && !!value;
						} else el.value = value;
					}

					next();
				}
				//取
				else return el.value;
			} else {
				if (__valOk) {
					el.innerText = value;
					next();
				}
				else return el.innerText;
			}
		},//当不传递value的时候，则获取input元素的value或者div的text，否则，为元素显示参数或者为input绑定value
		style: (next, el, e, pipe) => (name, value, unitName) => noUndefined(value) ? (el.style[name] = value + (unitName || ''), next()) : el.style[name],//设置style参数 不输入value则是获取
		height: (next, el, e, pipe) => (value, unit) => noUndefined(value) ? (el.style.height = value + (unit || ''), next()) : getComputedStyle(el).height,
		width: (next, el, e, pipe) => (value, unit) => noUndefined(value) ? (el.style.width = value + (unit || ''), next()) : getComputedStyle(el).width,
		attr: (next, el) => (key, value) => noUndefined(value) ? (setAttr(el, key, value), next()) : getAttr(el, key),//元素属性值
		url: (next, el, e) => (url, paramKeyOrLst, paramValue) => noUndefined(url) ? toPage(url, paramKeyOrLst, paramValue) : location.href,//不传参数则执行跳转
		urlParam: (next, el) => (key, value) => noUndefined(value) ? (url.searchParams.set(key, value), next()) : url.searchParams.get(key),//url参数
		pms: (next, el, e, pipe, ctx) => (name, value) => noUndefined(value) ? (setPms(el, name, value, e, pipe, ctx), next()) : getPms(el, name, e, next, pipe, ctx),//pms设置 pms上的参数可以被watch sonSlt选填，会选中当前元素中所有符合条件的子元素 等效于son().set(name,val)
		pipe: (next, el, e, pipe) => (name, value) => {
			pipe(name, value);
			next();
		},//向pipe写值 然后同任务的后续处理器获取，适用于为后续处理器提供一个临时参数或者复用某个参数
		cache: (next, el, e, pipe, ctx) => (name, value) => cache(next, el, name, value),//设置一个缓存 用来记录执行状态 生命周期同元素

		//操作上下文相关 el pms pipe 执行next，只是用来加工参数，把结果向后传递
		inc: (next, el, e, pipe, ctx) => (pipeName, step, multiplyMode) => {
			let value = Number(pipe(pipeName));
			pipe(pipeName, multiplyMode ? value * step : value + step);
			// console.log(123, aaa);
			next();
		},//对某个pipe参数做自增 该处理器会存储状态，所以叫做自增  multiplyMode乘，time表示按总时间计算，默认读取son 如: pipe('delay1',100).ease('delay1',100,1,500,3)
		pmsInc: (next, el, e, pipe, ctx) => (pmName, step, multiplyMode) => {
			let value = Number(getPms(el, pmName, e, next, pipe, ctx));
			setPms(el, pmName, multiplyMode ? value * step : value + step, e);
			// console.log(123, aaa);
			next();
		},//对某个pms参数做自增 该处理器会存储状态，所以叫做自增  multiplyMode乘，time表示按总时间计算，默认读取son 如: pipe('delay1',100).ease('delay1',100,1,500,3)
		take: (next, el, e, pipe) => function (pipeName, index/*传入任意个数的参数，如样式类*/) {
			pipe(pipeName, (typeof arguments[2] === 'object' ? arguments[2] : arguments)[arguments[1]]);
			next();
		},//根据指定的index作为下标获取到值，并写到pipe中 可以传入pms 如：配合pipe使用，获取一个对应的样式类
		pole: (next, el, e, pipe) => (pipeName, baseSlt) => {
			//父节点暂时用不上，这里保留后续维护参考，压缩器会清理不用理会冗余问题
			let baseEl;

			//查找父元素
			mapParents(el, elm => {
				baseEl = getEl(elm, baseSlt);
				if (baseEl) {
					return false
				}
			});

			//能找到基准元素才计算
			if (baseEl) {
				//分别计算上下左右差值 得出最大的那个就是 左对左 右对右来计算
				let d, x = 0, y = 0, baseBox = getBoxClient(baseEl), elBox = getBoxClient(el),
					ya = baseBox.top, yb = baseBox.bottom,
					yc = elBox.top, yd = elBox.bottom, xa = baseBox.left,
					xb = baseBox.right, xc = elBox.left, xd = elBox.right;

				//该算法是为了避免完全重合，并且可以计算出两个轴分别对应的偏移，比如同时向上 向左，还可以相加，得到八方向代码：10(补位避免和四方向重合)+1+4 = 15
				if (yd < yb && yc < ya) y = 1;
				if (yd > yb && yc > ya) y = 2;
				if (xd < xb && xc < xa) x = 3;
				if (xd > xb && xc > xa) x = 4;

				//因为只求一个方向 所以根据xy轴偏差大小 得出最后的偏移方向(以元素左上角为基准)
				d = Math.abs(ya - yc) > Math.abs(xa - xc) ? y : x;
				pipe(pipeName, d);
			}

			next();
		},//计算当前元素相对某个元素的方位(必须分离状态) 会自动计算两者共有的最临近父节点 后续处理器用poleValue获取到0:两元素重合中 1:top、2:bottom、3:left、4:right  用于实现类似导航栏下标装饰响应mouseup滑动，相对active元素即可实现
		heightBy: (next, el, e, pipe) => (inner, slt) => {
			let h = getHeight(slt ? getElBy(slt) : el, inner);
			el.style.height = h + 'px';
			next();
		},//从其他元素的获取高度
		widthBy: (next, el, e, pipe) => (inner, slt) => {
			let w = getWidth(slt ? getElBy(slt) : el, inner);
			el.style.height = w + 'px';
			next();
		},//从其他元素的获取宽度

		//执行流控制 配合指令状态挂起与恢复 用于loop等有循环操作的指令（由指令内部挂载ctx.restart函数） 本来还考虑实现breakpoint设置断点，将next挂起，用于循环体，如loop指令，给stop操作，但想到没有实际场景，不考虑实现
		stop: (next, el, e, pipe, ctx) => eventName => {
			index.on(eventName, ctx.destroyAll);
			next();
		},//终止当前任务队列的执行流 内部会在下一个指令前中止，调用ctx.destroyAll清理所有指令的状态
		do: (next, el, e, pipe, ctx) => function (path) {
			next();

			let args = [];
			each(arguments, (v, i) => {
				if (i !== 0) args.push(v);
			});

			let handle = get(window.__DR_HANDLES, path) || get(el.__DR_HANDLES, path);
			return isFunction(handle) ? handle.apply(null, args) : handle
		},//调用句柄 指令定义句柄：skate(direction,speed)('s1')，子表达式调用：mouseover.do('s1.pause')
	};

	//组件私有处理器
	draftHandler.pro = {};

	// var hasAttrName = (el, name) => {
	// 	var i, __has = false, __attrs = el.attributes;
	//
	// 	for (i = 0; i < __attrs.length; i++) {
	// 		if (__attrs[i].name === name) {
	// 			__has = true;
	// 			break;
	// 		}
	// 	}
	//
	// 	return __has
	// };

	/**
	 * 域内元素的状态记录
	 * 解析元素的pms表达式，每次task被执行前动态获取，将pms挂载在pms所在对象和el中（域内el引用同一个）
	 * 允许js表达式
	 * Object.values(aa.attributes)
	 * 解析：dr-pms="isParent:false,name:'lihong';" => {isParent:false,name:'lihong'}
	 * @param el
	 * @return {*}
	 */
	var resolvePms = el => {
		if (!el || !isElmNode(el)) return;
		if (el.__DR_PMS__) return el.__DR_PMS__;

		//向上查找父级对象 查找到含有dr-pms的元素
		let __pms, exp, attrName = 'dr-pms';
		if (hasAttrName(el, attrName)) {
			exp = getAttr(el, attrName);
			__pms = exp ? makeValue(exp) : {};
			__pms.__proto__ = pms.root;
		}
		else {
			mapParents(el, p => {
				if (p && isElmNode(p) && (hasAttrName(p, attrName) || p.__DR_PMS__)) {
					exp = getAttr(p, attrName);
					__pms = p.__DR_PMS__ = p.__DR_PMS__ || (exp ? makeValue(exp) : {});
					__pms.__proto__ = pms.root;
					return false
				}
			});
		}

		return el.__DR_PMS__ = __pms
	};

	/**
	 * 解析表达式
	 * @param lut
	 * @param notEvent 不需要解析事件名称 用于外部直接执行语句使用
	 * @returns {{}}
	 */

	//组装用于当前元素的事件任务，如：dr-do="blur:remove.active&add.fadeOut,.tab-head|disabled"
	//可以解析表达式格式：showLi、showLi('li.item').emit('finished')、showLi.emit('finished')、[showLi|showNav].emit('finished')
	var compileExp = (lut, notEvent) => {
		// if(lut==="btn4Click:disabled,li{0}|active-li.disabled-li.my") debugger;
		let t = expSplit(lut, ':'),
			eventLut = t[0] || '',
			handlersExt = t[1] ? "_('" + t[1] + "')" : null,
			handlers = resolveHandlerExp(eventLut, handlersExt),
			event = null,
			agent = null;

		//先把事件名找出来
		if (!notEvent) {
			let __event = get((/(.*?)[:\(\.]/g).exec(lut), 1);

			//如果事件名存在于处理器则赋空 整个表达式作为立即执行的普通指令来处理（用户可能在指令中自定义处理click，此时如果有定义也做普通指令执行）
			if (draftHandler[__event]) event = '__only_handlers__';
			else {
				//事件名赋值
				event = __event;

				//如果存在“click(”这样的字符串则作为代理事件来处理，取第一个指令解析出选择器参数，并立即删除该指令
				//在t阶段，就会把click.emit('open')的click清理掉，而click('li')会被解析为指令，所以可以通过判断“click(”得知是否为代理事件
				let reg = new RegExp(__event + '[(]');
				if (reg.test(eventLut)) {
					agent = makeValue(parseExp(handlers[0].exp.replace(reg, '('))[0][0]);
					handlers.splice(0, 1);
				}
			}
		}

		return {
			event,//click
			agent,//'li'
			handlers//["emit('openModal')","show()"]
		};
	};

	/**
	 * 解析当前元素包含的事件任务
	 * @param exp 表达式
	 * @param el 元素
	 * @param taskScopeEl 选填，任务作用域元素对象
	 * @param widgetName 选填，组件名称 用来加载私有handler
	 * @returns {{}}
	 */
	var resolveEvent = (exp, el, taskScopeEl, widgetName) => {
		//组装用于当前元素的事件任务 格式同events
		let res = {};

		//生成一次任务
		let pushTask = (eventName, compileRes, pipe, eIndex, expOrg) => elm => {
			//在元素上挂载一些标记信息
			//目前，如果一个元素中多次监听统一事件，如：mouseleave:self|active.remove;mouseleave.emit('mytest')，则会出现同一eid的多条记录，
			//记录eid是为了后面实现动态撤销指定元素的指定事件，而同一eid的记录变成要删除多条，后期考虑只要同一事件下面存在对应eid的记录，则合并before和tasks。
			let eid = elm.__DR_ID || events.idx++;
			let event_count = elm['__DR_EVENT_' + eventName] ? ++elm['__DR_EVENT_' + eventName] : 1;
			elm['__DR_ID'] = eid;
			elm['__DR_EVENT_' + eventName] = event_count;
			elm['__DR_DR_EVENTS'] = elm['__DR_DR_EVENTS'] || {};

			//记录当前元素绑定了哪些事件 为销毁做准备 value=1没有意义，纯粹是要实现hash结构方便查询，也避免重复push
			elm['__DR_DR_EVENTS'][eventName] = 1;

			let one = {
				eid,
				eIndex,
				scope: taskScopeEl,//表示本次任务有限定作用域
				event: eventName,
				unbind: null,//由分发器绑定的解绑事件方法
				widget: widgetName,
				el: elm,
				by: compileRes.agent,//表示这个任务来自于代理表达式，从选择器中获取
				pipe,//任务pipe
				expOrg,//任务表达式
				handlers: compileRes.handlers
			};

			//写入当前表达式的结果对象
			(res[eventName] = res[eventName] || []).push(one);

			//也写到全局
			(events[eventName] = events[eventName] || []).push(one);
		};

		//可以解析表达式格式：showLi、showLi('li.item').emit('finished')、showLi.emit('finished')、[showLi|showNav].emit('finished')
		//！！！不推荐使用，当前都是用son指令完成相同功能。
		let compile = (exp, eIndex) => {
			let __compileExp = compileExp(exp),
				event = __compileExp.event,
				agent = __compileExp.agent;

			//事件代理，则为每个目标元素分别绑定任务
			if (agent) {
				let elms = getElAll(el, agent);
				each(elms, pushTask(event, __compileExp, {son: elms}, eIndex, exp));
			} else pushTask(event, __compileExp, {}, eIndex, exp)(el);
		};

		//编译表达式 以分号切分任务
		each(expSplit(clearSpace(exp), ';'), ex => {
			//如果有合并事件，则做分拆 做自循环操作，相当于给自己分别绑定两个事件，这个语法本身只是一个语法糖
			let __isMerge = ex[0] === '[';
			if (__isMerge) {
				let __isDot = !ex.includes(':');
				let __eventLut = (/\[(.*)\][\.:]/g).exec(ex);

				//不能正常抓取到事件则是表达式错误
				if (!__eventLut) console.warn('expression error!' + ex);

				let __taskLut = ex.replace(__eventLut[0], '');
				each(split(__eventLut[1], '|'), (v, i) => v && compile(v + (__isDot ? '.' : ':') + __taskLut, i));
			} else compile(ex);
		});

		return res
	};

	/**
	 * active实现
	 * 如果当前事件集合中没有dr的click事件，则使用body监听，否则只响应dr的click
	 * @param el
	 * @param eventName
	 * @param task
	 * @param callback
	 */
	var activeHandler = (el, eventName, task, callback) => {
		return e => {
			//当前事件的原始事件元素对象标记不允许执行元素焦点事件
			let __orgEvent_target = e.orgEvent ? e.orgEvent.target : {};
			if ('dr-not-trigger-active' in __orgEvent_target.attributes) return;

			//执行判断 击中的元素属于目标元素子元素则是击中
			let targetEl = getTarget(e),
				inner = el === targetEl ? targetEl !== bodyEl$1() : contains(el, targetEl);

			//是否执行事件函数
			if (eventName === 'active' ? inner : !inner) {
				callback(e, el, task);
			}
		}
	};

	/**
	 * 解析元素任务
	 * @param exp
	 * @param el
	 * @param taskScopeEl 选填，任务作用域作用域元素对象
	 * @param widgetName 选填，组件名称
	 */
	var dispatch = (exp, el, taskScopeEl, widgetName) => {
		if (!exp) return;
		let events = resolveEvent(exp, el, taskScopeEl, widgetName);

		//解析元素绑定的事件和任务
		each(events, (tasks, eventName) => {
			//不含事件监听的任务 纯粹执行handlers
			if (eventName === '__only_handlers__') each(tasks, task => runTask(null, task.el, task));
			//含事件监听的任务
			else each(tasks, task => {
				let curEl = task.el;
				let eName = task.event;
				let is_DR_Event = eName === 'active' || eName === 'inactive';
				let is_DOM_Event = !is_DR_Event && ('on' + eName) in curEl;
				let eventFn;

				//dom事件
				if (is_DOM_Event) {
					//用于a标签禁止默认行为
					let stop = hasAttrName(curEl, 'dr-stop');

					eventFn = e => {
						//阻止冒泡 不触发父元素的同类事件 因为active会因为触发了body的click，导致重复触发（开了又关掉）
						stopPropagation(e);
						if (stop) e.preventDefault();
						drEmit(eName, curEl, null, null, e);
						runTask(e, curEl, task);
						return false
					};

					addHandler(curEl, eName, eventFn);
					task.unbind = () => removeHandler(curEl, eName, eventFn);
				}

				//dr事件
				if (is_DR_Event || !is_DOM_Event) {
					//焦点事件
					if (eName in {inactive: 1, active: 1}) {
						//生成一个active|inactive处理函数
						eventFn = activeHandler(curEl, eName, task, runTask);
						index.on('click', eventFn);
						task.unbind = () => index.off('click', eventFn);
					}

					//其他事件
					else {
						eventFn = e => {
							if (checkScope(eName, curEl, task.scope, e.scopeEl, e.target)) {
								runTask(e, curEl, task);
							}
						};
						index.on(eName, eventFn);
						//解绑事件
						task.unbind = () => index.off(eName, eventFn);
					}
				}
			});
		});
	};

	/**
	 * 监听DOM节点变化
	 * MutationObserver兼容ie11以上浏览器
	 * MutationObserver是异步的，会等本次事件后所有节点加载完成后才触发
	 * @param el
	 * @param callback
	 */
	var DOMNodeChange = (el, callback) => {
		let MutationObserver = window.MutationObserver;// || window.WebKitMutationObserver;
		if (MutationObserver) {
			//callback传入参数mutations
			let observer = new MutationObserver(callback);
			observer.observe(el, {
				childList: true,//包括子节点
				subtree: true,//监听整个节点树
				// attributes: true,//检测属性变动
				// characterData: false //申明监听文本内容的修正
			});

			//在退出页面时销毁事件，避免被chrome缓存，导致修改代码后刷新页面不生效要重启浏览器
			let disconnect = () => {
				observer.disconnect();
			};
			if ('onbeforeunload' in window) window.addEventListener("beforeunload", disconnect);
			window.addEventListener('unload', disconnect);
		}
		//MutationEvent最低兼容到 ie9 已经不需要了 所以取消，该方式是同步的，会卡页面
		// else if (el.addEventListener) {
		// 	//callback传入参数evt
		// 	el.addEventListener("DOMSubtreeModified", callback, false);
		// }
		else console.warn('Drummer:unsupported browser!');
	};

	//删除任务和事件
	const removeTaskEvent = els => {
		let __tasks, __task, i;
		each(els, elm => {
			each(elm.__DR_DR_EVENTS, (v, key) => {
				__tasks = events[key];
				for (i = __tasks.length - 1; i >= 0; i--) {
					//命中则删除事件、任务记录
					__task = __tasks[i];
					if (__task.el === elm) {
						__task.unbind && __task.unbind();
						__tasks.splice(i, 1);
					}
				}
			});
		});
	};

	/**
	 * 卸载表达式
	 * 只支持单个，会查找域内所有dr元素
	 * @param el
	 */
	var uninstall = el => {
		if (el && isElmNode(el)) {
			removeTaskEvent(concat([el], getDrEl('on', el) || []));
		}
	};

	//转化相对像素值 默认为100px 基准屏幕为375px
	//并非说一定要在375px屏幕下开发，而是说375px屏幕下获得的像素就是1rem=1px，所以叫基准屏幕
	var trimRem = value => {
		let a = clientWidth();
		if (a < 640) {
			(document.documentElement || document.body).style.fontSize = (a / 375) * (value || 100) + 'px';
		}
	};

	/**
	 * 程序说明
	 * dr-on监听
	 *
	 */

	let on = (eName, fn) => index.on(eName, e => fn(e, transform(resolvePms(e.target), (res, val, key) => {
		//去掉私有属性
		if (!(/__.*?__/).test(key)) res[key] = val;
	}, {})));
	let emit = (eName, prop, el, scope, e) => drEmit(eName, el || bodyEl$1(), prop, scope, e);

	//区别dispatch，这个是马上执行，而不是挂载等待事件触发
	let _do = (exp, el/*可传递元素对象,对象集合,选择器*/) => {
		//过程式执行表达式, 如do(".nav","son('li'):active"),表示对.nav选中的元素的子元素li做active样式类切换
		let elms = el ? (isString(el) ? getElAll(el) : (('length' in el) ? el : [el])) : getElAll('body');
		each(elms, elm => runTask({}, isString(el) ? getElAll(el) : el, compileExp(exp, true)));
	};

	//入场动画 cb可以传入dr.run()，让所有表达式在动画结束后才执行
	function pageTrans(animateIn, cb) {
		let body = bodyEl$1();
		addClass(body, animateIn);
		addEvent(body, 'animationend', () => {
			removeClass(body, animateIn);
			cb && cb();
		}, 1);
	}

	//.5秒之后 捕捉状态，如果发现还没打开页面，则判为组件发生错误
	//避免用户看不到画面，强制设置visible，并上报错误（后台可以对该站点输出开关__DR_OFF=true，禁用所有特效）
	let showBody = () => {
		addClass(bodyEl$1(), 'n-show');
		bodyEl$1().style.visibility = 'visible';
	};
	setTimeout(() => {
		if (!init.inited || bodyEl$1().style.visibility !== 'visible') {
			showBody();
			let iframe = document.createElement('iframe');
			iframe.style.display = 'none';
			iframe.setAttribute('src', '/declare.html');
			bodyEl$1().appendChild(iframe);
		}
	}, 500);

	//el选填，不填则可以用来实现信号塔模式（Beacon Mode），内部实现其实是绑定在body元素上面，它的作用域自然变成全局，就有了全局广播的效果
	function dispatches(tasks, el, scopeEl) {
		each(tasks, exp => {
			dispatch(exp, el || bodyEl$1(), scopeEl);
		});
	}

	/**
	 * 应用参数配置
	 * @param options Object 并入的所有参数可以在表达式访问到
	 */
	function config(options) {
		let __opts = options || {};

		//并入pms
		Object.assign(pms, __opts);
		if (__opts.rem) trimRem(__opts.rem);
	}

	//生成键盘事件
	addHandler(document, 'keydown', ev => {
		//传递事件执行的断言，实现当表单元素绑定事件时，只有在表单元素激活的状态下才触发执行
		let code = Number(ev.keyCode || ev.which),
			activeElement = el => isFormEl(el) ? document.activeElement === el : true;

		if (code === 13 || ev.key === 'Enter') emit('enter', null, activeElement);
		if (code === 27 || ev.key === 'Esc') emit('esc', null, activeElement);
		if (code === 46 || ev.key === 'Delete') emit('delete', null, activeElement);
	});

	//全局事件scrollUp scrollDown - window滚动 判别滚动方向
	let n, prevTick, direction = 1/*1向上0向下*/;
	windowEventHandler('scroll', e => {
		//只需要取一个方向的值来做计算
		let s = getScroll(), t = s.t;
		//记录偶数次的元素位置
		if (n = !n) prevTick = t;
		//奇数次的元素位置才用来计算触发事件
		else direction = +(t > prevTick);

		//加方向锚点，连续同一方向只触发一次 要实现持续触发，则放开该限制即可
		if (window.scroll_direction !== direction) drEmit(['pageUp', 'pageDown'][direction], get(e, 'target'), null, null, e);
		window.scroll_direction = direction;

		//视窗可视区域高度
		let clientHeight = document.documentElement.clientHeight || document.body.clientHeight;

		//到达顶部|底部 dd是补差的值，避免差极小的像素导致不触发
		let dd = 10;
		if (t <= dd) drEmit('pageHome', get(e, 'target'), null, null, e);
		if (t + clientHeight + dd >= s.h) drEmit('pageEnd', get(e, 'target'), null, null, e);
	});

	//window加载完成后则执行
	// let nextOnloadFn = isFunction(window.onload) ? window.onload.bind(window) : emptyFun;//配合window.onload使用 留作参考
	windowEventHandler('load', () => {
		if (window['__DR_OFF']) return;

		//防止DOM渲染时间差 导致页面闪烁机制 先在样式对body隐藏（用户自行实现dr-page-in样式），然后run的时候再把该属性删掉，并display中写入visible
		showBody();

		//执行元素装载
		setup();

		// nextOnloadFn();
		each(init.onload, fn => fn());

		//给某些依赖初始化后执行的逻辑打参考标记
		init.inited = true;

		//发送body的click事件
		addHandler(bodyEl$1(), 'click', event => {
			let target = event.target || event.srcElement;
			drEmit('click', target, null, null, event);
		});

		// DOM节点变更事件，MutationObserver是异步的，可用资源：event.addedNodes event.removedNodes
		// !!!注意，务必在特定的时机将MutationObserver注销掉，否则修改代码后可能要重启chrome才生效（已在DOMNodeChange处理）
		DOMNodeChange(document.body, mutations => {
			each(mutations, mutation => {
				if (mutation.type === 'childList') {
					each(mutation.addedNodes, setup);
					each(mutation.removedNodes, uninstall);
				}
			});
		});

		//假如要页面跳转过渡 则对跳转监听或对所有a标签监听(在有其他事件监听的子元素情况下，可能会失效)
		if (pms.pageTrans) {
			let trans = () => index.emit('loading', {});
			if ('onbeforeunload' in window) windowEventHandler("beforeunload", trans);
			else addHandler(document.body, 'click', event => {
				let target = event.target || event.srcElement,
					isLink = target.nodeName.toLocaleLowerCase() === "a";
				if (isLink && getAttr(target, 'target') !== '_blank') {
					// event.preventDefault();//取消a标签的默认行为 不让跳转
					trans();
				}
			});

			//跳出时把loading清除掉 不然浏览器回退状态会保留
			windowEventHandler('unload', () => index.emit('unloading'));
		}
	});

	//html工具包
	let bodyAppend = el => append(bodyEl$1(), el);
	let html = {
		getEl,
		getElAll,
		getParents,
		getChildren,
		getParent,
		getSiblings,
		getAttr,
		setAttr,
		addClass,
		removeClass,
		toggleClass,
		createEl,
		removeEl,
		insertBefore,
		insertAfter,
		append,
		bodyEl: bodyEl$1,
		bodyAppend,
		addHandler,
		removeHandler
	};


	var dr = {
		on,
		emit,
		do: _do,
		getPms,
		setPms,
		ajax,
		tip,
		isMobile: isMobile$1,
		html,

		addEvent,
		removeEvent,

		handlers: options => options ? Object.assign(draftHandler, options) : draftHandler,//定义/获取批量指令
		handler: (name, fn) => fn ? draftHandler[name] = fn : draftHandler[name],//定义/获取指令
		widget: (name, options) => widgets[name] = options,//注册组件
		el: (wrapper, name) => getEl(wrapper, '[dr=' + name + ']'),//选择dr元素
		dispatch,
		dispatches,
		pageTrans,
		setup,
		config
	};

	return dr;

})();
