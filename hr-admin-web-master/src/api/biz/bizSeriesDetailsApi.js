import request from '@/utils/request'

/**
 * 车系详情管理Api接口管理器
 */
export default {
  // 分页查询车系详情列表
  bizSeriesDetailsPage(params) {
    return request({
      url: '/biz/series/details/page',
      method: 'get',
      params
    })
  },
  // 新增车系详情
  bizSeriesDetailsAdd(data) {
    return request({
      url: '/biz/series/details/add',
      method: 'post',
      data
    })
  },
  // 编辑车系详情
  bizSeriesDetailsEdit(data) {
    return request({
      url: '/biz/series/details/edit',
      method: 'post',
      data
    })
  },
  bizSeriesDetailsEditState(data) {
    return request({
      url: '/biz/series/details/edit/state',
      method: 'post',
      data
    })
  },
  // 批量删除车系详情
  bizSeriesDetailsDelete(data) {
    return request({
      url: '/biz/series/details/delete',
      method: 'post',
      data
    })
  },
  // 获取车系详情详情
  bizSeriesDetailsDetail(params) {
    return request({
      url: '/biz/series/details/detail',
      method: 'get',
      params
    })
  }
}