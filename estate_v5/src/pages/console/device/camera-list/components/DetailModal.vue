<template>
  <Modal :mask-closable="false" :title="$t('deviceInfo')" footer-hide width="840" v-bind="$attrs" v-on="$listeners" @on-visible-change="onOnVisibleChange">
    <template v-if="detailData">
      <div>
        <Row>
          <Col :span="24">
            <div>
              <Row justify="space-between" class="bord-botm">
                <Col>
                  <span class="boders-blues"></span>
                  {{ $t('baseInfo') }}
                </Col>
                <Col>
                  <Upload
                    class="upload"
                    ref="upload"
                    action="/box/icon/upload.as"
                    name="imgFile"
                    :data="{ name: 'imgFile', mac: detailData.mac }"
                    :on-success="onUploadSuccess"
                    :before-upload="beforeUpload"
                    :show-upload-list="false"
                    :format="['jpg', 'jpeg', 'png']"
                    accept=".jpg, .jpeg, .png"
                    :max-size="2048">
                    <div class="details-Btns">
                      <i class="icon-v5 icon-v5-upload-images"></i>
                    </div>
                  </Upload>
                </Col>
              </Row>
            </div>
            <Row class="mar-t">
              <Col :span="8">
                <div class="avates-cam">
                  <Avatar fit="cover" shape="square" :src="detailData.imgUrl" style="width: 140px; height: 140px; border: 1px solid #485661" />
                  <span v-show="detailData.others.online === 1" class="c-success pa bg1">{{ $t('online') }}</span>
                  <span v-show="detailData.others.online === 0" class="c-danger pa bg2">{{ $t('offline') }}</span>
                  <span v-show="detailData.others.online === -1" class="c-info pa bg3">{{ $t('disconnected') }}</span>
                </div>
              </Col>
              <Col :span="16">
                <Row class="pd-10">
                  <Col :span="12">
                    <span style="color: #999999">{{ $t('deviceAliases') }}:</span>
                    {{ detailData.name }}
                  </Col>
                  <Col>
                    <span style="color: #999999">{{ $t('versionID') }}:</span>
                    {{ detailData.version }}
                  </Col>
                </Row>
                <Row class="pd-10">
                  <Col :span="12">
                    <span style="color: #999999">{{ $t('deviceId') }}:</span>
                    {{ detailData.mac }}
                  </Col>
                </Row>
                <Row class="pd-10">
                  <Col :span="12">
                    <span class="c9">{{ $t('contacts') }}1:</span>
                    <EditableText :onConfirm="text => updateDetail({ linkman: text })" :text="detailData.linkman" :inputProps="{ showWordLimit: true, maxlength: 20, placeholder: $t('pleaseEnterNameOfContact', { num: 1 }) }" />
                  </Col>
                  <Col :span="12">
                    <span class="c9">{{ $t('contactInformation') }}:</span>
                    <EditableText :onConfirm="text => updateDetail({ linkmanTel: text })" :text="detailData.linkmanTel" :inputProps="{ showWordLimit: true, maxlength: 11, placeholder: $t('pleaseEnterTelOfContact', { num: 1 }) }" />
                  </Col>
                </Row>
                <Row class="pd-10">
                  <Col :span="12">
                    <span class="c9">{{ $t('contacts') }}2:</span>
                    <EditableText :onConfirm="text => updateDetail({ linkman2: text })" :text="detailData.linkman2" :inputProps="{ showWordLimit: true, maxlength: 20, placeholder: $t('pleaseEnterNameOfContact', { num: 2 }) }" />
                  </Col>
                  <Col :span="12">
                    <span class="c9">{{ $t('contactInformation') }}:</span>
                    <EditableText :onConfirm="text => updateDetail({ linkmanTel2: text })" :text="detailData.linkmanTel2" :inputProps="{ showWordLimit: true, maxlength: 11, placeholder: $t('pleaseEnterTelOfContact', { num: 2 }) }" />
                  </Col>
                </Row>
                <Row class="pd-10">
                  <Col>
                    <span style="color: #999999">{{ $t('positionInformation') }}:</span>
                    {{ detailData.boxAddress + detailData.build + detailData.unit + detailData.room }}
                  </Col>
                  <Col :span="1" style="margin-left: 5px">
                    <i class="icon-v5 icon-v5-bianji" @click="showAddressModal"></i>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <div>
        <div class="theader-Record">
          <div class="left">
            <div class="bor-Record"></div>
            <span>{{ $t('alarmList') }}</span>
          </div>
          <div class="right-Record pointer" style="color: #0070cd" @click="viewMore">
            {{ $t('viewAll') }}
          </div>
        </div>
        <Table :columns="columns" :data="alarmList" height="250" style="width: 100%; margin-top: 10px">
          <template slot="address" slot-scope="{ row }">
            <div>{{ row.others.address }}</div>
          </template>
          {{ $t('noSupportPlayback') }}
          <!-- <template slot="operoation" slot-scope="{ row }">
            <Button v-if="row.channelAddr > 0" type="text" style="color: #0376f0">录像查看</Button>
          </template> -->
        </Table>
      </div>
    </template>
  </Modal>
