<template>
	<xn-form-container
		:title="formData.id ? '编辑招聘' : '增加招聘'"
		:width="1200"
		v-model:open="open"
		:destroy-on-close="true"
		@close="onClose"
	>
		<a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
			<a-row :gutter="16">
				<a-col :span="8">
					<a-form-item label="招聘岗位：" name="jobTitle">
						<a-input v-model:value="formData.jobTitle" placeholder="请输入招聘岗位" allow-clear />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="招聘部门：" name="department">
						<a-input v-model:value="formData.department" placeholder="请输入招聘部门" allow-clear />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="工作城市：" name="workCity">
						<a-input v-model:value="formData.workCity" placeholder="请输入工作城市" allow-clear />
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="16">
				<a-col :span="8">
					<a-form-item label="招聘人数：" name="recruitmentNumber">
						<a-input-number
							v-model:value="formData.recruitmentNumber"
							placeholder="请输入招聘人数"
							:min="1"
							:max="10000"
							style="width: 100%"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="接收邮箱：" name="contactEmail">
						<a-input v-model:value="formData.contactEmail" placeholder="请输入接收邮箱" allow-clear />
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="发布状态：" name="publishStatus">
						<a-select v-model:value="formData.publishStatus" placeholder="请选择发布状态" :options="publishStatusOptions" />
					</a-form-item>
				</a-col>
			</a-row>
<!--			<a-form-item label="部门：" name="department">-->
<!--				<a-tree-select-->
<!--					v-model:value="formData.department"-->
<!--					class="xn-wd"-->
<!--					:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"-->
<!--					placeholder="请选择部门"-->
<!--					allow-clear-->
<!--					tree-default-expand-all-->
<!--					:tree-data="treeData"-->
<!--					:tree-default-expanded-keys="treeDefaultExpandedKeys"-->
<!--					:field-names="{-->
<!--										children: 'children',-->
<!--										label: 'name',-->
<!--										value: 'id'-->
<!--									}"-->
<!--					@change="selePositionData(formData.orgId, 0)"-->
<!--				/>-->
<!--			</a-form-item>-->
			<a-row :gutter="16">
				<a-col :span="24">
					<a-form-item label="岗位职责：" name="jobResponsibilities">
						<xn-editor v-model:value="formData.jobResponsibilities" placeholder="请输入岗位职责" />
					</a-form-item>
				</a-col>
			</a-row>
			<a-row :gutter="16">
				<a-col :span="24">
					<a-form-item label="岗位要求：" name="jobRequirements">
						<xn-editor v-model:value="formData.jobRequirements" placeholder="请输入岗位要求" />
					</a-form-item>
				</a-col>
			</a-row>
<!--			<a-form-item label="截止日期：" name="deadline">-->
<!--				<a-date-picker v-model:value="formData.deadline" value-format="YYYY-MM-DD" placeholder="请选择截止日期" style="width: 100%" />-->
<!--			</a-form-item>-->

<!--			<a-form-item label="是否置顶：" name="isTop">-->
<!--				<a-select v-model:value="formData.isTop" placeholder="请选择是否置顶" :options="isTopOptions" />-->
<!--			</a-form-item>-->
		</a-form>
		<template #footer>
			<a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
			<a-button type="primary" @click="onSubmit" :loading="submitLoading">保存</a-button>
		</template>
	</xn-form-container>
</template>

<script setup name="bizRecruitmentForm">
	import tool from '@/utils/tool'
	import { cloneDeep } from 'lodash-es'
	import { required } from '@/utils/formRules'
	import bizRecruitmentApi from '@/api/biz/bizRecruitmentApi'
	import userApi from "@/api/sys/userApi";
	// 抽屉状态
	const open = ref(false)
	const emit = defineEmits({ successful: null })
	const formRef = ref()
	// 表单数据
	const formData = ref({})
	const submitLoading = ref(false)
	const isTopOptions = ref([])
	const publishStatusOptions = ref([])
	const treeData = ref([])
	const treeDefaultExpandedKeys = ref([])

	// 打开抽屉
	const onOpen = (record) => {
		open.value = true
		if (record) {
			let recordData = cloneDeep(record)
			formData.value = Object.assign({}, recordData)
		}
		isTopOptions.value = tool.dictList('TOP_STATUS')
		publishStatusOptions.value = tool.dictList('PUBLISH_STATUS')
		// nextTick(() => {
		// 	// 机构选择器数据
		// 	userApi.userOrgTreeSelector().then((res) => {
		// 		if (res !== null) {
		// 			treeData.value = res
		// 			// 默认展开2级
		// 			treeData.value.forEach((item) => {
		// 				// 因为0的顶级
		// 				if (item.parentId === '0') {
		// 					treeDefaultExpandedKeys.value.push(item.id)
		// 					// 取到下级ID
		// 					if (item.children) {
		// 						item.children.forEach((items) => {
		// 							treeDefaultExpandedKeys.value.push(items.id)
		// 						})
		// 					}
		// 				}
		// 			})
		// 		}
		// 	})
		// })
	}
	// 关闭抽屉
	const onClose = () => {
		formRef.value.resetFields()
		formData.value = {}
		treeData.value = []
		treeDefaultExpandedKeys.value = []
		open.value = false
	}
	// 默认要校验的
	const formRules = {
		jobTitle: [required('请输入招聘岗位')],
		department: [required('请选择招聘部门')],
		workCity: [required('请输入工作城市')],
		recruitmentNumber: [required('请输入招聘人数')],
		contactEmail: [required('请输入接收邮箱')],
		jobResponsibilities: [required('请输入岗位职责')],
		jobRequirements: [required('请输入岗位要求')],
		// deadline: [required('请选择截止日期')],
	}
	// 验证并提交数据
	const onSubmit = () => {
		formRef.value
			.validate()
			.then(() => {
				submitLoading.value = true
				const formDataParam = cloneDeep(formData.value)
				bizRecruitmentApi
					.bizRecruitmentSubmitForm(formDataParam, formDataParam.id)
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
