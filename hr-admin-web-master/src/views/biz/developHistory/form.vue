<template>
	<xn-form-container
		:title="formData.id ? '编辑发展历程表' : '增加发展历程表'"
		:width="700"
		v-model:open="open"
		:destroy-on-close="true"
		@close="onClose"
	>
		<a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
			<a-form-item label="标题：" name="title">
				<a-input v-model:value="formData.title" placeholder="请输入标题" allow-clear />
			</a-form-item>
			<a-form-item label="内容：" name="content">
				<a-select
					v-model:value="formData.content"
					mode="tags"
					placeholder="请输入内容，按回车确认"
					:token-separators="[',']"
					allow-clear
				></a-select>
			</a-form-item>
			<a-form-item label="发布状态：" name="publishStatus">
				<a-select v-model:value="formData.publishStatus" placeholder="请选择发布状态" :options="publishStatusOptions" />
			</a-form-item>
			<a-form-item label="排序：" name="sort">
				<a-input-number v-model:value="formData.sort" placeholder="请输入排序" :min="1" :max="10000" style="width: 100%" />
			</a-form-item>
		</a-form>
		<template #footer>
			<a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
			<a-button type="primary" @click="onSubmit" :loading="submitLoading">保存</a-button>
		</template>
	</xn-form-container>
</template>

<script setup name="bizDevelopHistoryForm">
	import tool from '@/utils/tool'
	import { cloneDeep } from 'lodash-es'
	import { required } from '@/utils/formRules'
	import bizDevelopHistoryApi from '@/api/biz/bizDevelopHistoryApi'
	// 抽屉状态
	const open = ref(false)
	const emit = defineEmits({ successful: null })
	const formRef = ref()
	// 表单数据
	const formData = ref({})
	const submitLoading = ref(false)
	const publishStatusOptions = ref([])

	// 打开抽屉
	const onOpen = (record) => {
		open.value = true
		if (record) {
			let recordData = cloneDeep(record)
			// 转换JSON字符串为数组
			try {
				if (recordData.content) {
					recordData.content = JSON.parse(recordData.content)
					// 添加数组类型兜底
					if (!Array.isArray(recordData.content)) {
						recordData.content = [recordData.content]
					}
				} else {
					recordData.content = []
				}
			} catch (e) {
				console.error('内容解析失败:', e)
				recordData.content = []
			}
			formData.value = Object.assign({}, recordData)
		}
		publishStatusOptions.value = tool.dictList('PUBLISH_STATUS')
	}
	// 关闭抽屉
	const onClose = () => {
		formRef.value.resetFields()
		formData.value = {}
		open.value = false
	}
	// 默认要校验的
	const formRules = {
		title: [required('请输入标题')],
		content: [required('请输入内容')]
	}
	// 验证并提交数据
	const onSubmit = () => {
		formRef.value
			.validate()
			.then(() => {
				submitLoading.value = true
				const formDataParam = cloneDeep(formData.value)
				// 转换数组为JSON字符串
				if(Array.isArray(formDataParam.content)) {
					formDataParam.content = JSON.stringify(formDataParam.content)
				}
				bizDevelopHistoryApi
					.bizDevelopHistorySubmitForm(formDataParam, formDataParam.id)
					.then(() => {
						onClose()
						emit('successful')
					})
					.finally(() => {
						submitLoading.value = false
					})
			})
			.catch(() => {})
	}
	// 抛出函数
	defineExpose({
		onOpen
	})
</script>
