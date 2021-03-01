<!--
 * @Descripttion: 
 * @Author: Duanlinpeng
 * @Date: 2020-10-16 16:31:34
 * @LastEditTime: 2021-01-13 16:09:20
 * @FilePath: /bm-oa-components/src/views/components/objectTreeList.vue
-->
<template>
	<div>
		<p class="bread-crumbs">
			<template v-if="+this.config.functionType !== 3">
				<template v-for="(item, index) in breadCrumbs">
					<span
						:class="{
							'text-gray': index === breadCrumbs.length - 1,
							'text-link': index !== breadCrumbs.length - 1,
						}"
						:key="item.code"
						v-if="index < breadCrumbs.length - 1"
						@click="changeLevel(item)"
					>
						{{ item.name }}
					</span>
					<span
						:class="{
							'text-gray': index === breadCrumbs.length - 1,
							'text-link': index !== breadCrumbs.length - 1,
						}"
						:key="item.code"
						v-else
					>
						{{ item.name }}
					</span>
					<span
						class="splitter"
						v-if="index < breadCrumbs.length - 1"
						:key="item.orgId"
						>/</span
					>
				</template>
			</template>
		</p>
		<el-checkbox
			v-if="isHideCheckAll"
			class="all-check"
			v-model="checkAll"
			@change="handleCheckAllChange"
			>全选</el-checkbox
		>
		<div class="checked-tree">
			<el-checkbox-group
				v-model="checkedList"
				@change="handleCheckedListChange"
			>
				<el-checkbox
					v-for="(item, index) in checkOptions"
					:label="item.code"
					:class="{
						'checked-option': true,
						'no-checkbox': handleNotChecked(item),
					}"
					:disabled="disableFlag(item)"
					:key="index"
				>
					<template>
						<el-tooltip
							class="item"
							effect="dark"
							:content="item.name"
							placement="top"
							v-if="+config.functionType !== 3 && item.name.length > 13"
						>
							<span>
								<el-avatar
									v-if="!item.hasChild && item.treeType === 'STAFF'"
									size="small"
									:src="item.avatarUrl"
								/>
								<span class="object-name">{{ item.name }}</span>
							</span>
						</el-tooltip>
						<span class="block" v-else>
							<el-avatar
								v-if="!item.hasChild && item.treeType === 'STAFF'"
								size="small"
								:src="item.avatarUrl"
							/>
							<span class="object-subject-name">
								<span v-if="+config.functionType === 3">[{{ item.code }}]</span>
								{{ item.name }}
							</span>
						</span>
						<span
							class="object-number"
							v-if="+config.functionType !== 3 && item.resourceNum"
						>
							(<span class="check-number" v-text="calcIsChecked(item)"></span>
							{{ item.resourceNum }} )
						</span>
						<template v-if="+config.functionType !== 3 && item.hasChild">
							<span
								class="checked-option-right"
								v-if="!checkedList.length || !checkedList.includes(item.code) || handleNotChecked(item)"
								@click.prevent="levelDown(item.orgId, item.name, item.code)"
							>
								<span class="iconfont iconshuxian2"></span>
								<span class="iconfont iconxiaji6"></span>
								下级
							</span>
							<span
								class="checked-option-right-disable"
								v-else
								@click.prevent="return false;"
							>
								<span class="iconfont iconshuxian2"></span>
								<span class="iconfont iconxiaji6"></span>
								下级
							</span>
						</template>
					</template>
				</el-checkbox>
			</el-checkbox-group>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import API from '../../api/api';
