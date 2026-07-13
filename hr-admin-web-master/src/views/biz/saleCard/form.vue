<template>
	<xn-form-container
		:title="formData.id ? '编辑销售卡片表' : '增加销售卡片表'"
		:width="700"
		v-model:open="open"
		:destroy-on-close="true"
		@close="onClose"
	>
		<a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
			<a-row :gutter="16">
				<a-col :span="12">
					<a-form-item label="姓名：" name="name">
						<a-input v-model:value="formData.name" placeholder="请输入姓名" allow-clear />
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="电话：" name="phone">
						<a-input v-model:value="formData.phone" placeholder="请输入电话" allow-clear />
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="16">
				<a-col :span="12">
					<a-form-item label="邮箱：" name="email">
						<a-input v-model:value="formData.email" placeholder="请输入邮箱" allow-clear />
					</a-form-item>
				</a-col>
				<a-col :span="12">
					<a-form-item label="排序码：" name="sortCode">
						<a-input v-model:value="formData.sortCode" placeholder="请输入排序码越小越前" allow-clear />
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="16">
				<a-col :span="12">
					<a-form-item label="状态：" name="status">
						<a-radio-group v-model:value="formData.status" placeholder="请选择状态" :options="statusOptions" />
					</a-form-item>
				</a-col>
			</a-row>
		</a-form>
		<template #footer>
			<a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
			<a-button type="primary" @click="onSubmit" :loading="submitLoading">保存</a-button>
		</template>
	</xn-form-container>
</template>

<script setup name="bizSaleCardForm">
	import tool from '@/utils/tool'
	import { cloneDeep } from 'lodash-es'
	import { required } from '@/utils/formRules'
	import bizSaleCardApi from '@/api/biz/bizSaleCardApi'
	// 抽屉状态
	const open = ref(false)
	const emit = defineEmits({ successful: null })
	const formRef = ref()
	// 表单数据
	const formData = ref({
		status: 'ENABLE',
		sortCode: 99
	})
	const submitLoading = ref(false)
	const statusOptions = ref([])

	// 打开抽屉
	const onOpen = (record) => {
		open.value = true
		if (record) {
			let recordData = cloneDeep(record)
			formData.value = Object.assign({}, recordData)
		} else {
			formData.value = {
				status: 'ENABLE',
				sortCode: 99
			}
		}
		statusOptions.value = tool.dictList('COMMON_STATUS')
	}
	// 关闭抽屉
	const onClose = () => {
		formRef.value.resetFields()
		formData.value = {}
		open.value = false
	}
	// 默认要校验的
	const formRules = {
		name: [required('请输入姓名')],
		phone: [required('请输入电话')],
		email: [required('请输入邮箱')]
	}
	// 验证并提交数据
	const onSubmit = () => {
		formRef.value
			.validate()
			.then(() => {
				submitLoading.value = true
				const formDataParam = cloneDeep(formData.value)
				bizSaleCardApi
					.bizSaleCardSubmitForm(formDataParam, formDataParam.id)
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
