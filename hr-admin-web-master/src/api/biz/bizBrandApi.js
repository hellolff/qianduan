import { baseRequest } from '@/utils/request'

const request = (url, ...arg) => baseRequest(`/biz/brand/` + url, ...arg)

/**
 * 品牌表Api接口管理器
 *
 * @author cqlu
 * @date  2025/12/03 16:36
 **/
export default {
	// 获取品牌表分页
	bizBrandPage(data) {
		return request('page', data, 'get')
	},
	// 获取品牌表分页
	bizBrandList(data) {
		return request('list', data, 'get')
	},
	// 提交品牌表表单 edit为true时为编辑，默认为新增
	bizBrandSubmitForm(data, edit = false) {
		return request(edit ? 'edit' : 'add', data)
	},
	// 删除品牌表
	bizBrandDelete(data) {
		return request('delete', data)
	},
	// 获取品牌表详情
	bizBrandDetail(data) {
		return request('detail', data, 'get')
	}
}