export default {
  data() {
    return {
      checkAll: false,
      checkedList: [],
      isChecked: false,
      checkOptions: [],
      beforeChecked: [],
      departDataList: [],
      splictArr: [],
      loadCount: 0,
      orgId: 0,
      isHideCheckAll: false,
    };
  },
  props: ['searchObject','notLodaData'],
  computed: mapState(['config', 'actList', 'actDisableData', 'totalNumber','breadCrumbs','defaultDepartment']),
  created() {
    this.checkedList = this.actList.map(item => {
      return item.code;
    });
    if(!this.notLodaData){
      this.getData();
    }
    
  },
  watch: {
    'actList': {
      handler(newVal){
        this.checkedList = newVal.map(item => {
          return item.code;
        });
        let diffArr = this.beforeChecked.filter(items => {
          return !newVal.some(item => item.code === items.code);
        });
        diffArr.forEach(item => {
          let spliceIndex = this.beforeChecked.findIndex(val => val.code === item.code);
          this.beforeChecked.splice(spliceIndex,1);
        });
        if(this.checkedList.length > 1 && !this.beforeChecked.length) {
          this.beforeChecked = [...this.actList];
        }
        this.checkAllIsChecked(this.departDataList);
      }
    },
    'departDataList': {
      handler(newVal) {
        if(newVal.length) {
          this.checkAllIsChecked(newVal);
        }
        
      }
    },
    'searchObject': {
      handler(newVal) {
        if(!newVal && !this.notLodaData){
          this.getData();
        }
      }
    },
  },
  methods: {
    checkAllIsChecked(newVal) {
      let findexArr = newVal.filter(item => {
        let valFilter =  this.actList.some(val => item.code === val.code);
        return valFilter;
      });
      if(findexArr.length === newVal.length && findexArr.length) {
        this.checkAll = true;
      } else {
        this.checkAll = newVal.every(item => !!item.checked === true);
        // this.checkAll = false;
        console.log(this.checkAll,'this.checkAll=========');
      }
      // this.checkAll = newVal.every(item => !!item.checked === true);
      if(JSON.parse(this.config.justLastCheck)){
        let checkArr = newVal.filter(item => {
          return item.hasChild;
        });
        if(checkArr.length === newVal.length){
          this.isHideCheckAll = false;
        }
        if((newVal.length -checkArr.length) === findexArr.length && findexArr.length){
          this.checkAll = true;
        } else {
          this.checkAll = false;
        }
      }
    },
    handleNotChecked(item){
      let flag = false;
      if(!this.defaultDepartment.divideArr) {
        return flag;
      }

      if(this.config.isDivideAuth && this.defaultDepartment.divideArr){
        flag = this.defaultDepartment.divideArr.includes(item.code);
      }
      if(+this.config.functionType === 2) {
        flag = this.config.justLastCheck && item.hasChild || flag;
      }
      if(!flag) {
        this.isHideCheckAll = !this.config.justLastCheck || !item.hasChild;
      }
      return flag;
    },
    disableFlag(item){
      let flag = false;
      if(this.actDisableData.length) {
        flag = this.actDisableData.some(items => {
          return items.code === item.code || item.id=== items.id;
        });
      }
      return flag || this.handleNotChecked(item);
    },
    async changeLevel(item) {
      let res;
      this.departDataList = [];
      this.checkOptions = [];
      if(!this.actList.length) {
        this.checkedList = [];
      }
      
      if(this.breadCrumbs.length-1) {
        this.$store.commit('sliceBreadCrumbs' ,{
          start: item.id,
          end: this.breadCrumbs.length-1
        });
      }
      if (+this.config.functionType === 1) {
        this.titleLoading(true);
        let _data = await API.getPeopleData({ isDivideAuth:this.config.isDivideAuth, depIds: item.orgId || ''});
        res = item.orgId ? Array.isArray(_data.items) ? _data.items[0].children : _data.items:  _data.items;
      }else if(+this.config.functionType === 2) {
        res = await API.departList({isDivideAuth:this.config.isDivideAuth,code:item.code});
      }
      this.setDepartList(res);
      this.checkAll = false;
      this.isHideCheckAll = false;
    },
    titleLoading(flag) {
      this.$emit('titleLoading', flag);
    },
    async getData() {
      let res = {};
      this.departDataList = [];
      this.checkOptions = [];
      this.titleLoading(true);
      if(+this.config.functionType === 1) {
        res = await API.getPeopleData({isDivideAuth:this.config.isDivideAuth});
      } else if (+this.config.functionType === 2) {
        res = await API.departList({isDivideAuth:this.config.isDivideAuth});
      } else {
        res = await API.infoData();
      }
      if(+this.config.functionType === 3) {
        res = res.items[0].children;
      }else if(+this.config.functionType === 1) {
        res = res.items;  
      }
      this.setDepartList(res);
    },
    getDepartList() {
      let pIdArr = [];
      this.breadCrumbs.forEach(item => {
        pIdArr.push(item.code);
      });
      return pIdArr;
    },
    async setDepartList(items, arrCode) {
      this.titleLoading(true);
      let pIdArr = this.getDepartList();
      if (items && items.length) {
        let dataList = items;
        this.departDataList = [];
        this.checkOptions = [];
        const length = dataList.length;
        let k = 0;
        while (k < length) {
          let resourceNum = 0;
          if(this.config.isDivideAuth){
            if(
              (+this.config.functionType === 1 && dataList[k].treeType==='DEPARTMENT') ||
              (+this.config.functionType === 2 && dataList[k].hasChild)
            ) {
              
              let result = await API.deptResourceNum({depCode:dataList[k].code});
              resourceNum = +this.config.functionType === 2? result.childCount : result.resourceCount;
            }
          }
          if(+this.config.functionType === 2 &&dataList[k].fullCode) {
            pIdArr = dataList[k].fullCode.split('|');
            pIdArr.unshift(dataList[k].code);
          }
          let checked = this.isCheckedChildAll(dataList[k]);
          // console.log(arrCode,'arrCode============');
          this.departDataList.push({
            name: dataList[k].orgName || dataList[k].name,
            code: dataList[k].code,
            pIdArr: arrCode || pIdArr,
            id: dataList[k].orgId || dataList[k].id,
            orgId: dataList[k].orgId || dataList[k].ppId ,
            resourceNum: resourceNum || dataList[k].resourceNum || dataList[k].deptCount || 0,
            avatarUrl: dataList[k].avatarUrl || null,
            hasChild: dataList[k].hasChild || dataList[k].hasChildren || false,
            checked,
            treeType: dataList[k].treeType ?dataList[k].treeType : this.config.functionType==1 ? 'STAFF': 'DEPARTMENT'
          });
          if(checked){
            if(!this.checkedList.includes(dataList[k].code)){
              this.checkedList.push(dataList[k].code);
            }
          }
          k++;
        }
        // console.log(this.departDataList,'this.departDataList===============');
        if (this.departDataList.length > 400) {
          this.splictArr = this.groupList(this.departDataList, 50);
          this.checkOptions = this.splictArr[0];
        } else {
          this.checkOptions = this.departDataList;
        }
        if(+this.config.functionType === 2 && this.checkedList) {
          let findexArr = this.departDataList.filter(item => {
            let itemFilter = this.checkedList.some(val => item.code === val);
            return itemFilter.length;
          });
          // console.log(this.checkedList,'setDepartment1================');
          if(findexArr.length === this.departDataList.length && findexArr.length) {
            this.checkAll = true;
          }
        }
        this.titleLoading(false);
      }
    },
    groupList(array, subGroupLength) {
      let index = 0;
      let newArray = [];
      while(index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength));
      }
      return newArray;
    },
    async levelDown(orgId,name,code,arrCode,type) {
      this.titleLoading(true);
      this.departDataList = [];
      this.checkOptions = [];
      let res;
      if (+this.config.functionType === 1){
        this.orgId = orgId;
        let _data = await API.getPeopleData({ isDivideAuth:this.config.isDivideAuth, depIds:orgId});
        res = _data.items[0].children;
      } else if(+this.config.functionType === 2) {
        res = await API.departList({isDivideAuth:this.config.isDivideAuth,code});
      }
      this.$store.commit('pushBreadCrumbs', {
        name,
        orgId: orgId,
        id: this.breadCrumbs.length + 1,
        code
      });

      this.setDepartList(res,arrCode,type);
    },
    // 全选
    handleCheckAllChange(val) {
      let totalNum = 0;
      if (this.departDataList.length > this.config.maxLength) {
        this.checkAll = false;
        this.$message.error({
          message: '超出限制，不能选择',
          type: 'error',
          customClass: 'message-error',
          duration: 2000
        });
        return false;
      }
      if(+this.config.type === 1){
        for(let prop of this.departDataList) {
          if (prop.hasChild) {
            totalNum += prop.resourceNum;
            if (totalNum > this.config.maxLength) {
              this.checkAll = false;
              this.$message.error({
                message: '超出限制，不能选择',
                type: 'error',
                customClass: 'message-error',
                duration: 2000
              });
              return;
            }
          }
        }
      }
      let checkedArr = [];
      this.departDataList.forEach(item => {
        checkedArr.push(item.code);
      });
      this.checkedList = [...this.checkedList,...checkedArr];
      // console.log(this.checkedList,'setDepartment3================');
      if(val) {
        this.actList.forEach((val1,index1) => {
          this.departDataList.forEach((val2) => {
            if(val1.code === val2.code) {
              this.$store.dispatch('delActList', index1);
            }
          });
        });
        let checkedArrDepart = [...this.departDataList];
        if(this.config.justLastCheck) {
          checkedArrDepart = checkedArrDepart.filter(item => {
            return !item.hasChild;
          });
        }
        this.beforeChecked = [...this.actList,...checkedArrDepart];
        this.$store.dispatch('actActList',checkedArrDepart);
      } else {
        this.departDataList.forEach((val2) => {
          this.actList.forEach((val1,index1) => {
            if(val1.code === val2.code) {
              // console.log(index1,'beforeChecked==================');
              this.$store.dispatch('delActList', index1);
            }
          });
        });
      }
    },
    // 选中
    handleCheckedListChange(value) {
      console.log(value,this.checkedList,this.beforeChecked,'handleCheckedListChange=======');
      let len = value.length;
      let valueArr = [];
      if(len) {
        value.forEach(items => {
          this.checkOptions.forEach(item => {
            if(items === item.code){
              valueArr.push(item);
            }
          });
        });
      } else {
        let countIndex = 0;
        this.actList.forEach((item, index) => {
          this.checkOptions.forEach(options => {
            if(options.code === item.code) {
              countIndex = index;
            }
          });
        });
        this.beforeChecked = [];
        this.checkAll = false;
        this.$store.commit('deleActList',countIndex);
        return;
      }
      // 判断是否为单选
      if(this.config.maxLength === 1){
        this.checkAll = len === this.departDataList.length;
        let flag = false;
        if((+this.config.functionType === 1 && valueArr[valueArr.length-1].resourceNum > 1)) {
          flag = true;
        }
        if (flag) {
          this.checkedList = value.splice(0,value.length-1);
          this.$message.error({
            message: '超出限制，不能选择',
            type: 'error',
            customClass: 'message-error',
            duration: 2000
          });
          this.checkAll = false;
          return false;
        }
        if (this.totalNumber >=1) {
          this.$store.commit('clearActList');
        }
        let diffArr = [valueArr[valueArr.length - 1]];
        // console.log(diffArr,'diffArr===========');
        this.$store.dispatch('actActList', diffArr);
        return true;
      }
      let beforeCheckLen = this.beforeChecked.length;
      // console.log(beforeCheckLen,len,valueArr,this.beforeChecked,'len=================');
      if (beforeCheckLen < len && valueArr.length) {
        let diffArr = valueArr.filter(items => {
          return !this.beforeChecked.some(item => item.code === items.code);
        });
        // console.log(diffArr,beforeCheckLen,len,'diffArr=========>');
        // 判断选中项 是否选中过
        let flag = JSON.stringify(this.actList).indexOf(
          JSON.stringify(diffArr)
        );
        if (flag !== -1) return this.$message.error('该选项已存在');
        // 判断是否超出限制
        let checkedNumber;
        // 判断是否存在下级分类及下级分类数量
        if (+this.config.functionType === 1 && diffArr[0].resourceNum) {
          checkedNumber = diffArr[0].resourceNum + this.totalNumber;
        } else {
          checkedNumber = this.totalNumber + 1;
        }
        if (checkedNumber > this.config.maxLength) {
          this.checkedList = value.splice(0,value.length-1);
          this.$message.error({
            message: '超出限制，不能选择',
            type: 'error',
            customClass: 'message-error',
            duration: 2000
          });
          this.checkAll = false;
          return false;
        }
        this.$store.dispatch('actActList', diffArr);
        this.beforeChecked = [...this.actList];
        // 去重
        if(diffArr.hasChild){
          this.deleRepeatOptions(diffArr.code);
        }
        this.checkAllIsChecked(this.departDataList);
      } else {
        let indexArr = this.beforeChecked.filter(items => {
          return !value.some(item => {
            return item === items.code;
          });
        });
        if(indexArr.length){
          // console.log(indexArr,'this.actList=============');
          let actListIndex = this.actList.findIndex(val => {
            return val.code === indexArr[0].code;
          });
          this.$store.dispatch('delActList', actListIndex);
          this.beforeChecked = [...this.actList];
          this.checkAllIsChecked(this.departDataList);
        } else {
          // console.log(value,this.beforeChecked,'value=============');
          this.checkAll = false;
        }
      }
      // this.checkAllIsChecked(this.departDataList);
      
    },
    deleRepeatOptions(orgId) {
      let checkList = [...this.actList];
      let allArr = checkList.filter((val) => {
        let departArr;
        if(+this.config.functionType === 1){
          if(val.ppcode) {
            departArr = val.ppcode.split('|');
            departArr.unshift(val.depCode);
          } else {
            departArr= val.pIdArr;
          }
        } else {
          if(val.ppcode) {
            departArr = val.ppcode.split('|');
            departArr.unshift(val.code);
          } else {
            departArr= val.pIdArr;
          }
        }
        return (departArr && !departArr.includes(orgId)) || val.hasChild;
      });
      this.$store.commit('clearActList');
      this.$store.dispatch('actActList',allArr);
      this.checkedList = this.actList.map(item => {return item.code;});
    },
    // 滚动 无限加载
    // load() {
    //   if (this.loadCount <= this.splictArr.length - 1) {
    //     this.loadCount += 1;
    //     this.checkOptions = [...this.checkOptions, ...this.splictArr[this.loadCount]];
    //   }
    // },
    calcIsChecked(item) {
      let count = 0;
      // console.log(this.actList,'this.actList=========calcIsChecked');
      this.actList.forEach(val => {
        let departArr;
        if(+this.config.functionType === 1){
          if(val.ppcode) {
            departArr = val.ppcode.split('|');
            departArr.unshift(val.depCode);
          } else {
            departArr= val.pIdArr;
          }
          if (departArr && departArr.includes(item.code) && !val.hasChild) {
            count += 1;
          }
          // console.log(val.hasChild, count,item,'calcIsChecked============');
          if(val.hasChild && departArr.includes(item.code)) {
            count += val.resourceNum;
          }
        } else {
          if(val.ppcode) {
            departArr = val.ppcode.split('|');
            departArr.unshift(val.code);
          } else {
            departArr= val.pIdArr;
          }
          if(item.code === val.code) {
            count = 0;
          } else if(departArr && departArr.includes(item.code)) {
            count += 1;
          }
        }
      });
      // console.log(count,'count===========');
      return count ? `${count}/` : '';
    },
    notOrChecked(item) {
      let flag = false;
      flag = this.actList.some(items => {
        return items.code === item.code;
      });
      return flag;
    },
    isCheckedChildAll(item) {
      let flag = false;
      if (item.treeType === 'STAFF') {
        flag = this.actList.some(items => {
          return items.code === item.code;
        });
      } else {
        flag = this.notOrChecked(item);
        let checkNumber = this.calcIsChecked(item);
        if(checkNumber && Number(checkNumber.split('/')[0]) === +item.resourceNum) {
          flag = true;
        }
      }
      return flag;
    },
  },
};
</script>

