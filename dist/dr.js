var dr = (function() {
    'use strict';


    function each(agg, fn) {
        if (agg && (typeof fn === 'function')) {
            var i,
                __agg = (typeof agg === 'string') ? agg.split('') : agg;

            if ('length' in __agg) {
                for (i = 0; i < __agg.length; i++) {
                    if (fn(__agg[i], i) === false) break;
                }
            } else {
                var k,
                    index = 0;
                for (k in __agg) {
                    if (fn(__agg[k], k, index++) === false) break;
                }
            }
        }
    }

    function transform(agg, fn, res) {
        each(agg, function(val, key, index) {
            var _is = fn.call(null, res, val, key, index);
            return _is !== undefined ? _is : true
        });
        return res
    }

    function isString(str) {
        return typeof str === 'string';
    }

    function split(str, s) {
        if (!str || !isString(str)) return [];
        return str.split(s)
    }


    var debounce = (fn, delay) => {
        let __present = true;
        let __arguments;

        return function() {
            __arguments = arguments;

            if (__present) {
                __present = false;
                setTimeout(function() {
                    fn.apply(null, __arguments);
                    __present = true;
                }, delay || 0);
            }
        }
    };

    function isObject(obj) {
        return obj ? typeof obj === 'object' && !('length' in obj) : false
    }

    function isArray(arr) {
        return typeof arr === 'object' && 'length' in arr
    }


    function hasStr(a, b) {
        return a.indexOf(b) !== -1
    }

    function get(target, path) {
        if (!target) return target;
        var _t = target,
            _p = String(path).split('.');

        for (var i = 0; i < _p.length; i++) {
            _t = _t[_p[i]];
            if (_t === undefined) break;
        }

        return _t;
    }


    function isNumeric(val) {
        var valType = typeof val;
        return valType === 'number' || (valType !== 'object' && valType !== 'boolean' && Number(val) >= 0);
    }

    function getEl(el, slt) {
        var __slt = slt ? slt : el;
        var __el = slt ? el : document;
        return __el.querySelector(__slt)
    }

    function setAttr(el, attrName, value) {
        el && el.setAttribute(attrName, value);
        return el
    }


    function _handleClass(el, className, type) {
        if (el && className) {
            if (typeof className === 'string' && className.indexOf(' ') > -1) {
                className = className.split(' ');
            }

            var handle = function(elm) {
                if (typeof className === 'string') {
                    elm.classList[type](className);
                } else {
                    var i,
                        n;
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


    function addClass(el, className) {
        return _handleClass(el, className, 'add');
    }

    function removeClass(el, className) {
        return _handleClass(el, className, 'remove');
    }


    function hasClass(el, className) {
        return (el.className || '').split(' ').indexOf(className) > -1;
    }


    function getParent(el) {
        return el && el.parentNode
    }

    function toggleClass(el, className) {
        return _handleClass(el, className, 'toggle');
    }

    function getElAll(el, slt) {
        var __slt = slt ? slt : el;
        var __el = slt ? el : document;
        return __el.querySelectorAll(__slt)
    }

    function getAttr(el, attrName) {
        return el ? el.getAttribute(attrName) : el
    }


    function getWidth(el, inner) {
        return el ? (inner ? el.clientWidth : el.offsetWidth) : el
    }


    function getHeight(el, inner) {
        return el ? (inner ? el.clientHeight : el.offsetHeight) : el
    }


    function mapParents(el, fn) {
        while (el && getParent(el) && fn) {
            el = getParent(el);
            var _a = fn(el);
            if (_a === false) break;
        }
    }


    function getParents(el, slt) {
        var res = [];

        mapParents(el, function(p) {
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


    function getSiblings(el) {
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

    function getTarget(event) {
        return event.target || event.srcElement;
    }


    function addHandler(element, type, sltorOrHandler, handler) {
        var __sltor = handler ? sltorOrHandler : null;
        var __handler = handler || sltorOrHandler;
        var __wrapper = __sltor && typeof __sltor === 'string' ? getParent(getEl(element, __sltor)) : null;

        function eventFn(e) {
            var stop = null;
            var target = getTarget(e);
            var execute = target === element;
            var t = null;

            if (__sltor) {
                if (typeof __sltor === 'string') {
                    if (!getEl(target, __sltor)) {
                        if (target !== element) {
                            var include = function(children, el) {
                                var _include = false;

                                for (var i = 0; i < children.length; i++) {
                                    if (children[i] === el) {
                                        _include = true;
                                        break;
                                    }
                                }

                                return _include
                            };

                            mapParents(target, function(ele) {
                                if (__wrapper === ele) return false;

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
                    if (typeof __sltor === 'function')
                        execute = __sltor(e);
                    else
                        execute = e.target === __sltor;
                }
            }

            if (__sltor ? execute : true)
                stop = __handler.call(this, e, t || target);

            if (stop === false) return false;
        }

        if (element.addEventListener) {
            element.addEventListener(type, eventFn, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, eventFn);
        } else {
            element["on" + type] = eventFn;
        }
    }

    function stopPropagation(event) {
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

    function _on(type, target, fn, onceEvent, offEvent, offFilter) {
        if (!fn) return 'Bus event function is none!';

        if (offEvent) {
            if (offFilter) {
                let fn2 = function() {
                    if (offFilter.apply(null, arguments)) {
                        off(type, fn);
                        off(offEvent, fn2);
                    }
                };
                on$1(offEvent, fn2);
            } else {
                once(offEvent, () => {
                    off(type, fn);
                });
            }
        }

        let evs = events$1[type] || [];
        for (let index = evs.length - 1; index > -1; index--) {
            let e = evs[index];
            if (fn === e) evs.splice(index, 1);
        }

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

    function off(type, fnOrName) {
        let evs = events$1[type] || [];
        if (!fnOrName)
            delete events$1[type];
        else
            for (let index = evs.length - 1; index > -1; index--) {
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



    var pms = window['__DR_PMS__'] = {
        idx: 1,
        pageTrans: null,
        scrollTarget: 'window',
        pageLoadingHtml: 'Loading',
        loadingHtml: 'Loading',
        loadingClass: '',
        loadingShade: 'rgba(255,255,255,1)',
        fill: emptyFun,
        cache: false,
        elms: {},
        root: {
            __isPms__: 1,
            __isRoot__: 1
        },
    };

    var isWindowScroll = () => pms.scrollTarget === 'window';

    let bodyEl = null;

    var bodyEl$1 = () => bodyEl = bodyEl || getEl('body');

    var windowEventHandler = (type, handler, options) => {
        type === 'scroll' && !isWindowScroll() ? addHandler(bodyEl$1(), 'scroll', handler) : window.addEventListener(type, handler, options);
    };


    var clearSpace = str => str ? str.replace(/(\r|\n|\s*|&nbsp;)/g, '') : str;

    var resolveClassLut = lut => {
        if (!lut) return null;

        let classLut = [],
            tasks = [];

        let _lut_arr = split(clearSpace(lut), ',');
        for (let cur, i = _lut_arr.length - 1; i >= 0; i--) {
            cur = _lut_arr[i];

            if (isNumeric(cur[0])) classLut.push(_lut_arr[i -= 1] + ',' + cur);
            else classLut.push(cur);
        }

        each(classLut, v => {
            let targetLut,
                target,
                classTasks = [],
                classExp;
            targetLut = split(v, '|');

            target = targetLut[1] ? targetLut[0] : 'self';

            classExp = targetLut[1] || targetLut[0];

            if (classExp) {
                let name,
                    type,
                    methods = ['add', 'remove', 'toggle'];
                each(split(classExp, '&'), l => {
                    name = split(l, '.');

                    if (methods.includes(name[0])) {
                        type = name[0];
                        name.splice(0, 1);
                    }
                    else
                        type = 'toggle';

                    classTasks.push({
                        name,
                        type
                    });
                });
            }

            tasks.push({
                class: classTasks,
                target: target
            });
        });

        return tasks
    };

    var isBool = str => /^(null|true|false|NaN)$/.test(str);

    var isStrFlag = w => w === '"' || w === "'";

    let isNumOne$1 = str => !!Number(str);

    var expSplit = (exp, flag) => {
        let isStr = false,
            spt = null;
        let isNum = false;
        let word = '';
        let exs = [];
        let __exp = clearSpace(exp);

        each(__exp, w => {
            let w_isNum = isNumOne$1(w);

            if (w_isNum)
                isNum = true;
            if (!w_isNum && w !== '.')
                isNum = false;

            if (isStrFlag(w)) {
                if (!isStr) {
                    isStr = true;
                    spt = w;
                } else if (spt === w) {
                    isStr = false;
                    spt = null;
                }
            }

            if (w === flag && !isStr && !isNum) {
                exs.push(word);
                word = '';
            } else
                word += w;
        });

        if (word) exs.push(word);

        return exs
    };


    var resolveHandlerExp = (exp, ext) => {
        if (!exp) return [];
        let handler_arr = expSplit(exp, '.');
        let handlers = transform(handler_arr, (res, val) => {
            if (val[0] !== '(' && val[val.length - 1] === ')') {
                res.push({
                    exp: val,
                    ctx: {}
                });
            }
        }, []);

        if (ext) handlers.push({
                exp: ext,
                ctx: {}
            });

        return handlers
    };


    var getDrEl = (name, el) => {
        let __slt = '[data-dr-' + name + ']';
        return el ? getElAll(el, __slt) : getElAll(__slt)
    };


    var drEmit = (eventName, target, prop, scopeEl, orgEvent) => {
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
        return {
            t: body.scrollTop,
            l: body.scrollLeft,
            w: body.scrollWidth,
            h: body.scrollHeight
        }
    };

    var getBoxClient = el => el && el.getBoundingClientRect();

    var getClientSize = () => {
        let dom = document;
        return {
            h: dom.documentElement.clientHeight || dom.body.clientHeight,
            w: dom.documentElement.clientWidth || dom.body.clientWidth,
        }
    };


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



    var events = window['__DR_EVENTS__'] = {
        idx: 1,
    };

    var runClass = (tasks, selfEl) => {
        each(tasks, task => {
            let target = task.target;
            let isLimit = hasStr(target, '{');
            let limit_index_lst = split(get((/\{(.*)\}/).exec(target), 1), ',');
            let targetSlt = isLimit ? split(target, '{')[0] : target;
            let targetEls = targetSlt === 'self' ? (('length' in selfEl) ? selfEl : [selfEl]) : getElAll(targetSlt);

            each(task.class, item => {
                let type = item.type;
                let name = item.name;

                let ship_className = targetEl => {
                    if (type === 'toggle') {
                        each(name, n => hasClass(targetEl, n) ? removeClass(targetEl, n) : addClass(targetEl, n));
                    } else if (type === 'add') {
                        addClass(targetEl, name);
                        drEmit('onAdd', targetEl, name, targetEl);
                    } else if (type === 'remove') {
                        removeClass(targetEl, name);
                        drEmit('onRemove', targetEl, name, targetEl);
                    }

                    drEmit('onChange', targetEl, {
                        type: type,
                        className: name
                    }, targetEl);
                };

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

    let isNumOne = str => !!Number(str);

    var parseExp = exp => {
        let isStr = false,
            spt = null;
        let isContinue = false;
        let isNum = false;
        let word = '';
        let exs = [[]],
            exsIndex = 0;
        let __exp = clearSpace(exp);

        each(__exp, (w, i) => {
            if (isContinue) {
                isContinue = false;
                return true;
            }

            if (i < 1 && w === '(') return true;
            if (w === ')' && !noUndefined(__exp[i + 1])) return false;

            if (!isStr && !isNum && w === ')' && __exp[i + 1] === '(') {
                if (word) exs[exsIndex].push(word);

                word = '';
                exs.push([]);
                exsIndex += 1;
                isContinue = true;
                return true;
            }


            let w_isNum = isNumOne(w);

            if (w_isNum)
                isNum = true;
            if (!w_isNum && w !== '.')
                isNum = false;

            if (isStrFlag(w)) {
                if (!isStr) {
                    isStr = true;
                    spt = w;
                } else if (spt === w) {
                    isStr = false;
                    spt = null;
                }
            }

            if (w === ',' && !isStr && !isNum) {
                exs[exsIndex].push(word);
                word = '';
            } else
                word += w;
        });

        if (word) exs[exsIndex].push(word);

        return exs
    };


    var script = (exp, el, e, next, pipe, ctx, handlerState, widget, handle) => {
        if (!exp || !isString(exp)) return;
        let __exp = clearSpace(exp);

        let fnName = split(__exp, '(')[0];

        if (fnName) {
            let parseParams = parseExp(__exp.slice(fnName.length));

            let argsCollection = [],
                args;
            each(parseParams, fnPms => {
                args = [];

                each(fnPms, word => {
                    let __pm = word;
                    let __pmNum = Number(word);

                    if (isBool(word))
                        __pm = makeValue(word);
                    else if (__pmNum === 0 || __pmNum)
                        __pm = __pmNum;
                    else {
                        if (isStrFlag(word[0]))
                            __pm = word.substring(1, word.length - 1);
                        else
                            __pm = getPms(el, word, e, next, pipe, ctx, handlerState, widget);
                    }

                    args.push(__pm);
                });

                argsCollection.push(args);
            });

            let pro = draftHandler.pro[widget],
                __draftHandler = pro && pro[fnName] ? pro : draftHandler;

            if (fnName === window) return window;
            if (!__draftHandler[fnName]) return;
            let res = (new Function('d,n,el,e,p,c,s,h', 'return d.' + fnName + '(n,el,e,p,c,s,h)'))(__draftHandler, next || emptyFun, el, e, pipe || emptyFun, ctx || {}, handlerState || {}, handle).apply(__draftHandler, argsCollection[0]);
            return (isFunction(res) && argsCollection[1]) ? res.apply(null, argsCollection[1]) : res;
        }
    };


    let runHandler = (handler, nextTask, el, e, pipeFn, ctx, widget, handleFn) => {
        let handlerExp = handler.exp;
        let handlerExp_split = split(handlerExp, '(');
        let handler_name = handlerExp_split[0];

        let __exp_script = handlerExp_split[1] ? handlerExp : (handlerExp + '()');
        return script(__exp_script, el, e, nextTask, pipeFn(handler_name), ctx, handler.ctx, widget, handleFn);
    };


    var runHandlers = (handlers, el, e, complete, pipeFn, ctx, widget, handleFn, startIndex) => {
        try {
            let __startIndex = startIndex || 0,
                curTask = handlers[__startIndex],
                eventUnbind = ctx.eventUnbind,
                unbindLen;

            if (curTask) {
                let nextTask = (sonElm, nextTaskComplete) => {
                    if (sonElm === false) ctx.destroy(startIndex);
                    else {
                        unbindLen = eventUnbind.length;
                        runHandlers(handlers, sonElm || el, e, el => (nextTaskComplete && nextTaskComplete(), complete && complete(el)), pipeFn, ctx, widget, handleFn, __startIndex + 1);
                        if (unbindLen === eventUnbind.length) ctx.unbind(emptyFun);
                    }
                };
                runHandler(curTask, nextTask, el, e, pipeFn, ctx, widget, handleFn);
            } else {
                ctx.end && ctx.end() !== false && (ctx.end = null);
                complete && complete(el);
            }
        } catch (err) {
            console.warn(err);
        }
    };

    var setWritable = (obj, key, value) => Object.defineProperty(obj, key, {
        writable: false,
        value
    });

    var valOk = (val, assert) => assert ? !assert.includes(val) : noUndefined(val);

    let pipeFn = pipe => handlerName => (key, state) => {
        if (valOk(state)) {
            let sta = pipe[handlerName] = pipe[handlerName] || [];

            if (key)
                pipe[key] = state;
            else sta.push(state);

            return state
        } else if (key) return pipe[key];
        else return pipe
    };

    let handleFn = handles => source => function(name) {
        handles[name] = source;
        window.__DR_HANDLES = window.__DR_HANDLES || {};
        window.__DR_HANDLES[name] = source;
    };



    var runTask = (e, el, task, pipeIn) => {
        if (e && task)
            e.eIndex = task.eIndex;

        index.emit('taskReset', el);

        let handlers = task.handlers || [],
            pipe = pipeIn || task.pipe || {},
            eventUnbind = [],
            handles = el.__DR_HANDLES = el.__DR_HANDLES || {};

        let __pms = resolvePms(el);

        let ctx = {
            pms: __pms,
            scope: task.scope,
            handles,
            unbind(fn) {
                eventUnbind.push(fn);
            },
            destroy(index) {
                eventUnbind.forEach((fn, i) => i > index ? fn() : '');
            },
            destroyAll() {
                eventUnbind.forEach(fn => fn());
            }
        };
        setWritable(ctx, 'eventUnbind', eventUnbind);
        setWritable(ctx, 'el', el);
        setWritable(ctx, 'pipe', pipe);
        setWritable(ctx, 'calc', {});

        runHandlers(handlers, el, e, null, pipeFn(pipe), ctx, task.widget, handleFn(handles));

    };

    var valEq = (v1, v2, assert) => {
        let res = (v1 === v2) || (isNumeric(v1) && isNumeric(v2) && (Number(v1) === Number(v2)));
        return valOk(assert) ? assert === res : res;
    };


    var resolveCalcExp = (el, expIn) => {
        let expList = el.__DR_CALC_EXP__;

        if (!expList) {
            expList = el.__DR_CALC_EXP__ = {};

            let __one,
                __once,
                __fnExpList,
                __key,
                __exp = expSplit(expIn || getAttr(el, 'data-dr-calc'), ';');
            each(__exp, one => {
                __one = expSplit(one, '?');
                __once = __one[1] === 'once';

                __one = expSplit(__one[0], ':');
                __key = __one[0];
                __fnExpList = expSplit(__one[1], '.');

                expList[__key] = expList[__key] || {
                    once: __once,
                    list: []
                };

                each(__fnExpList, fnExp => {
                    expList[__key].list.push(fnExp);
                });
            });
        }

        return expList
    };


    var getCalcValue = (pm, el, e, next, pipe, ctx, handlerState, widget) => {
        if (!ctx || !ctx.calc) return null;

        let res = ctx.calc[pm];
        if (noUndefined(res)) return res;

        let expList = resolveCalcExp(ctx.el);

        let value,
            exp = expList[pm] || {};
        pipe('result', null);
        each(exp.list, fnExp => {
            value = script(fnExp, el, e, next, pipe, ctx, handlerState, widget);
            pipe('result', value);
        });

        if (exp.once)
            ctx.calc[pm] = value;

        return value
    };

    var isElPm = pm => (['index', 'value', 'prop']).includes(pm);

    var isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) || (getClientSize().w < 768);


    var getPms = (el, pm, e, next, pipe, ctx, handlerState, widget) => {
        if (!el || !pm) return;
        if (pm === 'window') return window;
        if (pm === 'isMobile') return isMobile;
        if (pm === 'el') return el;

        let __pmVal,
            __el = isString(el) ? getEl(el) : el;

        __pmVal = pipe && pipe(pm);

        if (!valOk(__pmVal)) {
            __pmVal = (el.__DR_WIDGET_PROPS || {})[pm];
        }

        let pms_get = __pms => {
            if (!__pms) return;
            let __pmVal__ = __pms[pm];

            if (!valOk(__pmVal__) && isElPm(pm)) {
                __pmVal__ = draftHandler[pm](next || emptyFun, __el, e, pipe)();
            }

            return __pmVal__
        };

        if (!valOk(__pmVal)) {
            let __pms = resolvePms(__el),
                __pmVal__ = pms_get(__pms);

            if (valOk(__pmVal__)) {
                if (isFunction(__pmVal__)) {
                    let __ctx = {
                        pipe: ctx.pipe,
                        pms: __pms
                    };
                    __ctx.prop = draftHandler.prop(next, __el);
                    __ctx.index = draftHandler.index(next, __el, e, pipe);
                    __pmVal = __pmVal__(__ctx, __el, e);
                } else
                    __pmVal = __pmVal__;
            }
        }

        if (!valOk(__pmVal))
            __pmVal = getCalcValue(pm, el, e, next, pipe, ctx, handlerState, widget);

        return valOk(__pmVal) ? __pmVal : pms_get(pms.root);
    };

    var hasOwnKey = (obj, name) => obj.hasOwnProperty(name);

    var setPms = (el, name, val, e, pipe, ctx) => {
        let __el = isString(el) ? getEl(el) : el;
        let __pms = resolvePms(__el);

        if (name === 'prop') return;

        if (isElPm(name)) draftHandler[name](emptyFun, __el, e)(val);

        if (!valEq(getPms(el, name, e, null, pipe, ctx), val)) {
            let __ok = false;

            if (hasOwnKey(__pms, name)) {
                __pms[name] = val;
                __ok = true;
            } else {
                let next = __pms.__proto__;
                do {
                    if (next && (hasOwnKey(next, name) || get(next, '__isRoot__'))) {
                        next[name] = val;
                        __ok = true;
                        break;
                    }
                    else
                        next = next.__proto__;
                } while (next);
            }

            if (!__ok) {
                __pms = pms.root;
                __pms[name] = val;
                __ok = true;
            }

            __ok && index.emit('pmsChange', {
                el: el,
                by: __pms,
                key: name,
                value: val
            });
        }
    };

    var hasAttrName = (el, name) => !!el.attributes[name];

    var addPmsAttr = elm => {
        if (!hasAttrName(elm, 'data-dr-pms')) setAttr(elm, 'data-dr-pms', '');
        return elm
    };

    var emptyVal = [undefined, null, '', false, NaN];

    var getChildren = elem => {
        let res = [];

        for (let i = 0, e; e = elem.childNodes[i++];) {
            if (e.nodeType === 1) res.push(e);
        }

        return res;
    };


    var getScopeEls = (scope, el) => {
        let scopeEl = scope;

        if (isString(scope)) {
            let __scopeEl,
                isScope = elm => getAttr(elm, 'data-dr') === scope;

            if (isScope(el))
                __scopeEl = el;
            else mapParents(el, p => {
                    if (p && p.nodeType === 1 && isScope(p)) {
                        __scopeEl = p;
                        return false
                    }
                });

            scopeEl = __scopeEl || getElAll('[data-dr=' + scope + ']');
        }

        return scopeEl || null
    };

    var clientWidth = () => document.documentElement.clientWidth || document.body.clientWidth;

    var clientHeight = () => document.documentElement.clientHeight || document.body.clientHeight;


    var removeHandler = (el, type, handler) => el.removeEventListener(type, handler, false);

    var checkScope = (eName, curEl, task_scope, e_scopeEl, e_target) => {
        let __DR_WIDGET_EVENTS,
            allow = true,
            __scopeEl = e_scopeEl,
            __scope = task_scope;

        if (typeof e_target === 'function') return e_target(curEl, task_scope);

        if (__scopeEl) {
            allow = __scopeEl === curEl || e_scopeEl === e_target || contains(__scopeEl, curEl);

            if (!allow && __scopeEl.length) {
                each(__scopeEl, one => {
                    if (contains(one, curEl)) {
                        allow = true;
                        __DR_WIDGET_EVENTS = one.__DR_WIDGET_EVENTS;
                        if (__DR_WIDGET_EVENTS)
                            allow = __DR_WIDGET_EVENTS.includes(eName);
                        return false
                    }
                });
            }
        } else if (__scope) {
            allow = __scope === e_target || contains(__scope, e_target);
        }

        return allow
    };

    var isElmNode = el => el && el.nodeType === 1;


    var draElMap = (shipFn, name, elms) => {
        let elements = elms || getDrEl(name);
        each(elements, el => {
            if (isElmNode(el)) {
                if (name === 'pms' || !pms[el.pmsid]) resolvePms(el);
                if (name !== 'pms') shipFn(getAttr(el, 'data-dr-' + name), el);
            }
        });
    };

    var widgets = {};


    var setWidgetPms = (name, paramStr, scopeEl, props, events) => {
        let __pms = (paramStr || ')').replace(')', '');

        let pms = {},
            __pms__ = __pms ? (new Function('return ' + __pms))() : {};
        each(props, (val, key) => {
            pms[key] = noUndefined(__pms__[key]) ? __pms__[key] : val;
        });

        each(getElAll(scopeEl, '[data-dr-on]'), elm => {
            elm.__DR_WIDGET_PROPS = pms;
            elm.__DR_WIDGET_EVENTS = events;
        });

        scopeEl.__DR_WIDGET_PROPS = pms;
        scopeEl.__DR_WIDGET_EVENTS = events;
        setAttr(scopeEl, 'data-dr', name);
    };

    function join(arr, joinStr) {
        return (arr || []).join(joinStr)
    }


    function __ship(task, name, scopeEl, widgetName) {
        let elms = name;
        if (isString(name)) {
            if (scopeEl)
                elms = name === '__root' ? [scopeEl] : (getElAll(scopeEl, '[data-dr=' + name + ']') || getElAll(scopeEl, name));
            else
                elms = getElAll('[data-dr=' + name + ']') || getElAll(name);
        }

        let __task = isString(task) || isArray(task) ? {
            on: task
        } : (isObject(task) ? task : null);

        if (__task) {
            let on = __task.on;
            let scope = __task.sc;
            let pms = __task.pm;
            let calc = __task.ca;


            each(elms, elm => {
                elm.__DR_WIDGET_PROPS = scopeEl.__DR_WIDGET_PROPS;

                scope && setAttr(elm, 'data-dr', scope);
                calc && setAttr(elm, 'data-dr-calc', calc);
                if (pms) {
                    let __pms = getAttr(elm, 'data-dr-pms');
                    setAttr(elm, 'data-dr-pms', (__pms ? (__pms + ';') : '') + (isString(pms) ? pms : join(pms, ';')));
                }

                on && dispatch(isString(on) ? on : join(on, ';'), elm, scopeEl, widgetName);
            });
        }
    }


    function ship(name, task, scopeEl, widgetName) {
        if (isObject(name)) {
            each(name, (t, n) => __ship(t, n, scopeEl, widgetName));

        }
        else __ship(task, name, scopeEl, widgetName);
    }


    var widget = (attr, el) => {
        let widgetAttr = (getAttr(el, 'data-dr-widget') || attr);
        if (!widgetAttr) return;

        let widgetArr = widgetAttr.split('('),
            name = widgetArr[0],
            options = widgets[name],
            props = options.props,
            events = options.events,
            setup = options.setup,
            __setup_is_function = isFunction(setup);

        draftHandler.pro[name] = options.handlers || {};

        let rootTask = setup.root,
            sonTask = setup.children || {};
        if (rootTask)
            sonTask.__root = rootTask;

        setWidgetPms(name, widgetArr[1], el, props, events);

        if (__setup_is_function) options.setup(el.__DR_WIDGET_PROPS, el, name => getEl(el, '[data-dr=' + name + ']'));
        else ship(sonTask, null, el, name);
    };


    var concat = (arr1, arr2) => transform(arr2, (res, item) => {
        res.push(item);
    }, arr1);


    var setup = el => {
        if (el) {
            if (isElmNode(el)) {
                let __org = [el];

                draElMap(dispatch, 'on', concat(__org, getDrEl('on', el) || []));
                draElMap(widget, 'widget', concat(__org, getDrEl('widget', el) || []));
            }
        } else {
            draElMap(dispatch, 'on');
            draElMap(widget, 'widget');
        }
    };

    var append = (wrapper, el) => wrapper.appendChild(el);

    var insertBefore = (el, son, inner) => {
        if (el && son) {
            let _children = el.firstChild;
            let _el = inner ? _children : el;
            if (!_children) append(el, son);
            else _el.parentNode.insertBefore(son, _el);
        }
    };

    var insertAfter = (el, son, inner) => {
        if (el && son) {
            if (inner) append(el, son);
            else el.parentNode.insertBefore(son, el.nextSibling);
        }

        return el;
    };


    var ajax = (type, url, data, callback, stateChangeCallback) => {
        let xhr = new XMLHttpRequest(),
            isPOST = type.toLocaleUpperCase() === 'POST';

        xhr.open(type, url, false);

        if (isPOST) {
            xhr.setRequestHeader("Content-type", "application/json");
        }

        xhr.onreadystatechange = () => {
            stateChangeCallback && stateChangeCallback(xhr.readyState, xhr);

            if (valEq(xhr.readyState, 4)) {
                callback && callback({
                    success: valEq(xhr.status, 200),
                    data: isPOST ? JSON.parse(xhr.responseText) : xhr.responseText,
                    code: xhr.status
                });
            }
        };

        xhr.send(data ? JSON.stringify(data) : null);
    };

    var init = {
        inited: false,
        onload: []
    };



    const getEName = eventName => '__DR_EVENT_' + eventName;

    function run(removeHandler, handlers, e) {
        let i,
            cur;
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
        handler.once = once;
        el[eName].push(handler);
    }

    function removeEvent(el, eventName, handler) {
        let eName = getEName(eventName);
        if (!handler) el[eName].splice(0, el[eName].length);
        else run(handler, el[eName]);
    }

    let url = new URL(location);

    let isParentPms = (curPid, pid) => {
        var res = false;

        var parent = get(pms[curPid], '__proto__');
        while (parent) {
            if (parent.__pmsid__ === pid) {
                res = true;
                break;
            } else
                parent = parent.__proto__;
        }

        return res
    };

    let getElBy = (slt, parent, all) => isString(slt) ? (parent ? getEl(parent, slt) : getEl(slt)) : slt;

    let shipEvents = (evs, fn) => each(split(evs, '|'), eventName => eventName && index.on(eventName, fn));

    let trimClassName = className => split(className || '', '|').join(' ');

    let getScopeNear = (el, slt) => {
        let __ScopeEl = el,
            p;

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

    let assertFn = (assert, next, no, el, prop, e) => {
        if (assert) next();
        else no && drEmit(no, el, prop, el, __getOrgEvent(e));
    };

    let unbind = (ctx, el, type, fn) => ctx.unbind(() => removeHandler(el, type, fn));

    let addAnimateClassName = (el, animateClassName, cb) => {
        addClass(el, animateClassName);
        addEvent(el, 'animationend', () => {
            removeClass(el, animateClassName);
            cb && cb();
        }, 1);
    };

    let getSon = (el, slt) => {
        el.son = el.son || {};

        let son_key = slt || 'default',
            son = el.son[son_key];
        if (!son) {
            son = slt ? getElAll(el, slt) : el.children;
            el.son[son_key] = son;
        }

        return son
    };

    let toPage = (url, paramKeyOrLst, paramValue) => location.href = url + (paramValue ? ('?' + paramKeyOrLst + '=' + paramValue) : paramKeyOrLst);

    let pageLoading = (next, ctx) => mode => {
        if (window.__DR_LOADING__) {
            next();
            return;
        }

        let body = bodyEl$1(),
            div = window.__DR_LOADING__ = document.createElement('div'),
            style = div.style;
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

        let __unloading = e => {
            window.__DR_LOADING__ = null;
            body.removeChild(div);
            index.off('unloading', __unloading);
        };
        index.on('unloading', __unloading);
        ctx && ctx.unbind(() => index.off(__unloading));

        next();
    };

    function cache(next, el, name, value) {
        el.__DR_CACHE = el.__DR_CACHE || {};
        if (noUndefined(value)) {
            el.__DR_CACHE[name] = value;
            next && next();
        } else return el.__DR_CACHE[name]
    }

    let easingLut = ['linear', 'ease', 'easeIn', 'easeOut'];


    let toggleEvent = (el, eventName) => {
        let __toggle = get(el, '__DR_PMS__._EVENT_TOGGLE') || {
            fns: {},
            sta: {}
        };
        if (__toggle.fns[eventName]) {
            if (__toggle.prev === eventName) return false;

            __toggle.fns[eventName]();
        }
    };

    let __getOrgEvent = e => e ? e.orgEvent || null : null;

    let __emit = (next, el, e) => (eventName, prop, scope, repeat /*忽略交替事件声明而强制重复执行*/ ) => {
        if (!repeat) {
            if (toggleEvent(el, eventName) === false) {
                return;
            }
        }

        drEmit(eventName, el, prop, getScopeEls(scope, el), __getOrgEvent(e));
        next();
    };

    let __toggleClass = (next, el, e) => (className1, className2) => {
        let __className = trimClassName(className1);

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


    index.on('loading', e => pageLoading(emptyFun)(e.prop));

    let draftHandler = {
        _: (next, el) => exp => (runClass(resolveClassLut(exp), el), next()),
        emit: __emit,
        e: __emit,
        d: (next, el, e, pipe, ctx) => (eName1, eName2) => {
            if (!el.__DR_PMS__) {
                el.__DR_PMS__ = {};
                el.__DR_PMS__.__proto__ = pms.root;
            }

            let __toggle = el.__DR_PMS__._EVENT_TOGGLE = el.__DR_PMS__._EVENT_TOGGLE || {
                prev: null,
                fns: {},
                sta: {}
            };
            __toggle.sta[eName1] = 0;
            __toggle.sta[eName2] = 1;

            __toggle.fns[eName1] = () => {
                __toggle.prev = eName1;
                __toggle.sta[eName1] = 1;
                __toggle.sta[eName2] = 0;
            };
            __toggle.fns[eName2] = () => {
                __toggle.prev = eName2;
                __toggle.sta[eName1] = 0;
                __toggle.sta[eName2] = 1;
            };

            next();
        },
        emitNear: (next, el, e) => (slt, eventName, prop, repeat) => {
            if (!repeat) {
                if (toggleEvent(el, eventName) === false) {
                    return;
                }
            }

            drEmit(eventName, el, prop, getScopeNear(el, slt), __getOrgEvent(e));
            next();
        },
        toggleEmit: (next, el, e) => (eventName, prop, scope /*near为true时，scope为元素选择器*/ , near /*发送给附近的元素*/ ) => {
            let __eventNames = split(eventName, ',');

            if (__eventNames.length > 1) {
                let __one = __eventNames[0],
                    __two = __eventNames[1],
                    __toggle = get(el, '__DR_PMS__._EVENT_TOGGLE') || {
                        fns: {},
                        sta: {}
                    },
                    __scope = near ? getScopeNear(el, scope) : getScopeEls(scope, el);

                if (__toggle.prev === __one) {
                    if (!__toggle.sta[__two]) {
                        e.eIndex = 0;
                        __toggle.fns[__two]();
                        drEmit(__two, el, prop, __scope, __getOrgEvent(e));
                        next();
                    }
                } else {
                    if (!__toggle.sta[__one]) {
                        e.eIndex = 1;
                        __toggle.fns[__one]();
                        drEmit(__one, el, prop, __scope, __getOrgEvent(e));
                        next();
                    }
                }
            } else console.warn(el, 'Handler "toggleEmit" param1 error!');
        },
        after: (next, el, e, pipe, ctx) => (eventName, prop, scope) => {
            if (!ctx.end)
                ctx.end = () => drEmit(eventName, el, prop, getScopeEls(scope, el), __getOrgEvent(e));
            next();
        },
        log(next, el, e, pipe) {
            return function() {
                if (arguments.length) {
                    let res = [];

                    each(arguments, v => {
                        res.push(v);
                    });

                    console.log(res.join(','));
                }
                else console.log(pipe());

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
        },
        scrollTo: (next, el, e) => (topOffset, slt) => {
            let target = slt ? getEl(slt) : el;
            let run = () => {
                window.scrollTo({
                    top: target.offsetTop - topOffset,
                    behavior: 'smooth'
                });
            };
            if (target) {
                if (!init.inited) init.onload.push(run);
                else run();
            }

            next();
        },
        point: (next, el) => id => {
            let __id = id;

            if (!id && !getAttr(el, 'id')) {
                __id = 'point' + pms.idx++;
                setAttr(el, 'id', __id);
            }

            location.hash = '#' + __id;
            next();
        },
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
        },
        load: (next, el, e) => () => {
            if (el.tagName === 'IMG')
                el.onload = () => next();
            else windowEventHandler('load', () => next());
        },
        loadImgAll: (next, el) => slt => {
            let imgNodes = getElAll(el, slt || 'img');
            Promise.all(
                each(imgNodes, node => {
                    new Promise(resolve => {
                        node.addEventListener('load', () => resolve(node));
                    });
                })
            ).then(() => next());
        },
        loading: (next, el, e, pipe, ctx) => (unloadingEventName /*接受一个loading删除事件*/ , wrapperWidth, wrapperHeight) => {
            let pEl = getParent(el),
                div = document.createElement('div'),
                style = div.style;
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

            let __unloading = e => {
                if (checkScope(unloadingEventName, el, null, e.scopeEl, e.target)) {
                    el.removeChild(div);
                    index.off(unloadingEventName, __unloading);
                }
            };
            index.on(unloadingEventName, __unloading);
            ctx.unbind(() => index.off(__unloading));

            next();
        },
        pageLoading,
        back: (next, el) => assert => setTimeout(() => history.back()),
        forward: (next, el) => assert => setTimeout(() => history.forward()),
        at: (next, el, e, pipe, ctx) => (baseSlt, by, debounceTime) => {

            let isWindow = baseSlt === window;
            let baseEl = isWindow ? baseSlt : getEl(baseSlt);
            if (baseEl) {
                let computeLiving = () => {
                    let box1 = getBoxClient(el);
                    let box2 = isWindow ? {
                        top: 0,
                        bottom: getClientSize().h
                    } : getBoxClient(baseEl);

                    return (box1.bottom <= box2.top) ? 'top' : (box1.top >= box2.bottom ? 'bottom' : 'inner');
                };

                let run = debounce(() => {
                    let living = computeLiving();

                    if (el.__DR_prevLiving !== living) {
                        el.__DR_prevLiving = living;

                        if (by === living || !by) {
                            pipe('atValue', living);
                            next();
                        }
                        else next(false);
                    }
                }, debounceTime || 0);

                run();

                windowEventHandler("scroll", run, true);
                isWindowScroll() && unbind(ctx, window, "scroll", run);

                if (!init.inited) init.onload.push(run);
            }
        },
        aline: (next, el, e, pipe, ctx) => (y, type, repeat) => {

            if (y) {
                if (type) {
                    let clientSize = getClientSize(),
                        h = clientSize.h,
                        yVal = /%/.test(y) ? h * parseFloat(y) / 100 : h,
                        run = () => {
                            let box = getBoxClient(el),
                                inAline = box.top < yVal && box.bottom > yVal,
                                typeAllow = {
                                    in: inAline,
                                    out: !inAline
                                };

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
        },
        drag: (next, el, e, pipe, ctx) => (position, vwh, endEventName, prop, scope) => {
            let d1 = 0,
                start = 0,
                stop = false;

            let touchmove = e => {
                    if (!stop) {
                        let touch = e.touches[0];
                        if (!start)
                            start = touch.pageY - 1;
                        d1 = Math.abs(touch.pageY - start);

                        if (vwh > d1) {
                            pipe('dragValue', d1);
                            next();
                        } else {
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

            addHandler(el, 'touchmove', touchmove);
            addHandler(el, 'touchend', touchend);
            ctx.unbind(() => {
                removeHandler(el, touchmove, touchmove);
                removeHandler(el, touchend, touchend);
            });
        },
        mouse: (next, el, e, pipe, ctx) => (type, eventName, prop, scope) => {
            let pluginEventClassName = (['in', 'out', 'top-in', 'top-out', 'bottom-in', 'bottom-out', 'left-in', 'left-out', 'right-in', 'right-out']).map(v => 'mouse-' + v);
            let isDOMEvent = ('on' + type) in el;
            let runNext = typeName => {
                eventName && drEmit(eventName, el, prop, getScopeEls(scope, el), __getOrgEvent(e));
                if (!isDOMEvent) {
                    removeClass(el, pluginEventClassName);
                    addClass(el, 'mouse-' + typeName);
                }

                next();

                return false
            };

            if (isDOMEvent) {
                addHandler(el, type, () => runNext());
                return;
            }

            let prevX,
                prevY,
                prevInner,
                allow = true,
                axis,
                tickRun;
            let box,
                inner,
                dT,
                dR,
                dB,
                dL,
                inOut,
                nearX,
                nearY,
                __type,
                __inited = false /*在鼠标进入box后才开始触发各种事件*/ ;
            let run = e => {
                allow = !allow;
                if (allow) {
                    axis = Math.abs(e.clientX - prevX) > Math.abs(e.clientY - prevY) ? 'x' : 'y';
                    prevX = e.clientX;
                    prevY = e.clientY;

                    box = getBoxClient(el);
                    dT = box.top - e.clientY;
                    dB = box.bottom - e.clientY;
                    dL = box.left - e.clientX;
                    dR = box.right - e.clientX;
                    inner = dT < 0 && dB > 0 && dL < 0 && dR > 0;

                    inOut = inner ? 'in' : 'out';
                    nearX = Math.abs(dL) < Math.abs(dR) ? 'left' : 'right';
                    nearY = Math.abs(dT) < Math.abs(dB) ? 'top' : 'bottom';
                    __type = (type === 'in' || type === 'out') ? inOut : ((axis === 'y' ? nearY : nearX) + '-' + inOut);
                    __inited = __inited || inOut === 'in';

                    tickRun = prevInner !== inner;
                    prevInner = inner;

                    if (tickRun && __inited && (!type || type === __type)) runNext(__type);
                }
            };

            addHandler(document, 'mousemove', run);
            unbind(ctx, el, 'mousemove', run);
        },
        delay: (next, el, e, pipe, ctx) => (time, stopEvent, stopMode) => {
            if (el.__DR_DELAY_TIMER) clearTimeout(el.__DR_DELAY_TIMER);

            if (stopEvent && !el.__DR_DELAY_STOP_EVENT) {
                el.__DR_DELAY_STOP_EVENT = 1;

                let is_DOM_Event = ('on' + stopEvent) in el;

                let run = e => {
                    if (checkScope(stopEvent, el, null, e.scopeEl, e.target)) {
                        if (Number(stopMode) === 1 && el.__DR_DELAY_NEXT) {
                            el.__DR_DELAY_NEXT && el.__DR_DELAY_NEXT();
                            el.__DR_DELAY_NEXT = null;
                        } else clearTimeout(el.__DR_DELAY_TIMER);

                        is_DOM_Event ? removeHandler(el, stopEvent, run) : index.off(stopEvent, run);
                    }
                };
                if (is_DOM_Event) {
                    addHandler(el, stopEvent, run);
                    ctx.unbind(() => removeHandler(el, stopEvent, run));
                } else {
                    index.on(stopEvent, run);
                    ctx.unbind(() => index.off(stopEvent, run));
                }
            }

            el.__DR_DELAY_NEXT = next;
            el.__DR_DELAY_TIMER = setTimeout(() => {
                next();
                el.__DR_DELAY_NEXT = null;
            }, time);
        },
        loop: (next, el, e, pipe) => (stepTime, max, stopEvent) => {
            let __max = 0,
                __timer = setInterval(() => {
                    (!max || (max > 0 && max < __max)) ? next() : clearInterval(__timer);
                }, stepTime);

            shipEvents(stopEvent, () => clearInterval(__timer));
        },
        watch: (next, el, e, pipe, ctx) => (name, stopEvent /*取消信号事件,多个则用“|”分隔符*/ ) => {
            if (name === 'value' && el.DR_INPUT_WATCH !== 1 && isFormEl(el)) {
                el.DR_INPUT_WATCH = 1;
                addHandler(el, 'change', () => {
                    setPms(el, name, 'checked' in el ? el.checked : el.value, e);
                });
            }

            let allow = true;
            stopEvent && shipEvents(stopEvent, n => allow = false);

            let run = n => {
                if (allow && n.key === name && (el.pmsid === n.__pmsid__ || isParentPms(el.pmsid, n.__pmsid__))) {
                    next(el);
                    pipe('prop', n.value);
                }
            };

            index.on('pmsChange', run);
            ctx.unbind(() => index.off('pmsChange', run));
        },
        wait: (next, el, e, pipe, ctx) => (eventName /*等待的事件名*/ , stopEvent /*取消信号事件,多个则用“|”分隔符*/ ) => {
            let run = () => next(),
                stopFn = () => index.off(eventName, run);

            stopEvent && shipEvents(stopEvent, stopFn);

            index.on(eventName, run);
            ctx.unbind(stopFn);
        },
        trans: (next, el, e, pipe) => (name, timeOrValue, time, easing) => {
            if (time) {
                if (time)
                    el.style.transitionDuration = time + 'ms';
                if (easingLut[easing])
                    el.style.animationTimingFunction = easingLut[easing];

                addEvent(el, 'transitionend', () => next(), 1);

                let __value_arr = isString(timeOrValue) ? split(timeOrValue, '|') : [timeOrValue];
                each(split(name, '|'), (v, i) => {
                    el.style[v] = __value_arr[i];
                });
            } else {
                if (timeOrValue)
                    el.style.transitionDuration = timeOrValue + 'ms';
                addEvent(el, 'transitionend', () => next(), 1);
                addClass(el, name);
            }
        },
        animate: (next, el, e, pipe) => (className, time, once, sync /*不等待动画完成*/ ) => {
            if (time)
                el.style.animationDuration = time + 'ms';

            if (!once) {
                addEvent(el, 'animationend', () => (removeClass(el, className), sync ? null : next()), 1);
            }

            addClass(el, className);
            sync && next();
        },
        has: (next, el) => className => hasClass(el, className) && next(),
        not: (next, el) => className => !hasClass(el, className) && next(),
        toggle: __toggleClass,
        remove: __removeClass,
        add: __addClass,
        onOff: (next, el) => fadeMode /*渐显渐隐方案*/ => {
            if (el.style.display !== 'none') {
                el.DR_STYLE_DISPLAY = getComputedStyle(el).display;
            }

            if (fadeMode)
                el.style.display === 'none' ? draftHandler.fadeIn(next, el)() : draftHandler.fadeOut(next, el)();
            else {
                el.style.display = el.style.display === 'none' ? el.DR_STYLE_DISPLAY : 'none';
                next();
            }
        },
        show: (next, el) => () => {
            if (!el.DR_STYLE_DISPLAY) {
                el.DR_STYLE_DISPLAY = getComputedStyle(el).display;
                if (el.DR_STYLE_DISPLAY === 'none')
                    el.DR_STYLE_DISPLAY = null;
            }
            el.style.display = el.DR_STYLE_DISPLAY || null;
            next();
        },
        hide: (next, el) => () => {
            el.style.display = 'none';
            next();
        },
        visible: (next, el) => () => {
            el.style.visibility = 'visible';
            next();
        },
        hidden: (next, el) => () => {
            el.style.visibility = 'hidden';
            next();
        },
        fadeIn: (next, el) => () => {
            if (!el.DR_STYLE_DISPLAY) {
                el.DR_STYLE_DISPLAY = getComputedStyle(el).display;
                if (el.DR_STYLE_DISPLAY === 'none')
                    el.DR_STYLE_DISPLAY = null;
            }
            el.style.display = el.DR_STYLE_DISPLAY || null;
            el.style.opacity = 0;
            el.style.transition = 'opacity 0.25s ease-in';
            setTimeout(() => {
                el.style.opacity = 1;
                setTimeout(next, 300);
            });
        },
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
        },
        clone: (next, el) => slt => {
            let __elm = isString(slt) ? getEl(slt) : slt;
            el.appendChild(__elm.cloneNode(true));

            next();
        },
        transfer: (next, el) => (slt /*选择器或节点对象*/ , before /*插到前面*/ ) => {
            let __elm = isString(slt) ? getEl(slt) : slt;

            if (before) insertAfter(__elm, el);
            else append(__elm, el);

            next();
        },
        as: (next, el, e, pipe, ctx) => (className, animateByAdd /*添加时动画样式*/ , animateByRemove /*删除时动画样式*/ ) => {
            if (e.eIndex === 0) {
                addClass(el, trimClassName(className));
                if (animateByAdd) {
                    addClass(el, trimClassName(animateByAdd));
                    addEvent(el, 'animationend', () => {
                        removeClass(el, trimClassName(animateByAdd));
                        next();
                    }, 1);
                } else next();
            } else if (e.eIndex === 1) {
                if (animateByRemove) {
                    addClass(el, trimClassName(animateByRemove));
                    addEvent(el, 'animationend', () => {
                        removeClass(el, trimClassName(animateByRemove));
                        removeClass(el, trimClassName(className));
                        next();
                    }, 1);
                } else {
                    removeClass(el, trimClassName(className));
                    next();
                }
            }
        },
        near: (next, el, e, pipe) => (slt, index /*传递则摘取指定下标的元素*/ , queueMode /*队列模式*/ ) => {
            if (slt) {
                let __elms = get(el.__DR_NEAR, slt) || getElAll(el, slt),
                    p;

                if (__elms || !__elms.length) {
                    mapParents(el, elm => {
                        p = getParent(elm);
                        if (p && p.nodeType === 1) {
                            __elms = getElAll(p, slt);
                            if (__elms.length) return false
                        }
                    });
                }

                if (__elms && __elms.length) {
                    el.__DR_NEAR = el.__DR_NEAR || {};
                    el.__DR_NEAR[slt] = __elms;

                    let idSlt = slt[0] === '#';
                    if (noUndefined(index) || idSlt) next(__elms[idSlt ? 0 : index]);
                    else {
                        let __next = cb => (elm, index) => {
                            pipe('near_current_el', elm);
                            pipe('near_current_index', index);
                            pipe('loopIndex', index + 1);
                            next(elm, cb);
                        };

                        if (queueMode) {
                            let run = index => {
                                __next(() => {
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
        },
        son: (next, el, e, pipe, ctx) => (slt /*null则直接子元素*/ , queueMode /*逐个顺序执行*/ , inv /*只取屏幕完整可见的元素*/ ) => {
            let pipe_son = pipe('son');
            if (typeof slt === 'number') {
                next(pipe_son ? pipe_son[slt] : getChildren(el)[slt]);
                return;
            }

            let son = pipe_son || getSon(el, slt);
            if (!son) return;

            let __son = [];

            if (inv) {
                let __curEl;
                each(son, (elm, index) => {
                    __curEl = getBoxClient(elm);
                    if (__curEl.top > 0 && __curEl.bottom > 0 && __curEl.left > 0 && __curEl.left > 0) {
                        __son.push(index);
                    }
                });
            }
            else
                __son = son;

            pipe('son', __son);
            pipe('son_len', __son.length);
            pipe('son_parent', el);

            each(__son, elm => {
                elm.__DR_WIDGET_PROPS = elm.__DR_WIDGET_PROPS || el.__DR_WIDGET_PROPS;
                addPmsAttr(elm);
            });

            let __next = cb => (elm, index) => {
                pipe('son_current_el', elm);
                pipe('son_current_index', index);
                pipe('loopIndex', index + 1);
                next(elm, cb);
            };

            if (queueMode) {
                let run = index => {
                    __next(() => {
                        let nextIndex = index += 1;
                        __son[nextIndex] && run(nextIndex);
                    })(__son[index], index);
                };
                run(0);
            }
            else each(__son, __next());
        },
        hit: (next, el, e, pipe) => (index, targetSlt, hitClassName, unHitClassName, toggleAnimateClassName) => {
            let son = pipe('son') || {};
            let isHit = index || index === 0 ? String(index) === String(e.prop) : son[e.prop] === el;
            let __hitClassName = trimClassName(hitClassName),
                __unHitClassName = trimClassName(unHitClassName);

            let targetEl = targetSlt ? getEl(el, targetSlt) : el;
            if (isHit) {
                addClass(targetEl, __hitClassName);
                removeClass(targetEl, __unHitClassName);

                if (toggleAnimateClassName) addAnimateClassName(el, toggleAnimateClassName);
            } else {
                addClass(targetEl, __unHitClassName);
                removeClass(targetEl, __hitClassName);
            }

            next();
        },
        isSelf: (next, el, e) => () => e.target === el && next(),
        isMobile: (next, el, e) => (no, prop) => assertFn(isMobile, next, no, el, prop, e),
        hasClass: (next, el, e) => (className, no, prop) => assertFn(hasClass(el, className), next, no, el, prop, e),
        notClass: (next, el, e) => (className, no, prop) => assertFn(!hasClass(el, className), next, no, el, prop),
        hasUrlParam: (next, el, e) => (key, no, prop) => assertFn(url.searchParams.has(key), next, no, el, prop, e),
        isEq: (next, el, e) => (param1, param2, no, prop) => assertFn(valEq(param1, param2), next, no, el, prop, e),
        isNon: (next, el, e) => (param1, param2, no, prop) => assertFn(!valEq(param1, param2), next, no, el, prop, e),
        isGreater: (next, el, e) => (param1, param2, no, prop) => assertFn(param1 > param2, next, no, el, prop, e),
        isLess: (next, el, e) => (param1, param2, no, prop) => assertFn(param1 < param2, next, no, el, prop, e),
        isPass: (next, el, e) => (param1, sign, param2, no, prop) => assertFn((new Function('return ' + param1 + sign + param2))(), next, no, el, prop, e),
        isCache: (next, el, e) => (name, value, no, prop) => assertFn(valEq(cache(next, el, name), value), next, no, el, prop, e),
        isPms: (next, el, e, pipe, ctx) => (name, value, no, prop) => assertFn(valEq(getPms(el, name, e, next, pipe, ctx), value), next, no, el, prop, e),
        is: (next, el, e, pipe) => (assert, no, prop) => assertFn(assert, next, no, el, prop, e),
        href: (next, el) => () => getAttr(el, 'href') || null,
        index: (next, el, e, pipe) => (parent, targetSlt, siblingSlt) => {
            if (!parent && !targetSlt && !siblingSlt) {
                let son = pipe('son'),
                    son_current_index = pipe('son_current_index');
                return son_current_index || son_current_index === 0 ? son_current_index : elIndexOf(son, el);
            }

            let __p = getEl(parent);
            return elIndexOf(siblingSlt ? getElAll(__p, siblingSlt) : get(__p, 'children'), getEl(__p, targetSlt))
        },
        prop: (next, el, e) => () => get(e, 'prop'),
        scope: (next, el, e) => () => get(e, 'scopeEl') || null,

        value: (next, el, e) => value => {
            let __isFormEl = isFormEl(el);
            let __valOk = valOk(value);
            if (__isFormEl) {
                if (__valOk) {
                    if (valOk(value, emptyVal)) {
                        if (__isFormEl === 'checkbox' || __isFormEl === 'radio') {
                            el.checked = value !== 0 && !!value;
                        } else
                            el.value = value;
                    }

                    next();
                }
                else return el.value;
            } else {
                if (__valOk) {
                    el.innerText = value;
                    next();
                }
                else return el.innerText;
            }
        },
        style: (next, el, e, pipe) => (name, value, unitName) => noUndefined(value) ? (el.style[name] = value + (unitName || ''), next()) : el.style[name],
        height: (next, el, e, pipe) => (value, unit) => noUndefined(value) ? (el.style.height = value + (unit || ''), next()) : getComputedStyle(el).height,
        width: (next, el, e, pipe) => (value, unit) => noUndefined(value) ? (el.style.width = value + (unit || ''), next()) : getComputedStyle(el).width,
        attr: (next, el) => (key, value) => noUndefined(value) ? (setAttr(el, key, value), next()) : getAttr(el, key),
        url: (next, el, e) => (url, paramKeyOrLst, paramValue) => noUndefined(url) ? toPage(url, paramKeyOrLst, paramValue) : location.href,
        urlParam: (next, el) => (key, value) => noUndefined(value) ? (url.searchParams.set(key, value), next()) : url.searchParams.get(key),
        pms: (next, el, e, pipe, ctx) => (name, value) => noUndefined(value) ? (setPms(el, name, value, e, pipe, ctx), next()) : getPms(el, name, e, next, pipe, ctx),
        pipe: (next, el, e, pipe) => (name, value) => {
            pipe(name, value);
            next();
        },
        cache: (next, el, e, pipe, ctx) => (name, value) => cache(next, el, name, value),
        inc: (next, el, e, pipe, ctx) => (pipeName, step, multiplyMode) => {
            let value = Number(pipe(pipeName));
            pipe(pipeName, multiplyMode ? value * step : value + step);
            next();
        },
        pmsInc: (next, el, e, pipe, ctx) => (pmName, step, multiplyMode) => {
            let value = Number(getPms(el, pmName, e, next, pipe, ctx));
            setPms(el, pmName, multiplyMode ? value * step : value + step, e);
            next();
        },
        take: (next, el, e, pipe) => function(pipeName, index /*传入任意个数的参数，如样式类*/ ) {
            pipe(pipeName, (typeof arguments[2] === 'object' ? arguments[2] : arguments)[arguments[1]]);
            next();
        },
        pole: (next, el, e, pipe) => (pipeName, baseSlt) => {
            let baseEl;

            mapParents(el, elm => {
                baseEl = getEl(elm, baseSlt);
                if (baseEl) {
                    return false
                }
            });

            if (baseEl) {
                let d,
                    x = 0,
                    y = 0,
                    baseBox = getBoxClient(baseEl),
                    elBox = getBoxClient(el),
                    ya = baseBox.top,
                    yb = baseBox.bottom,
                    yc = elBox.top,
                    yd = elBox.bottom,
                    xa = baseBox.left,
                    xb = baseBox.right,
                    xc = elBox.left,
                    xd = elBox.right;

                if (yd < yb && yc < ya)
                    y = 1;
                if (yd > yb && yc > ya)
                    y = 2;
                if (xd < xb && xc < xa)
                    x = 3;
                if (xd > xb && xc > xa)
                    x = 4;

                d = Math.abs(ya - yc) > Math.abs(xa - xc) ? y : x;
                pipe(pipeName, d);
            }

            next();
        },
        heightBy: (next, el, e, pipe) => (inner, slt) => {
            let h = getHeight(slt ? getElBy(slt) : el, inner);
            el.style.height = h + 'px';
            next();
        },
        widthBy: (next, el, e, pipe) => (inner, slt) => {
            let w = getWidth(slt ? getElBy(slt) : el, inner);
            el.style.height = w + 'px';
            next();
        },
        stop: (next, el, e, pipe, ctx) => eventName => {
            index.on(eventName, ctx.destroyAll);
            next();
        },
        do: (next, el, e, pipe, ctx) => function(path) {
            next();

            let args = [];
            each(arguments, (v, i) => {
                if (i !== 0) args.push(v);
            });

            let handle = get(window.__DR_HANDLES, path) || get(el.__DR_HANDLES, path);
            return isFunction(handle) ? handle.apply(null, args) : handle
        },
    };

    draftHandler.pro = {};



    var resolvePms = el => {
        if (!el || !isElmNode(el)) return;
        if (el.__DR_PMS__) return el.__DR_PMS__;

        let __pms,
            exp,
            attrName = 'data-dr-pms';
        if (hasAttrName(el, attrName)) {
            exp = getAttr(el, attrName);
            __pms = exp ? makeValue(exp) : {};
            __pms.__proto__ = pms.root;
        } else {
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



    var compileExp = (lut, notEvent) => {
        let t = expSplit(lut, ':'),
            eventLut = t[0] || '',
            handlersExt = t[1] ? "_('" + t[1] + "')" : null,
            handlers = resolveHandlerExp(eventLut, handlersExt),
            event = null,
            agent = null;

        if (!notEvent) {
            let __event = get((/(.*?)[:\(\.]/g).exec(lut), 1);

            if (draftHandler[__event])
                event = '__only_handlers__';
            else {
                event = __event;

                let reg = new RegExp(__event + '[(]');
                if (reg.test(eventLut)) {
                    agent = makeValue(parseExp(handlers[0].exp.replace(reg, '('))[0][0]);
                    handlers.splice(0, 1);
                }
            }
        }

        return {
            event,
            agent,
            handlers
        };
    };


    var resolveEvent = (exp, el, taskScopeEl, widgetName) => {
        let res = {};

        let pushTask = (eventName, compileRes, pipe, eIndex, expOrg) => elm => {
            let eid = elm.__DR_ID || events.idx++;
            let event_count = elm['__DR_EVENT_' + eventName] ? ++elm['__DR_EVENT_' + eventName] : 1;
            elm['__DR_ID'] = eid;
            elm['__DR_EVENT_' + eventName] = event_count;
            elm['__DR_DR_EVENTS'] = elm['__DR_DR_EVENTS'] || {};

            elm['__DR_DR_EVENTS'][eventName] = 1;

            let one = {
                eid,
                eIndex,
                scope: taskScopeEl,
                event: eventName,
                unbind: null,
                widget: widgetName,
                el: elm,
                by: compileRes.agent,
                pipe,
                expOrg,
                handlers: compileRes.handlers
            };

            (res[eventName] = res[eventName] || []).push(one);

            (events[eventName] = events[eventName] || []).push(one);
        };

        let compile = (exp, eIndex) => {
            let __compileExp = compileExp(exp),
                event = __compileExp.event,
                agent = __compileExp.agent;

            if (agent) {
                let elms = getElAll(el, agent);
                each(elms, pushTask(event, __compileExp, {
                    son: elms
                }, eIndex, exp));
            } else pushTask(event, __compileExp, {}, eIndex, exp)(el);
        };

        each(expSplit(clearSpace(exp), ';'), ex => {
            let __isMerge = ex[0] === '[';
            if (__isMerge) {
                let __isDot = !ex.includes(':');
                let __eventLut = (/\[(.*)\][\.:]/g).exec(ex);

                if (!__eventLut) console.warn('expression error!' + ex);

                let __taskLut = ex.replace(__eventLut[0], '');
                each(split(__eventLut[1], '|'), (v, i) => v && compile(v + (__isDot ? '.' : ':') + __taskLut, i));
            } else compile(ex);
        });

        return res
    };


    var activeHandler = (el, eventName, task, callback) => {
        return e => {
            let __orgEvent_target = e.orgEvent ? e.orgEvent.target : {};
            if ('data-dr-not-trigger-active' in __orgEvent_target.attributes) return;

            let targetEl = getTarget(e),
                inner = el === targetEl ? targetEl !== bodyEl$1() : contains(el, targetEl);

            if (eventName === 'active' ? inner : !inner) {
                callback(e, el, task);
            }
        }
    };


    var dispatch = (exp, el, taskScopeEl, widgetName) => {
        if (!exp) return;
        let events = resolveEvent(exp, el, taskScopeEl, widgetName);

        each(events, (tasks, eventName) => {
            if (eventName === '__only_handlers__') each(tasks, task => runTask(null, task.el, task));
            else each(tasks, task => {
                    let curEl = task.el;
                    let eName = task.event;
                    let is_DR_Event = eName === 'active' || eName === 'inactive';
                    let is_DOM_Event = !is_DR_Event && ('on' + eName) in curEl;
                    let eventFn;

                    if (is_DOM_Event) {
                        let stop = hasAttrName(curEl, 'data-dr-stop');

                        eventFn = e => {
                            stopPropagation(e);
                            if (stop) e.preventDefault();
                            drEmit(eName, curEl, null, null, e);
                            runTask(e, curEl, task);
                            return false
                        };

                        addHandler(curEl, eName, eventFn);
                        task.unbind = () => removeHandler(curEl, eName, eventFn);
                    }

                    if (is_DR_Event || !is_DOM_Event) {
                        if (eName in {
                                inactive: 1,
                                active: 1
                            }) {
                            eventFn = activeHandler(curEl, eName, task, runTask);
                            index.on('click', eventFn);
                            task.unbind = () => index.off('click', eventFn);
                        } else {
                            eventFn = e => {
                                if (checkScope(eName, curEl, task.scope, e.scopeEl, e.target)) {
                                    runTask(e, curEl, task);
                                }
                            };
                            index.on(eName, eventFn);
                            task.unbind = () => index.off(eName, eventFn);
                        }
                    }
                });
        });
    };


    var DOMNodeChange = (el, callback) => {
        let MutationObserver = window.MutationObserver;
        if (MutationObserver) {
            let observer = new MutationObserver(callback);
            observer.observe(el, {
                childList: true,
                subtree: true,
            });

            let disconnect = () => {
                observer.disconnect();
            };
            if ('onbeforeunload' in window) window.addEventListener("beforeunload", disconnect);
            window.addEventListener('unload', disconnect);
        }
        else console.warn('Drummer:unsupported browser!');
    };

    const removeTaskEvent = els => {
        let __tasks,
            __task,
            i;
        each(els, elm => {
            each(elm.__DR_DR_EVENTS, (v, key) => {
                __tasks = events[key];
                for (i = __tasks.length - 1; i >= 0; i--) {
                    __task = __tasks[i];
                    if (__task.el === elm) {
                        __task.unbind && __task.unbind();
                        __tasks.splice(i, 1);
                    }
                }
            });
        });
    };


    var uninstall = el => {
        if (el && isElmNode(el)) {
            removeTaskEvent(concat([el], getDrEl('on', el) || []));
        }
    };

    var removeEl = el => el ? (el.remove ? el.remove() : (el && el.parentNode && el.parentNode.removeChild(el))) : null;


    var createEl = (tagName, attrs, children, wrapper) => {
        let el = document.createElement(tagName);

        each(attrs, (value, key) => {
            setAttr(el, key, value);
        });

        if (isString(children))
            el.textContent = children;
        else each(children, node => {
                append(el, node);
            });

        if (wrapper) append(isString(wrapper) ? getEl(wrapper) : wrapper, el);

        return el
    };

    var trimRem = value => {
        let a = clientWidth();
        if (a < 640) {
            (document.documentElement || document.body).style.fontSize = (a / 375) * (value || 100) + 'px';
        }
    };



    let on = (eName, fn) => index.on(eName, e => fn(e, transform(resolvePms(e.target), (res, val, key) => {
        if (!(/__.*?__/).test(key))
            res[key] = val;
    }, {})));
    let emit = (eName, prop, el, scope, e) => drEmit(eName, el || bodyEl$1(), prop, scope, e);

    let _do = (exp, el /*可传递元素对象,对象集合,选择器*/ ) => {
        let elms = el ? (isString(el) ? getElAll(el) : (('length' in el) ? el : [el])) : getElAll('body');
        each(elms, elm => runTask({}, isString(el) ? getElAll(el) : el, compileExp(exp, true)));
    };

    function pageTrans(animateIn, cb) {
        let body = bodyEl$1();
        addClass(body, animateIn);
        addEvent(body, 'animationend', () => {
            removeClass(body, animateIn);
            cb && cb();
        }, 1);
    }

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

    function dispatches(tasks, el, scopeEl) {
        each(tasks, exp => {
            dispatch(exp, el || bodyEl$1(), scopeEl);
        });
    }


    function config(options) {
        let __opts = options || {};

        Object.assign(pms, __opts);
        if (__opts.rem) trimRem(__opts.rem);
    }

    addHandler(document, 'keydown', ev => {
        let code = Number(ev.keyCode || ev.which),
            activeElement = el => isFormEl(el) ? document.activeElement === el : true;

        if (code === 13 || ev.key === 'Enter') emit('enter', null, activeElement);
        if (code === 27 || ev.key === 'Esc') emit('esc', null, activeElement);
        if (code === 46 || ev.key === 'Delete') emit('delete', null, activeElement);
    });

    let n,
        prevTick,
        direction = 1 /*1向上0向下*/ ;
    windowEventHandler('scroll', e => {
        let s = getScroll(),
            t = s.t;
        if (n = !n)
            prevTick = t;
        else
            direction = +(t > prevTick);

        if (window.scroll_direction !== direction) drEmit(['scrollUp', 'scrollDown'][direction], get(e, 'target'), null, null, e);
        window.scroll_direction = direction;

        if (t <= 0) drEmit('scrollInTop', get(e, 'target'), null, null, e);
        if (t >= s.h) drEmit('scrollInBottom', get(e, 'target'), null, null, e);
    });

    windowEventHandler('load', () => {
        if (window['__DR_OFF']) return;

        showBody();

        setup();

        each(init.onload, fn => fn());

        init.inited = true;

        addHandler(bodyEl$1(), 'click', event => {
            let target = event.target || event.srcElement;
            drEmit('click', target, null, null, event);
        });

        DOMNodeChange(document.body, mutations => {
            each(mutations, mutation => {
                if (mutation.type === 'childList') {
                    each(mutation.addedNodes, setup);
                    each(mutation.removedNodes, uninstall);
                }
            });
        });

        if (pms.pageTrans) {
            let trans = () => index.emit('loading', {});
            if ('onbeforeunload' in window) windowEventHandler("beforeunload", trans);
            else addHandler(document.body, 'click', event => {
                    let target = event.target || event.srcElement,
                        isLink = target.nodeName.toLocaleLowerCase() === "a";
                    if (isLink && getAttr(target, 'target') !== '_blank') {
                        trans();
                    }
                });

            windowEventHandler('unload', () => index.emit('unloading'));
        }
    });

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
        isMobile: isMobile$1,
        html,

        addEvent,
        removeEvent,

        handlers: options => options ? Object.assign(draftHandler, options) : draftHandler,
        handler: (name, fn) => fn ? draftHandler[name] = fn : draftHandler[name],
        widget: (name, options) => widgets[name] = options,
        el: (wrapper, name) => getEl(wrapper, '[data-dr=' + name + ']'),
        dispatch,
        dispatches,
        pageTrans,
        setup,
        config
    };

    return dr;

})();
