import { baseRequest } from '@/utils/request'

const request = (url, ...arg) => baseRequest(`/biz/recruitment/` + url, ...arg)

/**
 * 招聘信息表Api接口管理器
 *
 * @author cqlu
 * @date  2025/04/10 14:48
 **/
export default {
	// 获取招聘信息表分页
	bizRecruitmentPage(data) {
		return request('page', data, 'get')
	},
	// 提交招聘信息表表单 edit为true时为编辑，默认为新增
	bizRecruitmentSubmitForm(data, edit = false) {
		return request(edit ? 'edit' : 'add', data)
	},
	// 删除招聘信息表
	bizRecruitmentDelete(data) {
		return request('delete', data)
	},
	// 获取招聘信息表详情
	bizRecruitmentDetail(data) {
		return request('detail', data, 'get')
	}
}
