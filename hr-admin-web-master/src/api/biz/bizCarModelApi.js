import { baseRequest } from '@/utils/request'

const request = (url, ...arg) => baseRequest(`/biz/model/` + url, ...arg)

/**
 * 车型表Api接口管理器
 *
 * @author cqlu
 * @date  2025/12/03 16:38
 **/
export default {
	// 获取车型表分页
	bizCarModelPage(data) {
		return request('page', data, 'get')
	},
	// 提交车型表表单 edit为true时为编辑，默认为新增
	bizCarModelSubmitForm(data, edit = false) {
		return request(edit ? 'edit' : 'add', data)
	},
	// 删除车型表
	bizCarModelDelete(data) {
		return request('delete', data)
	},
	// 获取车型表详情
	bizCarModelDetail(data) {
		return request('detail', data, 'get')
	}
}
