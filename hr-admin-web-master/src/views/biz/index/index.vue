<template>
	<a-row :gutter="10">
		<!-- 左侧 -->
		<a-col :span="24">
			<!-- 人员信息 -->
			<sys-user-info-card class="mb-2" />
<!--			<a-row :gutter="10" class="mt-2">-->
<!--				<a-col :span="24">-->
<!--					&lt;!&ndash; 快捷方式 &ndash;&gt;-->
<!--					<biz-shortcut-card />-->
<!--				</a-col>-->
<!--			</a-row>-->
<!--			<a-row :gutter="10" class="mt-2">-->
<!--				<a-col :span="12">-->
<!--					&lt;!&ndash; 通知公告 &ndash;&gt;-->
<!--					<biz-notice-card />-->
<!--				</a-col>-->
<!--				<a-col :span="12">-->
<!--					&lt;!&ndash; 站内信息 &ndash;&gt;-->
<!--					<biz-mini-message-card />-->
<!--				</a-col>-->
<!--			</a-row>-->
		</a-col>
		<!-- 右侧 -->
<!--		<a-col :span="8">-->
<!--			&lt;!&ndash; 轮播图 &ndash;&gt;-->
<!--			<biz-slideshow-card :config="slideshowConfig" />-->
<!--			&lt;!&ndash; 我的日程 &ndash;&gt;-->
<!--			<biz-schedule-card />-->
<!--		</a-col>-->
	</a-row>
</template>

<script setup name="bizIndex">
	// 轮播图组件的配置，在业务首页下，获取对应位置的
	const slideshowConfig = {
		options: {
			place: 'BACK_INDEX'
		}
	}
</script>
