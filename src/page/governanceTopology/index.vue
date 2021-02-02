<template>
  <div style="height: 100%">
    <el-row>
      <div style="margin-bottom: 10px;">
        <el-button type="primary" style="position: relative;" @click="isShow = !isShow">
          显示<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <div v-if="isShow" style="position: absolute;z-index: 2;width: 217px;background: #fff;background-clip:padding-box;border:0.5px solid rgba(255,255,255,.5);padding:8px 0;box-shadow: rgb(186, 186, 186) 0px 0px 5px 1px">
          <div style="overflow: auto;min-width: 100%;max-height: calc(100vh - 207.333px);">
            <div style="font-size:14px">
              <div style="color: #6a6e73;font-weight: 700;padding: 8px 16px 2px 16px;">Show Edge Labels</div>
              <div v-for="(item,index) in [{name:'No Label',value:'No Label'},{name:'Request Rate',value:'Request Rate'},{name:'Request Distribution',value:'Request Distribution'},{name:'Response Time',value:'Response Time'}]" :key="index" style="cursor: not-allowed;width: 100%;display: inline-block;line-height: 32px;">
                <el-radio style="align-items: center;margin: 0;padding: 6px 16px;white-space: nowrap;" v-model="radio" :label="item.value">{{item.name}}</el-radio>
              </div>
              <div style="color: #6a6e73;font-weight: 700;padding: 8px 16px 2px 16px;">Show</div>
              <div v-for="item in ['Compress Hidden', 'Node Names', 'Operation Nodes', 'Service Nodes','Traffic Animation','Unused Nodes']" :key="item" style="cursor: not-allowed;width: 100%;display: inline-block;line-height: 32px;">
                <el-checkbox-group v-model="checked">
                  <el-checkbox style="align-items: center;margin: 0;padding: 6px 16px;white-space: nowrap;" :label="item">{{item}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <div style="color: #6a6e73;font-weight: 700;padding: 8px 16px 2px 16px;">Show Badges</div>
              <div v-for="item in ['Circuit Breakers', 'Missing Sidecars', 'Virtual Services', 'Security']" :key="item" style="cursor: not-allowed;width: 100%;display: inline-block;line-height: 32px;">
                <el-checkbox-group v-model="checked">
                  <el-checkbox style="align-items: center;margin: 0;padding: 6px 16px;white-space: nowrap;" :label="item">{{item}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
        <el-input v-model="find" style="width:100px;display:inline-block;" />
        <el-input v-model="hide" style="width:100px;display:inline-block;" />
      </div>
    </el-row>
    <div class="page-container">
      <CJS ref="ref_CJS" :autoungrabify="allowGrab" :nodes="nodes" :edges="edges"></CJS>
      <div style="padding: 7px 10px;position: absolute;bottom: 0px;">
        <el-tooltip class="item" effect="dark" :content="allowGrab ? '禁用拖动' : '启用拖动'" placement="top">
          <el-button icon="icon-move-full" @click="allowGrab= !allowGrab" :style="{color:allowGrab?'#409EFF':''}"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="放大" placement="top">
          <el-button icon="icon-zoomIn" @click="$refs.ref_CJS.magnifying()"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="缩小" placement="top">
          <el-button style="margin-left: -3px" icon="icon-suoxiao" @click="$refs.ref_CJS.contractible()"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="缩放以适合" placement="top">
          <el-button icon="icon-suofang" @click="$refs.ref_CJS.resize()"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="布局默认dagre" placement="top">
          <el-button icon="icon-guanxitu1" @click="$refs.ref_CJS.refresh({ name: 'dagre' }),layoutName='dagre'" :style="{color:layoutName==='dagre'?'#409EFF':''}"></el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="布局1" placement="top">
          <el-button style="margin-left: -3px" icon="icon-guanxitu1" @click="$refs.ref_CJS.refresh({ name: 'cose-bilkent' }),layoutName='cose-bilkent'" :style="{color:layoutName==='cose-bilkent'?'#409EFF':''}">1</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="布局2" placement="top">
          <el-button style="margin-left: -4px" icon="icon-guanxitu1" @click="$refs.ref_CJS.refresh({ name: 'cola' }),layoutName='cola'" :style="{color:layoutName==='cola'?'#409EFF':''}">2</el-button>
        </el-tooltip>
        <el-button type="primary">Legend</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import CJS from './cy'

export default {
  name: 'cytoscape',
  components: {
    CJS
  },
  data() {
    return {
      checked: [],
      radio: '1',
      visible: false,
      isShow: false,
      find: '',
      hide: '',

      allowGrab: false, // 是否能拖动

      layoutName: 'dagre', // 画图布局

      nodes: [
        {
          'data': {
            'id': 'bcbbc26d201909101e45d8edb0b617ae',
            'nodeType': 'app',
            'namespace': 'default',
            'app': 'details',
            'isGroup': 'app'
          }
        },
        {
          'data': {
            'id': '1dc860585c7c62f074c0006794b012c0',
            'nodeType': 'app',
            'namespace': 'default',
            'app': 'minio',
            'isGroup': 'app'
          }
        },
        {
          'data': {
            'id': '1cd79b3dd828bdcf35a57fdfc4e4f505',
            'nodeType': 'app',
            'namespace': 'default',
            'app': 'productpage',
            'isGroup': 'app'
          }
        },
        {
          'data': {
            'id': '4aa670e0682d4be3aaf24d8f589feb4b',
            'nodeType': 'app',
            'namespace': 'default',
            'app': 'ratings',
            'isGroup': 'app'
          }
        },
        {
          'data': {
            'id': '6519157be154675342fb76c41edc731c',
            'nodeType': 'app',
            'namespace': 'default',
            'app': 'reviews',
            'isGroup': 'app'
          }
        },
        {
          'data': {
            'id': '5b6454ebd96fc9d21d492546bdc485fb',
            'nodeType': 'service',
            'namespace': 'default',
            'service': 'kubernetes',
            'isUnused': true
          }
        },
        {
          'data': {
            'id': '16d04f68bd507ca9b0707c2a576d1fc2',
            'parent': 'bcbbc26d201909101e45d8edb0b617ae',
            'nodeType': 'service',
            'namespace': 'default',
            'app': 'details',
            'service': 'details',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'details'
              }
            ],
            'hasVS': true
          }
        },
        {
          'data': {
            'id': '721ef0b8cfba57d153213a5d659ae9da',
            'parent': 'bcbbc26d201909101e45d8edb0b617ae',
            'nodeType': 'app',
            'namespace': 'default',
            'workload': 'details-v1',
            'app': 'details',
            'version': 'v1',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'details'
              }
            ]
          }
        },
        {
          'data': {
            'id': 'a90e9f13fe3d43979b9735421567298e',
            'parent': '1dc860585c7c62f074c0006794b012c0',
            'nodeType': 'service',
            'namespace': 'default',
            'app': 'minio',
            'service': 'argo-artifacts',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'argo-artifacts'
              }
            ],
            'isRoot': true
          }
        },
        {
          'data': {
            'id': '66782d17b3eb7b0a7b507c6af9faa069',
            'parent': '1dc860585c7c62f074c0006794b012c0',
            'nodeType': 'app',
            'namespace': 'default',
            'workload': 'argo-artifacts',
            'app': 'minio',
            'version': 'latest',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'argo-artifacts'
              }
            ]
          }
        },
        {
          'data': {
            'id': 'c2efd356d9a25fd009efe2a323e12361',
            'parent': '1cd79b3dd828bdcf35a57fdfc4e4f505',
            'nodeType': 'service',
            'namespace': 'default',
            'app': 'productpage',
            'service': 'productpage',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'productpage'
              }
            ],
            'hasVS': true,
            'isRoot': true
          }
        },
        {
          'data': {
            'id': '06e488a37fc9aa5b0e0805db4f16ae69',
            'parent': '1cd79b3dd828bdcf35a57fdfc4e4f505',
            'nodeType': 'app',
            'namespace': 'default',
            'workload': 'productpage-v1',
            'app': 'productpage',
            'version': 'v1',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'productpage'
              }
            ]
          }
        },
        {
          'data': {
            'id': '906196769ac4714aae43f4f789a36d9c',
            'parent': '4aa670e0682d4be3aaf24d8f589feb4b',
            'nodeType': 'service',
            'namespace': 'default',
            'app': 'ratings',
            'service': 'ratings',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'ratings'
              }
            ],
            'hasVS': true
          }
        },
        {
          'data': {
            'id': '4b64bda48e5a3c7e50ab1c63836c9469',
            'parent': '4aa670e0682d4be3aaf24d8f589feb4b',
            'nodeType': 'app',
            'namespace': 'default',
            'workload': 'ratings-v1',
            'app': 'ratings',
            'version': 'v1',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'ratings'
              }
            ]
          }
        },
        {
          'data': {
            'id': 'adbe9380f23fcbefe5fedd6beb0597ef',
            'parent': '6519157be154675342fb76c41edc731c',
            'nodeType': 'service',
            'namespace': 'default',
            'app': 'reviews',
            'service': 'reviews',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'reviews'
              }
            ],
            'hasVS': true
          }
        },
        {
          'data': {
            'id': 'ce6eb1c1255b2c90e76a8f1a803cdb24',
            'parent': '6519157be154675342fb76c41edc731c',
            'nodeType': 'app',
            'namespace': 'default',
            'workload': 'reviews-v1',
            'app': 'reviews',
            'version': 'v1',
            'isUnused': true
          }
        },
        {
          'data': {
            'id': '31150e7e5adf85b63f22fbd8255803d7',
            'parent': '6519157be154675342fb76c41edc731c',
            'nodeType': 'app',
            'namespace': 'default',
            'workload': 'reviews-v2',
            'app': 'reviews',
            'version': 'v2',
            'isUnused': true
          }
        },
        {
          'data': {
            'id': '80f71758099020586131c3565075935d',
            'parent': '6519157be154675342fb76c41edc731c',
            'nodeType': 'app',
            'namespace': 'default',
            'workload': 'reviews-v3',
            'app': 'reviews',
            'version': 'v3',
            'destServices': [
              {
                'namespace': 'default',
                'name': 'reviews'
              }
            ]
          }
        }
      ],
      edges: [
        {
          'data': {
            'id': '531fdd02d44612b9a7a9f393dcbf6940',
            'source': '06e488a37fc9aa5b0e0805db4f16ae69',
            'target': '16d04f68bd507ca9b0707c2a576d1fc2',
            'traffic': {
              'protocol': 'http'
            }
          }
        },
        {
          'data': {
            'id': '49e7da37f0733e10454cdc64887377dc',
            'source': '06e488a37fc9aa5b0e0805db4f16ae69',
            'target': 'adbe9380f23fcbefe5fedd6beb0597ef',
            'traffic': {
              'protocol': 'http'
            }
          }
        },
        {
          'data': {
            'id': 'f774bb2441e6cc6e34630c04c150ca35',
            'source': '16d04f68bd507ca9b0707c2a576d1fc2',
            'target': '721ef0b8cfba57d153213a5d659ae9da',
            'traffic': {
              'protocol': 'http'
            }
          }
        },
        {
          'data': {
            'id': 'daad981dc4fa558b8e7dfb4d5b882d22',
            'source': '80f71758099020586131c3565075935d',
            'target': '906196769ac4714aae43f4f789a36d9c',
            'traffic': {
              'protocol': 'http'
            }
          }
        },
        {
          'data': {
            'id': 'a1dfe2e1b0907e1cb16670f1abe2e41e',
            'source': '906196769ac4714aae43f4f789a36d9c',
            'target': '4b64bda48e5a3c7e50ab1c63836c9469',
            'traffic': {
              'protocol': 'http'
            }
          }
        },
        {
          'data': {
            'id': 'a5806d6835b762aad284a5b1d4b97523',
            'source': 'a90e9f13fe3d43979b9735421567298e',
            'target': '66782d17b3eb7b0a7b507c6af9faa069',
            'traffic': {
              'protocol': 'http'
            }
          }
        },
        {
          'data': {
            'id': '66bfd9391cae909e3b9968afb7a7a910',
            'source': 'adbe9380f23fcbefe5fedd6beb0597ef',
            'target': '80f71758099020586131c3565075935d',
            'traffic': {
              'protocol': 'http'
            }
          }
        },
        {
          'data': {
            'id': '86725a525e9ddca333f585f328c423e9',
            'source': 'c2efd356d9a25fd009efe2a323e12361',
            'target': '06e488a37fc9aa5b0e0805db4f16ae69',
            'traffic': {
              'protocol': 'http'
            }
          }
        }
      ]
    }
  },
  mounted() {

  },
  methods: {
    handleCommand() {
      console.log('jinlaile')
      this.visible = true
      console.log(this.visible, 'visible')
    },
    changeValue1(callback, vc) {
      console.log('回调参数' + callback)
      if (!callback) {
        return
      }
    }
  }

}

</script>
<style scoped>
.page-container {
  min-height: 350px;
  /* height: 100%; */
  /* min-height: calc(100% - 32px); */
  position: relative;
  background-color: #f5f5f5
}
#cy {
  width: 100%;
  height: 100%;
}

</style>