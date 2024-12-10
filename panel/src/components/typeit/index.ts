import TypeIt from 'typeit'

export default defineComponent({
  name: 'TypeIt',
  props: {
    /** 打字速度，以每一步之间的毫秒数为单位 */
    speed: {
      type: Number,
      default: 80,
    },
    values: {
      type: Array,
      defalut: [],
    },
    className: {
      type: String,
      default: 'type-it',
    },
    cursor: {
      type: Boolean,
      default: true,
    },
  },
  render() {
    return h(
      'span',
      {
        class: this.className,
      },
      {
        default: () => [],
      },
    )
  },
  mounted() {
    const instance = new (TypeIt as any)(`.${this.className}`, {
      strings: this.values,
      speed: this.speed,
      cursor: this.cursor,
      // 显示完毕后直接消失
      lifeLike: true,
      //   一直循环
      loop: true,
      //   循环次数，-1表示无限循环
      loopCount: -1,
    }).go()
  },
})

