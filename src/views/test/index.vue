<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button v-if="is_start" type="primary" @click="handleStart">启动测试</el-button>
            <el-button v-else type="danger" @click="handleStop">结束测试</el-button>
        </div>

        <el-table
            v-loading="listLoading"
            :key="tableKey"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%;">
            <el-table-column label="设备ID" width="120" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.deviceId }}</span>
                </template>
            </el-table-column>
            <el-table-column label="设备编号" width="240" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.deviceNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="运行状态" width="160" align="center">
                <template slot-scope="scope">
                    <el-tag type="danger" v-if="scope.row.deviceUseState == 0">未启动</el-tag>
                    <el-tag type="success" v-else-if="scope.row.deviceUseState == 1">启动中</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="最后通讯时间" width="200" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.lastRecordAt }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="140">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handlecheck(scope.row.deviceId)">查看数据</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination layout="prev, pager, next" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />


        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" center width="50%" style="max-height:80%;">
            <el-table :data="rList" border height="400">
                <el-table-column label="运行时间(秒)" min-width="100px" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.run_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="启动时间" min-width="100px" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.start_at }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <pagination layout="prev, pager, next" v-show="dialog_total > 0" :total="dialog_total" :page.sync="dialog_list.page" :limit.sync="dialog_list.limit" @pagination="getRecordsList" style="padding:0;" />
            </div>
        </el-dialog>
    </div>
</template>

<script>
	import { testList, recordsList, start } from '@/api/test'
	import Pagination from '@/components/Pagination'

	export default {
		name: 'test-index',
		components: { Pagination },
		data() {
			return {
				tableKey: 0,
				list: null,
				rList: null,
				total: 0,
				dialog_total: 0,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 20
				},
				dialogFormVisible: false,
				dialogTitle: '',
				dialogPvVisible: false,
                intervalId: null,
				is_start: true,
				deviceId: null,
				dialog_list: {
					page: 1,
                    limit: 15
                }
			}
		},
		created() {
			let _this = this;
			this.getList()
            setInterval(function(){
            	_this.getList()
            },3000)
		},
		methods: {
			getList() { //获取设备列表
				this.listLoading = false
				testList(this.listQuery.page).then(response => {
					this.list = response.body.rows
					// console.log(response);
					this.total = response.body.total;
					setTimeout(() => {
						this.listLoading = false
					}, 1.5 * 1000)
				})
			},
			handlecheck(id) {
				this.deviceId = id;
				this.dialogFormVisible = true
				recordsList(id).then(res => {
					// console.log(res);
					this.rList = res.body.rows
                    this.dialog_total = res.body.total
                })
            },
            getRecordsList(){
				recordsList(this.deviceId,this.dialog_list.page).then(res => {
					// console.log(res);
					this.rList = res.body.rows
				})
            },
            handleStart(){
				let _this = this;
				this.is_start = false;
				start().then(res => {
					// console.log(res);
				})
				this.intervalId = setInterval(function(){
					start().then(res => {
						// console.log(res);
					})
                },2 * 60 * 1000)
            },
            handleStop(){
				let _this = this;
				this.is_start = true;
				clearInterval(_this.intervalId);
				this.$notify({
					title: '提示',
					message: '停止成功',
					type: 'success',
					duration: 2000
				})
				console.log('停止');
            }
		}
	}
</script>

<style lang="scss" scoped>
    .filter-container{
        position: relative;
        margin-bottom: 20px;
        .right{
            position: absolute;
            top: 0;
            right: 0;
        }
    }
</style>

