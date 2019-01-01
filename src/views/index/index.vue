<template>
  <div class="index-container">
    <div class="index-row">
      <el-row>
        <el-col :span="8"><div class="grid-content bg-purple">设备总台数：109台</div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple-light">在线：18台</div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">离线：91台</div></el-col>
      </el-row>
    </div>
    <div class="index-row">
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">今日收益：<span class="orange">￥0</span></div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">总收益：<span class="orange">￥927.14</span></div></el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

export default {
  name: 'index',
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.index {
  &-container {
    margin: 30px;
  }
  &-row {
    color: #999;
    text-align: center;
    font-size: 30px;
    line-height: 46px;
    padding:30px 0;
    border-bottom:1px solid #999;
    .orange{
      color: #f60;
    }
  }
}
</style>
