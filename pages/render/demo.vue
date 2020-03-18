<template>
  <div>
    <VModel value="3" message="message" placeholder="Enter something..."> <input value="abv" placeholder="Enter something..." /> </VModel>
  </div>
</template>
<script>
// import AnchoredHeading from './render-demo2.vue'
// import AnchoredHeading1 from './AnchoredHeading.vue'
import VModel from './v-model'
export default {
  data() {
    return { value: 3 }
  },
  components: {
    VModel
  }
  // render (h) {
  //   return <h1 class="red">{this.name}</h1>
  // }
  // render: function(h) {
  //   return (
  //     <div>
  //       <AnchoredHeading1 level="1">
  //         <span>Hello</span> world!
  //       </AnchoredHeading1>
  //       <AnchoredHeading level="2">
  //         <span>Hello</span> world!
  //       </AnchoredHeading>
  //       <AnchoredHeading level="2">
  //         <span>nihao</span> hahah!
  //       </AnchoredHeading>
  //       <VModel value={this.value}></VModel>
  //       <div>{this.value}</div>
  //     </div>
  //   )
  // }
}
</script>
<style>
.red {
  color: red;
}
</style>
