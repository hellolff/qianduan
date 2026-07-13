<template>
	<div class="biz-user-container">
		<!-- 🌟 1. 顶部全局筛选区 (挪到了最上面，横跨全屏) -->
		<a-card :bordered="false" class="global-search-card">
			<a-form ref="searchFormRef" name="advanced_search" :model="searchFormState" layout="inline">
				<a-form-item name="searchKey" label="关键词">
					<a-input
						v-model:value="searchFormState.searchKey"
						placeholder="请输入姓名或关键词"
						allow-clear
						style="width: 220px"
					/>
				</a-form-item>
				<a-form-item name="userStatus" label="用户状态">
					<a-select
						v-model:value="searchFormState.userStatus"
						placeholder="请选择状态"
						allow-clear
						style="width: 160px"
						:getPopupContainer="(trigger) => trigger.parentNode"
					>
						<a-select-option v-for="item in statusData" :key="item.value" :value="item.value">{{
							item.label
						}}</a-select-option>
					</a-select>
				</a-form-item>
				<a-form-item>
					<a-space size="middle">
						<a-button @click="reset">重置</a-button>
						<a-button type="primary" @click="tableRef.refresh(true)">查询</a-button>
					</a-space>
				</a-form-item>
			</a-form>
		</a-card>

		<!-- 下方主体区域：分为左右两块 -->
		<a-row :gutter="16" class="main-content-row">
			<!-- 🌟 2. 左侧组织架构树 -->
			<a-col :xs="24" :sm="24" :md="24" :lg="5" :xl="5">
				<a-card :bordered="false" :loading="cardLoading" class="org-tree-card">
					<a-tree
						v-if="treeData.length > 0"
						v-model:expandedKeys="defaultExpandedKeys"
						:tree-data="treeData"
						:field-names="treeFieldNames"
						@select="treeSelect"
						class="custom-biz-tree"
					>
						<template #switcherIcon="{ expanded }">
							<CaretUpOutlined v-if="expanded" class="tree-triangle-icon" />
							<CaretDownOutlined v-else class="tree-triangle-icon" />
						</template>
						<template #title="{ name }">
							<span class="tree-node-text">{{ name }}</span>
						</template>
					</a-tree>
					<a-empty v-else :image="Empty.PRESENTED_IMAGE_SIMPLE" />
				</a-card>
			</a-col>

			<!-- 🌟 3. 右侧列表与操作区 -->
			<a-col :xs="24" :sm="24" :md="24" :lg="19" :xl="19">
				<a-card :bordered="false" class="table-list-card">
					<!-- 批量操作按钮组 -->
					<div class="action-btn-group">
						<a-space>
							<a-button
								type="primary"
								@click="formRef.onOpen(undefined, searchFormState.orgId)"
								v-if="hasPerm('bizUserAdd')"
							>
								增加用户
							</a-button>
							<a-button @click="exportBatchUserVerify" v-if="hasPerm('bizUserBatchExport')">
								<template #icon><UploadOutlined /></template>
								批量导出
							</a-button>
							<xn-batch-button
								v-if="hasPerm('bizUserBatchDelete')"
								buttonName="批量删除"
								icon="DeleteOutlined"
								:selectedRowKeys="selectedRowKeys"
								@batchCallBack="deleteBatchUser"
							/>
						</a-space>
					</div>

					<!-- 数据表格 -->
					<s-table
						ref="tableRef"
						:columns="columns"
						:data="loadData"
						:expand-row-by-click="true"
						:bordered="false"
						:alert="options.alert.show"
						:tool-config="toolConfig"
						:row-key="(record) => record.id"
						:row-selection="options.rowSelection"
						class="modern-biz-table"
					>
						<template #bodyCell="{ column, record }">
							<!-- 头像单独一列 -->
							<template v-if="column.dataIndex === 'avatar'">
								<a-avatar :src="record.avatar" :size="32">
									<template #icon><UserOutlined /></template>
								</a-avatar>
							</template>

							<!-- 性别 -->
							<template v-if="column.dataIndex === 'gender'">
								<span>{{ $TOOL.dictTypeData('GENDER', record.gender) }}</span>
							</template>

							<!-- 负责区域 (带国旗的标签) -->
							<template v-if="column.dataIndex === 'regionNames'">
								<div class="region-tags-container">
									<a-tag v-for="regionName in record.regionNames || []" :key="regionName" class="flag-region-tag">
										<span class="flag-icon-emoji">{{ getFlagEmoji(regionName) }}</span>
										<span class="flag-text">{{ regionName }}</span>
									</a-tag>
									<span v-if="!record.regionNames || record.regionNames.length === 0">-</span>
								</div>
							</template>

							<!-- 状态 -->
							<template v-if="column.dataIndex === 'userStatus'">
								<a-switch
									:loading="loading"
									:checked="record.userStatus === 'ENABLE'"
									@change="editStatus(record)"
									v-if="hasPerm('bizUserUpdataStatus')"
								/>
								<span v-else>{{ $TOOL.dictTypeData('COMMON_STATUS', record.userStatus) }}</span>
							</template>

							<!-- 操作列 -->
							<template v-if="column.dataIndex === 'action'">
								<div class="table-action-links">
									<a @click="formRef.onOpen(record)" v-if="hasPerm('bizUserEdit')" class="action-edit">编辑</a>

									<a-popconfirm :title="$t('user.popconfirmDeleteUser')" @confirm="removeUser(record)">
										<a v-if="hasPerm('bizUserDelete')" class="action-delete">删除</a>
									</a-popconfirm>

									<a-dropdown v-if="hasPerm(['bizUserGrantRole', 'bizUserPwdReset', 'bizUserExportUserInfo'])">
										<a class="action-more" @click.prevent>更多</a>
										<template #overlay>
											<a-menu>
												<a-menu-item v-if="hasPerm('bizUserPwdReset')">
													<a-popconfirm
														:title="$t('user.popconfirmResatUserPwd')"
														placement="topRight"
														@confirm="resetPassword(record)"
													>
														<a>{{ $t('user.resetPassword') }}</a>
													</a-popconfirm>
												</a-menu-item>
												<a-menu-item v-if="hasPerm('bizUserGrantRole')"
													><a @click="selectRole(record)">{{ $t('user.grantRole') }}</a></a-menu-item
												>
												<a-menu-item v-if="hasPerm('bizUserExportUserInfo')"
													><a @click="exportUserInfo(record)">{{ $t('user.exportUserInfo') }}</a></a-menu-item
												>
											</a-menu>
										</template>
									</a-dropdown>
								</div>
							</template>
						</template>
					</s-table>
				</a-card>
			</a-col>
		</a-row>

		<Form ref="formRef" @successful="tableRef.refresh()" />
		<xn-role-selector
			ref="RoleSelectorPlusRef"
			:org-tree-api="selectorApiFunction.orgTreeApi"
			:role-page-api="selectorApiFunction.rolePageApi"
			:add-show="false"
			:role-global="true"
			@onBack="roleBack"
		/>
	</div>
