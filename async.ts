
//每一个 promise 都会提供给你一个 then() 函数 (或是 catch()
//实际上只是 then(null, ...) 的语法糖)。当我们在 then() 函数内部时：

//我们可以做三种事情：
//1.return 另一个 promise
onGetUserByName('nalan').then(function (user) {
	return getUserAccountById(user.id);
}).then(function (userAccount) {
	//I got a user account!
}); //是 return 第二个 promise，这个 return 非常重要。	//如果没有写 return，getUserAccountById() 就会成为一个副作用，
//并且下一个函数将会接收到 undefined 而非 userAccount
//2.return 一个同步的值 (或者 undefined)
getUserByName('nolan').then(function (user) {
	if (inMemoryCache[user.id]) {
		return inMemoryCache[user.id]	//returning a synchronous vslue
	}
	return getUserAccountById(user.id);	//returning a promise
}).then(function (userAccount) {
	//I got a user account!
});//第二个函数不需要关心 userAccount 是从同步方法还是异步方法中获取的，
//并且第一个函数可以非常自由的返回一个同步或者异步值。
//3.throw 一个同步异常
getUserByName('nolan').then(function (user) {
	if (user.isLoggedOut()) {
		throw new error('user Logged out!')	//throwing a  synchronous error
	}
	if (inMemoryCache[user.id]) {
		return inMemoryCache[user.id]	//returning a synchronous vslue
	}
	return getUserAccountById(user.id);	//returning a promise
}).then(function (userAccount) {
	//I got a user account!
}).catch(function (err) {
	//  I got an error!
});
//如果用户已经登出，我们的 catch() 会接收到一个同步异常，
//并且如果 后续的 promise 中出现异步异常，他也会接收到
//。再强调一次，这个函数并不需要关心这个异常是同步还是异步返回的。
//这种特性非常有用，因此它能够在开发过程中帮助定位代码问题。
//举例来说，如果在 then() 函数内部中的任何地方，我们执行JSON.parse()
//，如果 JSON 格式是错误的，那么它就会抛出一个异常。
//如果是使用回调风格，这个错误很可能就会被吃掉，
//但是使用 promises，我们可以轻易的在 catch() 函数中处理它了








//将函数抽离到一个命名函数中
function onGetUserAndUserAccount(user, userAccount) {
	return doSomething(user, userAccount);
}
function onGetUser(user) {
	return getUserAccountById(user.id).then(function (userAccount) {
		return onGetUserAndUserAccount(user, userAccount)
	});
}
getUserByName('nolan')
	.then(onGetUser)
	.then(function () {
		//at this point, doSomeThing() is done, and we are back indentation 0
	});



Promise.resolve('foo')
	.then(Promise.resolve('bar'))
	.then(function (result) {
		console.log(result);
	});  //这个代码将打印出 foo 而不是 bar 等同于

Promise.resolve('foo')
	.then(null)
	.then(function (result) {
		console.log(result);
	});//添加任意数量的then（null），依然打印foo

Promise.resolve('foo')
	.then(function () {
		return Promise.resolve('bar');
	})
	.then(function (result) {
		console.log(result);
	});//这个代码打印出的是bar.
//发生这个的原因是如果你像 then() 传递的并非是一个函数（比如 promise），
//它实际上会将其解释为 then(null),
//then() 是期望获取一个函数



somePromise().catch(function (err) {
	//handle error
});
somePromise().then(mull, function (err) {
	//handle error
});//这两段代码等价

somePromise().tnen(function () {
	throw new error('oh ones');
}).catch(function (err) {
	//I caught your error!
});

somePromise().then(function () {
	throw new Error('oh ones');
}, function (err) {
	//I didn't catch your error!
}) ；//这是因为使用 then(resolveHandler, rejectHandler) 这种形式时
//rejectHandler 并不会捕获由 resolveHandler 引发的异常。



new Promise((resolve, reject) => {
	console.log('Initial');

	resolve();
})
	.then(() => {
		throw new Error('Something failed');

		console.log('Do this');
	})
	.catch(() => {
		console.log('Do that');
	})
	.then(() => {
		console.log('Do this whatever happened before');
	});

//输出结果	Initial
//			Do that
//			Do this whatever happened before