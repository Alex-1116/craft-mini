export interface CraftProduct {
	id: string;
	name: string;
	category: string;
	image: string;
	images: string[];
	desc: string;
	price: number;
	originPrice?: number;
	sales: number;
	material: string;
	dimensions: string;
	content: string[];
}

export interface CheckoutDraft {
	productId: string;
	quantity: number;
}

export interface CraftOrder {
	id: string;
	status: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
	productId: string;
	productName: string;
	productImage: string;
	quantity: number;
	unitPrice: number;
	totalPrice: number;
	customerName: string;
	phone: string;
	address: string;
	notes: string;
	createdAt: string;
}

export interface CraftAddress {
	id: string;
	name: string;
	phone: string;
	region: string;
	detail: string;
	isDefault: boolean;
}

const CHECKOUT_DRAFT_KEY = 'craft_checkout_draft';
const CHECKOUT_SELECTED_ADDRESS_KEY = 'craft_checkout_selected_address_id';
const ORDER_LIST_KEY = 'craft_order_list';
const ADDRESS_LIST_KEY = 'craft_address_list';

export const craftProducts: CraftProduct[] = [
	{
		id: 'p-1',
		name: '鎏金描边陶瓷盖碗',
		category: '茶器',
		image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=900&q=80',
		images: [
			'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80'
		],
		desc: '细口沿与低饱和釉色，适合日常茶席与安静陈设。',
		price: 268,
		originPrice: 329,
		sales: 128,
		material: '手作陶瓷 / 描金工艺',
		dimensions: '盖碗 110ml，杯托直径约 10cm',
		content: [
			'盖碗整体比例克制，描金边线与温润白釉形成柔和对比，延续网站端的黑金米白视觉语言。',
			'适合日常独饮、简茶席陈列以及赠礼场景，在移动端详情页中会重点突出材质、规格和购买入口。'
		]
	},
	{
		id: 'p-2',
		name: '手作黄铜香插套组',
		category: '香器',
		image: 'https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=900&q=80',
		images: [
			'https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80'
		],
		desc: '黄铜与石材搭配，延续网站端的古铜金细节语言。',
		price: 199,
		originPrice: 259,
		sales: 86,
		material: '黄铜 / 天然石材',
		dimensions: '香插直径约 8cm，底座高约 3cm',
		content: [
			'以黄铜和石材构成沉稳层次，适合桌面与玄关场景，兼具功能与陈设属性。',
			'后续真实接口接入后，可直接替换当前 mock 数据而不影响页面结构。'
		]
	},
	{
		id: 'p-3',
		name: '雾白釉花器摆件',
		category: '花器',
		image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80',
		images: [
			'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80'
		],
		desc: '强调留白与柔和弧面，适合玄关、书桌与客厅角落。',
		price: 318,
		originPrice: 399,
		sales: 64,
		material: '高温陶 / 雾白釉',
		dimensions: '高约 22cm，器口直径约 6cm',
		content: [
			'花器造型更强调留白和轮廓，适合搭配干枝、单枝花或独立摆放。',
			'在小程序里会沿用网站端的卡片留白、标题层级与价格信息布局。'
		]
	},
	{
		id: 'p-4',
		name: '木石结合香炉陈设',
		category: '陈设',
		image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80',
		images: [
			'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80'
		],
		desc: '低调材质组合与沉稳比例，适合作为首页推荐卡片样板。',
		price: 468,
		originPrice: 568,
		sales: 42,
		material: '木作 / 石材 / 金属结构',
		dimensions: '整体约 26cm x 18cm',
		content: [
			'木石组合保持了东方器物克制的层次感，也更适合在首页作为品牌化样板卡片。',
			'下一阶段可继续扩展图文详情、库存状态和商品富文本内容。'
		]
	}
];

export const getCraftProductById = (id: string) => craftProducts.find((item) => item.id === id);

export const searchCraftProducts = (keyword = '', category = '全部') => {
	const normalizedKeyword = keyword.trim().toLowerCase();
	return craftProducts.filter((item) => {
		const matchCategory = category === '全部' || item.category === category;
		const matchKeyword =
			!normalizedKeyword ||
			item.name.toLowerCase().includes(normalizedKeyword) ||
			item.desc.toLowerCase().includes(normalizedKeyword) ||
			item.material.toLowerCase().includes(normalizedKeyword) ||
			item.category.toLowerCase().includes(normalizedKeyword);
		return matchCategory && matchKeyword;
	});
};

export const getCraftCategories = () => ['全部', ...Array.from(new Set(craftProducts.map((item) => item.category)))];

