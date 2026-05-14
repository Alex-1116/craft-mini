// Promise 封装 uni.request
import config from '../config.js'
const serverUrl = config.serverUrl
const METHOD = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	DELETE: 'DELETE',
}

Promise.prototype.finally = function(callback) {
	const P = this.constructor
	return this.then(
		value => P.resolve(callback()).then(() => value),
		reason => P.resolve(callback()).then(() => {
			throw reason
		})
	)
}

function isAbsoluteURL(url) {
	return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

function combineURLs(url) {
	return serverUrl + url
}

function isEmpty(obj) {
	if (typeof obj == "undefined" || obj == null || obj == "") {
		return true;
	} else {
		return false;
	}
}

async function request(url, data, method, header, isShowLoading) {

	if (isShowLoading) {
		uni.showLoading({
			title: '加载中...'
		});
	}
	const promise = new Promise((resolve, reject) => {
		let _url = isAbsoluteURL(url) ? url : combineURLs(url);
		let _data = {
			...data
		}
		if(isShowLoading){
			console.log('request url === ', _url)
			console.log('request data === ', _data)
		}
		uni.request({
			url: _url,
			data: _data,
			method,
			header,
			success: res => {
				if (isShowLoading) {
					setTimeout(function() {
						uni.hideLoading()
					}, 10)
				}

				if (res.statusCode === 200) {
					resolve(res.data)
					if(isShowLoading){
						console.log('request res === ', res.data)
					}

				} else {
					switch (res.statusCode) {
						case 400:
							// reject({
							//   msg: '请求错误'
							// })
							uni.showToast({
								title: '请求错误',
								icon: 'none',
								duration: 1000
							})
							break

						case 404:
							console.log('_url====', _url)
							uni.showToast({
								title: '接口不存在',
								icon: 'none',
								duration: 1000
							})
							break

						case 500:
							uni.showToast({
								title: '服务器错误',
								icon: 'none',
								duration: 1000
							})
							break

						default:
					}
				}
			},
			fail: error => {
				if (isShowLoading) {
					setTimeout(function() {
						uni.hideLoading()
					}, 1000)
				}
				switch (error.errMsg) {
					case 'request:fail timeout':
						uni.showToast({
							title: '请求超时',
							icon: 'none',
							duration: 1000
						})
						break

					default:
						uni.showToast({
							title: '网络错误,或接口不存在',
							icon: 'none',
							duration: 1000
						})
						break
				}
			}
		})
	})

	return promise
}

function get(url, data, isShowLoading = true) {
	var token = uni.getStorageSync('token') ? uni.getStorageSync('token') : ''
	const header = {
		'platform':'WechatMiniProgram'
	}
	if(!isEmpty(token)){
		header['token'] = token
	}
	return request(url, data, METHOD.GET, header, isShowLoading)
}

function post(url, data, isShowLoading = true) {
	var token = uni.getStorageSync('token') ? uni.getStorageSync('token') : ''
	const header = {
		'content-type': 'application/json',
		'platform':'WechatMiniProgram'
	}
	if(!isEmpty(token)){
		header['token'] = token
	}
	return request(url, data, METHOD.POST, header, isShowLoading)
}

function put(url, data, isShowLoading = true) {
	var token = uni.getStorageSync('token') ? uni.getStorageSync('token') : ''
	const header = {
		'content-type': 'application/json',
		'platform':'WechatMiniProgram'
	}
	if(!isEmpty(token)){
		header['token'] = token
	}
	return request(url, data, METHOD.PUT, header, isShowLoading)
}

function _delete(url, data, isShowLoading = true) {
	var token = uni.getStorageSync('token') ? uni.getStorageSync('token') : ''
	const header = {
		'content-type': 'application/json',
		'platform':'WechatMiniProgram'
	}
	if(!isEmpty(token)){
		header['token'] = token
	}
	return request(url, data, METHOD.DELETE, header, isShowLoading)
}


export default {
	get:get,
	post:post,
	put:put,
	_delete:_delete
}