</template>

<script setup name="bizUser">
import { ref } from 'vue'
import { message, Empty } from 'ant-design-vue'
import { UploadOutlined, UserOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons-vue'
import { isEmpty } from 'lodash-es'
import tool from '@/utils/tool'
import downloadUtil from '@/utils/downloadUtil'
import bizUserApi from '@/api/biz/bizUserApi'
import bizOrgApi from '@/api/biz/bizOrgApi'
import Form from './form.vue'

const columns = [
	{ title: '头像', dataIndex: 'avatar', align: 'center', width: '80px' },
	{ title: '姓名', dataIndex: 'name', width: '100px' },
	{ title: '性别', dataIndex: 'gender', width: '70px' },
	{ title: '手机号', dataIndex: 'phone', ellipsis: true, width: '130px' },
	{ title: '邮箱', dataIndex: 'email', ellipsis: true, width: '180px' },
	{ title: '负责区域', dataIndex: 'regionNames', width: '220px' },
	{ title: '状态', dataIndex: 'userStatus', width: '90px' }
]

if (hasPerm(['bizUserEdit', 'bizUserGrantRole', 'bizUserPwdReset', 'bizUserExportUserInfo', 'bizUserDelete'])) {
	columns.push({
		title: '操作',
		dataIndex: 'action',
		width: '160px'
	})
}

const toolConfig = { refresh: false, height: false, columnSetting: false }
const statusData = tool.dictList('COMMON_STATUS')
const searchFormRef = ref()
const defaultExpandedKeys = ref(['1'])
const searchFormState = ref({ searchKey: '', userStatus: undefined, orgId: undefined })
const tableRef = ref(null)
const selectedRowKeys = ref([])
const treeFieldNames = { children: 'children', title: 'name', key: 'id' }
const formRef = ref(null)
const RoleSelectorPlusRef = ref()
const selectedRecord = ref({})
const loading = ref(false)
const cardLoading = ref(false)

// 左侧静态树数据 (替换为你真实的子部门ID)
const treeData = ref([
	{
		id: '1',
		name: '华融联大科技有限公司',
		children: [
			{ id: '2', name: '销售部' },
			{ id: '3', name: '业务部' },
			{ id: '4', name: '人事部' },
			{ id: '5', name: '财务部' },
			{ id: '6', name: '测试部' }
		]
	}
])

const getFlagEmoji = (countryName) => {
	if (!countryName) return '🌐'
	const countryMap = { 中国: 'CN', 美国: 'US', 沙特: 'SA', 日本: 'JP', 韩国: 'KR', 英国: 'GB' }
	const code = countryMap[countryName.trim()]
	if (!code) return '🌐'
	return code
		.toUpperCase()
		.split('')
		.map((char) => 127397 + char.charCodeAt(0))
		.reduce((acc, current) => acc + String.fromCodePoint(current), '')
}

const loadData = (parameter) => {
	return bizUserApi.userPage(Object.assign(parameter, searchFormState.value)).then((res) => res)
}

const reset = () => {
	searchFormRef.value.resetFields()
	searchFormState.value.orgId = undefined
	tableRef.value.refresh(true)
}

const options = {
	alert: {
		show: false,
		clear: () => {
			selectedRowKeys.value = []
		}
	},
	rowSelection: {
		onChange: (selectedRowKey) => {
			selectedRowKeys.value = selectedRowKey
		}
	}
}

const treeSelect = (selectedKeys) => {
	if (selectedKeys.length > 0) {
		if (selectedKeys[0] === '1') {
			searchFormState.value.orgId = undefined
		} else {
			searchFormState.value.orgId = selectedKeys.toString()
		}
	} else {
		searchFormState.value.orgId = undefined
	}
	tableRef.value.refresh(true)
}

const editStatus = (record) => {
	loading.value = true
	const apiMethod = record.userStatus === 'ENABLE' ? bizUserApi.userDisableUser : bizUserApi.userEnableUser
	apiMethod(record)
		.then(() => tableRef.value.refresh())
		.finally(() => {
			loading.value = false
		})
}

const removeUser = (record) => {
	bizUserApi.userDelete([{ id: record.id }]).then(() => tableRef.value.refresh())
}

const exportBatchUserVerify = () => {
	if (selectedRowKeys.value.length < 1 && !searchFormState.value.searchKey && !searchFormState.value.userStatus) {
		message.warning('请输入查询条件或勾选要导出的信息')
		return
	}
	let params = {}
	if (selectedRowKeys.value.length > 0) {
		params.userIds = selectedRowKeys.value.join()
	} else {
		params.searchKey = searchFormState.value.searchKey
		params.userStatus = searchFormState.value.userStatus
	}
	exportBatchUser(params)
}

const exportBatchUser = (params) => {
	bizUserApi.userExport(params).then((res) => {
		downloadUtil.resultDownload(res)
		tableRef.value.clearSelected()
	})
}

const deleteBatchUser = (params) => {
	bizUserApi.userDelete(params).then(() => tableRef.value.clearRefreshSelected())
}

const selectRole = (record) => {
	selectedRecord.value = record
	bizUserApi.userOwnRole({ id: record.id }).then((data) => RoleSelectorPlusRef.value.showModel(data))
}

const roleBack = (value) => {
	let params = { id: selectedRecord.value.id, roleIdList: [] }
	if (value.length > 0)
		value.forEach((item) => {
			params.roleIdList.push(item)
		})
	bizUserApi.grantRole(params).then(() => {})
}

const resetPassword = (record) => {
	bizUserApi.userResetPassword(record).then(() => {})
}
const exportUserInfo = (record) => {
	bizUserApi.userExportUserInfo({ id: record.id }).then((res) => downloadUtil.resultDownload(res))
}

const selectorApiFunction = {
	orgTreeApi: (param) => bizUserApi.userOrgTreeSelector(param).then((orgTree) => Promise.resolve(orgTree)),
	rolePageApi: (param) => bizUserApi.userRoleSelector(param).then((data) => Promise.resolve(data))
}
</script>

<style scoped>
.biz-user-container {
	background-color: #f4f5f7;
	min-height: calc(100vh - 100px);
}

/* 全局搜索框，放在页面最上面横向平铺 */
.global-search-card {
	margin-bottom: 16px;
	border-radius: 2px;
}

.main-content-row {
	display: flex;
	align-items: stretch;
}

/* 左侧树样式 */
.org-tree-card {
	height: 100%;
	border-radius: 2px;
	padding: 10px 0;
}
:deep(.ant-tree-node-content-wrapper) {
	background-color: transparent !important;
	transition: none;
}
:deep(.ant-tree-node-content-wrapper:hover) {
	background-color: transparent !important;
}
:deep(.ant-tree-treenode) {
	padding: 12px 0 !important;
}
:deep(.ant-tree-switcher) {
	width: 18px !important;
}
:deep(.ant-tree-indent-unit) {
	width: 32px !important;
}
:deep(.ant-tree-title) {
	font-size: 14px;
	color: #333333;
}
:deep(.ant-tree-node-selected .ant-tree-title) {
	color: #1890ff !important;
}
.tree-triangle-icon {
	color: #333;
	font-size: 12px;
}
/* 让根节点（公司名）加粗一点 */
:deep(.ant-tree-treenode:first-child > .ant-tree-node-content-wrapper .tree-node-text) {
	font-weight: 600;
}
/* 表格卡片样式 */
.table-list-card {
	border-radius: 2px;
	height: 100%;
}
.action-btn-group {
	margin-bottom: 16px;
}

.region-tags-container {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
}
.flag-region-tag {
	display: inline-flex;
	align-items: center;
	gap: 4px;
	padding: 3px 8px; /* 稍微增加一点内边距 */
	background-color: #f5f5f5; /* 更柔和的底色 */
	border: none; /* 去掉边框，贴合图2 */
	border-radius: 4px;
	color: #333;
}
/* ================= 🌟 高度与底部颜色一致性修复 ================= */
/* 强制左右两边的卡片最小高度撑满屏幕，消灭底部的灰色断层 */
.org-tree-card,
.table-list-card {
	min-height: calc(100vh - 150px);
}

/* 将右侧卡片的内部设为相对定位，并给底部分页留出空间 */
:deep(.table-list-card > .ant-card-body) {
	position: relative;
	min-height: calc(100vh - 150px);
	padding-bottom: 80px !important; /* 底部留白，防止数据多时被分页器遮挡 */
}

.flag-icon-emoji {
	font-size: 14px;
}

.table-action-links {
	display: flex;
	gap: 16px;
	align-items: center;
}
.action-edit,
.action-more {
	color: #1890ff;
}
.action-delete {
	color: #ff4d4f;
}

:deep(.ant-table-thead > tr > th) {
	background-color: #fafafa;
}
</style>