const getSeedAddresses = (): CraftAddress[] => [
	{
		id: 'addr-1',
		name: '林先生',
		phone: '13800138000',
		region: '浙江省 杭州市 西湖区',
		detail: '灵隐街道 龙井路 18 号 雅集小院',
		isDefault: true
	}
];

const normalizeAddressList = (list: CraftAddress[]) => {
	if (!list.length) {
		return [];
	}
	const hasDefault = list.some((item) => item.isDefault);
	if (hasDefault) {
		return list;
	}
	return list.map((item, index) => ({
		...item,
		isDefault: index === 0
	}));
};

export const listAddresses = (): CraftAddress[] => {
	const storedList = uni.getStorageSync(ADDRESS_LIST_KEY);
	if (Array.isArray(storedList) && storedList.length) {
		return normalizeAddressList(storedList as CraftAddress[]);
	}
	const seedList = getSeedAddresses();
	uni.setStorageSync(ADDRESS_LIST_KEY, seedList);
	return seedList;
};

export const getAddressById = (id: string) => listAddresses().find((item) => item.id === id);

export const getDefaultAddress = (): CraftAddress | null => {
	return listAddresses().find((item) => item.isDefault) || null;
};

export const upsertAddress = (payload: Omit<CraftAddress, 'id'> & { id?: string }) => {
	const currentList = listAddresses();
	const normalizedPayload: CraftAddress = {
		...payload,
		id: payload.id || `ADDR${Date.now()}`,
		phone: payload.phone.replace(/\s+/g, '')
	};
	let nextList = payload.id
		? currentList.map((item) => (item.id === payload.id ? normalizedPayload : item))
		: [normalizedPayload, ...currentList];

	if (normalizedPayload.isDefault) {
		nextList = nextList.map((item) => ({
			...item,
			isDefault: item.id === normalizedPayload.id
		}));
	}

	nextList = normalizeAddressList(nextList);
	uni.setStorageSync(ADDRESS_LIST_KEY, nextList);
	return normalizedPayload;
};

export const setDefaultAddress = (id: string) => {
	const nextList = normalizeAddressList(
		listAddresses().map((item) => ({
			...item,
			isDefault: item.id === id
		}))
	);
	uni.setStorageSync(ADDRESS_LIST_KEY, nextList);
	return nextList;
};

export const removeAddress = (id: string) => {
	const nextList = normalizeAddressList(listAddresses().filter((item) => item.id !== id));
	uni.setStorageSync(ADDRESS_LIST_KEY, nextList);
	return nextList;
};

export const saveCheckoutDraft = (draft: CheckoutDraft) => {
	uni.setStorageSync(CHECKOUT_DRAFT_KEY, draft);
};

export const getCheckoutDraft = (): CheckoutDraft | null => {
	return uni.getStorageSync(CHECKOUT_DRAFT_KEY) || null;
};

export const clearCheckoutDraft = () => {
	uni.removeStorageSync(CHECKOUT_DRAFT_KEY);
};

export const saveCheckoutSelectedAddress = (id: string) => {
	if (!id) {
		uni.removeStorageSync(CHECKOUT_SELECTED_ADDRESS_KEY);
		return;
	}

	uni.setStorageSync(CHECKOUT_SELECTED_ADDRESS_KEY, id);
};

export const getCheckoutSelectedAddress = () => {
	return uni.getStorageSync(CHECKOUT_SELECTED_ADDRESS_KEY) || '';
};

export const clearCheckoutSelectedAddress = () => {
	uni.removeStorageSync(CHECKOUT_SELECTED_ADDRESS_KEY);
};

export const listOrders = (): CraftOrder[] => {
	return uni.getStorageSync(ORDER_LIST_KEY) || [];
};

export const getOrderById = (id: string): CraftOrder | undefined => {
	return listOrders().find((item) => item.id === id);
};

export const createOrder = (payload: Omit<CraftOrder, 'id' | 'status' | 'createdAt'>): CraftOrder => {
	const order: CraftOrder = {
		...payload,
		id: `OD${Date.now()}`,
		status: 'PENDING',
		createdAt: new Date().toISOString()
	};
	const currentOrders = listOrders();
	uni.setStorageSync(ORDER_LIST_KEY, [order, ...currentOrders]);
	return order;
};

export const getOrderStatusMeta = (status: CraftOrder['status']) => {
	switch (status) {
		case 'PENDING':
			return { label: '待处理', tone: 'warning' };
		case 'PAID':
			return { label: '已支付', tone: 'info' };
		case 'SHIPPED':
			return { label: '已发货', tone: 'info' };
		case 'COMPLETED':
			return { label: '已完成', tone: 'success' };
		case 'CANCELLED':
			return { label: '已取消', tone: 'danger' };
		default:
			return { label: status, tone: 'default' };
	}
};
