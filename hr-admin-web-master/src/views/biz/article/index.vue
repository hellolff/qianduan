<template>
	<a-card :bordered="false">
		<a-form ref="searchFormRef" name="advanced_search" :model="searchFormState" class="ant-advanced-search-form">
			<a-row :gutter="24">
				<a-col :span="6">
					<a-form-item label="文章标题" name="title">
						<a-input v-model:value="searchFormState.title" placeholder="请输入文章标题" />
					</a-form-item>
				</a-col>
				<a-col :span="6">
					<a-form-item label="文章类型" name="articleType">
						<a-select v-model:value="searchFormState.articleType" placeholder="请选择文章类型" :options="articleTypeOptions" />
					</a-form-item>
				</a-col>
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
					<a-button type="primary" @click="formRef.onOpen()" v-if="hasPerm('bizArticleAdd')">
						<template #icon><plus-outlined /></template>
						新增
					</a-button>
					<xn-batch-button
						v-if="hasPerm('bizArticleBatchDelete')"
						buttonName="批量删除"
						icon="DeleteOutlined"
						:selectedRowKeys="selectedRowKeys"
						@batchCallBack="deleteBatchBizArticle"
					/>
				</a-space>
			</template>
			<template #bodyCell="{ column, record }">
				<template v-if="column.dataIndex === 'articleType'">
					{{ $TOOL.dictTypeData('ARTICLE_TYPE', record.articleType) }}
				</template>
				<template v-if="column.dataIndex === 'isTop'">
					<a-switch
						:loading="loading2"
						:checked="record.isTop === 'YES'"
						@change="editIsTopStatus(record)"
					/>
				</template>
				<template v-if="column.dataIndex === 'coverImage'">
					<a-image :src="record.coverImage" style="width: 100px; height: 100px;" />
				</template>
				<template v-if="column.dataIndex === 'publishStatus'">
					<a-switch
						:loading="loading"
						:checked="record.publishStatus === 'YES'"
						@change="editStatus(record)"
					/>
				</template>
				<template v-if="column.dataIndex === 'recStatus'">
					<a-switch
						:loading="loading1"
						:checked="record.recStatus === 'YES'"
						@change="editRecStatus(record)"
					/>
				</template>
				<template v-if="column.dataIndex === 'action'">
					<a-space>
						<a @click="formRef.onOpen(record)" v-if="hasPerm('bizArticleEdit')">编辑</a>
						<a-divider type="vertical" v-if="hasPerm(['bizArticleEdit', 'bizArticleDelete'], 'and')" />
						<a-popconfirm title="确定要删除吗？" @confirm="deleteBizArticle(record)">
							<a-button type="link" danger size="small" v-if="hasPerm('bizArticleDelete')">删除</a-button>
						</a-popconfirm>
					</a-space>
				</template>
			</template>
		</s-table>
	</a-card>
	<Form ref="formRef" @successful="tableRef.refresh()" />
</template>

<script setup name="article">
	import tool from '@/utils/tool'
	import { cloneDeep } from 'lodash-es'
	import Form from './form.vue'
	import bizArticleApi from '@/api/biz/bizArticleApi'
	import bizRecruitmentApi from "@/api/biz/bizRecruitmentApi";
	import { ref } from "vue";
	const searchFormState = ref({})
	const searchFormRef = ref()
	const tableRef = ref()
	const formRef = ref()
	const loading = ref(false)
	const loading1 = ref(false)
	const loading2 = ref(false)
	const toolConfig = { refresh: true, height: true, columnSetting: true, striped: false }
	// 查询区域显示更多控制
	const advanced = ref(false)
	const toggleAdvanced = () => {
		advanced.value = !advanced.value
	}
	const columns = [
		{
			title: '文章类型',
			dataIndex: 'articleType'
		},
		{
			title: '封面图',
			dataIndex: 'coverImage'
		},
		{
			title: '文章标题',
			dataIndex: 'title'
		},
		{
			title: '文章副标题',
			dataIndex: 'subtitle'
		},
		{
			title: '作者',
			dataIndex: 'author'
		},
		{
			title: '发布日期',
			dataIndex: 'publishDate'
		},
		{
			title: '真实点击',
			dataIndex: 'realClick'
		},
		{
			title: '发布状态',
			dataIndex: 'publishStatus'
		},
		// {
		// 	title: '虚拟点击量',
		// 	dataIndex: 'virtualClick'
		// },
		{
			title: '首页推荐',
			dataIndex: 'recStatus'
		},
		{
			title: '是否置顶',
			dataIndex: 'isTop'
		}
	]
	// 操作栏通过权限判断是否显示
	if (hasPerm(['bizArticleEdit', 'bizArticleDelete'])) {
		columns.push({
			title: '操作',
			dataIndex: 'action',
			align: 'center',
			width: 150
		})
	}
	const editStatus = (record) => {
		loading.value = true
		const formDataParam = {
			id: record.id,
			publishStatus: record.publishStatus === 'YES' ? 'NO' : 'YES'
		}
		bizArticleApi
			.bizArticleSubmitForm(formDataParam, true)
			.then(() => {
				tableRef.value.refresh()
			})
			.finally(() => {
				loading.value = false
			})
	}
	const editRecStatus = (record) => {
		loading1.value = true
		const formDataParam = {
			id: record.id,
			recStatus: record.recStatus === 'YES' ? 'NO' : 'YES'
		}
		bizArticleApi
			.bizArticleSubmitForm(formDataParam, true)
			.then(() => {
				tableRef.value.refresh()
			})
			.finally(() => {
				loading1.value = false
			})
	}
	const editIsTopStatus = (record) => {
		loading2.value = true
		const formDataParam = {
			id: record.id,
			isTop: record.isTop === 'YES' ? 'NO' : 'YES'
		}
		bizArticleApi
			.bizArticleSubmitForm(formDataParam, true)
			.then(() => {
				tableRef.value.refresh()
			})
			.finally(() => {
				loading2.value = false
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
		return bizArticleApi.bizArticlePage(Object.assign(parameter, searchFormParam)).then((data) => {
			return data
		})
	}
	// 重置
	const reset = () => {
		searchFormRef.value.resetFields()
		tableRef.value.refresh(true)
	}
	// 删除
	const deleteBizArticle = (record) => {
		let params = [
			{
				id: record.id
			}
		]
		bizArticleApi.bizArticleDelete(params).then(() => {
			tableRef.value.refresh(true)
		})
	}
	// 批量删除
	const deleteBatchBizArticle = (params) => {
		bizArticleApi.bizArticleDelete(params).then(() => {
			tableRef.value.clearRefreshSelected()
		})
	}
	const articleTypeOptions = tool.dictList('ARTICLE_TYPE')
	const publishStatusOptions = tool.dictList('PUBLISH_STATUS')
</script>
