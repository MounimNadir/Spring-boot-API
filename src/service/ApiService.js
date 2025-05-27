import axios from "axios";

export default class ApiService {
    static BASE_URL = "http://localhost:8081";

    // ========================
    // 1. AUTH & HEADER UTILS
    // ========================
    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    }

    static logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }

    static isAuthenticated() {
        return !!localStorage.getItem("token");
    }

    static isAdmin() {
        return localStorage.getItem("role") === "ADMIN";
    }

    // ========================
    // 2. AUTH & USER ENDPOINTS
    // ========================
    static async registerUser(registration) {
        const response = await axios.post(`${this.BASE_URL}/auth/register`, registration);
        return response.data;
    }

    static async loginUser(loginDetails) {
        const response = await axios.post(`${this.BASE_URL}/auth/login`, loginDetails);
        return response.data;
    }

    static async getLoggedInUserInfo() {
        const response = await axios.get(`${this.BASE_URL}/user/my-info`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    // ========================
    // 3. PRODUCT ENDPOINTS (UPDATED)
    // ========================
    static async getPurchasableProducts(page = 0, size = 10) {
        const response = await axios.get(`${this.BASE_URL}/product/purchasable`, {
            params: { page, size }
        });
        return response.data;
    }

    static async getDisplayOnlyProducts(page = 0, size = 10) {
        const response = await axios.get(`${this.BASE_URL}/product/display-only`, {
            params: { page, size }
        });
        return response.data;
    }



    // Admin-only (gets ALL products)
static async getAllProducts({ sort = 'id,desc', page = 0, size = 10 }) {
  const response = await axios.get(`${this.BASE_URL}/product/get-all`, {
    headers: this.getHeader(),
    params: {
      sort, // Single string parameter
      page,
      size
    }
  });
  return response.data;
}




    static async searchProducts(searchValue, page = 0, size = 10) {
        const response = await axios.get(`${this.BASE_URL}/product/search`, {
            params: { searchValue, page, size }
        });
        return response.data;
    }

    static async getProductById(productId) {
        const response = await axios.get(`${this.BASE_URL}/product/get-by-product-id/${productId}`);
        return response.data;
    }

   static async getProductsByCategory(categoryId, page = 0, size = 8) {
  const response = await axios.get(
    `${this.BASE_URL}/category/get-products-by-category/${categoryId}`, 
    { params: { page, size } }
  );
  return response.data;
}


static async deleteProduct(productId){
        const response = await axios.delete(`${this.BASE_URL}/product/delete/${productId}`,{
            headers: this.getHeader()
        })
        return response.data;
    }

    static async addProduct(formData){
        const response = await axios.post(`${this.BASE_URL}/product/create`, formData, {
            headers: {
                ...this.getHeader(),
                "Content-Type": "multipart/form-data"
            }
        });

        return response.data;
    }

    static async updateProduct(formData) {
        try {
            const response = await axios.put(`${this.BASE_URL}/product/update`, formData, {
                headers: {
                    ...this.getHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('API Response:', response);
            return response.data;
        } catch (error) {
            console.error('API Error:', error.response);
            throw error;
        }
    }

    // ========================
    // 4. ORDER ENDPOINTS (UPDATED)
    // ========================


     static async getAllOrders() {
        const response = await axios.get(`${this.BASE_URL}/order/filter`, {
            headers: this.getHeader()
        })
        return response.data;
    }



   static async createOrder(body) {
        const response = await axios.post(`${this.BASE_URL}/order/create`, body, {
            headers: this.getHeader()
        })
        return response.data;
    }

    static async getOrderItemById(itemId) {
        const response = await axios.get(`${this.BASE_URL}/order/filter`, {
            headers: this.getHeader(),
            params: {itemId}
        })
        return response.data;
    }

    static async getOrderHistory(page = 0, size = 10) {
        const response = await axios.get(`${this.BASE_URL}/order/filter`, {
            headers: this.getHeader(),
            params: { page, size }
        });
        return response.data;
    }

    static async updateOrderitemStatus(orderItemId, status) {
        const response = await axios.put(
            `${this.BASE_URL}/order/update-item-status/${orderItemId}`,
            {},
            {
                headers: this.getHeader(),
                params: { status }
            }
        );
        return response.data;
    }

    // ========================
    // 5. CATEGORY & ADDRESS
    // ========================
    static async getAllCategories() {
        const response = await axios.get(`${this.BASE_URL}/category/get-all`);
        return response.data;
    }


    static async getCategoryById(categoryId) {
  const response = await axios.get(`${this.BASE_URL}/category/get-category-by-id/${categoryId}`);
  return response.data;
}

 static async createCategory(body) {
        const response = await axios.post(`${this.BASE_URL}/category/create`, body, {
            headers: this.getHeader()
        })
        return response.data;
    }


    static async updateCategory(categoryId, body) {
        const response = await axios.put(`${this.BASE_URL}/category/update/${categoryId}`, body, {
            headers: this.getHeader()
        })
        return response.data;
    }

    static async deleteCategory(categoryId) {
        const response = await axios.delete(`${this.BASE_URL}/category/delete/${categoryId}`, {
            headers: this.getHeader()
        })
        return response.data;
    }

    static async saveAddress(addressData) {
        const response = await axios.post(`${this.BASE_URL}/address/save`, addressData, {
            headers: this.getHeader()
        });
        return response.data;
    }
}