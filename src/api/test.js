import request from '@/utils/request'

export function testList(page) {
	return request({
		url: '/device/test/list',
		method: 'post',
		data: {
			page: page
		}
	})
}

export function recordsList(id,page) {
	return request({
		url: '/device/test/records',
		method: 'post',
		data: {
			deviceId: id,
			page: page
		}
	})
}

export function start(id) {
	return request({
		url: '/device/test/run',
		method: 'post'
	})
}