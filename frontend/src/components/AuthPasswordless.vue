<template lang="pug">
  el-dialog(
    :visible.sync='show'
    width='100%'
    center
    :class='b()'
    :before-close='handleClose')
    el-steps(:active='authStep' finish-status='success' simple='')
      el-step(title='Email')
      el-step(title='Code')
      el-step(title='Verify')

    el-form(
      :model='auth'
      label-position='top'
      ref='authForm'
      @submit.native.prevent='')
      transition(name="el-zoom-in-center")
        el-form-item(
          prop='email'
          v-if='authStep === 1'
          label='Enter your email to sign in or create an account' 
          label-width='100%'
          @keydown.enter.prevent="true"
          :rules="authRules.email")
          el-autocomplete(
            v-model='auth.email'
            :fetch-suggestions="suggestMail"
            style='width:100%'
            @select='selectMail'
            @keyup.enter.native='allowAuthNext ? authNext() : null')
            template(slot="prepend")
              i(class="el-icon-message")

      transition(name="el-zoom-in-center")
        el-form-item(
          prop='code'
          v-if='authStep === 2'
          :label='`An email with the code has been sent to ${auth.email}`'
          label-width='100%'
          @submit.prevent=""
          :rules="authRules.code")
          el-input(
            v-model='auth.code' 
            auto-complete='off' 
            @keyup.enter.native='allowAuthNext ? authNext() : null')
            template(slot="prepend")
              i(class="el-icon-more")

      transition(name="el-zoom-in-center")
        el-form-item(
          v-if='authStep === 3'
          label='Wait for a moment to verify entered code' 
          label-width='100%')
    
    span.dialog-footer(slot='footer')
      el-button(@click='handleClose') Cancel
      el-button(type='primary' @click='authNext' :disabled='!allowAuthNext' ) 
        span Next
        i.el-icon-arrow-right
</template>

<script>
import { mapState } from 'vuex'
import { ACTION_TYPES } from '@/constants'
import sleep from 'await-sleep'

const ENTER_MAIL = 1
const ENTER_CODE = 2
const VERIFY = 3

export default {
  name: 'auth-passwordless',
  dependencies: ['$auth', '$error'],
  props: ['show'],

  computed: {
    ...mapState(['usedMails'])
  },

  data () {
    return {
      centerDialogVisible: true,
      authStep: 1,
      allowAuthNext: false,
      auth: {
        email: null,
        code: null
      },
      authRules: {
        email: [
          { required: true, message: 'Please input email address', trigger: 'blur' },
          { type: 'email', message: 'Please input correct email address', trigger: 'blur,change' }
        ],
        code: [
          { required: true, message: 'Please input received code', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    suggestMail (input, cb) {
      const used = [...this.usedMails].map(email => ({ value: email }))
      const result = input ? used.filter(mail => mail.value.startsWith(input.toLowerCase())) : used
      console.log(result)
      cb(result)
    },
    async selectMail (mail) {
      // this.auth.email = mail.value
      // console.log(mail.value)
      await sleep(200)
      this.updateAuthFormAllowance()
      this.authNext()
    },
    updateAuthFormAllowance () {
      if (this.authStep === 1) {
        this.$refs.authForm.validateField('email', error => {
          if (error) {
            this.allowAuthNext = false
          } else {
            this.allowAuthNext = true
          }
        })
      } else if (this.authStep === 2) {
        this.$refs.authForm.validateField('code', error => {
          if (error) {
            console.log(error)
            this.allowAuthNext = false
          } else {
            this.allowAuthNext = true
          }
        })
      }
    },
    authNext () {
      if (this.allowAuthNext) {
        this.authStep++
      }
    },
    async initStep (step, prev) {
      switch (step) {
        case ENTER_MAIL:
          break
        case ENTER_CODE:
          console.log('send mail')
          try {
            this.$store.dispatch(ACTION_TYPES.UsedMail, this.auth.email)
            const result = await this.$auth.sendEmail(this.auth.email)
            console.log(result)
          } catch (err) {
            console.error(err)
            this.authStep--
          }
          break
        case VERIFY:
          console.log('verify code')
          try {
            const result = await this.$auth.verifyEmailCode(this.auth.email, this.auth.code)
            console.log(result)
          } catch (err) {
            this.$error(JSON.stringify(err), true)
            this.handleClose()
          }
          break
      }
      console.log(step)
    },
    handleClose (done) {
      console.log('test')
      this.authStep = 1
      this.auth = {
        email: '',
        code: ''
      }
      this.$emit('close')
    }
  },

  watch: {
    'auth.email': 'updateAuthFormAllowance',
    'auth.code': 'updateAuthFormAllowance',
    'authStep': 'initStep'
  }
}
</script>

<style lang="scss">
.auth-passwordless {
  .el-dialog {
    max-width: 450px;
  }
  .el-dialog__header { display: none }
  .el-dialog__footer { padding-bottom: 15px }
  .el-step__head { line-height: 1.15 }

  .el-steps {
    margin-bottom: 30px;
  }
}
</style>