<style lang="scss" scoped>
.bread-crumbs {
	color: #2a8eff;
	font-size: 12px;
	margin-left: 24px;
	margin-right: 5px;
	.text-link {
		cursor: pointer;
	}
	.splitter {
		margin: 0 7px;
	}
}
.text-gray {
	color: #919191;
}
.all-check {
	margin-top: 20px;
	margin-left: 10px;
	margin-bottom: 8px;
}
.checked-tree {
	margin-left: 10px;
	max-height: 260px;
	overflow: auto;
	.checked-option {
		display: block;
		padding: 8px 0;
		.object-name {
			display: inline-block;
			max-width: 200px;
			overflow: hidden;
			text-overflow: ellipsis;
			-webkit-box-orient: vertical;
			vertical-align: middle;
			margin-left: 6px;
		}
		.object-subject-name {
			display: inline-block;
			max-width: 298px;
			word-break: break-all;
			white-space: initial;
			vertical-align: text-top;
			margin-left: 6px;
		}
		.object-number {
			margin-left: 5px;
			vertical-align: bottom;
		}
		.check-number {
			color: #2a8eff;
		}
		.checked-option-right,
		.checked-option-right-disable {
			display: block;
			float: right;
			font-size: 12px;
			color: #bbbbbb;
			.iconxiaji6 {
				vertical-align: bottom;
			}
		}
		.checked-option-right-disable {
			cursor: not-allowed;
		}
		.checked-option-right:hover {
			color: #2a8eff;
		}
	}
}
/deep/ .el-checkbox__label {
	display: inline-block;
	width: 95%;
}
/deep/ .el-checkbox:last-of-type {
	margin-right: 30px;
}
/deep/ .el-checkbox__inner {
	border-radius: 7px;
}
.no-checkbox /deep/ .el-checkbox__inner {
	display: none;
	cursor: none;
}
.no-checkbox /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner {
	display: none;
	cursor: none;
}
.no-checkbox /deep/ .el-checkbox__input.is-disabled + span.el-checkbox__label {
	cursor: pointer;
	color: #606266;
}
.no-checkbox /deep/ .is-disabled {
	width: 14px;
}
</style>