</template>

<script>
  import { queryBoxDetails, macAlias, queryAlarmByBox } from '@/api/public'

  export default {
    props: {
      mac: String,
    },
    inject: ['dispatchAction'],
    data() {
      return {
        detailData: null,
        alarmList: [],
        columns: [
          {
            title: this.$t('eventId'),
            key: 'id',
            align: 'center',
          },
          {
            title: this.$t('place'),
            slot: 'address',
            align: 'center',
          },
          {
            title: this.$t('alarmTime'),
            key: 'dateTime',
            align: 'center',
          },
          {
            title: this.$t('alarmType'),
            key: 'info',
            align: 'center',
          },
          // {
          //   title: this.$t('page.table.action'),
          //   slot: 'operoation',
          // },
        ],
      }
    },
    methods: {
      onOnVisibleChange(visible) {
        if (visible) {
          this.getDetail()
          this.getAlarmList()
        } else {
          this.detailData = null
        }
      },
      async getDetail() {
        const { success, message, data } = await queryBoxDetails({ mac: this.mac })
        if (!success) return this.$Message.error(message)
        this.detailData = {
          ...data,
          imgUrl: data.imgUrl || require('@/assets/images/shexiangtou.png'),
        }
      },
      onUploadSuccess({ success, message, data }) {
        if (!success) return this.$Message.error(message)
        if (!this.detailData) return
        this.detailData.imgUrl = data
      },
      beforeUpload(file) {
        const isLt1M = file.size / 1024 / 1024 < 1
        if (!isLt1M) {
          this.$Message.error({
            content: this.$t('exceedSize'),
          })
        }
        return isLt1M
      },
      async updateDetail(data) {
        const { success, message } = await macAlias({
          mac: this.mac,
          ...data,
        })
        if (!success) {
          this.$Message.error(message)
          throw message
        }
        this.detailData = {
          ...this.detailData,
          ...data,
        }
      },
      showAddressModal() {
        this.dispatchAction({
          type: 'showAddressModal',
          payload: {
            data: this.detailData,
            updateAddress: this.updateAddress,
          },
        })
      },
      updateAddress(data) {
        this.detailData = {
          ...this.detailData,
          ...data,
        }
      },
      viewMore() {
        this.$store.commit('detailsFlagMore', false)

        this.$router.push({
          name: 'Alarm',
          params: {
            projectCode: this.$store.state.projectCode,
            mac: this.mac,
            typeNumber: '-100',
            status: '',
            oqp2: '',
          },
        })
      },
      async getAlarmList() {
        const { success, message, data } = await queryAlarmByBox({
          limit: 10,
          typeNumbers: '',
          mac: this.mac,
        })
        if (!success) return this.$Message.error(message)
        this.alarmList = data || []
      },
    },
  }
</script>

<style lang="less" scoped>
  .bord-botm {
    padding-bottom: 5px;
    border-bottom: 1px solid #353a46;
    .boders-blues {
      display: inline-block;
      border: 1px solid #007eff;
      width: 1px;
      height: 12px;
      padding-top: 3px;
      margin: 8px 4px 0 0;
    }
    .details-Btns {
      border: 1px solid #0075ff;
      padding: 1px 3px;
      color: #0075ff;
      border-radius: 3px;
      margin-right: 10px;
    }
  }
  .avates-cam {
    width: 140px;
    position: relative;
    .pa {
      position: absolute;
      right: 0;
      font-size: 12px;
      font-family: PingFang SC;
      padding: 2px 4px;
      margin: 5px;
    }
    .bg1 {
      background: rgba(14, 209, 101, 0.3);
    }
    .bg2 {
      background: rgba(242, 78, 76, 0.3);
    }
    .bg3 {
      background: rgba(153, 153, 153, 0.3);
    }
  }
  .pd-10 {
    padding: 10px;
  }
  .mar-t {
    margin-top: 20px;
  }
  .theader-Record {
    padding: 10px;
    border-bottom: 1px solid #8a8b8e;
    display: flex;
    justify-content: space-between;
  }
  .bor-Record {
    display: inline-block;
    margin-right: 10px;
    width: 1px;
    height: 12px;
    line-height: 12px;
    border: 1px solid #0075ff;
  }
</style>
