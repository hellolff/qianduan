<template>
	<a-card :bordered="false">
		<a-form ref="searchFormRef" name="advanced_search" :model="searchFormState" class="ant-advanced-search-form">
			<a-row :gutter="24">
				<a-col :span="6">
					<a-form-item label="发布状态" name="publishStatus">
						<a-select v-model:value="searchFormState.publishStatus" placeholder="请选择发布状态" :options="publishStatusOptions" />
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-button type="primary" @click="tableRef.refresh()">查询</a-button>
					<a-button style="margin: 0 8px" @click="reset">重置</a-button>
				</a-col>
			</a-row>
		</a-form>
		<s-table
			ref="tableRef"
			:columns="columns"
			:data="loadData"
			:alert="options.alert.show"
			bordered
			:row-key="(record) => record.id"
			:tool-config="toolConfig"
			:row-selection="options.rowSelection"
		>
			<template #operator class="table-operator">
				<a-space>
					<a-button type="primary" @click="formRef.onOpen()" v-if="hasPerm('bizDevelopHistoryAdd')">
						<template #icon><plus-outlined /></template>
						新增
					</a-button>
					<xn-batch-button
						v-if="hasPerm('bizDevelopHistoryBatchDelete')"
						buttonName="批量删除"
                        icon="DeleteOutlined"
						:selectedRowKeys="selectedRowKeys"
						@batchCallBack="deleteBatchBizDevelopHistory"
					/>
				</a-space>
			</template>
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'publishStatus'">
					{{ $TOOL.dictTypeData('PUBLISH_STATUS', record.publishStatus) }}
				</template>
				<template v-if="column.dataIndex === 'action'">
					<a-space>
						<a @click="formRef.onOpen(record)" v-if="hasPerm('bizDevelopHistoryEdit')">编辑</a>
						<a-divider type="vertical" v-if="hasPerm(['bizDevelopHistoryEdit', 'bizDevelopHistoryDelete'], 'and')" />
						<a-popconfirm title="确定要删除吗？" @confirm="deleteBizDevelopHistory(record)">
							<a-button type="link" danger size="small" v-if="hasPerm('bizDevelopHistoryDelete')">删除</a-button>
						</a-popconfirm>
					</a-space>
				</template>
			</template>
		</s-table>
	</a-card>
	<Form ref="formRef" @successful="tableRef.refresh()" />
</template>

<script setup name="developHistory">
	import { cloneDeep } from 'lodash-es'
	import Form from './form.vue'
	import bizDevelopHistoryApi from '@/api/biz/bizDevelopHistoryApi'
	import tool from "@/utils/tool";
	const searchFormState = ref({})
	const searchFormRef = ref()
	const tableRef = ref()
	const formRef = ref()
	const toolConfig = { refresh: true, height: true, columnSetting: true, striped: false }
	const columns = [
		{
			title: '标题',
			dataIndex: 'title'
		},
		{
			title: '内容',
			dataIndex: 'content',
			customRender: ({ text }) => {
				try {
					const arr = JSON.parse(text || '[]')
					return h(
						'div',
						arr.map((item) => h('div', { class: 'content-line' }, item))
					)
				} catch (e) {
					return h('span', text)
				}
			}
		},
		{
			title: '发布状态',
			dataIndex: 'publishStatus'
		},
		{
			title: '排序',
			dataIndex: 'sort'
		},
	]
	// 操作栏通过权限判断是否显示
	if (hasPerm(['bizDevelopHistoryEdit', 'bizDevelopHistoryDelete'])) {
		columns.push({
			title: '操作',
			dataIndex: 'action',
			align: 'center',
			width: 150
		})
	}
	const selectedRowKeys = ref([])
	// 列表选择配置
	const options = {
		// columns数字类型字段加入 needTotal: true 可以勾选自动算账
		alert: {
			show: true,
			clear: () => {
				selectedRowKeys.value = ref([])
			}
		},
		rowSelection: {
			onChange: (selectedRowKey, selectedRows) => {
				selectedRowKeys.value = selectedRowKey
			}
		}
	}
	const loadData = (parameter) => {
		const searchFormParam = cloneDeep(searchFormState.value)
		return bizDevelopHistoryApi.bizDevelopHistoryPage(Object.assign(parameter, searchFormParam)).then((data) => {
			return data
		})
	}
	// 重置
	const reset = () => {
		searchFormRef.value.resetFields()
		tableRef.value.refresh(true)
	}
	// 删除
	const deleteBizDevelopHistory = (record) => {
		let params = [
			{
				id: record.id
			}
		]
		bizDevelopHistoryApi.bizDevelopHistoryDelete(params).then(() => {
			tableRef.value.refresh(true)
		})
	}
	// 批量删除
	const deleteBatchBizDevelopHistory = (params) => {
		bizDevelopHistoryApi.bizDevelopHistoryDelete(params).then(() => {
			tableRef.value.clearRefreshSelected()
		})
	}
	const publishStatusOptions = tool.dictList('PUBLISH_STATUS')
</script>
