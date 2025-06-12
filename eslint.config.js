import vuetify from 'eslint-config-vuetify'
import prettier from 'eslint-config-prettier'

export default [
  vuetify({
    rules: {
      'vue/script-indent': 'off',
    },
  }),
  prettier,
]
