var ObjPro = Object.prototype,
    hasOwn = ObjPro.hasOwnProperty,
    nativeArray = ObjPro.forEach,
    nativeMap = ObjPro.map,
    nativeFilter = ObjPro.filter,
    nativeSome = ObjPro.some,
    nativeEvery = ObjPro.every,
    nativeIndexOf = ObjPro.indexOf,
    nativeLastIndexOf = ObjPro.lastIndexOf,
    nativeReduce = ObjPro.reduce,
    nativeReduceRight = ObjPro.reduceRight;

Array.prototype.forEach = nativeArray || function (callBack, ctx) {
  if (typeof callBack != 'function') return;

  for (var i =0, len = this.length; i < len; i++) {
    if (hasOwn.call(this, i)) {
      callBack.call(ctx, this[i], i, this);
    }
  }
}

Array.prototype.map = nativeMap || function (callBack, ctx) {
  if (typeof callBack != 'function') return;

  var returnArr = [];
  for(var i = 0, len = this.length; i < len; i++) {
    returnArr.push(callBack.call(ctx, this[i], i, this));
  }
  return  returnArr;
}

Array.prototype.filter = nativeFilter || function (callBack, ctx) {
  if (typeof callBack != 'function') return;

  var returnArr = [];
  for(var i = 0, len = this.length; i < len; i++) {
    if (callBack.call(ctx, this[i], i, this)) {
      returnArr.push(this[i]);
    }
  }
  return returnArr;
}

Array.prototype.some = nativeSome || function (callBack, ctx) {
  if (typeof callBack != 'function') return;

  var resultValue = false;
  for(var i = 0, len = this.length; i < len; i++) {
    if (resultValue) {
      break;
    }
    resultValue = !!callBack.call(ctx, this[i], i, this);
  }
  return  resultValue;
}

Array.prototype.indexOf = nativeIndexOf || function (searchElement, fromIndex) {
  var returnIndex = -1,
      fromIndex = fromIndex * 1 || 0;
  for (var i = fromIndex, len = this.length; i < len; i++) {
    if (searchElement === this[i]) {
	   returnIndex = i;
	   break;
    }
  }
  return returnIndex;
}

Array.prototype.lastIndexOf = nativeLastIndexOf || function (searchElement, fromIndex) {
  var len = this.length,
      returnIndex = -1,
      fromIndex = fromIndex * 1 || len - 1;

  for (var i = fromIndex; i > -1; i -= 1) {
    if (this[i] === searchElement){
      returnIndex = i;
      break;
    }
  }
  return returnIndex;
}

Array.prototype.reduce = nativeReduce || function (callBack, initialVal) {
  if (typeof callBack != 'function') return;

  var init = initialVal,
      i = 0;

      if (init === void (0)) {
        init = this[0];
        i = 1;
      }
  for (i, len = this.length; i < len; i++) {
    if (hasOwn.call(this, i)) {
      init = callBack(init, this[i], i, this);
    }
  }
  return init;
}

Array.prototype.reduceRight = nativeReduceRight || function (callBack, initialVal) {
  if (typeof callBack != 'function') return;

  var init = initialVal,
      len = this.length,
      i = len - 1;

  if (init === void(0)) {
    init = this[len - 1];
    i -= 1;
  }
  for (i; i > -1; i -=1) {
    if (hasOwn.call(this, i)) {
      init = callBack(init, this[i], i, this);
    }
  }
  return init;
}
