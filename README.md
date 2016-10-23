
## 前言

> 一直以来想写一篇关于es5中新增数组的使用方法与源码实现的文章，拖了挺久了，趁着这夜深人静，大脑清醒，又困意不在的时刻写下来。也许有人会问，现如今es6都大行其道了，还学es5是不是有些过时了，😄，温故而知新，可以为师矣，而且我们是要自己实现这些方法嘛，知其然还要知其所以然，不光要会用，还要知道为什么是这样用哒。


![前端配图](http://odssgnnpf.bkt.clouddn.com/43d555c6434bc10db279724d5aa66dc8.jpg)


## 新增方法预览

> es5中给js的数组增添了许多实用的方法，利用这些方法可以帮助我们更加快速方便的写js代码，然后蛋疼的是低版本ie肯定是不支持的，所以..................自己动手丰衣足食。让我们一步步看下如何使用与实现这些方法。

1. forEach
2. map
3. filter
4. some
5. every
6. indexOf
7. lastIndexOf
8. reduce
9. reduceRight


## forEach

> 这个方法作用是啥咧，就是循环，遍历。比如一般我们在for循环做这样的事的时候如下。


```javascript

var arr = [1, 2, 3, 4, 5, 6];

for (var i = 0, len = arr.length; i < len; i++) {
  console.log(arr[i], i, arr);
}


```

**如果用forEach我们应该如何做呢？**


``` javascript
var arr = [1, 2, 3, 4, 5, 6];

arr.forEach(function (e, i, ctx) {
  console.log(e, i, ctx)
})

```

**是不是觉得不用写for循环了，瞬间逼格都高了**


> forEach函数中的回调函数支持三个参数，`1、数组的值`，`2、值的索引`，`3、数组本身`。这样的调用方式是不是和jQuery中的$.each很像？ 其实不然，jQuery和forEach回调函数的第一个和第二个参数正好是反着来的。


**看看对比**

``` javascript
var arr = [1, 2, 3, 4, 5];

// forEach
arr.forEach(function (e, i, array) {
  console.log(e, i, array);
})

// output

1 0 [1, 2, 3, 4, 5]
2 1 [1, 2, 3, 4, 5]
3 2 [1, 2, 3, 4, 5]
4 3 [1, 2, 3, 4, 5]
5 4 [1, 2, 3, 4, 5]


// $.each
$.each(arr, function (i, e, array) { // 测试的时候发现array是undefined,查了文档也发现没有第三个参数
  console.log(i, e, array);
})

// output

0 1 undefined
1 2 undefined
2 3 undefined
3 4 undefined
4 5 undefined

```

**接着我们来看一下forEach的第二个参数，这个参数决定第一个回调函数的内部this指向**

``` javascript

var arr = [1, 2, 3, 4, 5];

//  默认情况下，第二个参数不传入时
arr.forEach(function (e, i, array) {
  console.log(e, i, array, this);
})

// output
1 0 [1, 2, 3, 4, 5] window
2 1 [1, 2, 3, 4, 5] window
3 2 [1, 2, 3, 4, 5] window
4 3 [1, 2, 3, 4, 5] window
5 4 [1, 2, 3, 4, 5] window

// 传入参数
arr.forEach(function (e, i, array) {
  console.log(e, i, array, this);
}, {name: 'qianlong'})

// output
1 0 [1, 2, 3, 4, 5] {name: 'qianlong'}
2 1 [1, 2, 3, 4, 5] {name: 'qianlong'}
3 2 [1, 2, 3, 4, 5] {name: 'qianlong'}
4 3 [1, 2, 3, 4, 5] {name: 'qianlong'}
5 4 [1, 2, 3, 4, 5] {name: 'qianlong'}

```

**最后接下来我们自己实现一下这个方法**


``` javascript
var ObjPro = Object.prototype,
    hasOwn = ObjPro.hasOwnProperty,
    nativeArray = ObjPro.forEach;

Array.prototype.forEach = nativeArray || function (callBack, ctx) {  
  if (typeof callBack != 'function') return;

  for (var i =0, len = this.length; i < len; i++) {
    if (hasOwn.call(this, i)) {
      callBack.call(ctx, this[i], i, this);
    }
  }
}

```

## map

> map是干嘛的！ 其最主要的作用就是将原数组按照一定的规则映射成一个新的数组。再将其返回，`注意是返回一个新的数组，而不是将原数组直接改变`使用方式和forEach类似,也是接受一个回调函数，一个改变内部this指向的对象。

**map**

``` javascript
array.forEach(callback,[ thisObject])

```

**callback**

``` javascript
var arr = [1, 2, 3, 4, 5];

arr.map(function(value, index, array) {

});

```

**举个栗子**

``` javascript
var arr = [1, 2, 3, 4, 5];

var newArr = arr.map(function (e, i, array) {
  return 'hello ' +  e;
})

// output

["hello 1", "hello 2", "hello 3", "hello 4", "hello 5"] // newArr

[1, 2, 3, 4, 5] // arr

```

**注意上面的return，如果我们不写return会怎样呢？**

``` javascript
var arr = [1, 2, 3, 4, 5];

var newArr = arr.map(function (e, i, array) {
  'hello ' +  e;
})

// output

[undefined, undefined, undefined, undefined, undefined] // newArr

[1, 2, 3, 4, 5] // arr

```

这一堆的undefined是啥情况，还记得一个函数执行完，如果没有显示的返回值，会返回什么吗？ **没错** 就是`undefined`，这就是原因所在，等会通过源码，你就会更加明白。


**最后我们自己实现一下map这个方法**

``` javascript
var ObjPro = Object.prototype,
    hasOwn = ObjPro.hasOwnProperty,
    nativeMap = ObjPro.map;

Array.prototype.map = nativeMap || function (callBack, ctx) {
  if (typeof callBack != 'function') return;

  var returnArr = [];
  for(var i = 0, len = this.length; i < len; i++) {
    returnArr.push(callBack.call(ctx, this[i], i, this)); // 这就是为什么回调函数没有返回值的情况下会得到一堆的undefined值，他将回调函数的返回值push到了一个数组里面，当你没有显示的返回值的时候，自然push进去的就是undefined了     
  }
  return  returnArr;
}    

```

## filter

> 接下来是`filter`,筛选，过滤的意思，给你一个数组，用一些你制定的条件，对其中的值进行过滤，最后得到你想要的新的数组。基本用法和map差不多

``` javascript

array.filter(callback,[ thisObject]);

```

但是和map也有差别的地方，filter需要你在callback处返回弱等于`true` 的值,才会将原数组中筛选出的值返回给你。

**举个栗子**

``` javascript

var arr = [0, 1, 2, 3, 4, 5];

var newArr = arr.filter(function (e, i, array) {
  return e;
})

// output

[1, 2, 3, 4, 5] // newArr

var newArr2 = arr.filter(function (e, i, array) {
  if (e >= 2) return true;
})

// ouput
[2, 3, 4, 5] // newArr2

```

**当然最后还有第二个参数改变内部this指向的参数可选，默认是window对象，你也可以传一个对象进去, 最后我们自己来实现一下这个api**

``` javascript
var ObjPro = Object.prototype,
    hasOwn = ObjPro.hasOwnProperty,
    nativeFilter = ObjPro.filter;

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


```

## some vs every

> some与接下里的every正好相对，`some`是只要数组中的某个值，符合你给定的判断条件就返回true，而`every`则是数组中的所有值都符合你给定的判断条件的时候才会返回true，否则就返回false,也就是说两个方法最后得到的都是true or false

**举个栗子**

``` javascript

var arr = [0, 1, 2, 3, 4, 5];

var result = arr.some(function (e, i, array) {
  if (e === 3) {return true};
});

// output  	
true // result;

var arr = [0, 1, 2, 3, 4, 5];

var result2 = arr.every(function (e, i, array) {
  if (e > 3) {return true};
});
// output  	
false // result;

```

`some 和 every使用起来非常简单，接下来我们自己实现一把`

``` javascript

var ObjPro = Object.prototype,
    hasOwn = ObjPro.hasOwnProperty,
    nativeSome = ObjPro.some,
    nativeEvery = ObjPro.every;

// some    
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

// every

Array.prototype.every = nativeEvery || function (callBack, ctx) {
  if (typeof callBack != 'function') return;

  var resultValue = true;
  for (var i = 0, len = this.length; i < len; i++) {
    if (!resultValue) {
      break;
    }
    resultValue = !!callBack.call(ctx, this[i], i, this);
  }
  return resultValue;  	
}   

```

## indexOf

> 数组的indexOf方法和字符串的indexOf用法非常类似，`array.indexOf(searchElement[, fromIndex])`,针对给定的要查找的值，和开始查找的位置(可选)，返回整数索引值。


**举个例子**

``` javascript

var arr = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0];

arr.indexOf(1) // 1
arr.indexOf(3, 'qianlong') // 4 因为给定的开始索引值不能转化成数字，所以还是从0位置开始搜索
arr.indexOf(3, 4) // -1
arr.indexOf(3, '4') // -1
arr.indexOf('3') // -1 // 判断条件是强 3 !== '3' => -1
```

**实现代码**

```javascript

var ObjPro = Object.prototype,
    hasOwn = ObjPro.hasOwnProperty,
    nativeIndexOf = ObjPro.indexOf;

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


```

## lastIndexOf


> 数组的lastIndexOf方法和字符串的lastIndexOf用法非常类似，`array. lastIndexOf(searchElement[, fromIndex])`,针对给定的要查找的值，和开始查找的位置(可选)，返回整数索引值。与indexOf不同的地方在于，它是从后往前查找。默认开始查找的位置是 `array.length - 1`


**举个栗子**

``` javascript
var arr = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0];

arr.lastIndexOf(1) // 9
arr.lastIndexOf(3, 'qianlong') // -1 这里和indexOf不一样，传入的值不能转化为数字将得到-1
arr.lastIndexOf(3, 4) // 3
arr.lastIndexOf(3, '4') // 3
arr.lastIndexOf('3') // -1 // 判断条件是强 3 !== '3' => -1

```

**源码实现**

``` javascript
var ObjPro = Object.prototype,
    hasOwn = ObjPro.hasOwnProperty,
    nativeLastIndexOf = ObjPro.lastIndexOf;

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

```

## reduce

> reduce 相对es5中数添加的其他方法都复杂一些，我们可以通过栗子来看一下这个api怎么使用。首先基本参数如下

`array.reduce(callback[, initialValue])`,接收一个回调函数，一个初始化的值`initialValue `。其中callback参数分别是初始化的值`initialValue `,如果没有传入`initialValue`,则默认是数组的第一项。第二个及其后面的参数分别是`当前值`,`索引`,`数组本身`


``` javascript
var arr = [0, 1, 2, 3, 4, 5],
    sum = arr.reduce(function (init, cur, i, array) {
      return init + cur;
    });

   //output
   sum // 15

```

我们来看一下上面的执行过程是怎样的。

**第一回合**

``` javascript
// 因为initialValue没有传入所以回调函数的第一个参数为数组的第一项

init = 0;
cur = 1;

=> init + cur = 1;

```
**第二回合**

``` javascript
init = 1;
cur = 2;

=> init + cur = 3;

```

**第三回合**

``` javascript
init = 3;
cur = 3;

=> init + cur = 6;

```

**第四回合**

``` javascript
init = 6;
cur = 4;

=> init + cur = 10;

```

**第五回合**

``` javascript
init = 10;
cur = 5;

=> init + cur = 15;

```
最后得到结果`15`

**那么我们如何自己实现一个reduce呢？**

``` javascript
var ObjPro = Object.prototype,
    hasOwn = ObjPro.hasOwnProperty,
    nativeReduce = ObjPro.reduce;

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


```

## reduceRight

> reduceRight基本用法与reduce类似，好比indexOf与lastIndexOf，不同之处在于它是从最右边的值开始计算的。我们直接去看源码怎么实现吧


 ``` javascript
 var ObjPro = Object.prototype,
     hasOwn = ObjPro.hasOwnProperty,
     nativeReduceRight = ObjPro.reduceRight;

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

 ```

 ## 结尾

 >  终于写完了，断断续续快写了两天，欢迎大家看了以后提一些意见，函数实现的不一定都对，肯定有一些问题的地方，欢迎大家指正。
