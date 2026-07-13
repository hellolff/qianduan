const BASE_URL = 'https://admin.huarongld.com/api';

interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

interface PageResult<T> {
  records: T[];
  total: number;
  size: number;
  current: number;
  pages: number;
}

export interface Article {
  id: string;
  articleType: string;
  coverImage: string;
  orderSource: string;
  title: string;
  subtitle: string;
  content: string;
  realClick: number;
  author: string;
  publishDate: string;
  createTime: string;
  prevResult?: Article | null;
  nextResult?: Article | null;
}

export interface CarSeries {
  brandName: string;
  carSeriesImage: string;
  carSeriesName: string;
  carSeriesFeatures: string;
  score: string;
  recStatus: string;
  newStatus: string;
}

export interface CarModel {
  brandName: string;
  carModelName: string;
  hotStatus: string;
  newStatus: string;
}

export interface BrandCarSeries {
  brandId: string;
  brandImage: string;
  brandName: string;
  seriesList: CarSeries[];
  modelList: CarModel[];
}

export interface CompanyLocation {
  companyName: string;
  address: string;
  contact: string;
  contactPhone: string;
  contactEmail: string;
}

export interface MessageParams {
  name: string;
  phone?: string;
  content: string;
}

export interface Recruitment {
  id: string;
  jobTitle: string;
  departmentName: string;
  workCity: string;
  recruitmentNumber: number;
  jobResponsibilities?: string;
  jobRequirements?: string;
  contactEmail?: string;
  publishStatus?: string;
  deadline?: string;
}

export interface SaleCard {
  name: string;
  phone: string;
  email: string;
}

export interface AccessoryItem {
  coverImage: string;
  name: string;
}

export interface AccessoryCategory {
  categoryId: string;
  categoryName: string;
  list: AccessoryItem[];
}

export interface InteriorCategory {
  categoryId: string;
  categoryName: string;
  list: AccessoryItem[];
}

/**
 * Helper to get cookie by name
 */
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

/**
 * Generic request function
 */
async function request<T>(endpoint: string, options?: RequestInit & { lang?: string }): Promise<ApiResponse<T>> {
  let url = `${BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  // Add language header if provided or detect from cookie
  let lang = options?.lang;
  if (!lang) {
    lang = getCookie('NEXT_LOCALE');
  }

  if (lang) {
    // Mapping common locale codes to what the backend might expect
    // Adjust these mappings based on actual backend requirements
    let langHeader = lang;
    if (lang === 'zh') langHeader = 'zh-CN';
    // if (lang === 'en') langHeader = 'en-US';
    // Add other mappings if necessary

    headers['Accept-Language'] = langHeader;

    // Add language parameter to URL
    const separator = url.includes('?') ? '&' : '?';
    url = `${url}${separator}language=${langHeader}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error(`Request failed for ${url}:`, error);
    throw error;
  }
}

/**
 * Article related services
 */
export const articleService = {
  /**
   * Get articles with pagination
   * @param params Query parameters
   * @param lang Language code
   * @returns Promise with paginated articles
   */
  getArticles: (
    params: {
      articleType?: string;
      recStatus?: string;
      size?: number;
      current?: number;
      [key: string]: any;
    },
    lang?: string
  ) => {
    // Convert params to query string
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, String(params[key]));
      }
    });

    return request<PageResult<Article>>(`/biz/open/article/page?${queryParams.toString()}`, { lang });
  },

  /**
   * Get success cases (convenience method)
   */
  getSuccessCases: (page = 1, size = 2, lang?: string) => {
    return articleService.getArticles(
      {
        articleType: 'success_case',
        recStatus: 'YES',
        size,
        current: page,
      },
      lang
    );
  },

  /**
   * Get industry news (convenience method)
   */
  getIndustryNews: (page = 1, size = 3, lang?: string) => {
    return articleService.getArticles(
      {
        articleType: 'industry',
        recStatus: 'YES',
        size,
        current: page,
      },
      lang
    );
  },

  /**
   * Get article detail by ID
   * @param id Article ID
   * @param lang Language code
   */
  getDetail: (id: string, lang?: string) => {
    return request<Article>(`/biz/open/article/detail?id=${id}`, { lang });
  },
};

/**
 * Car series related services
 */
export const carSeriesService = {
  /**
   * Get car series list
   * @param params Query parameters
   * @param lang Language code
   */
  getList: (
    params: {
      newStatus?: string;
      [key: string]: any;
    },
    lang?: string
  ) => {
    const queryParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        queryParams.append(key, String(params[key]));
      }
    });

    return request<CarSeries[]>(`/biz/open/carSeries/list?${queryParams.toString()}`, { lang });
  },
};

/**
 * Brand related services
 */
export const brandService = {
  /**
   * Get brand car model list
   */
  getCarModelList: () => {
    return request<BrandCarSeries[]>('/biz/open/brand/carModel/list');
  },
};

/**
 * Company related services
 */
export const companyService = {
  /**
   * Get company list
   */
  getList: (lang?: string) => {
    return request<CompanyLocation[]>('/biz/open/company/list', { lang });
  },
};

/**
 * Message related services
 */
export const messageService = {
  /**
   * Add a new message
   */
  add: (data: MessageParams) => {
    return request<any>('/biz/open/message/add', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

/**
 * Recruitment related services
 */
export const recruitmentService = {
  /**
   * Get recruitment list with pagination
   */
  getPage: (current = 1, size = 6, lang?: string) => {
    return request<PageResult<Recruitment>>(`/biz/open/recruitment/page?current=${current}&size=${size}`, { lang });
  },
};

/**
 * Sale Card related services
 */
export const saleCardService = {
  /**
   * Get sale card list
   */
  getList: (name?: string) => {
    const queryParams = new URLSearchParams();
    if (name) {
      queryParams.append('name', name);
    }
    const queryString = queryParams.toString();
    const url = `/biz/open/saleCard/list${queryString ? `?${queryString}` : ''}`;
    return request<SaleCard[]>(url);
  },
};

/**
 * Accessory related services
 */
export const accessoryService = {
  /**
   * Get accessory list
   */
  getList: (lang?: string) => {
    return request<AccessoryCategory[]>('/biz/open/accessory/list', { lang });
  },
};

/**
 * Interior related services
 */
export const interiorService = {
  /**
   * Get interior list
   */
  getList: (lang?: string) => {
    return request<InteriorCategory[]>('/biz/open/interior/list', { lang });
  },
};

export default request;
