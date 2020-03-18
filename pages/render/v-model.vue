<
<script>
export default {
  props: ['value', 'message', 'placeholder'],
  //   render: function(createElement) {
  //     const self = this
  //     return createElement('div', {}, [
  //       createElement('input', {
  //         domProps: {
  //           value: self.value
  //         },
  //         on: {
  //           input: function(event) {
  //             self.$emit('input', event.target.value)
  //           }
  //         }
  //       }),
  //       this.$scopedSlots.default()
  //     ])
  //   }
  render: function(h) {
    return (
      <div>
        <input value={this.value} />
        {this.$slots.default}
        {this.$slots.default}
      </div>
    )
  }
}
</script>
