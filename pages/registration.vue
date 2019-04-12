<template>
  <div class="d-flex content justify-content-center align-items-center">
    <form>
      <md-card class="md-layout-item card">

        <md-card-header>
          <div class="card-head d-flex align-items-center">
            <div class="container text-center">
              <div class="row">
                <h4 class="col">Registration</h4>
              </div>
            </div>
          </div>
        </md-card-header>

        <md-card-content>
          <div class="container">
            <div class="row">
              <div class="col-6">
                <md-field :class="getValidationClass('username')">
                  <label for="first-name">Email</label>
                  <md-input name="username" id="username" v-model.trim="$v.form.username.$model"
                            :disabled="sending"/>
                  <span class="md-error" v-if="!$v.form.username.required && $v.form.username.$invalid">Email field is required</span>
                  <span class="md-error" v-if="!$v.form.username.email && $v.form.username.$invalid">Incorrect format</span>
                </md-field>
              </div>
              <div class="col-6">

              </div>
            </div>
            <div class="row">
              <div class="col-6">
                <md-field :class="getValidationClass('password')">
                  <label for="first-name">Password</label>
                  <md-input type="password" name="password" id="password"
                            v-model.trim="$v.form.password.$model" :disabled="sending"/>
                  <span class="md-error" v-if="!$v.form.password.required">The password is required</span>
                  <span class="md-error" v-else-if="!$v.form.password.minlength">Min 5 symbols</span>
                </md-field>
              </div>
              <div class="col-6">
                <md-field :class="getValidationClass('password_confirmation')">
                  <label for="password_confirmation">Repeat Password</label>
                  <md-input type="password" name="password_confirmation" id="password_confirmation"
                            v-model.trim="$v.form.password_confirmation.$model" :disabled="sending"/>
                  <span class="md-error" v-if="!$v.form.password_confirmation.required">Please, repeat the password</span>
                  <span class="md-error" v-else-if="!$v.form.password_confirmation.sameAs">Passwords are mismatch</span>
                </md-field>
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-center">
            <div class="col-6">
              <croppa v-model.trim="$v.form.img.$model"
                      :quality="1"
                      :prevent-white-space="true"
              >
              </croppa>
            </div>
          </div>

          <div class="d-flex justify-content-center">
            <div class="col-6">
              <md-field :class="getValidationClass('char_name')">
                <label for="charName">Pet Name</label>
                <md-input name="charName" id="charName" autocomplete="charName"
                          v-model.trim="$v.form.char_name.$model" :disabled="sending"/>
                <span class="md-error" v-if="!$v.form.char_name.required && $v.form.char_name.$invalid">Name field is required</span>
              </md-field>
            </div>
          </div>

          <div class="container" v-if="error">
            <div class="row">
              <div class="col text-danger text-center">
                {{error}}
              </div>
            </div>
          </div>
        </md-card-content>

        <md-card-actions class="d-flex p-2 justify-content-between">
          <md-button :disabled="sending" v-on:click="() => $router.replace({ path: '/login' })" class="ml-3 nav-btns">Login</md-button>
          <md-button :disabled="sending" class="mr-3 nav-btns" v-on:click="store()">Go</md-button>
        </md-card-actions>

      </md-card>
    </form>

  </div>

</template>
<script>

  import {mapGetters, mapActions} from 'vuex';
  import {
    required,
    email,
    minLength,
    sameAs
  } from 'vuelidate/lib/validators'

  export default {
    middleware: 'unauthenticated',
    name: 'Registration',
    data: () => ({
      form: {
        username: null,
        password: null,
        password_confirmation: null,
        char_name: null,
        img: null,
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
        username: {
          required,
          email,
        },
        password: {
          required,
          minLength: minLength(5)
        },
        password_confirmation: {
          required,
          sameAs: sameAs('password'),
        },
        char_name: {
          required
        },
        img: {},
      }
    },

    mounted() {
      this.setError(null);
    },

    methods: {
      ...mapActions('auth', ['register']),
      ...mapActions('application', ['setError']),

      getValidationClass(fieldName) {
        const field = this.$v.form[fieldName];
        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },

      async store() {
        this.$v.$touch();
        if (this.$v.$invalid) return;

        const data = new FormData;

        data.append('password', this.form.password);
        data.append('password_confirmation', this.form.password_confirmation);
        data.append('username', this.form.username);
        data.append('char_name', this.form.char_name);
        this.form.img.generateBlob((blob) => {
          data.append('img', blob);
        });

        this.setError(null);
        this.sending = true;
        await this.register(data);
        (this.error) ? this.sending = false : this.$router.replace({ path: '/' });
      }
    }

  }

</script>

<style lang="scss" scoped>
  .card {
    max-width: 750px;
    min-width: 370px;
  }
</style>
