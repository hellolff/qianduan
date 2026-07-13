import { baseRequest } from '@/utils/request'

const request = (url, ...arg) => baseRequest(`/biz/interior/` + url, ...arg)

/**
 * 内饰表Api接口管理器
 *
 * @author cqlu
 * @date  2025/12/03 11:36
 **/
export default {
	// 获取内饰表分页
	bizInteriorPage(data) {
		return request('page', data, 'get')
	},
	// 提交内饰表表单 edit为true时为编辑，默认为新增
	bizInteriorSubmitForm(data, edit = false) {
		return request(edit ? 'edit' : 'add', data)
	},
	// 删除内饰表
	bizInteriorDelete(data) {
		return request('delete', data)
	},
	// 获取内饰表详情
	bizInteriorDetail(data) {
		return request('detail', data, 'get')
	}
}
