import { baseRequest } from '@/utils/request'

const request = (url, ...arg) => baseRequest(`/biz/article/` + url, ...arg)

/**
 * 文章信息表Api接口管理器
 *
 * @author cqlu
 * @date  2025/04/10 14:46
 **/
export default {
	// 获取文章信息表分页
	bizArticlePage(data) {
		return request('page', data, 'get')
	},
	// 提交文章信息表表单 edit为true时为编辑，默认为新增
	bizArticleSubmitForm(data, edit = false) {
		return request(edit ? 'edit' : 'add', data)
	},
	// 删除文章信息表
	bizArticleDelete(data) {
		return request('delete', data)
	},
	// 获取文章信息表详情
	bizArticleDetail(data) {
		return request('detail', data, 'get')
	},
	// 获取文章信息表详情
	bizArticleTranslate(data) {
		return request('translate', data, 'get')
	}
}
