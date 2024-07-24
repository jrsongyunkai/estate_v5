<template>
  <div class="header">
    <Select v-model="openValue" v-width="140">
      <Option v-for="item in actionsOption" :value="item.value" :key="item.value">{{ item.label }}</Option>
    </Select>
    <div class="canvas-scale">
      <div class="zoom-out zoom-box" @click.stop="zoomSize(-1)">
        <Icon custom="icon-v5 icon-v5-line-v" class="zoom-out-icon zoom-box-icon"></Icon>
      </div>
      <Dropdown @on-click="scaleClick">
        <div class="zoom-val">
          {{ scaleValue }}%
          <Icon custom="icon-v5 icon-v5-backt" class="zoom-val-icon"></Icon>
        </div>
        <template #list>
          <DropdownMenu>
            <DropdownItem name="1">{{ $t('reset') }}</DropdownItem>
            <DropdownItem name="2">{{ $t('zoomToFitAllContent') }}</DropdownItem>
            <Divider />
            <DropdownItem name="500">500%</DropdownItem>
            <DropdownItem name="400">400%</DropdownItem>
            <DropdownItem name="300">300%</DropdownItem>
            <DropdownItem name="200">200%</DropdownItem>
            <DropdownItem name="100">100%</DropdownItem>
            <DropdownItem name="50">50%</DropdownItem>
            <DropdownItem name="10">10%</DropdownItem>
          </DropdownMenu>
        </template>
      </Dropdown>
      <div class="zoom-in zoom-box" @click.stop="zoomSize(1)">
        <Icon custom="icon-v5 icon-v5-addtwo" class="zoom-box-icon"></Icon>
      </div>
    </div>
    <RadioGroup class="ml-10" v-model="direction" type="button">
      <Radio label="LR"><Icon custom="icon-v5 icon-v5-tuoputu2-copy" size="20" /></Radio>
      <Radio label="TB"><Icon custom="icon-v5 icon-v5-tuoputu2" size="20" /></Radio>
    </RadioGroup>
  </div>
</template>

<script>
  export default {
    props: {
      graph: { type: Object, default: () => null },
      value: { type: Number, default: 1 },
    },
    data() {
      return {
        openValue: 2,
        actionsOption: [
          { label: this.$t('putEverythingAway'), value: -1 },
          { label: this.$t('expandLevelTwo'), value: 1 },
          { label: this.$t('expandLevelThree'), value: 2 },
          { label: this.$t('expandLevelFour'), value: 3 },
          { label: this.$t('expandAll'), value: 9999 },
        ],
        direction: 'LR',
      }
    },
    computed: {
      scaleValue() {
        let value = this.graph && this.graph.getZoom() ? this.graph.getZoom() * 100 : 100
        return value.toFixed(0)
      },
    },
    methods: {
      scaleClick(val) {
        switch (val) {
          case '1':
            this.graph && this.graph.fitCenter()
            break
          case '2':
            this.graph && this.graph.fitView()
            break
          default:
            this.setZoom(val)
            break
        }
      },
      zoomSize(e) {
        let zoomValue = this.scaleValue / 100 + 0.1 * e
        this.graph && this.graph.zoomTo(zoomValue)
        this.graph && this.graph.fitCenter()
      },
      setZoom(val) {
        let zoomValue = val / 100
        this.graph && this.graph.zoomTo(zoomValue)
        this.graph && this.graph.fitCenter()
      },
    },
    watch: {
      openValue: {
        handler(val) {
          this.$emit('input', val)
        },
        immediate: true,
      },
      direction: {
        handler(val) {
          this.$emit('changeDirection', val)
        },
      },
    },
    mounted() {
      this.openValue = this.value
    },
  }
</script>

<style lang="less" scoped>
  .header {
    position: absolute;
    right: 15px;
    top: 15px;
    display: flex;
    .canvas-scale {
      display: flex;
      width: 140px;
      height: 32px;
      margin-left: 10px;
      background: #1a202e;
      box-sizing: border-box;
      border-radius: 4px;
      border: 1px solid #3d3d41;
      align-items: center;
      justify-content: space-between;
      color: #fff;
      user-select: none;
      .zoom-out-icon {
        transform: rotate(90deg);
      }
      .zoom-box {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: none;
        cursor: pointer;
      }
      .zoom-out {
        border-right: 1px solid #3d3d41;
      }
      .zoom-in {
        border-left: 1px solid #3d3d41;
      }
      .zoom-box-icon {
        font-size: 18px;
      }
      .zoom-box:hover {
        .zoom-box-icon {
          color: #007eff;
        }
      }
      .zoom-box:active {
        background: ~'rgba(54, 194, 188, .1)';
      }
      .zoom-val {
        flex: 1;
        text-align: center;
        cursor: pointer;
      }
      .zoom-val-icon {
        transform: rotate(270deg);
      }
    }
  }
</style>
