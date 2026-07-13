import { baseRequest } from '@/utils/request'

const request = (url, ...arg) => baseRequest(`/biz/channel/` + url, ...arg)

/**
 * 渠道Api接口管理器
 *
 * @author cqlu
 * @date  2025/04/11 10:15
 **/
export default {
	// 获取渠道分页
	bizMessageBoardPage(data) {
		return request('page', data, 'get')
	},
	// 提交渠道表单 edit为true时为编辑，默认为新增
	bizMessageBoardSubmitForm(data, edit = false) {
		return request(edit ? 'edit' : 'add', data)
	},
	// 删除渠道表
	bizMessageBoardDelete(data) {
		return request('delete', data)
	},
	// 获取渠道详情
	bizMessageBoardDetail(data) {
		return request('detail', data, 'get')
	}
}
