import { baseRequest } from '@/utils/request'

const request = (url, ...arg) => baseRequest(`/biz/messageBoard/` + url, ...arg)

/**
 * 留言表Api接口管理器
 *
 * @author cqlu
 * @date  2025/04/11 10:15
 **/
export default {
	// 获取留言表分页
	bizMessageBoardPage(data) {
		return request('page', data, 'get')
	},
	// 提交留言表表单 edit为true时为编辑，默认为新增
	bizMessageBoardSubmitForm(data, edit = false) {
		return request(edit ? 'edit' : 'add', data)
	},
	// 删除留言表
	bizMessageBoardDelete(data) {
		return request('delete', data)
	},
	// 获取留言表详情
	bizMessageBoardDetail(data) {
		return request('detail', data, 'get')
	}
}
