import { baseRequest } from '@/utils/request'

const request = (url, ...arg) => baseRequest(`/biz/accessory/` + url, ...arg)

/**
 * 配件表Api接口管理器
 *
 * @author cqlu
 * @date  2025/12/03 11:35
 **/
export default {
	// 获取配件表分页
	bizAccessoryPage(data) {
		return request('page', data, 'get')
	},
	// 提交配件表表单 edit为true时为编辑，默认为新增
	bizAccessorySubmitForm(data, edit = false) {
		return request(edit ? 'edit' : 'add', data)
	},
	// 删除配件表
	bizAccessoryDelete(data) {
		return request('delete', data)
	},
	// 获取配件表详情
	bizAccessoryDetail(data) {
		return request('detail', data, 'get')
	}
}
