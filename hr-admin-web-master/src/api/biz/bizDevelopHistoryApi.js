import { baseRequest } from '@/utils/request'

const request = (url, ...arg) => baseRequest(`/biz/developHistory/` + url, ...arg)

/**
 * 发展历程表Api接口管理器
 *
 * @author cqlu
 * @date  2025/04/18 10:01
 **/
export default {
	// 获取发展历程表分页
	bizDevelopHistoryPage(data) {
		return request('page', data, 'get')
	},
	// 提交发展历程表表单 edit为true时为编辑，默认为新增
	bizDevelopHistorySubmitForm(data, edit = false) {
		return request(edit ? 'edit' : 'add', data)
	},
	// 删除发展历程表
	bizDevelopHistoryDelete(data) {
		return request('delete', data)
	},
	// 获取发展历程表详情
	bizDevelopHistoryDetail(data) {
		return request('detail', data, 'get')
	}
}
