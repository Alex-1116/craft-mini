# hey-ui

## hey-progress-steps
### 本组件根据包裹div的父级宽度动态计算内部元素宽度，通过padding填充
### 本组件属于UI层面展示类型的组件
### 使用组件的时候，只需按照defaultData数据模板传入参数即可
### 本组件目前兼容app、mini、H5


### 使用示例
```
<template>
	<view>
		<hey-progress-steps :stepsData="defaultData"></hey-progress-steps>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 基础数据模板demo
				defaultData: [{
					label: "内审",
					value: 1,
					isFinish: true
				}, {
					label: "出版社反馈",
					value: 2,
					isFinish: true
				}, {
					label: "省局审核",
					value: 3,
					isFinish: true
				}, {
					label: "总局",
					value: 4,
					isFinish: false
				}, {
					label: "版号下发",
					value: 5,
					isFinish: false
				}],
			}
		},
	}
</script>

```


### 属性说明
| key                  | type           | value                 | describe        |
| -------------------- | -------------- | --------------------- | --------------- |
| label                | String         | 'text'                | 属性
| value                | Number         | '1 or []'             | 属性值
| isFinish             | Boolean        | false                 | 已完成步骤



## hey-carousel
### 本组件根据包裹div的父级宽度自动撑开
### 本组件属于UI层面展示类型的组件
### 使用组件的时候，只需按照defaultData数据模板传入参数即可
### 本组件目前兼容app、mini、H5


### 使用示例
```
<template>
	<view>
		<hey-carousel :carouselData="defaultData"></hey-carousel>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 基础数据模板demo
				defaultData: [
					{ img: 'https://t7.baidu.com/it/u=4240641596,3235181048&fm=193&f=GIF' },
					{ img: 'https://t7.baidu.com/it/u=2291349828,4144427007&fm=193&f=GIF' },
					{ img: 'https://t7.baidu.com/it/u=4036010509,3445021118&fm=193&f=GIF' }
				]
			}
		},
	}
</script>

```


### 属性说明
| key                  | type           | value                 | describe        |
| -------------------- | -------------- | --------------------- | --------------- |
| carouselData         | Array          | '[]'                  | data
| carouselOptions      | Object         | '{}'                  | 滚动相关参数
| height               | Number         | 400                   | 自定义高


## hey-headers
### 本组件自定义顶部导航栏，动态计算元素位置
### 本组件属于UI层面展示类型的组件
### 使用组件的时候，请传入props相关参数，请在page.json设置当前页面"navigationStyle": "custom"，请在父组件的容器设置padding-top
### 本组件目前兼容mini、H5、app未测


### 使用示例
```
<template>
	<view :style="{'padding-top':`${statusBarHeight + navigateHeight}px`}">
		<hey-headers :title="'首页'"></hey-headers>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
	}
</script>

```


### 属性说明
| key                  | type           | value                 | describe        |
| -------------------- | -------------- | --------------------- | --------------- |
| isBack               | Boolean        | true                  | 是否显示返回icon
| title                | String         | 'title'               | 标题
| background           | String         | #ffffff               | 背景色
| isFixed              | String         | 'fixed'               | 是否定位（用于顶部占位使用）
| isSearch             | Boolean        | false                 | 是否搜索
| placeholder          | String         | 'search...'           | 请输入
