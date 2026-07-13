<template>
	<xn-form-container
		:title="formData.id ? '编辑品牌' : '增加品牌'"
		:width="500"
		v-model:open="open"
		:destroy-on-close="true"
		@close="onClose"
	>
		<a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
			<a-form-item label="品牌图片：" name="brandImage">
				<xn-upload v-model:value="formData.brandImage" uploadMode="image" :maxCount="1" />
			</a-form-item>
			<!-- 语言 Tabs -->
			<a-row :gutter="16" style="margin-bottom: 12px">
				<a-col :span="24">
					<a-tabs v-model:activeKey="currentLocale">
						<a-tab-pane
							v-for="opt in supportLanguageOptions"
							:key="opt.value"
							:tab="opt.label"
						/>
					</a-tabs>
				</a-col>
			</a-row>

			<!-- 多语言分类名称 -->
			<a-form-item :label="`品牌名称（${currentLocale}）`" :name="`i18n_name_${currentLocale}`">
				<a-input
					v-model:value="formI18n.value"
					placeholder="请输入品牌名称"
					allow-clear
					@input="markEdited"
				/>
			</a-form-item>
		</a-form>

		<template #footer>
			<a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
			<a-button type="primary" @click="onSubmit" :loading="submitLoading">保存</a-button>
		</template>
	</xn-form-container>
</template>

