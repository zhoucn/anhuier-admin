import request from '@/utils/request'

export function deviceList(data) {
	return request({
		url: '/device/list',
		method: 'post',
		data
	})
}