<template>
  <div class="questionnaire">
    <div class="header">
      <h1 class="mb20">{{ effectiveData.title }}</h1>
      <div class="count mb20">{{ effectiveData.summary }}</div>
    </div>
    <div class="content">
      <div class="first" v-for="(item, index) in effectiveData.questionList" :key="index">
        <h2 class="mb20">{{ `${index + 1}、` + item.question }}</h2>
        <template v-if="item.imageUrls !== ''">
          <div class="image">
            <el-image style="width: 300px; height: 200px" :src="item.imageUrls" :preview-src-list="[item.imageUrls]"></el-image>
          </div>
        </template>
        <template v-if="item.videoUrls !== ''">
          <div class="image">
            <VideoPlay v-show="true" :videoUrl="item.videoUrls" :width="300" :height="200" :autoplay="true" :controls="true" :loop="false" :muted="false" preload="auto" :showPlay="true" :playWidth="96" zoom="cotain" />
          </div>
        </template>
        <div class="finput mb20">
          <template v-if="item.answerType === 1">
            <span class="answer">{{ $t('answer') }}:</span>
            <Input v-model="item.content" type="textarea" :rows="4" />
          </template>
          <template v-if="item.answerType === 2">
            <span class="answer">{{ $t('answer') }}:</span>
            <div v-for="val in item.answerItems" :key="val.idx">
              <RadioGroup v-model="item.content">
                <Radio :label="val.idx" style="margin-right: 20px">{{ val.name }}</Radio>
              </RadioGroup>
            </div>
          </template>
          <template v-if="item.answerType === 3">
            <CheckboxGroup v-model="item.content" v-for="val in item.answerItems" :key="val.idx">
              <Checkbox :label="val.idx" style="margin-right: 20px">{{ val.name }}</Checkbox>
            </CheckboxGroup>
          </template>
        </div>
      </div>
    </div>
    <div class="btnList">
      <Button @click="handleSumit" class="btn">{{ $t('submit') }}</Button>
      <Button @click="handleCancel">{{ $t('cancel') }}</Button>
    </div>
  </div>
</template>
<script>
  import { effectiveSubmit } from '@/api/public'
  import VideoPlay from '@/components/VideoPlay'
  export default {
    components: {
      VideoPlay,
    },
    props: {
      effectiveData: {
        type: Array,
        default() {
          return {}
        },
      },
    },
    data() {
      return {
        answerList: {},
      }
    },
    methods: {
      handleSumit() {
        let jsonData = {
          id: this.effectiveData.questionnaireId,
          answerList: [],
        }
        this.effectiveData.questionList.map(val => {
          jsonData.answerList.push({
            id: val.id,
            result: `${val.content}`,
          })
        })

        let params = {
          jsonData: JSON.stringify(jsonData),
        }
        effectiveSubmit(params).then(res => {
          if (res.success) {
            this.$emit('status', false)
            this.$Message.success({
              content: this.$t('submittedSuccessfully'),
            })
          } else {
            this.$Message.error({
              content: res.message,
            })
          }
        })
      },
      handleCancel() {
        this.$emit('status', false)
      },
    },
    mounted() {},
  }
</script>
<style lang="less">
  .questionnaire {
    .mb20 {
      margin-bottom: 20px;
    }
    .content {
      .first {
        .image {
          margin: 35px;
        }
        .finput {
          margin-left: 35px;
          .answer {
            min-width: 50px;
          }
          display: flex;
        }
      }
    }
    .btnList {
      display: flex;
      justify-content: flex-end;
      .btn {
        border-color: #02a7f0 !important;
        background: rgba(2, 167, 240, 0.1) !important;
        color: #02a7f0 !important;
        margin-right: 20px;
      }
    }
  }
</style>