<script setup name="bizBrandForm">
	import tool from '@/utils/tool'
	import { cloneDeep } from 'lodash-es'
	import { required } from '@/utils/formRules'
	import bizBrandApi from '@/api/biz/bizBrandApi'
	import { ref, computed } from 'vue'
	import { message } from 'ant-design-vue'
	// 抽屉状态
	const open = ref(false)
	const emit = defineEmits({ successful: null })
	const formRef = ref()
	// 表单数据
	const formData = ref({})
	const submitLoading = ref(false)
	const publishStatusOptions = ref([])
	const supportLanguageOptions = ref([])
	// 语言相关
	const currentLocale = ref('') // 当前 tab 的 locale，例如 'zh-CN'
	// 打开抽屉
	const onOpen = (record) => {
		open.value = true
		// 初始化字典项
		publishStatusOptions.value = tool.dictList('PUBLISH_STATUS')
		supportLanguageOptions.value = tool.dictList('LANGUAGE_TYPE')
		// 设置默认当前语言为第一个（通常是中文）
		if (supportLanguageOptions.value && supportLanguageOptions.value.length > 0) {
			currentLocale.value = supportLanguageOptions.value[0].value
		}
		// 初始化表单
		if (record) {
			let recordData = cloneDeep(record)
			// 规范化 i18n：如果后端返回 nameJson（字符串/对象/数组），解析并填充 i18n
			if (!recordData.i18n) recordData.i18n = {}
			const fillFromNameJson = (maybe) => {
				if (!maybe) return
				try {
					const parsed = typeof maybe === 'string' ? JSON.parse(maybe) : maybe
					// 支持两种格式：
					// 1) 数组: [{ locale: 'en', value: 'Interior' }, ...]
					// 2) 对象: { "zh-CN": "内饰", "en": "Interior" }
					if (Array.isArray(parsed)) {
						parsed.forEach((it) => {
							if (it && it.locale) {
								recordData.i18n[it.locale] = {
									value: it.value || '',
									_edited: true,
									_autoFilled: false
								}
							}
						})
					} else if (typeof parsed === 'object') {
						Object.keys(parsed).forEach((k) => {
							recordData.i18n[k] = {
								value: parsed[k] || '',
								_edited: true,
								_autoFilled: false
							}
						})
					}
				} catch (e) {
					// ignore parse error
					console.warn('parse nameJson failed', e)
				}
			}
			// 优先解析 recordData.nameJson，然后兼容其它可能命名
			if (recordData.nameJson) {
				fillFromNameJson(recordData.nameJson)
			} else if (recordData.name_json) {
				fillFromNameJson(recordData.name_json)
			} else if (recordData.name) {
				fillFromNameJson(recordData.name)
			}
			// 其它字段直接赋值
			formData.value = Object.assign({}, recordData)
		} else {
			// 新建
			formData.value = {
				categoryType: 'INTERIOR',
				publishStatus: 'NO',
				i18n: {}
			}
		}
		// 确保每个支持的语言在 i18n 中至少有占位
		ensureAllLocales()
	}
	// 关闭抽屉
	const onClose = () => {
		if (formRef.value && formRef.value.resetFields) {
			formRef.value.resetFields()
		}
		formData.value = {}
		open.value = false
	}
	// 表单校验规则（非语言字段）
	const formRules = {
		publishStatus: [required('请选择发布状态')]
	}
	// helpers: 保证 i18n 中存在每个语言占位对象
	const ensureAllLocales = () => {
		if (!formData.value.i18n) {
			formData.value.i18n = {}
		}
		;(supportLanguageOptions.value || []).forEach((opt) => {
			getI18nForLocale(opt.value)
		})
	}
	// 获取/创建某 locale 的 i18n 对象
	const getI18nForLocale = (locale) => {
		if (!formData.value.i18n) formData.value.i18n = {}
		if (!formData.value.i18n[locale]) {
			formData.value.i18n[locale] = {
				value: '',
				_edited: false, // 用户是否手动修改过
				_autoFilled: false // 以前自动填充标识（现在无自动填充，仅保留兼容）
			}
		}
		return formData.value.i18n[locale]
	}
	// 当前 tab 对应的 i18n 对象（用于模板双向绑定）
	const formI18n = computed({
		get() {
			if (!currentLocale.value) return { value: '' }
			return getI18nForLocale(currentLocale.value)
		},
		set(val) {
			if (!currentLocale.value) return
			formData.value.i18n = formData.value.i18n || {}
			formData.value.i18n[currentLocale.value] = Object.assign(getI18nForLocale(currentLocale.value), val)
		}
	})
	// 标记当前语言已被用户编辑（用于阻止未来可能的覆盖）
	const markEdited = () => {
		if (!currentLocale.value) return
		const o = getI18nForLocale(currentLocale.value)
		o._edited = true
	}
	// 验证并提交数据（整合 nameJson 字符串）
	const onSubmit = () => {
		formRef.value
			.validate()
			.then(async () => {
				// 校验默认语言必须有分类名称
				const defaultLocale =
					supportLanguageOptions.value && supportLanguageOptions.value.length > 0
						? supportLanguageOptions.value[0].value
						: null
				if (defaultLocale) {
					const defaultObj = getI18nForLocale(defaultLocale)
					if (!defaultObj || !defaultObj.value || !defaultObj.value.trim()) {
						message.error(`请填写 ${supportLanguageOptions.value[0].label} 的分类名称`)
						return
					}
				}
				submitLoading.value = true
				const formDataParam = cloneDeep(formData.value)
				// 将 i18n 转换为数组形式并序列化为字符串，写入 nameJson
				const arr = []
				if (formDataParam.i18n) {
					for (const [locale, val] of Object.entries(formDataParam.i18n)) {
						if (!val) continue
						if (val.value && val.value.trim()) {
							arr.push({
								locale,
								value: val.value
							})
							if (locale === defaultLocale) {
								formDataParam.brandName = val.value
							}
						}
					}
				}
				// 将数组序列化为字符串字段，后端可以按 List<Localized> 解析
				formDataParam.nameJson = JSON.stringify(arr)
				try {
					// 注意：bizBrandSubmitForm 接收整个 form 对象，后端根据 nameJson 字段存库
					await bizBrandApi.bizBrandSubmitForm(formDataParam, formDataParam.id)
					onClose()
					emit('successful')
				} finally {
					submitLoading.value = false
				}
			})
			.catch(() => {
				// 校验失败
			})
	}
	// 抛出函数
	defineExpose({
		onOpen
	})
</script>
