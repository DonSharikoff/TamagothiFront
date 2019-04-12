<template src="./login.html"></template>
<script>
  import  {mapGetters, mapActions} from 'vuex';
  import {
    required,
    email,
    minLength
  } from 'vuelidate/lib/validators'

  export default {
    middleware: 'unauthenticated',
    name: 'Login',
    data: () => ({
      form: {
        email: null,
        password: null
      },
      sending: false
    }),

    computed: {
      ...mapGetters({
        error: 'application/error',
      })
    },

    validations: {
      form: {
        email: {
          required,
          email
        },
        password: {
          required,
          minLength: minLength(5)
        },
      }
    },

    mounted() {
      this.setError(null);
    },

    methods: {
      ...mapActions('auth', ['login']),
      ...mapActions('application', ['setError']),

      getValidationClass(fieldName) {
        const field = this.$v.form[fieldName];
        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
      async getLogin() {
        this.$v.$touch();
        if (this.$v.$invalid) return;

        this.setError(null);
        this.sending = true;
        await this.login({username: this.form.email, password: this.form.password});
        (this.error) ? this.sending = false : this.$router.replace({ path: '/' });
      },
    }

  }

</script>

<style>
  .card {
    max-width: 450px;
    min-width: 300px;
  }
</style>
