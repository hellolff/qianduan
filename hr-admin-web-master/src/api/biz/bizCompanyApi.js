import { baseRequest } from '@/utils/request'

const request = (url, ...arg) => baseRequest(`/biz/company/` + url, ...arg)

/**
 * 全球公司表Api接口管理器
 *
 * @author cqlu
 * @date  2025/12/04 13:18
 **/
export default {
	// 获取全球公司表分页
	bizCompanyPage(data) {
		return request('page', data, 'get')
	},
	// 提交全球公司表表单 edit为true时为编辑，默认为新增
	bizCompanySubmitForm(data, edit = false) {
		return request(edit ? 'edit' : 'add', data)
	},
	// 删除全球公司表
	bizCompanyDelete(data) {
		return request('delete', data)
	},
	// 获取全球公司表详情
	bizCompanyDetail(data) {
		return request('detail', data, 'get')
	}
}
