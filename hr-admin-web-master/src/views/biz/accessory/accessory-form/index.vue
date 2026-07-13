<template>
	<xn-form-container
		:title="formData.id ? '编辑配件表' : '增加配件表'"
		:width="700"
		v-model:open="open"
		:destroy-on-close="true"
		@close="onClose"
	>
		<a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
			<a-form-item label="封面图：" name="coverImage">
				<xn-upload v-model:value="formData.coverImage" uploadMode="image" :maxCount="1" />
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

			<!-- 多语言名称（每个 tab 对应一个语言） -->
			<a-form-item :label="`配件名称（${currentLocale}）`" :name="`i18n_name_${currentLocale}`">
				<a-input
					v-model:value="formI18n.value"
					placeholder="请输入配件名称"
					allow-clear
					@input="markEdited"
				/>
			</a-form-item>

			<a-form-item label="发布状态：" name="publishStatus">
				<a-select
					v-model:value="formData.publishStatus"
					placeholder="请选择发布状态"
					:options="publishStatusOptions"
				/>
			</a-form-item>
		</a-form>

		<template #footer>
			<a-button style="margin-right: 8px" @click="onClose">关闭</a-button>
			<a-button type="primary" @click="onSubmit" :loading="submitLoading">保存</a-button>
		</template>
	</xn-form-container>
</template>

<script setup name="bizAccessoryForm">
	import tool from '@/utils/tool'
	import { cloneDeep } from 'lodash-es'
	import bizAccessoryApi from '@/api/biz/bizAccessoryApi'
	import { ref, computed } from 'vue'
	import { message } from 'ant-design-vue'

	// 抽屉状态
	const open = ref(false)
	const emit = defineEmits({ successful: null })
	const formRef = ref()

	// 表单数据
	const formData = ref({})
	const submitLoading = ref(false)
	const categoryIdOptions = ref([])
	const publishStatusOptions = ref([])
	const supportLanguageOptions = ref([])
	// 语言相关
	const currentLocale = ref('') // e.g. 'zh-CN'
	// 打开抽屉
	const onOpen = (record, categoryId) => {
		open.value = true
		// 加载字典项
		categoryIdOptions.value = tool.dictList('ARTICLE_TYPE')
		publishStatusOptions.value = tool.dictList('PUBLISH_STATUS')
		supportLanguageOptions.value = tool.dictList('LANGUAGE_TYPE')
		// 默认语言为第一个
		if (supportLanguageOptions.value && supportLanguageOptions.value.length > 0) {
			currentLocale.value = supportLanguageOptions.value[0].value
		}

		// 初始化表单
		if (record) {
			const data = cloneDeep(record)
			if (!data.i18n) data.i18n = {}

			// 兼容后端返回的 nameJson/name_json/name 字段（可能为字符串或对象或数组）
			const fillFromNameJson = (maybe) => {
				if (!maybe) return
				try {
					const parsed = typeof maybe === 'string' ? JSON.parse(maybe) : maybe
					// 支持数组 [ {locale, value}, ... ] 或 对象 { "zh-CN": "内饰", ... }
					if (Array.isArray(parsed)) {
						parsed.forEach((it) => {
							if (it && it.locale) {
								data.i18n[it.locale] = { value: it.value || '', _edited: true, _autoFilled: false }
							}
						})
					} else if (typeof parsed === 'object') {
						Object.keys(parsed).forEach((k) => {
							data.i18n[k] = { value: parsed[k] || '', _edited: true, _autoFilled: false }
						})
					}
				} catch (e) {
					// 解析失败则忽略
					console.warn('parse nameJson failed', e)
				}
			}

			if (data.nameJson) {
				fillFromNameJson(data.nameJson)
			}
			formData.value = Object.assign({}, data)
		} else {
			// 新建默认值 - 正确使用传入的 categoryId
			formData.value = {
				categoryId: categoryId || '',
				coverImage: '',
				nameJson: '',
				publishStatus: 'YES',
				i18n: {}
			}
		}

		// 确保每个语言占位
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
		coverImage: [{ required: true, message: '封面图不能为空' }]
	}

	// helpers：确保 i18n 存在每个语言占位
	const ensureAllLocales = () => {
		if (!formData.value.i18n) formData.value.i18n = {}
		;(supportLanguageOptions.value || []).forEach((opt) => {
			getI18nForLocale(opt.value)
		})
	}

	// 获取/创建 locale 的 i18n 对象
	const getI18nForLocale = (locale) => {
		if (!formData.value.i18n) formData.value.i18n = {}
		if (!formData.value.i18n[locale]) {
			formData.value.i18n[locale] = {
				value: '',
				_edited: false,
				_autoFilled: false
			}
		}
		return formData.value.i18n[locale]
	}

	// 当前 tab 对应的 i18n（用于 v-model）
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

	// 标记当前语言已编辑（防止未来覆盖）
	const markEdited = () => {
		if (!currentLocale.value) return
		const o = getI18nForLocale(currentLocale.value)
		o._edited = true
	}

	// 提交：把 i18n 转为数组并序列化到 nameJson 字段（字符串）
	const onSubmit = () => {
		formRef.value
			.validate()
			.then(async () => {
				// 校验默认语言必须填写名称
				const defaultLocale =
					supportLanguageOptions.value && supportLanguageOptions.value.length > 0
						? supportLanguageOptions.value[0].value
						: null
				if (defaultLocale) {
					const defaultObj = getI18nForLocale(defaultLocale)
					if (!defaultObj || !defaultObj.value || !defaultObj.value.trim()) {
						message.error(`请填写 ${supportLanguageOptions.value[0].label} 的配件名称`)
						return
					}
				}

				submitLoading.value = true
				const formDataParam = cloneDeep(formData.value)

				// build array [{locale,value}, ...]
				const arr = []
				if (formDataParam.i18n) {
					for (const [locale, val] of Object.entries(formDataParam.i18n)) {
						if (!val) continue
						if (val.value && val.value.trim()) {
							arr.push({ locale, value: val.value })
							if (locale === defaultLocale) {
								formDataParam.name = val.value
							}
						}
					}
				}
				// 序列化为字符串字段 nameJson（后端按字符串解析）
				formDataParam.nameJson = JSON.stringify(arr)

				try {
					await bizAccessoryApi.bizAccessorySubmitForm(formDataParam, formDataParam.id)
					onClose()
					emit('successful')
				} finally {
					submitLoading.value = false
				}
			})
			.catch(() => {
				// 验证失败
			})
	}

	// 抛出方法给外部使用
	defineExpose({
		onOpen
	})
</script>
