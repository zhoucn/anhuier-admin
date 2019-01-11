import request from '@/utils/request'

export function deviceList(page,limit) {
	return request({
		url: '/device/list',
		method: 'post',
		data: {
			page: page,
			limit: limit
		}
	})
}