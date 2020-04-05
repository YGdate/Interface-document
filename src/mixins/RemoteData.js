export default function(resource) {
  return {
    data() {
      let initData = {
        formData: [],
        itemData: '',
        project_id: sessionStorage.getItem('projectID') || '',
        pageData: {
          current_page: '',
          first_page_url: '',
          last_page: 0,
          last_page_url: '',
          next_page_url: '',
          path: '',
          per_page: '',
          prev_page_url: '',
          to: '',
          total: 0
        }
      }
      // 响应数据
      for (const key in resource) {
        initData[key] = null
      }

      return initData
    },
    async created() {
      try {
        const res = await this.$http.get(resource.quest, {
          params: {
            project_id: this.project_id,
            page: this.pageData.current_page
          }
        })
        if (res.status == 200) {
          console.log(res.data)
          this.updatePage(res.data.data)
        } else {
          const error = new Error('error')
          throw error
        }
      } catch (e) {
        console.error(e)
      }
    },
    methods: {
      updatePage(e) {
        this.formData = e.data

        this.pageData.current_page = e.current_page
        this.pageData.first_page_url = e.first_page_url
        this.pageData.last_page_url = e.last_page_url
        this.pageData.per_page = e.per_page
        this.pageData.prev_page_url = e.prev_page_url
        this.pageData.next_page_url = e.next_page_url
        this.pageData.total = e.total
        this.pageData.to = e.to
      },
      handleChange(val) {
        this.$http
          .get(`${resource.quest}?page=${val}`, {
            params: {
              project_id: this.project_id
            }
          })
          .then(res => {
            this.updatePage(res.data.data)
          })
      }
    },
    computed: {
      totalPage() {
        return Number(this.pageData.total)
      },
      currentPage() {
        return Number(this.pageData.current_page)
      }
    }
  }
}
