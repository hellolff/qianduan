import { baseRequest } from '@/utils/request'

const request = (url, ...arg) => baseRequest(`/biz/series/` + url, ...arg)

/**
 * 车系表Api接口管理器
 *
 * @author cqlu
 * @date  2025/12/03 16:38
 **/
export default {
	// 获取车系表分页
	bizCarSeriesPage(data) {
		return request('page', data, 'get')
	},
	// 提交车系表表单 edit为true时为编辑，默认为新增
	bizCarSeriesSubmitForm(data, edit = false) {
		return request(edit ? 'edit' : 'add', data)
	},
	// 删除车系表
	bizCarSeriesDelete(data) {
		return request('delete', data)
	},
	// 获取车系表详情
	bizCarSeriesDetail(data) {
		return request('detail', data, 'get')
	}
}
