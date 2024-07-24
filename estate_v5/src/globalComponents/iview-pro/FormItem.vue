<script>
  import { FormItem } from 'view-design'

  export default {
    name: 'FormItem',
    extends: FormItem,
    props: {
      labelWidth: {
        type: [Number, String],
      },
    },
    computed: {
      labelStyles() {
        let style = {}
        const labelWidth = this.labelWidth === 0 || this.labelWidth ? this.labelWidth : this.FormInstance.labelWidth

        if (labelWidth === 'auto') {
          return {
            float: 'none',
            paddingRight: '4px',
          }
        }

        if (labelWidth || labelWidth === 0) {
          style.width = `${labelWidth}px`
        }
        return style
      },
      contentStyles() {
        let style = {}
        const labelWidth = this.labelWidth === 0 || this.labelWidth ? this.labelWidth : this.FormInstance.labelWidth

        if (labelWidth === 'auto') {
          return {
            display: 'inline-block',
          }
        }

        if (labelWidth || labelWidth === 0) {
          style.marginLeft = `${labelWidth}px`
        }
        return style
      },
    },
  }
</script>
