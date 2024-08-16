import presetWeapp from 'unocss-preset-weapp'
import {
  extractorAttributify,
  transformerClass
} from 'unocss-preset-weapp/transformer'

const { presetWeappAttributify, transformerAttributify } =
  extractorAttributify()

export default {
  presets: [
    // https://github.com/MellowCo/unocss-preset-weapp
    presetWeapp(),
    // attributify autocomplete
    presetWeappAttributify()
  ],
  shortcuts: [
    {
      'f-center': 'flex justify-center items-center',
      'wh-full': 'w-full h-full'
    }
  ],

  transformers: [
    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerAttributify
    transformerAttributify(),

    // https://github.com/MellowCo/unocss-preset-weapp/tree/main/src/transformer/transformerClass
    transformerClass()
  ]
}
