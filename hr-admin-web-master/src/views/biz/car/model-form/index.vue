<template>
	<xn-form-container
		:title="formData.id ? '编辑车型表' : '增加车型表'"
		:width="700"
		v-model:open="open"
		:destroy-on-close="true"
		@close="onClose"
	>
		<a-form ref="formRef" :model="formData" :rules="formRules" layout="vertical">
			<a-row :gutter="16">
				<a-col :span="8">
					<a-form-item label="车型品牌：" name="brandId">
						<a-select
							v-model:value="formData.brandId"
							placeholder="请选择车型品牌"
							:options="brandOptions"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="最新状态：" name="newStatus">
						<a-select
							v-model:value="formData.newStatus"
							placeholder="请选择推荐状态"
							:options="newStatusOptions"
						/>
					</a-form-item>
				</a-col>
				<a-col :span="8">
					<a-form-item label="最热状态：" name="hotStatus">
						<a-select
							v-model:value="formData.hotStatus"
							placeholder="请选择最热状态"
							:options="hotStatusOptions"
						/>
					</a-form-item>
				</a-col>
			</a-row>
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
			<a-form-item :label="`车型名称（${currentLocale}）`" :name="`i18n_name_${currentLocale}`">
				<a-input
					v-model:value="formI18n.value"
					placeholder="请输入车型名称"
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

<script setup name="bizCarSeriesForm">
	import tool from '@/utils/tool'
	import { cloneDeep } from 'lodash-es'
	import bizBrandApi from '@/api/biz/bizBrandApi'
	import { ref, computed } from 'vue'
	import { message } from 'ant-design-vue'
	import bizCarModelApi from '@/api/biz/bizCarModelApi'
	// 抽屉状态
	const open = ref(false)
	const emit = defineEmits({ successful: null })
	const formRef = ref()
	// 表单数据
	const formData = ref({})
	const submitLoading = ref(false)
	const newStatusOptions = ref([])
	const hotStatusOptions = ref([])
	const brandOptions = ref([])
	const supportLanguageOptions = ref([])
	// 语言相关
	const currentLocale = ref('') // e.g. 'zh-CN'
	// 打开抽屉
	const onOpen = (record, brandId) => {
		open.value = true
		// 加载字典项
		newStatusOptions.value = tool.dictList('REC_STATUS')
		hotStatusOptions.value = tool.dictList('REC_STATUS')
		supportLanguageOptions.value = tool.dictList('LANGUAGE_TYPE')
		// 默认语言为第一个
		if (supportLanguageOptions.value && supportLanguageOptions.value.length > 0) {
			currentLocale.value = supportLanguageOptions.value[0].value
		}
		// 初始化表单
		if (record) {
			const data = cloneDeep(record)
			if (!data.i18n) data.i18n = {}
			// 兼容后端返回的 translationsJson 字段（可能为字符串或对象或数组）
			const fillFromTranslationsJson = (maybe) => {
				if (!maybe) return
				try {
					const parsed = typeof maybe === 'string' ? JSON.parse(maybe) : maybe
					// 支持数组 [ {locale, value,}, ... ]
					if (Array.isArray(parsed)) {
						parsed.forEach((it) => {
							if (it && it.locale) {
								data.i18n[it.locale] = {
									value: it.value || '',
									_edited: true,
									_autoFilled: false
								}
							}
						})
					}
				} catch (e) {
					// 解析失败则忽略
					console.warn('parse translationsJson failed', e)
				}
			}
			if (data.nameJson) {
				fillFromTranslationsJson(data.nameJson)
			}
			formData.value = Object.assign({}, data)
		} else {
			// 新建默认值 - 正确使用传入的 brandId
			formData.value = {
				brandId: brandId || '',
				nameJson: '',
				newStatus: 'NO',
				hotStatus: 'NO',
				i18n: {}
			}
		}
		getBrandList()
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
	const getBrandList = () => {
		bizBrandApi.bizBrandList({}).then((res) => {
			brandOptions.value = res.map((it) => ({
				value: it.id,
				label: it.brandName
			}))
		})
	}
	// 表单校验规则（非语言字段）
	const formRules = {
		carSeriesImage: [{ required: true, message: '封面图不能为空' }],
		brandId: [{ required: true, message: '车型品牌不能为空' }],
		recStatus: [{ required: true, message: '推荐状态不能为空' }]
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
	// 提交：把 i18n 转为数组并序列化到 translationsJson 字段（字符串）
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
						message.error(`请填写 ${supportLanguageOptions.value[0].label} 的车型名称`)
						return
					}
				}
				submitLoading.value = true
				const formDataParam = cloneDeep(formData.value)
				// build array [{locale,value}, ...]
				const translationsArr = []
				if (formDataParam.i18n) {
					for (const [locale, val] of Object.entries(formDataParam.i18n)) {
						if (!val) continue
						// 只有当 value 或  有值时才添加
						if (val.value && val.value.trim()) {
							translationsArr.push({
								locale,
								value: val.value || ''
							})
							if (locale === defaultLocale) {
								formDataParam.modelName = val.value
							}
						}
					}
				}
				// 序列化为字符串字段 translationsJson（后端按字符串解析）
				formDataParam.nameJson = JSON.stringify(translationsArr)
				try {
					await bizCarModelApi.bizCarModelSubmitForm(formDataParam, formDataParam.id)
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
