<script>
  import { Form } from 'view-design'

  export default {
    name: 'iForm',
    extends: Form,
    props: {
      labelWidth: {
        type: [Number, String],
      },
    },
  }
</script>
