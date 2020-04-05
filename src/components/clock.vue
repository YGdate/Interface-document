<template>
  <div class="infinite-list-wrapper" style="overflow:auto">
    <el-timeline
      class="list"
      :reverse="reverse"
      v-infinite-scroll="load"
      infinite-scroll-disabled="disabled"
      style="overflow:auto"
    >
      <el-timeline-item v-for="item of activities" :key="item.id" type="primary" placement="top">
        <el-card>
          <h4>{{item.operation_type}}</h4>
          <p>
            {{item.content}}
            <span class="createdTime">{{item.created_at}}</span>
          </p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <p v-if="loading">加载中...</p>
    <p v-if="noMore">没有更多了</p>
  </div>
</template>

<style lang="less" scoped>
.createdTime {
  margin-left: 13px;
  font-size: 12px;
}
</style>

<script>
export default {
  data() {
    return {
      reverse: true,
      activities: null,
      count: 10,
      loading: false
    }
  },
  computed: {
    noMore() {
      return this.count >= 50
    },
    disabled() {
      return this.loading || this.noMore
    }
  },
  methods: {
    load() {
      setTimeout(() => {
        this.loading = true

        this.$http.get('/api/logs').then(res => {
            console.log(res.data)
          this.activities = res.data.data
        })
        this.count += 10

        this.loading = false
      }, 2000)
    }
  }
}
</script>