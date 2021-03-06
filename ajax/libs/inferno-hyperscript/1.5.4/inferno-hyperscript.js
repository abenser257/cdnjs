
/*!
 * Inferno.h v1.5.4
 * (c) 2017 Dominic Gannaway'
 * Released under the MIT License.
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('inferno')) :
	typeof define === 'function' && define.amd ? define(['inferno'], factory) :
	(global.Inferno = global.Inferno || {}, global.Inferno.h = factory(global.Inferno));
}(this, (function (inferno) { 'use strict';

// This should be boolean and not reference to window.document


// this is MUCH faster than .constructor === Array and instanceof Array
// in Node 7 and the later versions of V8, slower in older versions though
var isArray = Array.isArray;
function isStatefulComponent(o) {
    return !isUndefined(o.prototype) && !isUndefined(o.prototype.render);
}
function isStringOrNumber(obj) {
    var type = typeof obj;
    return type === 'string' || type === 'number';
}



function isString(obj) {
    return typeof obj === 'string';
}



function isUndefined(obj) {
    return obj === undefined;
}

var classIdSplit = /([.#]?[a-zA-Z0-9_:-]+)/;
var notClassId = /^\.|#/;
function parseTag(tag, props) {
    if (!tag) {
        return 'div';
    }
    var noId = props && isUndefined(props.id);
    var tagParts = tag.split(classIdSplit);
    var tagName = null;
    if (notClassId.test(tagParts[1])) {
        tagName = 'div';
    }
    var classes;
    for (var i = 0, len = tagParts.length; i < len; i++) {
        var part = tagParts[i];
        if (!part) {
            continue;
        }
        var type = part.charAt(0);
        if (!tagName) {
            tagName = part;
        }
        else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        }
        else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }
    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }
        props.className = classes.join(' ');
    }
    return tagName || 'div';
}
function isChildren(x) {
    return isStringOrNumber(x) || (x && isArray(x));
}
function extractProps(_props, _tag) {
    _props = _props || {};
    var isComponent = !isString(_tag);
    var tag = !isComponent ? parseTag(_tag, _props) : _tag;
    var newProps = {};
    var key = null;
    var ref = null;
    var children = null;
    var className = null;
    for (var prop in _props) {
        if (prop === 'className' || prop === 'class') {
            className = _props[prop];
        }
        else if (prop === 'key') {
            key = _props[prop];
        }
        else if (prop === 'ref') {
            ref = _props[prop];
        }
        else if (prop.substr(0, 11) === 'onComponent' && isComponent) {
            if (!ref) {
                ref = {};
            }
            ref[prop] = _props[prop];
        }
        else if (prop === 'hooks') {
            ref = _props[prop];
        }
        else if (prop === 'children') {
            children = _props[prop];
        }
        else {
            newProps[prop] = _props[prop];
        }
    }
    return { tag: tag, props: newProps, key: key, ref: ref, children: children, className: className };
}
function hyperscript(_tag, _props, _children) {
    // If a child array or text node are passed as the second argument, shift them
    if (!_children && isChildren(_props)) {
        _children = _props;
        _props = {};
    }
    var ref$1 = extractProps(_props, _tag);
    var tag = ref$1.tag;
    var props = ref$1.props;
    var key = ref$1.key;
    var ref = ref$1.ref;
    var children = ref$1.children;
    var className = ref$1.className;
    if (isString(tag)) {
        var flags;
        switch (tag) {
            case 'svg':
                flags = 128 /* SvgElement */;
                break;
            case 'input':
                flags = 512 /* InputElement */;
                break;
            case 'textarea':
                flags = 1024 /* TextareaElement */;
                break;
            case 'select':
                flags = 2048 /* SelectElement */;
                break;
            default:
                flags = 2 /* HtmlElement */;
                break;
        }
        return inferno.createVNode(flags, tag, className, _children || children, props, key, ref);
    }
    else {
        var flags$1 = isStatefulComponent(tag) ? 4 /* ComponentClass */ : 8;
        if (children || _children) {
            props.children = children || _children;
        }
        return inferno.createVNode(flags$1, tag, className, null, props, key, ref);
    }
}

return hyperscript;

})));
