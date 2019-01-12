<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input placeholder="关键字" v-model="listQuery.title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
            <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
            <div class="right">
                <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
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
            <el-table-column label="设备ID" prop="id" align="center" width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.deviceId }}</span>
                </template>
            </el-table-column>
            <el-table-column label="设备编号" width="200" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.deviceNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="设备状态" width="130" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.deviceState }}</span>
                </template>
            </el-table-column>
            <el-table-column label="使用状态" width="130" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.deviceUseState }}</span>
                </template>
            </el-table-column>
            <el-table-column label="司机名称" align="center" width="140">
                <template slot-scope="scope">
                    <span>{{ scope.row.driverName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="司机电话" align="center" width="160">
                <template slot-scope="scope">
                    <span>{{ scope.row.driverPhone }}</span>
                </template>
            </el-table-column>
            <el-table-column label="最后通讯时间" width="160" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.lastRecordAt }}</span>
                </template>
            </el-table-column>
            <el-table-column label="车牌号" width="160" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.carNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="200">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination layout="prev, pager, next" v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />


        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" center width="40%" :close-on-click-modal="false">
            <el-form ref="dataForm" label-position="left" label-width="70px" style="margin:0 50px;">
                <el-form-item label="设备编号">
                    <el-input v-model="temp.deviceNo"/>
                </el-form-item>
                <el-form-item label="设备状态">
                    <el-input v-model="temp.deviceState"/>
                </el-form-item>
                <el-form-item label="使用状态">
                    <el-input v-model="temp.deviceUseState"/>
                </el-form-item>
                <el-form-item label="司机名称">
                    <el-input v-model="temp.driverName"/>
                </el-form-item>
                <el-form-item label="司机电话">
                    <el-input v-model="temp.driverPhone"/>
                </el-form-item>
                <el-form-item label="车牌号">
                    <el-input v-model="temp.carNo"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="提示" :visible.sync="dialogDelete" center :close-on-click-modal="false" width="300px">
            <p>确定删除吗？</p>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogDelete = false">取消</el-button>
                <el-button type="primary" @click="sureDelete">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
	import { deviceList } from '@/api/device'
	import Pagination from '@/components/Pagination'

	export default {
		name: 'device-index',
		components: { Pagination },
		data() {
			return {
				tableKey: 0,
				list: null,
				total: 0,
				listLoading: true,
				listQuery: {
					page: 1,
					limit: 20
				},
				dialogFormVisible: false,
				temp: {
					deviceId: '',
					deviceNo: '',
					deviceState: '',
					deviceUseState: '',
					driverName: '',
					driverPhone: '',
					carNo: ''
                },
				dialogTitle: '',
				dialogPvVisible: false,
				dialogDelete: false,
                deleteId: null,
				datePicker: []
			}
		},
		created() {
			this.getList()
		},
		methods: {
			getList() { //获取设备列表
				this.listLoading = false
				deviceList(this.listQuery.page, this.listQuery.limit).then(response => {
				  this.list = response.body.rows
				  console.log(response);
				  this.total = response.body.total;
				  setTimeout(() => {
				    this.listLoading = false
				  }, 1.5 * 1000)
				})
			},
            add() { //新增设备
				this.dialogTitle = '新增设备'
                this.dialogFormVisible = true;
            },
			handleEdit(row) {  //编辑设备
                let _this = this;
				this.dialogTitle = '编辑设备'
				this.dialogFormVisible = true;
				Object.keys(_this.temp).forEach(function(e){
					_this.temp[e] = row[e];
                })
            },
			handleDelete(row) {
				this.dialogDelete = true;
				this.deleteId = row.deviceId
            },
            sureDelete() {
				this.dialogDelete = false;
				console.log(this.deleteId)
				this.$notify({
					title: '成功',
					message: '删除成功',
					type: 'success',
					duration: 2000
				})
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
			// handleDelete(row) {
			// 	this.$notify({
			// 		title: '成功',
			// 		message: '删除成功',
			// 		type: 'success',
			// 		duration: 2000
			// 	})
			// 	const index = this.list.indexOf(row)
			// 	this.list.splice(index, 1)
			// }
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

