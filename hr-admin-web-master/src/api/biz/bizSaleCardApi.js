import { baseRequest } from '@/utils/request'

const request = (url, ...arg) => baseRequest(`/biz/saleCard/` + url, ...arg)

/**
 * 销售卡片表Api接口管理器
 *
 * @author cqlu
 * @date  2025/12/04 13:19
 **/
export default {
	// 获取销售卡片表分页
	bizSaleCardPage(data) {
		return request('page', data, 'get')
	},
	// 提交销售卡片表表单 edit为true时为编辑，默认为新增
	bizSaleCardSubmitForm(data, edit = false) {
		return request(edit ? 'edit' : 'add', data)
	},
	// 删除销售卡片表
	bizSaleCardDelete(data) {
		return request('delete', data)
	},
	// 获取销售卡片表详情
	bizSaleCardDetail(data) {
		return request('detail', data, 'get')
	}
}
