<template>
    <div class="app-container">
        <div class="filter-container">
            <el-date-picker
                v-model="datePicker"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
            <el-button type="primary" @click="timeFilter">查询</el-button>
            <div class="right">
                <el-input placeholder="关键字" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
                <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            </div>
        </div>

        <el-table
            v-loading="listLoading"
            :key="tableKey"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%;"
            @sort-change="sortChange">
            <el-table-column
                type="selection"
                width="35">
            </el-table-column>
            <el-table-column label="订单号" prop="id" align="center" width="130">
                <template slot-scope="scope">
                    <span>{{ scope.row.orderNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="运营商" width="100" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.carrieroperator }}</span>
                </template>
            </el-table-column>
            <el-table-column label="下单时间" min-width="100" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.orderTimes }}</span>
                </template>
            </el-table-column>
            <el-table-column label="总付款(元)" width="100" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.money }}</span>
                </template>
            </el-table-column>
            <el-table-column label="时长(分钟)" width="100" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.time }}</span>
                </template>
            </el-table-column>
            <el-table-column label="设备编号" min-width="160" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.deviceNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="支付状态" align="center" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.status }}</span>
                </template>
            </el-table-column>
            <el-table-column label="用户昵称" align="center" width="120">
                <template slot-scope="scope">
                    <span>{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column label="微信头像" align="center" width="100">
                <template slot-scope="scope">
                    <span><img :src="scope.row.avatar" width="50" height="50" /></span>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />


        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
                <el-form-item label="时间" prop="timestamp">
                    <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date"/>
                </el-form-item>
                <el-form-item label="标题" prop="title">
                    <el-input v-model="temp.title"/>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
                        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="点评">
                    <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.remark" type="textarea" placeholder="Please input"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
            <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
                <el-table-column prop="key" label="Channel"/>
                <el-table-column prop="pv" label="Pv"/>
            </el-table>
            <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确定</el-button>
      </span>
        </el-dialog>

    </div>
</template>

<script>
	import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
	import { parseTime } from '@/utils'
	import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

	export default {
		name: 'order',
		components: { Pagination },
		data() {
			return {
				tableKey: 0,
				list: null,
				total: 0,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 20,
					title: undefined,
					type: undefined,
					sort: '+id'
				},
				sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
				statusOptions: ['published', 'draft', 'deleted'],
				temp: {
					id: undefined,
					remark: '',
					timestamp: new Date(),
					title: '',
					type: '',
					status: 'published'
				},
				dialogFormVisible: false,
				dialogStatus: '',
				textMap: {
					update: 'Edit',
					create: 'Create'
				},
				dialogPvVisible: false,
				pvData: [],
				rules: {
					type: [{ required: true, message: 'type is required', trigger: 'change' }],
					timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
					title: [{ required: true, message: 'title is required', trigger: 'blur' }]
				},
				downloadLoading: false,
				datePicker: []
			}
		},
		created() {
			this.getList()
		},
		methods: {
			getList() {
				this.listLoading = false
				this.list = [
					{
						id: '1',
                        orderNo: '8888888888',
						carrieroperator: '隔壁老王',
						orderTimes: '2018-12-12 12:12:12',
                        money: '3.00',
						time: '3',
						deviceNo: 'abcdefghijklmno',
						status: '支付成功',
						name: '我是测试数据',
						avatar: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=1197039898,3476709019&fm=179&app=42&f=JPEG?w=121&h=140'
					}
				]
				this.total = 100
				// fetchList(this.listQuery).then(response => {
				//   this.list = response.data.items
				//   this.total = response.data.total
				//   console.log(response);
				//   // Just to simulate the time of the request
				//   setTimeout(() => {
				//     this.listLoading = false
				//   }, 1.5 * 1000)
				// })
			},
			timeFilter() {
				console.log(this.datePicker);
            },
			handleFilter() {
				this.listQuery.page = 1
				this.getList()
			},
			handleModifyStatus(row, status) {
				this.$message({
					message: '操作成功',
					type: 'success'
				})
				row.status = status
			},
			sortChange(data) {
				const { prop, order } = data
				if (prop === 'id') {
					this.sortByID(order)
				}
			},
			sortByID(order) {
				if (order === 'ascending') {
					this.listQuery.sort = '+id'
				} else {
					this.listQuery.sort = '-id'
				}
				this.handleFilter()
			},
			resetTemp() {
				this.temp = {
					id: undefined,
					remark: '',
					timestamp: new Date(),
					title: '',
					status: 'published',
					type: ''
				}
			},
			handleCreate() {
				this.resetTemp()
				this.dialogStatus = 'create'
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.$refs['dataForm'].clearValidate()
				})
			},
			createData() {
				this.$refs['dataForm'].validate((valid) => {
					if (valid) {
						this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
						this.temp.author = 'vue-element-admin'
						createArticle(this.temp).then(() => {
							this.list.unshift(this.temp)
							this.dialogFormVisible = false
							this.$notify({
								title: '成功',
								message: '创建成功',
								type: 'success',
								duration: 2000
							})
						})
					}
				})
			},
			handleUpdate(row) {
				this.temp = Object.assign({}, row) // copy obj
				this.temp.timestamp = new Date(this.temp.timestamp)
				this.dialogStatus = 'update'
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.$refs['dataForm'].clearValidate()
				})
			},
			updateData() {
				this.$refs['dataForm'].validate((valid) => {
					if (valid) {
						const tempData = Object.assign({}, this.temp)
						tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
						updateArticle(tempData).then(() => {
							for (const v of this.list) {
								if (v.id === this.temp.id) {
									const index = this.list.indexOf(v)
									this.list.splice(index, 1, this.temp)
									break
								}
							}
							this.dialogFormVisible = false
							this.$notify({
								title: '成功',
								message: '更新成功',
								type: 'success',
								duration: 2000
							})
						})
					}
				})
			},
			handleDelete(row) {
				this.$notify({
					title: '成功',
					message: '删除成功',
					type: 'success',
					duration: 2000
				})
				const index = this.list.indexOf(row)
				this.list.splice(index, 1)
			}
		}
	}
</script>

<style lang="scss">
    .filter-container{
        position: relative;
        margin-bottom: 20px;
        .el-date-editor{
            .el-range-separator{
                width: auto;
            }
        }
        .right{
            position: absolute;
            top: 0;
            right: 0;
        }
    }
</style>

