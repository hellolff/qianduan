import { baseRequest } from '@/utils/request'

const request = (url, ...arg) => baseRequest(`/biz/category/` + url, ...arg)

/**
 * 配件/内饰分类表Api接口管理器
 *
 * @author cqlu
 * @date  2025/12/03 11:14
 **/
export default {
	// 获取配件/内饰分类表分页
	bizCategoryPage(data) {
		return request('page', data, 'get')
	},
	// 获取配件/内饰分类表分页
	bizCategoryList(data) {
		return request('list', data, 'get')
	},
	// 提交配件/内饰分类表表单 edit为true时为编辑，默认为新增
	bizCategorySubmitForm(data, edit = false) {
		return request(edit ? 'edit' : 'add', data)
	},
	// 删除配件/内饰分类表
	bizCategoryDelete(data) {
		return request('delete', data)
	},
	// 获取配件/内饰分类表详情
	bizCategoryDetail(data) {
		return request('detail', data, 'get')
	}
}
