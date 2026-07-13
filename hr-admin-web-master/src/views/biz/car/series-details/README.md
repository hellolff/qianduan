# 车系详情管理模块

## 功能概述
车系详情管理模块用于管理车系与业务员、区域、渠道的关联关系。

## 文件结构
```
src/views/biz/car/series-details/
├── index.vue      # 列表页面
├── form.vue       # 表单页面
└── README.md      # 说明文档
```

## API 接口
- `GET /biz/series/details/page` - 分页查询车系详情列表
- `POST /biz/series/details/add` - 新增车系详情
- `POST /biz/series/details/edit` - 编辑车系详情
- `POST /biz/series/details/delete` - 批量删除车系详情
- `GET /biz/series/details/detail` - 获取车系详情详情

## 数据字段
| 字段名 | 类型 | 说明 |
|--------|------|------|
| id | String | ID |
| carSeriesId | String | 车系ID |
| ywyIds | String | 业务员IDs（逗号分隔） |
| ywyName | String | 业务员名称 |
| regionIds | String | 区域IDs（逗号分隔） |
| regionNames | String | 区域名称 |
| ljyys | String | 链接语言 |
| channelId | String | 渠道ID |
| channelName | String | 渠道名称 |
| coverImage | String | 车系封面图片（从车系表关联获取） |

## 权限配置
需要在后端配置以下权限：
- `bizSeriesDetailsAdd` - 新增权限
- `bizSeriesDetailsEdit` - 编辑权限
- `bizSeriesDetailsDelete` - 删除权限
- `bizSeriesDetailsBatchDelete` - 批量删除权限

## 使用说明

### 1. 列表页面功能
- **查询条件**：
  - 快速查询：支持车系名称或业务员名称搜索
  - 业务员：单选下拉框
  - 负责区域：单选下拉框
  - 链接语言：单选下拉框
  - 渠道：单选下拉框
- **操作按钮**：
  - 查询/重置按钮
  - 新增按钮
  - 批量删除按钮
- **表格列**：
  - 车系封面：显示车系封面图片
  - 车系名称：显示车系名称
  - 业务员：显示业务员名称
  - 负责区域：显示区域名称
  - 链接语言：显示链接语言
  - 渠道：显示渠道名称
  - 操作：编辑和删除

### 2. 表单页面功能
- **必填字段**：
  - 车系：必选，下拉选择
  - 渠道：必选，下拉选择
- **其他字段**：
  - 业务员：多选下拉框
  - 业务员名称：文本输入
  - 负责区域：多选下拉框
  - 区域名称：文本输入
  - 链接语言：单选下拉框
  - 渠道名称：文本输入

### 3. 注意事项
1. 车系封面图片从车系表关联获取，不在表单中编辑
2. 多选字段（业务员IDs、区域IDs）在表单中显示为多选下拉框，存储时转换为逗号分隔的字符串
3. 链接语言选项需要配置字典项 `LINK_LANGUAGE`
4. 车系、业务员、区域、渠道的下拉选项需要调用相应的API获取

## 后端接口要求

### 分页查询接口 (`/biz/series/details/page`)
需要返回车系封面图片字段 `coverImage`，可以通过关联车系表查询获取。

### 下拉选项接口
需要提供以下下拉选项数据：
- 车系列表（包含ID和名称）
- 业务员列表（包含ID和名称）
- 区域列表（包含ID和名称）
- 渠道列表（包含ID和名称）

## 样式说明
- 车系封面图片显示为80x60像素，保持比例裁剪
- 表格操作列宽度为150px
- 表单采用两列布局，每行两个字段