<template lang="pug">
  el-dialog(
    :visible.sync='show'
    width='50%'
    center=''
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
      el-form-item(
        prop='email'
        v-if='authStep === 1'
        label='Enter your email to sign in or create an account' 
        label-width='100%'
        @keydown.enter.prevent="true"
        :rules="authRules.email")
        el-input(
          v-model='auth.email' 
          @keyup.enter.native='allowAuthNext ? authNext() : null')
          template(slot="prepend")
            i(class="el-icon-message")

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
const ENTER_MAIL = 1
const ENTER_CODE = 2
const VERIFY = 3

export default {
  name: 'auth-passwordless',
  dependencies: ['$auth'],
  props: ['show'],

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
            console.error(err)
            this.authStep--
          }
          break
      }
      console.log(step)
    },
    handleClose (done) {
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
  .el-dialog__header { display: none }
  .el-dialog__footer { padding-bottom: 15px }
  .el-step__head { line-height: 1.15 }

  .el-steps {
    margin-bottom: 30px;
  }
}
</style>
