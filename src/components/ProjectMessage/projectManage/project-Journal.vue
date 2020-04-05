<template>
  <div >
      <div class="journal-top" style="margin-bottom:30px">
          <span style="font-size:24px"><i class="el-icon-notebook-2"></i> 操作日志</span>
          <hr>
      </div>
        <el-timeline >
    <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :timestamp="activity.timestamp">
      {{activity.content}}
    </el-timeline-item>
  </el-timeline>
  </div>
</template>

<script>
export default {
        data() {
      return {
        activities: [{
          content: '活动按期开始',
          timestamp: '2018-04-15'
        }, {
          content: '通过审核',
          timestamp: '2018-04-13'
        }, {
          content: '创建成功',
          timestamp: '2018-04-11'
        }]
      };
    }
}
</script>

<style scoped>
.el-form{
  padding: 0;
  margin-left: 0;
}
</style>